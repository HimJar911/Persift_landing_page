# Responsive Design Audit — Persift Landing Page

## Summary

The page has solid responsive foundations in most scenes (clamp font sizes, 90vw/maxWidth patterns, conditional mobile layouts), but has three systemic problems: (1) **touch targets are universally undersized** — nearly every interactive element is 20–39px tall, well below the 44px minimum, affecting every mobile user; (2) **the `useIsMobile` breakpoint is inconsistent** — some scenes use 640px, others 900px, so iPad (768px) gets a hybrid experience where the nav is hidden but scene layouts are mixed; (3) **Scene0Hero's laptop image + WorkflowAnimation overlay** is the highest-risk component — the animation is positioned via hardcoded pixel offsets derived from a 1522×688 image and must be verified in-browser on each target device to confirm the animation stays registered to the laptop screen bezel. Several scenes also have hardcoded font sizes and heights with no mobile overrides.

---

## Issues by Scene

### App.tsx (Header / Global Shell)

- **`src/App.tsx:49`** — `padding: "0 32px"` on the header. On iPhone SE (375px), this leaves only 311px for logo + button. Not a hard break but tight. **Devices: iPhone SE.**
- **`src/App.tsx:59`** — `padding: "8px 18px"` on the "Join Waitlist" button with no explicit height. Renders at ~24px tall. **Touch target violation (24px < 44px minimum). Devices: iPhone 14, iPhone SE.**
- **`src/App.tsx:60`** — `fontSize: 13` on header button. Acceptable but small on mobile.
- **`src/App.tsx:103–104`** — Scroll hint chevron `width: 14, height: 14`. Decorative, but the entire hint element has no minimum tap area defined.

---

### Scene0Hero / SceneHero (Hero Laptop Scene)

- **`src/scenes/Scene0Hero.tsx` (ANIM_L, ANIM_T, ANIM_W, ANIM_H constants)** — Screen cutout positioned at `left: 538, top: 37, width: 501, height: 331` in the image's natural 1522×688 coordinate space. WorkflowAnimation is absolutely placed inside these pixel offsets. The entire block scales via a CSS wrapper, but any sub-pixel rounding error at small viewports can mis-register the animation relative to the laptop screen bezel. **Must be verified in-browser on iPhone 14 and iPhone SE.** Breaks on: iPhone 14, iPhone SE (high risk).
- **`src/scenes/Scene0Hero.tsx` (gradient overlay `height: 300`)** — Bottom gradient overlay is hardcoded `height: 300`. On iPhone 14 (844px viewport), that's 35.5% of the viewport height. On iPhone SE (667px), it's 45% of height. No mobile override. **Devices: iPhone 14, iPhone SE.**
- **`src/scenes/Scene0Hero.tsx` (`fontSize: "2.2cqw"`)** — Terminal text uses container query width units. Responsive by nature, but depends on a `container-type` being defined on the parent at all viewport sizes. Low risk — verify in-browser.

---

### SceneMeetPersift

- `p fontSize: "clamp(15px, 1.6vw, 20px)"` — Responsive, good.
- No major hardcoded layout issues found in this scene.

---

### Scene2Install

- No critical issues. Scene uses `width: "90vw", maxWidth: 1040` on the Chrome window, `flex-wrap: "wrap"` on heading rows, and conditionally hides screenshot tiles on mobile (`!isMobile`). "Add to Chrome" button is `height: 46` — acceptable.
- **`src/scenes/Scene2Install.tsx` (MiniCard text: 9px, 10px, 11px)** — Very small text inside mini-card decorations. At 390px these render unreadably small, but they appear to be intentional miniatures (decorative). **Low risk.**

---

### Scene2Setup

- **`src/scenes/Scene2Setup.tsx` (TypedField `height: 36`)** — Input field is 36px tall. **Touch target violation (36px < 44px). Devices: iPhone 14, iPhone SE.**
- **`src/scenes/Scene2Setup.tsx` (CheckItem `padding: "8px 11px"`)** — Renders at ~29px tall. **Touch target violation (29px < 44px). Devices: iPhone 14, iPhone SE.**
- **`src/scenes/Scene2Setup.tsx` (Toggle `height: 22`)** — Toggle switch is 22px tall with an 18×18 knob inside. **Touch target violation (22px < 44px). The interactive hit area is far too small for reliable mobile tapping. Devices: iPhone 14, iPhone SE.**
- **`src/scenes/Scene2Setup.tsx` (Resume field `height: 27`)** — Resume upload field is 27px tall. **Touch target violation (27px < 44px). Devices: iPhone 14, iPhone SE.**
- **`src/scenes/Scene2Setup.tsx` (ambient glow: `width: 700, height: 500`)** — Absolutely positioned, centered via transform. Does not cause overflow. Low risk.

---

### Scene3Machine

- **`src/scenes/Scene3Machine.tsx` (FilledField `height: 27`)** — Same pattern as Scene2Setup. `height: 27`, `padding: "0 9px"`. Touch target violation (display-only fields in the animation — actual user interaction risk is low, but fails guidelines). **Devices: iPhone 14, iPhone SE.**
- **`src/scenes/Scene3Machine.tsx` (NeedsYou buttons: `padding: "10px 8px"`, `fontSize: 12.5`)** — Renders at ~32px tall. **Touch target violation (32px < 44px). These are interactive — user must tap them. Devices: iPhone 14, iPhone SE.**
- **`src/scenes/Scene3Machine.tsx`** — Calls `useIsMobile()` with no argument, defaulting to the 640px breakpoint. Most other scenes use `useIsMobile(900)`. **Breakpoint inconsistency: iPad (768px) will receive the mobile layout in this scene but the desktop layout in Scene2Install, Scene4Overnight, Scene5Morning, etc.**
- **`src/scenes/Scene3Machine.tsx` (`minHeight: 520`)** — Applied to the mobile container. On iPhone SE (667px - 64px header = 603px usable), this is tight but fits.

---

### Scene4Overnight

- **`src/scenes/Scene4Overnight.tsx` (`COL_ICON: 16, COL_PIPELINE: 61, COL_MATCH: 52, COL_TIME: 72`)** — Fixed column widths totaling 201px. On iPhone SE (375px - 48px padding = 327px), the remaining ~126px goes to the company name + role text column. Long role names like "Infrastructure Intern" will likely wrap to two lines, making rows taller than designed with no height compensation. No responsive adjustment for column widths. **Devices: iPhone SE (text overflow/wrapping).**
- **`src/scenes/Scene4Overnight.tsx` (row `padding: "5px 6px"`)** — Rows are ~24px tall by design. If role text wraps, rows expand inconsistently. **Medium risk on iPhone SE.**
- **`src/scenes/Scene4Overnight.tsx` (glow: `width: 900, height: 900`)** — Centered via `translate(-50%, -50%)`. Does not cause overflow if parent has `overflow: hidden`. Confirm parent overflow is set. Low risk.
- Match % column is hidden on mobile (`!isMobile`) — good, reduces column pressure.

---

### Scene5Morning

- **`src/scenes/Scene5Morning.tsx` (h3 `fontSize: 26`)** — Hardcoded `fontSize: 26` with no `clamp()` or mobile override. Inconsistent with the rest of the page. **Low risk visually, medium consistency issue.**
- **`src/scenes/Scene5Morning.tsx` (StatCard value `fontSize: 24`)** — Hardcoded, no clamp. In a 2-column grid on mobile, each card is ~175px wide — a 24px number is visually fine but has no responsive adjustment. **Low risk.**
- BrowserWindow uses `width: "90vw", maxWidth: 1040` — responsive, good.

---

### Scene6Analytics

- **`src/scenes/Scene6Analytics.tsx`** — Calls `useIsMobile()` with no argument, defaulting to 640px. **Same inconsistency as Scene3Machine. iPad (768px) gets the mobile layout here but desktop layout in most other scenes.**
- **`src/scenes/Scene6Analytics.tsx` (TimelineChart `height: 80`)** — Chart container hardcoded at 80px. No responsive override. Acceptable but should use clamp. **Low risk.**
- **`src/scenes/Scene6Analytics.tsx` (MiniStat `fontSize: 18`)** — Hardcoded, no clamp. Low risk on its own but inconsistent with design system.
- **`src/components/DashboardShell.tsx` (tab `padding: "6px 12px"`)** — Tab height ~20px. **Touch target violation (20px < 44px). Devices: iPhone 14, iPhone SE.** If tabs are purely decorative in the simulated browser, low risk; if tappable, high risk.

---

### Scene7Ask (CTA)

- **`src/scenes/Scene7Ask.tsx:151`** — Email input `padding: "10px 12px"`. Renders at ~39px tall (10 + 10 + ~19px line-height). **Touch target violation (39px < 44px) on the primary conversion input. Devices: iPhone 14, iPhone SE.**
- **`src/scenes/Scene7Ask.tsx:162`** — Submit button `padding: "10px 20px"`. Renders at ~39px tall. **Touch target violation on the most important CTA on the page. Devices: iPhone 14, iPhone SE.**
- Form `maxWidth: 420` — safe on all target devices.
- Glow `width: 760, height: 760` — decorative, centered via transform, does not cause overflow.

---

## Global / Layout Issues

### MultiScene.tsx — Navigation Sidebar

- **`src/scroll/MultiScene.tsx` (`useIsMobile(900)`)** — Nav is hidden at ≤900px. iPhone 14, iPhone SE, and iPad (768px) all get no nav. Correct behavior.
- **`src/scroll/MultiScene.tsx` (nav `width: 200px`)** — When viewport is 900–1100px (narrow desktop, landscape tablet Pro), the nav takes up 18–22% of the width with no responsive shrink. **Medium risk on narrow desktop.**
- **`src/scroll/MultiScene.tsx` (StepLabel `paddingTop: 8, paddingBottom: 8`)** — Touch target height ~24px. Nav is hidden on mobile so this only matters on narrow desktop. **Medium risk.**

### useIsMobile Hook — Breakpoint Inconsistency

- **`src/hooks/useIsMobile.ts` (default: 640px)** — Default breakpoint is 640px, but `MultiScene.tsx` and most scenes explicitly pass `900px`. `Scene3Machine` and `Scene6Analytics` call `useIsMobile()` with no argument, defaulting to 640px.
- **Result on iPad (768px):** Nav is hidden (900px breakpoint — correct). But Scene3Machine shows the mobile layout (640px < 768px → true) while Scene2Install, Scene4Overnight, Scene5Morning show the desktop layout (900px > 768px → false). **This creates an inconsistent hybrid layout on iPad with no nav.** Fix: standardize all scene calls to `useIsMobile(900)`.

### ExtensionPopup.tsx

- **`src/components/ExtensionPopup.tsx` (toggle: `width: 38, height: 22`)** — Toggle knob is 22px in a 38×22 container. No minimum tap area. **Touch target violation. Devices: iPhone 14, iPhone SE.**

### index.css — Global Styles

- No `@media` queries for font scaling found. All responsive typography relies on inline `clamp()`, which works but is harder to audit and maintain.
- No `touch-action` declarations. May cause passive scroll listener warnings on iOS Safari.
- No `-webkit-overflow-scrolling: touch` on inner scroll containers — relevant for any scrollable content inside scenes on iOS.

---

## Priority Order

### High — Fix Before Launch

| # | Issue | File | Devices |
|---|-------|------|---------|
| H1 | CTA submit button touch target ~39px — **primary conversion action** | `src/scenes/Scene7Ask.tsx:162` | iPhone 14, iPhone SE |
| H2 | CTA email input touch target ~39px | `src/scenes/Scene7Ask.tsx:151` | iPhone 14, iPhone SE |
| H3 | Header "Join Waitlist" button touch target 24px — **secondary conversion** | `src/App.tsx:59` | iPhone 14, iPhone SE |
| H4 | Hero WorkflowAnimation pixel-offset registration — must verify in-browser | `src/scenes/Scene0Hero.tsx` (ANIM_L/T/W/H) | iPhone 14, iPhone SE |
| H5 | Hero gradient `height: 300` hardcoded — covers 35–45% of viewport on phones | `src/scenes/Scene0Hero.tsx` | iPhone 14, iPhone SE |
| H6 | `useIsMobile` breakpoint inconsistency (640px vs 900px) — iPad hybrid layout | `src/scenes/Scene3Machine.tsx`, `src/scenes/Scene6Analytics.tsx` | iPad |

### Medium — Fix Before/Shortly After Launch

| # | Issue | File | Devices |
|---|-------|------|---------|
| M1 | NeedsYou buttons touch target ~32px — only interactive element in machine scene popup | `src/scenes/Scene3Machine.tsx:480–481` | iPhone 14, iPhone SE |
| M2 | Toggle switch touch target 22px | `src/scenes/Scene2Setup.tsx:309`, `src/components/ExtensionPopup.tsx:112` | iPhone 14, iPhone SE |
| M3 | TypedField input `height: 36` | `src/scenes/Scene2Setup.tsx:63` | iPhone 14, iPhone SE |
| M4 | CheckItem touch target ~29px | `src/scenes/Scene2Setup.tsx:103` | iPhone 14, iPhone SE |
| M5 | Overnight scene fixed column widths — text overflow/wrapping on narrow screens | `src/scenes/Scene4Overnight.tsx:38–42` | iPhone SE |
| M6 | Nav sidebar StepLabel touch target ~24px | `src/scroll/MultiScene.tsx:170` | Narrow desktop |
| M7 | FilledField `height: 27` | `src/scenes/Scene3Machine.tsx:237`, `src/scenes/Scene2Setup.tsx:241` | iPhone 14, iPhone SE |

### Low — Polish / Consistency

| # | Issue | File | Notes |
|---|-------|------|-------|
| L1 | Scene5Morning h3 `fontSize: 26` — no clamp | `src/scenes/Scene5Morning.tsx:175` | Visually fine, inconsistent |
| L2 | Scene6Analytics MiniStat `fontSize: 18` — no clamp | `src/scenes/Scene6Analytics.tsx:91` | Visually fine, inconsistent |
| L3 | DashboardShell tab touch target ~20px | `src/components/DashboardShell.tsx:61` | Decorative UI — low interaction |
| L4 | Resume field `height: 27` | `src/scenes/Scene2Setup.tsx:241` | Display-only, not user-interactive |
| L5 | Header padding 32px on mobile | `src/App.tsx:49` | Tight but functional |
| L6 | MiniCard text 9–11px | `src/scenes/Scene2Install.tsx` | Intentional mini-UI, decorative |
| L7 | TimelineChart `height: 80` hardcoded | `src/scenes/Scene6Analytics.tsx:51` | Acceptable, not critical |
| L8 | Nav `width: 200px` — no responsive shrink at 900–1100px | `src/scroll/MultiScene.tsx:303` | Narrow desktop only |
