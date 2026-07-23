# Trainly — CLAUDE.md

AI training platform for **hybrid athletes** (cycling + climbing + strength). Owner: Callum — competitive cyclist/climber building this **for himself first** (he previously coached himself via ChatGPT + Strava strain and won races). Friends (NYC climbers) are the first testers; commercializing is optional upside, not the goal.

**Positioning (settled after market research — don't relitigate):** the vanilla "adaptive Strava plan + AI coach" concept is commoditized (TrainerRoad Adaptive, Athletica, and Strava itself — it acquired Runna + The Breakaway in 2025 and bundles them into Premium; competitors like "Stride Training Partner" run ads for the same idea). The one open wedge is **hybrid multi-sport load-balancing** — climbing/strength load down-weighting bike recommendations. That's the moat; personal-use quality is the bar.

## Repo / stack

- Canonical repo: `callumks/trainly.app` (**public** — never commit secrets; `.env.local` is gitignored and must stay so).
- Legacy repos `callumks/Trainlynew` (Figma UI source, has a **leaked Supabase service key** — project should be rotated/deleted) and `callumks/trainly-new` (dead spike). Local clones at `~/Trainlynew`, `~/trainly-new`. Don't build on them.
- Next.js 14 App Router + TypeScript + Tailwind. **No Supabase at runtime** — `lib/supabase.ts` is a plain `pg` Pool wrapper (name is historical). DB is plain Postgres.
- LLM client is OpenAI-SDK-compatible, model-agnostic via env (`OPENAI_API_KEY`, `LLM_BASE_URL`, `LLM_MODEL`).

## Local dev

```bash
# Postgres 16 via brew (service usually already running); db = "trainly"
createdb trainly && psql -d trainly -f railway-schema.sql   # first time only (NOT supabase/schema.sql — that's the old Supabase-auth variant)
npx next dev -p 3000        # port 3000 is Trainly's (DropFlow uses 3030)
```

- Env in `.env.local` (gitignored): `DATABASE_URL` (local: `postgresql://callum@localhost:5432/trainly`), `JWT_SECRET`, Strava (`NEXT_PUBLIC_STRAVA_CLIENT_ID` / `STRAVA_CLIENT_SECRET` / `STRAVA_VERIFY_TOKEN` — Strava app callback domain: `localhost`), and coach LLM vars (see below).
- Auth = JWT cookie `auth-token` + bcrypt. Register at `/auth/register` (auto-logs-in).
- **Testing authed endpoints from CLI:** mint a JWT with the `JWT_SECRET` from `.env.local`:
  `node -e "console.log(require('jsonwebtoken').sign({userId:'<uuid-from-profiles>',email:'<email>'}, '<JWT_SECRET>', {expiresIn:'1h'}))"` then `curl -b "auth-token=$TOKEN" ...`
- If Next serves stale UI: `rm -rf .next` and restart. If port 3000 is stuck: `lsof -ti:3000 | xargs kill -9`.
- zsh gotcha: never use `path` as a shell loop variable (clobbers `$PATH`).

## Design system (rolled out across ALL routes — keep it)

**"Cool instrument"** (chosen 2026-07-02, replacing the warm/editorial cream — Callum felt cream+tomato read not-premium): porcelain `#F5F6F7` bg, pure-white cards, ink `#0E1013`, cool grays (`#7A8087` muted / `#AEB3B9` faint), accent signal-ember `#E03E1F`, cool data scale (Z1 `#A9AFB6` / Z2 `#4C7DD0` / Z3 `#2FA187` / Z4 `#E0A32E` / Z5 `#D9442C`), good `#2E9E77`, ATL chart `#E08F2A`, lines `rgba(14,16,19,…)`. Space Grotesk (display) + IBM Plex Mono (tabular numbers) + Inter, loaded via `next/font` in `app/layout.tsx`. Hairline borders, tiny shadows, staggered card rise + count-ups + SVG draw-in motion (Callum LIKES tasteful motion — don't strip it). Layout/type/motion are settled — palette lives in the three scoped CSS files + a few hardcoded hexes in TSX chart/icon maps; change all together.
- **Dark performance theme** exists as a live toggle (moon/sun in both topbars → `components/app/ThemeToggle.tsx`): `html.dark` variable overrides at the bottom of `app.css` + `dashboard.css` (bg `#0B0C0E`, cards `#141619`, ink `#F2F3F5`, accent `#F0492A`, brighter zone scale). Persisted via `localStorage['trainly-theme']` + a no-flash script in `app/layout.tsx` `<head>`. Chart gridlines/dots use `var(--line-2)`/`var(--faint)`/`var(--surface)` so they work in both themes. Auth pages stay light. Note: root layout no longer forces Tailwind's `html.dark` — the theme class is user-controlled.

- Shared shell: `components/app/` — `AppShell` (TopBar + wrap), `TopBar` (active nav via usePathname), `PageHeader`, `app.css` (all tokens/primitives, scoped under `.tr-app`).
- Dashboard has its own scoped copy (`.tr-dash`, `components/dashboard/dashboard.css` + `TrainlyDashboard.tsx`); auth pages use `.tr-auth` (`components/auth/auth.css`). Same look; the dashboard topbar could be unified onto the shared TopBar someday.
- Charts are **hand-drawn SVG** (catmull-rom smoothing, no chart lib). Units: **miles** (user preference; a proper units setting is future work).
- **No fake/sample data anywhere** (hard user requirement). Real data or an honest empty state. The `demoflag` chip marks anything not yet real.

## Data pipeline (all real, wired)

- **Strava**: OAuth connect via Profile page (`components/strava/StravaConnect.tsx` → `/auth/callback`), sync = `/api/strava/sync` → `lib/strava.ts`. **Auto-sync:** dashboard fires `/api/strava/sync?ifStale=30` on open (no-op if synced <30min ago; reloads data if new activities landed); `profiles.metadata.last_synced_at` is the timestamp, surfaced truthfully in the topbar chip ("Synced · Xh ago"). True push webhooks (`app/api/strava/webhook` exists from old build, unwired) need a public URL → post-deploy. Sync details:
  full pagination (~1,200 activities), `/athlete` (FTP/weight → `profiles.metadata` jsonb), **power-based TSS** (NP/FTP → `metadata.computed.tss`), real time-in-zone per recent activity (`/activities/{id}/zones` → `metadata.computed.hrZones`), true power-duration curve from watt streams (best 5s/1m/5m/20m/1h → `profiles.metadata.powerCurve`). Rate-limit aware (RateLimitError, caps requests).
- FTP precedence: **Strava's real FTP > manual (Profile edit) > estimate** (0.95 × best 20-min power, flagged `ftp_estimated:true`). Manual set via `PUT /api/profile` writes `ftp_source:'manual'`/`ftp_estimated:false`, immediately re-keys all power-based TSS, and sync's `storedIsManual` guard never overwrites it with an estimate. Profile page is editable (`components/profile/ProfileDetails.tsx`: name, experience, weekly volume, sports chips, FTP). Sessions last 90 days (login route).
- **APIs**: `/api/dashboard/overview` (weekly hours/TSS/kJ/compliance/FTP/powerCurve), `/api/readiness` (acute:chronic ratio), `/api/progress` (CTL 42d-EWMA / ATL 7d-EWMA trend from 180d of daily TSS, weekly volume 8wk, zones = real time-in-zone w/ avg-HR fallback, `readinessTrend` 7d), `/api/activities/recent?limit=N`, `/api/sessions/*` (plan sessions), `/api/coach` (GET context / POST chat).
- **Readiness = one formula, one place**: `computeReadiness(tsb, ratio)` in `lib/coach.ts` (70% form-from-TSB `clamp(70+2·TSB)` + 30% acute:chronic ratio score). `/api/readiness` delegates to `buildCoachContext` — do NOT reintroduce a second readiness computation; the old ratio-only one contradicted TSB (said 98/100 while TSB was −14). Flags: `fresh` (TSB≥5) / `balanced` / `fatigued` (TSB≤−15) — dashboard `READINESS_MSG` keys match these.
- pg returns `start_date` as a JS Date, not string — don't `.slice()` it.

## Coach (works today; LLM upgrade one env-var away)

- **Chat history persists** in `coach_messages` (user_id/role/text/plan jsonb/plan_status; in railway-schema.sql too). `/api/coach` GET returns last 50 as `history` (page loads it instead of the synthetic greeting); POST inserts both sides and returns `messageId`; `/api/plan/apply` accepts `messageId` and marks that message's `plan_status='applied'` so plan cards survive reloads.
- `lib/coach.ts`: `buildCoachContext` (real FTP/CTL/ATL/TSB/readiness/weekly/recent/sport-mix from DB) + `ruleReply` (grounded intent-matched fallback) + `contextSummary` (facts block for the LLM).
- `/api/coach`: tries LLM when a real key exists (key not starting `sk-local-dev`), else rule engine — never hard-fails. Page: `/dashboard/coach` (chat + live "Your numbers" panel + seeded greeting).
- **LLM is LIVE: Z.ai `glm-5.2` via the Coding-Plan endpoint** — `.env.local`: `LLM_BASE_URL=https://api.z.ai/api/coding/paas/v4`, `LLM_MODEL=glm-5.2`, key = fresh Z.ai key (2026-07-02). Gotchas that cost time: (1) the standard `api/paas/v4` endpoint returns error 1113 "insufficient balance" — the Coding Plan only covers `api/coding/paas/v4`; (2) GLM models are THINKING models — without `thinking: {type:'disabled'}` the whole token budget goes to reasoning and `content` comes back empty (which silently falls back to rules). `/api/coach` auto-adds that param when the base URL matches z.ai/bigmodel.
- Verified conversational + grounded (real watt targets from his FTP, hybrid climbing-vs-riding advice). Rule-mode remains as the no-key/LLM-error fallback.
- **Long-term memory:** `coach_memory` table + `lib/coach-memory.ts` — after every exchange an async LLM pass extracts durable facts (injuries/goals/schedule/preferences; deduped against existing notes; never blocks the reply) and every prompt injects the active notes via `notesBlock`. This is what makes the coach remember across conversations — the chat history window is only 12 turns. If the coach "forgets," check notes are being extracted/injected before blaming the model.
- **Anti-slop rules (hard-won — keep):** history mapping must read `h.text` (client shape) — a `.content` read once fed the LLM literal "undefined" as all history, causing stat-recital every reply. Prompt: numbers only when they change the advice, never re-cite, match the athlete's register (casual chat = no TSB/watt lectures), reported feel outranks dashboard. `contextSummary` includes `Now:` + per-session "Xh ago" + MOST RECENT marker so "just did a ride" resolves honestly. Coach page auto-syncs on open (`ifStale=15`). Temp 0.6, history 12 turns.
- `app/api/chat/route.ts` is the OLD broken coach — orphaned, superseded by `/api/coach`. Also orphaned: `components/training/training-calendar.tsx`, `components/strava/recent-activities.tsx`.

## Plan engine (LIVE — coach → calendar loop works)

- `lib/plan-engine.ts`: `looksLikePlan` (≥2 bold day-lines) → `extractPlanSessions` (second LLM pass, temp 0, returns validated `{date, name, session_type, duration_minutes, intensity 1-5, description}`; rest days omitted) → coach POST attaches `proposedPlan` → chat renders a plan card with **Add to calendar** → `/api/plan/apply` → `applyPlan` (deactivates old plans, replaces still-`planned` sessions in the date range — completed ones kept — inserts `training_plans` + `training_sessions`).
- **Auto-complete:** `matchCompletedSessions` runs after every sync — same-day Strava activity of the matching sport family (cardio/recovery ~ ride|run|swim; skill ~ climb|boulder; strength ~ weight|workout) marks the session `completed` + links `strava_activity_id`. Verified end-to-end.
- `/api/sessions/upcoming` window = Monday of current week → +13 days (feeds CalendarView).
- NOT YET: the adapt loop (coach rewriting remaining days based on planned-vs-done) — next big piece; also no plan view on the dashboard.

## Current state / gaps (as of 2026-07-02)

1. **NOTHING IS COMMITTED.** The entire rebuild (design system, Strava enrichment, coach, plan engine) is uncommitted working tree on `main`. First deploy step = commit + push (review diff; never commit `.env.local`).
3. **Not deployed** — plan: Railway + Railway Postgres (auto-deploy from GitHub pushes — never `railway up`), env vars set in Railway dashboard, Strava callback domain updated to prod domain. Prod DB starts empty.
4. Remaining old-styled widgets: `AIPlanGenerator` (/dashboard/plans), `OnboardingLanding` (/onboarding).
5. Push notifications: not built (no service worker).
6. Goals/onboarding flow not wired (profiles.goals/sports empty → Next Event empty).

## Owner's live data (local DB)

His account is connected to Strava with ~1,200 activities (rides + rock climbing + workouts — genuinely hybrid), real power meter data on ~100 rides. Recent live numbers: ~6-8h/week, CTL ~44 / ATL ~72 / TSB ~−28 (loaded hard). Treat his DB as real training data, not fixtures.
