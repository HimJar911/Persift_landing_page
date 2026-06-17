import { useEffect } from "react"
import { Link } from "react-router-dom"

const LAST_UPDATED = "June 17, 2026"

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
            <p>When you sign up at persift.com we collect your <strong>email address</strong>. That is the only thing we ask for at this stage. We do not collect your name or anything else.</p>
          </Subsection>
          <Subsection title="Account and profile (private beta)">
            <p>When you set up Persift, you give us your name, contact details, university, the roles and locations you are targeting, your resume, and any saved answers to common application questions. We use this to match you to jobs and to prepare your applications.</p>
          </Subsection>
          <Subsection title="Job and application data (private beta)">
            <p>The extension reads job listing pages you visit on supported platforms (Greenhouse, Ashby, and Lever) so it can identify the role and fill in the application. To score how well a role fits you and to tailor your resume and responses for that role, your resume and profile are processed on our servers. The application itself is submitted from your own browser through the extension, directly to the employer's ATS. We store a record of the applications Persift prepares and submits so you can see them on your dashboard.</p>
          </Subsection>
          <Subsection title="Usage analytics (private beta)">
            <p>We collect aggregate usage metrics, such as how many applications were submitted in a session, to improve the product. We keep these in a form that is not tied to your identity.</p>
          </Subsection>
        </Section>

        <Section title="How we use your data">
          <ul>
            <li>To send you a confirmation email when you join the waitlist.</li>
            <li>To notify you when the private beta opens.</li>
            <li>To match you to roles and tailor your applications.</li>
            <li>To show your prepared and submitted applications on your dashboard.</li>
            <li>To prevent abuse, including rate limiting by IP address.</li>
          </ul>
          <p>We do not use your email for marketing beyond the messages above. We do not sell your data to anyone.</p>
        </Section>

        <Section title="Where your data is processed">
          <p>Your resume and profile are sent to our servers and to our AI provider so we can score role fit and tailor your applications. We send only what is needed for that task. The completed application is filled in and submitted on your own device through the Chrome extension, so the actual submission goes straight from your browser to the employer.</p>
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
                <tr><td>Upstash Redis</td><td>Rate limiting</td><td>Hashed IP</td></tr>
                <tr><td>Vercel</td><td>Hosting and serverless functions</td><td>IP address, request metadata</td></tr>
                <tr><td>Anthropic</td><td>Resume and application tailoring</td><td>Resume and profile content</td></tr>
              </tbody>
            </table>
          </div>
          <p>Each sub-processor has their own privacy policy. We have chosen services that are SOC 2 compliant or equivalent.</p>
        </Section>

        <Section title="Data retention">
          <p>Email addresses are retained until you request deletion or Persift is discontinued. Profile, resume, and application records are kept while your account is active and are deleted within 30 days of you closing your account or asking us to remove your data. Rate-limit records are automatically purged after 1 hour.</p>
        </Section>

        <Section title="Your rights">
          <p>You can ask us to:</p>
          <ul>
            <li>Delete your email, profile, resume, and application history.</li>
            <li>Tell you what data we hold about you.</li>
            <li>Correct anything that is wrong.</li>
          </ul>
          <p>To exercise any of these rights, email us at <a href="mailto:himanshujar911@gmail.com">himanshujar911@gmail.com</a>. We will respond within 7 days.</p>
        </Section>

        <Section title="Security">
          <p>We use reasonable measures to protect your data, including encrypted connections and access controls on our servers. No system is perfectly secure, so we cannot guarantee absolute security, but we work to keep your information safe and to limit what we collect in the first place.</p>
        </Section>

        <Section title="Cookies">
          <p>The persift.com landing page does not use tracking cookies. We use <code>localStorage</code> in the browser to remember whether you have already joined the waitlist, so you see a confirmation instead of the sign-up form on repeat visits. This data stays on your device and is never transmitted to our servers.</p>
        </Section>

        <Section title="Children">
          <p>Persift is not meant for anyone under 13, and we do not knowingly collect their information. If you believe a child has given us their data, email us and we will remove it.</p>
        </Section>

        <Section title="Changes to this policy">
          <p>We may update this policy as the product evolves. If we make material changes we will update the "Last updated" date above and, where feasible, notify you by email. Continued use of Persift after changes constitutes acceptance of the revised policy.</p>
        </Section>

        <Section title="Contact">
          <p>Questions about this policy? Email <a href="mailto:himanshujar911@gmail.com">himanshujar911@gmail.com</a>.</p>
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
