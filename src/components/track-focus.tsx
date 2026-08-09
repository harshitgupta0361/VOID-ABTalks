import { useEffect, useRef, useState } from "react";
import { TRACKS } from "@/lib/abtalks/data";

/**
 * Focus-lock scroll: a single 3D core stays pinned in the middle of the
 * viewport while the surrounding copy, stats and lighting reconfigure per track.
 */
export function TrackFocus() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total <= 0 ? 0 : Math.min(1, Math.max(0, -rect.top / total));
      setProgress(p);
      setIndex(Math.min(TRACKS.length - 1, Math.floor(p * TRACKS.length * 0.999)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const track = TRACKS[index]!;

  return (
    <section
      className="focus-lock"
      ref={wrapRef}
      style={{ ["--track-accent" as string]: track.accent }}
      aria-label="Explore the six ABTalks tracks"
    >
      <div className="focus-sticky">
        <div className="focus-inner">
          <div className="focus-copy">
            <p className="focus-eyebrow">
              track {String(index + 1).padStart(2, "0")} / {TRACKS.length}
            </p>
            <h2 key={`t-${track.id}`} className="focus-title">
              {track.label}
            </h2>
            <p key={`b-${track.id}`} className="focus-desc">
              {track.blurb} Day one starts with: {track.day1.toLowerCase()}
            </p>
            <div className="focus-stats">
              {track.highlights.map((h) => (
                <span key={h} className="focus-stat">
                  {h}
                </span>
              ))}
              <span className="focus-stat">60 daily tasks</span>
            </div>
          </div>

          <div className="focus-core-wrap" aria-hidden>
            <div
              className="focus-core"
              style={{ ["--spin" as string]: `${progress * 720}deg` }}
            >
              <span className="focus-ring r1" />
              <span className="focus-ring r2" />
              <span className="focus-ring r3" />
              <span className="focus-core-orb" />
            </div>
          </div>
        </div>

        <div className="focus-dots" aria-hidden>
          {TRACKS.map((t, i) => (
            <span key={t.id} className={`focus-dot${i === index ? " is-on" : ""}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
