import type { VercelRequest, VercelResponse } from "@vercel/node"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end()

  const { email } = req.body as { email?: string }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email" })
  }

  // Send confirmation email via Resend
  await resend.emails.send({
    headers: { "X-Entity-Ref-ID": email.toLowerCase() },
    from: "Himanshu at Persift <himanshu@persift.com>",
    replyTo: "hjarodiy@asu.edu",
    to: email,
    subject: "You're on the Persift waitlist",
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0c0a08;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0c0a08;padding:48px 24px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">

        <!-- Logo -->
        <tr><td style="padding-bottom:32px;">
          <span style="font-family:Inter,sans-serif;font-size:18px;font-weight:700;color:#f3ece1;letter-spacing:-0.02em;">Persift</span>
        </td></tr>

        <!-- Headline -->
        <tr><td style="padding-bottom:16px;">
          <p style="margin:0;font-family:Georgia,serif;font-size:32px;font-weight:400;color:#f3ece1;line-height:1.1;letter-spacing:-0.02em;">
            You're on the list.
          </p>
        </td></tr>

        <!-- Divider -->
        <tr><td style="padding-bottom:24px;">
          <div style="height:1px;background:rgba(240,163,65,0.25);"></div>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding-bottom:32px;">
          <p style="margin:0;font-family:Inter,sans-serif;font-size:15px;color:rgba(243,236,225,0.65);line-height:1.7;">
            Persift finds early-career roles before they hit LinkedIn, tailors your resume to each one, and submits applications — automatically.
          </p>
          <p style="margin:16px 0 0;font-family:Inter,sans-serif;font-size:15px;color:rgba(243,236,225,0.65);line-height:1.7;">
            We'll reach out personally when the private beta opens.
          </p>
        </td></tr>

        <!-- Amber accent line -->
        <tr><td style="padding-bottom:32px;">
          <p style="margin:0;font-family:Georgia,serif;font-style:italic;font-size:17px;color:#f0a341;line-height:1.4;">
            Stop applying. Start waking up to interviews.
          </p>
        </td></tr>

        <!-- Signature -->
        <tr><td style="padding-bottom:48px;">
          <p style="margin:0;font-family:Inter,sans-serif;font-size:13px;color:rgba(243,236,225,0.3);">
            — Himanshu, founder of Persift
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td>
          <p style="margin:0;font-family:Inter,sans-serif;font-size:11px;color:rgba(243,236,225,0.2);line-height:1.6;">
            You're receiving this because you signed up at persift.com.<br>
            Reply to this email if you have questions.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
  })

  return res.status(200).json({ ok: true })
}
