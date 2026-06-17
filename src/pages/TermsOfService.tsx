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
          <p>By accessing persift.com or installing the Persift Chrome extension, you agree to be bound by these Terms of Service. If you do not agree, do not use Persift.</p>
        </Section>

        <Section title="What Persift does">
          <p>Persift is a Chrome extension that discovers early-career job listings on supported job boards and, with your explicit configuration, automatically fills and submits applications on your behalf. All application submissions are made in your name, using credentials and information you supply.</p>
          <p><strong>You are responsible for the accuracy of all information you provide to Persift</strong>, including your resume, work history, and essay responses. Persift is a tool — the applications it submits are your applications.</p>
        </Section>

        <Section title="Permitted use">
          <ul>
            <li>You may use Persift only for your own personal job search.</li>
            <li>You may not use Persift to submit applications on behalf of another person without their explicit consent.</li>
            <li>You may not reverse-engineer, scrape, or attempt to extract proprietary logic from the extension.</li>
            <li>You may not use Persift to apply to roles you are not eligible for or to which you do not intend to respond.</li>
          </ul>
        </Section>

        <Section title="Waitlist">
          <p>Joining the waitlist does not guarantee access to the private beta or the final product. We reserve the right to grant or revoke access at our discretion. We will not charge you at the waitlist stage.</p>
        </Section>

        <Section title="Disclaimer of warranties">
          <p>Persift is provided <strong>"as is"</strong> and <strong>"as available"</strong>, without warranty of any kind, express or implied. We do not warrant that:</p>
          <ul>
            <li>Applications submitted via Persift will be received, processed, or reviewed by employers.</li>
            <li>The service will be uninterrupted or error-free.</li>
            <li>Job listings discovered by Persift are accurate, current, or still open.</li>
          </ul>
          <p>Job applications are submitted to third-party employer systems (Ashby, Greenhouse, Lever) that we do not control. We are not responsible for how those systems handle your application data.</p>
        </Section>

        <Section title="Limitation of liability">
          <p>To the fullest extent permitted by law, Persift and its founders shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of — or inability to use — the service, including but not limited to missed job opportunities, employer rejections, or data loss.</p>
          <p>Our total liability for any claim arising from these Terms shall not exceed the amount you paid us in the 12 months preceding the claim (which, during the free beta, is $0).</p>
        </Section>

        <Section title="Intellectual property">
          <p>The Persift name, logo, and codebase are the intellectual property of Himanshu Jarodiya. You may not reproduce or distribute them without written permission.</p>
        </Section>

        <Section title="Termination">
          <p>We may suspend or terminate your access to Persift at any time, with or without notice, if we believe you are violating these Terms or for any other reason at our sole discretion. You may stop using Persift at any time by uninstalling the extension.</p>
        </Section>

        <Section title="Changes to these terms">
          <p>We may update these Terms as the product evolves. Continued use of Persift after changes are posted constitutes acceptance of the updated Terms. Material changes will be communicated via email where feasible.</p>
        </Section>

        <Section title="Governing law">
          <p>These Terms are governed by the laws of the State of Arizona, USA, without regard to conflict of law principles.</p>
        </Section>

        <Section title="Contact">
          <p>Questions? Email <a href="mailto:himanshujar911@gmail.com">himanshujar911@gmail.com</a>.</p>
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
