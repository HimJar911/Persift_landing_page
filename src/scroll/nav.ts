let _jumpToStep: ((i: number, bandOffset?: number) => void) | null = null

export function registerJumpToStep(fn: (i: number, bandOffset?: number) => void) {
  _jumpToStep = fn
}

export function jumpToCtaScene() {
  if (window.innerWidth > 900 && _jumpToStep) {
    _jumpToStep(7)
  } else {
    document.getElementById("mobile-cta")?.scrollIntoView({ behavior: "smooth" })
  }
}

export function jumpToScene(i: number, bandOffset?: number) {
  _jumpToStep?.(i, bandOffset)
}
