import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Flame, LogOut, Menu, X } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { initials, signOut } from "@/lib/abtalks/auth";

const NAV_LINKS = [
  { to: "/", label: "home" },
  { to: "/dashboard", label: "dashboard" },
  { to: "/help", label: "help" },
] as const;

export function SiteNav() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    lastY.current = window.scrollY;

    const update = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      setScrolled(y > 10);
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

  const revealed = !hidden || hovering || menuOpen;

  return (
    <>
      {/* Hover reveal strip */}
      <div
        aria-hidden
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className="fixed inset-x-0 top-0 z-40 hidden h-[72px] md:block"
      />

      <header
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-300 ease-out ${
          revealed ? "translate-y-0" : "-translate-y-full"
        } ${
          scrolled || menuOpen
            ? "border-b border-border bg-background/70 backdrop-blur-[14px]"
            : "border-b border-transparent"
        }`}
      >
        <nav className="relative mx-auto flex h-[68px] max-w-[1180px] items-center gap-3 px-5 sm:px-8">
          <Link
            to="/"
            className="logo-mark flex items-center gap-2"
            aria-label="ABTalks home"
            onClick={() => setMenuOpen(false)}
          >
            <Flame className="logo-flame size-[18px] fill-primary text-primary" />
            <span className="font-mono text-[15px] font-medium tracking-[-0.01em] lowercase">
              abtalks
            </span>
          </Link>

          <div className="ml-6 hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeProps={{ className: "text-foreground" }}
                className="nav-link font-mono rounded-full px-3 py-2 text-[13px] text-muted-foreground transition-colors hover:text-primary"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            {session ? (
              <>
                <span className="font-mono grid size-9 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                  {initials(session.name)}
                </span>
                <button
                  onClick={() => {
                    signOut();
                    navigate({ to: "/" });
                  }}
                  aria-label="Log out"
                  className="inline-flex h-10 items-center gap-1.5 rounded-full border border-input px-3 text-sm text-foreground transition-colors hover:border-primary hover:bg-primary/10"
                >
                  <LogOut className="size-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden h-10 items-center rounded-full border border-input px-4 text-[13.5px] font-medium text-foreground transition-colors hover:border-primary hover:bg-primary/10 sm:inline-flex"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex h-10 items-center rounded-full bg-primary px-4 text-[13.5px] font-medium text-primary-foreground transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[var(--shadow-flame)]"
                >
                  Sign Up
                </Link>
              </>
            )}

            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="inline-flex size-10 items-center justify-center rounded-full border border-input text-foreground transition-colors hover:border-primary hover:bg-primary/10 md:hidden"
            >
              {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>

          <span aria-hidden className="nav-shimmer" />
        </nav>

        {menuOpen && (
          <div className="border-t border-border bg-background/85 backdrop-blur-[14px] md:hidden">
            <div className="mx-auto flex max-w-[1180px] flex-col px-5 py-3 sm:px-8">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMenuOpen(false)}
                  activeProps={{ className: "text-foreground" }}
                  className="nav-link font-mono px-1 py-3 text-[14px] text-muted-foreground transition-colors hover:text-primary"
                >
                  {l.label}
                </Link>
              ))}
              {!session && (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="font-mono px-1 py-3 text-[14px] text-muted-foreground transition-colors hover:text-primary sm:hidden"
                >
                  login
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
      <div className="h-[68px]" />
    </>
  );
}
