import { type ReactNode } from "react"

/* ---------- browser-window shell (shared across scenes) ---------- */

export function SurfaceFrame({
  url,
  accent,
  children,
  width,
}: {
  url: string
  accent: string
  children: ReactNode
  width: number | string
}) {
  return (
    <div
      style={{
        width,
        maxWidth: "90vw",
        borderRadius: 12,
        overflow: "hidden",
        background: "#fbfaf8",
        border: "1px solid rgba(0,0,0,0.12)",
        boxShadow: "0 24px 50px -20px rgba(0,0,0,0.7)",
        color: "#1c1a17",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* browser chrome */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 11px",
          background: "#ece9e4",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <span style={{ display: "flex", gap: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#e06c5b" }} />
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#e3b14a" }} />
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#7bb86f" }} />
        </span>
        <span
          style={{
            flex: 1,
            background: "#fbfaf8",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 6,
            padding: "3px 9px",
            fontSize: 10,
            color: "#6a655e",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: accent, flexShrink: 0 }} />
          {url}
        </span>
      </div>
      <div style={{ padding: 10 }}>{children}</div>
    </div>
  )
}

