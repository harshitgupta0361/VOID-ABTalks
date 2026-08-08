import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Flame, LogOut } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { initials, signOut } from "@/lib/abtalks/auth";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/help", label: "Help" },
] as const;

export function SiteNav() {
  const [hidden, setHidden] = useState(false);
  const [hovering, setHovering] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    lastY.current = window.scrollY;

    const update = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      if (y <= 8) setHidden(false);
      else if (delta > 2) setHidden(true);
      else if (delta < -2) setHidden(false);
      lastY.current = y;
      ticking.current = false;
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const revealed = !hidden || hovering;

  return (
    <>
      {/* Hover reveal strip */}
      <div
        aria-hidden
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className="fixed inset-x-0 top-0 z-40 h-16 hidden md:block"
      />

      <header
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className={`fixed inset-x-0 top-0 z-50 border-b border-primary/20 bg-primary text-primary-foreground shadow-sm transition-transform duration-300 ease-out ${
          revealed ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-flame">
              <Flame className="size-5 text-primary-foreground" />
            </span>
            <span className="text-lg font-extrabold tracking-tight">ABTalks</span>
          </Link>

          <div className="ml-4 hidden items-center gap-1 sm:flex">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeProps={{ className: "bg-primary-foreground/15" }}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-primary-foreground/85 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            {session ? (
              <>
                <span className="grid size-9 place-items-center rounded-full bg-flame text-xs font-black text-primary-foreground">
                  {initials(session.name)}
                </span>
                <button
                  onClick={() => {
                    signOut();
                    navigate({ to: "/" });
                  }}
                  aria-label="Log out"
                  className="inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-primary-foreground/85 hover:bg-primary-foreground/10"
                >
                  <LogOut className="size-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden h-10 items-center rounded-xl px-3 text-sm font-semibold text-primary-foreground/85 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground sm:inline-flex"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex h-10 items-center rounded-xl bg-flame px-4 text-sm font-bold text-primary-foreground shadow-[var(--shadow-flame)] transition-transform active:scale-95"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <div className="h-16" />
    </>
  );
}
