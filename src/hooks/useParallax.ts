import { useEffect, useRef } from "react";

/**
 * Applies a gentle scroll-driven translate/scale to the element so foreground
 * layers glide over the fixed background. Respects prefers-reduced-motion.
 */
export function useScrollParallax<T extends HTMLElement>(speed = 0.12) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // -1 (below viewport) → 1 (above viewport)
      const progress = (vh / 2 - (rect.top + rect.height / 2)) / vh;
      const clamped = Math.max(-1.2, Math.min(1.2, progress));
      el.style.transform = `translate3d(0, ${(-clamped * speed * 100).toFixed(2)}px, 0)`;
      el.style.opacity = String(Math.min(1, 1.08 - Math.abs(clamped) * 0.22));
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [speed]);

  return ref;
}
