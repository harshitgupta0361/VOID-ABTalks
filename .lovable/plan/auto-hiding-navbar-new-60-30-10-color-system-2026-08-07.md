# Auto-hiding navbar + new 60/30/10 color system

## 1. Global navbar (new, site-wide)

Today only the landing page has a header; dashboard and day pages have inline headers. A single shared navbar moves into the root layout so it appears on every page.

Contents:
- ABTalks logo (left)
- Links: Home, Dashboard, Help
- Right side: "Log in" and "Sign up" buttons (Sign up is the gold accent button)

Behaviour:
- Visible on page load
- Scrolling down even slightly slides it up out of view (smooth transform + fade)
- Scrolling up reveals it again and it stays visible
- While hidden, moving the cursor into a thin invisible strip at the very top of the screen slides it back down; leaving that strip hides it again
- Touch devices (no hover): navbar stays scroll-driven only
- Respects reduced-motion

## 2. Help section

New `/help` route: short intro plus an accordion of FAQs (how the challenge works, streaks & freezes, submitting proofs, tracks, contact line). Reuses the FAQ pattern already on the landing page.

## 3. Login / Sign up

New `/login` and `/signup` routes with front-end-only forms (email, password, name/college/track on signup) styled in the new palette. They store a local demo session so the navbar can show the student's initials instead of the auth buttons. No real backend yet — say the word if you want real accounts and I'll wire up Lovable Cloud.

## 4. Colour system rework (60 / 30 / 10)

Replace the current dark "fire" theme with a light editorial theme:

- 60% White / cream — page background, article surfaces, cards, text blocks
- 30% Dark royal blue — navbar, footer, hero band, major section blocks, title cards, headings
- 10% Sotheby's gold — primary buttons (Start Your Streak, Submit proof, Sign up), badges, thin dividers, focus rings only

Implementation detail: rewrite the token values in `src/styles.css` (`--background` cream, `--foreground` royal blue, `--primary` royal blue, `--accent`/new `--gold`), retire the flame/ember tokens by remapping `--flame` → gold and the ember-grid backdrop to a subtle blue/gold version, so existing `bg-flame` / `text-flame` usages instantly follow the new palette. Root layout switches off the forced `dark` class. Existing 3D tilt/float motion stays.

## Technical notes

- Navbar lives in `src/components/site-nav.tsx`, rendered in `src/routes/__root.tsx` above `<Outlet />`, with a scroll listener (rAF-throttled) plus a `pointerenter/leave` hover strip.
- Pages get top padding to sit under the fixed navbar; the per-page inline headers on dashboard/day are trimmed so there's no duplicate nav.
- Auth state kept in the existing localStorage service layer, matching how student data is already persisted.
