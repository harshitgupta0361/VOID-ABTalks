import { useEffect, useState } from "react";
import { getSession, subscribeAuth, type Session } from "@/lib/abtalks/auth";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setSession(getSession());
    const unsub = subscribeAuth(() => setSession(getSession()));
    return () => {
      unsub();
    };
  }, []);

  return session;
}
