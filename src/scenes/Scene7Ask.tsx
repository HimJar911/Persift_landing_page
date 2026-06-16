import { useState } from "react"
import { Wordmark } from "../components/Brand"
import { useIsMobile } from "../hooks/useIsMobile"

function LegalFooter() {
  return (
    <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
      <a href="/privacy" style={{ fontSize: 12, color: "var(--ink-faint)", textDecoration: "none", fontFamily: "Inter, sans-serif" }}>Privacy</a>
      <a href="/terms" style={{ fontSize: 12, color: "var(--ink-faint)", textDecoration: "none", fontFamily: "Inter, sans-serif" }}>Terms</a>
    </div>
  )
}

type Status = "idle" | "loading" | "success" | "error"

const EMAIL_RE = /^[^\s@]+@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/
const LAUNCHLIST_URL = "https://getlaunchlist.com/s/vvpphU"
const LS_KEY = "persift_waitlist_email"

function getSavedEmail() {
  try { return localStorage.getItem(LS_KEY) ?? "" } catch { return "" }
}

function getRefCode() {
  try {
    return new URLSearchParams(window.location.search).get("ref") ?? undefined
  } catch { return undefined }
}

export function Scene7Ask() {
  const isMobile = useIsMobile(640)
  const savedEmail = getSavedEmail()
  const [email, setEmail] = useState(() => savedEmail)
  const [honeypot, setHoneypot] = useState("")
  const [submittedEmail, setSubmittedEmail] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [showAlreadyBanner, setShowAlreadyBanner] = useState(() => !!savedEmail)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (honeypot) return
    if (!EMAIL_RE.test(email.trim())) {
      setErrorMsg("Please enter a valid email address.")
      setStatus("error")
      return
    }
    setStatus("loading")
    setErrorMsg("")
    try {
      const ref = getRefCode()
      fetch(LAUNCHLIST_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email: email.trim() }).toString(),
      }).catch(() => {})
      const apiRes = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), ref, website: honeypot }),
      })
      if (apiRes.status === 400) {
        const body = await apiRes.json().catch(() => ({}))
        setErrorMsg(body?.error ?? "Please enter a valid email address.")
        setStatus("error")
        return
      }
      if (!apiRes.ok) throw new Error(`${apiRes.status}`)
      try { localStorage.setItem(LS_KEY, email.trim()) } catch { /* private mode */ }
      setSubmittedEmail(email.trim())
      setShowAlreadyBanner(false)
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
      height: "100%",
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
        {status === "success" ? (
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
            You're in. Confirmation sent to <strong>{submittedEmail}</strong> — if you don't see it, check your promotions tab and move it to Primary.
          </div>
        ) : (
          <>
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? 10 : 8,
                width: "100%",
                ...(isMobile ? {} : {
                  background: "var(--surface)",
                  border: `1px solid ${status === "error" ? "rgba(240,100,80,0.5)" : "var(--line)"}`,
                  borderRadius: 13,
                  padding: 8,
                }),
              }}
            >
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                aria-hidden="true"
                autoComplete="off"
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (status === "error") setStatus("idle")
                  if (showAlreadyBanner) setShowAlreadyBanner(false)
                }}
                placeholder="you@university.edu"
                aria-label="Email address"
                aria-invalid={status === "error"}
                aria-describedby={status === "error" ? "waitlist-error" : undefined}
                disabled={status === "loading"}
                style={{
                  flex: 1,
                  outline: "none",
                  color: "var(--ink)",
                  fontSize: 15,
                  opacity: status === "loading" ? 0.5 : 1,
                  ...(isMobile ? {
                    border: `1px solid ${status === "error" ? "rgba(240,100,80,0.5)" : "var(--line)"}`,
                    borderRadius: 13,
                    background: "var(--surface)",
                    padding: "14px 16px",
                    width: "100%",
                    boxSizing: "border-box" as const,
                  } : {
                    border: "none",
                    background: "transparent",
                    padding: "12px 12px",
                  }),
                }}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                style={{
                  border: "none",
                  cursor: status === "loading" ? "default" : "pointer",
                  borderRadius: 9,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#1a1206",
                  background: "linear-gradient(180deg, var(--amber-soft), var(--amber))",
                  whiteSpace: "nowrap",
                  opacity: status === "loading" ? 0.6 : 1,
                  ...(isMobile ? {
                    padding: "14px 28px",
                    alignSelf: "center",
                  } : {
                    padding: "12px 20px",
                  }),
                }}
              >
                {status === "loading" ? "Joining…" : "Join waitlist"}
              </button>
            </form>
            {status === "error" && (
              <span
                id="waitlist-error"
                role="alert"
                style={{ fontSize: 12.5, color: "rgba(240,100,80,0.9)" }}
              >
                {errorMsg}
              </span>
            )}
            {showAlreadyBanner && (
              <div style={{
                padding: "10px 16px",
                borderRadius: 10,
                border: "1px solid rgba(240,163,65,0.3)",
                background: "rgba(240,163,65,0.06)",
                color: "var(--amber-soft)",
                fontSize: 13,
                fontWeight: 500,
                textAlign: "center",
                lineHeight: 1.5,
                width: "100%",
                boxSizing: "border-box",
              }}>
                You're already on the list at <strong>{savedEmail}</strong>.
              </div>
            )}
          </>
        )}
        <span style={{ fontSize: 12.5, color: "var(--ink-mute)" }}>Private beta · August 2026</span>
        <span style={{ fontSize: 11.5, color: "var(--ink-faint)", textAlign: "center" }}>
          We'll only reach out when Persift launches. No spam.
        </span>
        <LegalFooter />
      </div>

    </div>
  )
}
