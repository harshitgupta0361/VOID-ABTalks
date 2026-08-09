import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
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
  const [active, setActive] = useState(2);
  const trackRef = useRef<HTMLOListElement | null>(null);

  useEffect(() => {
    const el = trackRef.current?.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [active]);

  const move = (dir: -1 | 1) =>
    setActive((a) => Math.min(STEPS.length - 1, Math.max(0, a + dir)));

  return (
    <section className="roadmap" aria-label="How the ABTalks challenge works">
      <div className="roadmap-head">
        <p className="roadmap-eyebrow">the journey</p>
        <h2 className="roadmap-title">
          Your Challenge, <em>Step by Step</em>
        </h2>
        <p className="roadmap-sub">
          Six moves that turn sixty ordinary days into a public record of what you can build.
        </p>
      </div>

      <div className="roadmap-stage">
        <button
          type="button"
          className="roadmap-arrow"
          aria-label="Previous step"
          disabled={active === 0}
          onClick={() => move(-1)}
        >
          <ArrowLeft className="size-4" />
        </button>

        <div className="roadmap-rail">
          <span className="roadmap-line" aria-hidden />
          <span
            className="roadmap-pulse"
            aria-hidden
            style={{ left: `${((active + 0.5) / STEPS.length) * 100}%` }}
          />
          <ol className="roadmap-track" ref={trackRef}>
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const state = i === active ? "is-active" : i < active ? "is-past" : "is-next";
              return (
                <li key={s.label} className={`roadmap-card ${state}`}>
                  <button
                    type="button"
                    className="roadmap-card-inner"
                    onClick={() => setActive(i)}
                    aria-current={i === active}
                  >
                    <span className="roadmap-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="roadmap-icon" aria-hidden>
                      <Icon className="size-[18px]" />
                    </span>
                    <p className="roadmap-label">{s.label}</p>
                    <p className="roadmap-desc">{s.desc}</p>
                    <span className="roadmap-tags">
                      {s.tags.map((t) => (
                        <span key={t} className="roadmap-tag">
                          {t}
                        </span>
                      ))}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <button
          type="button"
          className="roadmap-arrow"
          aria-label="Next step"
          disabled={active === STEPS.length - 1}
          onClick={() => move(1)}
        >
          <ArrowRight className="size-4" />
        </button>
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
    </section>
  );
}
