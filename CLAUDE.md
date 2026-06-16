# Persift Landing Page — Agent Handover

## Project
Scroll-driven React landing page for Persift — a Chrome extension that autonomously finds early-career jobs and applies to them. Builder: Himanshu Jarodiya (CS @ ASU, founder).

Dev server: `npm run dev`  
Build: `npm run build`

## Stack
React 18 + TypeScript + Vite + Framer Motion v12 + npm

## Improvement tracker
All pending/done work lives in `.claude/IMPROVEMENTS.md`. Read that first every session.

---

## Scroll Architecture

- `src/App.tsx` — desktop/mobile split via `useIsMobile(900)`. Desktop uses `MultiScene`. Header is `position: fixed; top: 0; z-index: 110` with `background: rgba(12,10,8,0.88)` + `backdropFilter: blur(8px)`.
- `src/scroll/MultiScene.tsx` — sticky container. Slices `scrollYProgress` into per-scene bands. Has `jumpToStep()` and scroll-snap debounce (150ms).
- `src/scroll/SceneContext.tsx` — `useSceneProgress()` returns `MotionValue<number>` 0→1 for the current scene's band.
- `src/scroll/MobileLayout.tsx` — full mobile layout (≤900px). Flat stacked sections, no scroll animation. `StaticSceneWrapper` pins a `useMotionValue` for SceneContext.

**CRITICAL — Framer Motion v12 WAAPI rule:**  
Never pass raw `scrollYProgress` directly to `useTransform`. Mirror it first:
```ts
const progress = useMotionValue(0)
useEffect(() => scrollYProgress.on("change", (v) => progress.set(v)), [])
```

**Scene scroll budgets (total ~3170vh):**
| Scene | File | Budget |
|---|---|---|
| Hero | SceneHero.tsx | 240vh |
| Install | Scene2Install.tsx | 200vh |
| Set up | Scene2Setup.tsx | 200vh |
| Discover | Scene3Machine.tsx | 2000vh |
| Autopilot | Scene4Overnight.tsx | 180vh |
| Morning | Scene5Morning.tsx | 100vh |
| Analytics | Scene6Analytics.tsx | 100vh |
| CTA | Scene7Ask.tsx | 150vh |

---

## Design System

Colors (`src/index.css`): `--bg` #0c0a08, `--amber` #f0a341, `--ink` #f3ece1, `--green` #5fd07f  
Also: `--ink-soft`, `--ink-faint`, `--ink-mute`, `--amber-soft`, `--line`, `--surface`

**Fonts:**
- **Plus Jakarta Sans 700/800** — headlines, nav labels
- **Spectral 300 italic** — amber italic accent lines
- **Fraunces 500** — Scene7Ask closing punch line ONLY. Do not use anywhere else.
- **Inter 400/500/600** — body copy
- **Roboto 400** — Chrome Web Store UI inside WorkflowAnimation

---

## Copy Rules
- "early-career roles" not "internships" — covers new grads
- Never "while you sleep" / "you sleep, Persift works" — rejected, overused
- Punchy and specific. Not explanatory.

---

## Key Technical Notes

### useIsMobile
`src/hooks/useIsMobile.ts` — initialized synchronously from `window.innerWidth`. Always pass `900` for desktop/mobile split: `useIsMobile(900)`.

### Machine Scene (Scene3Machine.tsx)
- Pipeline: Stripe → Anthropic → Figma
- `APPLY_START = 0.44`, `APPLY_END = 0.72`, `BAND = 0.0933`
- `rawIndex` uses `Math.floor` (not Math.round) — avoids mid-fill company switches
- `fillFrac` threshold 0.15: `Math.max(0, Math.min(1, (f - 0.15) / 0.85))`
- `needsYou` triggers at p >= 0.73

### Overnight Scene (Scene4Overnight.tsx)
- 5 companies, `foundIdx`/`tailoredIdx`/`submittedIdx` into 14-entry TIMES array
- Column widths: `COL_ICON=16`, `COL_PIPELINE=61`, `COL_MATCH=52`, `COL_TIME=72`, `ROW_GAP=10`
- Pipeline dot colors: Found=#f0a341, Tailored=#c084fc, Applied=#5fd07f
- Notion: `foundIdx=tailoredIdx=9` (no separate tailoring). Vercel: `submittedIdx=99` (never submits)

### Hero Animation (WorkflowAnimation.tsx + SceneHero.tsx)

**SceneHero.tsx** mounts `WorkflowAnimation` inside laptop screen cutout:
- `ANIM_L=538, ANIM_T=37, ANIM_W=501, ANIM_H=331` (image natural coords, image is 1522×688)
- Gradients: bottom 300px fade, left 27%, right 27% — no top gradient

**WorkflowAnimation.tsx constants:**
```typescript
const PHASE_MS = {
  opening: 1000, filling: 5000, clicking: 600,
  submitted: 1500, gmail: 1500, closing: 1000,
}
const TOTAL_FIELDS: Record<ATS, number> = { ashby: 12, greenhouse: 12, lever: 12 }
const FORM_HEIGHT: Record<ATS, number>  = { ashby: 420, greenhouse: 500, lever: 780 }
const LOG_LINES: Record<ATS, string[]> = {
  ashby:      ["Detected Ashby ATS", "Parsing 12 fields", "Resume matched", "Submitting…"],
  greenhouse: ["Detected Greenhouse ATS", "Parsing 18 fields", "Resume matched", "Submitting…"],
  lever:      ["Detected Lever ATS", "Parsing 14 fields", "Resume matched", "Submitting…"],
}
const JOBS = [
  { company: "Ramp",      role: "Software Engineer, AI Forward Deployed", ats: "ashby",      url: "jobs.ashbyhq.com/ramp/ai-forward-deployed",  logoBg: "#f5f0eb", logoColor: "#2d2926" },
  { company: "DoorDash",  role: "Principal Software Engineer, Ads",        ats: "greenhouse", url: "job-boards.greenhouse.io/doordash/jobs/5521", logoBg: "#fff1f0", logoColor: "#FF3008" },
  { company: "Shield AI", role: "Product Manager, AI Platforms",           ats: "lever",      url: "jobs.lever.co/shieldai/r4991",                logoBg: "#f0f2f5", logoColor: "#1a1a1a" },
]
// Jane Doe is fake — not real applicant data
const JANE = {
  firstName: "Jane", lastName: "Doe", fullName: "Jane Doe",
  email: "jane.doe@example.com", phone: "(555) 867-5309",
  location: "Seattle, WA", linkedin: "linkedin.com/in/janedoe",
  website: "janedoe.dev", company: "Doe Labs",
  school: "University of Washington", degree: "B.S. Computer Science",
  resume: "Jane_Doe_Resume.pdf",
  essay: "Recently I built a tool that automatically tracks internship applications...",
  whyUs: "I am drawn to organizations that solve technically challenging problems...",
}
```

Phase loop: logs fire at 85% of fill duration, wait remaining 15% for scroll to reach bottom. `cancelRef.current` checked at each phase transition.  
Scroll: `transition: "transform 0.12s linear"` — not ease-in-out (caused snapping).

### Waitlist (api/waitlist.ts + Scene7Ask.tsx)
- Honeypot field: hidden `name="website"` input
- Disposable domain blocklist (~70 providers), stricter email regex on both client and server
- Rate limit via Upstash Redis
- LaunchList fires independently (fire-and-forget, never blocks form flow)
- `LS_KEY = "persift_waitlist_email"` — stores submitted email, pre-fills form on return visit

### MobileLayout shared style caveat
`innerStyle` has `textAlign: "center"` — any left-aligned child must explicitly override with `textAlign: "left"`.
