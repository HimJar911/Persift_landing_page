import { useRef } from "react"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import deskImg from "../assets/desk.png"

const BG    = "#0c0a08"
const IMG_W = 1522
const IMG_H = 688

const SCREEN_L = 538
const SCREEN_T = 37
const SCREEN_W = 501
const SCREEN_H = 331

const OX_PCT = (SCREEN_L + SCREEN_W / 2) / IMG_W
const OY_PCT = (SCREEN_T + SCREEN_H / 2) / IMG_H

const ZOOM_SCALE = IMG_W / SCREEN_W  // ≈ 3.04

// Scene0Hero is position:absolute, overlapping MultiScene from scroll 0.
// MultiScene Install band = 0–200vh of 1250vh total.
// BRIDGE_OUT_E must be ≤ 200/350 = 57% so handoff reveals Install underneath.
//
// 0.00 → 0.32  zoom phase
// 0.28 → 0.40  terminal text fades out
// 0.36 → 0.44  zoom layer fades to black
// 0.40 → 0.50  Meet Persift fades in
// 0.50 → 0.54  pills/button stagger in (compressed — quick reveal)
// 0.54 → 0.56  Meet Persift fades OUT → Install underneath takes over
const ZOOM_START   = 0.00
const ZOOM_END     = 0.32
const ZOOM_FADE_S  = 0.36
const ZOOM_FADE_E  = 0.44
const BRIDGE_S     = 0.40
const BRIDGE_E     = 0.50
const BRIDGE_OUT_S = 0.54
const BRIDGE_OUT_E = 0.56

// pills stagger within 0.50–0.54
const HOLD_S     = BRIDGE_E
const HOLD_E     = BRIDGE_OUT_S
const HOLD_RANGE = HOLD_E - HOLD_S

const PILLS = [
  "Finds roles before they hit LinkedIn",
  "Tailors your resume per company",
  "Tracks every application automatically",
]

export function Scene0Hero() {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })
  const p = useSpring(scrollYProgress, { stiffness: 260, damping: 52, restDelta: 0.0001 })

  const scale        = useTransform(p, [ZOOM_START, ZOOM_END], [1, ZOOM_SCALE])
  const imgOpacity   = useTransform(p, [ZOOM_START, ZOOM_END * 0.65, ZOOM_END], [1, 1, 0])
  const screenRadius = useTransform(p, [ZOOM_START, ZOOM_END * 0.9], [6, 0])

  const heroCopyOpacity  = useTransform(p, [0.28, 0.40], [1, 0])
  const zoomLayerOpacity = useTransform(p, [ZOOM_FADE_S, ZOOM_FADE_E], [1, 0])
  // bridge fades in, holds, then fades out — MultiScene Meet Persift underneath takes over
  const bridgeOpacity    = useTransform(p, (v) => {
    if (v < BRIDGE_S) return 0
    if (v < BRIDGE_E) return (v - BRIDGE_S) / (BRIDGE_E - BRIDGE_S)
    if (v < BRIDGE_OUT_S) return 1
    if (v < BRIDGE_OUT_E) return 1 - (v - BRIDGE_OUT_S) / (BRIDGE_OUT_E - BRIDGE_OUT_S)
    return 0
  })
  // drop below MultiScene once fully transparent so it doesn't block clicks
  const stickyZIndex = useTransform(p, (v) => v >= BRIDGE_OUT_E ? 0 : 1)

  // pills stagger in during the hold phase
  const pill0Opacity = useTransform(p, [HOLD_S, HOLD_S + HOLD_RANGE * 0.18], [0, 1])
  const pill0Y       = useTransform(p, [HOLD_S, HOLD_S + HOLD_RANGE * 0.18], [14, 0])
  const pill1Opacity = useTransform(p, [HOLD_S + HOLD_RANGE * 0.12, HOLD_S + HOLD_RANGE * 0.30], [0, 1])
  const pill1Y       = useTransform(p, [HOLD_S + HOLD_RANGE * 0.12, HOLD_S + HOLD_RANGE * 0.30], [14, 0])
  const pill2Opacity = useTransform(p, [HOLD_S + HOLD_RANGE * 0.24, HOLD_S + HOLD_RANGE * 0.42], [0, 1])
  const pill2Y       = useTransform(p, [HOLD_S + HOLD_RANGE * 0.24, HOLD_S + HOLD_RANGE * 0.42], [14, 0])
  const btnOpacity   = useTransform(p, [HOLD_S + HOLD_RANGE * 0.38, HOLD_S + HOLD_RANGE * 0.56], [0, 1])
  const btnY         = useTransform(p, [HOLD_S + HOLD_RANGE * 0.38, HOLD_S + HOLD_RANGE * 0.56], [14, 0])

  const pillAnims = [
    { opacity: pill0Opacity, y: pill0Y },
    { opacity: pill1Opacity, y: pill1Y },
    { opacity: pill2Opacity, y: pill2Y },
  ]

  return (
    <div ref={ref} style={{ position: "relative", height: "350vh" }}>
      <motion.div style={{
        position: "sticky",
        top: 0,
        height: "100vh",
        overflow: "hidden",
        zIndex: stickyZIndex,
        background: BG,
      }}>

        {/* ── zoom layer ── */}
        <motion.div style={{ position: "absolute", inset: 0, opacity: zoomLayerOpacity }}>
          <motion.div style={{
            position: "absolute",
            top: "50%", left: "50%",
            x: "-50%", y: "-50%",
            width:  `max(100%, calc(100vh * ${IMG_W} / ${IMG_H}))`,
            height: `max(100%, calc(100vw * ${IMG_H} / ${IMG_W}))`,
            scale,
            transformOrigin: `${(OX_PCT * 100).toFixed(3)}% ${(OY_PCT * 100).toFixed(3)}%`,
          }}>
            <motion.img
              src={deskImg}
              alt=""
              draggable={false}
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                display: "block", userSelect: "none",
                opacity: imgOpacity,
              }}
            />
            <motion.div style={{
              position: "absolute",
              left:   `${(SCREEN_L / IMG_W * 100).toFixed(3)}%`,
              top:    `${(SCREEN_T / IMG_H * 100).toFixed(3)}%`,
              width:  `${(SCREEN_W / IMG_W * 100).toFixed(3)}%`,
              height: `${(SCREEN_H / IMG_H * 100).toFixed(3)}%`,
              borderRadius: screenRadius,
              background: "#060a08",
              overflow: "hidden",
            }}>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 60%, rgba(80,200,100,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.13) 2px, rgba(0,0,0,0.13) 4px)", pointerEvents: "none", zIndex: 2 }} />
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)", pointerEvents: "none", zIndex: 3 }} />
              <motion.div style={{
                opacity: heroCopyOpacity,
                position: "absolute", inset: 0, zIndex: 4,
                display: "flex", flexDirection: "column",
                alignItems: "flex-start", justifyContent: "center",
                padding: "12% 14%",
                pointerEvents: "none",
              }}>
                <p style={{ margin: 0, fontFamily: "'Roboto Mono', monospace", fontSize: "0.72vw", fontWeight: 400, color: "rgba(160,220,170,0.55)", letterSpacing: "0.02em", lineHeight: 1.8, whiteSpace: "nowrap" }}>
                  $ status --job-search
                </p>
                <p style={{ margin: 0, fontFamily: "'Roboto Mono', monospace", fontSize: "0.72vw", fontWeight: 400, color: "rgba(160,220,170,0.38)", letterSpacing: "0.02em", lineHeight: 1.8, marginBottom: "1.1vw", whiteSpace: "nowrap" }}>
                  &gt; 247 applications. 0 replies. Tired yet?
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3vw" }}>
                  <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "1.35vw", fontWeight: 500, color: "#f0a341", letterSpacing: "0.01em", whiteSpace: "nowrap", textShadow: "0 0 12px rgba(240,163,65,0.6), 0 0 30px rgba(240,163,65,0.25)" }}>
                    Enter:
                  </span>
                  <span style={{ display: "inline-block", width: "0.14vw", height: "1.4vw", minWidth: "1px", minHeight: "8px", background: "#f0a341", boxShadow: "0 0 6px rgba(240,163,65,0.9)", borderRadius: 1, animation: "blink 1.1s step-start infinite" }} />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "27%", background: `linear-gradient(to right, ${BG}, transparent)` }} />
            <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "27%", background: `linear-gradient(to left, ${BG}, transparent)` }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 300, background: `linear-gradient(to top, ${BG}, transparent)` }} />
          </div>
        </motion.div>

        {/* ── Meet Persift layer — fades in as zoom fades out ── */}
        <motion.div style={{
          position: "absolute", inset: 0,
          opacity: bridgeOpacity,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "0 24px",
          gap: 28,
          pointerEvents: "none",
        }}>
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            width: 800, height: 500,
            background: "radial-gradient(ellipse, rgba(240,163,65,0.1) 0%, transparent 65%)",
            pointerEvents: "none",
          }} />

          <h2 style={{
            margin: 0,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(38px, 6vw, 72px)",
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: "var(--ink)",
            textAlign: "center",
            maxWidth: 640,
            position: "relative",
          }}>
            Meet Persift.
          </h2>

          <p style={{
            margin: 0,
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            fontSize: "clamp(15px, 1.6vw, 20px)",
            color: "var(--ink-soft)",
            lineHeight: 1.55,
            textAlign: "center",
            maxWidth: 560,
            position: "relative",
          }}>
            Finds early-career roles, tailors your resume to each one,
            and submits applications — all on its own.
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", position: "relative" }}>
            {pillAnims.map((anim, i) => (
              <motion.span
                key={PILLS[i]}
                style={{
                  opacity: anim.opacity,
                  y: anim.y,
                  fontSize: 12.5,
                  fontWeight: 500,
                  color: "var(--amber-soft)",
                  background: "rgba(240,163,65,0.08)",
                  border: "1px solid rgba(240,163,65,0.22)",
                  borderRadius: 999,
                  padding: "6px 15px",
                  whiteSpace: "nowrap",
                  display: "inline-block",
                }}
              >
                {PILLS[i]}
              </motion.span>
            ))}
          </div>

          <motion.button
            style={{
              opacity: btnOpacity,
              y: btnY,
              border: "none",
              cursor: "pointer",
              borderRadius: 10,
              padding: "12px 28px",
              fontSize: 14,
              fontWeight: 600,
              color: "#1a1206",
              background: "linear-gradient(180deg, var(--amber-soft), var(--amber))",
              boxShadow: "0 4px 18px rgba(240,163,65,0.35)",
              pointerEvents: "auto",
              position: "relative",
            }}
            onClick={() => document.getElementById("section-cta")?.scrollIntoView({ behavior: "smooth" })}
          >
            Join waitlist
          </motion.button>
        </motion.div>

      </motion.div>
    </div>
  )
}
