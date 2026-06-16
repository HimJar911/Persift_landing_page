import { motion, useTransform } from "framer-motion"
import { useSceneProgress } from "../scroll/SceneContext"
import { DashboardShell } from "../components/DashboardShell"
import { BrowserWindow } from "../components/BrowserWindow"
import { useFitScale } from "../hooks/useFitScale"
import { useIsMobile } from "../hooks/useIsMobile"

function StatCard({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        padding: "8px 12px",
        borderRadius: 12,
        background: "rgba(255,255,255,0.02)",
        border: "1px solid var(--line)",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 24,
          fontWeight: 600,
          lineHeight: 1,
          color: accent ? "var(--amber)" : "var(--ink)",
        }}
      >
        {value}
      </span>
      <span style={{ fontSize: 11.5, color: "var(--ink-mute)", letterSpacing: "0.01em" }}>{label}</span>
    </div>
  )
}

function NeedsYouSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <span style={{
          fontSize: 10.5,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--ink-mute)",
        }}>
          Needs you
        </span>
        <span style={{
          fontSize: 10,
          fontWeight: 700,
          color: "var(--amber)",
          background: "rgba(240,163,65,0.12)",
          border: "1px solid rgba(240,163,65,0.25)",
          borderRadius: 999,
          padding: "1px 7px",
        }}>1</span>
      </div>
      <div style={{
        borderRadius: 12,
        border: "1px solid rgba(240,163,65,0.2)",
        background: "rgba(240,163,65,0.04)",
        padding: "12px 14px",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: "rgba(240,163,65,0.1)",
          border: "1px solid rgba(240,163,65,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontSize: 16,
        }}>
          📋
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>
            Stripe · Software Engineer Intern
          </div>
          <div style={{ fontSize: 11.5, color: "var(--ink-mute)", marginTop: 2 }}>
            Online assessment received · complete to stay in consideration
          </div>
        </div>
        <span style={{
          fontSize: 11.5,
          fontWeight: 600,
          color: "var(--amber)",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}>
          Opens in app →
        </span>
      </div>
    </div>
  )
}


export function Scene5Morning() {
  const p = useSceneProgress()
  const headY = useTransform(p, [0, 0.25], [16, 0])
  const headOpacity = useTransform(p, [0, 0.25], [0, 1])
  const { containerRef, contentRef, scale } = useFitScale(24)
  const isMobile = useIsMobile(900)

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <motion.div
        ref={contentRef}
        style={{
          opacity: headOpacity,
          y: headY,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          transformOrigin: "center",
          scale,
        }}
      >
        {!isMobile && <h3 style={{
          margin: 0,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 800,
          fontSize: "clamp(26px, 3.5vw, 42px)",
          letterSpacing: "-0.025em",
          color: "var(--ink)",
          textAlign: "center",
        }}>
          Check your phone.
        </h3>}
        <BrowserWindow url="app.persift.app/dashboard" width="90vw" maxWidth={1040}>
          <DashboardShell activeTab="overview" tone="dawn" embedded>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontFamily: "var(--font-serif)",
                  fontWeight: 500,
                  fontSize: 26,
                  letterSpacing: "-0.02em",
                  color: "var(--ink)",
                }}
              >
                Good morning.
              </h3>
              <p style={{ margin: "4px 0 0", fontSize: 13.5, color: "var(--ink-soft)" }}>
                <strong style={{ color: "var(--amber-soft)", fontWeight: 600 }}>8 applications</strong>{" "}
                sent overnight. 3 responses waiting.
              </p>
            </div>

            {/* stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 10 }}>
              <StatCard value="8" label="Submitted" />
              <StatCard value="3" label="Responses" />
              <StatCard value="1" label="Needs you" accent />
              <StatCard value="12" label="In queue" />
            </div>

            {/* google calendar interview alert */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 13,
                padding: "8px 13px",
                borderRadius: 13,
                background: "linear-gradient(90deg, rgba(240,163,65,0.14), rgba(240,163,65,0.04))",
                border: "1px solid rgba(240,163,65,0.32)",
              }}
            >
              <span
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  background: "linear-gradient(135deg, var(--amber), var(--amber-deep))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: "#1a1206",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="4.5" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M3 9h18" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M8 3v3M16 3v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)" }}>
                  Interview scheduled
                </span>
                <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>
                  Stripe · Software Engineer Intern
                </span>
                <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>
                  Tomorrow · 2:00 PM · Google Meet
                </span>
                <span style={{ fontSize: 11.5, color: "var(--amber-soft)" }}>
                  Added to your Google Calendar
                </span>
              </div>
            </div>

            <NeedsYouSection />
          </div>
        </DashboardShell>
        </BrowserWindow>
      </motion.div>

    </div>
  )
}
