import { useEffect } from "react"
import { Link } from "react-router-dom"

const LAST_UPDATED = "June 17, 2026"

export function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = "Terms of Service — Persift"
    return () => { document.title = "Persift — Your job search runs itself." }
  }, [])

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--ink)", fontFamily: "Inter, sans-serif" }}>
      {/* header */}
      <header style={{
        position: "sticky", top: 0, left: 0, right: 0,
        height: 48, display: "flex", alignItems: "center",
        padding: "0 32px", zIndex: 110,
        background: "rgba(12,10,8,0.92)", backdropFilter: "blur(8px)",
        borderBottom: "1px solid var(--line)",
      }}>
        <Link to="/" style={{ textDecoration: "none", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 16, color: "var(--ink)", letterSpacing: "-0.02em" }}>
          Persift
        </Link>
      </header>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "72px 32px 120px" }}>
        <p style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-mute)", marginBottom: 12 }}>
          Last updated: {LAST_UPDATED}
        </p>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "clamp(32px, 5vw, 48px)", letterSpacing: "-0.03em", lineHeight: 1.05, margin: "0 0 48px" }}>
          Terms of Service
        </h1>

        <Section title="Acceptance">
          <p>By accessing persift.com or installing the Persift Chrome extension, you agree to these Terms of Service. If you do not agree, do not use Persift.</p>
        </Section>

        <Section title="What Persift does">
          <p>Persift is a Chrome extension that finds early-career job listings on supported job boards and, based on how you set it up, fills and submits applications on your behalf. Every application is submitted in your name, using the information you give us.</p>
          <p>You are responsible for everything you provide to Persift, including your resume, work history, and answers to application questions. Persift is a tool. The applications it sends are your applications, and you are responsible for what is in them.</p>
        </Section>

        <Section title="Eligibility">
          <p>You must be at least 13 years old to use Persift. If you are using Persift to apply to jobs, you are also responsible for making sure you are legally allowed to work in the roles and locations you apply to. Persift does not check work authorization, visa status, or eligibility for any role.</p>
        </Section>

        <Section title="Permitted use">
          <ul>
            <li>You may use Persift only for your own personal job search.</li>
            <li>You may not use Persift to submit applications for another person without their clear consent.</li>
            <li>You may not reverse engineer, scrape, or try to extract the proprietary logic of the extension.</li>
            <li>You may not use Persift to apply to roles you are not eligible for or have no intention of responding to.</li>
            <li>You may not use Persift in a way that breaks the terms of the job boards or employer systems it interacts with, or any applicable law.</li>
          </ul>
        </Section>

        <Section title="Your responsibility for submitted applications">
          <p>Persift acts on your instructions. You decide which roles to target and what information to include, and you are responsible for reviewing your profile and resume before applications go out. We are not responsible for applications that are submitted with errors, sent to the wrong role, or based on outdated information you provided. If you want to stop Persift from applying on your behalf, you can pause it or uninstall the extension at any time.</p>
        </Section>

        <Section title="Waitlist">
          <p>Joining the waitlist does not guarantee access to the private beta or the final product. We may grant or revoke access at our discretion. We will not charge you at the waitlist stage.</p>
        </Section>

        <Section title="No professional advice">
          <p>Persift does not provide career, legal, or employment advice. Match scores, tailored resumes, and suggested responses are generated automatically and may be wrong or incomplete. You should review everything before relying on it.</p>
        </Section>

        <Section title="Disclaimer of warranties">
          <p>Persift is provided <strong>"as is"</strong> and <strong>"as available"</strong>, without warranty of any kind, whether express or implied. We do not promise that:</p>
          <ul>
            <li>Applications submitted through Persift will be received, processed, or reviewed by employers.</li>
            <li>The service will run without interruptions or errors.</li>
            <li>Job listings found by Persift are accurate, current, or still open.</li>
            <li>The automated tailoring or match scoring will be accurate or suitable for any role.</li>
          </ul>
          <p>Applications are submitted to third-party employer systems (Ashby, Greenhouse, Lever) that we do not control. We are not responsible for how those systems receive, store, or handle your application data.</p>
        </Section>

        <Section title="Limitation of liability">
          <p>To the fullest extent allowed by law, Persift and its founders are not liable for any indirect, incidental, special, or consequential damages that arise from your use of, or inability to use, the service. This includes but is not limited to missed job opportunities, employer rejections, applications that are not delivered, and data loss.</p>
          <p>Our total liability for any claim arising from these Terms will not exceed the amount you paid us in the 12 months before the claim. During the free beta, that amount is $0.</p>
        </Section>

        <Section title="Service changes and availability">
          <p>Persift is in active development. We may change, suspend, or discontinue any part of the service at any time, including features, supported job boards, or the product as a whole, with or without notice. We are not liable to you for doing so.</p>
        </Section>

        <Section title="Intellectual property">
          <p>The Persift name, logo, and codebase are the property of Himanshu Jarodiya. You may not copy, reproduce, or distribute them without written permission. Nothing in these Terms gives you any ownership of Persift.</p>
        </Section>

        <Section title="Termination">
          <p>We may suspend or end your access to Persift at any time, with or without notice, if we believe you are breaking these Terms or for any other reason at our discretion. You may stop using Persift at any time by uninstalling the extension. The sections on liability, disclaimers, and intellectual property continue to apply after your access ends.</p>
        </Section>

        <Section title="Changes to these terms">
          <p>We may update these Terms as the product changes. Continuing to use Persift after changes are posted means you accept the updated Terms. Where we can, we will tell you about material changes by email.</p>
        </Section>

        <Section title="Governing law">
          <p>These Terms are governed by the laws of the State of Arizona, USA, without regard to its conflict of law rules. Any dispute arising from these Terms will be handled in the state or federal courts located in Arizona, and you agree to that jurisdiction.</p>
        </Section>

        <Section title="Contact">
          <p>Questions about these Terms? Email <a href="mailto:himanshujar911@gmail.com">himanshujar911@gmail.com</a>.</p>
        </Section>
      </div>

      <Footer />
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: "-0.01em", color: "var(--ink)", margin: "0 0 16px", paddingBottom: 10, borderBottom: "1px solid var(--line)" }}>
        {title}
      </h2>
      <div className="legal-prose" style={{ fontSize: 15, lineHeight: 1.75, color: "var(--ink-soft)" }}>
        {children}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--line)", padding: "32px", display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
      <Link to="/" style={footerLink}>Home</Link>
      <Link to="/privacy" style={footerLink}>Privacy</Link>
      <Link to="/terms" style={{ ...footerLink, color: "var(--ink-soft)" }}>Terms</Link>
    </footer>
  )
}

const footerLink: React.CSSProperties = {
  fontSize: 13,
  color: "var(--ink-mute)",
  textDecoration: "none",
  fontFamily: "Inter, sans-serif",
}
