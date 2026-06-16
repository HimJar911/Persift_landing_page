# Scroll Architecture — Current State, Problems, and Plan

---

## How the current architecture works

The entire page is a single tall `div` (~3170vh) with a `position: sticky` viewport inside it. As the user scrolls, Framer Motion's `useScroll` tracks `scrollYProgress` (0→1) across the full height.

`MultiScene.tsx` slices that 0→1 into per-scene bands based on each scene's `scrollHeight`:

```
Hero      240vh  → band 0.0000–0.0757
Install   200vh  → band 0.0757–0.1388
Setup     200vh  → band 0.1388–0.2019
Discover  2000vh → band 0.2019–0.8328
Autopilot 180vh  → band 0.8328–0.8896
Morning   100vh  → band 0.8896–0.9211
Analytics 100vh  → band 0.9211–0.9527
Launch    150vh  → band 0.9527–1.0000
Total     3170vh
```

Each scene gets its own `useSceneProgress()` which maps its band to 0→1. Scenes animate internally using that local 0→1. The crossfade between scenes is `FADE = 0.007` (~22vh) — tiny, nearly instantaneous.

---

## The core problem: scroll budget ≠ animation budget

Each scene's scroll budget is an arbitrary vh number. The animations inside each scene don't fill that budget — they complete early and the scene just sits there fully rendered, doing nothing, while the user keeps scrolling. This idle time is "dead scroll."

**Measured dead scroll per scene (from debug logs):**

| Scene | Budget | Animation ends at sceneProgress | Dead tail |
|---|---|---|---|
| Hero | 240vh | 0.616 (148vh) | ~92vh dead |
| Install | 200vh | 0.730 (146vh) | ~54vh dead |
| Setup | 200vh | 0.814 (163vh) | ~37vh dead |
| Discover | 2000vh | unknown — internal timing broken | large |
| Autopilot | 180vh | 0.875 (158vh) | ~23vh dead |
| Morning | 100vh | 0.748 (75vh) | ~25vh dead |
| Analytics | 100vh | 0.758 (76vh) | ~24vh dead |
| Launch | 150vh | 0.212 (32vh) | ~118vh dead |

**Total estimated dead scroll: ~370vh+ just from these scenes, before counting Discover.**

Beyond per-scene dead time, there is also dead time *at boundaries*: after scene A's animation ends, the user scrolls through the idle tail, then through the 22vh crossfade, then through scene B's entry before its first animation beat starts. The user sees nothing meaningful happening across all three zones.

---

## What we tried and what it broke

### Attempt 1: Snap to nearest scene boundary (debounce 150ms)
**What it did:** after user stopped scrolling for 150ms, snapped to nearest band start or end via `window.scrollTo`.

**Problem:** snapping to *end* of large scenes (Discover = 63% of total) jumped thousands of pixels. Snapping to *start* only felt wrong — slight forward scroll snapped you back. Felt like the page was fighting the user.

**Why it failed:** scene boundaries are not "animation complete" points. Snapping to `band.end` puts you at the fade-out zone, not at a clean resting state.

### Attempt 2: Momentum-advance scroll (one scroll = advance to next scene's animation-complete point)
**What it did:** on first scroll event, launched an eased RAF animation to carry progress forward to the next scene's content-complete point. Used `easeInOut` over a per-scene duration.

**Problem 1 — chained through everything:** `window.scrollTo` inside the RAF loop fired the `scroll` event listener, which re-entered `onScroll` and immediately chained to the next scene before the current animation finished. Fixed with `suppressScroll` flag but still had issues.

**Problem 2 — wrong stop points:** used `band.end - 0.03` as stop point. But `0.03` is a fixed absolute offset. For Install (band width = 0.063), subtracting 0.03 puts the stop point at Install's *midpoint*, not near its end. Scene detection then thinks we're already past Install and chains to Discover.

**Problem 3 — can't scroll up:** the `isAnimating` lock prevented upward scroll from cancelling the animation properly (was eventually fixed but contributed to bad UX during testing).

**Why it partially failed:** stop points require knowing when each scene's animation actually completes. We don't have that data for all scenes yet. Using a fixed offset doesn't work across scenes of wildly different sizes.

### What we have right now
Debug logging only — no scroll snap, no momentum advance. The scroll log prints scene name, global progress, and sceneProgress on every scroll event. This lets us manually identify animation-complete points per scene. Currently committed in `MultiScene.tsx`.

---

## The Discover scene internal problem (separate from scroll)

Inside Discover (`Scene3Machine.tsx`), each company gets `BAND = 0.21` of scene progress (420vh). Within each company slot (`frac` 0→1):

- `frac 0.00–0.45` = tailoring spinner (189vh of spinner with no new information)
- `frac 0.45–0.55` = dead gap (form visible, nothing happening)
- `frac 0.55–1.00` = autofill (but crossfade starts at `frac=0.96`, essay starts at `fillFrac=0.62`)

Result: essay is still typing when the scene starts fading to next company. And the tailoring spinner runs for 189vh which is enormous. A brief for fixing this is in `.claude/DISCOVER_SCENE_BRIEF.md`.

---

## The Install scene problem (caused by budget tightening)

`Scene2Install` has these animation ranges in local sceneProgress:
- Window settle-in: `[0, 0.3]` (scale 0.95→1, y 22→0)
- Button flip "Add" → "Added": `[0.22, 0.38]`
- Toast badge: `[0.36, 0.46]`

When the debug logs showed Install's animation completing at `sceneProgress=0.730`, someone (previous agent) tightened Install's budget to remove dead tail. But the settle-in animation (`[0, 0.3]`) now overlaps with the button flip (`[0.22, 0.30]`) — both happen simultaneously because the compressed budget makes everything pile up. The window is still sliding in while the button is already flipping.

**Root cause:** transition animations (settle-in) and content animations (button flip, badge) share the same sceneProgress range. Tightening the budget compresses both equally, causing overlap.

---

## The proposed fix: wheel interceptor replacing DOM scroll

Instead of using browser DOM scroll (`useScroll` → `scrollYProgress`), intercept `wheel` events directly and drive a custom progress value:

```
wheel event fires → deltaY added to targetProgress (clamped 0→1)
every rAF → currentProgress lerps toward targetProgress (factor ~0.08)
currentProgress → all useTransform calls (replaces scrollYProgress)
```

The lerp (`currentProgress += (targetProgress - currentProgress) * 0.08`) creates smooth follow: every wheel tick immediately moves `targetProgress`, and the rendered `currentProgress` chases it smoothly. This is exactly how the atmos.leeroy.ca airplane site works.

**What this improves:**

1. **Every wheel tick produces visible change** — `targetProgress` moves immediately on any input, so nothing feels frozen
2. **Smooth continuous motion** — the lerp means there's no snapping, no momentum fighting, just smooth follow
3. **Dead scroll still exists but feels different** — even in dead zones, the smooth follow motion makes it feel like the page is responding, not frozen. The lerp easing masks idle time.
4. **No scroll-snap complexity** — because the lerp naturally decelerates to a stop, you don't need snap logic at all. The page always lands smoothly wherever the user stopped.
5. **Full control over scroll speed** — the sensitivity (how much progress per wheel tick) is one constant. Can tune it globally.

**What it breaks / requires fixing:**

1. **No scrollbar** — body isn't actually scrolling. Users lose the native scrollbar. The existing side nav serves as a progress indicator but it's not the same. Could add a custom scrollbar element.

2. **`jumpToStep()` must be rewritten** — currently calls `window.scrollTo`. With wheel interceptor, must instead set `targetProgress` directly to `bands[i].start`.

3. **Trackpad vs mouse normalization** — trackpad sends many small `deltaY` events (~3-5px each), mouse wheel sends few large ones (~100-120px each). Need to normalize. Common fix: cap `deltaY` at ~100 and scale it, or use a logarithmic curve.

4. **Mobile** — `wheel` events don't fire on touch devices. But `MobileLayout` is already a completely separate component that bypasses `MultiScene` entirely for `≤900px` viewports. No change needed there.

5. **Browser scroll restoration** — refreshing mid-page resets to top (no browser scroll memory). Acceptable for a landing page.

6. **The dead scroll zones still exist** — the lerp makes them feel better but doesn't eliminate them. The real fix for dead scroll is still trimming scene budgets to match animation durations. The wheel interceptor and budget trimming are complementary, not alternatives.

7. **Scene animations still use sceneProgress 0→1** — the wheel interceptor feeds a `MotionValue` into the same band-slicing logic. All scene files (`Scene2Install.tsx`, `Scene3Machine.tsx`, etc.) are untouched. The interface is identical.

---

## Recommended execution order

### Step 1 — Fix Discover internal timing (separate agent, brief already written)
Get Discover's animations tight: shorten tailoring, eliminate dead gap, ensure essay completes before crossfade. Get the stop-point sceneProgress value for Discover from the debug logs.

### Step 2 — Trim all scene budgets
Using the stop-point data we already have (plus Discover after step 1), reduce each scene's `scrollHeight` to match its actual animation duration. Target: animation runs right to the edge of the band, no idle tail. This eliminates dead scroll within scenes.

Expected new budgets (approximate):
```
Hero      ~150vh  (animation ends at 0.616 of 240vh = 148vh, round up slightly)
Install   ~160vh  (animation ends at 0.730 of 200vh = 146vh)
Setup     ~170vh  (animation ends at 0.814 of 200vh = 163vh)
Discover  TBD after step 1
Autopilot ~160vh  (animation ends at 0.875 of 180vh = 158vh)
Morning   ~80vh   (animation ends at 0.748 of 100vh = 75vh)
Analytics ~80vh   (animation ends at 0.758 of 100vh = 76vh)
Launch    ~50vh   (animation ends at 0.212 of 150vh — but Launch is CTA, may want more hold time)
```

### Step 3 — Fix Install scene animation overlap
After budget is correct, fix the settle-in / button-flip overlap in `Scene2Install.tsx`. With the correct budget, decide: compress settle-in to `[0, 0.15]`, or remove it entirely and just have the window appear.

### Step 4 — Implement wheel interceptor
Replace `useScroll` in `MultiScene.tsx` with a wheel-event accumulator + RAF lerp. Rewrite `jumpToStep()` to set targetProgress directly. Add deltaY normalization. Test on both trackpad and mouse wheel.

### Step 5 — Remove debug logging
Once scroll feel is validated, remove the `console.log` from `MultiScene.tsx`.

---

## Files involved

| File | What changes |
|---|---|
| `src/scroll/MultiScene.tsx` | Step 4 (wheel interceptor), Step 5 (remove logs) |
| `src/App.tsx` | Step 2 (scrollHeight values) |
| `src/scenes/Scene2Install.tsx` | Step 3 (settle-in timing) |
| `src/scenes/Scene3Machine.tsx` | Step 1 (Discover internal timing) |
| All other scene files | No changes — sceneProgress interface is identical |
| `src/scroll/MobileLayout.tsx` | No changes — mobile bypasses MultiScene entirely |

---

## What the end state looks like

- User scrolls → immediate visual response, every tick does something
- Animations fill their entire scene budget, right to the edge
- Scene transitions are instantaneous (22vh crossfade) but feel clean because there's no idle tail before them
- Wheel interceptor lerp creates smooth physical feel without needing snap logic
- Total page height ~1000-1200vh (down from 3170vh) — much faster to get through
- Mobile completely unaffected
