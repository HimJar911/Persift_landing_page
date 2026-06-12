OI # Persift Landing Page — Improvement Plan

Status key: ⬜ pending · 🔄 in progress · ✅ done

---

## 1. Hero Copy ✅
**Problem:** "Job hunting is exhausting. We do the exhausting part." is evocative but doesn't explain what Persift is. Someone cold has no idea what the product does after reading it.

**Fix applied:**
- Headline: "You qualify for hundreds of roles. / Apply to all of them."
- Subline: "Finds early-career roles before they hit LinkedIn. Tailors your resume. Submits the application."
- Removed "internships" framing — now says "early-career roles" to cover new grads too
- "Stop applying. Start waking up to interviews." stays at Scene 8 as the closing punch

---

## 2. Scroll Smoothness 🔄
**Problem:** Spring lag (stiffness 80, damping 26) creates dead zones at slow scroll speeds. Overall scroll feel not smooth enough.

**Partial fix applied:**
- Removed `useSpring`. Progress now mirrors `scrollYProgress` via `useMotionValue` + `onChange` subscription (avoids Framer Motion v12 WAAPI scroll-linked path which caused keyframe offset errors).
- Transition style changed from crossfade to D (slide up 50px + scale 0.95→1 in, fade out). Kept for now.

**Still pending:** Overall scroll smoothness — revisit after all other fixes are done and full page can be assessed end-to-end.

**Files:** `src/App.tsx`, `src/scroll/Scene.tsx`

---

## 3. Chaos Scene — Not Clear Enough ⬜ (pending user research)
**Problem:** Cards (Gmail, LinkedIn, Sheets, Workday, Greenhouse) don't make someone FEEL the problem. Pure visual collage isn't enough for a cold viewer.

**Options considered:**
- A: Rejection stream (Gmail inbox of nothing but rejections + counter "47 sent, 3 replied, 0 interviews")
- B: Form loop (same fields typed over and over, cycling through companies)
- Numbers/stats — ruled out, too abstract
- Spreadsheet — ruled out, tracking isn't the core pain

**Decision:** Too biased to decide internally. Need cold user feedback from real students who have no context on Persift. Send them the page, watch where they pause or disengage.

**File:** `src/scenes/Scene1Chaos.tsx`

---

## 4. Chrome Web Store Title & Tags ✅
**Fix applied:**
- Title changed to "Job applications on autopilot." — Roboto 400 22px #202124, matching real Chrome Web Store styling
- Pills kept as original for now (Productivity, Works on LinkedIn...) — revisit separately

**File:** `src/scenes/Scene2Install.tsx`

---

## 5. "Install Once…" Copy Line ✅
**Fix applied:** Removed the CopyLine entirely. Button flip + toast notification tells the story visually without needing floating text.

**File:** `src/scenes/Scene2Install.tsx`

---

## 6. Setup Scene — Uneven Cards + Empty Space ✅
**Problem:** Profile card and extension popup are different heights, looks off. Too much empty space on all 4 sides of the scene.

**Proposed fix:** Give both cards the same explicit height, align tops. Scale up content to fill more of the viewport.

**File:** `src/scenes/Scene2Setup.tsx`

---

## 7. Empty Space Across All Scenes ⬜
**Problem:** Systemic — almost every scene has too much padding/margin, content feels small and lost in the viewport.

**Proposed fix:** Address scene by scene — increase content element scale, reduce stage padding. Ongoing cleanup as we go through each scene.

**Files:** All scene files + `src/App.tsx`

---

## 8. Machine Scene — "New Role Found" Timing ✅
**Fix applied:** discoveryOpacity now fades in at p=[0.18,0.28] instead of starting at 1 from p=0. Internal animations (fit bar, match %, LinkedIn note) shifted to match. Work split-screen delayed to [0.38,0.46]. Discovery card is now invisible during the Setup→Machine crossfade.

**File:** `src/scenes/Scene3Machine.tsx`

---

## 9. Machine Scene — Duplicate Anthropic Slides ✅
**Fix applied:** Tailoring phase threshold reduced from 30% to 15% of each company's slot. Tailoring is now a brief flash before filling starts, so it doesn't feel like two separate Anthropic slides.

**File:** `src/scenes/Scene3Machine.tsx`

---

## 10. Replace Linear's Dark ATS ✅
**Fix applied:** Replaced Linear (dark custom ATS) with Figma (Greenhouse, green/light theme). Updated name, role ("Design Engineer Intern"), match (87%), essay, tailor bullets, NeedsYouBody label, and ATS type.

**File:** `src/scenes/Scene3Machine.tsx`

---

## 11. Morning Dashboard — Too Close to Top ⬜
**Problem:** Dashboard sits too high in the scene, not enough breathing room from the top of the viewport.

**Proposed fix:** Add vertical offset to push the browser window mock down.

**File:** `src/scenes/Scene5Morning.tsx`

---

## 12. Analytics Scene — URL Bar Cut Off ⬜
**Problem:** The browser window is too high — top chrome (URL bar, Overview/Analytics tabs) is clipped.

**Proposed fix:** Adjust vertical positioning so the full browser window chrome is visible.

**File:** `src/scenes/Scene6Analytics.tsx`

---

## 13. Remove "Silence Past 3 Weeks" Text ⬜
**Problem:** Footer line "Silence past 3 weeks inferred as rejection · updated hourly" reveals internal inference logic we don't want to show users.

**Proposed fix:** Delete the line.

**File:** `src/scenes/Scene6Analytics.tsx`

---

## 14. Fixed Topbar — Scenes Phase Below It ⬜
**Problem:** The Persift logo + Join Waitlist topbar is embedded in the scene layer, so it crossfades with every scene transition. Should be a persistent fixed element the scenes slide beneath.

**Proposed fix:** Pull topbar out of the scene system entirely. Give it `position: fixed; top: 0; z-index: 100`. Offset the sticky scene stage by topbar height so no scene content overlaps the bar.

**Files:** `src/App.tsx` + wherever the topbar is currently rendered

---

## Bonus — Other Observations ⬜
- **Overnight scene** is the most emotionally powerful but goes by fast — consider giving it more scroll weight.
- **Morning scene** "Needs you" card (amber) competes with the positive framing of waking up to results — consider softening or reordering the stat cards.
- **Waitlist form** collects email only — consider adding a name field for personal beta outreach.
- **Footer credit** "Built by Himanshu Jarodiya · CS @ ASU" — once positioning as a startup, consider replacing with "Persift Inc." or removing.
