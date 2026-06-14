import { motion, useTransform } from "framer-motion"
import { useSceneProgress } from "../scroll/SceneContext"

const PILLS = [
  "Finds roles before they hit LinkedIn",
  "Tailors your resume per company",
  "Tracks every application automatically",
]

export function SceneMeetPersift() {
  const p = useSceneProgress()

  // headline visible immediately (carried in by SceneSlot fade)
  // pills stagger in, then button — all within first 45% of scene
  const pill0O = useTransform(p, [0.08, 0.16], [0, 1])
  const pill0Y = useTransform(p, [0.08, 0.16], [14, 0])
  const pill1O = useTransform(p, [0.16, 0.24], [0, 1])
  const pill1Y = useTransform(p, [0.16, 0.24], [14, 0])
  const pill2O = useTransform(p, [0.24, 0.32], [0, 1])
  const pill2Y = useTransform(p, [0.24, 0.32], [14, 0])
  const btnO   = useTransform(p, [0.34, 0.44], [0, 1])
  const btnY   = useTransform(p, [0.34, 0.44], [14, 0])

  const pillAnims = [
    { o: pill0O, y: pill0Y },
    { o: pill1O, y: pill1Y },
    { o: pill2O, y: pill2Y },
  ]

  return (
    <div style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 24px",
      gap: 28,
    }}>
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
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
        and submits applications, all on its own.
      </p>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", position: "relative" }}>
        {pillAnims.map((anim, i) => (
          <motion.span
            key={PILLS[i]}
            style={{
              opacity: anim.o,
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
          opacity: btnO,
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
          position: "relative",
          pointerEvents: "auto",
        }}
        onClick={() => {
          document.getElementById("section-cta")?.scrollIntoView({ behavior: "smooth" })
        }}
      >
        Join waitlist
      </motion.button>
    </div>
  )
}
