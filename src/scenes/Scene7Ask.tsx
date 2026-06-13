import { useState } from "react"
import { Wordmark } from "../components/Brand"

type Status = "idle" | "loading" | "success" | "error" | "already"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LS_KEY = "persift_waitlist_email"

export function Scene7Ask() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<Status>(() =>
    localStorage.getItem(LS_KEY) ? "already" : "idle"
  )
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!EMAIL_RE.test(email.trim())) {
      setErrorMsg("Please enter a valid email address.")
      setStatus("error")
      return
    }
    setStatus("loading")
    setErrorMsg("")
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })
      if (!res.ok) throw new Error(`${res.status}`)
      localStorage.setItem(LS_KEY, email.trim())
      setStatus("success")
    } catch {
      setErrorMsg("Something went wrong. Please try again.")
      setStatus("error")
    }
  }

  return (
    <div style={{
      position: "relative",
      width: "100%",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 30,
      padding: "0 24px",
      pointerEvents: "auto",
    }}>
      <div style={{
        position: "absolute",
        top: "44%", left: "50%",
        width: 760, height: 760,
        transform: "translate(-50%,-50%)",
        background: "radial-gradient(circle, rgba(240,163,65,0.10) 0%, transparent 60%)",
        pointerEvents: "none",
      }} />

      <Wordmark height={32} />

      <h2 style={{
        position: "relative",
        margin: 0,
        textAlign: "center",
        fontFamily: "var(--font-serif)",
        fontWeight: 500,
        fontSize: "clamp(34px, 6vw, 60px)",
        lineHeight: 1.05,
        letterSpacing: "-0.02em",
        color: "var(--ink)",
      }}>
        Stop applying.
        <br />
        <span style={{ color: "var(--amber)" }}>Start waking up to interviews.</span>
      </h2>

      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        width: "100%",
        maxWidth: 420,
      }}>
        {(status === "success" || status === "already") ? (
          <div style={{
            padding: "14px 22px",
            borderRadius: 12,
            border: "1px solid rgba(240,163,65,0.4)",
            background: "rgba(240,163,65,0.08)",
            color: "var(--amber-soft)",
            fontSize: 14.5,
            fontWeight: 500,
            textAlign: "center",
            lineHeight: 1.5,
          }}>
            {status === "success"
              ? "You're on the list. We'll reach out when Persift is ready."
              : "You're already on the list. We'll reach out when Persift is ready."}
          </div>
        ) : (
          <>
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                gap: 8,
                width: "100%",
                background: "var(--surface)",
                border: `1px solid ${status === "error" ? "rgba(240,100,80,0.5)" : "var(--line)"}`,
                borderRadius: 13,
                padding: 6,
              }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle") }}
                placeholder="you@university.edu"
                aria-label="Email address"
                disabled={status === "loading"}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: "var(--ink)",
                  fontSize: 15,
                  padding: "10px 12px",
                  opacity: status === "loading" ? 0.5 : 1,
                }}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                style={{
                  border: "none",
                  cursor: status === "loading" ? "default" : "pointer",
                  borderRadius: 9,
                  padding: "10px 20px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#1a1206",
                  background: "linear-gradient(180deg, var(--amber-soft), var(--amber))",
                  whiteSpace: "nowrap",
                  opacity: status === "loading" ? 0.6 : 1,
                }}
              >
                {status === "loading" ? "Joining…" : "Join waitlist"}
              </button>
            </form>
            {status === "error" && (
              <span style={{ fontSize: 12.5, color: "rgba(240,100,80,0.9)" }}>{errorMsg}</span>
            )}
          </>
        )}
        <span style={{ fontSize: 12.5, color: "var(--ink-mute)" }}>Private beta · August 2026</span>
        <span style={{ fontSize: 11.5, color: "var(--ink-faint)", textAlign: "center" }}>
          We'll only reach out when Persift launches. No spam.
        </span>
      </div>

      <div style={{ position: "absolute", bottom: 26, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontSize: 10.5, color: "var(--ink-faint)", letterSpacing: "0.04em" }}>
          Built by Himanshu Jarodiya · CS @ ASU
        </span>
      </div>
    </div>
  )
}
