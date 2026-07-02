import * as THREE from "three";

const stage = document.getElementById("stage");
const renderHost = document.getElementById("renderHost");
const modeLabel = document.getElementById("modeLabel");
const hintLabel = document.getElementById("hintLabel");
const resetButton = document.getElementById("resetButton");
const handCursor = document.getElementById("handCursor");
const videoElement = document.getElementById("inputVideo");
const cameraPreview = document.getElementById("cameraPreview");
const cameraBadge = document.getElementById("cameraBadge");

const COLORS = {
  cyan: 0x78f3ff,
  cyanSoft: 0x46d8ff,
  violet: 0x7e65ff,
  white: 0xf4fdff,
  ghost: 0x285f82,
};

const STATE_COPY = {
  idle: { label: "普通", hint: "指向入口" },
  singlePath: { label: "普通", hint: "一次尝试一条路" },
  multiPath: { label: "多路径", hint: "同时看见更多可能" },
  collapse: { label: "收敛", hint: "排除干扰" },
  complete: { label: "完成", hint: "找到最优路径" },
};

const ENTRANCE_CURSOR = { x: 0.19, y: 0.77 };
const EXIT_CURSOR = { x: 0.83, y: 0.23 };
const GESTURE_HOLD_MS = 400;

let state = "idle";
let pendingState = null;
let pendingStartedAt = 0;
let singleProgress = 0;
let completeStartedAt = -1000;
let lastHandSeenAt = 0;
let rawGesture = null;

const cursorTarget = { ...ENTRANCE_CURSOR };
const cursor = { ...ENTRANCE_CURSOR };

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  powerPreference: "high-performance",
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setClearColor(0x020611, 0);
renderHost.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-6.7, 6.7, 5.05, -5.05, 0.1, 80);
camera.position.set(0, 0, 20);
camera.lookAt(0, 0, 0);

const mazeGroup = new THREE.Group();
scene.add(mazeGroup);

const glowTexture = createGlowTexture();
const routes = [];
const routeGroup = new THREE.Group();
const nodeGroup = new THREE.Group();
const effectsGroup = new THREE.Group();
mazeGroup.add(routeGroup, nodeGroup, effectsGroup);

const nodes = {
  start: new THREE.Vector3(-4.32, -2.74, 0),
  a: new THREE.Vector3(-3.1, -2.05, 0.08),
  b: new THREE.Vector3(-2.25, -0.55, -0.03),
  c: new THREE.Vector3(-3.06, 1.08, 0.12),
  d: new THREE.Vector3(-1.28, 2.05, 0),
  e: new THREE.Vector3(0.05, 0.44, 0.05),
  f: new THREE.Vector3(1.66, 1.54, -0.04),
  g: new THREE.Vector3(0.9, -1.55, 0.12),
  h: new THREE.Vector3(2.72, -1.05, 0.02),
  i: new THREE.Vector3(2.7, 2.45, 0.1),
  j: new THREE.Vector3(-0.95, -2.72, -0.08),
  k: new THREE.Vector3(3.64, 0.72, 0.06),
  exit: new THREE.Vector3(4.42, 2.72, 0),
};

const routeDefs = [
  ["start", "a", "b", "e", "f", "i", "exit"],
  ["start", "j", "g", "h", "k", "exit"],
  ["start", "a", "c", "d", "f", "i", "exit"],
  ["start", "j", "e", "k", "i", "exit"],
  ["start", "a", "b", "g", "h", "k"],
  ["start", "a", "c", "e", "g", "h"],
  ["start", "j", "g", "e", "f", "exit"],
];

createScene();
resizeRenderer();
setState("idle");
setupMediaPipe();
requestAnimationFrame(animate);

window.addEventListener("resize", resizeRenderer);
resetButton.addEventListener("click", resetChallenge);
window.addEventListener("keydown", handleKeyboard);

window.quantumMazeGestures = {
  isPointing,
  isOpenPalm,
  isFist,
  isPinching,
};

function createScene() {
  createStarField();
  createSoftGrid();
  createRoutes();
  createNodes();
  createExitEffects();
}

function createStarField() {
  const starCount = 520;
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  const color = new THREE.Color();

  for (let i = 0; i < starCount; i += 1) {
    const index = i * 3;
    positions[index] = THREE.MathUtils.randFloatSpread(14);
    positions[index + 1] = THREE.MathUtils.randFloatSpread(9.6);
    positions[index + 2] = THREE.MathUtils.randFloat(-4, -1.5);
    color.set(i % 7 === 0 ? COLORS.violet : COLORS.cyanSoft);
    const intensity = THREE.MathUtils.randFloat(0.22, 0.76);
    colors[index] = color.r * intensity;
    colors[index + 1] = color.g * intensity;
    colors[index + 2] = color.b * intensity;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({
    size: 0.025,
    map: glowTexture,
    transparent: true,
    opacity: 0.34,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const stars = new THREE.Points(geometry, material);
  stars.name = "soft star dust";
  scene.add(stars);
}

function createSoftGrid() {
  const lines = [];
  const width = 12.2;
  const height = 7.8;
  const step = 0.7;

  for (let x = -width / 2; x <= width / 2; x += step) {
    lines.push(new THREE.Vector3(x, -height / 2, -1.35), new THREE.Vector3(x, height / 2, -1.35));
  }

  for (let y = -height / 2; y <= height / 2; y += step) {
    lines.push(new THREE.Vector3(-width / 2, y, -1.35), new THREE.Vector3(width / 2, y, -1.35));
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(lines);
  const material = new THREE.LineBasicMaterial({
    color: COLORS.cyanSoft,
    transparent: true,
    opacity: 0.055,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const grid = new THREE.LineSegments(geometry, material);
  grid.scale.y = 0.82;
  mazeGroup.add(grid);
}

function createRoutes() {
  routeDefs.forEach((keys, routeIndex) => {
    const points = keys.map((key) => nodes[key].clone());
    const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.42);
    const samples = 156;
    const positions = new Float32Array(samples * 3);
    const basePositions = new Float32Array(samples * 3);

    for (let i = 0; i < samples; i += 1) {
      const point = curve.getPoint(i / (samples - 1));
      const index = i * 3;
      basePositions[index] = point.x;
      basePositions[index + 1] = point.y;
      basePositions[index + 2] = point.z + THREE.MathUtils.randFloatSpread(0.08);
      positions[index] = basePositions[index];
      positions[index + 1] = basePositions[index + 1];
      positions[index + 2] = basePositions[index + 2];
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      size: routeIndex === 0 ? 0.056 : 0.044,
      map: glowTexture,
      color: routeIndex === 0 ? COLORS.cyan : COLORS.cyanSoft,
      transparent: true,
      opacity: 0.04,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);

    const linePoints = curve.getPoints(88);
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: routeIndex === 0 ? COLORS.cyan : COLORS.violet,
      transparent: true,
      opacity: 0.02,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const line = new THREE.Line(lineGeometry, lineMaterial);

    const travelers = Array.from({ length: routeIndex === 0 ? 4 : 3 }, (_, travelerIndex) =>
      createTraveler(routeIndex, travelerIndex)
    );

    routeGroup.add(line, particles, ...travelers);
    routes.push({
      index: routeIndex,
      curve,
      particles,
      particleGeometry,
      particleMaterial,
      line,
      lineMaterial,
      basePositions,
      positions,
      samples,
      travelers,
      level: 0,
      jitterSeed: Math.random() * 100,
    });
  });
}

function createTraveler(routeIndex, travelerIndex) {
  const material = new THREE.SpriteMaterial({
    map: glowTexture,
    color: routeIndex === 0 ? COLORS.white : COLORS.cyanSoft,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(material);
  const scale = routeIndex === 0 && travelerIndex === 0 ? 0.56 : 0.38;
  sprite.scale.set(scale, scale, scale);
  sprite.userData = {
    offset: travelerIndex * 0.31 + routeIndex * 0.07,
    baseScale: scale,
  };
  return sprite;
}

function createNodes() {
  const nodeEntries = Object.entries(nodes);

  nodeEntries.forEach(([key, position]) => {
    const isTerminal = key === "start" || key === "exit";
    const node = new THREE.Group();
    node.position.copy(position);

    const coreMaterial = new THREE.SpriteMaterial({
      map: glowTexture,
      color: key === "exit" ? COLORS.white : COLORS.cyan,
      transparent: true,
      opacity: isTerminal ? 0.92 : 0.42,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const core = new THREE.Sprite(coreMaterial);
    const coreScale = isTerminal ? 0.58 : 0.28;
    core.scale.set(coreScale, coreScale, coreScale);

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: isTerminal ? COLORS.cyan : COLORS.violet,
      transparent: true,
      opacity: isTerminal ? 0.28 : 0.1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.23, isTerminal ? 0.38 : 0.29, 64), ringMaterial);
    ring.userData = { baseScale: isTerminal ? 1 : 0.76 };

    node.add(ring, core);
    node.userData = { key, core, ring, isTerminal };
    nodeGroup.add(node);
  });
}

function createExitEffects() {
  const ringSpecs = [
    { inner: 0.5, outer: 0.54, delay: 0 },
    { inner: 0.82, outer: 0.86, delay: 0.18 },
    { inner: 1.15, outer: 1.2, delay: 0.34 },
  ];

  ringSpecs.forEach((spec) => {
    const material = new THREE.MeshBasicMaterial({
      color: COLORS.cyan,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(new THREE.RingGeometry(spec.inner, spec.outer, 96), material);
    ring.position.copy(nodes.exit);
    ring.userData = { delay: spec.delay };
    effectsGroup.add(ring);
  });

  const flashMaterial = new THREE.SpriteMaterial({
    map: glowTexture,
    color: COLORS.white,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const flash = new THREE.Sprite(flashMaterial);
  flash.position.copy(nodes.exit);
  flash.scale.set(2.2, 2.2, 2.2);
  flash.name = "completion flash";
  effectsGroup.add(flash);
}

function createGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.2, "rgba(160,247,255,0.86)");
  gradient.addColorStop(0.48, "rgba(70,217,255,0.22)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function animate(timeMs) {
  const time = timeMs * 0.001;
  updateCursor();
  updateRoutes(time);
  updateNodes(time);
  updateCompletionEffects(timeMs);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function updateRoutes(time) {
  routes.forEach((route) => {
    const targetLevel = getTargetLevel(route.index);
    route.level += (targetLevel - route.level) * 0.045;

    route.lineMaterial.opacity = 0.025 + route.level * (route.index === 0 ? 0.32 : 0.18);
    route.particleMaterial.opacity = 0.035 + route.level * (route.index === 0 ? 0.82 : 0.46);
    route.particleMaterial.size = (route.index === 0 ? 0.045 : 0.037) + route.level * 0.026;

    const positionAttribute = route.particleGeometry.getAttribute("position");
    for (let i = 0; i < route.samples; i += 1) {
      const index = i * 3;
      const ripple = Math.sin(time * 2.5 + i * 0.18 + route.jitterSeed) * 0.024 * route.level;
      const lift = Math.cos(time * 1.7 + i * 0.11 + route.jitterSeed) * 0.018 * route.level;
      route.positions[index] = route.basePositions[index];
      route.positions[index + 1] = route.basePositions[index + 1] + ripple;
      route.positions[index + 2] = route.basePositions[index + 2] + lift;
    }
    positionAttribute.needsUpdate = true;

    updateTravelers(route, time);
  });
}

function getTargetLevel(routeIndex) {
  if (state === "idle") {
    return routeIndex === 0 ? 0.14 : 0.045;
  }

  if (state === "singlePath") {
    return routeIndex === 0 ? 1 : 0.035;
  }

  if (state === "multiPath") {
    const levels = [0.72, 0.52, 0.5, 0.46, 0.34, 0.31, 0.42];
    return levels[routeIndex] || 0.34;
  }

  if (state === "collapse") {
    const levels = [1, 0.12, 0.2, 0.16, 0.015, 0.02, 0.34];
    return levels[routeIndex] || 0.02;
  }

  if (state === "complete") {
    const levels = [1, 0.72, 0.62, 0.68, 0.18, 0.16, 0.76];
    return levels[routeIndex] || 0.52;
  }

  return 0;
}

function updateTravelers(route, time) {
  const isCore = route.index === 0;
  const completionAge = Math.max(0, performance.now() - completeStartedAt);
  const completeSweep = state === "complete" ? Math.min(1, completionAge / 1050) : 0;

  route.travelers.forEach((sprite, travelerIndex) => {
    let progress = (time * (isCore ? 0.06 : 0.035) + sprite.userData.offset) % 1;

    if (state === "idle") {
      progress = ENTRANCE_CURSOR.x * 0.2;
    }

    if (state === "singlePath") {
      progress = isCore ? singleProgress : 0;
    }

    if (state === "complete") {
      const start = (sprite.userData.offset + travelerIndex * 0.08) % 1;
      progress = THREE.MathUtils.lerp(start, 1, completeSweep);
    }

    const point = route.curve.getPoint(Math.min(0.995, Math.max(0.005, progress)));
    const float = Math.sin(time * 3 + travelerIndex) * 0.035;
    sprite.position.set(point.x, point.y + float, point.z + 0.24 + travelerIndex * 0.015);
    const scale = sprite.userData.baseScale * (1 + route.level * 0.5);
    sprite.scale.set(scale, scale, scale);
    sprite.material.opacity = route.level * (isCore ? 0.78 : 0.44);

    if (state === "singlePath" && (!isCore || travelerIndex > 0)) {
      sprite.material.opacity = 0;
    }

    if (state === "collapse" && ![0, 2, 3, 6].includes(route.index)) {
      sprite.material.opacity *= 0.12;
    }
  });

  if (state === "singlePath") {
    singleProgress = Math.min(0.985, singleProgress + 0.0015);
  }
}

function updateNodes(time) {
  nodeGroup.children.forEach((node) => {
    const { key, core, ring, isTerminal } = node.userData;
    const pulse = 1 + Math.sin(time * (isTerminal ? 2.4 : 1.7) + node.position.x) * (isTerminal ? 0.08 : 0.05);
    ring.rotation.z += isTerminal ? 0.006 : 0.0025;
    ring.scale.setScalar(ring.userData.baseScale * pulse);

    if (key === "start") {
      core.material.opacity = state === "idle" ? 0.76 : 0.96;
      core.scale.setScalar(state === "idle" ? 0.5 : 0.72 + Math.sin(time * 3) * 0.04);
      ring.material.opacity = state === "idle" ? 0.23 : 0.42;
    } else if (key === "exit") {
      const exitBoost = state === "complete" ? 1 : state === "collapse" ? 0.64 : 0.28;
      core.material.opacity = 0.72 + exitBoost * 0.26;
      core.scale.setScalar(0.62 + exitBoost * 0.28 + Math.sin(time * 4) * 0.035);
      ring.material.opacity = 0.24 + exitBoost * 0.32;
    } else {
      core.material.opacity = state === "multiPath" ? 0.55 : state === "collapse" ? 0.38 : 0.28;
      ring.material.opacity = state === "multiPath" ? 0.16 : 0.09;
    }
  });
}

function updateCompletionEffects(timeMs) {
  const age = timeMs - completeStartedAt;
  const active = state === "complete" && age >= 0;

  effectsGroup.children.forEach((effect) => {
    if (effect.name === "completion flash") {
      const flashAge = Math.max(0, age);
      const flash = active ? Math.max(0, 1 - flashAge / 980) : 0;
      effect.material.opacity = flash * 0.9;
      const scale = 1.2 + flashAge / 350;
      effect.scale.setScalar(scale);
      return;
    }

    const delayMs = effect.userData.delay * 1000;
    const ringAge = Math.max(0, age - delayMs);
    const wave = active ? Math.max(0, 1 - ringAge / 1550) : 0;
    effect.material.opacity = wave * 0.36;
    effect.scale.setScalar(0.74 + ringAge / 620);
    effect.rotation.z += 0.01;
  });

  const shake = active ? Math.max(0, 1 - age / 760) : 0;
  mazeGroup.position.x = Math.sin(timeMs * 0.035) * 0.035 * shake;
  mazeGroup.position.y = Math.cos(timeMs * 0.029) * 0.03 * shake;
}

function updateCursor() {
  cursor.x += (cursorTarget.x - cursor.x) * 0.18;
  cursor.y += (cursorTarget.y - cursor.y) * 0.18;
  handCursor.style.left = `${cursor.x * 100}%`;
  handCursor.style.top = `${cursor.y * 100}%`;

  const hasRecentHand = performance.now() - lastHandSeenAt < 900;
  handCursor.style.opacity = hasRecentHand || rawGesture === "keyboard" ? "0.9" : "0.62";
}

function setState(nextState) {
  if (!STATE_COPY[nextState] || state === nextState) {
    return;
  }

  stage.classList.remove(state);
  state = nextState;
  stage.classList.add(state);
  modeLabel.textContent = STATE_COPY[state].label;
  hintLabel.textContent = STATE_COPY[state].hint;
  pendingState = null;

  if (state === "singlePath") {
    singleProgress = 0;
    cursorTarget.x = ENTRANCE_CURSOR.x;
    cursorTarget.y = ENTRANCE_CURSOR.y;
  }

  if (state === "multiPath") {
    singleProgress = Math.max(singleProgress, 0.44);
  }

  if (state === "collapse") {
    singleProgress = Math.max(singleProgress, 0.7);
  }

  if (state === "complete") {
    completeStartedAt = performance.now();
    cursorTarget.x = EXIT_CURSOR.x;
    cursorTarget.y = EXIT_CURSOR.y;
  }
}

function resetChallenge() {
  singleProgress = 0;
  completeStartedAt = -1000;
  cursorTarget.x = ENTRANCE_CURSOR.x;
  cursorTarget.y = ENTRANCE_CURSOR.y;
  setState("idle");
  modeLabel.textContent = STATE_COPY.idle.label;
  hintLabel.textContent = STATE_COPY.idle.hint;
}

function handleKeyboard(event) {
  const key = event.key.toLowerCase();
  rawGesture = "keyboard";

  if (key === "1") {
    cursorTarget.x = ENTRANCE_CURSOR.x;
    cursorTarget.y = ENTRANCE_CURSOR.y;
    setState("singlePath");
  } else if (key === "2") {
    cursorTarget.x = 0.48;
    cursorTarget.y = 0.48;
    setState("multiPath");
  } else if (key === "3") {
    cursorTarget.x = 0.62;
    cursorTarget.y = 0.36;
    setState("collapse");
  } else if (key === "4") {
    cursorTarget.x = EXIT_CURSOR.x;
    cursorTarget.y = EXIT_CURSOR.y;
    setState("complete");
  } else if (key === "r") {
    resetChallenge();
  }
}

async function setupMediaPipe() {
  if (!navigator.mediaDevices?.getUserMedia || !window.Hands || !window.Camera) {
    cameraBadge.textContent = "KEY";
    return;
  }

  try {
    const hands = new window.Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.65,
      minTrackingConfidence: 0.62,
    });

    hands.onResults(onHandResults);

    const mpCamera = new window.Camera(videoElement, {
      width: 320,
      height: 240,
      onFrame: async () => {
        await hands.send({ image: videoElement });
      },
    });

    await mpCamera.start();
    cameraPreview.classList.add("camera-on");
    cameraBadge.textContent = "CAM";
  } catch (error) {
    console.warn("MediaPipe camera unavailable. Keyboard fallback remains active.", error);
    cameraBadge.textContent = "KEY";
  }
}

function onHandResults(results) {
  const landmarks = results.multiHandLandmarks?.[0];
  if (!landmarks) {
    rawGesture = null;
    return;
  }

  lastHandSeenAt = performance.now();

  const cursorLandmark = landmarks[8];
  cursorTarget.x = clamp(1 - cursorLandmark.x, 0.03, 0.97);
  cursorTarget.y = clamp(cursorLandmark.y, 0.05, 0.93);

  const gesture = detectGesture(landmarks);
  rawGesture = gesture;
  updateStateFromGesture(gesture);
}

function detectGesture(landmarks) {
  if (isPinching(landmarks)) {
    return "pinch";
  }

  if (isOpenPalm(landmarks)) {
    return "openPalm";
  }

  if (isFist(landmarks)) {
    return "fist";
  }

  if (isPointing(landmarks)) {
    return "pointing";
  }

  return null;
}

function updateStateFromGesture(gesture) {
  const now = performance.now();
  const nextState = getStateForGesture(gesture);

  if (!nextState || nextState === state || state === "complete") {
    pendingState = null;
    return;
  }

  if (pendingState !== nextState) {
    pendingState = nextState;
    pendingStartedAt = now;
    return;
  }

  if (now - pendingStartedAt >= GESTURE_HOLD_MS) {
    setState(nextState);
  }
}

function getStateForGesture(gesture) {
  if (gesture === "pointing") {
    return distance2D(cursorTarget, ENTRANCE_CURSOR) < 0.23 ? "singlePath" : null;
  }

  if (gesture === "openPalm") {
    return "multiPath";
  }

  if (gesture === "fist") {
    return "collapse";
  }

  if (gesture === "pinch") {
    return distance2D(cursorTarget, EXIT_CURSOR) < 0.2 ? "complete" : null;
  }

  return null;
}

function isPointing(landmarks) {
  const indexExtended = fingerExtended(landmarks, 8, 6, 5);
  const middleExtended = fingerExtended(landmarks, 12, 10, 9);
  const ringExtended = fingerExtended(landmarks, 16, 14, 13);
  const pinkyExtended = fingerExtended(landmarks, 20, 18, 17);
  const indexAway = distance3D(landmarks[8], landmarks[0]) > distance3D(landmarks[6], landmarks[0]) * 1.14;

  return indexExtended && indexAway && !middleExtended && !ringExtended && !pinkyExtended;
}

function isOpenPalm(landmarks) {
  const indexExtended = fingerExtended(landmarks, 8, 6, 5);
  const middleExtended = fingerExtended(landmarks, 12, 10, 9);
  const ringExtended = fingerExtended(landmarks, 16, 14, 13);
  const pinkyExtended = fingerExtended(landmarks, 20, 18, 17);
  const palmWidth = distance3D(landmarks[5], landmarks[17]);
  const thumbSpread = distance3D(landmarks[4], landmarks[9]) > palmWidth * 0.72;
  const fingerSpread = distance3D(landmarks[8], landmarks[20]) > palmWidth * 1.25;

  return indexExtended && middleExtended && ringExtended && pinkyExtended && thumbSpread && fingerSpread;
}

function isFist(landmarks) {
  const curledFingers = [
    !fingerExtended(landmarks, 8, 6, 5),
    !fingerExtended(landmarks, 12, 10, 9),
    !fingerExtended(landmarks, 16, 14, 13),
    !fingerExtended(landmarks, 20, 18, 17),
  ];
  const palmWidth = distance3D(landmarks[5], landmarks[17]);
  const tipsNearPalm =
    distance3D(landmarks[8], landmarks[0]) < palmWidth * 2.15 &&
    distance3D(landmarks[12], landmarks[0]) < palmWidth * 2.1 &&
    distance3D(landmarks[16], landmarks[0]) < palmWidth * 2.05 &&
    distance3D(landmarks[20], landmarks[0]) < palmWidth * 2.05;

  return curledFingers.filter(Boolean).length >= 3 && tipsNearPalm;
}

function isPinching(landmarks) {
  const palmWidth = distance3D(landmarks[5], landmarks[17]);
  return distance3D(landmarks[4], landmarks[8]) < palmWidth * 0.42;
}

function fingerExtended(landmarks, tipIndex, pipIndex, mcpIndex) {
  const wrist = landmarks[0];
  const tip = landmarks[tipIndex];
  const pip = landmarks[pipIndex];
  const mcp = landmarks[mcpIndex];
  const verticalLift = tip.y < pip.y - 0.018;
  const radialReach = distance3D(tip, wrist) > distance3D(pip, wrist) * 1.05;
  const mcpReach = distance3D(tip, wrist) > distance3D(mcp, wrist) * 1.16;

  return verticalLift && radialReach && mcpReach;
}

function distance3D(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = (a.z || 0) - (b.z || 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function distance2D(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function resizeRenderer() {
  const rect = renderHost.getBoundingClientRect();
  renderer.setSize(rect.width, rect.height, false);

  const aspect = rect.width / rect.height;
  const viewHeight = 10.1;
  const viewWidth = viewHeight * aspect;
  camera.left = -viewWidth / 2;
  camera.right = viewWidth / 2;
  camera.top = viewHeight / 2;
  camera.bottom = -viewHeight / 2;
  camera.updateProjectionMatrix();
}
