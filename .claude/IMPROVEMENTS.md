# Persift Landing Page — Improvement Tracker

Status key: ⬜ pending · 🔄 in progress · ✅ done

---

## Architecture (all done)

### Single sticky container ✅
Merged Scene0Hero + MultiScene into one master sticky container. All scenes are absolute layers driven by one `useScroll`. No more dual-container black-screen gap. `fullBleed` flag bypasses nav column; `noSlide` flag for opacity-only transitions; `isFirst` flag starts at opacity 1.

### Header fixed ✅
`position: fixed; top: 0; z-index: 110`. Sticky stage offset to `top: 48px, height: calc(100vh - 48px)`. Header has `background: rgba(12,10,8,0.88)` + `backdropFilter: blur(8px)`.

### Meet Persift scene removed ✅
Removed entirely from `App.tsx` steps array. File `src/scenes/SceneMeetPersift.tsx` still exists but is not imported anywhere.

### Logo click → reload ✅
Wrapped `<Wordmark>` in `<a href="/">` in `App.tsx` header.

### Wheel interceptor scroll ✅ (2026-06-15)
Replaced `useScroll`/`useEffect` mirror with a custom wheel interceptor + RAF lerp in `MultiScene.tsx`.
- `SENSITIVITY = 0.00008` (normalized deltaY, capped at 100 per event)
- Lerp factor `0.09` — smooth physical feel, immediate visual response
- `targetRef` accumulates deltaY; RAF loop chases it
- `onProgressReady` callback exposes the `MotionValue<number>` to `App.tsx` for the top progress bar
- `jumpToStep()` sets both `targetRef.current` and `progress.set()` directly (no lerp animation on nav jump)
- `earlyEnter` prop on Step/SceneSlot: shifts `enterStart = bandStart - earlyEnter` so a scene can fade/slide in before its band officially begins

### Scroll snapping ✅ (2026-06-15)
Snap-to-boundary debounce implemented in `MultiScene.tsx`. When user stops scrolling mid-animation, page snaps to nearest scene boundary. Large-budget scenes (Discover) snap to start only.

---

## Scene-level fixes (all done)

### Hero copy ✅
"You qualify for hundreds of roles. / Apply to all of them." + subline.

### Logo ticker (desktop + mobile) ✅
`src/components/LogoTicker.tsx` — 13 company wordmarks/logos in a `@keyframes ticker-scroll` CSS animation, seamless loop via duplicated array + `translateX(-50%)`. Added to `SceneHero.tsx` (fades in/out with scroll) and `MobileHero.tsx`. Background `#181410`, 60px gradient masks each side.

### Machine scene (Discover) ✅
Typewriter autofill, 3 companies (Stripe/Anthropic/Figma), 940vh budget (desktop).
- `fitWidth`: `[0.06, 0.085]`
- `discoveryOpacity`: `[0, 0.04, 0.11, 0.16]`
- `headlineOpacity`: `[0, 0.04, 0.11, 0.16]` — fades OUT by 0.16, before autofill starts
- `workOpacity`: `[0.13, 0.18, 0.88, 0.94]` — fades out by 0.94 to avoid overlap with Autopilot earlyEnter
- All 3 `setState` calls in `useMotionValueEvent` wrapped in `requestAnimationFrame()` to prevent React setState-during-render warning
- `APPLY_START = 0.44`, `APPLY_END = 0.72`, `BAND = 0.0933`

### Overnight scene ✅
5 companies, pipeline dots, fixed-width columns, progressive clock, pulsing amber dot.
- `asleepOpacity/Y`: `[0.01, 0.05]`
- `isntOpacity/Y`: `[0.03, 0.08]`
- Vercel: `tailoredIdx: 99, submittedIdx: 99` — appears at 02:27 AM then goes straight to "Applying" pulse, no dot transitions
- TIMES: 12 entries, ends at "02:27 AM"
- `earlyEnter: 0.04` in App.tsx — Autopilot fades in before its band starts, slides up from y=70, eliminates the black gap after Discover

### Scene2Install ✅ (2026-06-15)
Fixed animations firing before scene loads in. FADE eats ~44% of Install's sceneProgress when scrollHeight was small.
- scrollHeight increased to `120vh`
- Scale/winY: `[0.10, 0.25]`
- `addOpacity [0.30→0.42]`, `addedOpacity [0.42→0.55]`
- `installedBadgeOpacity/Y [0.58→0.72]`

### Scene5Morning ✅ (2026-06-15)
- Added `"Check your phone."` headline — desktop only (`{!isMobile && ...}`)
- Replaced Up Next / Queue section with `NeedsYouSection` component
  - Amber bordered card, clipboard emoji icon
  - "Stripe · Software Engineer Intern" — OA prompt, not Workday (Workday doesn't do OAs)
  - "Online assessment received · complete to stay in consideration"
  - "Opens in app →"
- Interview card (Google Calendar alert for Stripe SWE Intern) kept

### Scene6Analytics ✅ (2026-06-15)
- Added `"See what's working."` headline — desktop only (`{!isMobile && ...}`)

### Scroll hint (chevron) ✅ (2026-06-15)
`scrollHintOpacity` in `App.tsx`: `[0, 0.03, 0.06, 0.91, 0.94]` — visible through all scenes, fades out only during CTA transition.

### Mobile layout ✅
`src/scroll/MobileLayout.tsx` — full mobile layout for ≤900px. Flat stacked sections, no scroll-driven animation. `StaticSceneWrapper` provides pinned `MotionValue` to SceneProgressContext. Sections: MobileHero → MobileInstall → MobileSetup → MobileDiscover → MobileOvernight → MobileMorning → MobileAnalytics → MobileCta. `MobileDiscover` uses IntersectionObserver (threshold 0.3) + rAF loop, 4000ms per company, 3 companies cycling.

### Mobile "It finds them. It applies." 2-line fix ✅ (2026-06-15)
`MobileLayout.tsx` — changed to `"It finds them.<br />It applies."` so it breaks across 2 lines on mobile.

### Mobile double headline fix ✅ (2026-06-15)
Scene5Morning and Scene6Analytics headlines are wrapped in `{!isMobile && ...}` — they were being rendered by both the scene component (inside MultiScene) AND separately rendered in MobileLayout, causing duplicates on desktop. Fixed by guarding with isMobile check.

### Mobile Notion row indent fix ✅ (2026-06-15)
`MobileLayout.tsx` line 386 — the flex text span inside overnight rows was inheriting `textAlign: "center"` from `innerStyle`. Shorter rows (Notion, Vercel) visibly centered within their `flex: 1` span while longer rows appeared left-aligned due to ellipsis truncation. Fixed with `textAlign: "left"` on the span.

### Mobile analytics company name alignment ✅ (2026-06-15)
Same root cause as Notion indent — `textAlign: "center"` from `innerStyle` cascading. Fixed with `textAlign: "left"` on the inner row div.

### Waitlist UX ✅ (2026-06-15)
- Form is always visible — never replaced by a locked success state
- `showAlreadyBanner` state: if `localStorage` has a saved email on load, shows an inline amber banner below the form ("You're already on the list at email@x.com") but keeps the form fully functional
- On successful submit: shows success message above the form, banner dismissed
- `"already"` status type removed — demoted to non-blocking banner
- `LS_KEY = "persift_waitlist_email"` still used to pre-fill the email input and show banner

### Waitlist API ✅
- Honeypot field: hidden `name="website"` input
- Disposable domain blocklist (~70 providers)
- Stricter email regex client + server
- Rate limit via Upstash Redis
- LaunchList fire-and-forget (never blocks form flow)
- Idempotency key prevents duplicate emails

### Confirmation email ✅ (2026-06-14)
- SVG wordmark in header
- Outcome-first copy
- Sign-off: "Himanshu, founder of Persift" at weight 600/opacity 0.85
- Footer disclaimer legible at 13px/opacity 0.5

### Legal pages ✅
- `src/pages/PrivacyPolicy.tsx` at `/privacy`
- `src/pages/TermsOfService.tsx` at `/terms`
- `react-router-dom` installed, routes in `src/main.tsx`
- `vercel.json` SPA catch-all rewrite
- Privacy/Terms links in Scene7Ask footer

---

### #N5 — Confirmation email deliverability ✅ (2026-06-15)

- SPF + DKIM verified in Resend dashboard (Namecheap DNS)
- DMARC record added to Namecheap: `_dmarc TXT v=DMARC1; p=none; rua=mailto:hjarodiy@asu.edu`
- `List-Unsubscribe` + `List-Unsubscribe-Post` headers added to both sends in `api/waitlist.ts`
- Hidden preheader text added to both email HTML bodies
- Re-test: delete iCloud address from LaunchList after 24h, have them resubmit, check junk

### #8 — SEO ✅ (2026-06-15)

- `<title>` updated to `"Persift — Your job search runs itself."`
- `<meta description>`, OG title/description, Twitter title/description all updated to match
- `/privacy` and `/terms` added to `public/sitemap.xml`
- Per-route `document.title` set in `PrivacyPolicy.tsx` and `TermsOfService.tsx` (restores homepage title on unmount)
- OG image already deployed at `persift.com/og-image.png`

---

## PENDING

Nothing currently pending.

## Key technical context for next agent

### Files
- `src/App.tsx` — entry, desktop/mobile split via `useIsMobile(900)`, header, scroll progress bar, scroll hint chevron
- `src/scroll/MultiScene.tsx` — desktop sticky scroll container, wheel interceptor, RAF lerp, earlyEnter, snap-to-boundary
- `src/scroll/MobileLayout.tsx` — entire mobile layout (~630 lines)
- `src/scroll/SceneContext.tsx` — `useSceneProgress()` returns `MotionValue<number>` 0→1
- `src/scroll/nav.ts` — singleton for `jumpToCtaScene()` (index 7)
- `src/scenes/SceneHero.tsx` — desktop hero with zoom animation + logo ticker
- `src/scenes/MobileHero.tsx` — mobile hero (static, no zoom)
- `src/scenes/Scene2Install.tsx` — Chrome Web Store install animation
- `src/scenes/Scene2Setup.tsx` — onboarding setup scene
- `src/scenes/Scene3Machine.tsx` — Discover scene, typewriter autofill, 940vh
- `src/scenes/Scene4Overnight.tsx` — Autopilot/overnight scene, 5 companies, 150vh
- `src/scenes/Scene5Morning.tsx` — Morning dashboard scene, 100vh
- `src/scenes/Scene6Analytics.tsx` — Analytics scene, 100vh
- `src/scenes/Scene7Ask.tsx` — CTA/waitlist form, LegalFooter
- `src/components/LogoTicker.tsx` — animated company logo strip
- `src/components/DashboardShell.tsx` — shared browser chrome wrapper
- `api/waitlist.ts` — Vercel serverless function (honeypot, disposable domains, rate limit, LaunchList, Resend)
- `src/pages/PrivacyPolicy.tsx` — `/privacy` route
- `src/pages/TermsOfService.tsx` — `/terms` route

### Scroll architecture
- Desktop total: `65 + 120 + 86 + 940 + 150 + 100 + 100 + 150 = 1711vh`
- `MultiScene.tsx` uses wheel interceptor (not native scroll). `window.scrollTo` does nothing — must set `targetRef.current` directly.
- **Never pass raw `scrollYProgress` to `useTransform`** — use mirrored `useMotionValue` pattern (Framer Motion v12 WAAPI rule).
- `earlyEnter` prop: Autopilot uses `earlyEnter: 0.04` to eliminate black gap after Discover fades out.
- `jumpToStep(i)` sets both `targetRef.current = bands[i].start` AND `progress.set(target)` — instant jump, no lerp animation.
- `StaticSceneWrapper` in MobileLayout provides `useMotionValue(pinAt)` to SceneContext for static mobile sections.
- `useMotionValueEvent` does NOT fire on a static MotionValue — use regular state/refs for mobile animations.

### FADE cost in small scenes
`FADE = 0.007` global progress units. For a small scene, FADE eats a big % of sceneProgress:
- Install (120vh / 1711vh total = 0.07 band): FADE/band = 0.007/0.07 = 10% per side = 20% total eaten
- Any animations must be pushed past the FADE threshold (e.g., start at sceneProgress 0.10+ not 0.0)

### Design system
- `--bg` #0c0a08, `--amber` #f0a341, `--ink` #f3ece1, `--green` #5fd07f
- Also: `--ink-soft`, `--ink-faint`, `--ink-mute`, `--amber-soft`, `--amber-deep`, `--line`, `--surface`
- Fonts: Plus Jakarta Sans 700/800 (headlines), Spectral 300 italic (amber accent), Fraunces 500 (Scene7Ask closing line ONLY — nowhere else), Inter 400/500/600 (body), Roboto 400 (Chrome store UI in WorkflowAnimation)
- Copy: "early-career roles" not "internships". Never "while you sleep" / "you sleep, Persift works".

### MobileLayout shared style caveat
`innerStyle` has `textAlign: "center"` — cascades into ALL child elements. Any left-aligned content inside a mobile section must explicitly override with `textAlign: "left"`. This was the root cause of the Notion row indent AND the analytics company name misalignment.

### Scene7Ask waitlist state
- `status`: `"idle" | "loading" | "success" | "error"` — NO "already" state anymore
- `showAlreadyBanner`: boolean, true if `localStorage` has saved email on mount
- `savedEmail`: read from `localStorage.getItem(LS_KEY)` once on mount
- `email` input pre-filled with `savedEmail`
- On any email input change: `showAlreadyBanner` is dismissed
- Form always renders — success message appears above form, not replacing it
