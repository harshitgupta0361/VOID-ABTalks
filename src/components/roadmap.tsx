const STEPS = [
  {
    label: "Sign up & choose your track",
    desc: "Six tracks, one decision. Pick the lane you want to be known for.",
  },
  {
    label: "Get Day 1 — read the brief, build",
    desc: "A scoped daily task lands. Small enough to finish, real enough to matter.",
  },
  {
    label: "Push to GitHub, post to LinkedIn",
    desc: "Code goes public, story goes public. Both take five minutes.",
  },
  {
    label: "Submit both proofs, streak +1",
    desc: "Two links close the day and your streak counter ticks upward.",
  },
  {
    label: "Unlock the next day",
    desc: "Sequential unlocking with a 24-hour window — one day live at a time.",
  },
  {
    label: "Earn badges & XP",
    desc: "Milestones unlock as your consistency compounds day after day.",
  },
  {
    label: "Miss a day? Streak freeze",
    desc: "Two freezes absorb the bad days so real life doesn't reset you.",
  },
  {
    label: "Finish all 60 days",
    desc: "A full developer portfolio plus a 60-post LinkedIn trail recruiters can read.",
  },
];

export function Roadmap() {
  return (
    <section className="roadmap" aria-label="How the ABTalks challenge works">
      <div className="roadmap-head">
        <p className="roadmap-eyebrow">the journey</p>
        <h2 className="roadmap-title">Sixty days, step by step</h2>
        <p className="roadmap-sub">
          Scroll sideways through the whole challenge — from your first signup to your last commit.
        </p>
      </div>

      <div className="roadmap-rail">
        <span className="roadmap-line" aria-hidden />
        <ol className="roadmap-track">
          {STEPS.map((s, i) => (
            <li key={s.label} className="roadmap-card">
              <div className="roadmap-card-inner">
                <span className="roadmap-num">{String(i + 1).padStart(2, "0")}</span>
                <p className="roadmap-label">{s.label}</p>
                <p className="roadmap-desc">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
