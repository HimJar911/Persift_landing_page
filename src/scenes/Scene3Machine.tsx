import { useState } from "react"
import { motion, useTransform, useMotionValueEvent, type MotionValue } from "framer-motion"
import { useSceneProgress } from "../scroll/SceneContext"
import { useIsMobile } from "../hooks/useIsMobile"
import { useFitScale } from "../hooks/useFitScale"
import { ExtensionPopup } from "../components/ExtensionPopup"
import { SurfaceFrame } from "../components/Surfaces"
import { PersiftMark } from "../components/Brand"

type Ats = "greenhouse" | "ashby" | "custom"

type Company = {
  name: string
  role: string
  match: number
  ats: Ats
  formTitle: string
  essay: string
  tailorBullets: string[]
}

const PIPELINE: Company[] = [
  {
    name: "Stripe",
    role: "Software Engineer Intern",
    match: 94,
    ats: "greenhouse",
    formTitle: "Software Engineer Intern, Stripe · Application",
    essay:
      "Honestly I got into payments because a refund for my side project took 9 days and I couldn't figure out why. I want to work on the stuff people only notice when it breaks.",
    tailorBullets: [
      "Wrote the checkout logic for my club's event app, handled ~400 ticket payments",
      "Spent a weekend hunting a double-charge bug, learned idempotency keys the hard way",
    ],
  },
  {
    name: "Anthropic",
    role: "Infrastructure Intern",
    match: 91,
    ats: "ashby",
    formTitle: "Infrastructure Intern, Anthropic · Application",
    essay:
      "I blew through my GPU credits twice this semester training a tiny model, so reliable infra isn't abstract to me. It's the difference between a project working and me being broke. Want to do it at real scale.",
    tailorBullets: [
      "Ran distributed training on the campus cluster for a class project, lots of OOM errors",
      "Built a Slack bot that pings me when a job crashes so I stop losing overnight runs",
    ],
  },
  {
    name: "Figma",
    role: "Design Engineer Intern",
    match: 87,
    ats: "greenhouse",
    formTitle: "Design Engineer Intern, Figma · Application",
    essay:
      "I'm the person on every team who ends up redoing the Figma file because the spacing bugs me. I like sitting right between design and code. That's where I do my best work.",
    tailorBullets: [
      "Built a small React component library for our hackathon team so we stopped redoing buttons",
      "Rewrote a laggy canvas feature in a side project, went from janky to actually smooth",
    ],
  },
]

function Logo({ name }: { name: string }) {
  return (
    <span
      style={{
        width: 28,
        height: 28,
        borderRadius: 7,
        flexShrink: 0,
        background: "linear-gradient(135deg, #3a2c1c, #241a12)",
        border: "1px solid var(--line)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 700,
        color: "var(--amber-soft)",
        fontFamily: "var(--font-serif)",
      }}
    >
      {name[0]}
    </span>
  )
}

/* ====================================================================== */
/* role discovery card — the opening beat (Change 5)                       */
/* ====================================================================== */

function DiscoveryCard({ mv }: { mv: MotionValue<number> }) {
  // internal motion so the beat never feels frozen during its hold
  const fitWidth = useTransform(mv, [0.04, 0.19], ["0%", "100%"], { clamp: true })
  const matchOpacity = useTransform(mv, [0.14, 0.19], [0, 1])
  const linkedinOpacity = useTransform(mv, [0.17, 0.21], [0, 1])

  return (
    <div
      style={{
        width: 420,
        maxWidth: "90vw",
        borderRadius: 16,
        background: "linear-gradient(180deg, #211a13, #181109)",
        border: "1px solid rgba(240,163,65,0.32)",
        boxShadow: "0 30px 70px -30px rgba(0,0,0,0.85), 0 0 0 4px rgba(240,163,65,0.06)",
        padding: "22px 24px",
        fontFamily: "var(--font-sans)",
        display: "flex",
        flexDirection: "column",
        gap: 13,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <PersiftMark size={16} />
        <span style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--amber-soft)", fontWeight: 600 }}>
          New role found
        </span>
        <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--amber)" }}
          />
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
        <Logo name="Stripe" />
        <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
          <span style={{ fontSize: 18, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.01em" }}>
            Software Engineer Intern
          </span>
          <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>Stripe · Posted 4 minutes ago</span>
        </div>
      </div>

      {/* fit-analysis bar — gives the beat live, scroll-driven motion */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--ink-mute)" }}>
          <span>Analyzing fit with your profile…</span>
          <motion.span style={{ opacity: matchOpacity, color: "var(--amber-soft)", fontWeight: 600 }}>94% match</motion.span>
        </div>
        <div style={{ height: 5, borderRadius: 999, background: "var(--line)", overflow: "hidden" }}>
          <motion.div
            style={{
              height: "100%",
              width: fitWidth,
              borderRadius: 999,
              background: "linear-gradient(90deg, var(--amber-deep), var(--amber-soft))",
            }}
          />
        </div>
      </div>

      <motion.span style={{ opacity: linkedinOpacity, fontSize: 13, color: "var(--amber)", fontWeight: 500 }}>
        Not on LinkedIn yet.
      </motion.span>
    </div>
  )
}

/* ====================================================================== */
/* resume tailoring overlay (Change 6)                                     */
/* ====================================================================== */

function TailoringPanel({ company }: { company: Company }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 11,
        padding: "4px 2px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
          style={{
            width: 15,
            height: 15,
            borderRadius: "50%",
            border: "2px solid rgba(240,163,65,0.25)",
            borderTopColor: "var(--amber)",
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: 13, fontWeight: 600, color: "#2f3a33" }}>
          Tailoring resume for {company.name}…
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {company.tailorBullets.map((b, i) => (
          <motion.div
            key={b}
            initial={false}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              fontSize: 11.5,
              lineHeight: 1.4,
              color: "#3a4a40",
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#3aa76d",
                marginTop: 5,
                flexShrink: 0,
                opacity: 0.6 + i * 0.15,
              }}
            />
            <span>{b}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ====================================================================== */
/* the application form being auto-filled — distinct per ATS (Change 7,10) */
/* ====================================================================== */

function FilledField({ label, value, done, accent }: { label: string; value: string; done: boolean; accent: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <span style={{ fontSize: 10, color: "#3a4a40", fontWeight: 500 }}>{label}</span>
      <div
        style={{
          height: 27,
          borderRadius: 5,
          background: "#fff",
          border: "1px solid #d4ddd6",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 9px",
          fontSize: 11.5,
          color: "#2f3a33",
        }}
      >
        <span>{value}</span>
        {done && (
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2.5 6.2l2.2 2.3L9.5 3.5" stroke={accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </div>
  )
}

const ATS_STYLE: Record<Ats, { accent: string; surfaceBg: string; fieldBg: string; label: string; url: (c: string) => string }> = {
  greenhouse: {
    accent: "#3aa76d",
    surfaceBg: "#fbfaf8",
    fieldBg: "#fff",
    label: "Greenhouse",
    url: (c) => `boards.greenhouse.io/${c.toLowerCase()}/jobs/apply`,
  },
  ashby: {
    accent: "#5b62d6",
    surfaceBg: "#ffffff",
    fieldBg: "#fbfbfe",
    label: "Ashby",
    url: (c) => `jobs.ashbyhq.com/${c.toLowerCase()}/apply`,
  },
  custom: {
    accent: "#e0992f",
    surfaceBg: "#15110d",
    fieldBg: "#1c1712",
    label: "Custom",
    url: (c) => `${c.toLowerCase()}.com/careers/apply`,
  },
}

function TypedField({ label, value, fillMV, start, end, accent, dark }: {
  label: string; value: string; fillMV: MotionValue<number>
  start: number; end: number; accent: string; dark: boolean
}) {
  const typed = useTransform(fillMV, (f) => {
    const t = Math.max(0, Math.min(1, (f - start) / (end - start)))
    return value.slice(0, Math.round(value.length * t))
  })
  const ink = dark ? "#e9e2d6" : "#2f3a33"
  const fieldBorder = dark ? "#2e261d" : "#d4ddd6"
  const caretVisible = useTransform(fillMV, (f) => f >= start && f < end ? 1 : 0)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <span style={{ fontSize: 10, color: dark ? "#9a9183" : "#3a4a40", fontWeight: 500 }}>{label}</span>
      <motion.div
        style={{
          height: 27,
          borderRadius: 5,
          background: useTransform(fillMV, (f) =>
            f >= start && f < end ? (dark ? "#211a13" : "#fff") : (dark ? "#211a13" : "#fff")
          ),
          border: useTransform(fillMV, (f) =>
            f >= start && f < end ? `1.5px solid ${accent}` : `1px solid ${fieldBorder}`
          ),
          boxShadow: useTransform(fillMV, (f) =>
            f >= start && f < end ? `0 0 0 3px ${accent}1f` : "none"
          ),
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 9px",
          fontSize: 11.5,
          color: ink,
        }}
      >
        <span style={{ display: "flex", alignItems: "center" }}>
          <motion.span>{typed}</motion.span>
          <motion.span
            style={{
              opacity: caretVisible,
              display: "inline-block",
              width: 1.5,
              height: 13,
              background: accent,
              marginLeft: 1,
              transform: "translateY(2px)",
            }}
          />
        </span>
        <motion.span style={{ opacity: useTransform(fillMV, (f) => f >= end ? 1 : 0) }}>
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2.5 6.2l2.2 2.3L9.5 3.5" stroke={accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>
      </motion.div>
    </div>
  )
}

function ApplicationForm({ company, fillMV, phase }: { company: Company; fillMV: MotionValue<number>; phase: "tailoring" | "filling" }) {
  const style = ATS_STYLE[company.ats]
  const dark = company.ats === "custom"

  const ESSAY = company.essay
  const essayTyped = useTransform(fillMV, (f) => {
    const t = Math.max(0, Math.min(1, (f - 0.38) / 0.55))
    return ESSAY.slice(0, Math.round(ESSAY.length * t))
  })
  const essayCaretOpacity = useTransform(fillMV, (f) => (f >= 0.38 && f < 0.93 ? 1 : 0))
  const barWidth = useTransform(fillMV, (f) => `${Math.round(f * 100)}%`)
  const autofillDotOpacity = useTransform(fillMV, (f) => (f < 0.99 ? 1 : 0))

  const ink = dark ? "#e9e2d6" : "#2f3a33"
  const inkMute = dark ? "#9a9183" : "#6a7a70"
  const fieldBorder = dark ? "#2e261d" : "#d4ddd6"

  const resumeFilename = `resume_${company.name.toLowerCase()}_tailored.pdf`
  const resumeTyped = useTransform(fillMV, (f) => {
    const t = Math.max(0, Math.min(1, (f - 0.14) / 0.06))
    return resumeFilename.slice(0, Math.round(resumeFilename.length * t))
  })
  const resumeDone = useTransform(fillMV, (f) => f >= 0.20 ? 1 : 0)
  const resumeBorder = useTransform(fillMV, (f) =>
    f >= 0.14 && f < 0.20 ? `1.5px solid ${style.accent}` : `1px solid ${fieldBorder}`
  )
  const resumeBoxShadow = useTransform(fillMV, (f) =>
    f >= 0.14 && f < 0.20 ? `0 0 0 3px ${style.accent}1f` : "none"
  )
  const essayBorder = useTransform(fillMV, (f) =>
    f >= 0.38 ? `1.5px solid ${style.accent}` : `1px solid ${fieldBorder}`
  )
  const essayBoxShadow = useTransform(fillMV, (f) =>
    f >= 0.38 && f < 1.0 ? `0 0 0 3px ${style.accent}1f` : "none"
  )

  return (
    <SurfaceFrame url={style.url(company.name)} accent={style.accent} width={440}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 9,
          background: dark ? style.surfaceBg : "transparent",
          margin: -12,
          padding: 11,
          borderRadius: 8,
        }}
      >
        {/* header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: ink }}>{company.role}</span>
            <span style={{ fontSize: 11, color: inkMute }}>
              {company.formTitle.includes("·") ? company.formTitle.split("·")[1].trim() : `${company.name} · ${style.label}`}
            </span>
          </div>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 10,
              fontWeight: 600,
              color: "#8a5a17",
              background: "#fcefda",
              border: "1px solid #f0d8ad",
              borderRadius: 999,
              padding: "3px 9px",
            }}
          >
            <motion.span style={{ width: 6, height: 6, borderRadius: "50%", background: "#e0992f", opacity: autofillDotOpacity }} />
            Persift autofilling
          </span>
        </div>

        {phase === "tailoring" ? (
          <div
            style={{
              borderRadius: 8,
              background: dark ? "rgba(240,163,65,0.06)" : "#f3f8f4",
              border: `1px solid ${dark ? "rgba(240,163,65,0.2)" : "#dce8e0"}`,
              padding: "12px 14px",
            }}
          >
            <TailoringPanel company={company} />
          </div>
        ) : (
          <>
            <TypedField label="Full name" value="Jordan Reyes" fillMV={fillMV} start={0.00} end={0.07} accent={style.accent} dark={dark} />
            <TypedField label="Email" value="jordan.reyes@berkeley.edu" fillMV={fillMV} start={0.07} end={0.14} accent={style.accent} dark={dark} />

            {/* resume */}
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontSize: 10, color: dark ? "#9a9183" : "#3a4a40", fontWeight: 500 }}>Resume / CV</span>
              <motion.div
                style={{
                  height: 27,
                  borderRadius: 5,
                  background: dark ? "#211a13" : "#eef5f0",
                  border: resumeBorder,
                  boxShadow: resumeBoxShadow,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "0 9px",
                  fontSize: 11.5,
                  color: ink,
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: 2, background: style.accent, flexShrink: 0 }} />
                <motion.span style={{ flex: 1 }}>{resumeTyped}</motion.span>
                <motion.span style={{ opacity: resumeDone }}>
                  <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2.5 6.2l2.2 2.3L9.5 3.5" stroke={style.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.span>
              </motion.div>
            </div>

            <TypedField label="Work authorization" value="U.S. Citizen or Permanent Resident" fillMV={fillMV} start={0.20} end={0.28} accent={style.accent} dark={dark} />
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <TypedField label="Graduation date" value="May 2027" fillMV={fillMV} start={0.28} end={0.32} accent={style.accent} dark={dark} />
              </div>
              <div style={{ width: 92 }}>
                <TypedField label="GPA" value="3.8" fillMV={fillMV} start={0.32} end={0.36} accent={style.accent} dark={dark} />
              </div>
            </div>
            <TypedField label="Portfolio / GitHub" value="github.com/jordanreyes" fillMV={fillMV} start={0.36} end={0.38} accent={style.accent} dark={dark} />

            {/* essay */}
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontSize: 10, color: dark ? "#9a9183" : "#3a4a40", fontWeight: 500 }}>
                Why do you want to work here?
              </span>
              <motion.div
                style={{
                  minHeight: 54,
                  borderRadius: 5,
                  background: dark ? "#211a13" : "#fff",
                  border: essayBorder,
                  boxShadow: essayBoxShadow,
                  padding: "6px 9px",
                  fontSize: 11.5,
                  lineHeight: 1.45,
                  color: ink,
                }}
              >
                <motion.span>{essayTyped}</motion.span>
                <motion.span
                  style={{
                    opacity: essayCaretOpacity,
                    display: "inline-block",
                    width: 1.5,
                    height: 13,
                    background: style.accent,
                    marginLeft: 1,
                    transform: "translateY(2px)",
                  }}
                />
              </motion.div>
            </div>

            {/* fill progress */}
            <div style={{ height: 4, borderRadius: 999, background: dark ? "#2e261d" : "#e4ebe5", overflow: "hidden" }}>
              <motion.div
                style={{
                  height: "100%",
                  width: barWidth,
                  borderRadius: 999,
                  background: `linear-gradient(90deg, ${style.accent}, ${style.accent})`,
                }}
              />
            </div>
          </>
        )}
      </div>
    </SurfaceFrame>
  )
}

/* ====================================================================== */
/* needs-you state body (Change 8)                                         */
/* ====================================================================== */

function NeedsYouBody() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
        <span
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "rgba(240,163,65,0.16)",
            color: "var(--amber)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          !
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>Figma · Design Engineer Intern</span>
          <span style={{ fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.45 }}>
            Ready to submit. Review before we send?
          </span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 9 }}>
        <span
          style={{
            flex: 1,
            textAlign: "center",
            borderRadius: 10,
            padding: "10px 8px",
            fontSize: 12.5,
            fontWeight: 600,
            color: "#1a1206",
            background: "linear-gradient(180deg, var(--amber-soft), var(--amber))",
          }}
        >
          Review &amp; Submit
        </span>
        <span
          style={{
            flex: 1,
            textAlign: "center",
            borderRadius: 10,
            padding: "10px 8px",
            fontSize: 12.5,
            fontWeight: 600,
            color: "var(--ink-soft)",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--line)",
          }}
        >
          Auto-submit this one
        </span>
      </div>
    </div>
  )
}

/* ====================================================================== */

export function Scene3Machine() {
  const p = useSceneProgress()
  const isMobile = useIsMobile(900)
  const { containerRef, contentRef, scale: fitScale } = useFitScale(24)

  const discoveryOpacity = useTransform(p, [0, 0.04, 0.19, 0.25], [0, 1, 1, 0])
  const workOpacity = useTransform(p, [0.23, 0.28, 0.96, 1.0], [0, 1, 1, 0])

  const APPLY_START = 0.38
  const APPLY_END = 1.0

  // only Stripe — single company slot
  const frac = useTransform(p, (v) =>
    Math.max(0, Math.min(1, (v - APPLY_START) / (APPLY_END - APPLY_START)))
  )

  const [phase, setPhase] = useState<"tailoring" | "filling">("tailoring")
  useMotionValueEvent(frac, "change", (f) => {
    const next = f < 0.07 ? "tailoring" : "filling"
    if (next !== phase) requestAnimationFrame(() => setPhase(next))
  })
  // fillFrac: 0→1 during the filling phase
  const fillFrac = useTransform(frac, (f) => Math.max(0, Math.min(1, (f - 0.09) / 0.91)))
  // mobile: popup fades out [0.04→0.07], form fades in [0.07→0.14]
  const popupOpacity = useTransform(frac, [0.04, 0.07], [1, 0])
  const formOpacity  = useTransform(frac, [0.07, 0.14], [0, 1])
  const fill = useTransform(fillFrac, (f) => `${Math.round(f * 100)}%`)

  const active = PIPELINE[0]
  const queue: Company[] = []

  const discoveryHeaderOpacity = useTransform(p, [0, 0.04, 0.19, 0.25], [0, 1, 1, 0])
  const tailoringHeaderOpacity = useTransform(p, [0.23, 0.28, 0.35, 0.40], [0, 1, 1, 0])
  const fillingHeaderOpacity   = useTransform(frac, [0.07, 0.12, 0.97, 1.0], [0, 1, 1, 0])

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* beat 1 header — discovery */}
      <motion.div style={{ opacity: discoveryHeaderOpacity, position: "absolute", top: 40, left: 0, right: 0, textAlign: "center", pointerEvents: "none", padding: "0 24px" }}>
        <h3 style={{ margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "clamp(26px, 3.5vw, 42px)", letterSpacing: "-0.025em", color: "var(--ink)" }}>
          First to know.
        </h3>
      </motion.div>

      {/* opening discovery beat */}
      <motion.div style={{ opacity: discoveryOpacity, position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
        <DiscoveryCard mv={p} />
      </motion.div>

      {/* beat 2 header — tailoring */}
      <motion.div style={{ opacity: tailoringHeaderOpacity, position: "absolute", top: 40, left: 0, right: 0, textAlign: "center", pointerEvents: "none", padding: "0 24px" }}>
        <h3 style={{ margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "clamp(26px, 3.5vw, 42px)", letterSpacing: "-0.025em", color: "var(--ink)" }}>
          Custom resume. In seconds.
        </h3>
      </motion.div>

      {/* beat 3 header — autofill */}
      <motion.div style={{ opacity: fillingHeaderOpacity, position: "absolute", top: 40, left: 0, right: 0, textAlign: "center", pointerEvents: "none", padding: "0 24px" }}>
        <h3 style={{ margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "clamp(26px, 3.5vw, 42px)", letterSpacing: "-0.025em", color: "var(--ink)" }}>
          Every field. Handled.
        </h3>
      </motion.div>

      {/* the working split-screen */}
      <motion.div
        ref={contentRef}
        style={{
          opacity: workOpacity,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          gap: isMobile ? 14 : 34,
          flexWrap: isMobile ? "nowrap" : "wrap",
          padding: isMobile ? "0 16px" : "60px 28px 0",
          width: "100%",
          scale: fitScale,
          transformOrigin: "center",
        }}
      >
        {/* LEFT — extension popup (always on desktop; on mobile only during tailoring phase) */}
        {isMobile ? (
          <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center", minHeight: 520 }}>
            {/* popup — fades out as form fades in */}
            <motion.div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", opacity: popupOpacity, pointerEvents: phase === "tailoring" ? "auto" : "none", width: "100%", display: "flex", justifyContent: "center" }}>
              <ExtensionPopup status="applying" statusLabel="Applying" toggleOn footnote="Auto-apply" width={340}>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <span style={{ fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-mute)" }}>
                      Tailoring resume for
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 11, marginTop: 9 }}>
                      <Logo name={active.name} />
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{active.name}</span>
                        <span style={{ fontSize: 12, color: "var(--ink-mute)" }}>{active.role}</span>
                      </div>
                    </div>
                    <div style={{ marginTop: 12, height: 5, borderRadius: 999, background: "var(--line)", overflow: "hidden" }}>
                      <motion.div style={{ height: "100%", width: fill, borderRadius: 999, background: "linear-gradient(90deg, var(--amber-deep), var(--amber-soft))" }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <span style={{ fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)" }}>Next in line</span>
                    <span style={{ fontSize: 12.5, color: "var(--ink-mute)" }}>Queue complete.</span>
                  </div>
                </div>
              </ExtensionPopup>
            </motion.div>

            {/* form — fades in as popup fades out, always rendered as "filling" */}
            <motion.div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", opacity: formOpacity, pointerEvents: phase === "filling" ? "auto" : "none", width: "100%", display: "flex", justifyContent: "center" }}>
              <ApplicationForm company={active} fillMV={fillFrac} phase="filling" />
            </motion.div>
          </div>
        ) : (
          <>
            <ExtensionPopup status="applying" statusLabel="Applying" toggleOn footnote="Auto-apply" width={340}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <span style={{ fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-mute)" }}>
                    {phase === "tailoring" ? "Tailoring resume for" : "Currently applying to"}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 11, marginTop: 9 }}>
                    <Logo name={active.name} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{active.name}</span>
                      <span style={{ fontSize: 12, color: "var(--ink-mute)" }}>{active.role}</span>
                    </div>
                  </div>
                  <div style={{ marginTop: 12, height: 5, borderRadius: 999, background: "var(--line)", overflow: "hidden" }}>
                    <motion.div style={{ height: "100%", width: fill, borderRadius: 999, background: "linear-gradient(90deg, var(--amber-deep), var(--amber-soft))" }} />
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <span style={{ fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink-faint)" }}>Next in line</span>
                  <span style={{ fontSize: 12.5, color: "var(--ink-mute)" }}>Queue complete.</span>
                </div>
              </div>
            </ExtensionPopup>

            {/* connective beam */}
            <div aria-hidden="true" style={{ width: 40, height: 2, background: "linear-gradient(90deg, var(--amber-soft), transparent)", alignSelf: "center", opacity: 0.6 }} />

            <ApplicationForm company={active} fillMV={fillFrac} phase={phase} />
          </>
        )}
      </motion.div>
    </div>
  )
}
