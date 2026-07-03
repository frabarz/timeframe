const LUT_STEP = 1000

export interface ZoomConfig {
  zoomFactor: number
  sigmaMs: number
}

export class ZoomLUT {
  private t0 = 0
  private t1 = 0
  private lut = new Float64Array(0)
  private timelineWidth = 0
  private zoomFactor = 5
  private sigmaMs = 1_800_000

  setConfig(cfg: ZoomConfig): void {
    this.zoomFactor = cfg.zoomFactor
    this.sigmaMs = cfg.sigmaMs
  }

  private lastBuildTc = 0

  build(t0: number, t1: number, tc: number, timelineWidth: number): void {
    if (
      t0 === this.t0 &&
      t1 === this.t1 &&
      Math.abs(tc - this.lastBuildTc) < 1000 &&
      timelineWidth === this.timelineWidth
    ) {
      return
    }
    this.lastBuildTc = tc
    this.t0 = t0
    this.t1 = t1
    this.timelineWidth = timelineWidth

    const range = t1 - t0
    if (range <= 0 || timelineWidth <= 0) {
      this.lut = new Float64Array(0)
      return
    }

    const steps = Math.ceil(range / LUT_STEP) + 1
    const lut = new Float64Array(steps)
    const denom = -2 * this.sigmaMs * this.sigmaMs

    let rawSum = 0
    for (let i = 0; i < steps; i++) {
      const t = t0 + i * LUT_STEP
      const dt = t - tc
      const g = Math.exp((dt * dt) / denom)
      rawSum += (this.zoomFactor * g + 1) * (i === 0 ? 0 : LUT_STEP)
      lut[i] = rawSum
    }

    const scale = lut[steps - 1] > 0 ? timelineWidth / lut[steps - 1] : 1
    for (let i = 0; i < steps; i++) {
      lut[i] *= scale
    }

    this.lut = lut
  }

  x(t: number): number {
    const i = Math.floor((t - this.t0) / LUT_STEP)
    if (i < 0) return 0
    if (i >= this.lut.length - 1) return this.timelineWidth
    const frac = ((t - this.t0) % LUT_STEP) / LUT_STEP
    return this.lut[i] + frac * (this.lut[i + 1] - this.lut[i])
  }

  invX(x: number): number {
    if (x <= 0) return this.t0
    if (x >= this.timelineWidth) return this.t1
    let lo = 0
    let hi = this.lut.length - 1
    while (lo < hi - 1) {
      const mid = (lo + hi) >> 1
      if (this.lut[mid] <= x) lo = mid
      else hi = mid
    }
    const frac = (x - this.lut[lo]) / (this.lut[hi] - this.lut[lo] || 1)
    return this.t0 + (lo + frac) * LUT_STEP
  }
}
