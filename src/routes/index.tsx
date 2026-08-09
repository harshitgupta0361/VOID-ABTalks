import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef } from "react";
import { useSession } from "@/hooks/useSession";
import { useAbtalks } from "@/hooks/useAbtalks";
import { useScrollParallax } from "@/hooks/useParallax";
import { HeroBackdrop } from "@/components/hero-backdrop";
import { TrackFocus } from "@/components/track-focus";
import { Roadmap } from "@/components/roadmap";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ABTalks — Code Every Day. Get Seen Every Day." },
      {
        name: "description",
        content:
          "A 60-day public build challenge for Indian college students. Ship daily, post daily, get noticed by recruiters.",
      },
      { property: "og:title", content: "ABTalks — Code Every Day. Get Seen Every Day." },
      {
        property: "og:description",
        content: "Ship daily, post daily, get noticed. 60 days, two proofs, one streak.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const heroCopyRef = useScrollParallax<HTMLDivElement>(0.18);
  const deckRef = useScrollParallax<HTMLDivElement>(0.09);
  const statusRef = useScrollParallax<HTMLDivElement>(0.05);
  const session = useSession();
  const { student, days, getSubmission } = useAbtalks();
  const todaySubmission = getSubmission(student.currentDay);
  const fresh = student.totalCompleted === 0;
  const missedDays = days.filter((d) => d.day <= student.currentDay && d.status === "missed");
  const lastMissed = missedDays.length ? missedDays[missedDays.length - 1]!.day : null;
  const pct = Math.round((student.totalCompleted / 60) * 100);


  return (
    <div>
      <section className="hero">
        <HeroBackdrop />

        <div className="hero-content parallax-layer" ref={heroCopyRef}>
          <h1>
            Code every day.
            <br />
            <em>Get seen every day.</em>
          </h1>
          <p className="subhead">
            A 60-day public build challenge for Indian college students. Ship daily, post daily, get
            noticed by recruiters.
          </p>
          <div className="hero-story">
            <p>
              <strong>ABTalks is where 60 days become your developer identity.</strong> Build
              something every day, push real code, share your progress, and turn consistency into
              visible proof of skill. Choose your track, take on daily challenges, complete
              projects, and document your journey through GitHub and LinkedIn.
            </p>
            <p>
              Track your streak, earn XP, unlock achievements, explore your growth, and climb the
              leaderboard as your skills evolve. Every completed day adds another layer to your
              developer portfolio and another step toward becoming industry-ready.
            </p>
            <p>
              No endless tutorials. No passive learning. No waiting for the perfect moment. Just 60
              days of building, experimenting, shipping, and improving.
            </p>
            <p>
              <strong>
                Start with one commit. Build your momentum. Make your work visible. Complete the
                challenge. Become the developer you can prove you are.
              </strong>
            </p>
          </div>
          <div className="cta-row">

            <Link to="/dashboard" className="btn btn-primary">
              Start your streak
            </Link>
            <Link to="/help" className="btn btn-ghost">
              See how it works
            </Link>
          </div>
        </div>
      </section>

      <div className="deck parallax-layer" ref={deckRef}>
        {session ? (
          <>
            <TiltCard {...(lastMissed ? { to: `/day/${lastMissed}` } : { to: "/dashboard" })}>
              <svg className="card-icon" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              <p className="card-value">{missedDays.length}</p>
              <p className="card-label">days missed</p>
              <p className="card-sub">
                {lastMissed
                  ? `${student.freezesAvailable} freeze${student.freezesAvailable === 1 ? "" : "s"} left`
                  : "0 missed — keep it up"}
              </p>
              <p className="card-cta">
                {lastMissed ? `View Day ${lastMissed} →` : "Go to dashboard →"}
              </p>
            </TiltCard>

            <TiltCard to={`/day/${student.currentDay}`}>
              <div className="ring" style={{ ["--ring-pct" as string]: `${pct}%` }}>
                <span>{pct}%</span>
              </div>
              <p className="card-value">{student.totalCompleted}/60</p>
              <p className="card-label">days shipped</p>
              <p className="card-sub">
                {fresh
                  ? `let's ship day ${student.currentDay}`
                  : `day ${student.currentDay} in progress`}
              </p>
              <p className="card-cta">View Day {student.currentDay} →</p>
            </TiltCard>

            <TiltCard to={`/day/${student.currentDay}`}>
              <svg className="card-icon" viewBox="0 0 24 24">
                <path d="M9 19c-4 1.5-4-2.5-6-3m12 5v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.2-1.5 6.2-6.7A5.2 5.2 0 0 0 19 3.4a4.8 4.8 0 0 0-.1-3.6s-1.1-.3-3.6 1.4a12.3 12.3 0 0 0-6.6 0C6.2-.5 5.1-.2 5.1-.2A4.8 4.8 0 0 0 5 3.4 5.2 5.2 0 0 0 3.7 7c0 5.2 3.2 6.4 6.2 6.7a3.4 3.4 0 0 0-.9 2.6V20" />
              </svg>
              <p className="card-label">GitHub proof</p>
              <p className="card-sub">
                {todaySubmission.githubUrl ? (
                  <>
                    <span className="badge-ok">✓ submitted</span> ·{" "}
                    {formatTime(todaySubmission.githubSubmittedAt)}
                  </>
                ) : (
                  "Not submitted yet"
                )}
              </p>
              <p className="card-cta">
                {todaySubmission.githubUrl
                  ? `View Day ${student.currentDay} →`
                  : `Get started → Day ${student.currentDay}`}
              </p>
            </TiltCard>

            <TiltCard to={`/day/${student.currentDay}`}>
              <svg className="card-icon" viewBox="0 0 24 24">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
              <p className="card-label">LinkedIn proof</p>
              <p className="card-sub">
                {todaySubmission.linkedinUrl ? (
                  <>
                    <span className="badge-ok">✓ submitted</span> ·{" "}
                    {formatTime(todaySubmission.linkedinSubmittedAt)}
                  </>
                ) : fresh ? (
                  "Not submitted yet"
                ) : (
                  "auto-draft caption ready"
                )}
              </p>
              <p className="card-cta">
                {todaySubmission.linkedinUrl
                  ? `View Day ${student.currentDay} →`
                  : `Get started → Day ${student.currentDay}`}
              </p>
            </TiltCard>
          </>
        ) : (
          <>
            <TiltCard>
              <svg className="card-icon" viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9.5" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              </svg>
              <p className="card-value">2,400+</p>
              <p className="card-label">students building</p>
              <p className="card-sub">shipping publicly right now</p>
            </TiltCard>

            <TiltCard>
              <div className="ring">
                <span>60d</span>
              </div>
              <p className="card-value">60 days</p>
              <p className="card-label">the challenge</p>
              <p className="card-sub">build daily, post daily</p>
            </TiltCard>

            <TiltCard>
              <svg className="card-icon" viewBox="0 0 24 24">
                <path d="M3 21h18M5 21V10l7-5 7 5v11" />
                <path d="M9 21v-6h6v6" />
              </svg>
              <p className="card-value">40+</p>
              <p className="card-label">colleges</p>
              <p className="card-sub">across India, one streak</p>
            </TiltCard>

            <TiltCard>
              <svg className="card-icon" viewBox="0 0 24 24">
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <p className="card-value">Get noticed</p>
              <p className="card-label">recruiters watching</p>
              <p className="card-sub">60 days of visible proof</p>
            </TiltCard>
          </>
        )}
      </div>


      <TrackFocus />

      <Roadmap />

      <div className="parallax-layer" ref={statusRef} />

    </div>
  );
}


function formatTime(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }).toLowerCase();
}

function TiltCard({ children, to }: { children: React.ReactNode; to?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const inner = ref.current;
    if (!inner) return;
    const rect = inner.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    inner.style.transform = `rotateY(${(px - 0.5) * 12}deg) rotateX(${(0.5 - py) * 12}deg) translateZ(10px)`;
    inner.style.setProperty("--mx", `${px * 100}%`);
    inner.style.setProperty("--my", `${py * 100}%`);
  };

  const onLeave = () => {
    const inner = ref.current;
    if (inner) inner.style.transform = "";
  };

  const interactive = Boolean(to);

  return (
    <div
      className={`tilt-card${interactive ? " is-link" : ""}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...(interactive
        ? {
            role: "link" as const,
            tabIndex: 0,
            onClick: () => navigate({ to: to! }),
            onKeyDown: (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate({ to: to! });
              }
            },
          }
        : {})}
    >
      <div className="tilt-card-inner" ref={ref}>
        <div className="card-glare" />
        {children}
      </div>
    </div>
  );
}

