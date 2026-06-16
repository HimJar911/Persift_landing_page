# Discover Scene (Scene3Machine) — Fix Brief

## What this scene does
The Discover scene (`src/scenes/Scene3Machine.tsx`) is the "It finds them. It applies." section. It has a 2000vh scroll budget. It runs through 3 companies (Stripe → Anthropic → Figma) and for each shows:
1. A "New role found" discovery card with a fit analysis bar (opening beat, only for Stripe)
2. A tailoring panel ("Tailoring resume for X…") inside an ExtensionPopup
3. An application form being auto-filled field by field (typewriter animation)
4. At the very end: a "Needs you" state for Figma

The scene's `sceneProgress` (0→1) comes from `useSceneProgress()` which maps to the scene's band within the total page scroll.

---

## The problems (reported by Himanshu scrolling manually)

### 1. Discovery card loader completes too early / fades out mid-animation
The fit analysis bar (`fitWidth`) animates from `[0.08, 0.24]` in scene progress. It starts fading out at `p=0.14`. So the bar starts fading before it's full. The discovery beat feels rushed and exits before the "94% match" and "Not on LinkedIn yet" lines are fully visible.

### 2. Tailoring panels have too much scroll time
For each company, the tailoring phase runs from `frac=0` to `frac=0.45` (45% of each company's slot). Users reported this feels like dead time — the spinner just spins with no new information appearing. The scroll time allocated to tailoring is too long relative to what's happening visually.

### 3. Autofill doesn't complete before fading out starts
The autofill (filling phase) runs from `frac=0.55` to `frac=1.0`, with the essay typing from `fillFrac=0.62` to `0.99`. The company crossfade (fade out) starts at `frac=0.96`. So for companies where the essay is long, the typing is still happening when the scene starts fading to the next company.

### 4. Excess scroll time between phase transitions
The gap between `frac=0.45` (tailoring ends) and `frac=0.55` (filling begins) is dead time — the form is neither tailoring nor filling. This is wasted scroll.

---

## Key constants to understand

### Scene-level (in `Scene3Machine`)
```typescript
const APPLY_START = 0.22   // scene progress where company cycling begins
const APPLY_END   = 0.85   // scene progress where cycling ends
const BAND = (APPLY_END - APPLY_START) / 3  // = 0.21 per company
```

So each company gets 21% of scene progress (= 420vh out of 2000vh).

### Per-company slot (frac = 0→1 within each company's BAND)
```typescript
// Phase split
phase = frac < 0.45 ? "tailoring" : "filling"

// Form crossfade (mobile only)
popupOpacity = useTransform(frac, [0.25, 0.50], [1, 0])
formOpacity  = useTransform(frac, [0.50, 0.75], [0, 1])

// Fill fraction within filling phase
fillFrac = Math.max(0, Math.min(1, (frac - 0.55) / 0.45))

// Company crossfade (fade between companies)
// fades out from frac=0.96 to frac=1.0 (except last company)
if (f > 0.96) return (1 - f) / 0.04
```

### Within `ApplicationForm` (fillFrac = 0→1)
```typescript
// Field typing ranges (start, end in fillFrac space):
Full name:          [0.00, 0.10]
Email:              [0.10, 0.20]
Resume filename:    [0.20, 0.28]
Work authorization: [0.28, 0.40]
Graduation date:    [0.40, 0.48]
GPA:                [0.48, 0.53]
Portfolio/GitHub:   [0.53, 0.62]
Essay:              [0.62, 0.99]  // longest, most important
```

---

## What Himanshu wants fixed

### Principle: remove dead time, don't redistribute it
When there's too much scroll time on a phase (tailoring spinner, post-autofill hold), **shrink that phase's frac range** rather than filling it with more content. The 2000vh total budget should also come down if we remove dead time — don't pad it back out.

### Specific fixes needed

**Discovery beat (opening Stripe card):**
- The bar currently animates `[0.08, 0.24]` and the card fades out starting at `p=0.14` (scene progress, not frac)
- The fade out `[0.14, 0.22]` overlaps with the bar still filling
- Fix: delay the fade-out start so the discovery card is fully visible (bar complete, match % shown, "Not on LinkedIn yet" visible) before any fade begins
- `discoveryOpacity = useTransform(p, [0, 0.05, 0.14, 0.22], [0, 1, 1, 0])` — the `0.14` hold-end needs to move later

**Tailoring phase (per company):**
- Currently `frac < 0.45` = tailoring. That's 45% of each company's 420vh = ~189vh just watching a spinner
- Shorten to ~20-25% of the slot. The tailoring panel shows 2 bullets and a spinner — it doesn't need 189vh
- Suggestion: tailoring at `frac < 0.20`, filling starts at `frac > 0.25` (with a quick crossfade gap)

**Filling / autofill phase:**
- Currently filling runs `frac=0.55→1.0` but crossfade out starts at `frac=0.96`
- Essay alone runs from `fillFrac=0.62→0.99`, meaning it starts at ~`frac=0.83` and must finish before `frac=0.96`
- That's only 13% of the slot (~55vh) to type a full essay — too tight
- With shortened tailoring, you can start filling earlier and give essay more room
- Suggestion: filling starts at `frac=0.25`, crossfade out at `frac=0.92`, essay has `fillFrac=[0.55, 0.98]`

**Between companies:**
- The `frac=0.45→0.55` gap (form visible but neither tailoring nor filling) should be eliminated or minimized

**Overall scroll budget:**
- If tailoring is shortened from 45% to ~20% of each slot, that's ~105vh saved per company × 3 = ~315vh that should be removed from the 2000vh total
- New target: ~1700vh (update `scrollHeight` in `App.tsx`)
- This also affects the auto-scroll duration for this scene in `MultiScene.tsx` — update `SCENE_DURATION_MS[3]` proportionally (~7500ms instead of 9000ms)

---

## Files to touch
- `src/scenes/Scene3Machine.tsx` — all the frac/fillFrac/phase constants
- `src/App.tsx` line 133 — `scrollHeight: "2000vh"` → new value after trimming

## Files NOT to touch
- `src/scroll/MultiScene.tsx` has debug logging active right now (no scroll snap). After Scene3Machine is fixed, update `SCENE_DURATION_MS[3]` to match new budget.
- Do not touch any other scene files.

---

## How to verify
Run `npm run dev`. Open browser console (F12). Scroll manually through the Discover scene and watch the logs:
```
[scroll] progress=X | scene=Discover (3) | sceneProgress=Y | band=...
```
At each visual milestone (discovery card complete, tailoring done, autofill complete per company), note the `sceneProgress` value. The autofill for each company should complete (essay fully typed, progress bar at 100%) before `sceneProgress` enters the crossfade zone for that company.

**Target checkpoints (approximate, verify in browser):**
- Discovery card fully visible + stable: before `p=0.10` scene progress
- Stripe autofill complete: before Stripe's crossfade starts
- Anthropic autofill complete: before Anthropic's crossfade starts  
- Figma autofill complete + NeedsYou visible: around `sceneProgress=0.90`

## Dev server
`npm run dev` (not pnpm)
