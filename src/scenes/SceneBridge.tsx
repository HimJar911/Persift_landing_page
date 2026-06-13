import { motion, useTransform } from "framer-motion"
import { useSceneProgress } from "../scroll/SceneContext"

const PILLS = [
  "Finds roles before they hit LinkedIn",
  "Tailors your resume per company",
  "Tracks every application automatically",
]

export function SceneBridge() {
  const p = useSceneProgress()

  const glowOpacity = useTransform(p, [0, 0.3, 0.7], [0.6, 0.8, 0.6])

  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "0 24px",
      gap: 28,
      position: "relative",
    }}>
      {/* ambient glow */}
      <motion.div style={{
        position: "absolute",
        top: "50%", left: "50%", x: "-50%", y: "-50%",
        width: 800, height: 500,
        background: "radial-gradient(ellipse, rgba(240,163,65,0.1) 0%, transparent 65%)",
        pointerEvents: "none",
        opacity: glowOpacity,
      }} />

      {/* headline */}
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

      {/* subline */}
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

      {/* feature pills */}
      <div style={{
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        justifyContent: "center",
        position: "relative",
      }}>
        {PILLS.map((item) => (
          <span key={item} style={{
            fontSize: 12.5,
            fontWeight: 500,
            color: "var(--amber-soft)",
            background: "rgba(240,163,65,0.08)",
            border: "1px solid rgba(240,163,65,0.22)",
            borderRadius: 999,
            padding: "6px 15px",
            whiteSpace: "nowrap",
          }}>
            {item}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div style={{ position: "relative" }}>
        <button
          onClick={() => document.getElementById("section-cta")?.scrollIntoView({ behavior: "smooth" })}
          style={{
            border: "none",
            cursor: "pointer",
            borderRadius: 10,
            padding: "12px 28px",
            fontSize: 14,
            fontWeight: 600,
            color: "#1a1206",
            background: "linear-gradient(180deg, var(--amber-soft), var(--amber))",
            boxShadow: "0 4px 18px rgba(240,163,65,0.35)",
          }}
        >
          Join waitlist
        </button>
      </div>
    </div>
  )
}
