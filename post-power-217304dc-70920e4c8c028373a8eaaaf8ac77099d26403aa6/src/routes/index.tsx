import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useSession } from "@/hooks/useSession";


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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const visualRef = useRef<HTMLDivElement | null>(null);
  const session = useSession();


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

  // parallax on hero visual
  useEffect(() => {
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
    <div>
      <section className="hero">
        <div className="hero-visual" ref={visualRef} aria-hidden="true">
          <div className="grid-floor" />
          <div className="ember-core">
            <div className="ember-glow ember-glow-1" />
            <div className="ember-glow ember-glow-2" />
            <div className="ember-glow ember-glow-3" />
          </div>
          <canvas id="sparks" ref={canvasRef} />
        </div>

        <div className="hero-content">
          <h1>
            Code every day.
            <br />
            <em>Get seen every day.</em>
          </h1>
          <p className="subhead">
            A 60-day public build challenge for Indian college students. Ship daily, post daily, get
            noticed by recruiters.
          </p>
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

      <div className="deck">
        {session ? (
          <>
            <TiltCard to="/day/4">
              <svg className="card-icon filled" viewBox="0 0 24 24">
                <path d="M12 2c1.5 4 5 5.5 5 9.5A5 5 0 0 1 7 12c0-2 1-3 1-3s.5 1.5 2 2c0-3 2-6 2-9Z" />
              </svg>
              <p className="card-value">4</p>
              <p className="card-label">day streak</p>
              <p className="card-sub">2 freezes left</p>
              <p className="card-cta">View Day 4 →</p>
            </TiltCard>

            <TiltCard>
              <div className="ring">
                <span>20%</span>
              </div>
              <p className="card-value">12/60</p>
              <p className="card-label">days shipped</p>
              <p className="card-sub">day 12 in progress</p>
            </TiltCard>

            <TiltCard>
              <svg className="card-icon" viewBox="0 0 24 24">
                <path d="M9 19c-4 1.5-4-2.5-6-3m12 5v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.2-1.5 6.2-6.7A5.2 5.2 0 0 0 19 3.4a4.8 4.8 0 0 0-.1-3.6s-1.1-.3-3.6 1.4a12.3 12.3 0 0 0-6.6 0C6.2-.5 5.1-.2 5.1-.2A4.8 4.8 0 0 0 5 3.4 5.2 5.2 0 0 0 3.7 7c0 5.2 3.2 6.4 6.2 6.7a3.4 3.4 0 0 0-.9 2.6V20" />
              </svg>
              <p className="card-label">GitHub proof</p>
              <p className="card-sub">
                <span className="badge-ok">✓ submitted</span> · 11:42pm
              </p>
            </TiltCard>

            <TiltCard>
              <svg className="card-icon" viewBox="0 0 24 24">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
              <p className="card-label">LinkedIn proof</p>
              <p className="card-sub">auto-draft caption ready</p>
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


      <div className="status-bar">
        <span className="live-dot" />
        <span>day 12 of 60</span>
        <span className="dot-sep">·</span>
        <span>4-day streak</span>
        <span className="dot-sep">·</span>
        <span>2 freezes left</span>
        <span className="dot-sep">·</span>
        <span>#abtalkschallenge</span>
      </div>
    </div>
  );
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

