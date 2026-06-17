import { motion, useTransform } from "framer-motion"
import { useSceneProgress } from "../scroll/SceneContext"
import { LogoTicker } from "../components/LogoTicker"
import deskImg from "../assets/desk.webp"

const BG     = "#0c0a08"
const IMG_W  = 1522
const IMG_H  = 688
const SCREEN_L = 538
const SCREEN_T = 37
const SCREEN_W = 501
const SCREEN_H = 331

const OX_PCT    = (SCREEN_L + SCREEN_W / 2) / IMG_W
const OY_PCT    = (SCREEN_T + SCREEN_H / 2) / IMG_H
const ZOOM_SCALE = IMG_W / SCREEN_W  // ≈ 3.04

// within scene progress 0→1 (over 100vh):
// 0.00 → 0.70  zoom in
// 0.45 → 0.82  desk image fades out (screen takes over)
// 0.85 → 0.99  terminal text / screen fade out — held to scene end to avoid black gap
const ZOOM_END    = 0.70
const IMG_FADE_E  = 0.82
const COPY_FADE_E = 0.99

export function SceneHero() {
  const p = useSceneProgress()

  const scale        = useTransform(p, [0, ZOOM_END], [1, ZOOM_SCALE])
  const imgOpacity   = useTransform(p, [0, ZOOM_END * 0.65, IMG_FADE_E], [1, 1, 0])
  const screenRadius = useTransform(p, [0, ZOOM_END * 0.9], [6, 0])
  const copyOpacity  = useTransform(p, [0.85, COPY_FADE_E], [1, 0])
  const screenOpacity = useTransform(p, [0.85, COPY_FADE_E], [1, 0])
  // ticker fades in early, stays visible through scene exit
  const tickerOpacity = useTransform(p, [0, 0.08], [0, 1])

  return (
    <div style={{ position: "absolute", inset: 0, background: BG, overflow: "hidden" }}>
      <h1 style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>
        Persift: automated job applications for early-career roles
      </h1>
      {/* fills the transparent screen cutout in the desk image at all zoom levels */}
      <div style={{ position: "absolute", inset: 0, background: "#060a08" }} />
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
          opacity: screenOpacity,
          background: "#060a08",
          overflow: "hidden",
          containerType: "inline-size",
        }}>
          {/* solid fill that fades in as zoom progresses, covering any texture artifacts */}
          <motion.div style={{ position: "absolute", inset: 0, background: "#060a08", zIndex: 1, opacity: useTransform(p, [0.40, 0.65], [0, 1]) }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 60%, rgba(80,200,100,0.07) 0%, transparent 70%)", pointerEvents: "none", zIndex: 1 }} />
          <motion.div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.13) 2px, rgba(0,0,0,0.13) 4px)", pointerEvents: "none", zIndex: 2, opacity: useTransform(p, [0.35, 0.65], [1, 0]) }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)", pointerEvents: "none", zIndex: 3 }} />
          <motion.div style={{
            opacity: copyOpacity,
            position: "absolute", inset: 0, zIndex: 4,
            display: "flex", flexDirection: "column",
            alignItems: "flex-start", justifyContent: "space-between",
            padding: "10% 12% 8%",
            pointerEvents: "none",
          }}>
            {/* product content — Gmail notification + stats */}
            <div style={{ display: "flex", flexDirection: "column", gap: "3cqw", width: "100%" }}>

              {/* Gmail notification card */}
              <div style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "1.2cqw",
                padding: "3cqw 3.5cqw",
                display: "flex", flexDirection: "column", gap: "1.2cqw",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1.5cqw" }}>
                  <div style={{
                    width: "3.5cqw", height: "3.5cqw", borderRadius: "50%",
                    background: "linear-gradient(135deg, #EA4335, #c5392e)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.8cqw", fontWeight: 700, color: "#fff", fontFamily: "Inter, sans-serif",
                    flexShrink: 0,
                  }}>G</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.2cqw" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "1.8cqw", fontWeight: 600, color: "rgba(243,236,225,0.9)" }}>Gmail</span>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "1.5cqw", color: "rgba(243,236,225,0.4)" }}>just now</span>
                  </div>
                </div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "1.9cqw", fontWeight: 600, color: "rgba(243,236,225,0.95)", lineHeight: 1.3 }}>
                  Interview Request · Stripe
                </div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "1.65cqw", color: "rgba(243,236,225,0.5)", lineHeight: 1.4 }}>
                  "We'd love to schedule a technical interview for the Software Engineer Intern role..."
                </div>
              </div>

              {/* stats row */}
              <div style={{ display: "flex", gap: "2cqw" }}>
                {[
                  { value: "8", label: "Applied" },
                  { value: "3", label: "Responded" },
                  { value: "1", label: "Interview" },
                ].map(({ value, label }) => (
                  <div key={label} style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "1cqw",
                    padding: "2cqw",
                    display: "flex", flexDirection: "column", gap: "0.5cqw",
                  }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "3.5cqw", fontWeight: 700, color: label === "Interview" ? "#f0a341" : "rgba(243,236,225,0.9)" }}>{value}</span>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "1.5cqw", color: "rgba(243,236,225,0.4)" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* website voice — clearly separate register */}
            <div style={{ width: "100%", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "2.5cqw", display: "flex", justifyContent: "center" }}>
              <span style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontStyle: "italic",
                fontSize: "2.1cqw",
                color: "rgba(240,163,65,0.7)",
                letterSpacing: "0.01em",
              }}>
                Scroll to see how ↓
              </span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ticker — bottom of hero, fades in at start, out before zoom */}
      <motion.div style={{
        opacity: tickerOpacity,
        position: "absolute",
        bottom: 48,
        left: "50%",
        x: "-50%",
        width: "min(680px, 88vw)",
        pointerEvents: "none",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}>
        <p style={{
          margin: 0,
          fontFamily: "Inter, sans-serif",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(243,236,225,0.35)",
        }}>
          Roles discovered at
        </p>
        <LogoTicker />
      </motion.div>

      {/* side/bottom gradients */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "27%", background: `linear-gradient(to right, ${BG}, transparent)` }} />
        <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "27%", background: `linear-gradient(to left, ${BG}, transparent)` }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 300, background: `linear-gradient(to top, ${BG}, transparent)` }} />
      </div>
    </div>
  )
}
