import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Flame, LogOut, Menu, Trash2, User, UserPlus, X } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { initials, signOut } from "@/lib/abtalks/auth";
import { toast } from "sonner";


const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/help", label: "Help" },
] as const;

export function SiteNav() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
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
            className="logo-mark flex min-w-0 shrink-0 items-center gap-2"
            aria-label="ABTalks home"
            onClick={() => setMenuOpen(false)}
          >
            <Flame className="logo-flame size-[18px] shrink-0 fill-primary text-primary sm:hidden" />
            <img
              src="/abtalks-wordmark.png"
              alt="ABTalks"
              className="logo-flame hidden h-[26px] max-h-[40px] w-auto max-w-[150px] shrink-0 bg-transparent object-contain sm:block"
            />

            <span className="font-mono text-[15px] font-medium tracking-[-0.01em] lowercase sm:hidden">
              abtalks
            </span>
          </Link>


          <div className="ml-6 hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeProps={{ className: "text-white" }}
                className="nav-link rounded-full px-3 py-2 text-[13px] text-white transition-colors hover:text-primary"
              >
                {l.label}
              </Link>
            ))}
          </div>


          <div className="ml-auto flex items-center gap-2">
            {session ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAccountOpen((o) => !o)}
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                  className="flex items-center gap-2 rounded-full border border-input py-1 pr-3 pl-1 transition-colors hover:border-primary hover:bg-primary/10"
                >
                  {session.avatar ? (
                    <img
                      src={session.avatar}
                      alt=""
                      className="size-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="font-mono grid size-8 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                      {initials(session.name)}
                    </span>
                  )}
                  <span className="font-mono hidden max-w-[110px] truncate text-[13px] text-foreground sm:inline">
                    {session.name.split(" ")[0]?.toLowerCase()}
                  </span>
                </button>

                {accountOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      aria-hidden
                      onClick={() => setAccountOpen(false)}
                    />
                    <div
                      role="menu"
                      className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-background/95 p-1.5 shadow-[0_26px_50px_-30px_oklch(0_0_0/75%)] backdrop-blur-xl"
                    >
                      <p className="truncate px-3 pt-2 pb-1 font-mono text-[11px] text-muted-foreground">
                        {session.email}
                      </p>
                      <Link
                        to="/profile"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-primary/10"
                      >
                        <User className="size-4" /> Profile & account
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-primary/10"
                      >
                        <UserPlus className="size-4" /> Add account
                      </Link>

                      <button
                        onClick={() => {
                          setAccountOpen(false);
                          const who = session?.name;
                          signOut();
                          toast.success("Signed out", {
                            description: who ? `See you soon, ${who}.` : "See you soon.",
                            duration: 2200,
                          });
                          setTimeout(() => navigate({ to: "/" }), 700);
                        }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-primary/10"
                      >
                        <LogOut className="size-4" /> Sign out
                      </button>
                      <Link
                        to="/profile"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
                      >
                        <Trash2 className="size-4" /> Delete account
                      </Link>

                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="nav-link hidden h-10 items-center rounded-full border border-input px-4 text-[13.5px] font-medium text-white transition-colors hover:border-primary hover:bg-primary/10 sm:inline-flex"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="nav-link inline-flex h-10 items-center rounded-full bg-primary px-4 text-[13.5px] font-medium text-white transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[var(--shadow-flame)]"
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
                  activeProps={{ className: "text-white" }}
                  className="nav-link px-1 py-3 text-[14px] text-white transition-colors hover:text-primary"
                >
                  {l.label}
                </Link>
              ))}
              {!session && (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="font-mono px-1 py-3 text-[14px] text-white transition-colors hover:text-primary sm:hidden"
                >
                  Login
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
