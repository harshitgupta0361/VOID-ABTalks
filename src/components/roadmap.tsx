import { useEffect, useRef, useState, useCallback } from "react";
import {
  Award,
  CheckCircle2,
  Code2,
  FileText,
  Rocket,
  Upload,
  type LucideIcon,
} from "lucide-react";

type Step = {
  label: string;
  desc: string;
  icon: LucideIcon;
  tags: string[];
};

const STEPS: Step[] = [
  {
    label: "Join the Challenge",
    desc: "Sign up, pick the track you want to be known for, and lock in day one.",
    icon: Rocket,
    tags: ["Sign up", "Pick track", "Commit"],
  },
  {
    label: "Receive Your Task",
    desc: "A scoped daily brief lands — small enough to finish, real enough to matter.",
    icon: FileText,
    tags: ["Daily brief", "Scoped", "Focused"],
  },
  {
    label: "Build & Solve",
    desc: "Write the code, break things, fix them. Real practice, not tutorials.",
    icon: Code2,
    tags: ["Learn", "Improve", "Grow"],
  },
  {
    label: "Submit Proof",
    desc: "Push to GitHub, post to LinkedIn, and drop both links to close the day.",
    icon: Upload,
    tags: ["GitHub", "LinkedIn", "Public"],
  },
  {
    label: "Get Verified",
    desc: "Both proofs checked, the day marks complete and your streak ticks up.",
    icon: CheckCircle2,
    tags: ["Verified", "Streak +1", "Tracked"],
  },
  {
    label: "Earn & Unlock",
    desc: "Badges, XP and the next day unlock as your consistency compounds.",
    icon: Award,
    tags: ["Badges", "XP", "Next day"],
  },
];

export function Roadmap() {
  const [active, setActive] = useState(0);
  const [trackOffset, setTrackOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLOListElement | null>(null);
  const rafRef = useRef(0);

  // ── Mobile detection ─────────────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  // ── Compute translateX so card[idx] is centered inside the rail ──────
  // Called directly from the scroll tick — no extra render cycle needed.
  const computeOffset = useCallback((idx: number): number => {
    const track = trackRef.current;
    if (!track) return 0;
    const card = track.children[idx] as HTMLElement | undefined;
    if (!card) return 0;
    // rail = the element whose width defines the visible area
    const rail = track.parentElement as HTMLElement | null;
    if (!rail) return 0;
    const railCenter = rail.offsetWidth / 2;
    // offsetLeft of the card is relative to its offsetParent (the track itself
    // since we give .roadmap-track position:relative in CSS)
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    return railCenter - cardCenter;
  }, []);

  // ── Desktop: single rAF scroll handler drives BOTH active + offset ───
  // Key fix: compute BOTH values inside ONE tick so they're always in sync
  // and there's no second render cycle.
  useEffect(() => {
    if (isMobile) return;
    const section = sectionRef.current;
    if (!section) return;

    const tick = () => {
      // px scrolled past this section's top edge (0 when section top hits viewport top)
      const into = window.scrollY - section.offsetTop;
      // total pinned scroll distance: section height minus one viewport
      const range = section.offsetHeight - window.innerHeight;
      if (range <= 0) return;

      // progress: 0 (entered section) → 1 (leaving section)
      const progress = Math.max(0, Math.min(1, into / range));

      // Map evenly across all 6 steps using round so each step gets equal scroll distance
      const idx = Math.round(progress * (STEPS.length - 1));

      // Batch both state updates — React 18+ automatic batching keeps this one render
      setActive(idx);
      setTrackOffset(computeOffset(idx));
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Run immediately so the initial position is correct even before scrolling
    tick();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile, computeOffset]);

  // ── Mobile: IntersectionObserver on the swipeable track ─────────────
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const setCardRef = useCallback(
    (i: number) => (el: HTMLLIElement | null) => {
      cardRefs.current[i] = el;
    },
    []
  );

  useEffect(() => {
    if (!isMobile) return;
    const rail = trackRef.current;
    if (!rail) return;

    const observers: IntersectionObserver[] = [];
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.55) setActive(i);
        },
        { root: rail, threshold: 0.55 }
      );
      obs.observe(card);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [isMobile]);

  const pulseLeft = `${((active + 0.5) / STEPS.length) * 100}%`;

  return (
    <section
      ref={sectionRef}
      className={`roadmap-scroll-section${isMobile ? " is-mobile" : ""}`}
      aria-label="How the ABTalks challenge works"
    >
      {/* Sticky panel: stays fixed in the viewport while outer section scrolls */}
      <div className="roadmap-sticky-panel">
        <div className="roadmap">
          <div className="roadmap-head">
            <p className="roadmap-eyebrow">the journey</p>
            <h2 className="roadmap-title">
              Your Challenge, <em>Step by Step</em>
            </h2>
            <p className="roadmap-sub">
              Six moves that turn sixty ordinary days into a public record of what you can build.
            </p>
          </div>

          <div className="roadmap-stage roadmap-stage--no-arrows">
            <div className="roadmap-rail">
              <span className="roadmap-line" aria-hidden />
              <span className="roadmap-pulse" aria-hidden style={{ left: pulseLeft }} />

              {/*
                On desktop: translateX shifts the whole track so the active card
                stays centered. CSS transition makes the shift smooth.
                On mobile: overflow-x:auto + snap = swipe carousel (no translateX).
              */}
              <ol
                className="roadmap-track"
                ref={trackRef}
                style={isMobile ? undefined : { transform: `translateX(${trackOffset}px)` }}
              >
                {STEPS.map((s, i) => {
                  const Icon = s.icon;
                  // State is driven entirely by the calculated active index — never hardcoded
                  const state =
                    i === active ? "is-active" : i < active ? "is-past" : "is-next";
                  return (
                    <li
                      key={s.label}
                      className={`roadmap-card ${state}`}
                      ref={setCardRef(i)}
                    >
                      <div
                        className="roadmap-card-inner"
                        aria-current={i === active ? "step" : undefined}
                      >
                        <span className="roadmap-num">{String(i + 1).padStart(2, "0")}</span>
                        <span className="roadmap-icon" aria-hidden>
                          <Icon className="size-[18px]" />
                        </span>
                        <p className="roadmap-label">{s.label}</p>
                        <p className="roadmap-desc">{s.desc}</p>
                        <span className="roadmap-tags">
                          {s.tags.map((t) => (
                            <span key={t} className="roadmap-tag">{t}</span>
                          ))}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          <div className="roadmap-progress">
            <span className="roadmap-progress-label">
              step {String(active + 1).padStart(2, "0")} / 06
            </span>
            <span className="roadmap-progress-line" aria-hidden>
              {STEPS.map((s, i) => (
                <span key={s.label} className={`roadmap-dot${i <= active ? " is-on" : ""}`} />
              ))}
            </span>
            <span className="roadmap-progress-label">your journey begins here →</span>
          </div>
        </div>
      </div>
    </section>
  );
}
