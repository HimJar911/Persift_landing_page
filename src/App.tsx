import { motion, useMotionValue, useTransform, type MotionValue } from "framer-motion"
import { MultiScene } from "./scroll/MultiScene"
import { MobileLayout } from "./scroll/MobileLayout"
import { registerJumpToStep, jumpToCtaScene } from "./scroll/nav"
import { useIsMobile } from "./hooks/useIsMobile"
import { Wordmark } from "./components/Brand"
import { SceneHero } from "./scenes/SceneHero"
import { Scene2Install } from "./scenes/Scene2Install"
import { Scene2Setup } from "./scenes/Scene2Setup"
import { Scene3Machine } from "./scenes/Scene3Machine"
import { Scene4Overnight } from "./scenes/Scene4Overnight"
import { Scene5Morning } from "./scenes/Scene5Morning"
import { Scene6Analytics } from "./scenes/Scene6Analytics"
import { Scene7Ask } from "./scenes/Scene7Ask"

const HEADER_H = 48

export default function App() {
  const isMobile = useIsMobile(900)

  // progress is wired directly from MultiScene's wheel interceptor via onProgressReady
  const progress = useMotionValue(0)

  const barScale = useTransform(progress, [0, 1], [0, 1])
  const scrollHintOpacity = useTransform(progress, [0, 0.03, 0.06, 0.91, 0.94], [1, 0, 1, 1, 0])

  function handleProgressReady(mv: MotionValue<number>) {
    mv.on("change", (v) => progress.set(v))
  }

  return (
    <main style={{ background: "var(--bg)" }}>
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
        background: isMobile ? "linear-gradient(to bottom, var(--bg) 60%, transparent)" : "transparent",
      }}>
        <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
          <Wordmark height={30} />
        </a>
        <button
          onClick={jumpToCtaScene}
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

      {/* scroll hint — desktop only */}
      <motion.div
        onClick={() => window.dispatchEvent(new WheelEvent("wheel", { deltaY: 800, bubbles: true, cancelable: true }))}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "fixed",
          bottom: 28,
          left: "50%",
          x: "-50%",
          opacity: isMobile ? 0 : scrollHintOpacity,
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          pointerEvents: isMobile ? "none" : "auto",
          cursor: "pointer",
        }}
      >
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
            <div
              key={i}
              style={{
                width: 14,
                height: 14,
                borderRight: "2px solid rgba(243,236,225,0.7)",
                borderBottom: "2px solid rgba(243,236,225,0.7)",
                transform: "rotate(45deg)",
                marginTop: i === 0 ? 0 : -7,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* ── Mobile: flat stacked sections ── */}
      {isMobile && <MobileLayout />}

      {/* ── Desktop: scroll-driven sticky timeline ── */}
      {!isMobile && (
        <MultiScene
          topOffset={HEADER_H}
          onReady={registerJumpToStep}
          onProgressReady={handleProgressReady}
          steps={[
            { label: "", description: "", scrollHeight: "65vh", fullBleed: true,  noSlide: true, children: <SceneHero /> },
            { label: "Install",   description: "One click from the Chrome Web Store.",    scrollHeight: "120vh", noSlide: true, children: <Scene2Install /> },
            { label: "Set up",    description: "Tell it what you're looking for. Once.",  scrollHeight: "86vh", jumpOffset: 0.13, children: <Scene2Setup /> },
            { label: "Discover",  description: "Finds roles before they hit LinkedIn.",   scrollHeight: "940vh", children: <Scene3Machine /> },
            { label: "Autopilot", description: "Applies overnight while you're asleep.",  scrollHeight: "150vh", earlyEnter: 0.04, children: <Scene4Overnight /> },
            { label: "Morning",   description: "Wake up to interviews.",                  scrollHeight: "100vh", children: <Scene5Morning /> },
            { label: "Analytics", description: "See what's working.",                     scrollHeight: "100vh", children: <Scene6Analytics /> },
            { label: "Launch",    description: "Stop applying. Start interviewing.",      scrollHeight: "150vh", children: <div id="section-cta" style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><Scene7Ask /></div> },
          ]}
        />
      )}
    </main>
  )
}
