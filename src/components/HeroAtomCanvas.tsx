import { useEffect, useRef } from "react";

type Star = { x: number; y: number; radius: number; alpha: number; phase: number };
type OrbitParticle = { orbit: number; angle: number; speed: number; radius: number; alpha: number };

const ORBIT_SPECS = [
  { rx: 0.27, ry: 0.09, rotation: -0.12 },
  { rx: 0.23, ry: 0.15, rotation: 0.62 },
  { rx: 0.22, ry: 0.12, rotation: 1.18 },
  { rx: 0.18, ry: 0.07, rotation: 2.1 },
  { rx: 0.32, ry: 0.18, rotation: -0.48 },
  { rx: 0.38, ry: 0.2, rotation: 0.18 },
];

function seededRandom(seed: number) {
  const v = Math.sin(seed * 999.91) * 43758.5453;
  return v - Math.floor(v);
}

export default function HeroAtomCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const stars: Star[] = Array.from({ length: 190 }, (_, i) => ({
      x: seededRandom(i + 3),
      y: seededRandom(i + 43),
      radius: 0.35 + seededRandom(i + 91) * 1.45,
      alpha: 0.15 + seededRandom(i + 140) * 0.7,
      phase: seededRandom(i + 207) * Math.PI * 2,
    }));

    const orbitParticles: OrbitParticle[] = Array.from({ length: 120 }, (_, i) => ({
      orbit: i % ORBIT_SPECS.length,
      angle: seededRandom(i + 311) * Math.PI * 2,
      speed: 0.018 + seededRandom(i + 412) * 0.034,
      radius: 0.55 + seededRandom(i + 515) * 1.55,
      alpha: 0.3 + seededRandom(i + 612) * 0.7,
    }));

    let width = 1;
    let height = 1;
    let animationFrame = 0;
    const startTime = performance.now();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawGlowDot = (x: number, y: number, radius: number, alpha: number) => {
      const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 5);
      glow.addColorStop(0, `rgba(255,255,255,${alpha})`);
      glow.addColorStop(0.18, `rgba(204,185,255,${alpha * 0.86})`);
      glow.addColorStop(0.5, `rgba(126,86,255,${alpha * 0.3})`);
      glow.addColorStop(1, "rgba(87,51,220,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, radius * 5, 0, Math.PI * 2);
      ctx.fill();
    };

    const draw = (now: number) => {
      const time = reduceMotion ? 0 : (now - startTime) / 1000;
      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const scale = Math.min(width, height);

      const wash = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, scale * 0.55);
      wash.addColorStop(0, "rgba(164,125,255,.22)");
      wash.addColorStop(0.28, "rgba(97,65,210,.12)");
      wash.addColorStop(0.68, "rgba(33,22,92,.04)");
      wash.addColorStop(1, "rgba(8,8,28,0)");
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, width, height);

      stars.forEach((star) => {
        const pulse = 0.65 + Math.sin(time * 1.4 + star.phase) * 0.35;
        const x = width * star.x;
        const y = height * star.y;
        drawGlowDot(x, y, star.radius, star.alpha * pulse);
      });

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < 13; i++) {
        const phase = i * 0.47 + time * 0.018;
        const radiusX = scale * (0.28 + i * 0.016);
        const radiusY = scale * (0.11 + i * 0.009);
        ctx.save();
        ctx.translate(centerX - scale * 0.08, centerY + scale * 0.12);
        ctx.rotate(-0.3 + i * 0.018);
        ctx.strokeStyle = `rgba(${120 + i * 4},${84 + i * 3},255,${0.05 + i * 0.004})`;
        ctx.lineWidth = 0.75 + (i % 3) * 0.3;
        ctx.beginPath();
        ctx.ellipse(0, 0, radiusX, radiusY, phase * 0.02, Math.PI * 0.04, Math.PI * 1.95);
        ctx.stroke();
        ctx.restore();
      }

      ORBIT_SPECS.forEach((orbit, i) => {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(orbit.rotation + Math.sin(time * 0.08 + i) * 0.025);
        const grad = ctx.createLinearGradient(-scale * orbit.rx, 0, scale * orbit.rx, 0);
        grad.addColorStop(0, "rgba(98,62,226,.04)");
        grad.addColorStop(0.35, "rgba(143,105,255,.54)");
        grad.addColorStop(0.63, "rgba(227,216,255,.9)");
        grad.addColorStop(1, "rgba(102,70,232,.08)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = i < 4 ? 1.1 : 0.7;
        ctx.beginPath();
        ctx.ellipse(0, 0, scale * orbit.rx, scale * orbit.ry, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      orbitParticles.forEach((p) => {
        const orbit = ORBIT_SPECS[p.orbit];
        const angle = p.angle + time * p.speed * (p.orbit % 2 === 0 ? 1 : -1) * 5;
        const x0 = Math.cos(angle) * scale * orbit.rx;
        const y0 = Math.sin(angle) * scale * orbit.ry;
        const cos = Math.cos(orbit.rotation);
        const sin = Math.sin(orbit.rotation);
        const x = centerX + x0 * cos - y0 * sin;
        const y = centerY + x0 * sin + y0 * cos;
        drawGlowDot(x, y, p.radius, p.alpha);
      });

      const corePulse = 1 + Math.sin(time * 2.2) * 0.06;
      const coreRadius = scale * 0.052 * corePulse;
      const core = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreRadius * 4.6);
      core.addColorStop(0, "rgba(255,255,255,1)");
      core.addColorStop(0.14, "rgba(246,239,255,.98)");
      core.addColorStop(0.3, "rgba(190,155,255,.72)");
      core.addColorStop(0.58, "rgba(118,72,255,.28)");
      core.addColorStop(1, "rgba(92,49,227,0)");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius * 4.6, 0, Math.PI * 2);
      ctx.fill();

      drawGlowDot(centerX - scale * 0.22, centerY - scale * 0.23, 2.1, 0.95);
      drawGlowDot(centerX + scale * 0.16, centerY + scale * 0.2, 2.8, 0.9);
      drawGlowDot(centerX - scale * 0.13, centerY + scale * 0.18, 1.9, 0.86);
      ctx.restore();

      if (!reduceMotion) animationFrame = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(() => {
      resize();
      if (reduceMotion) draw(startTime);
    });
    ro.observe(canvas);
    resize();
    animationFrame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrame);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-atom-canvas" aria-hidden="true" />;
}
