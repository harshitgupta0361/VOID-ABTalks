import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Flame,
  Github,
  Linkedin,
  ArrowRight,
  Snowflake,
  Rocket,
  Target,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { TRACKS } from "@/lib/abtalks/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ABTalks — Code Every Day. Get Seen Every Day." },
      {
        name: "description",
        content:
          "A 60-day public coding challenge for Indian college students. One task a day, two proofs, one streak.",
      },
      { property: "og:title", content: "ABTalks — Code Every Day. Get Seen Every Day." },
      {
        property: "og:description",
        content: "Build daily, post daily, get noticed by recruiters. 60 days, no login needed.",
      },
    ],
  }),
  component: Landing,
});

const FAQS = [
  {
    q: "What if I miss a day?",
    a: "Nothing dramatic. You start with 2 streak freezes — a freeze is automatically used to protect your streak the first two times you miss. After that your streak resets, but every day you complete still counts toward your total progress, and you can always submit a missed day late.",
  },
  {
    q: "Do I need to already know how to code?",
    a: "No. Day 1 of every track assumes zero prior context. Tasks start at 45 minutes and grow with you.",
  },
  {
    q: "Is this free?",
    a: "Yes. ABTalks is completely free. You need a GitHub account and a LinkedIn account — both free too.",
  },
];

const QUOTES = [
  {
    name: "Rahul M.",
    college: "NIT Trichy",
    track: "DSA",
    text: "I posted 41 days straight. Two recruiters found me from my LinkedIn, not my resume.",
  },
  {
    name: "Sneha K.",
    college: "SRM Chennai",
    track: "Full Stack Web Dev",
    text: "The caption generator is the reason I didn't quit on day 9. One tap and I'm done.",
  },
  {
    name: "Aman P.",
    college: "IIIT Bhubaneswar",
    track: "Mobile / App Dev",
    text: "Missed two days during exams. The freezes meant I didn't feel like a failure and just kept going.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Hero */}
      <section className="scene ember-grid relative overflow-hidden px-4 pt-14 pb-16">
        <div className="mx-auto max-w-5xl">
          <p className="tilt-in inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs font-semibold text-muted-foreground">
            <span className="size-1.5 rounded-full bg-flame" /> 60 days · 1 task a day · 2 proofs
          </p>
          <h1 className="tilt-in mt-5 text-[2.6rem] leading-[1.05] font-black tracking-tight sm:text-6xl">
            Code Every Day.
            <br />
            <span className="text-flame">Get Seen Every Day.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            A 60-day public challenge for Indian college students — build daily, post daily, get
            noticed by recruiters.
          </p>
          <Link
            to="/dashboard"
            className="mt-7 inline-flex h-13 min-h-12 items-center gap-2 rounded-2xl bg-flame px-6 text-base font-bold text-primary-foreground shadow-[var(--shadow-flame)] transition-transform active:scale-95"
          >
            Start Day 1 <ArrowRight className="size-5" />
          </Link>

          <div className="float3d mt-12 rounded-3xl border border-border bg-card/80 p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                Day 12 of 60
              </span>
              <span className="inline-flex items-center gap-1 text-sm font-black text-flame">
                <Flame className="size-4" /> 6
              </span>
            </div>
            <p className="mt-3 text-lg font-bold">Build a REST API with Express</p>
            <div className="mt-4 flex gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-success/15 px-2.5 py-1.5 text-xs font-semibold text-success">
                <Github className="size-3.5" /> Submitted
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1.5 text-xs font-semibold text-muted-foreground">
                <Linkedin className="size-3.5" /> Not submitted
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <Section title="How it works">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { icon: Target, t: "Pick a track", d: "A track is your 60-day learning path — Web Dev, DSA, ML or App Dev." },
            { icon: Rocket, t: "Build daily", d: "One task a day, sized for 45 minutes to 2 hours." },
            { icon: Flame, t: "Prove it", d: "Proof = a GitHub link + a LinkedIn post. Both, every day." },
          ].map((s, i) => (
            <div key={s.t} className="rounded-2xl border border-border bg-card p-5">
              <s.icon className="size-6 text-flame" />
              <p className="mt-3 text-sm font-black">
                {i + 1}. {s.t}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Trust strip */}
      <div className="border-y border-border bg-card/50 px-4 py-5">
        <p className="mx-auto max-w-5xl text-center text-sm font-semibold text-muted-foreground">
          2,400+ students · 40+ colleges · 60 days · 2 proofs a day
        </p>
      </div>

      {/* Tracks */}
      <Section title="Pick your track" sub="A track decides what you build for 60 days. You can only pick one.">
        <div className="scene -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4">
          {TRACKS.map((t) => (
            <div
              key={t.id}
              className="card3d w-[78vw] max-w-[300px] shrink-0 snap-start rounded-2xl border border-border bg-card p-5"
            >
              <p className="text-base font-black">{t.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t.blurb}</p>
              <div className="mt-4 rounded-xl border border-border/70 bg-background/60 p-3">
                <p className="text-[0.7rem] font-bold tracking-widest text-flame uppercase">Day 1</p>
                <p className="mt-1 text-sm leading-relaxed">{t.day1}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Social proof */}
      <Section title="From students already in it">
        <div className="grid gap-3 sm:grid-cols-3">
          {QUOTES.map((q) => (
            <figure key={q.name} className="rounded-2xl border border-border bg-card p-5">
              <blockquote className="text-sm leading-relaxed">“{q.text}”</blockquote>
              <figcaption className="mt-3 text-xs text-muted-foreground">
                <span className="font-bold text-foreground">{q.name}</span> · {q.college} · {q.track}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* Streak explainer */}
      <Section
        title="How the streak works"
        sub="A streak is the number of days in a row you submitted both proofs."
      >
        <div className="scene rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-center gap-2 text-sm font-bold">
            {["Day", "Commit", "Post", "Streak +1"].map((s, i) => (
              <span key={s} className="flex items-center gap-2">
                <span
                  className={`rounded-xl px-3 py-2 ${i === 3 ? "bg-flame text-primary-foreground" : "bg-muted text-foreground"}`}
                >
                  {s}
                </span>
                {i < 3 && <ArrowRight className="size-4 text-muted-foreground" />}
              </span>
            ))}
          </div>
          <div className="mt-5 flex gap-3 rounded-xl border border-border/70 bg-background/60 p-4">
            <Snowflake className="size-5 shrink-0 text-muted-foreground" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-bold text-foreground">Streak freezes:</span> you get 2 for the
              whole 60 days. Miss a day and a freeze is used automatically so your streak survives.
              Once both are gone, a missed day resets the streak — but never your total progress.
            </p>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section title="Questions">
        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {FAQS.map((f) => (
            <Faq key={f.q} {...f} />
          ))}
        </div>
      </Section>

      {/* Final CTA */}
      <section className="ember-grid px-4 py-14 text-center">
        <h2 className="text-2xl font-black">Day 1 takes 45 minutes.</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          No signup, no payment. Start now and post your first proof tonight.
        </p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex h-13 min-h-12 items-center gap-2 rounded-2xl bg-flame px-6 text-base font-bold text-primary-foreground shadow-[var(--shadow-flame)] active:scale-95"
        >
          Start Your Streak <Flame className="size-5" />
        </Link>
      </section>

      <footer className="bg-primary px-4 py-10 text-center text-xs text-primary-foreground/80">
        <p className="text-sm font-extrabold text-primary-foreground">ABTalks</p>
        <p className="mt-2">Built for Indian college students · Demo data</p>
      </footer>
    </div>
  );
}

function Section({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h2 className="text-xl font-black tracking-tight">{title}</h2>
      {sub && <p className="mt-1.5 text-sm text-muted-foreground">{sub}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-12 w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-bold"
      >
        {q}
        <ChevronDown className={`size-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">{a}</p>}
    </div>
  );
}
