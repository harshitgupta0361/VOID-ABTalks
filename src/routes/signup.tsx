import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { signIn } from "@/lib/abtalks/auth";
import { TRACKS } from "@/lib/abtalks/data";
import { AuthShell, Field } from "./login";

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
  const [track, setTrack] = useState<string>(TRACKS[0]!.label);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.includes("@") || password.length < 6) {
      setError("Add your name, a valid email and a password of at least 6 characters.");
      return;
    }
    signIn({ name: name.trim(), email, college: college.trim(), track });
    navigate({ to: "/dashboard" });
  }

  return (
    <AuthShell
      title="Start your streak"
      sub="Free for students. Pick a track and Day 1 is waiting for you."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Full name" value={name} onChange={setName} placeholder="Aisha Verma" />
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@college.edu" />
        <Field label="College" value={college} onChange={setCollege} placeholder="NIT Trichy" />
        <label className="block">
          <span className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
            Track
          </span>
          <select
            value={track}
            onChange={(e) => setTrack(e.target.value)}
            className="mt-1.5 h-12 w-full rounded-xl border border-input bg-background px-3 text-base outline-none focus:border-flame"
          >
            {TRACKS.map((t) => (
              <option key={t.id} value={t.label}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="At least 6 characters" />
        {error && <p className="text-xs font-semibold text-destructive">{error}</p>}
        <button
          type="submit"
          className="h-12 w-full rounded-xl bg-flame text-sm font-bold text-primary-foreground shadow-[var(--shadow-flame)] active:scale-[0.99]"
        >
          Create account
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-bold text-foreground underline underline-offset-4">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
