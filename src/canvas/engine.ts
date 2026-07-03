import type { CalendarAdapter, CalendarData } from '../data/model.ts'
import { ZoomLUT, type ZoomConfig } from './zoom.ts'
import { drawGrid } from './grid.ts'
import { drawBlocks } from './blocks.ts'
import { drawOverlay } from './overlay.ts'
import {
  DAY_START_HOUR,
  DAY_END_HOUR,
  LABEL_WIDTH,
  TOP_PAD,
  CLOCK_ROW_HEIGHT,
  HOUR_ROW_HEIGHT,
  MIN_ROW_HEIGHT,
  COLORS,
} from './config.ts'

export interface EngineConfig {
  zoom: ZoomConfig
}

type FollowMode = 'realtime' | 'goto' | 'hold' | 'return'

export class CanvasEngine {
  private readonly canvas: HTMLCanvasElement
  private readonly ctx: CanvasRenderingContext2D
  private readonly zoom = new ZoomLUT()
  private readonly adapter: CalendarAdapter
  private data: CalendarData | null = null
  private animId = 0
  private prevTime = 0
  private offset = 0
  private holdUntil = 0
  private mode: FollowMode = 'realtime'
  private gotoFrom = 0
  private targetOffset = 0
  private gotoStart = 0
  private readonly gotoDuration = 600

  constructor(canvas: HTMLCanvasElement, adapter: CalendarAdapter, cfg: EngineConfig) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.adapter = adapter
    this.zoom.setConfig(cfg.zoom)

    const ro = new ResizeObserver(() => this.resize())
    ro.observe(canvas)
    this.resize()
    canvas.addEventListener('click', (e) => this.onClick(e))
  }

  private resize(): void {
    const dpr = window.devicePixelRatio || 1
    const rect = this.canvas.getBoundingClientRect()
    this.canvas.width = rect.width * dpr
    this.canvas.height = rect.height * dpr
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  async start(): Promise<void> {
    await this.fetchData()
    this.scheduleFrame()
  }

  stop(): void {
    if (this.animId) {
      cancelAnimationFrame(this.animId)
      this.animId = 0
    }
  }

  private onClick(e: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const tx = x - LABEL_WIDTH
    if (tx < 0) return

    const todayMidnight = todayMs()
    const t0 = todayMidnight + DAY_START_HOUR * 3_600_000
    const t1 = todayMidnight + DAY_END_HOUR * 3_600_000
    const clicked = Math.max(t0, Math.min(t1, this.zoom.invX(tx)))
    const now = Date.now()

    this.gotoFrom = this.offset
    this.targetOffset = clicked - now
    this.gotoStart = now
    this.mode = 'goto'
  }

  private async fetchData(): Promise<void> {
    try {
      const today = new Date()
      const date = today.toISOString().slice(0, 10)
      this.data = await this.adapter.fetch(date)
    } catch (err) {
      console.error('Failed to fetch calendar data:', err)
    }
    setTimeout(() => this.fetchData(), 60_000)
  }

  private scheduleFrame(): void {
    this.animId = requestAnimationFrame(() => this.frame())
  }

  private frame(): void {
    const now = Date.now()
    const dt = this.prevTime ? (now - this.prevTime) / 1000 : 0.016
    this.prevTime = now

    if (this.mode === 'goto') {
      const elapsed = now - this.gotoStart
      const t = Math.min(1, elapsed / this.gotoDuration)
      const eased = 1 - Math.pow(1 - t, 3)
      this.offset = this.gotoFrom + (this.targetOffset - this.gotoFrom) * eased
      if (t >= 1) {
        this.mode = 'hold'
        this.holdUntil = now + 10000
      }
    }
    if (this.mode === 'hold' && now >= this.holdUntil) {
      this.mode = 'return'
    }
    if (this.mode === 'return') {
      this.offset *= Math.exp(-dt * 3)
      if (Math.abs(this.offset) < 50) {
        this.offset = 0
        this.mode = 'realtime'
      }
    }

    const displayTime = now + this.offset
    const todayMidnight = todayMs()
    const t0 = todayMidnight + DAY_START_HOUR * 3_600_000
    const t1 = todayMidnight + DAY_END_HOUR * 3_600_000

    const w = this.canvas.width / (window.devicePixelRatio || 1)
    const h = this.canvas.height / (window.devicePixelRatio || 1)
    const timelineWidth = Math.max(1, w - LABEL_WIDTH)

    this.zoom.build(t0, t1, displayTime, timelineWidth)

    const members = this.data?.members ?? []
    const events = this.data?.events ?? []
    const userIdOrder = members.map((m) => m.id)

    const reservedV = TOP_PAD + CLOCK_ROW_HEIGHT + HOUR_ROW_HEIGHT
    const availableH = h - reservedV
    const rowHeight = members.length > 0
      ? Math.max(MIN_ROW_HEIGHT, Math.floor(availableH / members.length))
      : MIN_ROW_HEIGHT

    const ctx = this.ctx
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = COLORS.bg
    ctx.fillRect(0, 0, w, h)

    drawGrid(ctx, members, events, this.zoom, w, rowHeight, displayTime)
    if (events.length > 0) {
      drawBlocks(ctx, events, this.zoom, w, userIdOrder, rowHeight, displayTime)
    }
    drawOverlay(ctx, this.zoom, w, h, displayTime)

    this.scheduleFrame()
  }
}

function todayMs(): number {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
}
