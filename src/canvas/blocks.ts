import type { CalendarEvent } from '../data/model.ts'
import { EventType } from '../data/model.ts'
import type { ZoomLUT } from './zoom.ts'
import { LABEL_WIDTH, TOP_PAD, CLOCK_ROW_HEIGHT, HOUR_ROW_HEIGHT, COLORS, FONTS } from './config.ts'

const BORDER_RADIUS = 6
const BLOCK_PAD = 4
const TEXT_PAD = 8

function eventColors(type: EventType) {
  switch (type) {
    case EventType.Meeting: return COLORS.event.meeting
    case EventType.Focus: return COLORS.event.focus
    case EventType.OutOfOffice: return COLORS.event.ooo
  }
}

function truncateText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (maxWidth <= 0) return ''
  const ellipsis = '\u2026'
  if (ctx.measureText(text).width <= maxWidth) return text
  let lo = 0
  let hi = text.length
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1
    if (ctx.measureText(text.slice(0, mid) + ellipsis).width <= maxWidth) {
      lo = mid
    } else {
      hi = mid - 1
    }
  }
  return text.slice(0, lo) + ellipsis
}

export function drawBlocks(
  ctx: CanvasRenderingContext2D,
  events: CalendarEvent[],
  zoom: ZoomLUT,
  width: number,
  userIdOrder: string[],
  rowHeight: number,
  now: number,
): void {
  ctx.font = FONTS.eventTitle

  for (const ev of events) {
    const userIdx = userIdOrder.indexOf(ev.userId)
    if (userIdx === -1) continue

    const blockX = LABEL_WIDTH + zoom.x(ev.startTime)
    const blockW = zoom.x(ev.endTime) - zoom.x(ev.startTime)

    if (blockX + blockW < LABEL_WIDTH || blockX > width) continue
    if (blockW < 2) continue

    const rowY = TOP_PAD + CLOCK_ROW_HEIGHT + HOUR_ROW_HEIGHT + userIdx * rowHeight
    const blockY = rowY + BLOCK_PAD
    const blockH = rowHeight - BLOCK_PAD * 2
    const colors = eventColors(ev.type)

    const isActive = ev.startTime <= now && now < ev.endTime

    ctx.beginPath()
    ctx.roundRect(blockX, blockY, blockW, blockH, BORDER_RADIUS)
    ctx.fillStyle = isActive ? colors.border : colors.bg
    ctx.fill()

    ctx.strokeStyle = isActive ? colors.text : colors.border
    ctx.lineWidth = isActive ? 2 : 1
    ctx.stroke()

    ctx.save()
    ctx.beginPath()
    ctx.roundRect(blockX, blockY, blockW, blockH, BORDER_RADIUS)
    ctx.clip()

    ctx.fillStyle = colors.text
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    const textMaxW = blockW - TEXT_PAD * 2
    if (textMaxW > 8) {
      const label = truncateText(ctx, ev.title, textMaxW)
      ctx.fillText(label, blockX + TEXT_PAD, blockY + blockH / 2)
    }
    ctx.restore()
  }
}
