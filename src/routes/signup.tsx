import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { signIn } from "@/lib/abtalks/auth";
import { markFreshAccount } from "@/lib/abtalks/service";
import { TRACKS } from "@/lib/abtalks/data";
import { toast } from "sonner";
import { AuthShell, Field, SubmitButton } from "./login";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Student Sign up — ABTalks 60-Day Challenge" },
      {
        name: "description",
        content:
          "Create a free ABTalks student account, pick your track and start Day 1 of the 60-day coding challenge tonight.",
      },
      { property: "og:title", content: "Student Sign up — ABTalks" },
      { property: "og:description", content: "Free for Indian college students. Start Day 1 today." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("");
  const [password, setPassword] = useState("");
  const [trackId, setTrackId] = useState<string>(TRACKS[0]!.id);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.includes("@") || password.length < 6) {
      setError("Add your name, a valid email and a password of at least 6 characters.");
      return;
    }
    const track = TRACKS.find((t) => t.id === trackId)!;
    markFreshAccount();
    signIn({
      name: name.trim(),
      email: email.trim(),
      college: college.trim(),
      track: track.label,
      trackId: track.id,
    });
    toast.success("Account created successfully", {
      description: `Welcome, ${name.trim()} — Day 1 is waiting.`,
      duration: 2200,
    });
    setTimeout(() => navigate({ to: "/" }), 900);
  }

  return (
    <AuthShell
      eyebrow="join the challenge"
      title="Start your streak"
      sub="Free for students. Pick a track and Day 1 is waiting for you."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Full name" value={name} onChange={setName} placeholder="Aisha Verma" />
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@college.edu" />
        <Field label="College" value={college} onChange={setCollege} placeholder="NIT Trichy" />
        <label className="block">
          <span className="font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase">
            Track
          </span>
          <select
            value={trackId}
            onChange={(e) => setTrackId(e.target.value)}
            className="mt-2 h-12 w-full rounded-xl border border-border bg-background/60 px-3 text-base outline-none transition-colors focus:border-flame focus:ring-2 focus:ring-flame/25"
          >
            {TRACKS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="At least 6 characters" />
        {error && <p className="font-mono text-xs text-destructive">{error}</p>}
        <SubmitButton>Create account</SubmitButton>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-flame underline underline-offset-4">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
