import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { signIn } from "@/lib/abtalks/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Student Log in — ABTalks" },
      {
        name: "description",
        content: "Log in to your ABTalks student account to keep your streak, proofs and badges.",
      },
      { property: "og:title", content: "Student Log in — ABTalks" },
      { property: "og:description", content: "Pick up your 60-day streak where you left off." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@") || password.length < 6) {
      setError("Enter a valid email and a password of at least 6 characters.");
      return;
    }
    const raw = email.split("@")[0]!.replace(/[._-]+/g, " ").trim();
    const name = raw
      .split(" ")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ");
    signIn({ name, email });
    navigate({ to: "/dashboard" });
  }

  return (
    <AuthShell
      eyebrow="student access"
      title="Welcome back"
      sub="Log in to keep your streak, proofs and badges in one place."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@college.edu" />
        <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
        {error && <p className="font-mono text-xs text-destructive">{error}</p>}
        <SubmitButton>Log in</SubmitButton>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link to="/signup" className="font-semibold text-flame underline underline-offset-4">
          Create a free account
        </Link>
      </p>
    </AuthShell>
  );
}

export function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="h-12 w-full rounded-xl bg-flame font-mono text-sm font-semibold tracking-wide text-primary-foreground transition-transform active:scale-[0.99]"
    >
      {children}
    </button>
  );
}

export function AuthShell({
  eyebrow,
  title,
  sub,
  children,
}: {
  eyebrow: string;
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="grid-floor pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute -top-32 left-1/2 size-[420px] -translate-x-1/2">
        <div className="ember-glow ember-glow-1" />
        <div className="ember-glow ember-glow-2" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-28">
        <p className="font-mono text-[0.7rem] tracking-[0.28em] text-flame uppercase">{eyebrow}</p>
        <h1 className="font-display mt-3 text-4xl leading-tight font-medium tracking-tight">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{sub}</p>

        <div className="mt-8 rounded-2xl border border-border bg-card/70 p-6 shadow-[0_26px_50px_-30px_oklch(0_0_0/75%)] backdrop-blur-xl">
          {children}
        </div>

        <Link
          to="/"
          className="mt-6 text-center font-mono text-xs text-muted-foreground hover:text-foreground"
        >
          ← back to abtalks
        </Link>
      </div>
    </div>
  );
}

export function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 h-12 w-full rounded-xl border border-border bg-background/60 px-3 text-base outline-none transition-colors focus:border-flame focus:ring-2 focus:ring-flame/25"
      />
    </label>
  );
}
