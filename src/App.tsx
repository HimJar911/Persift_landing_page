import { useRef, useEffect } from "react"
import { motion, useScroll, useMotionValue, useTransform } from "framer-motion"
import { MultiScene } from "./scroll/MultiScene"
import { Wordmark } from "./components/Brand"
import { SceneHero } from "./scenes/SceneHero"
import { SceneMeetPersift } from "./scenes/SceneMeetPersift"
import { Scene2Install } from "./scenes/Scene2Install"
import { Scene2Setup } from "./scenes/Scene2Setup"
import { Scene3Machine } from "./scenes/Scene3Machine"
import { Scene4Overnight } from "./scenes/Scene4Overnight"
import { Scene5Morning } from "./scenes/Scene5Morning"
import { Scene6Analytics } from "./scenes/Scene6Analytics"
import { Scene7Ask } from "./scenes/Scene7Ask"

const HEADER_H = 48
const TOTAL_VH = 300 + 150 + 200 + 350 + 400 + 300 + 100 + 100 + 150
const LAUNCH_START_VH = TOTAL_VH - 150


function scrollToCta() {
  window.scrollTo({ top: (LAUNCH_START_VH / 100) * window.innerHeight, behavior: "smooth" })
}

export default function App() {
  const pageRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll()
  const progress = useMotionValue(0)
  useEffect(() => scrollYProgress.on("change", (v) => progress.set(v)), [scrollYProgress])

  const barScale = useTransform(progress, [0, 1], [0, 1])
  const scrollHintOpacity = useTransform(progress, [0, 0.03, 0.06, 0.92, 1], [1, 0, 1, 1, 0])

  return (
    <main ref={pageRef} style={{ background: "var(--bg)" }}>
      {/* scroll progress bar */}
      <motion.div style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        height: 2,
        transformOrigin: "0% 50%",
        scaleX: barScale,
        background: "linear-gradient(90deg, var(--amber-deep), var(--amber-soft))",
        zIndex: 120,
      }} />

      {/* header */}
      <header style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        height: HEADER_H,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        zIndex: 110,
        background: "transparent",
      }}>
        <Wordmark height={30} />
        <button
          onClick={scrollToCta}
          style={{
            border: "none",
            cursor: "pointer",
            borderRadius: 9,
            padding: "8px 18px",
            fontSize: 13,
            fontWeight: 600,
            color: "#1a1206",
            background: "linear-gradient(180deg, var(--amber-soft), var(--amber))",
            whiteSpace: "nowrap",
          }}
        >
          Join waitlist
        </button>
      </header>

      {/* scroll hint */}
      <motion.div style={{
        position: "fixed",
        bottom: 28,
        left: "50%",
        x: "-50%",
        opacity: scrollHintOpacity,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        pointerEvents: "none",
      }}>
        {/* "scroll" word */}
        <span style={{
          fontSize: 10,
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(243,236,225,0.35)",
        }}>
          scroll
        </span>

        {/* chevrons */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              style={{
                width: 14,
                height: 14,
                borderRight: "2px solid rgba(243,236,225,0.7)",
                borderBottom: "2px solid rgba(243,236,225,0.7)",
                transform: "rotate(45deg)",
                marginTop: i === 0 ? 0 : -7,
              }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
            />
          ))}
        </div>
      </motion.div>

      {/* ── One master scroll timeline ── */}
      <MultiScene
        topOffset={HEADER_H}
        steps={[
          { label: "", description: "", scrollHeight: "300vh", fullBleed: true,  noSlide: true, children: <SceneHero /> },
          { label: "", description: "", scrollHeight: "150vh", fullBleed: true,  noSlide: true, children: <SceneMeetPersift /> },
          { label: "Install",   description: "One click from the Chrome Web Store.",    scrollHeight: "200vh", children: <Scene2Install /> },
          { label: "Set up",    description: "Tell it what you're looking for. Once.",  scrollHeight: "350vh", children: <Scene2Setup /> },
          { label: "Discover",  description: "Finds roles before they hit LinkedIn.",   scrollHeight: "400vh", children: <Scene3Machine /> },
          { label: "Autopilot", description: "Applies overnight while you're asleep.",  scrollHeight: "300vh", children: <Scene4Overnight /> },
          { label: "Morning",   description: "Wake up to interviews.",                  scrollHeight: "100vh", children: <Scene5Morning /> },
          { label: "Analytics", description: "See what's working.",                     scrollHeight: "100vh", children: <Scene6Analytics /> },
          { label: "Launch",    description: "Stop applying. Start interviewing.",      scrollHeight: "150vh", children: <div id="section-cta" style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><Scene7Ask /></div> },
        ]}
      />
    </main>
  )
}
