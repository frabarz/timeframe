import type { CalendarEvent, TeamMember } from '../data/model.ts'
import type { ZoomLUT } from './zoom.ts'
import { DAY_START_HOUR, DAY_END_HOUR, LABEL_WIDTH, TOP_PAD, CLOCK_ROW_HEIGHT, HOUR_ROW_HEIGHT, COLORS, FONTS } from './config.ts'

function fmtDur(totalMin: number): string {
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  return h > 0 ? `${h}h${m > 0 ? m + "m" : ""}` : `${m}m`
}

function memberStatus(events: CalendarEvent[], userId: string, now: number): string {
  const userEvents = events.filter((e) => e.userId === userId)
  const current = userEvents.find((e) => e.startTime <= now && now < e.endTime)
  if (current) {
    const rem = Math.round((current.endTime - now) / 60000)
    if (rem < 1) return "Busy..."
    return `Busy ${fmtDur(rem)}`
  }
  const next = userEvents.find((e) => e.startTime > now)
  if (!next) return "Free rest of day"
  const until = Math.round((next.startTime - now) / 60000)
  if (until < 1) return "Free..."
  return `Free ${fmtDur(until)}`
}

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  members: TeamMember[],
  events: CalendarEvent[],
  zoom: ZoomLUT,
  width: number,
  rowHeight: number,
  now: number,
): void {
  const xStart = LABEL_WIDTH
  const rowCount = members.length
  const clockRowBottom = TOP_PAD + CLOCK_ROW_HEIGHT
  const hourRowY = clockRowBottom
  const hourRowBottom = hourRowY + HOUR_ROW_HEIGHT
  const firstMemberY = hourRowBottom
  const contentBottom = firstMemberY + rowCount * rowHeight

  ctx.fillStyle = COLORS.zebraEven
  ctx.fillRect(0, TOP_PAD, width, CLOCK_ROW_HEIGHT)

  ctx.fillStyle = COLORS.bg
  ctx.fillRect(0, hourRowY, width, HOUR_ROW_HEIGHT)

  for (let i = 0; i < rowCount; i++) {
    const y = firstMemberY + i * rowHeight
    ctx.fillStyle = i % 2 === 0 ? COLORS.zebraEven : COLORS.zebraOdd
    ctx.fillRect(xStart, y, width - xStart, rowHeight)
  }

  for (let i = 0; i < rowCount; i++) {
    const y = firstMemberY + i * rowHeight
    ctx.fillStyle = i % 2 === 0 ? COLORS.zebraEven : COLORS.zebraOdd
    ctx.fillRect(0, y, LABEL_WIDTH, rowHeight)
  }

  const workStart = todayMs() + DAY_START_HOUR * 3_600_000
  const workEnd = todayMs() + DAY_END_HOUR * 3_600_000
  const inWorkHours = workStart <= now && now < workEnd

  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  for (let i = 0; i < rowCount; i++) {
    const y = firstMemberY + i * rowHeight
    ctx.font = FONTS.label
    ctx.fillStyle = COLORS.labelText
    ctx.fillText(members[i].name, LABEL_WIDTH - 12, y + rowHeight * 0.35)

    if (inWorkHours) {
      ctx.font = FONTS.availability
      ctx.fillStyle = COLORS.gridLabel
      ctx.fillText(memberStatus(events, members[i].id, now), LABEL_WIDTH - 12, y + rowHeight * 0.62)
    }
  }

  ctx.strokeStyle = COLORS.gridLine
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, firstMemberY)
  ctx.lineTo(width, firstMemberY)
  ctx.stroke()

  for (let h = DAY_START_HOUR; h <= DAY_END_HOUR; h++) {
    const t = todayMs() + h * 3_600_000
    const x = LABEL_WIDTH + zoom.x(t)
    if (x < LABEL_WIDTH || x > width) continue

    ctx.beginPath()
    ctx.moveTo(x, hourRowY)
    ctx.lineTo(x, contentBottom)
    ctx.stroke()

    ctx.fillStyle = COLORS.gridLabel
    ctx.font = FONTS.timeMarker
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const label = `${h.toString().padStart(2, '0')}:00`
    ctx.fillText(label, x, hourRowY + HOUR_ROW_HEIGHT / 2)
  }
}

function todayMs(): number {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
}
