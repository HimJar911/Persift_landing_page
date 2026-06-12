import { useState } from "react"
import { Wordmark } from "../components/Brand"

type Status = "idle" | "loading" | "success" | "error"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LAUNCHLIST_URL = "https://getlaunchlist.com/s/vvpphU"

export function Scene7Ask() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [referralUrl, setReferralUrl] = useState("")

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
      const body = new URLSearchParams({ email: email.trim() })
      const res = await fetch(LAUNCHLIST_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      })
      if (!res.ok) throw new Error(`${res.status}`)
      // capture referral URL from final redirected response for optional future use
      setReferralUrl(res.url)
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
          }}>
            You&apos;re on the list — check your email to confirm.
            {referralUrl && <span data-referral={referralUrl} />}
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
      </div>

      <div style={{ position: "absolute", bottom: 26, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ fontSize: 10.5, color: "var(--ink-faint)", letterSpacing: "0.04em" }}>
          Built by Himanshu Jarodiya · CS @ ASU
        </span>
      </div>
    </div>
  )
}
