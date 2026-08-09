import { useEffect, useRef } from "react";

/**
 * The shared fixed/pinned background layer: grid floor, ember glows and the
 * spark particle canvas. Used by the landing page and the auth pages so the
 * treatment is identical everywhere.
 */
export function HeroBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const visualRef = useRef<HTMLDivElement | null>(null);

  // spark particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const sparks = Array.from({ length: 46 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      vy: -(Math.random() * 0.35 + 0.08),
      vx: (Math.random() - 0.5) * 0.14,
      a: Math.random() * 0.6 + 0.15,
    }));

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const s of sparks) {
        s.x += s.vx;
        s.y += s.vy;
        if (s.y < -10) {
          s.y = h + 10;
          s.x = Math.random() * w;
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(163, 236, 255, ${s.a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // pointer parallax on the fixed visual
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: MouseEvent) => {
      const el = visualRef.current;
      if (!el) return;
      const dx = (e.clientX / window.innerWidth - 0.5) * 18;
      const dy = (e.clientY / window.innerHeight - 0.5) * 14;
      el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="hero-visual" ref={visualRef} aria-hidden="true">
      <div className="grid-floor" />
      <div className="ember-core">
        <div className="ember-glow ember-glow-1" />
        <div className="ember-glow ember-glow-2" />
        <div className="ember-glow ember-glow-3" />
      </div>
      <canvas id="sparks" ref={canvasRef} />
    </div>
  );
}
