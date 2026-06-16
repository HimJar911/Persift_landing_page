import { jumpToCtaScene } from "../scroll/nav"
import { LogoTicker } from "../components/LogoTicker"

export function MobileHero() {
  return (
    <section style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "96px 24px 64px",
      gap: 28,
      textAlign: "center",
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
        <h1 style={{
          margin: 0,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 800,
          fontSize: "clamp(36px, 11vw, 56px)",
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          color: "var(--ink)",
        }}>
          You qualify for<br />hundreds of roles.<br />
          <span style={{ color: "var(--amber)" }}>Apply to all of them.</span>
        </h1>

        <p style={{
          margin: 0,
          fontFamily: "Inter, sans-serif",
          fontSize: "clamp(15px, 4vw, 18px)",
          fontWeight: 400,
          color: "var(--ink-soft)",
          lineHeight: 1.6,
          maxWidth: 340,
        }}>
          Finds early-career roles, tailors your resume to each one, and submits applications — automatically.
        </p>
      </div>

      <button
        onClick={jumpToCtaScene}
        style={{
          border: "none",
          cursor: "pointer",
          borderRadius: 10,
          padding: "15px 36px",
          fontSize: 15,
          fontWeight: 600,
          color: "#1a1206",
          background: "linear-gradient(180deg, var(--amber-soft), var(--amber))",
          boxShadow: "0 4px 20px rgba(240,163,65,0.35)",
        }}
      >
        Join waitlist
      </button>

      <div style={{ width: "100%", maxWidth: 480, display: "flex", flexDirection: "column", gap: 12 }}>
        <p style={{
          margin: 0,
          fontFamily: "Inter, sans-serif",
          fontSize: 11.5,
          fontWeight: 500,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--ink-mute)",
        }}>
          Roles discovered at
        </p>
        <LogoTicker />
      </div>
    </section>
  )
}
