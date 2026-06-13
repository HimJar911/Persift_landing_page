# Persift Landing Page — Improvement Tracker

Status key: ⬜ pending · 🔄 in progress · ✅ done

---

## Architecture (all done)

### Single sticky container ✅
Merged Scene0Hero + MultiScene into one master sticky container. All scenes are absolute layers driven by one `useScroll`. No more dual-container black-screen gap. `fullBleed` flag bypasses nav column; `noSlide` flag for opacity-only transitions; `isFirst` flag starts at opacity 1.

### Header fixed ✅
`position: fixed; top: 0; z-index: 110`. Sticky stage offset to `top: 48px, height: calc(100vh - 48px)`.

### Checkerboard fix ✅
Replaced alpha-transparent desk.png (Figma cutout) with original opaque image. Source: `c:\Users\himan\Downloads\Gemini_Generated_Image_xwrorbxwrorbxwro (2).png`.

---

## Scene-level fixes

### Hero copy ✅
"You qualify for hundreds of roles. / Apply to all of them." + subline. "early-career roles" framing (covers new grads).

### Hero zoom + terminal animation ✅
SceneHero.tsx — desk zoom, green terminal, "Enter:" cursor, scanlines fade, screen opacity fade. 300vh scroll band.

### Meet Persift scene ✅
SceneMeetPersift.tsx — pills stagger in, Join Waitlist button scrolls directly to Launch scene by pixel position (not scrollIntoView on sticky element).

### Chrome Web Store title ✅
"Job applications on autopilot." — Roboto 400 22px.

### Setup scene ✅
"What happens next" section added to ExtensionPopup. Cards aligned.

### Machine scene (Discover) ✅
- Discovery timing: card fades in at p=[0.18,0.28]
- Duplicate Anthropic: fixed with Math.floor
- Linear → Figma replacement (Greenhouse, Design Engineer Intern)
- APPLY_END: 0.88 → 0.72; needsYou threshold: 0.73
- Form maxHeight: calc(100vh - 240px) to prevent overflow

### Overnight scene ✅
5 companies, pipeline dots, fixed-width columns, progressive clock, pulsing amber dot.

### Morning + Analytics scenes ✅
Moved into MultiScene scroll timeline. `justifyContent: center`, `padding: 16px 24px`, `maxHeight: calc(100vh - 280px)`.

### Nav sidebar ✅
- Slides in with navX/marginLeft (no text reflow)
- All items clickable — `jumpToStep()` scrolls to exact pixel position
- "Ship it" → "Launch" (uppercase, amber glow on accent bar, divider line above)
- Join Waitlist in navbar + Meet Persift both use pixel-based scroll (not scrollIntoView)

---

## Still pending

### Logo / Brand mark ⬜ (pick up here)
User's original logo: `c:\Users\himan\Downloads\Persift Logo (1).svg` — P letterform with circular punch-through, designed at 500×500.
Problem: 500×500 paths render as thin skeleton at 20–26px. Multiple arc-direction attempts failed.
Next step: verify arc direction in throwaway HTML file before touching Brand.tsx.
File: `src/components/Brand.tsx`

### Chaos scene ⬜ (blocked on user research)
Needs cold user research from real students. Don't touch until Himanshu gives go-ahead.
File: `src/scenes/Scene1Chaos.tsx`

### Empty space ⬜ (do last)
Systemic padding across all scenes — address scene by scene after all other fixes.

### Scroll smoothness ⬜ (assess end-to-end last)
Overall feel still not assessed with the new architecture. Revisit when full page is stable.
