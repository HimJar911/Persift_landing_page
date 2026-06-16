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

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com","guerrillamail.com","guerrillamail.net","guerrillamail.org","guerrillamail.de",
  "guerrillamail.biz","guerrillamail.info","sharklasers.com","guerrillamailblock.com","grr.la",
  "guerrillamail.co.uk","spam4.me","trashmail.com","trashmail.me","trashmail.net","trashmail.at",
  "trashmail.io","trashmail.org","trashmail.xyz","tempmail.com","temp-mail.org","temp-mail.io",
  "throwam.com","throwam.info","throwam.net","yopmail.com","yopmail.fr","cool.fr.nf","jetable.fr.nf",
  "nospam.ze.tc","nomail.xl.cx","mega.zik.dj","speed.1s.fr","courriel.fr.nf","moncourrier.fr.nf",
  "monemail.fr.nf","monmail.fr.nf","10minutemail.com","10minutemail.net","10minutemail.org",
  "10minutemail.us","10minutemail.co.uk","10minutemail.de","10minutemail.ru","10minutemail.info",
  "10minutemail.be","10minutemail.nl","10minutemail.ca","10minutemail.eu","10minutemail.lt",
  "10minemail.com","dispostable.com","mailnesia.com","mailnull.com","spamgourmet.com",
  "spamgourmet.net","spamgourmet.org","spamgourmet.us","spamgourmet.co.uk","spamgourmet.de",
  "fakeinbox.com","fakeinbox.net","maildrop.cc","spamfree24.org","spamfree24.de","spamfree24.eu",
  "spamfree24.com","spamfree24.net","spamfree24.info","spamfree24.ru","mailexpire.com",
  "throwam.com","jetable.org","nospamfor.us","spam.la","tempinbox.com",
  "tempinbox.co.uk","tempr.email","discard.email","filzmail.com","tempomail.fr","boxtemp.com.br",
  "wegwerfmail.de","wegwerfmail.net","wegwerfmail.org","getnada.com","binkmail.com",
  "harakirimail.com","mt2009.com","mt2014.com","spamex.com","spamex.net","spam.abuse.ch",
  "dispostable.com","mailnesia.com","mailnull.com","spamevader.com","dispostable.com",
  "mohmal.com","bugmenot.com","mailcatch.com","mailnull.com","meltmail.com","spamevader.com",
  "spam.su","spam.dk","spam.be","spam.nl","spam.com","spam.net","spam.uk.net","spam.org",
  "spamspot.com","spamspot.info","spamspot.com.au","spamspot.co.uk","spamspot.de",
  "nowmymail.com","mymailinbox.com","sogetthis.com","suremail.info","spamtest.com",
])

function isDisposable(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase()
  if (!domain) return false
  return DISPOSABLE_DOMAINS.has(domain)
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

  const body = req.body as { email?: string; website?: string }
  if (body?.website) return res.status(200).json({ ok: true })

  const raw = body?.email
  const email = String(raw ?? "").trim().toLowerCase().slice(0, 254)
  if (!email || !/^[^\s@]+@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/.test(email)) {
    return res.status(400).json({ error: "Invalid email" })
  }

  if (isDisposable(email)) {
    return res.status(400).json({ error: "Please use a real email address." })
  }

  // Fire-and-forget LaunchList signup
  fetch("https://app.launchlist.co/api/v1/subscribers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, list_id: process.env.LAUNCHLIST_LIST_ID }),
  }).catch((err) => console.error("LaunchList error:", err))

  const plainText = `You're in — Persift

Your job search now runs itself.

Persift finds early-career roles before they hit LinkedIn, tailors your resume to each one, and submits applications automatically. You focus on what matters — Persift handles the rest.

I'll reach out personally when your spot opens.

— Himanshu, founder of Persift

---
You're receiving this because you signed up at persift.com.
Reply to this email if you have questions.`

  try {
    await resend.emails.send({
      headers: {
        "X-Entity-Ref-ID": email,
        "Precedence": "transactional",
      },
      from: "Himanshu at Persift <himanshu@persift.com>",
      replyTo: "hjarodiy@asu.edu",
      to: email,
      subject: "You're in — Persift",
      text: plainText,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
</head>
<body style="margin:0;padding:0;background:#f5f0e8;">
  <span style="display:none;max-height:0;overflow:hidden;mso-hide:all;">Your job search now runs itself — Persift is on it.</span>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:48px 24px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">

        <!-- Header -->
        <tr><td style="padding:32px 40px 24px;text-align:center;">
          <img src="https://persift.com/wordmark.png" width="150" height="45" alt="Persift" style="display:inline-block;border:0;" />
        </td></tr>

        <!-- Divider -->
        <tr><td style="padding:0 40px;">
          <div style="height:1px;background:#e8e0d4;"></div>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px 40px 16px;">
          <p style="margin:0 0 20px;font-family:Georgia,serif;font-size:28px;font-weight:400;color:#1a1206;line-height:1.15;letter-spacing:-0.01em;">
            Your job search now runs itself.
          </p>
          <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#4a3f2f;line-height:1.7;">
            Persift finds early-career roles before they hit LinkedIn, tailors your resume to each one, and submits applications automatically. You focus on what matters — Persift handles the rest.
          </p>
          <p style="margin:0 0 32px;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#4a3f2f;line-height:1.7;">
            I'll reach out personally when your spot opens.
          </p>
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;color:#1a1206;">
            Himanshu
          </p>
          <p style="margin:4px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#7a6a54;">
            Founder, Persift
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 40px 32px;">
          <div style="height:1px;background:#e8e0d4;margin-bottom:20px;"></div>
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#a09080;line-height:1.6;">
            You're receiving this because you signed up at <a href="https://persift.com" style="color:#a09080;">persift.com</a>.<br>
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
