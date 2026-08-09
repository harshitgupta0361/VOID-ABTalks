import { useEffect, useState } from "react";
import * as svc from "@/lib/abtalks/service";
import { subscribeAuth } from "@/lib/abtalks/auth";

export function useAbtalks() {
  const [, setTick] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    svc.ensureSeeded();
    setReady(true);
    const bump = () => setTick((t) => t + 1);
    const unsub = svc.subscribe(bump);
    const unsubAuth = subscribeAuth(bump);
    return () => {
      unsub();
      unsubAuth();
    };
  }, []);

  return {
    ready,
    student: svc.getStudent(),
    days: svc.getDays(),
    getDay: svc.getDay,
    getSubmission: svc.getSubmission,
    isUnlocked: svc.isUnlocked,
    getDeadline: svc.getDeadline,
    submitProof: svc.submitProof,
    completeProfile: svc.completeProfile,
    dismissNudge: svc.dismissNudge,
    nudgeDismissed: svc.isNudgeDismissed(),
  };
}

