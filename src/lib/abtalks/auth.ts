const KEY = "abtalks.session.v1";

export type Session = {
  name: string;
  email: string;
  college?: string;
  track?: string;
  trackId?: string;
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

export function signOut() {
  window.localStorage.removeItem(KEY);
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
