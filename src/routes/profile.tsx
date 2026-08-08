import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Camera, LogOut, Trash2, Plus, Check } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { deleteAccount, initials, signOut, updateSession } from "@/lib/abtalks/auth";
import { TRACKS } from "@/lib/abtalks/data";
import { AuthShell, Field, SubmitButton } from "./login";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — ABTalks 60-Day Challenge" },
      {
        name: "description",
        content:
          "Edit your ABTalks student profile: name, college, track, phone, GitHub, LinkedIn and profile picture.",
      },
      { property: "og:title", content: "Your Profile — ABTalks" },
      {
        property: "og:description",
        content: "Manage your student account, extra details and sign-out options.",
      },
    ],
  }),
  component: ProfilePage,
});

const urlOk = (v: string, host: string) => {
  if (!v.trim()) return true;
  if (!v.includes("/") && !v.includes(".")) return /^[a-zA-Z0-9-_.]{2,40}$/.test(v.trim());
  try {
    const u = new URL(v.startsWith("http") ? v : `https://${v}`);
    return u.hostname.includes(host);
  } catch {
    return false;
  }
};
const phoneOk = (v: string) => !v.trim() || /^[+]?[\d][\d\s-]{7,15}$/.test(v.trim());

function ProfilePage() {
  const session = useSession();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [trackId, setTrackId] = useState(TRACKS[0]!.id as string);
  const [phone, setPhone] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [showExtras, setShowExtras] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!session || loaded) return;
    setName(session.name);
    setCollege(session.college ?? "");
    setTrackId(session.trackId ?? TRACKS[0]!.id);
    setPhone(session.phone ?? "");
    setGithub(session.github ?? "");
    setLinkedin(session.linkedin ?? "");
    setAvatar(session.avatar || undefined);
    if (session.phone || session.github || session.linkedin || session.avatar) setShowExtras(true);
    setLoaded(true);
  }, [session, loaded]);

  useEffect(() => {
    if (loaded && !session) navigate({ to: "/login" });
  }, [loaded, session, navigate]);

  if (!session) return <div className="min-h-screen bg-background" />;

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      setError("Profile picture must be under 1.5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(file);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError("Your name can't be empty.");
    if (!phoneOk(phone)) return setError("Enter a valid phone number (8–16 digits).");
    if (!urlOk(github, "github.com")) return setError("Enter a valid GitHub URL or username.");
    if (!urlOk(linkedin, "linkedin.com")) return setError("Enter a valid LinkedIn URL or username.");
    setError("");
    const track = TRACKS.find((t) => t.id === trackId)!;
    updateSession({
      name: name.trim(),
      college: college.trim(),
      track: track.label,
      trackId: track.id,
      phone: phone.trim(),
      github: github.trim(),
      linkedin: linkedin.trim(),
      avatar: avatar ?? "",
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  }

  return (
    <AuthShell
      eyebrow="account"
      title="Your profile"
      sub="Update your details, add extra links, or manage this account."
    >
      <form onSubmit={handleSave} className="space-y-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-2xl border border-border bg-background/60 font-mono text-sm font-semibold text-flame"
            aria-label="Change profile picture"
          >
            {avatar ? (
              <img src={avatar} alt="Your profile" className="size-full object-cover" />
            ) : (
              initials(name || session.name)
            )}
            <span className="absolute right-1 bottom-1 grid size-5 place-items-center rounded-full bg-flame text-primary-foreground">
              <Camera className="size-3" />
            </span>
          </button>
          <div className="min-w-0">
            <p className="font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase">
              Profile picture
            </p>
            <p className="mt-1 text-xs text-muted-foreground">PNG or JPG, under 1.5 MB.</p>
            {avatar && (
              <button
                type="button"
                onClick={() => setAvatar(undefined)}
                className="mt-1 font-mono text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                remove
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPickFile}
          />
        </div>

        <Field label="Full name" value={name} onChange={setName} placeholder="Aisha Verma" />
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
        <label className="block">
          <span className="font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase">
            Email
          </span>
          <input
            value={session.email}
            readOnly
            className="mt-2 h-12 w-full rounded-xl border border-border bg-muted/40 px-3 text-base text-muted-foreground outline-none"
          />
        </label>

        {!showExtras ? (
          <button
            type="button"
            onClick={() => setShowExtras(true)}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase transition-colors hover:border-flame hover:text-foreground"
          >
            <Plus className="size-4" /> Add account details
          </button>
        ) : (
          <div className="space-y-4 rounded-xl border border-border/70 p-4">
            <p className="font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase">
              Extra details · optional
            </p>
            <Field label="Phone" value={phone} onChange={setPhone} placeholder="+91 98765 43210" />
            <p className={`-mt-2 font-mono text-xs ${phoneOk(phone) ? "hidden" : "text-destructive"}`}>
              That phone number doesn't look right.
            </p>
            <Field
              label="GitHub"
              value={github}
              onChange={setGithub}
              placeholder="https://github.com/yourname"
            />
            <p
              className={`-mt-2 font-mono text-xs ${urlOk(github, "github.com") ? "hidden" : "text-destructive"}`}
            >
              Enter a github.com URL or username.
            </p>
            <Field
              label="LinkedIn"
              value={linkedin}
              onChange={setLinkedin}
              placeholder="https://linkedin.com/in/yourname"
            />
            <p
              className={`-mt-2 font-mono text-xs ${urlOk(linkedin, "linkedin.com") ? "hidden" : "text-destructive"}`}
            >
              Enter a linkedin.com URL or username.
            </p>
          </div>
        )}

        {error && <p className="font-mono text-xs text-destructive">{error}</p>}
        {saved && (
          <p className="inline-flex items-center gap-1.5 font-mono text-xs text-flame">
            <Check className="size-3.5" /> Saved — your dashboard is updated.
          </p>
        )}
        <SubmitButton>Save changes</SubmitButton>
      </form>

      <div className="mt-6 space-y-3 border-t border-border pt-6">
        <Link
          to="/dashboard"
          className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-border font-mono text-xs tracking-[0.14em] uppercase transition-colors hover:border-flame"
        >
          Back to dashboard
        </Link>
        <button
          type="button"
          onClick={() => {
            signOut();
            navigate({ to: "/" });
          }}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border font-mono text-xs tracking-[0.14em] uppercase transition-colors hover:border-flame"
        >
          <LogOut className="size-4" /> Sign out
        </button>

        {!confirmDelete ? (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-destructive/40 font-mono text-xs tracking-[0.14em] text-destructive uppercase transition-colors hover:bg-destructive/10"
          >
            <Trash2 className="size-4" /> Delete account
          </button>
        ) : (
          <div className="rounded-xl border border-destructive/40 p-4">
            <p className="text-sm font-semibold">Are you sure? This can't be undone.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Your profile, proofs and streak data will be wiped from this device.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  deleteAccount();
                  navigate({ to: "/" });
                }}
                className="h-11 flex-1 rounded-xl bg-destructive font-mono text-xs tracking-[0.14em] text-destructive-foreground uppercase"
              >
                Yes, delete
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="h-11 flex-1 rounded-xl border border-border font-mono text-xs tracking-[0.14em] uppercase"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </AuthShell>
  );
}
