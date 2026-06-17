# Persift Landing Page — Agent Handover

## Project
Scroll-driven React landing page for Persift — an AI tool that autonomously finds early-career jobs and applies to them. Builder: Himanshu Jarodiya (CS @ ASU, founder).

Dev server: `npm run dev`
Build: `npm run build`
Deployed at: `https://persift.com` via Vercel (auto-deploys on push to `main`)

## Stack
React 18 + TypeScript + Vite + Framer Motion v12 + npm

## Improvement tracker
All pending/done work lives in `.claude/IMPROVEMENTS.md`. Read that first every session.

---

## Session log (2026-06-16 → 2026-06-17)

### Completed this session
- **Favicon** — replaced v0 icon with Persift P mark SVG. `public/icon.svg` is a compound path with `fill-rule="evenodd"` punching the bowl out, `fill="#0c0a08"`, transparent background.
- **Mobile horizontal overflow fixed** — root cause was `Scene7Ask.tsx` 760×760px amber glow div with no `overflow: hidden` on parent. Fixed by adding `overflow: "hidden"` to Scene7Ask root div. Also added `transform: translateZ(0)` to LogoTicker and `overflow: hidden` + `position: relative` to MobileHero section for iOS compositing.
- **Mobile vertical scroll restored** — `overflow-x: hidden` on `html` kills vertical scroll on iOS. Kept it only on `body`. MobileLayout root div has no `position: relative` (was creating stacking context that buried the fixed header).
- **Mobile section dividers removed** — `borderBottom` stripped from `sectionStyle` for seamless transitions between all sections.
- **Mobile CTA section** — removed triple-wrapping of Scene7Ask. Now renders directly in a plain `<section>` with `padding: "64px 0"`.
- **Scene7Ask amber glow** — reduced to 420×420px at 7% opacity so it glows around the form without tinting the whole section background.
- **Mobile section spacing** — removed `minHeight: "80vh"` from MobileMorning and MobileAnalytics for consistent 64px gap everywhere.
- **Header gradient** — desktop header is `transparent`, mobile header has `linear-gradient(to bottom, var(--bg) 60%, transparent)` so content fades under it cleanly without a solid bar.
- **Desktop hero fullscreen** — MultiScene sticky container changed from `top: topOffset, height: calc(100vh - topOffset)` to `top: 0, height: 100vh` so hero illustration fills edge to edge.
- **Scroll hint** — bouncing up/down animation (`y: [0, 8, 0]`, 1.6s loop). Clickable — calls `scrollByRef.current?.(0.021)` which directly advances `targetRef` in MultiScene (bypasses the `deltaY: 100` cap in wheel handler). `scrollBy` exposed via `onScrollByReady` callback prop.
- **Scroll hint color** — amber `#f0a341` with raised text shadow (`0 1px 0 rgba(0,0,0,0.9), 0 -1px 0 rgba(255,255,255,0.18)`).
- **"Roles discovered at" label** — color changed to `var(--amber-soft)` with same raised text shadow.
- **Hero terminal copy** — `$ persift --start` changed to `Persift can change that.` (amber, same Roboto Mono style). Non-technical, direct response to "247 applications. 0 replies. Tired yet?"
- **Viewport meta** — added `maximum-scale=1.0` to prevent mobile zoom-out.

### Current state of hero terminal (`SceneHero.tsx` lines 89-103)
```
$ status --job-search          ← green mono, muted (rgba 160,220,170,0.55)
> 247 applications. 0 replies. Tired yet?  ← green mono, more muted (0.38)
                               ← gap (marginBottom 3.4cqw)
Persift can change that.       ← amber, large, Roboto Mono 500
scroll to see it in action     ← green mono, 1.8cqw, muted (0.45), marginTop 2.2cqw
```

### Open / next to tackle
- **Mobile hero demo awareness** — mobile hero has no demo framing at all. Desktop has the terminal copy. Mobile users may not understand the page is a product demo. No solution decided yet.

### Completed (prior sessions)
- **"scroll to see it in action"** — added below "Persift can change that." in terminal. Roboto Mono, 1.8cqw, muted green `rgba(160,220,170,0.45)`, `marginTop: "2.2cqw"`.
- **`color-test.html` and `roles-color-test.html`** — deleted.

---

## Scroll Architecture

### Desktop (>900px)
- `src/App.tsx` — entry point. Desktop/mobile split via `useIsMobile(900)`. Fixed header at `top: 0; z-index: 110; height: 48px`. Amber scroll progress bar at `z-index: 120`. Scroll hint chevron fades out during CTA transition.
- `src/scroll/MultiScene.tsx` — the entire desktop scroll engine. Uses a **wheel interceptor + RAF lerp** (NOT native scroll / useScroll). `SENSITIVITY = 0.00008`, lerp factor `0.09`. `targetRef` accumulates deltaY, `currentRef` tracks lerp position, `progress` is the MotionValue driving all scenes.
- `src/scroll/SceneContext.tsx` — `useSceneProgress()` returns `MotionValue<number>` 0→1 sliced for the current scene's band.
- `src/scroll/nav.ts` — `jumpToCtaScene()` and `jumpToScene(i, bandOffset?)` for programmatic navigation. `registerJumpToStep()` called by MultiScene on mount.

### Mobile (≤900px)
- `src/scroll/MobileLayout.tsx` — entire mobile layout (~570 lines). Flat stacked sections, no scroll animation. `StaticSceneWrapper` provides a pinned `useMotionValue` to SceneContext.
- `src/scenes/MobileHero.tsx` — mobile hero (static).

### CRITICAL — Framer Motion v12 WAAPI rule
Never pass raw `scrollYProgress` directly to `useTransform`. Always use a mirrored MotionValue. The wheel interceptor already handles this — `progress` is a plain `useMotionValue`.

### Jump system (instant cut navigation)
`jumpToStep(i, bandOffset?)` in MultiScene snaps ALL THREE of `targetRef.current`, `currentRef.current`, and `progress.set()` to the target simultaneously — zero lerp frames, instant cut.

- `bandOffset` (0–1): fraction of the band to land at. Default 0 lands just past fade-in (`FADE * 2`).
- Setup scene uses `jumpOffset: 0.13` to land at Graduation field start.
- `jumpToCtaScene()` checks `window.innerWidth > 900` — if mobile, falls back to `document.getElementById("mobile-cta")?.scrollIntoView({ behavior: "smooth" })`.

### Scene bands (desktop total: 1711vh)
| Index | Label | File | Budget | Notes |
|---|---|---|---|---|
| 0 | (Hero) | SceneHero.tsx | 65vh | fullBleed, noSlide, isFirst |
| 1 | Install | Scene2Install.tsx | 120vh | noSlide |
| 2 | Set up | Scene2Setup.tsx | 86vh | jumpOffset: 0.13 |
| 3 | Discover | Scene3Machine.tsx | 125vh | Stripe only, 3 beats |
| 4 | Autopilot | Scene4Overnight.tsx | 150vh | |
| 5 | Morning | Scene5Morning.tsx | 100vh | |
| 6 | Analytics | Scene6Analytics.tsx | 100vh | |
| 7 | Launch | Scene7Ask.tsx | 150vh | CTA, isLast |

### FADE cost in small scenes
`FADE = 0.007` global progress units. For a small band, FADE eats a large % of sceneProgress:
- Setup (86vh / 1711vh = 0.0503 band): FADE/band = 14% per side. Animations must start at sceneProgress > 0.28 to be fully visible.
- Any jumpOffset below `FADE*2/bandSize` gets overridden by the FADE guard.

### earlyEnter prop
Autopilot uses `earlyEnter: 0.04` — shifts `enterStart = bandStart - 0.04` so it fades in before its band officially begins, eliminating black gap after Discover.

---

## Design System

### Colors (`src/index.css`)
- `--bg` #0c0a08 (near-black background)
- `--amber` #f0a341
- `--amber-soft` — lighter amber
- `--amber-deep` — darker amber
- `--ink` #f3ece1 (cream white)
- `--ink-soft`, `--ink-faint`, `--ink-mute` — opacity variants
- `--green` #5fd07f
- `--line`, `--surface`

### Fonts
- **Plus Jakarta Sans 700/800** — headlines, nav labels
- **Spectral 300 italic** — amber italic accent lines
- **Fraunces 500** — Scene7Ask closing punch line ONLY. Do not use anywhere else.
- **Inter 400/500/600** — body copy
- **Roboto 400** — Chrome Web Store UI inside WorkflowAnimation

### Brand components (`src/components/Brand.tsx`)
- `<Wordmark height={30} />` — renders the full "Persift" SVG wordmark. viewBox 0 0 340 108, aspect ratio 340/108.
- `<PersiftMark size={26} />` — renders just the P logo mark from `src/assets/persift-logo.svg`.

---

## Copy Rules
- "early-career roles" not "internships" — covers new grads
- Never "overnight", "while you sleep", "wake up to" — rejected, overused
- Punchy and specific. Not explanatory.
- Persift is never described as "a Chrome extension" in hero copy — sells the outcome, not the form factor.

---

## Key Scene Notes

### Scene3Machine.tsx (Discover, 125vh)
- Single company: Stripe only (Anthropic + Figma removed)
- `APPLY_START = 0.18`, `APPLY_END = 1.0`
- `frac = (p - 0.18) / 0.82` — position within apply sequence
- Phase switch tailoring→filling at `frac = 0.07`
- `fillFrac = (frac - 0.09) / 0.91` — autofill animation 0→1
- Field windows (fillFrac): name [0→0.07], email [0.07→0.14], resume [0.14→0.20], work auth [0.20→0.28], grad [0.28→0.32], GPA [0.32→0.36], portfolio [0.36→0.38], essay [0.38→0.93]
- Essay ends at fillFrac=0.93 → small beat before scene transition at frac=0.97
- Three headers, all top: 40 — discovery (`p [0,0.04,0.11,0.16]`), tailoring (`p [0.13,0.18,0.21,0.25]`), filling (`frac [0.07,0.12,0.97,1.0]`)
- `needsYou` removed — no longer cycles to Figma
- All `setState` calls in `useMotionValueEvent` wrapped in `requestAnimationFrame()` to prevent React setState-during-render warning
- Autopilot `earlyEnter` removed — was causing bleed-in overlap

### Scene4Overnight.tsx (Autopilot, 150vh)
- 5 companies, `foundIdx`/`tailoredIdx`/`submittedIdx` into 12-entry TIMES array (ends at "02:27 AM")
- Column widths: `COL_ICON=16`, `COL_PIPELINE=61`, `COL_MATCH=52`, `COL_TIME=72`, `ROW_GAP=10`
- Pipeline dot colors: Found=#f0a341, Tailored=#c084fc, Applied=#5fd07f
- Notion: `foundIdx=tailoredIdx=9` (no separate tailoring step)
- Vercel: `tailoredIdx=99, submittedIdx=99` — appears at 02:27 AM then stays in "Applying" pulse, never submits
- `earlyEnter: 0.04` in App.tsx — fades in before its band, eliminates black gap after Discover

### SceneHero.tsx (Hero, 65vh)
- `SCREEN_L=538, SCREEN_T=37, SCREEN_W=501, SCREEN_H=331` (image natural coords, image is 1522×688)
- Logo ticker (`src/components/LogoTicker.tsx`) — 13 company wordmarks in `@keyframes ticker-scroll`, fades in/out with scroll
- Terminal copy: `$ status --job-search` / `> 247 applications. 0 replies. Tired yet?` / `Persift can change that.` (amber)
- MultiScene sticky container is `top: 0, height: 100vh` — hero fills full viewport behind transparent header

### Scene2Setup.tsx (Set up, 86vh)
- IDENTITY_FIELDS bands: Name [0.03,0.08], University [0.08,0.13], Graduation [0.13,0.17], Visa [0.17,0.21]
- PREF_FIELDS bands: Role Types [0.24,0.30], Locations [0.30,0.35], Min Match [0.35,0.39]
- `jumpOffset: 0.13` — sidebar nav click lands at Graduation field start

### Scene7Ask.tsx (CTA/waitlist)
- Honeypot field: hidden `name="website"` input
- Disposable domain blocklist in `api/waitlist.ts`
- Rate limit: 5 req/hr per IP via Upstash Redis
- `LS_KEY = "persift_waitlist_email"` — stores submitted email in localStorage, pre-fills form on return
- `showAlreadyBanner` — if saved email exists on load, shows amber inline banner but keeps form functional
- Success message: "You're in. Confirmation sent to {email} — if you don't see it, check your promotions tab and move it to Primary."
- No "already" status type — demoted to non-blocking banner
- Form always renders — success message appears above form, not replacing it

---

## Waitlist API (`api/waitlist.ts`)

Vercel serverless function. Stack: Resend (email) + Upstash Redis (rate limiting) + LaunchList (waitlist management).

### What it does
1. Validates origin (only persift.com / www.persift.com)
2. Rate limits by IP (5/hr sliding window)
3. Honeypot check (`body.website` field)
4. Email validation (regex + disposable domain blocklist ~70 providers)
5. Fire-and-forget LaunchList signup
6. Sends confirmation email via Resend

### Email setup
- From: `Himanshu at Persift <himanshu@persift.com>`
- Reply-to: `hjarodiy@asu.edu`
- Subject: `"You're in — Persift"`
- Headers: `X-Entity-Ref-ID: email` (Resend idempotency, 24hr window), `Precedence: transactional`
- Both HTML and plain-text (`text` field) sent — plain text is critical for deliverability
- HTML: cream background `#f5f0e8`, white card, dark text, Persift wordmark as hosted PNG (`https://persift.com/wordmark.png`)
- No referral system — stripped entirely

### Referral system
Completely removed from frontend and API. Redis referral keys (`refcode:*`, `ref:*`, `refcount:*`, `refby:*`) may still exist in Upstash from prior signups but are no longer written or read.

### Duplicate signups
No Redis duplicate check — same email can resubmit. Only protection is Resend's 24hr idempotency via `X-Entity-Ref-ID`. Rate limit (5/hr per IP) prevents abuse.

### Deliverability status (as of 2026-06-16)
- SPF: verified ✅
- DKIM: verified ✅
- DMARC: `v=DMARC1; p=none; rua=mailto:hjarodiy@asu.edu` added to Namecheap DNS ✅
- Gmail Postmaster Tools: verified ✅ (domain reputation data will accumulate over weeks)
- Current issue: landing in Gmail Promotions tab — primary cause is new domain (3 days old) + low send volume, not template issues. Will improve with time. Users are shown a hint to move email to Primary.

---

## Routing (`src/main.tsx`)
- `/` — main landing page (`App.tsx`)
- `/privacy` — `src/pages/PrivacyPolicy.tsx`
- `/terms` — `src/pages/TermsOfService.tsx`
- `vercel.json` SPA catch-all rewrite handles all routes

Both legal pages set `document.title` on mount and restore homepage title on unmount.

---

## SEO (`index.html`)
- Title: `"Persift — Your job search runs itself."`
- Meta description, OG tags, Twitter card all set
- OG image: `https://persift.com/og-image.png` (cream background, Persift wordmark)
- JSON-LD structured data: `SoftwareApplication` schema
- Static crawler content div (visually hidden, aria-hidden) for SEO content
- `public/robots.txt` — allows all crawlers including GPTBot, ClaudeBot, Perplexity
- `public/sitemap.xml` — includes `/`, `/privacy`, `/terms`

---

## File Map
- `src/App.tsx` — entry, header, scroll progress bar, desktop/mobile split
- `src/scroll/MultiScene.tsx` — desktop scroll engine, wheel interceptor, RAF lerp, bands, nav
- `src/scroll/MobileLayout.tsx` — entire mobile layout (~570 lines)
- `src/scroll/SceneContext.tsx` — `useSceneProgress()` hook
- `src/scroll/nav.ts` — `jumpToCtaScene()`, `jumpToScene()`, `registerJumpToStep()`
- `src/hooks/useIsMobile.ts` — `useIsMobile(900)`, initialized synchronously from `window.innerWidth`
- `src/scenes/SceneHero.tsx` — desktop hero, zoom animation, logo ticker
- `src/scenes/MobileHero.tsx` — mobile hero (static)
- `src/scenes/Scene2Install.tsx` — Chrome Web Store install animation
- `src/scenes/Scene2Setup.tsx` — onboarding setup scene, typed fields
- `src/scenes/Scene3Machine.tsx` — Discover scene, typewriter autofill, 940vh
- `src/scenes/Scene4Overnight.tsx` — Autopilot scene, 5 companies, pipeline dots
- `src/scenes/Scene5Morning.tsx` — Morning dashboard, NeedsYou section, interview card
- `src/scenes/Scene6Analytics.tsx` — Analytics scene
- `src/scenes/Scene7Ask.tsx` — CTA/waitlist form, success/error/banner states
- `src/components/Brand.tsx` — `<Wordmark>` and `<PersiftMark>` components
- `src/components/LogoTicker.tsx` — animated company logo strip (13 logos)
- `src/components/DashboardShell.tsx` — shared browser chrome wrapper
- `src/components/ExtensionPopup.tsx` — Chrome extension popup UI
- `src/pages/PrivacyPolicy.tsx` — `/privacy` route
- `src/pages/TermsOfService.tsx` — `/terms` route
- `api/waitlist.ts` — Vercel serverless function
- `public/wordmark.png` — Persift wordmark PNG for email (dark on white, 300×90px source)
- `public/og-image.png` — OG social share image

---

## MobileLayout caveat
`innerStyle` has `textAlign: "center"` — cascades into ALL child elements. Any left-aligned content inside a mobile section must explicitly override with `textAlign: "left"`. Root cause of past Notion row indent and analytics company name misalignment bugs.
