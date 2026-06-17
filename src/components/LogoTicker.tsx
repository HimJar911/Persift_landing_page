import airbnbSrc from "../assets/logos/airbnb-wordmark.svg"
import cloudflareSrc from "../assets/logos/cloudflare.svg"
import dropboxSrc from "../assets/logos/dropbox_wordmark_dark.svg"
import figmaSrc from "../assets/logos/figma.svg"
import linkedinSrc from "../assets/logos/linkedin.svg"
import notionSrc from "../assets/logos/notion.svg"
import shopifySrc from "../assets/logos/shopify-wordmark-dark.svg"
import slackSrc from "../assets/logos/slack-wordmark.svg"
import spotifySrc from "../assets/logos/spotify_wordmark.svg"
import stripeSrc from "../assets/logos/stripe_wordmark.svg"
import twitchSrc from "../assets/logos/twitch.svg"
import uberSrc from "../assets/logos/uber_dark.svg"
import vercelSrc from "../assets/logos/Vercel_wordmark_dark.svg"

type LogoEntry = {
  src: string
  alt: string
  height: number
  invert?: boolean
}

const LOGOS: LogoEntry[] = [
  { src: stripeSrc,     alt: "Stripe",     height: 22, invert: true },
  { src: figmaSrc,      alt: "Figma",      height: 22, invert: true },
  { src: vercelSrc,     alt: "Vercel",     height: 18 },
  { src: airbnbSrc,     alt: "Airbnb",     height: 22, invert: true },
  { src: notionSrc,     alt: "Notion",     height: 22 },
  { src: slackSrc,      alt: "Slack",      height: 22, invert: true },
  { src: spotifySrc,    alt: "Spotify",    height: 20 },
  { src: uberSrc,       alt: "Uber",       height: 20 },
  { src: dropboxSrc,    alt: "Dropbox",    height: 22, invert: true },
  { src: twitchSrc,     alt: "Twitch",     height: 22 },
  { src: cloudflareSrc, alt: "Cloudflare", height: 24 },
  { src: linkedinSrc,   alt: "LinkedIn",   height: 22, invert: true },
  { src: shopifySrc,    alt: "Shopify",    height: 24, invert: true },
]

export function LogoTicker() {
  const items = [...LOGOS, ...LOGOS]

  return (
    <div style={{
      width: "100%",
      borderRadius: 14,
      background: "#181410",
      border: "1px solid rgba(243,236,225,0.08)",
      padding: "18px 0",
      overflow: "hidden",
      position: "relative",
      transform: "translateZ(0)",
    }}>
      {/* left fade */}
      <div style={{
        position: "absolute",
        left: 0, top: 0, bottom: 0,
        width: 60,
        background: "linear-gradient(to right, #181410, transparent)",
        zIndex: 2,
        pointerEvents: "none",
      }} />
      {/* right fade */}
      <div style={{
        position: "absolute",
        right: 0, top: 0, bottom: 0,
        width: 60,
        background: "linear-gradient(to left, #181410, transparent)",
        zIndex: 2,
        pointerEvents: "none",
      }} />

      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 44,
        animation: "ticker-scroll 22s linear infinite",
        width: "max-content",
        paddingLeft: 24,
      }}>
        {items.map((logo, i) => (
          <img
            key={`${logo.alt}-${i}`}
            src={logo.src}
            alt={logo.alt}
            height={logo.height}
            draggable={false}
            style={{
              height: logo.height,
              width: "auto",
              flexShrink: 0,
              opacity: 0.7,
              filter: logo.invert ? "brightness(0) invert(1)" : undefined,
              userSelect: "none",
            }}
          />
        ))}
      </div>
    </div>
  )
}
