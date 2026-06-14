 Final Pre-Launch Pass

  I verified the claimed fixes against the actual code (not the log) and checked the launch-specific things prior rounds didn't. Build passes
  clean (tsc && vite build, exit 0, 363 kB JS / 112 kB gzipped — fine). Rate limiting, origin check, robots, sitemap, og-image (correct
  1200×630), JSON-LD, OG/Twitter tags, keyworded title — all real and correctly implemented. Good work.

  Three things to address before you flip it live, then a launch checklist.

  Launch-critical

  [Important] — The AI content is inside <noscript> — that's the one thing that undercuts the whole discoverability effort — index.html:66-110
  The static prose + FAQ is wrapped in <noscript>. This is a well-intentioned but wrong placement:
  - <noscript> content is shown/served only to clients with JavaScript disabled. Crawlers that do execute JS (Googlebot, increasingly Bing) will
  render your React app and never see the noscript block — they'll see the real page, so that's fine for them.
  - But crawlers that don't execute JS — which includes several AI crawlers — do read <noscript>, so they get the content. So it half-works.
  - The problem: it's a signal to search engines that this content is a no-JS fallback, not the primary content, and Google explicitly
  discourages using <noscript> to show content that differs from the rendered page (cloaking-adjacent). It also means your beautiful real page
  and your indexed text are two different things.

  The robust fix is to put that content in the real DOM (visually hidden with CSS, or better, as actual rendered page content), not <noscript>.
  Simplest safe change: move it out of <noscript> into a normal <div> inside #root's sibling or render it in the React tree as a visually-hidden
  <section> (clip-path/sr-only, like your h1), so every crawler — JS or not — sees identical content and there's no cloaking risk. Given your
  stack the pragmatic win: keep it static in index.html but outside <noscript>, visually hidden, before the React mount. This moves you from
  "half the crawlers" to "all of them" with zero cloaking flag.

  This is the highest-leverage launch item — it's the difference between the discoverability work paying off fully vs. partially.

  [Important] — No favicon wired — index.html (confirmed NO FAVICON LINK). You have public/icon.svg, apple-icon.png, icon-light/dark-32x32.png
  sitting there but index.html has no <link rel="icon">. On launch the browser tab shows a blank/default icon and shared links look unfinished.
  Two-line fix:
  <link rel="icon" href="/icon.svg" type="image/svg+xml" />
  <link rel="icon" type="image/png" sizes="32x32" href="/icon-light-32x32.png" />
  <link rel="apple-touch-icon" href="/apple-icon.png" />

  [Verify before launch — can't test from here] — Resend "from" domain must be verified, and the env vars must exist in Vercel prod. The code is
  correct, but launch depends on infra I can't see:
  - from: "himanshu@persift.com" (waitlist.ts:35) requires persift.com verified in Resend (SPF/DKIM). If not verified, every confirmation email
  silently fails → users join but get no email.
  - RESEND_API_KEY, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN must all be set in Vercel production env. Redis.fromEnv() (waitlist.ts:9)
  throws at module load if the Upstash vars are missing → the entire /api/waitlist function 500s, taking down email signup too. Test the deployed
  endpoint once with a real email before announcing.

  Worth fixing, not blocking

  [Medium] — og:image/twitter:image point to https://persift.com/og-image.png — absolute URL means it only works once deployed to that exact
  domain. Fine if persift.com is the launch domain. But if you soft-launch on a *.vercel.app preview URL, the OG image (and canonical) will 404 /
  point at the wrong host, so preview-link unfurls break. Just confirm you're launching on persift.com, or make these dynamic.

  [Medium] — Git hygiene: 78 untracked files, ~70 are loose screenshot PNGs at repo root (ss_*.png, v2_*.png, install_badge.png, lever_check.png,
  etc.). They're untracked so they won't deploy, but: (a) src/assets/desk.webp, src/hooks/useFitScale.ts, public/robots.txt, public/sitemap.xml,
  public/og-image.png are also untracked — meaning your actual launch fixes aren't committed yet. If you deploy from git, uncommitted = not
  shipped. Commit the real files; add the screenshot junk to .gitignore or delete it. This is a real "did my fixes actually deploy" risk.

  [Low] — lever_check.png is the one screenshot that IS tracked in git (from an earlier commit) — stray 1-off file in the repo. Minor cleanup.

  [Low] — Deferred items from the log are genuinely fine to defer: PersiftMark alt text (D3), LaunchList client exposure (S4), security headers
  (S5). For a waitlist brochure none are blockers. I'd still add X-Frame-Options: DENY / frame-ancestors 'none' to vercel.json someday so your
  form can't be iframed for clickjacking, but it's not launch-gating.

  Pre-launch checklist (the infra I can't verify — do these manually)

  1. ☐ Move AI content out of <noscript> → visually-hidden real DOM (the one code change that matters most).
  2. ☐ Add favicon links to index.html.
  3. ☐ Commit the untracked launch files (useFitScale.ts, desk.webp, public/robots.txt, sitemap.xml, og-image.png, updated index.html/api).
  Verify they're in the deploy.
  4. ☐ Verify persift.com in Resend (SPF/DKIM) — or confirmation emails fail silently.
  5. ☐ Set all 3 env vars in Vercel prod (RESEND_API_KEY, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN) — missing Upstash vars 500 the whole
  endpoint.
  6. ☐ Submit a real test email on the deployed site → confirm: row appears in Resend dashboard, email arrives, LaunchList records it, and a 6th
  rapid submit returns 429.
  7. ☐ Test the OG unfurl (paste persift.com into Slack/iMessage/X) once DNS is live.
  8. ☐ Confirm launch domain is persift.com (matches all the absolute URLs in OG/canonical/sitemap).

  Items 1–2 are quick code changes I can make right now. Want me to do #1 (move the content out of <noscript> into a visually-hidden section) and
  #2 (favicon links)? Those are the two code-side launch blockers; the rest (3–8) are infra/manual on your side.