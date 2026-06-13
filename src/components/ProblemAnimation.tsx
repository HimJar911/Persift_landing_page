import { useState, useEffect, useRef } from "react"

// ─── rejection email data ────────────────────────────────────────────────────

const REJECTIONS = [
  { from: "no-reply@greenhouse.io",   sender: "Stripe Recruiting",     subject: "Your application to Stripe" },
  { from: "careers@anthropic.com",    sender: "Anthropic Careers",      subject: "Re: Software Engineer Intern" },
  { from: "no-reply@lever.co",        sender: "Figma Talent Team",      subject: "Update on your application" },
  { from: "recruiting@ramp.com",      sender: "Ramp Recruiting",        subject: "Your Ramp application" },
  { from: "no-reply@ashbyhq.com",     sender: "Linear Talent",          subject: "Application status update" },
  { from: "jobs@notion.so",           sender: "Notion Recruiting",      subject: "Re: Growth Engineer – Notion" },
  { from: "no-reply@greenhouse.io",   sender: "DoorDash Recruiting",    subject: "Your application to DoorDash" },
  { from: "talent@vercel.com",        sender: "Vercel Careers",         subject: "Vercel – Application Update" },
]

const BODY_LINES = [
  "Thank you for your interest. After careful consideration…",
  "We've decided to move forward with other candidates…",
  "We regret to inform you that we will not be moving…",
  "After reviewing your application, we have decided…",
  "We appreciate your time but have chosen to proceed…",
]

// ─── LinkedIn job listings (frozen, realistic) ───────────────────────────────

const JOBS = [
  { company: "Stripe",    logo: "S", logoColor: "#635bff", logoBg: "#f0efff", title: "Software Engineer Intern",        meta: "San Francisco, CA · 3 hours ago",  easy: true,  promoted: false },
  { company: "Anthropic", logo: "A", logoColor: "#c96442", logoBg: "#fdf3ef", title: "Infrastructure Intern",           meta: "Remote · 1 day ago",               easy: false, promoted: false },
  { company: "Figma",     logo: "F", logoColor: "#1e1e1e", logoBg: "#f5f5f5", title: "Design Engineer Intern",          meta: "New York, NY · 5 hours ago",       easy: true,  promoted: true  },
  { company: "Ramp",      logo: "R", logoColor: "#2d2926", logoBg: "#f5f0eb", title: "Software Engineer, AI",           meta: "Remote · 2 days ago",              easy: false, promoted: false },
  { company: "Linear",    logo: "L", logoColor: "#5e6ad2", logoBg: "#eef0fb", title: "Product Engineer Intern",         meta: "San Francisco, CA · 12 hours ago", easy: true,  promoted: false },
]

const TABS = [
  { title: "LinkedIn Job Search",            active: true  },
  { title: "Job Application – Stripe",       active: false },
  { title: "Software Engineer Intern – Fig…",active: false },
  { title: "Ramp Careers",                   active: false },
]

// ─── Gmail-style notification ────────────────────────────────────────────────

interface Notif {
  id: number
  rejection: typeof REJECTIONS[0]
  body: string
  entering: boolean
  exiting: boolean
}

let _nid = 0

function GmailNotif({ notif, onDone }: { notif: Notif; onDone: () => void }) {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in")

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 30)
    const t2 = setTimeout(() => setPhase("out"), 4200)
    const t3 = setTimeout(onDone, 4800)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  const translateX = phase === "in" ? "100%" : phase === "out" ? "calc(100% + 8px)" : "0%"
  const opacity    = phase === "hold" ? 1 : 0

  return (
    <div style={{
      width: 272,
      background: "#fff",
      borderRadius: 8,
      boxShadow: "0 4px 24px rgba(0,0,0,0.18), 0 1px 4px rgba(0,0,0,0.1)",
      padding: "10px 12px",
      display: "flex",
      gap: 10,
      transform: `translateX(${translateX})`,
      opacity,
      transition: "transform 0.38s cubic-bezier(0.32,0,0.18,1), opacity 0.3s ease",
      flexShrink: 0,
    }}>
      {/* Gmail M icon */}
      <div style={{
        width: 28, height: 28, borderRadius: 4, flexShrink: 0,
        background: "linear-gradient(135deg, #4285f4 0%, #ea4335 50%, #fbbc04 75%, #34a853 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, fontWeight: 700, color: "#fff",
        fontFamily: "Arial, sans-serif",
      }}>
        M
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 11, fontWeight: 600, color: "#202124",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          fontFamily: "Google Sans, Roboto, Arial, sans-serif",
        }}>
          {notif.rejection.sender}
        </div>
        <div style={{
          fontSize: 11, color: "#5f6368", marginTop: 1,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          fontFamily: "Roboto, Arial, sans-serif",
        }}>
          {notif.rejection.subject}
        </div>
        <div style={{
          fontSize: 10.5, color: "#80868b", marginTop: 2,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          fontFamily: "Roboto, Arial, sans-serif",
        }}>
          {notif.body}
        </div>
      </div>
    </div>
  )
}

// ─── LinkedIn UI ─────────────────────────────────────────────────────────────

function LinkedInLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="4" fill="#0A66C2" />
      <path d="M8 13h3.5v11H8V13zm1.75-5.5a2 2 0 110 4 2 2 0 010-4zM14 13h3.3v1.5h.05c.46-.87 1.58-1.8 3.25-1.8 3.47 0 4.4 2.28 4.4 5.25V24H21.5v-5.5c0-1.31-.03-3-1.83-3-1.83 0-2.1 1.43-2.1 2.9V24H14V13z" fill="#fff"/>
    </svg>
  )
}

function JobCard({ job, isFirst }: { job: typeof JOBS[0]; isFirst: boolean }) {
  return (
    <div style={{
      padding: "12px 14px",
      borderBottom: "1px solid #e8e8e8",
      background: isFirst ? "#f3f6ff" : "#fff",
      borderLeft: isFirst ? "3px solid #0A66C2" : "3px solid transparent",
      cursor: "default",
    }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{
          width: 36, height: 36, borderRadius: 6, flexShrink: 0,
          background: job.logoBg,
          border: "1px solid #e0e0e0",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, fontWeight: 700, color: job.logoColor,
          fontFamily: "Arial, sans-serif",
        }}>
          {job.logo}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 12.5, fontWeight: 600, color: "#0A66C2",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}>
            {job.title}
          </div>
          <div style={{ fontSize: 11.5, color: "#191919", fontFamily: "system-ui, sans-serif" }}>{job.company}</div>
          <div style={{ fontSize: 10.5, color: "#666", marginTop: 1, fontFamily: "system-ui, sans-serif" }}>{job.meta}</div>
          <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
            {job.promoted && (
              <span style={{ fontSize: 10, color: "#666", fontStyle: "italic", fontFamily: "system-ui, sans-serif" }}>Promoted</span>
            )}
            {job.easy && (
              <span style={{
                fontSize: 10, color: "#057642", background: "#f0faf5",
                border: "1px solid #c1e4cf", borderRadius: 3, padding: "1px 5px",
                fontFamily: "system-ui, sans-serif",
              }}>
                Easy Apply
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── main component ───────────────────────────────────────────────────────────

export function ProblemAnimation() {
  const [notifs, setNotifs] = useState<Notif[]>([])
  const rejIdxRef  = useRef(0)
  const bodyIdxRef = useRef(0)
  const cancelRef  = useRef(false)

  useEffect(() => {
    cancelRef.current = false

    function scheduleNext() {
      if (cancelRef.current) return
      // random gap: 1.8s–4.5s, and ~30% chance of skipping (no notification that cycle)
      const skip  = Math.random() < 0.28
      const delay = 1800 + Math.random() * 2700

      setTimeout(() => {
        if (cancelRef.current) return
        if (!skip) {
          const rejection = REJECTIONS[rejIdxRef.current % REJECTIONS.length]
          const body      = BODY_LINES[bodyIdxRef.current % BODY_LINES.length]
          rejIdxRef.current++
          bodyIdxRef.current++
          const id = _nid++

          setNotifs(prev => {
            const next = [...prev, { id, rejection, body, entering: true, exiting: false }]
            return next.slice(-2) // max 2
          })
        }
        scheduleNext()
      }, delay)
    }

    // first notification after a brief pause so the screen settles
    const t = setTimeout(scheduleNext, 1400)
    return () => { cancelRef.current = true; clearTimeout(t) }
  }, [])

  function removeNotif(id: number) {
    setNotifs(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div style={{
      width: "100%", height: "100%",
      background: "#f3f2ef",
      display: "flex", flexDirection: "column",
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* ── macOS Chrome tab bar ─────────────────────────────── */}
      <div style={{
        background: "#dee1e6",
        flexShrink: 0,
        paddingTop: 6,
        display: "flex",
        alignItems: "flex-end",
        paddingLeft: 70,
        gap: 0,
        height: 32,
      }}>
        {/* traffic lights */}
        <div style={{
          position: "absolute", left: 8, top: 9,
          display: "flex", gap: 5,
        }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#e06c5b", display: "block" }} />
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#e3b14a", display: "block" }} />
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#7bb86f", display: "block" }} />
        </div>
        {TABS.map((tab) => (
          <div key={tab.title} style={{
            height: 26,
            padding: "0 10px",
            background: tab.active ? "#fff" : "transparent",
            borderRadius: tab.active ? "6px 6px 0 0" : "6px 6px 0 0",
            display: "flex", alignItems: "center",
            fontSize: 10,
            color: tab.active ? "#202124" : "#5f6368",
            whiteSpace: "nowrap",
            maxWidth: tab.active ? 160 : 110,
            overflow: "hidden",
            textOverflow: "ellipsis",
            borderTop: tab.active ? "1px solid #e0e0e0" : "none",
            borderLeft: tab.active ? "1px solid #e0e0e0" : "none",
            borderRight: tab.active ? "1px solid #e0e0e0" : "none",
            cursor: "default",
            flexShrink: 0,
          }}>
            {tab.active && (
              <span style={{ marginRight: 5, flexShrink: 0, lineHeight: 1 }}>
                <LinkedInLogo />
              </span>
            )}
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{tab.title}</span>
          </div>
        ))}
      </div>

      {/* ── address bar ──────────────────────────────────────── */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid #e0e0e0",
        padding: "4px 10px",
        display: "flex",
        alignItems: "center",
        gap: 7,
        flexShrink: 0,
        height: 28,
      }}>
        <svg width="11" height="11" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
          <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm9 14l-4-4" stroke="#5f6368" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <div style={{
          flex: 1, background: "#f1f3f4", borderRadius: 10,
          padding: "2px 10px", fontSize: 9.5, color: "#202124",
          display: "flex", alignItems: "center", gap: 5,
        }}>
          <svg width="9" height="9" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
            <rect x="2" y="5" width="12" height="9" rx="1.5" stroke="#5f6368" strokeWidth="1.5"/>
            <path d="M5 5V4a3 3 0 016 0v1" stroke="#5f6368" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span style={{ color: "#1a73e8" }}>linkedin.com</span>
          <span style={{ color: "#5f6368" }}>/jobs/search/?keywords=software+intern</span>
        </div>
      </div>

      {/* ── LinkedIn header ───────────────────────────────────── */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid #e0e0e0",
        padding: "6px 12px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexShrink: 0,
      }}>
        <LinkedInLogo />
        <div style={{
          flex: 1, background: "#eef3f8", borderRadius: 4,
          padding: "4px 9px", fontSize: 10, color: "#333",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <svg width="9" height="9" viewBox="0 0 16 16" fill="none">
            <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm9 14l-4-4" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          software intern
        </div>
        <div style={{
          background: "#eef3f8", borderRadius: 4,
          padding: "4px 8px", fontSize: 10, color: "#333",
          display: "flex", alignItems: "center", gap: 4,
        }}>
          <svg width="9" height="9" viewBox="0 0 16 16" fill="none">
            <path d="M8 2C4.69 2 2 4.69 2 8s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 2a2 2 0 110 4 2 2 0 010-4z" fill="#666"/>
          </svg>
          Greater Phoenix Area
        </div>
      </div>

      {/* ── filter chips ─────────────────────────────────────── */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid #e8e8e8",
        padding: "5px 10px",
        display: "flex", gap: 5, flexShrink: 0, overflow: "hidden",
      }}>
        {["Date posted", "Experience level", "Remote", "Easy Apply"].map((f) => (
          <span key={f} style={{
            fontSize: 10, color: "#333",
            border: "1px solid #c0c0c0",
            borderRadius: 14, padding: "2px 8px",
            background: "#fff", whiteSpace: "nowrap", flexShrink: 0,
          }}>
            {f} ▾
          </span>
        ))}
      </div>

      {/* ── results count ─────────────────────────────────────── */}
      <div style={{
        background: "#fff",
        padding: "5px 14px",
        fontSize: 10, color: "#666",
        borderBottom: "1px solid #e8e8e8",
        flexShrink: 0,
      }}>
        87 results
      </div>

      {/* ── job list ─────────────────────────────────────────── */}
      <div style={{ flex: 1, overflow: "hidden", background: "#fff" }}>
        {JOBS.map((job, i) => (
          <JobCard key={job.company} job={job} isFirst={i === 0} />
        ))}
      </div>

      {/* ── notification stack (top-right) ───────────────────── */}
      <div style={{
        position: "absolute",
        top: 8,
        right: 8,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        zIndex: 10,
        overflow: "hidden",
        width: 272,
      }}>
        {notifs.map((n) => (
          <GmailNotif key={n.id} notif={n} onDone={() => removeNotif(n.id)} />
        ))}
      </div>
    </div>
  )
}
