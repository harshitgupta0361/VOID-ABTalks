import { useEffect, useState } from "react";
import * as svc from "@/lib/abtalks/service";

export function useAbtalks() {
  const [, setTick] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    svc.ensureSeeded();
    setReady(true);
    const unsub = svc.subscribe(() => setTick((t) => t + 1));
    return () => {
      unsub();
    };
  }, []);

  return {
    ready,
    student: svc.getStudent(),
    days: svc.getDays(),
    getDay: svc.getDay,
    getSubmission: svc.getSubmission,
    submitProof: svc.submitProof,
    completeProfile: svc.completeProfile,
    dismissNudge: svc.dismissNudge,
    nudgeDismissed: svc.isNudgeDismissed(),
  };
}
