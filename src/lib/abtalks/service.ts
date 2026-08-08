import { getSession } from "./auth";
import { CHALLENGE_DAYS, CURRENT_DAY, STUDENT } from "./data";
import type { ChallengeDay, Student, Submission } from "./types";

const SUB_KEY = "abtalks.submissions.v1";
const PROFILE_KEY = "abtalks.profileComplete.v1";
const NUDGE_KEY = "abtalks.nudgeDismissed.v1";

const listeners = new Set<() => void>();
export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
function emit() {
  listeners.forEach((l) => l());
}

function readAll(): Record<string, Submission> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(SUB_KEY) ?? "{}");
  } catch {
    return {};
  }
}
function writeAll(map: Record<string, Submission>) {
  window.localStorage.setItem(SUB_KEY, JSON.stringify(map));
  emit();
}

function seed(): Record<string, Submission> {
  const map: Record<string, Submission> = {};
  for (const d of CHALLENGE_DAYS) {
    if (d.status === "completed") {
      const at = new Date(Date.now() - (CURRENT_DAY - d.day) * 86400000).toISOString();
      map[d.day] = {
        day: d.day,
        githubUrl: `https://github.com/ananyab/abtalks-day-${d.day}`,
        githubSubmittedAt: at,
        linkedinUrl: `https://linkedin.com/posts/ananyab-day-${d.day}`,
        linkedinSubmittedAt: at,
        complete: true,
      };
    }
  }
  return map;
}

export function ensureSeeded() {
  if (typeof window === "undefined") return;
  if (!window.localStorage.getItem(SUB_KEY)) writeAll(seed());
}

export function getSubmissions(): Record<string, Submission> {
  const map = readAll();
  return Object.keys(map).length ? map : seed();
}

export function getSubmission(day: number): Submission {
  return (
    getSubmissions()[day] ?? {
      day,
      githubUrl: null,
      githubSubmittedAt: null,
      linkedinUrl: null,
      linkedinSubmittedAt: null,
      complete: false,
    }
  );
}

export function submitProof(day: number, proof: { githubUrl?: string; linkedinUrl?: string }) {
  const map = { ...getSubmissions() };
  const prev = getSubmission(day);
  const now = new Date().toISOString();
  const next: Submission = {
    ...prev,
    githubUrl: proof.githubUrl?.trim() ? proof.githubUrl.trim() : prev.githubUrl,
    githubSubmittedAt: proof.githubUrl?.trim() ? now : prev.githubSubmittedAt,
    linkedinUrl: proof.linkedinUrl?.trim() ? proof.linkedinUrl.trim() : prev.linkedinUrl,
    linkedinSubmittedAt: proof.linkedinUrl?.trim() ? now : prev.linkedinSubmittedAt,
    complete: false,
  };
  next.complete = Boolean(next.githubUrl && next.linkedinUrl);
  map[day] = next;
  writeAll(map);
  return next;
}

export function getDays(): ChallengeDay[] {
  const subs = getSubmissions();
  return CHALLENGE_DAYS.map((d) => {
    if (subs[d.day]?.complete) return { ...d, status: "completed" as const };
    if (d.status === "completed") return { ...d, status: "missed" as const };
    return d;
  });
}

export function getDay(id: number): ChallengeDay | undefined {
  return getDays().find((d) => d.day === id);
}

/** Streak + freeze engine. Walks days 1..currentDay applying freezes to gaps. */
export function getStudent(): Student {
  const days = getDays();
  const upTo = days.filter((d) => d.day <= CURRENT_DAY);
  const totalFreezes = 2;
  let freezesUsed = 0;
  let streak = 0;
  let longest = 0;
  let completed = 0;
  let missed = 0;

  for (const d of upTo) {
    if (d.status === "completed") {
      completed++;
      streak++;
    } else if (d.day === CURRENT_DAY) {
      continue; // today isn't missed yet
    } else {
      missed++;
      if (freezesUsed < totalFreezes) {
        freezesUsed++; // freeze absorbs the miss, streak survives
      } else {
        streak = 0;
      }
    }
    longest = Math.max(longest, streak);
  }

  const profileComplete =
    typeof window !== "undefined" && window.localStorage.getItem(PROFILE_KEY) === "true";

  const badges = STUDENT.badges.map((b) => ({
    ...b,
    earned:
      (b.id === "first-proof" && completed >= 1) ||
      (b.id === "week-one" && longest >= 7) ||
      (b.id === "night-owl" && completed >= 3) ||
      (b.id === "half-way" && completed >= 30) ||
      (b.id === "finisher" && completed >= 60),
  }));

  const session = getSession();

  return {
    ...STUDENT,
    ...(session
      ? {
          id: `stu_${session.email}`,
          name: session.name,
          college: session.college?.trim() ? session.college : "Add your college",
          track: session.track ?? STUDENT.track,
          trackId: session.trackId ?? STUDENT.trackId,
        }
      : {}),
    currentStreak: streak,
    longestStreak: Math.max(longest, streak),
    freezesAvailable: totalFreezes - freezesUsed,
    freezesUsed,
    totalCompleted: completed,
    totalMissed: missed,
    badges,
    profileComplete,
  };
}

export function completeProfile() {
  window.localStorage.setItem(PROFILE_KEY, "true");
  emit();
}

export function isNudgeDismissed() {
  return typeof window !== "undefined" && window.localStorage.getItem(NUDGE_KEY) === "true";
}
export function dismissNudge() {
  window.localStorage.setItem(NUDGE_KEY, "true");
  emit();
}

export function generateCaption(day: ChallengeDay) {
  return `Day ${day.day}/60 of #ABTalksChallenge: ${day.title.toLowerCase()} — shipped it today.\n\nKey learning: ${day.learningGoal}\n\nOnward to Day ${Math.min(day.day + 1, 60)}. 🔥\n\n#buildinpublic #${day.trackId} #100DaysOfCode`;
}

export function isValidUrl(value: string, host: string) {
  try {
    const u = new URL(value);
    return u.protocol.startsWith("http") && u.hostname.includes(host);
  } catch {
    return false;
  }
}
