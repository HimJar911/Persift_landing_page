import type { VercelRequest, VercelResponse } from "@vercel/node"
import { Resend } from "resend"

const LAUNCHLIST_URL = "https://getlaunchlist.com/s/vvpphU"
const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end()

  const { email } = req.body as { email?: string }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email" })
  }

  // Submit to LaunchList
  const llRes = await fetch(LAUNCHLIST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ email }).toString(),
  })
  if (!llRes.ok) return res.status(502).json({ error: "LaunchList error" })

  // Send confirmation email via Resend
  await resend.emails.send({
    from: "Himanshu at Persift <himanshu@persift.com>",
    replyTo: "hjarodiy@asu.edu",
    to: email,
    subject: "You're on the Persift waitlist",
    html: `
      <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;background:#0c0a08;color:#f3ece1;">
        <p style="font-size:24px;font-weight:700;margin:0 0 16px;">You're on the list.</p>
        <p style="font-size:15px;color:rgba(243,236,225,0.7);line-height:1.6;margin:0 0 24px;">
          Persift finds early-career roles before they hit LinkedIn, tailors your resume, and applies — automatically.
          We'll reach out when the private beta opens.
        </p>
        <p style="font-size:13px;color:rgba(243,236,225,0.35);margin:0;">
          — Himanshu, founder of Persift
        </p>
      </div>
    `,
  })

  return res.status(200).json({ ok: true })
}
