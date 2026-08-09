import { getSession } from "./auth";
import { buildDaysForTrack, CHALLENGE_DAYS, CURRENT_DAY, STUDENT } from "./data";
import type { ChallengeDay, DayStatus, Student, Submission } from "./types";

const SUB_KEY = "abtalks.submissions.v1";
const PROFILE_KEY = "abtalks.profileComplete.v1";
const NUDGE_KEY = "abtalks.nudgeDismissed.v1";
const FRESH_KEY = "abtalks.freshAccount.v1";

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

/** True for an account created in this browser that hasn't shipped anything yet. */
export function isFreshAccount() {
  return typeof window !== "undefined" && window.localStorage.getItem(FRESH_KEY) === "true";
}

/** Called on signup: wipes demo progress so every counter starts at zero. */
export function markFreshAccount() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FRESH_KEY, "true");
  window.localStorage.removeItem(PROFILE_KEY);
  window.localStorage.removeItem("abtalks.unlocks.v1");
  writeAll({});
}

export function ensureSeeded() {
  if (typeof window === "undefined") return;
  if (isFreshAccount()) {
    if (!window.localStorage.getItem(SUB_KEY)) writeAll({});
    return;
  }
  if (!window.localStorage.getItem(SUB_KEY)) writeAll(seed());
}

export function getSubmissions(): Record<string, Submission> {
  const map = readAll();
  if (isFreshAccount()) return map;
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

const UNLOCK_KEY = "abtalks.unlocks.v1";
const DAY_MS = 86400000;

function readUnlocks(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(UNLOCK_KEY) ?? "{}");
  } catch {
    return {};
  }
}

/** Walks the 60 days applying sequential unlocking + the 24h window. */
function computeGating(): {
  status: Record<number, DayStatus>;
  unlockedAt: Record<number, number>;
  active: number;
} {
  const subs = getSubmissions();
  const stored = readUnlocks();
  const unlockedAt: Record<number, number> = {};
  for (const [k, v] of Object.entries(stored)) {
    const t = Date.parse(v);
    if (!Number.isNaN(t)) unlockedAt[Number(k)] = t;
  }
  const now = Date.now();
  if (!unlockedAt[1]) unlockedAt[1] = now;

  const status: Record<number, DayStatus> = {};
  let active = 1;

  for (let day = 1; day <= 60; day++) {
    const ua = unlockedAt[day];
    if (ua === undefined) {
      status[day] = "locked";
      continue;
    }
    const sub = subs[day];
    if (sub?.complete) {
      status[day] = "completed";
      const done = Math.max(
        Date.parse(sub.githubSubmittedAt ?? "") || 0,
        Date.parse(sub.linkedinSubmittedAt ?? "") || 0,
      );
      if (day < 60 && unlockedAt[day + 1] === undefined) unlockedAt[day + 1] = done || ua;
      active = Math.min(day + 1, 60);
    } else if (now > ua + DAY_MS) {
      status[day] = "missed";
      if (day < 60 && unlockedAt[day + 1] === undefined) unlockedAt[day + 1] = ua + DAY_MS;
      active = Math.min(day + 1, 60);
    } else {
      status[day] = "in-progress";
      active = day;
      for (let rest = day + 1; rest <= 60; rest++) status[rest] = "locked";
      break;
    }
  }

  // persist any newly-derived unlock timestamps (no emit — avoids render loops)
  if (typeof window !== "undefined") {
    const next: Record<string, string> = {};
    for (const [k, v] of Object.entries(unlockedAt)) next[k] = new Date(v).toISOString();
    const serialized = JSON.stringify(next);
    if (serialized !== JSON.stringify(stored)) window.localStorage.setItem(UNLOCK_KEY, serialized);
  }

  return { status, unlockedAt, active };
}

export function getDays(): ChallengeDay[] {
  const session = getSession();
  const source = buildDaysForTrack(session?.trackId ?? STUDENT.trackId);
  const { status } = computeGating();
  return source.map((d) => ({ ...d, status: status[d.day] ?? "locked" }));
}

/** True when a day is reachable (unlocked) — locked days are view-only. */
export function isUnlocked(day: number) {
  return computeGating().status[day] !== "locked";
}

/** Epoch ms when the 24h window for a day closes, or null when locked. */
export function getDeadline(day: number): number | null {
  const { unlockedAt } = computeGating();
  const ua = unlockedAt[day];
  return ua === undefined ? null : ua + DAY_MS;
}

/** The day the student is actually on right now. */
export function getCurrentDay(): number {
  return computeGating().active;
}

export function getDay(id: number): ChallengeDay | undefined {
  return getDays().find((d) => d.day === id);
}


/** Streak + freeze engine. Walks days 1..currentDay applying freezes to gaps. */
export function getStudent(): Student {
  const days = getDays();
  const current = getCurrentDay();
  const upTo = days.filter((d) => d.day <= current);
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
    } else if (d.day === current) {
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

  const sess = getSession();
  const filled = (v?: string | null) => Boolean(v && v.trim());
  const profileComplete = Boolean(
    sess &&
      filled(sess.name) &&
      filled(sess.email) &&
      filled(sess.college) &&
      filled(sess.track) &&
      filled(sess.phone) &&
      filled(sess.github) &&
      filled(sess.linkedin) &&
      filled(sess.avatar),
  );


  const longestOverall = Math.max(longest, streak);
  const badges = STUDENT.badges.map((b) => ({
    ...b,
    earned:
      (b.id === "first-proof" && completed >= 1) ||
      (b.id === "week-one" && longestOverall >= 7) ||
      (b.id === "night-owl" && completed >= 3) ||
      (b.id === "consistent" && completed >= 10) ||
      (b.id === "half-way" && completed >= 30) ||
      (b.id === "finisher" && completed >= 60),
  }));

  const session = getSession();

  return {
    ...STUDENT,
    currentDay: current,
    ...(session
      ? {
          id: `stu_${session.email}`,
          name: session.name,
          college: session.college?.trim() ? session.college : "Add your college",
          track: session.track ?? STUDENT.track,
          trackId: session.trackId ?? STUDENT.trackId,
          email: session.email,
          phone: session.phone,
          github: session.github,
          linkedin: session.linkedin,
          avatar: session.avatar,
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

/** Most recent missed day (<= today), or null when nothing was missed. */
export function getLatestMissedDay(): number | null {
  const missed = getDays().filter((d) => d.day <= getCurrentDay() && d.status === "missed");
  return missed.length ? missed[missed.length - 1]!.day : null;
}

/** Today's in-progress day (or the most recent day available). */
export function getLatestDay(): number {
  return getCurrentDay();
}
