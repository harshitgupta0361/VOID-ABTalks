const KEY = "abtalks.session.v1";

export type Session = {
  name: string;
  email: string;
  college?: string;
  track?: string;
  trackId?: string;
  phone?: string;
  github?: string;
  linkedin?: string;
  avatar?: string;
};

type Listener = () => void;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

export function subscribeAuth(fn: Listener) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function signIn(session: Session) {
  window.localStorage.setItem(KEY, JSON.stringify(session));
  emit();
}

/** Patch the stored session (used by profile editing). */
export function updateSession(patch: Partial<Session>) {
  const current = getSession();
  if (!current) return null;
  const next = { ...current, ...patch };
  window.localStorage.setItem(KEY, JSON.stringify(next));
  emit();
  return next;
}

export function signOut() {
  window.localStorage.removeItem(KEY);
  emit();
}

/** Wipes the session AND every locally stored abtalks demo record. */
export function deleteAccount() {
  if (typeof window === "undefined") return;
  const keys: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (k?.startsWith("abtalks.")) keys.push(k);
  }
  keys.forEach((k) => window.localStorage.removeItem(k));
  emit();
}

export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
