import { useRef, useEffect, type ReactNode } from "react"
import { motion, useMotionValue, useTransform, type MotionValue } from "framer-motion"
import { SceneProgressContext } from "./SceneContext"
import { useIsMobile } from "../hooks/useIsMobile"

type Step = {
  label: string
  description: string
  scrollHeight: string
  children: ReactNode
  fullBleed?: boolean   // bypasses nav column, fills entire sticky viewport
  noSlide?: boolean     // opacity-only transition, no y movement
  earlyEnter?: number   // start fading in this many global-progress units before band start
  jumpOffset?: number   // fraction of the band to land at when jumping (0–1)
}

type MultiSceneProps = {
  steps: Step[]
  topOffset?: number
  onReady?: (jumpToStep: (i: number) => void) => void
  onScrollByReady?: (scrollBy: (amount: number) => void) => void
  onProgressReady?: (progress: MotionValue<number>) => void
}

function parseVh(s: string): number {
  const m = s.match(/^(\d+(?:\.\d+)?)vh$/)
  return m ? parseFloat(m[1]) : 100
}

const FADE = 0.007

// How much each normalized deltaY unit moves progress. Tune this to feel.
const SENSITIVITY = 0.0001

function SlicedScene({
  children,
  progress,
  bandStart,
  bandEnd,
}: {
  children: ReactNode
  progress: MotionValue<number>
  bandStart: number
  bandEnd: number
}) {
  const sliced = useTransform(progress, (v) =>
    Math.max(0, Math.min(1, (v - bandStart) / (bandEnd - bandStart)))
  )
  return (
    <SceneProgressContext.Provider value={sliced}>
      {children}
    </SceneProgressContext.Provider>
  )
}

function SceneSlot({
  children,
  progress,
  bandStart,
  bandEnd,
  isFirst = false,
  isLast,
  fullBleed = false,
  noSlide = false,
  earlyEnter = 0,
}: {
  children: ReactNode
  progress: MotionValue<number>
  bandStart: number
  bandEnd: number
  isFirst?: boolean
  isLast: boolean
  fullBleed?: boolean
  noSlide?: boolean
  earlyEnter?: number  // how much before bandStart to begin fading in (global progress units)
}) {
  const enterStart = bandStart - earlyEnter
  const enterEnd   = bandStart + FADE
  const exitStart  = isLast ? bandEnd : bandEnd - FADE
  const exitEnd    = bandEnd

  const opacity = useTransform(progress, (v) => {
    if (v <= enterStart) return isFirst ? 1 : 0
    if (v <= enterEnd)   return isFirst ? 1 : (v - enterStart) / (enterEnd - enterStart)
    if (v <= exitStart)  return 1
    if (v <= exitEnd)    return isLast ? 1 : 1 - (v - exitStart) / (exitEnd - exitStart)
    return isLast ? 1 : 0
  })

  const y = useTransform(progress, (v) => {
    if (noSlide) return 0
    if (v <= enterStart) return 70
    if (v <= enterEnd)   return 70 * (1 - (v - enterStart) / (enterEnd - enterStart))
    if (v <= exitStart)  return 0
    if (v <= exitEnd)    return isLast ? 0 : -70 * ((v - exitStart) / (exitEnd - exitStart))
    return isLast ? 0 : -70
  })

  const pointerEvents = useTransform(progress, (v) =>
    v >= enterEnd && v <= exitStart ? "auto" : "none"
  )

  if (fullBleed) {
    return (
      <motion.div
        style={{
          opacity,
          y,
          pointerEvents,
          position: "absolute",
          inset: 0,
        }}
      >
        <SlicedScene progress={progress} bandStart={bandStart} bandEnd={bandEnd}>
          {children}
        </SlicedScene>
      </motion.div>
    )
  }

  return (
    <motion.div
      style={{
        opacity,
        y,
        pointerEvents,
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SlicedScene progress={progress} bandStart={bandStart} bandEnd={bandEnd}>
        {children}
      </SlicedScene>
    </motion.div>
  )
}

function StepLabel({
  label,
  description,
  index,
  activeIndex,
  onJump,
  isCtaStep,
}: {
  label: string
  description: string
  index: number
  activeIndex: MotionValue<number>
  onJump: () => void
  isCtaStep?: boolean
}) {
  const dist = useTransform(activeIndex, (v) => Math.abs(v - index))

  const blockOpacity = useTransform(dist, (d) => {
    if (d < 0.5) return 1
    if (d < 1.2) return 0.38
    return 0.18
  })

  const accentOpacity = useTransform(dist, (d) => (d < 0.5 ? 1 : 0))
  const accentScaleY  = useTransform(dist, (d) => (d < 0.5 ? 1 : 0.25))
  const labelColor    = useTransform(dist, (d) => (d < 0.5 ? (isCtaStep ? "var(--amber)" : "var(--ink)") : "var(--ink-mute)"))
  const descOpacity   = useTransform(dist, (d) => (d < 0.5 ? 0.65 : 0.3))

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={onJump}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onJump() }}
      style={{
        opacity: blockOpacity,
        position: "relative",
        paddingLeft: 16,
        paddingTop: 8,
        paddingBottom: 8,
        cursor: "pointer",
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          left: 0,
          top: "50%",
          y: "-50%",
          width: 2.5,
          height: isCtaStep ? 36 : 30,
          borderRadius: 2,
          background: "var(--amber)",
          opacity: accentOpacity,
          scaleY: accentScaleY,
          transformOrigin: "center",
          boxShadow: isCtaStep ? "0 0 8px var(--amber)" : "none",
        }}
        transition={{ type: "spring", stiffness: 500, damping: 38 }}
      />
      <motion.div
        style={{
          fontSize: isCtaStep ? 14 : 15,
          fontWeight: 700,
          color: labelColor,
          fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
          letterSpacing: isCtaStep ? "0.06em" : "-0.02em",
          lineHeight: 1.15,
          userSelect: "none",
          textTransform: isCtaStep ? "uppercase" : "none",
        }}
      >
        {label}
      </motion.div>
      <motion.div
        style={{
          opacity: descOpacity,
          fontSize: 11.5,
          color: "var(--ink-soft)",
          fontFamily: "Inter, sans-serif",
          fontWeight: 400,
          lineHeight: 1.4,
          marginTop: 3,
          userSelect: "none",
        }}
      >
        {description}
      </motion.div>
    </motion.div>
  )
}

export function MultiScene({ steps, topOffset = 0, onReady, onScrollByReady, onProgressReady }: MultiSceneProps) {
  const vhs     = steps.map((s) => parseVh(s.scrollHeight))
  const totalVh = vhs.reduce((a, b) => a + b, 0)

  const bands = (() => {
    let cursor = 0
    return vhs.map((vh) => {
      const start = cursor / totalVh
      const end   = (cursor + vh) / totalVh
      cursor += vh
      return { start, end }
    })
  })()

  // The single source of truth for all scene rendering — replaces scrollYProgress
  const progress = useMotionValue(0)
  const targetRef = useRef(0)
  const currentRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  const bandsRef = useRef(bands)
  bandsRef.current = bands

  // RAF lerp loop: runs continuously while mounted, chases targetRef
  useEffect(() => {
    function tick() {
      const target = targetRef.current
      const diff = target - currentRef.current
      if (Math.abs(diff) < 0.0005) {
        if (currentRef.current !== target) {
          currentRef.current = target
          progress.set(target)
        }
      } else {
        currentRef.current += diff * 0.09
        progress.set(currentRef.current)
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current) }
  }, [])

  // Wheel interceptor: normalize deltaY, accumulate into targetRef
  useEffect(() => {
    function onWheel(e: WheelEvent) {
      e.preventDefault()

      // Normalize: trackpad sends many small events (~3-5px), mouse wheel sends large ones (~100-120px).
      // Cap at 100 so a single mouse tick doesn't jump too far.
      const raw = e.deltaY
      const normalized = Math.sign(raw) * Math.min(Math.abs(raw), 100)

      targetRef.current = Math.max(0, Math.min(1, targetRef.current + normalized * SENSITIVITY))
    }

    // Must be non-passive to call preventDefault() and suppress native scroll
    window.addEventListener("wheel", onWheel, { passive: false })
    return () => window.removeEventListener("wheel", onWheel)
  }, [])

  // Expose progress to parent (for the top progress bar in App.tsx)
  useEffect(() => { onProgressReady?.(progress) }, [])

  const activeIndex = useTransform(progress, (v) => {
    const b = bandsRef.current
    const n = b.length
    for (let i = n - 1; i >= 0; i--) {
      if (v >= b[i].start + FADE / 2) return i
    }
    return 0
  })

  const isNarrow = useIsMobile(1100)

  const firstLabeled = steps.findIndex(s => s.label !== "")
  const navBandStart = firstLabeled >= 0 ? bands[firstLabeled].start : 0
  const navOpacity   = useTransform(progress, (v) => {
    if (v < navBandStart) return 0
    if (v < navBandStart + FADE) return (v - navBandStart) / FADE
    return 1
  })
  const navX = useTransform(progress, (v) => {
    if (v < navBandStart) return -200
    if (v < navBandStart + FADE) return -200 + 200 * (v - navBandStart) / FADE
    return 0
  })

  function jumpToStep(i: number, bandOffset = 0) {
    const band = bandsRef.current[i]
    const bandSize = band.end - band.start
    const target = bandOffset > 0
      ? band.start + bandOffset * bandSize
      : band.start + FADE * 2
    targetRef.current = target
    currentRef.current = target
    progress.set(target)
  }

  function scrollBy(amount: number) {
    targetRef.current = Math.max(0, Math.min(1, targetRef.current + amount))
  }

  useEffect(() => { onReady?.(jumpToStep) }, [])
  useEffect(() => { onScrollByReady?.(scrollBy) }, [])

  const lastLabeledIndex = steps.reduce((acc, s, i) => s.label ? i : acc, -1)

  return (
    <div style={{ position: "relative", height: `${totalVh}vh`, background: "var(--bg)" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
          background: "var(--bg)",
        }}
      >
        {/* Nav + content column */}
        <div style={{ position: "absolute", inset: 0, display: "flex", pointerEvents: "none" }}>
          {!isNarrow && (
            <motion.div
              style={{
                flexShrink: 0,
                width: 200,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingLeft: 44,
                gap: 2,
                opacity: navOpacity,
                x: navX,
                marginLeft: navX,
                pointerEvents: "auto",
              }}
            >
              {steps.map((step, i) => step.label ? (
                <div key={step.label}>
                  {i === lastLabeledIndex && (
                    <div style={{ height: 1, background: "rgba(240,163,65,0.18)", marginLeft: 16, marginBottom: 4, marginTop: 4 }} />
                  )}
                  <StepLabel
                    label={step.label}
                    description={step.description}
                    index={i}
                    activeIndex={activeIndex}
                    onJump={() => jumpToStep(i, step.jumpOffset)}
                    isCtaStep={i === lastLabeledIndex}
                  />
                </div>
              ) : null)}
            </motion.div>
          )}

          <div style={{ flex: 1, position: "relative", minWidth: 0, overflow: "hidden", pointerEvents: "auto" }}>
            {steps.map((step, i) => !step.fullBleed ? (
              <SceneSlot
                key={step.label || `scene-${i}`}
                progress={progress}
                bandStart={bands[i].start}
                bandEnd={bands[i].end}
                isLast={i === steps.length - 1}
                noSlide={step.noSlide}
                earlyEnter={step.earlyEnter ?? 0}
              >
                {step.children}
              </SceneSlot>
            ) : null)}
          </div>
        </div>

        {/* Full-bleed layers — rendered on top so their buttons are clickable */}
        {steps.map((step, i) => step.fullBleed ? (
          <SceneSlot
            key={`fb-${i}`}
            progress={progress}
            bandStart={bands[i].start}
            bandEnd={bands[i].end}
            isFirst={i === 0}
            isLast={false}
            fullBleed
            noSlide={step.noSlide}
          >
            {step.children}
          </SceneSlot>
        ) : null)}
      </div>
    </div>
  )
}
