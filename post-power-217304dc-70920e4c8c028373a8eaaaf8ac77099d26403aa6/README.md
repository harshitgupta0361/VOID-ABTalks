# Daily Code Spark

ABTalks — Product Requirements Document

60-Day Coding Challenge Platform (Mobile-First Web App)

1. Product Summary

ABTalks is a mobile-first web app that runs a 60-day public coding challenge for Indian college students. Each day, a student gets one coding task. To keep their streak alive, they must submit two proofs: a GitHub link and a LinkedIn post. The product's core insight: the real friction isn't the coding, it's the decision fatigue of writing a LinkedIn post at 1am — so the app includes a one-tap caption generator, plus a forgiving "streak freeze" mechanic so missing a day doesn't feel punishing.

Build this as a static front-end app (no real backend/auth required). All data is mocked but shaped exactly like real API responses, and submissions persist locally in the browser so the demo feels real across refreshes.

Primary usage context: phones, at night, often on slow connections. Every design and performance decision should be made with that in mind.

2. Goals

A first-time visitor understands the product and starts Day 1 in under 30 seconds of scrolling the landing page.

A returning student can answer, at a glance: Where am I? What do I do today? Am I okay?

Submitting proof for a day (GitHub + LinkedIn) is fast and frictionless on a phone.

Missing a day never feels alarming or punitive — it's handled factually and gracefully.

The whole app works cleanly at a 390px mobile viewport, with no login required.

3. Tech & Build Constraints

Framework: React (Vite-style SPA behavior), client-side routing.

Styling: Tailwind CSS, mobile-first breakpoints.

No real backend, no auth. Student is always "mocked as logged in."

Data: Realistic mock JSON for a student profile and a 60-day challenge list, accessed through service-style functions (e.g. getStudent(), getDay(id), submitProof()) rather than components reading raw data directly — this keeps the app "API-shaped" for an easy future swap to a real backend.

Persistence: Use browser local storage (wrapped by the same service layer) so a student's proof submissions survive a page refresh during a demo. This is a UX nicety, not a real database.

State: Shared student/streak/progress state accessible across the Dashboard and Day screens (e.g. submitting a proof on a Day screen should update the streak shown on the Dashboard, without a full reload).

Routing / deep links: Every route must work as a direct hard-refresh URL (e.g. loading /day/12 directly in a new tab must render correctly, not 404). This is a hard requirement, not an edge case to skip.

Icons: Use a lightweight, consistent icon set (e.g. Lucide-style line icons).

Deployment target: Static hosting (Vercel/Netlify-style); include whatever SPA fallback/rewrite config that hosting requires.

4. Information Architecture

Three routes:

Route Purpose / Public landing page /dashboard Student home (mocked as logged in) /day/:dayId Detail + submission page for a single challenge day, e.g. /day/12

Any unmatched route should show a simple Not Found page.

5. Data Model (mocked, but realistic)

Student profile

Fields: id, name, college, track (e.g. "Full Stack Web Dev"), start date, current day number, current streak, longest streak, number of streak freezes available, number used, total days completed, total days missed, an array of earned badges, and a boolean for whether the profile is complete.

Challenge day (one of 60 entries)

Fields: day number, title, track id, a short one-line task, a longer detailed task description, a learning goal, an estimated time to complete, a list of resource links, and a status (e.g. completed / in-progress / missed / upcoming).

Submission (per day)

Fields: day number, GitHub URL + timestamp submitted, LinkedIn URL + timestamp submitted, and a boolean for whether both proofs are complete.

Generate 60 days of mock challenge content across a couple of tracks (e.g. Full Stack Web Dev, DSA, Mobile/App Dev), with a realistic mix of statuses: some completed, one "in progress" (today), a couple marked missed, and the rest upcoming — so every state described below is actually visible in the demo data, not just in code.

6. Screen-by-Screen Requirements

6.1 Landing Page (/)

Goal: a stranger understands the product and is motivated to start Day 1 within 30 seconds of scrolling. Fully static/public, no login.

Sections, top to bottom:

Sticky top bar — logo + a single primary call-to-action button ("Start Your Streak"). No nav clutter on mobile.

Hero — headline ("Code Every Day. Get Seen Every Day.") and subhead ("A 60-day public challenge for Indian college students — build daily, post daily, get noticed by recruiters."), with a primary CTA button that routes to /dashboard.

How it works — a 3-step strip: Pick a track → Build daily → Prove it (GitHub + LinkedIn).

Trust strip — mocked stats, e.g. "2,400+ students · 40+ colleges · 60 days · 2 proofs a day."

Track preview cards — horizontally scrollable on mobile (Web Dev, DSA, ML, App Dev, etc.), each showing a sample Day 1 task.

Social proof — 2–3 short mocked student quotes, each with a name, college, and track.

Streak mechanic explainer — a simple visual: Day → Commit → Post → Streak+1, and it should honestly mention the streak-freeze rule.

FAQ accordion — at least: "What if I miss a day?", "Do I need to already know how to code?", "Is this free?"

Final call-to-action band.

Minimal footer.

Design requirement: every term a newcomer wouldn't know (streak, track, proof) should be explained inline — assume zero prior context.

6.2 Dashboard (/dashboard)

Goal: one glance answers "Where am I? What do I do today? Am I okay?"

Sections:

Header — avatar/initials, name, college. If the mocked profile is incomplete, show a dismissible "Complete your profile" nudge instead of a broken/blank layout.

Streak card (hero element) — large current-streak number with a fire visual, longest streak, and freezes remaining (with an info tooltip explaining what a freeze is). On Day 1 / zero streak, this must say something encouraging like "Your streak starts today. Let's go." — never show a bare, discouraging "0".

Today's Task card — pulls today's challenge entry and links to that day's detail page. If already submitted today, show a clear "Today's done. Come back tomorrow." state instead of the task again.

Progress bar — "Day 12 of 60" shown as a segmented bar: filled segments = completed days, dim segments = missed days, grey = upcoming. This should intentionally NOT be a plain percentage bar — the segments keep missed days visible without being alarming.

Stats row — Days Completed / Days Missed / Completion Rate. Missed days should be shown in a neutral grey tone with a reassuring tooltip like "Missed days happen. Keep building." — never red or alarm-styled.

Achievements — badge chips for earned badges; if none yet, show greyed/locked placeholder chips with a nudge like "Earn your first badge — submit Day 1."

60-day mini timeline — a compact dot/status grid, one per day, color-coded by status, each linking to that day's detail page.

Edge cases that must be visibly designed for (not just handled in code):

Day 1 / no streak yet → framed as a beginning, not a deficit.

A missed day → factual and non-punitive tone, shown alongside the freeze mechanic.

Incomplete profile → a dismissible nudge, never a broken or empty-looking layout.

6.3 Challenge Day Detail (/day/:dayId)

Goal: Read → Understand → Build → Prove, with minimal friction on a phone at night.

Sections:

Day navigation — "← Day 11" / "Day 13 →" links to adjacent days, plus a "Back to Dashboard" link.

Day header — "Day X of 60", the task title, estimated time, and a difficulty tag.

Task section — a bold 1–2 line brief task, a collapsible "Show full brief" for the longer detailed description (keeps the initial mobile view short), the learning goal, and resource links.

Submission form:

GitHub proof — URL input with inline format validation, and a status chip showing Not Submitted / Submitted ✅ with a timestamp.

LinkedIn proof — URL input with the same status chip pattern, plus a "Generate Caption" button (see §7 below) that fills a text area with a ready-to-copy caption, with a one-tap "Copy" button.

Submit button — disabled until both fields are filled, OR allow a partial save that shows "1 of 2 submitted" (pick one approach and apply it consistently).

Completion state — once both proofs are saved: a success banner, the streak should visibly update, and a CTA to move on to the next day.

Missed/late day state — if a student opens a past, incomplete day, show a clear banner: "You missed this day. You can still submit late (won't restore streak, but counts toward total progress)."

7. Signature Feature: Streak Freeze + Auto-Draft Caption

This is the product's differentiator and should be genuinely functional in the build, not just decorative.

Streak Freezes — every student starts with 2 free freezes across the 60 days. If a day is missed, it should automatically consume a freeze instead of breaking the streak outright — and this should be shown transparently on the Dashboard (not hidden magic). Freezes are visible, limited, and finite — this respects real-life disruptions (exams, illness, bad wifi) without making the streak meaningless.

One-tap LinkedIn caption generator — on the Day screen, a "Generate Caption" button should build a ready-to-edit post from that day's data, in a template like:

"Day 12/60 of #ABTalksChallenge: built a REST API with Express today. Key learning: middleware order matters. Onward to Day 13. 🔥"

This should be simple templating logic (no AI call needed) — but it needs to actually interpolate real data from the current day (day number, title, learning goal) so it's demoable, not hardcoded text.

8. Design System

Viewport target: design for 390px width first; scale up gracefully for tablet/desktop.

Touch targets: all buttons and inputs at least 44–48px tall.

Typography: clean system font or Inter, base size 16px minimum (prevents mobile browsers from auto-zooming on input focus).

Color system:

Primary/streak/CTA color: warm orange or red — a "fire" metaphor.

Success color (green): used sparingly, only for submitted/completed states.

Missed/neutral state: grey, never red — a missed day should not read as an alarm.

Default to dark mode — given the stated late-night usage pattern, this should be the default theme, not just a toggle option.

Spacing: generous vertical rhythm suited to thumb-scrolling on mobile.

Motion: keep it light — a small streak-increment animation and a submit-success moment (e.g. confetti) are enough; avoid heavy animation that would bloat load time on slow mobile data.

9. Explicit Edge Cases to Demo

The build isn't done until these are all visibly true, at 390px width:

Day 1 view with zero streak, framed positively.

A missed day, shown factually and non-punitively, with the freeze mechanic visible.

An incomplete/empty profile state that still renders a clean layout (no broken UI).

/day/12 (or any day) loads correctly on a direct hard refresh, not just via in-app navigation.

All three routes (/, /dashboard, /day/:dayId) render without overflow or layout breakage at 390px.

10. Out of Scope (for this build)

Real user authentication / accounts.

A real backend or database.

Real GitHub/LinkedIn API integration (proof links are just stored URLs, not verified).

SEO/SSR concerns.

11. Definition of Done

All three routes implemented and working, including direct deep-linking to /day/:dayId.

Mock data for a full 60-day challenge with a realistic mix of completed/missed/upcoming/in-progress days.

Submissions persist across a page refresh (local storage).

Streak freeze logic and the caption generator are both functionally working, not just visual.

Dashboard state updates after a submission on the Day screen (streak, progress bar, stats all reflect the change).

Dark mode by default.

Verified responsive and non-broken at 390px width across all three routes.


on the basis of above text built a 3d animated website

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7acdec16-ef01-4da7-b22e-f818c7482475).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
