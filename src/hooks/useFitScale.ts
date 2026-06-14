import { useEffect, useRef, useState } from "react"

export function useFitScale(padding = 24) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const currentScale = useRef(1)

  useEffect(() => {
    const container = containerRef.current
    const content = contentRef.current
    if (!container || !content) return

    let rafId: number

    function measure() {
      const availH = container!.clientHeight - padding * 2
      const naturalH = content!.scrollHeight
      const next = Math.min(1, availH / naturalH)
      if (Math.abs(next - currentScale.current) > 0.005) {
        currentScale.current = next
        setScale(next)
      }
    }

    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(measure)
    })

    ro.observe(container)

    document.fonts.ready.then(() => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(measure)
    })

    return () => {
      ro.disconnect()
      cancelAnimationFrame(rafId)
    }
  }, [padding])

  return { containerRef, contentRef, scale }
}
