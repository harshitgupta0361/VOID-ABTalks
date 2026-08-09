import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Copy,
  Github,
  Linkedin,
  Sparkles,
  ExternalLink,
  AlertCircle,
  Lock,
} from "lucide-react";
import { useAbtalks } from "@/hooks/useAbtalks";
import { generateCaption, isValidUrl } from "@/lib/abtalks/service";

export const Route = createFileRoute("/day/$dayId")({
  head: ({ params }) => ({
    meta: [
      { title: `Day ${params.dayId} of 60 — ABTalks Challenge` },
      {
        name: "description",
        content: `Today's task, learning goal and proof submission for Day ${params.dayId} of the ABTalks 60-day coding challenge.`,
      },
      { property: "og:title", content: `Day ${params.dayId} of 60 — ABTalks Challenge` },
      {
        property: "og:description",
        content: "Read, build, prove it with a GitHub link and a LinkedIn post.",
      },
    ],
  }),
  component: DayDetail,
});

function DayDetail() {
  const { dayId } = Route.useParams();
  const dayNum = Number(dayId);
  const navigate = useNavigate();
  const { ready, days, student, getSubmission, getDeadline, submitProof } = useAbtalks();

  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [caption, setCaption] = useState("");
  const [copied, setCopied] = useState(false);
  const [openBrief, setOpenBrief] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const day = days.find((d) => d.day === dayNum);
  const sub = ready && day ? getSubmission(dayNum) : null;

  useEffect(() => {
    if (sub) {
      setGithub(sub.githubUrl ?? "");
      setLinkedin(sub.linkedinUrl ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayNum, ready]);

  const githubOk = useMemo(() => !github || isValidUrl(github, "github.com"), [github]);
  const linkedinOk = useMemo(() => !linkedin || isValidUrl(linkedin, "linkedin.com"), [linkedin]);

  if (!ready) return <div className="min-h-screen bg-background" />;

  if (!day || Number.isNaN(dayNum)) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-4 text-center">
        <div>
          <h1 className="text-2xl font-black">Day not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The challenge runs from Day 1 to Day 60.
          </p>
          <Link
            to="/dashboard"
            className="mt-5 inline-flex h-12 items-center rounded-xl bg-flame px-5 text-sm font-bold text-primary-foreground"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (day.status === "locked") {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-4 text-center">
        <div className="max-w-sm rounded-3xl border border-border bg-card p-8">
          <Lock className="mx-auto size-6 text-muted-foreground" />
          <h1 className="mt-4 text-xl font-black">Day {dayNum} is locked</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Complete Day {student.currentDay} to unlock Day {student.currentDay + 1}. Days open one
            at a time — each has a 24-hour window.
          </p>
          <Link
            to="/day/$dayId"
            params={{ dayId: String(student.currentDay) }}
            className="mt-5 inline-flex h-12 items-center rounded-xl bg-flame px-5 text-sm font-bold text-primary-foreground"
          >
            Go to Day {student.currentDay}
          </Link>
        </div>
      </div>
    );
  }

  const submission = sub!;
  const isPastIncomplete = day.status === "missed" && !submission.complete;
  const deadline = getDeadline(dayNum);
  const canSave = Boolean(github.trim() || linkedin.trim()) && githubOk && linkedinOk;

  function handleSave() {
    submitProof(dayNum, { githubUrl: github, linkedinUrl: linkedin });
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2500);
  }

  function handleCaption() {
    setCaption(generateCaption(day!));
    setCopied(false);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const savedCount = (submission.githubUrl ? 1 : 0) + (submission.linkedinUrl ? 1 : 0);

  return (
    <div className="min-h-screen bg-background pb-20 text-foreground">
      <div className="mx-auto max-w-2xl px-4 pt-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"
        >
          <ArrowLeft className="size-3.5" /> Back to Dashboard
        </Link>

        <div className="mt-4 flex items-center justify-between gap-2">
          {dayNum > 1 ? (
            <Link
              to="/day/$dayId"
              params={{ dayId: String(dayNum - 1) }}
              className="inline-flex h-11 items-center rounded-xl bg-muted px-3 text-xs font-bold"
            >
              ← Day {dayNum - 1}
            </Link>
          ) : (
            <span />
          )}
          {dayNum < 60 &&
            (days.find((d) => d.day === dayNum + 1)?.status === "locked" ? (
              <span
                title={`Complete Day ${dayNum} to unlock Day ${dayNum + 1}`}
                className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-muted/60 px-3 text-xs font-bold text-muted-foreground/70"
              >
                <Lock className="size-3.5" /> Day {dayNum + 1}
              </span>
            ) : (
              <Link
                to="/day/$dayId"
                params={{ dayId: String(dayNum + 1) }}
                className="inline-flex h-11 items-center rounded-xl bg-muted px-3 text-xs font-bold"
              >
                Day {dayNum + 1} →
              </Link>
            ))}
        </div>

        {/* Header */}
        <div className="scene mt-4">
          <div className="card3d rounded-3xl border border-border bg-card p-6">
            <p className="text-xs font-bold tracking-widest text-flame uppercase">
              Day {day.day} of 60 · {day.trackLabel}
            </p>
            <h1 className="mt-2 text-2xl leading-tight font-black">{day.title}</h1>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1.5">
                <Clock className="size-3.5" /> {day.estimatedTime}
              </span>
              <span className="rounded-lg bg-muted px-2.5 py-1.5">{day.difficulty}</span>
              {day.status === "in-progress" && deadline && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1.5 text-muted-foreground">
                  <Clock className="size-3.5" /> {hoursLeft(deadline)}
                </span>
              )}
            </div>
          </div>
        </div>

        {submission.complete && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-success/30 bg-success/10 p-4">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
            <div>
              <p className="text-sm font-black text-success">Both proofs submitted 🎉</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Streak now {student.currentStreak} days.{" "}
                {dayNum < 60 && (
                  <button
                    onClick={() => navigate({ to: "/day/$dayId", params: { dayId: String(dayNum + 1) } })}
                    className="font-bold text-flame underline"
                  >
                    Go to Day {dayNum + 1}
                  </button>
                )}
              </p>
            </div>
          </div>
        )}

        {isPastIncomplete && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-border bg-muted/50 p-4">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              You missed this day. You can still submit late — it won't restore your streak, but it
              counts toward your total progress.
            </p>
          </div>
        )}

        {/* Task */}
        <div className="mt-4 rounded-2xl border border-border bg-card p-5">
          <p className="text-base leading-relaxed font-bold">{day.shortTask}</p>
          <button
            onClick={() => setOpenBrief((o) => !o)}
            className="mt-3 inline-flex h-11 items-center gap-1.5 text-xs font-bold text-flame"
          >
            {openBrief ? "Hide" : "Show"} full brief
            <ChevronDown className={`size-4 transition-transform ${openBrief ? "rotate-180" : ""}`} />
          </button>
          {openBrief && (
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{day.detailedTask}</p>
          )}
          <div className="mt-4 rounded-xl border border-border/70 bg-background/60 p-4">
            <p className="text-[0.7rem] font-bold tracking-widest text-muted-foreground uppercase">
              Learning goal
            </p>
            <p className="mt-1 text-sm">{day.learningGoal}</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {day.resources.map((r) => (
              <a
                key={r.label}
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-muted px-3 text-xs font-semibold"
              >
                {r.label} <ExternalLink className="size-3.5" />
              </a>
            ))}
          </div>
        </div>

        {/* Submission */}
        <div className="mt-4 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-black">Submit your proof</p>
            <span className="text-xs font-semibold text-muted-foreground">
              {savedCount} of 2 submitted
            </span>
          </div>

          {/* GitHub */}
          <div className="mt-4">
            <label className="flex items-center justify-between text-xs font-bold">
              <span className="inline-flex items-center gap-1.5">
                <Github className="size-4" /> GitHub link
              </span>
              <Chip ok={!!submission.githubUrl} at={submission.githubSubmittedAt} />
            </label>
            <input
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              inputMode="url"
              placeholder="https://github.com/you/day-12"
              className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-3 text-base outline-none focus:border-flame"
            />
            {!githubOk && (
              <p className="mt-1.5 text-xs text-muted-foreground">
                That doesn't look like a github.com URL.
              </p>
            )}
          </div>

          {/* LinkedIn */}
          <div className="mt-5">
            <label className="flex items-center justify-between text-xs font-bold">
              <span className="inline-flex items-center gap-1.5">
                <Linkedin className="size-4" /> LinkedIn post link
              </span>
              <Chip ok={!!submission.linkedinUrl} at={submission.linkedinSubmittedAt} />
            </label>
            <input
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              inputMode="url"
              placeholder="https://linkedin.com/posts/..."
              className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-3 text-base outline-none focus:border-flame"
            />
            {!linkedinOk && (
              <p className="mt-1.5 text-xs text-muted-foreground">
                That doesn't look like a linkedin.com URL.
              </p>
            )}

            <button
              onClick={handleCaption}
              className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-flame/50 bg-flame/10 text-sm font-bold text-flame active:scale-95"
            >
              <Sparkles className="size-4" /> Generate Caption
            </button>

            {caption && (
              <div className="mt-3">
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={7}
                  className="w-full rounded-xl border border-border bg-background p-3 text-sm leading-relaxed outline-none focus:border-flame"
                />
                <button
                  onClick={handleCopy}
                  className="mt-2 inline-flex h-12 items-center gap-2 rounded-xl bg-muted px-4 text-sm font-bold active:scale-95"
                >
                  {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
                  {copied ? "Copied" : "Copy caption"}
                </button>
              </div>
            )}
          </div>

          <button
            disabled={!canSave}
            onClick={handleSave}
            className="mt-6 h-13 min-h-12 w-full rounded-2xl bg-flame text-base font-bold text-primary-foreground shadow-[var(--shadow-flame)] transition-transform active:scale-95 disabled:opacity-40 disabled:shadow-none"
          >
            Save proof
          </button>
          {justSaved && (
            <p className="pop-count mt-3 text-center text-sm font-bold text-success">
              Saved · {savedCount} of 2 proofs in 🎉
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function hoursLeft(deadline: number) {
  const ms = deadline - Date.now();
  if (ms <= 0) return "Window closed";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m left` : `${m}m left`;
}

function Chip({ ok, at }: { ok: boolean; at: string | null }) {
  if (!ok)
    return (
      <span className="rounded-lg bg-muted px-2 py-1 text-[0.65rem] font-bold text-muted-foreground">
        Not submitted
      </span>
    );
  return (
    <span className="rounded-lg bg-success/15 px-2 py-1 text-[0.65rem] font-bold text-success">
      Submitted ✅ {at ? new Date(at).toLocaleDateString() : ""}
    </span>
  );
}
