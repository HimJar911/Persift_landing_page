import { useEffect } from "react"
import { Link } from "react-router-dom"

const LAST_UPDATED = "June 14, 2026"

export function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = "Privacy Policy — Persift"
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
          Privacy Policy
        </h1>

        <Section title="Overview">
          <p>Persift ("we", "us", "our") is a Chrome extension and accompanying web service that helps early-career job seekers discover and apply to roles automatically. This policy explains what data we collect, why we collect it, and how it is handled.</p>
          <p>By signing up for the waitlist or using the Persift extension, you agree to this policy.</p>
        </Section>

        <Section title="What we collect">
          <Subsection title="Waitlist sign-up">
            <p>When you join the waitlist at persift.com we collect your <strong>email address</strong> and, if provided, the referral code of the person who invited you. We do not collect your name or any other personal information at this stage.</p>
          </Subsection>
          <Subsection title="Extension usage (private beta)">
            <p>Once you have access to the Persift extension, it reads job listing pages you visit (Ashby, Greenhouse, Lever) to identify fields and populate your application. The data used to fill applications — resume, name, contact details, and essay responses — is information you provide to Persift and is stored locally in your browser's extension storage.</p>
            <p>Persift does not transmit your resume or application content to our servers. Job applications are submitted directly from your browser to the employer's ATS.</p>
          </Subsection>
          <Subsection title="Usage analytics (private beta)">
            <p>We may collect aggregate, anonymized usage metrics (e.g., number of applications submitted per session) to improve the product. These metrics are not linked to your identity.</p>
          </Subsection>
        </Section>

        <Section title="How we use your data">
          <ul>
            <li>To send you a confirmation email and referral link when you join the waitlist.</li>
            <li>To notify you when the private beta opens.</li>
            <li>To notify referrers when someone uses their link.</li>
            <li>To prevent abuse (rate limiting by IP address).</li>
          </ul>
          <p>We do not use your email for marketing beyond the above. We do not sell your data to any third party.</p>
        </Section>

        <Section title="Third-party services">
          <p>We use the following sub-processors:</p>
          <div className="legal-table">
            <table>
              <thead>
                <tr><th>Service</th><th>Purpose</th><th>Data shared</th></tr>
              </thead>
              <tbody>
                <tr><td>Resend</td><td>Transactional email</td><td>Email address</td></tr>
                <tr><td>LaunchList</td><td>Waitlist management</td><td>Email address</td></tr>
                <tr><td>Upstash Redis</td><td>Rate limiting + referral tracking</td><td>Hashed IP, email</td></tr>
                <tr><td>Vercel</td><td>Hosting and serverless functions</td><td>IP address, request metadata</td></tr>
              </tbody>
            </table>
          </div>
          <p>Each sub-processor has their own privacy policy. We have chosen services that are SOC 2 compliant or equivalent.</p>
        </Section>

        <Section title="Data retention">
          <p>Waitlist email addresses are retained until you request deletion or Persift is discontinued. Rate-limit records are automatically purged after 1 hour. Referral codes are retained for the lifetime of the waitlist.</p>
        </Section>

        <Section title="Your rights">
          <p>You may request that we:</p>
          <ul>
            <li>Delete your email from the waitlist and all associated records.</li>
            <li>Confirm what data we hold about you.</li>
          </ul>
          <p>To exercise any of these rights, email us at <a href="mailto:hjarodiy@asu.edu">hjarodiy@asu.edu</a>. We will respond within 7 days.</p>
        </Section>

        <Section title="Cookies">
          <p>The persift.com landing page does not use tracking cookies. We use <code>localStorage</code> in the browser to remember whether you have already joined the waitlist, so you see a confirmation instead of the sign-up form on repeat visits. This data stays on your device and is never transmitted to our servers.</p>
        </Section>

        <Section title="Children">
          <p>Persift is not directed at children under 13. We do not knowingly collect personal information from anyone under 13.</p>
        </Section>

        <Section title="Changes to this policy">
          <p>We may update this policy as the product evolves. If we make material changes we will update the "Last updated" date above and, where feasible, notify you by email. Continued use of Persift after changes constitutes acceptance of the revised policy.</p>
        </Section>

        <Section title="Contact">
          <p>Questions about this policy? Email <a href="mailto:hjarodiy@asu.edu">hjarodiy@asu.edu</a>.</p>
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

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: 14, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--ink-mute)", margin: "0 0 8px" }}>
        {title}
      </h3>
      {children}
    </div>
  )
}

function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--line)", padding: "32px", display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
      <Link to="/" style={footerLink}>Home</Link>
      <Link to="/privacy" style={{ ...footerLink, color: "var(--ink-soft)" }}>Privacy</Link>
      <Link to="/terms" style={footerLink}>Terms</Link>
    </footer>
  )
}

const footerLink: React.CSSProperties = {
  fontSize: 13,
  color: "var(--ink-mute)",
  textDecoration: "none",
  fontFamily: "Inter, sans-serif",
}
