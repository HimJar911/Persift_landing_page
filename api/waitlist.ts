import type { VercelRequest, VercelResponse } from "@vercel/node"
import { Resend } from "resend"
import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"

const resend = new Resend(process.env.RESEND_API_KEY)
const redis = Redis.fromEnv()

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  prefix: "persift_waitlist",
})

function makeRefCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end()

  const origin = req.headers.origin
  if (origin && !["https://persift.com", "https://www.persift.com"].includes(origin)) {
    return res.status(403).json({ error: "forbidden" })
  }

  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ?? "unknown"
  const { success } = await ratelimit.limit(ip)
  if (!success) return res.status(429).json({ error: "too_many_requests" })

  const body = req.body as { email?: string; ref?: string }
  const raw = body?.email
  const email = String(raw ?? "").trim().toLowerCase().slice(0, 254)
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email" })
  }

  // Generate a referral code for this user (idempotent — reuse if already exists)
  let refCode = await redis.get<string>(`refcode:${email}`)
  if (!refCode) {
    refCode = makeRefCode()
    await redis.set(`refcode:${email}`, refCode)
    await redis.set(`ref:${refCode}`, email)
  }
  const refLink = `https://persift.com/?ref=${refCode}`

  // Credit the referrer if a valid ref code was passed
  const inboundRef = String(body?.ref ?? "").trim().slice(0, 20)
  if (inboundRef && inboundRef !== refCode) {
    const referrerEmail = await redis.get<string>(`ref:${inboundRef}`)
    if (referrerEmail && referrerEmail !== email) {
      await redis.incr(`refcount:${referrerEmail}`)
      await redis.set(`refby:${email}`, referrerEmail)
      // Notify the referrer
      resend.emails.send({
        headers: { "X-Entity-Ref-ID": `referral-${email}` },
        from: "Himanshu at Persift <himanshu@persift.com>",
        replyTo: "hjarodiy@asu.edu",
        to: referrerEmail,
        subject: "Someone joined Persift using your link",
        html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0c0a08;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0c0a08;padding:48px 24px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">
        <tr><td style="padding-bottom:32px;">
          <span style="font-family:Inter,sans-serif;font-size:18px;font-weight:700;color:#f3ece1;letter-spacing:-0.02em;">Persift</span>
        </td></tr>
        <tr><td style="padding-bottom:16px;">
          <p style="margin:0;font-family:Georgia,serif;font-size:28px;font-weight:400;color:#f3ece1;line-height:1.1;letter-spacing:-0.02em;">
            Someone used your link.
          </p>
        </td></tr>
        <tr><td style="padding-bottom:24px;">
          <div style="height:1px;background:rgba(240,163,65,0.25);"></div>
        </td></tr>
        <tr><td style="padding-bottom:32px;">
          <p style="margin:0;font-family:Inter,sans-serif;font-size:15px;color:rgba(243,236,225,0.65);line-height:1.7;">
            A friend just joined the Persift waitlist using your referral link. You've moved up the queue.
          </p>
          <p style="margin:16px 0 0;font-family:Inter,sans-serif;font-size:15px;color:rgba(243,236,225,0.65);line-height:1.7;">
            Keep sharing to move up further.
          </p>
        </td></tr>
        <tr><td style="padding-bottom:32px;">
          <p style="margin:0;font-family:Inter,sans-serif;font-size:13px;color:rgba(243,236,225,0.4);">Your link</p>
          <a href="${`https://persift.com/?ref=${inboundRef}`}" style="font-family:Inter,sans-serif;font-size:14px;color:#f0a341;text-decoration:none;">${`https://persift.com/?ref=${inboundRef}`}</a>
        </td></tr>
        <tr><td style="padding-bottom:48px;">
          <p style="margin:0;font-family:Inter,sans-serif;font-size:13px;color:rgba(243,236,225,0.3);">Himanshu, founder of Persift</p>
        </td></tr>
        <tr><td>
          <p style="margin:0;font-family:Inter,sans-serif;font-size:11px;color:rgba(243,236,225,0.2);line-height:1.6;">
            You're receiving this because you signed up at persift.com.<br>Reply to this email if you have questions.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
      }).catch((err) => console.error("Referrer notification error:", err))
    }
  }

  try {
    await resend.emails.send({
    headers: { "X-Entity-Ref-ID": email },
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

        <tr><td style="padding-bottom:32px;">
          <span style="font-family:Inter,sans-serif;font-size:18px;font-weight:700;color:#f3ece1;letter-spacing:-0.02em;">Persift</span>
        </td></tr>

        <tr><td style="padding-bottom:16px;">
          <p style="margin:0;font-family:Georgia,serif;font-size:32px;font-weight:400;color:#f3ece1;line-height:1.1;letter-spacing:-0.02em;">
            You're on the list.
          </p>
        </td></tr>

        <tr><td style="padding-bottom:24px;">
          <div style="height:1px;background:rgba(240,163,65,0.25);"></div>
        </td></tr>

        <tr><td style="padding-bottom:32px;">
          <p style="margin:0;font-family:Inter,sans-serif;font-size:15px;color:rgba(243,236,225,0.65);line-height:1.7;">
            Persift finds early-career roles before they hit LinkedIn, tailors your resume to each one, and submits applications automatically.
          </p>
          <p style="margin:16px 0 0;font-family:Inter,sans-serif;font-size:15px;color:rgba(243,236,225,0.65);line-height:1.7;">
            We'll reach out personally when the private beta opens.
          </p>
        </td></tr>

        <tr><td style="padding-bottom:8px;">
          <p style="margin:0;font-family:Inter,sans-serif;font-size:13px;font-weight:600;color:rgba(243,236,225,0.5);letter-spacing:0.06em;text-transform:uppercase;">Move up the queue</p>
        </td></tr>
        <tr><td style="padding-bottom:32px;">
          <p style="margin:0 0 10px;font-family:Inter,sans-serif;font-size:14px;color:rgba(243,236,225,0.55);line-height:1.6;">
            Each friend who joins using your link moves you up. Share yours:
          </p>
          <a href="${refLink}" style="display:inline-block;font-family:Inter,sans-serif;font-size:14px;color:#f0a341;text-decoration:none;background:rgba(240,163,65,0.08);border:1px solid rgba(240,163,65,0.25);border-radius:8px;padding:10px 16px;">${refLink}</a>
        </td></tr>

        <tr><td style="padding-bottom:32px;">
          <p style="margin:0;font-family:Georgia,serif;font-style:italic;font-size:17px;color:#f0a341;line-height:1.4;">
            Stop applying. Start waking up to interviews.
          </p>
        </td></tr>

        <tr><td style="padding-bottom:48px;">
          <p style="margin:0;font-family:Inter,sans-serif;font-size:13px;color:rgba(243,236,225,0.3);">
            Himanshu, founder of Persift
          </p>
        </td></tr>

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
  } catch (err) {
    console.error("Resend error:", err)
    return res.status(502).json({ error: "email_failed" })
  }

  return res.status(200).json({ ok: true })
}
