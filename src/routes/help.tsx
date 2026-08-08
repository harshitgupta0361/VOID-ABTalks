import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, LifeBuoy, Mail } from "lucide-react";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & FAQ — ABTalks 60-Day Challenge" },
      {
        name: "description",
        content:
          "How the ABTalks 60-day challenge works: tracks, daily tasks, proofs, streaks, freezes and account questions.",
      },
      { property: "og:title", content: "Help & FAQ — ABTalks" },
      {
        property: "og:description",
        content: "Everything about tracks, proofs, streaks and freezes in one place.",
      },
    ],
  }),
  component: HelpPage,
});

const TOPICS = [
  {
    q: "How does the 60-day challenge work?",
    a: "You pick one track and get one task a day for 60 days. Each task is sized for 45 minutes to 2 hours. Open the day, read the brief, build it, then submit your two proofs.",
  },
  {
    q: "What counts as proof?",
    a: "Two links: a GitHub repository or commit for the code, and a LinkedIn post showing what you built. A day is only complete when both are submitted.",
  },
  {
    q: "How do streaks and freezes work?",
    a: "Your streak is the number of consecutive days you submitted both proofs. You start with 2 streak freezes for the whole challenge — a freeze is used automatically the first two times you miss a day. After that a missed day resets the streak, but never your total completed days.",
  },
  {
    q: "Can I change my track?",
    a: "A track is your 60-day path, so you pick one and stay with it. If you switch, your day counter restarts on the new track.",
  },
  {
    q: "Can I submit a day late?",
    a: "Yes. Open any past day from the dashboard and submit your links. It still counts toward your total progress even if the streak has moved on.",
  },
  {
    q: "Do I need an account?",
    a: "You can browse and try days without one. Creating a free student account keeps your streak, submissions and badges tied to you.",
  },
];

function HelpPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="bg-primary px-4 py-12 text-primary-foreground">
        <div className="mx-auto max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1.5 text-xs font-semibold">
            <LifeBuoy className="size-3.5" /> Help centre
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            Questions, answered
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-primary-foreground/80">
            Everything about tracks, daily tasks, proofs, streaks and your account.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10">
        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {TOPICS.map((t) => (
            <Item key={t.q} {...t} />
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center">
          <Mail className="size-5 shrink-0 text-flame" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            Still stuck? Write to{" "}
            <span className="font-bold text-foreground">help@abtalks.dev</span> and we'll reply
            within a day.
          </p>
          <Link
            to="/dashboard"
            className="ml-auto inline-flex h-11 shrink-0 items-center rounded-xl bg-flame px-4 text-sm font-bold text-primary-foreground"
          >
            Go to dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}

function Item({ q, a }: { q: string; a: string }) {
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
