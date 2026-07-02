import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";

export type PerceptionMode = "wave" | "photon" | "mix";

export type PerceptionParameters = {
  spacing: number;
  intensity: number;
  diffusion: number;
};

export type PerceptionVisualHandle = {
  setMode: (mode: PerceptionMode) => void;
  setParameters: (parameters: PerceptionParameters) => void;
  pulse: () => void;
  setPaused: (paused: boolean) => void;
  reset: () => void;
  cycleView: () => void;
  setTrails: (enabled: boolean) => void;
  triggerRipple: (x: number, z: number, intensity?: number) => void;
  setHandAngle: (angle: number) => void;
  collapseWave: () => void;
};

type Photon = {
  mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
  trail: THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial>;
  radius: number;
  angle: number;
  baseSpeed: number;
  pulseSpeed: number;
  heightOffset: number;
  history: THREE.Vector3[];
  maxHistory: number;
};

const INITIAL_PARAMETERS: PerceptionParameters = {
  spacing: 1.36,
  intensity: 1.44,
  diffusion: 1.1,
};

const PerceptionVisualStage = forwardRef<PerceptionVisualHandle>(function PerceptionVisualStage(_, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<PerceptionVisualHandle | null>(null);

  useImperativeHandle(ref, () => ({
    setMode: (mode) => apiRef.current?.setMode(mode),
    setParameters: (parameters) => apiRef.current?.setParameters(parameters),
    pulse: () => apiRef.current?.pulse(),
    setPaused: (paused) => apiRef.current?.setPaused(paused),
    reset: () => apiRef.current?.reset(),
    cycleView: () => apiRef.current?.cycleView(),
    setTrails: (enabled) => apiRef.current?.setTrails(enabled),
    triggerRipple: (x, z, intensity) => apiRef.current?.triggerRipple(x, z, intensity),
    setHandAngle: (angle) => apiRef.current?.setHandAngle(angle),
    collapseWave: () => apiRef.current?.collapseWave(),
  }), []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const config = {
      particleCount: 8500,
      isPaused: false,
      trailsActive: true,
      currentMode: "wave" as PerceptionMode,
    };
    const state = {
      ...INITIAL_PARAMETERS,
      activeGlow: 0,
      viewAngle: 0,
      colorTemp: 0,
      rippleIntensity: 0,
      rippleCenter: new THREE.Vector2(0, 0),
      handAngle: 0,
    };
    const target = {
      ...INITIAL_PARAMETERS,
      colorTemp: 0,
      handAngle: 0,
    };

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05060a);
    scene.fog = new THREE.FogExp2(0x05060a, 0.025);

    const camera = new THREE.PerspectiveCamera(50, 1.5, 0.1, 100);
    camera.position.set(0, 11, 15);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.setAttribute("aria-hidden", "true");
    container.appendChild(renderer.domElement);

    const createPointGlowTexture = (color: string) => {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const context = canvas.getContext("2d");
      if (!context) return new THREE.Texture();
      const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.25, color);
      gradient.addColorStop(0.6, "rgba(155, 92, 255, 0.2)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(canvas);
    };

    const purpleTexture = createPointGlowTexture("#BD95FF");
    const goldTexture = createPointGlowTexture("#FFE396");

    const ringGroup = new THREE.Group();
    scene.add(ringGroup);

    const platform = new THREE.Mesh(
      new THREE.RingGeometry(0.2, 8, 64),
      new THREE.MeshBasicMaterial({
        color: 0x2c1d4d,
        side: THREE.DoubleSide,
        wireframe: true,
        transparent: true,
        opacity: 0.1,
      }),
    );
    platform.rotation.x = Math.PI / 2;
    platform.position.y = -1.8;
    ringGroup.add(platform);

    for (let radius = 1.2; radius <= 8; radius += 1.4) {
      const vertices: number[] = [];
      for (let angle = 0; angle <= Math.PI * 2; angle += 0.04) {
        vertices.push(radius * Math.cos(angle), -1.8, radius * Math.sin(angle));
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
      ringGroup.add(new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({
          color: radius > 4.5 ? 0xffd36a : 0x9b5cff,
          transparent: true,
          opacity: radius > 4.5 ? 0.08 : 0.15,
        }),
      ));
    }

    const energyCore = new THREE.Group();
    scene.add(energyCore);
    const centralSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.7, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xffd36a, transparent: true, opacity: 0.95 }),
    );
    energyCore.add(centralSphere);

    const coreGlowGeometry = new THREE.PlaneGeometry(3.5, 3.5);
    const coreGlowMaterial = new THREE.MeshBasicMaterial({
      map: goldTexture,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const coreGlowPlanes: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>[] = [];
    for (let index = 0; index < 3; index += 1) {
      const plane = new THREE.Mesh(coreGlowGeometry, coreGlowMaterial.clone());
      plane.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      energyCore.add(plane);
      coreGlowPlanes.push(plane);
    }
    scene.add(new THREE.PointLight(0xffd36a, 3, 15));

    const wavePositions: number[] = [];
    const waveColors: number[] = [];
    const waveMetadata = new Float32Array(config.particleCount * 3);
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let index = 0; index < config.particleCount; index += 1) {
      const normalized = index / (config.particleCount - 1);
      const radius = 0.5 + Math.pow(normalized, 0.65) * 7.5;
      const angle = index * goldenAngle;
      wavePositions.push(radius * Math.cos(angle), 0, radius * Math.sin(angle));
      waveMetadata[index * 3] = radius;
      waveMetadata[index * 3 + 1] = angle;
      const color = new THREE.Color();
      color.setHSL(0.74 + (radius / 8) * 0.08, 0.9, 0.55);
      waveColors.push(color.r, color.g, color.b);
    }

    const waveGeometry = new THREE.BufferGeometry();
    waveGeometry.setAttribute("position", new THREE.Float32BufferAttribute(wavePositions, 3));
    waveGeometry.setAttribute("color", new THREE.Float32BufferAttribute(waveColors, 3));
    const waveMaterial = new THREE.PointsMaterial({
      size: 0.15,
      map: purpleTexture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });
    const waveField = new THREE.Points(waveGeometry, waveMaterial);
    scene.add(waveField);

    const photonGroup = new THREE.Group();
    scene.add(photonGroup);
    const photons: Photon[] = [];
    for (let index = 0; index < 8; index += 1) {
      const radius = 1.6 + index * 0.7;
      const speed = 0.022 + 0.008 / (index + 1);
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffd36a, transparent: true, opacity: 0.9 }),
      );
      photonGroup.add(mesh);

      const maxHistory = 45;
      const trailGeometry = new THREE.BufferGeometry();
      trailGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(maxHistory * 3), 3));
      const trail = new THREE.Line(
        trailGeometry,
        new THREE.LineBasicMaterial({
          color: 0xffd36a,
          transparent: true,
          opacity: 0.5,
          blending: THREE.AdditiveBlending,
        }),
      );
      photonGroup.add(trail);
      photons.push({
        mesh,
        trail,
        radius,
        angle: (index * Math.PI * 2) / 8,
        baseSpeed: speed,
        pulseSpeed: speed,
        heightOffset: Math.random() * Math.PI,
        history: [],
        maxHistory,
      });
    }

    const backgroundPositions: number[] = [];
    for (let index = 0; index < 350; index += 1) {
      backgroundPositions.push(
        (Math.random() - 0.5) * 60,
        Math.random() * 30 - 10,
        (Math.random() - 0.5) * 60,
      );
    }
    const backgroundGeometry = new THREE.BufferGeometry();
    backgroundGeometry.setAttribute("position", new THREE.Float32BufferAttribute(backgroundPositions, 3));
    const backgroundPoints = new THREE.Points(
      backgroundGeometry,
      new THREE.PointsMaterial({
        size: 0.07,
        color: 0x6e4aa3,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      }),
    );
    scene.add(backgroundPoints);

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    const clock = new THREE.Clock();
    const color = new THREE.Color();
    let animationFrame = 0;
    let disposed = false;

    const render = () => {
      if (disposed) return;
      animationFrame = window.requestAnimationFrame(render);
      const time = clock.getElapsedTime();

      state.spacing += (target.spacing - state.spacing) * 0.1;
      state.intensity += (target.intensity - state.intensity) * 0.1;
      state.diffusion += (target.diffusion - state.diffusion) * 0.1;
      state.activeGlow += (0 - state.activeGlow) * 0.05;
      state.colorTemp += (target.colorTemp - state.colorTemp) * 0.08;
      state.rippleIntensity += (0 - state.rippleIntensity) * 0.05;

      let angleDelta = target.handAngle - state.handAngle;
      while (angleDelta > Math.PI) angleDelta -= Math.PI * 2;
      while (angleDelta < -Math.PI) angleDelta += Math.PI * 2;
      state.handAngle += angleDelta * 0.15;

      if (!config.isPaused) {
        backgroundPoints.rotation.y += 0.0002;
        ringGroup.rotation.y -= 0.0008 * state.diffusion;
        const scale = 1 + Math.sin(time * 2.8) * 0.08 + state.activeGlow * 0.15;
        centralSphere.scale.setScalar(scale);
        energyCore.rotation.z = -state.handAngle * 1.2;
        energyCore.rotation.y = state.handAngle * 0.8;
        coreGlowPlanes.forEach((plane, index) => {
          plane.rotation.z += 0.008 * (index + 1) * state.diffusion;
          plane.scale.setScalar(scale * 1.6);
        });

        const positionAttribute = waveField.geometry.getAttribute("position") as THREE.BufferAttribute;
        const colorAttribute = waveField.geometry.getAttribute("color") as THREE.BufferAttribute;
        const positions = positionAttribute.array as Float32Array;
        const colors = colorAttribute.array as Float32Array;
        for (let index = 0; index < config.particleCount; index += 1) {
          const offset = index * 3;
          const radius = waveMetadata[offset];
          waveMetadata[offset + 1] += 0.001 * state.diffusion;
          const angle = waveMetadata[offset + 1];
          const frequency = 3.8 / (state.spacing * 0.8 + 0.2);
          let height = 0.35 * state.intensity * Math.sin(radius * frequency - time * 3.5 * state.diffusion);

          if (state.rippleIntensity > 0.01) {
            const distance = Math.hypot(
              positions[offset] - state.rippleCenter.x,
              positions[offset + 2] - state.rippleCenter.y,
            );
            if (distance < 10) {
              height += Math.sin(distance * 4 - time * 20)
                * (1 - distance / 10)
                * state.rippleIntensity
                * 3.2;
            }
          }
          if (config.currentMode === "photon") height *= 0.18;

          positions[offset] = radius * Math.cos(angle);
          positions[offset + 1] = height;
          positions[offset + 2] = radius * Math.sin(angle);
          color.setHSL(
            THREE.MathUtils.lerp(0.74 + (radius / 9.5) * 0.06, 0.12, state.colorTemp),
            0.95,
            0.42 + height * 0.2,
          );
          colors[offset] = color.r;
          colors[offset + 1] = color.g;
          colors[offset + 2] = color.b;
        }
        positionAttribute.needsUpdate = true;
        colorAttribute.needsUpdate = true;
        waveMaterial.map = state.colorTemp > 0.4 ? goldTexture : purpleTexture;

        photons.forEach((photon) => {
          photon.pulseSpeed += (photon.baseSpeed - photon.pulseSpeed) * 0.04;
          photon.angle += photon.pulseSpeed * state.diffusion;
          const x = photon.radius * Math.cos(photon.angle);
          const z = photon.radius * Math.sin(photon.angle);
          const y = Math.sin(time * 2 + photon.heightOffset) * 0.45;
          photon.mesh.position.set(x, y, z);

          if (config.currentMode === "wave") {
            photon.mesh.scale.setScalar(0.4);
            photon.mesh.material.opacity = 0.15;
            photon.trail.material.opacity = 0.04;
          } else {
            photon.mesh.scale.setScalar(1.1);
            photon.mesh.material.opacity = 0.95;
            photon.trail.material.opacity = 0.65;
          }

          photon.history.unshift(new THREE.Vector3(x, y, z));
          if (photon.history.length > photon.maxHistory) photon.history.pop();
          const trailPositions = photon.trail.geometry.getAttribute("position") as THREE.BufferAttribute;
          const trailArray = trailPositions.array as Float32Array;
          for (let trailIndex = 0; trailIndex < photon.maxHistory; trailIndex += 1) {
            const point = photon.history[trailIndex] ?? photon.mesh.position;
            trailArray[trailIndex * 3] = point.x;
            trailArray[trailIndex * 3 + 1] = point.y;
            trailArray[trailIndex * 3 + 2] = point.z;
          }
          trailPositions.needsUpdate = true;
        });
      }

      let targetX = 0;
      let targetY = 9;
      let targetZ = 15;
      if (state.viewAngle === 1) {
        targetX = 0.01;
        targetY = 18;
        targetZ = 1;
      } else if (state.viewAngle === 2) {
        targetX = Math.sin(time * 0.1) * 7.5;
        targetY = 2.5;
        targetZ = Math.cos(time * 0.1) * 7.5;
      } else {
        targetX = Math.sin(time * 0.05) * 4.5;
        targetY = 8.5 + Math.cos(time * 0.08) * 1.5;
        targetZ = 12.5 + Math.sin(time * 0.08) * 1.5;
      }
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.position.z += (targetZ - camera.position.z) * 0.05;
      camera.lookAt(0, -0.6, 0);
      renderer.render(scene, camera);
    };

    apiRef.current = {
      setMode: (mode) => {
        config.currentMode = mode;
      },
      setParameters: (parameters) => {
        target.spacing = parameters.spacing;
        target.intensity = parameters.intensity;
        target.diffusion = parameters.diffusion;
      },
      pulse: () => {
        state.activeGlow = 1;
        state.rippleIntensity = 1;
        state.rippleCenter.set(0, 0);
        const photon = photons[Math.floor(Math.random() * photons.length)];
        if (photon) photon.pulseSpeed = photon.baseSpeed * 8;
      },
      setPaused: (paused) => {
        config.isPaused = paused;
        if (!paused) clock.getDelta();
      },
      reset: () => {
        Object.assign(target, INITIAL_PARAMETERS, { colorTemp: 0, handAngle: 0 });
        state.viewAngle = 0;
        config.currentMode = "wave";
      },
      cycleView: () => {
        state.viewAngle = (state.viewAngle + 1) % 3;
      },
      setTrails: (enabled) => {
        config.trailsActive = enabled;
        photons.forEach((photon) => {
          photon.trail.visible = enabled;
        });
      },
      triggerRipple: (x, z, intensity = 3.5) => {
        state.rippleCenter.set(x, z);
        state.rippleIntensity = intensity;
      },
      setHandAngle: (angle) => {
        target.handAngle = angle;
      },
      collapseWave: () => {
        target.spacing = 0.01;
        target.intensity = 0.01;
        target.diffusion = 0.01;
        state.activeGlow = -3;
      },
    };

    clock.start();
    render();

    return () => {
      disposed = true;
      apiRef.current = null;
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      scene.traverse((object) => {
        const renderable = object as THREE.Mesh | THREE.Points | THREE.Line;
        if ("geometry" in renderable) renderable.geometry?.dispose();
        if ("material" in renderable) {
          const materials = Array.isArray(renderable.material) ? renderable.material : [renderable.material];
          materials.forEach((material) => material?.dispose());
        }
      });
      purpleTexture.dispose();
      goldTexture.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentElement === container) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="perception-stage" aria-hidden="true" />;
});

export default PerceptionVisualStage;
