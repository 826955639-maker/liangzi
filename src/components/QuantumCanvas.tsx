import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  phase: number;
};

type OrbitParticle = {
  orbit: number;
  angle: number;
  speed: number;
  radius: number;
  alpha: number;
};

const ORBIT_SPECS = [
  { rx: 0.27, ry: 0.09, rotation: -0.12 },
  { rx: 0.23, ry: 0.15, rotation: 0.62 },
  { rx: 0.22, ry: 0.12, rotation: 1.18 },
  { rx: 0.18, ry: 0.07, rotation: 2.1 },
  { rx: 0.32, ry: 0.18, rotation: -0.48 },
  { rx: 0.38, ry: 0.2, rotation: 0.18 },
];

function seededRandom(seed: number) {
  const value = Math.sin(seed * 999.91) * 43758.5453;
  return value - Math.floor(value);
}

export default function QuantumCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext("2d");
    if (!context) return undefined;

    const stars: Star[] = Array.from({ length: 190 }, (_, index) => ({
      x: seededRandom(index + 3),
      y: seededRandom(index + 43),
      radius: 0.35 + seededRandom(index + 91) * 1.45,
      alpha: 0.15 + seededRandom(index + 140) * 0.7,
      phase: seededRandom(index + 207) * Math.PI * 2,
    }));

    const orbitParticles: OrbitParticle[] = Array.from({ length: 120 }, (_, index) => ({
      orbit: index % ORBIT_SPECS.length,
      angle: seededRandom(index + 311) * Math.PI * 2,
      speed: 0.018 + seededRandom(index + 412) * 0.034,
      radius: 0.55 + seededRandom(index + 515) * 1.55,
      alpha: 0.3 + seededRandom(index + 612) * 0.7,
    }));

    let width = 1;
    let height = 1;
    let animationFrame = 0;
    let startTime = performance.now();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawGlowDot = (x: number, y: number, radius: number, alpha: number) => {
      const glow = context.createRadialGradient(x, y, 0, x, y, radius * 5);
      glow.addColorStop(0, `rgba(255,255,255,${alpha})`);
      glow.addColorStop(0.18, `rgba(204,185,255,${alpha * 0.86})`);
      glow.addColorStop(0.5, `rgba(126,86,255,${alpha * 0.3})`);
      glow.addColorStop(1, "rgba(87,51,220,0)");
      context.fillStyle = glow;
      context.beginPath();
      context.arc(x, y, radius * 5, 0, Math.PI * 2);
      context.fill();
    };

    const draw = (now: number) => {
      const time = reduceMotion ? 0 : (now - startTime) / 1000;
      context.clearRect(0, 0, width, height);

      const centerX = width * 0.735;
      const centerY = height * 0.46;
      const scale = Math.min(width, height);

      const wash = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, scale * 0.55);
      wash.addColorStop(0, "rgba(164,125,255,.22)");
      wash.addColorStop(0.28, "rgba(97,65,210,.12)");
      wash.addColorStop(0.68, "rgba(33,22,92,.04)");
      wash.addColorStop(1, "rgba(8,8,28,0)");
      context.fillStyle = wash;
      context.fillRect(0, 0, width, height);

      stars.forEach((star) => {
        const pulse = 0.65 + Math.sin(time * 1.4 + star.phase) * 0.35;
        const x = width * (0.43 + star.x * 0.57);
        const y = height * (0.06 + star.y * 0.88);
        drawGlowDot(x, y, star.radius, star.alpha * pulse);
      });

      context.save();
      context.globalCompositeOperation = "lighter";

      for (let index = 0; index < 13; index += 1) {
        const phase = index * 0.47 + time * 0.018;
        const radiusX = scale * (0.28 + index * 0.016);
        const radiusY = scale * (0.11 + index * 0.009);
        context.save();
        context.translate(centerX - scale * 0.08, centerY + scale * 0.12);
        context.rotate(-0.3 + index * 0.018);
        context.strokeStyle = `rgba(${120 + index * 4}, ${84 + index * 3}, 255, ${0.05 + index * 0.004})`;
        context.lineWidth = 0.75 + (index % 3) * 0.3;
        context.beginPath();
        context.ellipse(0, 0, radiusX, radiusY, phase * 0.02, Math.PI * 0.04, Math.PI * 1.95);
        context.stroke();
        context.restore();
      }

      ORBIT_SPECS.forEach((orbit, index) => {
        context.save();
        context.translate(centerX, centerY);
        context.rotate(orbit.rotation + Math.sin(time * 0.08 + index) * 0.025);
        const gradient = context.createLinearGradient(-scale * orbit.rx, 0, scale * orbit.rx, 0);
        gradient.addColorStop(0, "rgba(98,62,226,.04)");
        gradient.addColorStop(0.35, "rgba(143,105,255,.54)");
        gradient.addColorStop(0.63, "rgba(227,216,255,.9)");
        gradient.addColorStop(1, "rgba(102,70,232,.08)");
        context.strokeStyle = gradient;
        context.lineWidth = index < 4 ? 1.1 : 0.7;
        context.beginPath();
        context.ellipse(0, 0, scale * orbit.rx, scale * orbit.ry, 0, 0, Math.PI * 2);
        context.stroke();
        context.restore();
      });

      orbitParticles.forEach((particle) => {
        const orbit = ORBIT_SPECS[particle.orbit];
        const angle = particle.angle + time * particle.speed * (particle.orbit % 2 === 0 ? 1 : -1) * 5;
        const x0 = Math.cos(angle) * scale * orbit.rx;
        const y0 = Math.sin(angle) * scale * orbit.ry;
        const cos = Math.cos(orbit.rotation);
        const sin = Math.sin(orbit.rotation);
        const x = centerX + x0 * cos - y0 * sin;
        const y = centerY + x0 * sin + y0 * cos;
        drawGlowDot(x, y, particle.radius, particle.alpha);
      });

      const corePulse = 1 + Math.sin(time * 2.2) * 0.06;
      const coreRadius = scale * 0.052 * corePulse;
      const core = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreRadius * 4.6);
      core.addColorStop(0, "rgba(255,255,255,1)");
      core.addColorStop(0.14, "rgba(246,239,255,.98)");
      core.addColorStop(0.3, "rgba(190,155,255,.72)");
      core.addColorStop(0.58, "rgba(118,72,255,.28)");
      core.addColorStop(1, "rgba(92,49,227,0)");
      context.fillStyle = core;
      context.beginPath();
      context.arc(centerX, centerY, coreRadius * 4.6, 0, Math.PI * 2);
      context.fill();

      drawGlowDot(centerX - scale * 0.22, centerY - scale * 0.23, 2.1, 0.95);
      drawGlowDot(centerX + scale * 0.16, centerY + scale * 0.2, 2.8, 0.9);
      drawGlowDot(centerX - scale * 0.13, centerY + scale * 0.18, 1.9, 0.86);
      context.restore();

      if (!reduceMotion) animationFrame = requestAnimationFrame(draw);
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reduceMotion) draw(startTime);
    });
    resizeObserver.observe(canvas);
    resize();
    animationFrame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      startTime = 0;
    };
  }, []);

  return <canvas ref={canvasRef} className="quantum-canvas" aria-hidden="true" />;
}
