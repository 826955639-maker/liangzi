import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";

export type CreationResult = "alive" | "dead";

export type CreationSceneHandle = {
  beginMeasurement: () => void;
  updateProgress: (progress: number) => void;
  collapse: (result: CreationResult) => void;
  reset: () => void;
};

type Particle = {
  currentPos: THREE.Vector3;
  targetPos: THREE.Vector3;
  velocity: THREE.Vector3;
  currentColor: THREE.Color;
  aliveTarget: THREE.Vector3;
  deadTarget: THREE.Vector3;
  superTarget: THREE.Vector3;
  randomPhase: number;
};

const PARTICLE_COUNT = 4000;
const BOX_SIZE = 3.6;

function generateTarget(index: number, shape: "alive" | "dead" | "superposition", target = new THREE.Vector3()) {
  target.set(0, 0, 0);

  if (shape === "alive") {
    if (index < PARTICLE_COUNT * 0.32) {
      const step = index / (PARTICLE_COUNT * 0.32);
      const x = -0.7 + step * 1.6;
      const y = -0.55 + 1.6 * Math.pow(step, 1.4);
      const radius = 0.38 * (1 - 0.35 * Math.abs(step - 0.5));
      const angle = Math.random() * Math.PI * 2;
      target.set(x - 0.1, y + Math.cos(angle) * radius, Math.sin(angle) * radius);
    } else if (index < PARTICLE_COUNT * 0.52) {
      const step = index - PARTICLE_COUNT * 0.32;
      const ratio = step / (PARTICLE_COUNT * 0.2);
      const theta = ratio * Math.PI;
      const phi = ratio * Math.PI * 24;
      const radius = 0.35;
      target.set(
        -1.05 + Math.sin(theta) * Math.cos(phi) * radius,
        -0.45 + Math.cos(theta) * radius,
        Math.sin(theta) * Math.sin(phi) * radius,
      );
    } else if (index < PARTICLE_COUNT * 0.62) {
      const step = index - PARTICLE_COUNT * 0.52;
      const ear = step % 2;
      const ratio = (step / (PARTICLE_COUNT * 0.1)) * 2;
      const width = 0.15 * (1 - ratio);
      target.set(
        -1.08 + (Math.random() - 0.5) * width,
        -0.15 + ratio * 0.38,
        (ear === 0 ? -0.18 : 0.18) + (Math.random() - 0.5) * width,
      );
    } else if (index < PARTICLE_COUNT * 0.76) {
      const step = index - PARTICLE_COUNT * 0.62;
      const leg = step % 2;
      const ratio = step / (PARTICLE_COUNT * 0.14);
      target.set(
        -0.7 - ratio * 1.05,
        -0.6 - ratio * 0.55,
        (leg === 0 ? -0.22 : 0.22) + (Math.random() - 0.5) * 0.07,
      );
    } else if (index < PARTICLE_COUNT * 0.9) {
      const step = index - PARTICLE_COUNT * 0.76;
      const leg = step % 2;
      const ratio = step / (PARTICLE_COUNT * 0.14);
      target.set(
        0.9 + ratio * 0.12,
        1.05 - ratio * 2.15,
        (leg === 0 ? -0.25 : 0.25) + (Math.random() - 0.5) * 0.07,
      );
    } else {
      const ratio = (index - PARTICLE_COUNT * 0.9) / (PARTICLE_COUNT * 0.1);
      target.set(
        0.9 + ratio * 0.55 + Math.sin(ratio * Math.PI) * 0.12,
        1.05 + ratio * 1.15 + Math.cos(ratio * Math.PI) * 0.15,
        Math.sin(ratio * Math.PI * 1.5) * 0.12,
      );
    }
  } else if (shape === "dead") {
    if (index < PARTICLE_COUNT * 0.6) {
      const angle = (index / (PARTICLE_COUNT * 0.6)) * Math.PI * 1.7;
      const ratio = (index % 12) / 12;
      const radius = 1 - ratio * 0.32;
      target.set(
        Math.cos(angle) * radius - 0.1,
        -0.8 + Math.sin(angle) * 0.4 * (1 - ratio * 0.2),
        (Math.random() - 0.5) * 0.5,
      );
    } else if (index < PARTICLE_COUNT * 0.8) {
      const ratio = (index - PARTICLE_COUNT * 0.6) / (PARTICLE_COUNT * 0.2);
      const theta = ratio * Math.PI;
      const phi = ratio * Math.PI * 16;
      const radius = 0.3;
      target.set(
        -1 + Math.sin(theta) * Math.cos(phi) * radius,
        -0.65 + Math.cos(theta) * radius,
        Math.sin(theta) * Math.sin(phi) * radius,
      );
    } else {
      const ratio = (index - PARTICLE_COUNT * 0.8) / (PARTICLE_COUNT * 0.2);
      const angle = ratio * Math.PI * 2;
      target.set(
        Math.cos(angle) * 2.1,
        -0.3 + Math.sin(angle * 2) * 0.3,
        Math.sin(angle) * 2.1,
      );
    }
  } else {
    const radius = 1.4 + Math.random();
    const theta = Math.acos(2 * Math.random() - 1);
    const phi = Math.random() * Math.PI * 2;
    target.set(
      radius * Math.sin(theta) * Math.cos(phi),
      radius * Math.sin(theta) * Math.sin(phi),
      radius * Math.cos(theta),
    );
  }

  return target;
}

const CreationScene = forwardRef<CreationSceneHandle>(function CreationScene(_, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<CreationSceneHandle | null>(null);

  useImperativeHandle(ref, () => ({
    beginMeasurement: () => apiRef.current?.beginMeasurement(),
    updateProgress: (progress) => apiRef.current?.updateProgress(progress),
    collapse: (result) => apiRef.current?.collapse(result),
    reset: () => apiRef.current?.reset(),
  }), []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06070c, 0.12);
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0.15, 7.3);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute("aria-hidden", "true");
    container.appendChild(renderer.domElement);

    const textureCanvas = document.createElement("canvas");
    textureCanvas.width = 64;
    textureCanvas.height = 64;
    const textureContext = textureCanvas.getContext("2d");
    if (textureContext) {
      const gradient = textureContext.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.2, "rgba(168,85,247,.9)");
      gradient.addColorStop(0.6, "rgba(99,102,241,.3)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      textureContext.fillStyle = gradient;
      textureContext.fillRect(0, 0, 64, 64);
    }
    const particleTexture = new THREE.CanvasTexture(textureCanvas);

    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const particles: Particle[] = [];
    for (let index = 0; index < PARTICLE_COUNT; index += 1) {
      const x = (Math.random() - 0.5) * 6;
      const y = (Math.random() - 0.5) * 6;
      const z = (Math.random() - 0.5) * 6;
      positions[index * 3] = x;
      positions[index * 3 + 1] = y;
      positions[index * 3 + 2] = z;
      colors[index * 3] = 0.6;
      colors[index * 3 + 1] = 0.3;
      colors[index * 3 + 2] = 0.9;
      const superTarget = generateTarget(index, "superposition");
      particles.push({
        currentPos: new THREE.Vector3(x, y, z),
        targetPos: superTarget.clone(),
        velocity: new THREE.Vector3(),
        currentColor: new THREE.Color(0.6, 0.3, 0.9),
        aliveTarget: generateTarget(index, "alive"),
        deadTarget: generateTarget(index, "dead"),
        superTarget,
        randomPhase: Math.random() * Math.PI * 2,
      });
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.18,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    const boxFrame = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(BOX_SIZE, BOX_SIZE, BOX_SIZE)),
      new THREE.LineBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.3 }),
    );
    scene.add(boxFrame);

    const flask = new THREE.Group();
    const flaskMaterial = new THREE.LineBasicMaterial({ color: 0xeab308, transparent: true, opacity: 0.4 });
    flask.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.3, 0.3, 0.6, 8)),
      flaskMaterial,
    ));
    const neck = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.12, 0.12, 0.3, 6)),
      flaskMaterial,
    );
    neck.position.y = 0.45;
    flask.add(neck);

    const bubblePositions = new Float32Array(90);
    for (let index = 0; index < 30; index += 1) {
      bubblePositions[index * 3] = (Math.random() - 0.5) * 0.4;
      bubblePositions[index * 3 + 1] = -0.2 + Math.random() * 0.5;
      bubblePositions[index * 3 + 2] = (Math.random() - 0.5) * 0.4;
    }
    const bubbleGeometry = new THREE.BufferGeometry();
    bubbleGeometry.setAttribute("position", new THREE.BufferAttribute(bubblePositions, 3));
    const bubbles = new THREE.Points(
      bubbleGeometry,
      new THREE.PointsMaterial({ size: 0.08, color: 0xf59e0b, transparent: true, opacity: 0.8 }),
    );
    flask.add(bubbles);
    flask.position.set(0.9, -0.6, 0.5);
    scene.add(flask);

    const visualState = {
      experiment: "A" as "A" | "B" | "C",
      progress: 0,
      result: null as CreationResult | null,
    };
    const measuringColor = new THREE.Color(1, 0.8, 1);
    const alivePrimary = new THREE.Color(0, 1, 0.6);
    const aliveSecondary = new THREE.Color(1, 0.85, 0.2);
    const deadPrimary = new THREE.Color(0.6, 0.2, 1);
    const deadSecondary = new THREE.Color(0.2, 0.5, 1);

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
    };
    resize();
    window.addEventListener("resize", resize);
    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);
    resizeObserver?.observe(container);

    let frame = 0;
    let disposed = false;
    const animate = (time: number) => {
      if (disposed) return;
      frame = window.requestAnimationFrame(animate);
      const positionAttribute = particleGeometry.getAttribute("position") as THREE.BufferAttribute;
      const colorAttribute = particleGeometry.getAttribute("color") as THREE.BufferAttribute;
      const currentPositions = positionAttribute.array as Float32Array;
      const currentColors = colorAttribute.array as Float32Array;

      if (visualState.experiment === "B") {
        const shake = (visualState.progress / 100) * 0.12;
        boxFrame.position.set(
          (Math.random() - 0.5) * shake,
          (Math.random() - 0.5) * shake,
          (Math.random() - 0.5) * shake,
        );
      } else {
        boxFrame.position.set(0, 0, 0);
      }

      for (let index = 0; index < PARTICLE_COUNT; index += 1) {
        const particle = particles[index];
        const offset = index * 3;
        if (visualState.experiment === "A") {
          const cycle = time * 0.0015 + particle.randomPhase;
          const blend = (Math.sin(time * 0.001 + particle.randomPhase) + 1) / 2;
          particle.targetPos.lerpVectors(particle.aliveTarget, particle.deadTarget, blend);
          particle.targetPos.x += Math.sin(cycle) * 0.04;
          particle.targetPos.y += Math.cos(cycle) * 0.04;
          particle.targetPos.z += Math.sin(cycle * 0.7) * 0.04;
          particle.currentPos.lerp(particle.targetPos, 0.05);
          particle.currentColor.setRGB(
            0.6 + Math.sin(cycle) * 0.35,
            0.25,
            0.8 + Math.cos(cycle) * 0.2,
          );
        } else if (visualState.experiment === "B") {
          const shrink = visualState.progress / 100;
          const orbit = time * 0.008 + particle.randomPhase;
          const radius = (1 - shrink) * 3 + 0.1;
          particle.targetPos.set(
            Math.cos(orbit) * radius,
            Math.sin(particle.randomPhase) * 0.4 * (1 - shrink),
            Math.sin(orbit) * radius,
          );
          const jitter = shrink * 0.35;
          particle.targetPos.x += (Math.random() - 0.5) * jitter;
          particle.targetPos.y += (Math.random() - 0.5) * jitter;
          particle.targetPos.z += (Math.random() - 0.5) * jitter;
          particle.currentPos.lerp(particle.targetPos, 0.15);
          particle.currentColor.lerp(measuringColor, 0.1);
        } else {
          particle.currentPos.add(particle.velocity);
          particle.velocity.multiplyScalar(0.91);
          particle.currentPos.lerp(particle.targetPos, 0.06);
          const targetColor = visualState.result === "alive"
            ? (index % 2 === 0 ? alivePrimary : aliveSecondary)
            : (index % 2 === 0 ? deadPrimary : deadSecondary);
          particle.currentColor.lerp(targetColor, 0.08);
        }

        currentPositions[offset] = particle.currentPos.x;
        currentPositions[offset + 1] = particle.currentPos.y;
        currentPositions[offset + 2] = particle.currentPos.z;
        currentColors[offset] = particle.currentColor.r;
        currentColors[offset + 1] = particle.currentColor.g;
        currentColors[offset + 2] = particle.currentColor.b;
      }
      positionAttribute.needsUpdate = true;
      colorAttribute.needsUpdate = true;

      const bubblesPosition = bubbleGeometry.getAttribute("position") as THREE.BufferAttribute;
      const bubbleArray = bubblesPosition.array as Float32Array;
      for (let index = 0; index < 30; index += 1) {
        bubbleArray[index * 3 + 1] += 0.005;
        if (bubbleArray[index * 3 + 1] > 0.3) bubbleArray[index * 3 + 1] = -0.3;
      }
      bubblesPosition.needsUpdate = true;

      if (visualState.experiment === "A") {
        particleSystem.rotation.y = time * 0.0001;
        particleSystem.rotation.x = time * 0.00005;
      } else if (visualState.experiment === "B") {
        particleSystem.rotation.y += 0.03 * (visualState.progress / 100 + 0.1);
      } else {
        particleSystem.rotation.y = Math.sin(time * 0.0004) * 0.25;
      }
      boxFrame.rotation.y += 0.001;
      flask.rotation.y += 0.002;
      renderer.render(scene, camera);
    };

    apiRef.current = {
      beginMeasurement: () => {
        visualState.experiment = "B";
        visualState.progress = 0;
      },
      updateProgress: (progress) => {
        visualState.progress = progress;
      },
      collapse: (result) => {
        visualState.experiment = "C";
        visualState.result = result;
        particles.forEach((particle) => {
          const angle = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          particle.velocity.set(
            Math.sin(phi) * Math.cos(angle),
            Math.sin(phi) * Math.sin(angle),
            Math.cos(phi),
          ).multiplyScalar(Math.random() * 14);
          particle.targetPos.copy(result === "alive" ? particle.aliveTarget : particle.deadTarget);
        });
        boxFrame.material.color.setHex(result === "alive" ? 0x10b981 : 0x8b5cf6);
        boxFrame.material.opacity = 0.5;
      },
      reset: () => {
        visualState.experiment = "A";
        visualState.progress = 0;
        visualState.result = null;
        particles.forEach((particle, index) => {
          generateTarget(index, "superposition", particle.superTarget);
          particle.targetPos.copy(particle.superTarget);
          particle.velocity.set(0, 0, 0);
        });
        boxFrame.material.color.setHex(0xa855f7);
        boxFrame.material.opacity = 0.3;
      },
    };

    animate(0);

    return () => {
      disposed = true;
      apiRef.current = null;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      resizeObserver?.disconnect();
      scene.traverse((object) => {
        const renderable = object as THREE.Mesh | THREE.Points | THREE.Line | THREE.LineSegments;
        if ("geometry" in renderable) renderable.geometry?.dispose();
        if ("material" in renderable) {
          const materials = Array.isArray(renderable.material) ? renderable.material : [renderable.material];
          materials.forEach((material) => material?.dispose());
        }
      });
      particleTexture.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentElement === container) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="creation-scene-canvas" aria-hidden="true" />;
});

export default CreationScene;
