import { motion, useTransform } from "framer-motion"
import { useSceneProgress } from "../scroll/SceneContext"
import deskImg from "../assets/desk.png"

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

// within scene progress 0→1 (over 300vh):
// 0.00 → 0.60  zoom in
// 0.40 → 0.70  desk image fades out (screen takes over)
// 0.60 → 0.80  terminal text fades out
// 0.80 → 1.00  entire layer fades out (crossfade to Meet Persift)
const ZOOM_END    = 0.60
const IMG_FADE_E  = 0.70
const COPY_FADE_E = 0.80

export function SceneHero() {
  const p = useSceneProgress()

  const scale        = useTransform(p, [0, ZOOM_END], [1, ZOOM_SCALE])
  const imgOpacity   = useTransform(p, [0, ZOOM_END * 0.65, IMG_FADE_E], [1, 1, 0])
  const screenRadius = useTransform(p, [0, ZOOM_END * 0.9], [6, 0])
  const copyOpacity  = useTransform(p, [ZOOM_END - 0.05, COPY_FADE_E], [1, 0])
  // fade the entire laptop screen (including green glow) out with the copy
  const screenOpacity = useTransform(p, [ZOOM_END - 0.05, COPY_FADE_E], [1, 0])

  return (
    <div style={{ position: "absolute", inset: 0, background: BG, overflow: "hidden" }}>
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
        }}>
          {/* solid fill that fades in as zoom progresses, covering any texture artifacts */}
          <motion.div style={{ position: "absolute", inset: 0, background: "#060a08", zIndex: 1, opacity: useTransform(p, [0.25, 0.50], [0, 1]) }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 60%, rgba(80,200,100,0.07) 0%, transparent 70%)", pointerEvents: "none", zIndex: 1 }} />
          <motion.div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.13) 2px, rgba(0,0,0,0.13) 4px)", pointerEvents: "none", zIndex: 2, opacity: useTransform(p, [0.20, 0.40], [1, 0]) }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)", pointerEvents: "none", zIndex: 3 }} />
          <motion.div style={{
            opacity: copyOpacity,
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
                $ persift --start
              </span>
            </div>
          </motion.div>
        </motion.div>
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
