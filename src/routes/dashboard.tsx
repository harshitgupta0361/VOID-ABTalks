import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Flame, Snowflake, Info, X, Lock, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { useAbtalks } from "@/hooks/useAbtalks";
import { useSession } from "@/hooks/useSession";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your Dashboard — ABTalks 60-Day Challenge" },
      {
        name: "description",
        content: "Track your streak, today's task, progress and badges across the 60-day challenge.",
      },
      { property: "og:title", content: "Your Dashboard — ABTalks" },
      { property: "og:description", content: "Where am I? What do I do today? Am I okay?" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { ready, student, days, getSubmission, completeProfile, dismissNudge, nudgeDismissed } =
    useAbtalks();
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !session) navigate({ to: "/login" });
  }, [ready, session, navigate]);

  if (!ready || !session) return <div className="min-h-screen bg-background" />;

  const today = days.find((d) => d.day === student.currentDay)!;
  const todaySub = getSubmission(student.currentDay);
  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .join("");
  const rate = Math.round(
    (student.totalCompleted / Math.max(1, student.totalCompleted + student.totalMissed)) * 100,
  );

  return (
    <div className="min-h-screen bg-background pb-16 text-foreground">
      <div className="mx-auto max-w-2xl px-4 pt-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-flame text-base font-black text-primary-foreground">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-black">{student.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {student.college} · {student.track}
            </p>
            <p className="truncate font-mono text-[0.65rem] text-muted-foreground/80">
              {session.email}
            </p>
          </div>

          <Link to="/" className="ml-auto text-xs font-semibold text-muted-foreground">
            Home
          </Link>
        </div>

        {!student.profileComplete && !nudgeDismissed && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-flame" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">Complete your profile</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Add your graduation year and skills so recruiters can find you.
              </p>
              <button
                onClick={completeProfile}
                className="mt-3 h-11 rounded-xl bg-flame px-4 text-sm font-bold text-primary-foreground active:scale-95"
              >
                Complete now
              </button>
            </div>
            <button
              aria-label="Dismiss"
              onClick={dismissNudge}
              className="grid size-11 shrink-0 place-items-center text-muted-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        {/* Streak card */}
        <div className="scene mt-4">
          <div className="card3d relative overflow-hidden rounded-3xl border border-border bg-card p-6">
            <div className="ember-grid pointer-events-none absolute inset-0 opacity-60" />
            <div className="relative">
              <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                Current streak
              </p>
              {student.currentStreak > 0 ? (
                <div className="mt-2 flex items-end gap-3">
                  <span key={student.currentStreak} className="pop-count text-6xl font-black text-flame">
                    {student.currentStreak}
                  </span>
                  <Flame className="flame-pulse mb-2 size-9 text-flame" />
                  <span className="mb-3 text-sm font-semibold text-muted-foreground">days</span>
                </div>
              ) : (
                <p className="mt-3 text-2xl font-black">Your streak starts today. Let's go. 🔥</p>
              )}
              <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-xl bg-muted px-3 py-2">
                  Longest: {student.longestStreak} days
                </span>
                <span
                  className="inline-flex items-center gap-1.5 rounded-xl bg-muted px-3 py-2"
                  title="A freeze protects your streak automatically when you miss a day. You get 2 for the whole challenge."
                >
                  <Snowflake className="size-3.5" /> {student.freezesAvailable} freeze
                  {student.freezesAvailable === 1 ? "" : "s"} left
                  <Info className="size-3.5 text-muted-foreground" />
                </span>
              </div>
              {student.freezesUsed > 0 && (
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {student.freezesUsed} freeze{student.freezesUsed > 1 ? "s" : ""} used to cover a
                  missed day — your streak kept going.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Today's task */}
        <div className="mt-4 rounded-2xl border border-border bg-card p-5">
          <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
            Today · Day {today.day}
          </p>
          {todaySub.complete ? (
            <>
              <p className="mt-2 flex items-center gap-2 text-lg font-black text-success">
                <CheckCircle2 className="size-5" /> Today's done.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Come back tomorrow for Day {today.day + 1}.
              </p>
            </>
          ) : (
            <>
              <p className="mt-2 text-lg font-black">{today.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {today.shortTask}
              </p>
              <Link
                to="/day/$dayId"
                params={{ dayId: String(today.day) }}
                className="mt-4 inline-flex h-12 items-center gap-2 rounded-xl bg-flame px-5 text-sm font-bold text-primary-foreground active:scale-95"
              >
                Open today's task <ArrowRight className="size-4" />
              </Link>
            </>
          )}
        </div>

        {/* Progress */}
        <div className="mt-4 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-baseline justify-between">
            <p className="text-sm font-black">Day {student.currentDay} of 60</p>
            <p className="text-xs text-muted-foreground">{student.totalCompleted} completed</p>
          </div>
          <div className="mt-3 flex gap-[2px]">
            {days.map((d) => (
              <span
                key={d.day}
                className={`h-3 flex-1 rounded-[2px] ${
                  d.status === "completed"
                    ? "bg-flame"
                    : d.status === "missed"
                      ? "bg-neutralish/40"
                      : d.status === "in-progress"
                        ? "bg-flame-soft"
                        : "bg-muted"
                }`}
              />
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-[0.7rem] text-muted-foreground">
            <Legend className="bg-flame" label="Completed" />
            <Legend className="bg-flame-soft" label="Today" />
            <Legend className="bg-neutralish/40" label="Missed" />
            <Legend className="bg-muted" label="Upcoming" />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <Stat label="Completed" value={student.totalCompleted} />
          <Stat
            label="Missed"
            value={student.totalMissed}
            muted
            title="Missed days happen. Keep building."
          />
          <Stat label="Completion" value={`${rate}%`} />
        </div>

        {/* Achievements */}
        <div className="mt-4 rounded-2xl border border-border bg-card p-5">
          <p className="text-sm font-black">Achievements</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {student.badges.map((b) => (
              <span
                key={b.id}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold ${
                  b.earned
                    ? "bg-flame/15 text-flame"
                    : "bg-muted text-muted-foreground opacity-60"
                }`}
              >
                {b.earned ? <Sparkles className="size-3.5" /> : <Lock className="size-3.5" />}
                {b.label}
              </span>
            ))}
          </div>
          {!student.badges.some((b) => b.earned) && (
            <p className="mt-3 text-xs text-muted-foreground">
              Earn your first badge — submit Day 1.
            </p>
          )}
        </div>

        {/* Mini timeline */}
        <div className="mt-4 rounded-2xl border border-border bg-card p-5">
          <p className="text-sm font-black">60-day timeline</p>
          <div className="mt-3 grid grid-cols-10 gap-1.5">
            {days.map((d) => (
              <Link
                key={d.day}
                to="/day/$dayId"
                params={{ dayId: String(d.day) }}
                title={`Day ${d.day} · ${d.status}`}
                className={`grid aspect-square place-items-center rounded-md text-[0.6rem] font-bold transition-transform active:scale-90 ${
                  d.status === "completed"
                    ? "bg-flame text-primary-foreground"
                    : d.status === "missed"
                      ? "bg-neutralish/30 text-muted-foreground"
                      : d.status === "in-progress"
                        ? "bg-flame-soft text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                }`}
              >
                {d.day}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`size-2.5 rounded-[2px] ${className}`} /> {label}
    </span>
  );
}

function Stat({
  label,
  value,
  muted,
  title,
}: {
  label: string;
  value: number | string;
  muted?: boolean;
  title?: string;
}) {
  return (
    <div title={title} className="rounded-2xl border border-border bg-card p-4 text-center">
      <p className={`text-2xl font-black ${muted ? "text-muted-foreground" : "text-foreground"}`}>
        {value}
      </p>
      <p className="mt-1 text-[0.7rem] font-semibold text-muted-foreground">{label}</p>
    </div>
  );
}
