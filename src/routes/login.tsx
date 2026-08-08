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
    const name = email.split("@")[0]!.replace(/[._]/g, " ");
    signIn({ name, email });
    navigate({ to: "/dashboard" });
  }

  return (
    <AuthShell
      title="Welcome back"
      sub="Log in to keep your streak, proofs and badges in one place."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@college.edu" />
        <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
        {error && <p className="text-xs font-semibold text-destructive">{error}</p>}
        <button
          type="submit"
          className="h-12 w-full rounded-xl bg-flame text-sm font-bold text-primary-foreground shadow-[var(--shadow-flame)] active:scale-[0.99]"
        >
          Log in
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link to="/signup" className="font-bold text-foreground underline underline-offset-4">
          Create a free account
        </Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({
  title,
  sub,
  children,
}: {
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="bg-primary px-4 py-10 text-primary-foreground">
        <div className="mx-auto max-w-md">
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm text-primary-foreground/80">{sub}</p>
        </div>
      </section>
      <div className="mx-auto max-w-md px-4 py-10">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">{children}</div>
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
      <span className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 h-12 w-full rounded-xl border border-input bg-background px-3 text-base outline-none focus:border-flame focus:ring-2 focus:ring-flame/30"
      />
    </label>
  );
}
