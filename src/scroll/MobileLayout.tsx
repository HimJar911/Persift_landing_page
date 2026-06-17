import { useEffect, useRef, useState, useCallback } from "react"
import { motion, useMotionValue } from "framer-motion"
import { SceneProgressContext } from "./SceneContext"
import { MobileHero } from "../scenes/MobileHero"
import { LogoTicker } from "../components/LogoTicker"
import { PersiftMark } from "../components/Brand"
import { jumpToCtaScene } from "./nav"
import { ExtensionPopup } from "../components/ExtensionPopup"
import { Scene5Morning } from "../scenes/Scene5Morning"
import { Scene6Analytics } from "../scenes/Scene6Analytics"

// ─── static fill (fully completed state) for each scene ──────────────────────


function MobileInstall() {
  return (
    <section style={sectionStyle}>
      <div style={innerStyle}>
        <h2 style={h2Style}>One click to install.</h2>
        <div style={{
          width: "100%",
          borderRadius: 16,
          background: "#ffffff",
          border: "1px solid rgba(0,0,0,0.14)",
          boxShadow: "0 20px 60px -20px rgba(0,0,0,0.8)",
          overflow: "hidden",
          color: "#1f2a23",
          fontFamily: "Inter, sans-serif",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#e9ece7", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
            <span style={{ display: "flex", gap: 5 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#e06c5b" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#e3b14a" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#7bb86f" }} />
            </span>
            <span style={{ flex: 1, background: "#fff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 6, padding: "4px 10px", fontSize: 10.5, color: "#6a655e", textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              chromewebstore.google.com/detail/persift
            </span>
          </div>
          <div style={{ padding: "20px 20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <span style={{ width: 52, height: 52, borderRadius: 13, background: "linear-gradient(135deg, #211a13, #100c09)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <PersiftMark size={40} />
              </span>
              <div style={{ flex: 1, minWidth: 160 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#202124", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.02em" }}>Job applications on autopilot.</div>
                <div style={{ fontSize: 12, color: "#6a7a70", marginTop: 3 }}>persift.com · Early access</div>
              </div>
            </div>
            <div style={{ borderRadius: 23, background: "#eef5f0", border: "1px solid #cdd9d0", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "#2f7a4f", fontSize: 14, fontWeight: 600, padding: "13px 0" }}>
              <svg width="16" height="16" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2.5 6.2l2.2 2.3L9.5 3.5" stroke="#2f7a4f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Added to Chrome
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 14px", background: "#211a13", color: "#f4efe6", borderRadius: 10 }}>
              <PersiftMark size={14} />
              <span style={{ fontSize: 12, fontWeight: 500 }}>Persift was added to your browser.</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 8, background: "rgba(240,163,65,0.07)", border: "1px solid rgba(240,163,65,0.2)", alignSelf: "flex-start" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f0a341", flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: "#c8873a" }}>Private beta · August 2026</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function MobileSetup() {
  const fields = [
    { label: "NAME", value: "Jordan Reyes" },
    { label: "UNIVERSITY", value: "UC Berkeley" },
    { label: "ROLE TYPES", value: "SWE Intern · Data Intern" },
    { label: "LOCATIONS", value: "Remote · SF · NYC" },
  ]
  return (
    <section style={sectionStyle}>
      <div style={innerStyle}>
        <h2 style={h2Style}>Tell it what you're looking for.</h2>
        <p style={bodyStyle}>Once. Persift handles every application from here.</p>
        <div style={{
          width: "100%",
          borderRadius: 16,
          background: "linear-gradient(160deg, #201810, #14100b)",
          border: "1px solid rgba(240,163,65,0.18)",
          boxShadow: "0 0 0 1px rgba(240,163,65,0.06)",
          fontFamily: "Inter, sans-serif",
          overflow: "hidden",
        }}>
          <div style={{ height: 2, background: "linear-gradient(90deg, transparent, var(--amber), var(--amber-soft), transparent)", opacity: 0.6 }} />
          <div style={{ padding: "13px 16px", borderBottom: "1px solid rgba(240,163,65,0.1)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--amber)", boxShadow: "0 0 6px var(--amber)", flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>Your profile</span>
          </div>
          <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
            {fields.map((f) => (
              <div key={f.label} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <span style={{ fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--amber-deep)", fontWeight: 600 }}>{f.label}</span>
                <div style={{ height: 36, borderRadius: 9, background: "rgba(240,163,65,0.04)", border: "1px solid rgba(240,163,65,0.12)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 11px" }}>
                  <span style={{ fontSize: 12.5, color: "var(--ink)", fontWeight: 500 }}>{f.value}</span>
                  <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6.2l2.2 2.3L9.5 3.5" stroke="var(--green)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 13px", borderRadius: 11, background: "rgba(240,163,65,0.1)", border: "1px solid rgba(240,163,65,0.4)" }}>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--amber-soft)" }}>Auto-apply</div>
                <div style={{ fontSize: 10.5, color: "var(--amber)", marginTop: 1 }}>Persift is running</div>
              </div>
              <div style={{ width: 40, height: 22, borderRadius: 11, background: "var(--amber)", position: "relative", boxShadow: "0 0 8px rgba(240,163,65,0.5)" }}>
                <div style={{ position: "absolute", top: 2, left: 20, width: 18, height: 18, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Discover: timed animation on mobile ──────────────────────────────────────

const PIPELINE_MOBILE = [
  { name: "Stripe",    role: "Software Engineer Intern",  match: 94, ats: "greenhouse" as const },
  { name: "Anthropic", role: "Infrastructure Intern",     match: 91, ats: "ashby" as const },
  { name: "Figma",     role: "Design Engineer Intern",    match: 87, ats: "greenhouse" as const },
]

const FIELDS = [
  { label: "Full name",           value: "Jordan Reyes",                        start: 0.00, end: 0.12 },
  { label: "Email",               value: "jordan.reyes@berkeley.edu",           start: 0.12, end: 0.24 },
  { label: "Work authorization",  value: "U.S. Citizen or Permanent Resident",  start: 0.24, end: 0.38 },
  { label: "Graduation date",     value: "May 2027",                            start: 0.38, end: 0.48 },
  { label: "GPA",                 value: "3.8",                                 start: 0.48, end: 0.55 },
  { label: "Portfolio / GitHub",  value: "github.com/jordanreyes",              start: 0.55, end: 0.68 },
]

const ESSAY = "I got into payments because a refund for my side project took 9 days and I couldn't figure out why. I want to work on the stuff people only notice when it breaks."

const ATS_ACCENT: Record<string, string> = {
  greenhouse: "#3aa76d",
  ashby: "#5b62d6",
}

function MobileDiscover() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [fillFrac, setFillFrac] = useState(0)
  const [companyIdx, setCompanyIdx] = useState(0)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)
  const activeRef = useRef(false)

  const COMPANY_DURATION = 4000

  const runAnimation = useCallback(() => {
    activeRef.current = true
    startRef.current = null

    let companyStart = 0
    let company = 0
    setCompanyIdx(0)
    setFillFrac(0)

    const tick = (now: number) => {
      if (!activeRef.current) return
      if (startRef.current === null) startRef.current = now

      const elapsed = now - startRef.current
      const totalElapsed = elapsed
      const companyElapsed = totalElapsed - companyStart

      const frac = Math.min(1, companyElapsed / COMPANY_DURATION)
      setFillFrac(frac)

      if (frac >= 1) {
        company = (company + 1) % PIPELINE_MOBILE.length
        companyStart = totalElapsed
        setCompanyIdx(company)
        setFillFrac(0)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [])

  const stopAnimation = useCallback(() => {
    activeRef.current = false
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    startRef.current = null
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          runAnimation()
        } else {
          stopAnimation()
          setFillFrac(0)
          setCompanyIdx(0)
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      stopAnimation()
    }
  }, [runAnimation, stopAnimation])

  const company = PIPELINE_MOBILE[companyIdx]
  const accent = ATS_ACCENT[company.ats]

  const typedValue = (start: number, end: number, value: string) => {
    const t = Math.max(0, Math.min(1, (fillFrac - start) / (end - start)))
    return value.slice(0, Math.round(value.length * t))
  }

  const essayT = Math.max(0, Math.min(1, (fillFrac - 0.68) / 0.32))
  const essayText = ESSAY.slice(0, Math.round(ESSAY.length * essayT))
  const barPct = Math.round(fillFrac * 100)

  return (
    <section ref={sectionRef} style={{ ...sectionStyle, scrollMarginTop: 48 }}>
      <div style={innerStyle}>
        <h2 style={h2Style}>It finds them.<br />It applies.</h2>
        <p style={bodyStyle}>While you're in class, asleep, or anywhere else.</p>

        <div style={{
          width: "100%",
          borderRadius: 16,
          background: "#fbfaf8",
          border: "1px solid rgba(0,0,0,0.1)",
          boxShadow: "0 20px 50px -20px rgba(0,0,0,0.7)",
          overflow: "hidden",
          fontFamily: "Inter, sans-serif",
        }}>
          {/* header */}
          <div style={{ padding: "12px 14px", borderBottom: "1px solid #e8ede9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1f2a23" }}>{company.role}</div>
              <div style={{ fontSize: 11, color: "#6a7a70", marginTop: 2 }}>{company.name} · Application</div>
            </div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 600, color: "#8a5a17", background: "#fcefda", border: "1px solid #f0d8ad", borderRadius: 999, padding: "3px 9px" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#e0992f", opacity: fillFrac < 0.99 ? 1 : 0 }} />
              Persift autofilling
            </span>
          </div>

          <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 9 }}>
            {FIELDS.map((f) => {
              const val = typedValue(f.start, f.end, f.value)
              const isActive = fillFrac >= f.start && fillFrac < f.end
              const isDone = fillFrac >= f.end
              return (
                <div key={f.label} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <span style={{ fontSize: 10, color: "#3a4a40", fontWeight: 500 }}>{f.label}</span>
                  <div style={{
                    height: 27, borderRadius: 5, background: "#fff",
                    border: isActive ? `1.5px solid ${accent}` : "1px solid #d4ddd6",
                    boxShadow: isActive ? `0 0 0 3px ${accent}1f` : "none",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "0 9px", fontSize: 11.5, color: "#2f3a33",
                    transition: "border-color 0.15s, box-shadow 0.15s",
                  }}>
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <span>{val}</span>
                      {isActive && <span style={{ display: "inline-block", width: 1.5, height: 13, background: accent, marginLeft: 1, transform: "translateY(2px)", opacity: 1 }} />}
                    </span>
                    {isDone && (
                      <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M2.5 6.2l2.2 2.3L9.5 3.5" stroke={accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>
              )
            })}

            {/* essay */}
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontSize: 10, color: "#3a4a40", fontWeight: 500 }}>Why do you want to work here?</span>
              <div style={{
                minHeight: 54, borderRadius: 5, background: "#fff",
                border: fillFrac >= 0.68 ? `1.5px solid ${accent}` : "1px solid #d4ddd6",
                boxShadow: fillFrac >= 0.68 && fillFrac < 0.99 ? `0 0 0 3px ${accent}1f` : "none",
                padding: "6px 9px", fontSize: 11.5, lineHeight: 1.45, color: "#2f3a33",
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}>
                {essayText}
                {fillFrac >= 0.68 && fillFrac < 0.99 && (
                  <span style={{ display: "inline-block", width: 1.5, height: 13, background: accent, marginLeft: 1, transform: "translateY(2px)" }} />
                )}
              </div>
            </div>

            {/* fill progress bar */}
            <div style={{ height: 4, borderRadius: 999, background: "#e4ebe5", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${barPct}%`, borderRadius: 999, background: `linear-gradient(90deg, ${accent}, ${accent})`, transition: "width 0.05s linear" }} />
            </div>

            {/* company switcher dots */}
            <div style={{ display: "flex", justifyContent: "center", gap: 6, paddingTop: 4 }}>
              {PIPELINE_MOBILE.map((c, i) => (
                <span key={c.name} style={{
                  width: i === companyIdx ? 18 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: i === companyIdx ? accent : "#d4ddd6",
                  transition: "all 0.3s ease",
                }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const C_FOUND    = "#f0a341"
const C_TAILORED = "#c084fc"
const C_APPLIED  = "#5fd07f"
const C_DIM      = "rgba(255,255,255,0.13)"

const OVERNIGHT_COMPANIES = [
  { name: "Stripe",    role: "Software Engineer Intern", match: 94, time: "02:02 AM", tailored: true,  submitted: true,  active: false },
  { name: "Anthropic", role: "Infrastructure Intern",    match: 91, time: "02:11 AM", tailored: true,  submitted: true,  active: false },
  { name: "Figma",     role: "Design Engineer Intern",   match: 87, time: "02:18 AM", tailored: true,  submitted: true,  active: false },
  { name: "Notion",    role: "Growth Intern",            match: 83, time: "02:24 AM", tailored: true,  submitted: true,  active: false },
  { name: "Vercel",    role: "Frontend Engineer Intern", match: 85, time: "",         tailored: true,  submitted: false, active: true  },
]

function MobileOvernight() {
  return (
    <section style={sectionStyle}>
      <div style={{ ...innerStyle, maxWidth: 520 }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ ...h2Style, margin: 0 }}>You're asleep.</h2>
          <p style={{ margin: "6px 0 0", fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "clamp(22px, 6vw, 32px)", color: "var(--amber)" }}>It isn't.</p>
        </div>
        <ExtensionPopup status="applying" statusLabel="Applying" toggleOn footnote="Auto-apply" width={360}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-mute)" }}>
                Tonight · 02:27 AM
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {([["Found", C_FOUND], ["Tailored", C_TAILORED], ["Applied", C_APPLIED]] as const).map(([label, color]) => (
                  <span key={label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: color }} />
                    <span style={{ fontSize: 10, fontWeight: 500, color: "var(--ink-soft)" }}>{label}</span>
                  </span>
                ))}
              </div>
            </div>
            {OVERNIGHT_COMPANIES.map((c) => (
              <div key={c.name} style={{
                display: "flex", alignItems: "center", gap: 8,
                borderRadius: 8, padding: "5px 0",
                background: "transparent",
                borderTop: "1px solid var(--line)",
                fontFamily: "var(--font-sans)", fontSize: 12.5,
              }}>
                <span style={{ width: 16, height: 16, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: c.submitted ? C_APPLIED : C_FOUND }}>
                  {c.submitted ? (
                    <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4.5L4 7.5L10 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  ) : (
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5h10M7 1l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  )}
                </span>
                <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "left" }}>
                  <span style={{ color: "var(--ink)", fontWeight: 500 }}>{c.name}</span>
                  {" "}<span style={{ color: "var(--ink-faint)" }}>· {c.role}</span>
                </span>
                {/* pipeline dots */}
                <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: C_FOUND }} />
                  <span style={{ width: 10, height: 1, background: c.tailored ? "rgba(255,255,255,0.2)" : C_DIM }} />
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: c.tailored ? C_TAILORED : C_DIM }} />
                  <span style={{ width: 10, height: 1, background: c.submitted ? "rgba(255,255,255,0.2)" : C_DIM }} />
                  {c.active ? (
                    <motion.span
                      style={{ width: 7, height: 7, borderRadius: "50%", background: C_FOUND, display: "inline-block" }}
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                    />
                  ) : (
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: c.submitted ? C_APPLIED : C_DIM }} />
                  )}
                </div>
                <div style={{ flexShrink: 0, minWidth: 64, textAlign: "right" }}>
                  {c.active ? (
                    <span style={{ fontSize: 11, color: C_FOUND, fontWeight: 500 }}>Applying</span>
                  ) : (
                    <span style={{ fontSize: 11, color: "var(--ink-mute)", fontVariantNumeric: "tabular-nums" }}>{c.time}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ExtensionPopup>
      </div>
    </section>
  )
}

function MobileMorning() {
  return (
    <section style={sectionStyle}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h2 style={{ ...h2Style, margin: 0 }}>Check your phone.</h2>
      </div>
      <Scene5Morning />
    </section>
  )
}

function MobileAnalytics() {
  return (
    <section style={sectionStyle}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h2 style={{ ...h2Style, margin: 0 }}>See what's working.</h2>
      </div>
      <Scene6Analytics />
    </section>
  )
}

// Lazy import to avoid circular dep issues — Scene7Ask is standalone
import { Scene7Ask } from "../scenes/Scene7Ask"

function MobileCta() {
  return (
    <section id="mobile-cta" style={{ width: "100%", padding: "64px 0" }}>
      <Scene7Ask />
    </section>
  )
}

// ─── shared styles ─────────────────────────────────────────────────────────────

const sectionStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "64px 0",
}

const innerStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 480,
  padding: "0 24px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 24,
  textAlign: "center",
}

const h2Style: React.CSSProperties = {
  margin: 0,
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  fontWeight: 800,
  fontSize: "clamp(28px, 8vw, 40px)",
  letterSpacing: "-0.03em",
  lineHeight: 1.05,
  color: "var(--ink)",
}

const bodyStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: "Inter, sans-serif",
  fontSize: "clamp(14px, 3.8vw, 17px)",
  color: "var(--ink-soft)",
  lineHeight: 1.6,
}

const pillStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 500,
  color: "var(--amber-soft)",
  background: "rgba(240,163,65,0.08)",
  border: "1px solid rgba(240,163,65,0.22)",
  borderRadius: 999,
  padding: "6px 14px",
  whiteSpace: "nowrap",
}

const ctaStyle: React.CSSProperties = {
  border: "none",
  cursor: "pointer",
  borderRadius: 10,
  padding: "15px 36px",
  fontSize: 15,
  fontWeight: 600,
  color: "#1a1206",
  background: "linear-gradient(180deg, var(--amber-soft), var(--amber))",
  boxShadow: "0 4px 20px rgba(240,163,65,0.35)",
}

const labelStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: "Inter, sans-serif",
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--ink-mute)",
}

// ─── dummy motion value for SceneProgressContext ───────────────────────────────

function StaticSceneWrapper({ children, pinAt = 1 }: { children: React.ReactNode; pinAt?: number }) {
  const mv = useMotionValue(pinAt)
  return (
    <SceneProgressContext.Provider value={mv}>
      {children}
    </SceneProgressContext.Provider>
  )
}

// ─── top-level mobile layout ──────────────────────────────────────────────────

export function MobileLayout() {
  return (
    <div style={{ background: "var(--bg)", paddingTop: 48, width: "100%" }}>
      <MobileHero />
      <StaticSceneWrapper><MobileInstall /></StaticSceneWrapper>
      <StaticSceneWrapper><MobileSetup /></StaticSceneWrapper>
      <MobileDiscover />
      <StaticSceneWrapper><MobileOvernight /></StaticSceneWrapper>
      <StaticSceneWrapper><MobileMorning /></StaticSceneWrapper>
      <StaticSceneWrapper><MobileAnalytics /></StaticSceneWrapper>
      <StaticSceneWrapper><MobileCta /></StaticSceneWrapper>
    </div>
  )
}
