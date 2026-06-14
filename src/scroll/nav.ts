let _jumpToStep: ((i: number) => void) | null = null

export function registerJumpToStep(fn: (i: number) => void) {
  _jumpToStep = fn
}

export function jumpToCtaScene() {
  _jumpToStep?.(8)
}
