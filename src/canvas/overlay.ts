import type { ZoomLUT } from "./zoom.ts";
import { LABEL_WIDTH, TOP_PAD, CLOCK_ROW_HEIGHT, COLORS, FONTS } from "./config.ts";

export function drawOverlay(
  ctx: CanvasRenderingContext2D,
  zoom: ZoomLUT,
  width: number,
  height: number,
  now: number,
): void {
  const tx = LABEL_WIDTH + zoom.x(now);

  const hourRowY = TOP_PAD + CLOCK_ROW_HEIGHT;
  const dotR = 4;
  ctx.beginPath();
  ctx.arc(tx, hourRowY - dotR, dotR, 0, Math.PI * 2);
  ctx.fillStyle = COLORS.timeIndicator;
  ctx.fill();

  ctx.strokeStyle = COLORS.timeIndicator;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(tx, hourRowY);
  ctx.lineTo(tx, height);
  ctx.stroke();

  const clockText = formatClock(now);
  ctx.font = FONTS.clock;
  ctx.textBaseline = "alphabetic";
  const hm = ctx.measureText(clockText);
  const cPad = 14;
  const cW = hm.width + cPad * 2;
  const cH = CLOCK_ROW_HEIGHT - 8;
  const cY = TOP_PAD + 4;
  const minX = LABEL_WIDTH + cW / 2 + 4;
  const maxX = width - cW / 2 - 4;
  const cX = Math.max(minX, Math.min(tx, maxX));

  ctx.fillStyle = COLORS.clockBg;
  ctx.beginPath();
  ctx.roundRect(cX - cW / 2, cY, cW, cH, 6);
  ctx.fill();

  const visualMidY = cY + cH / 2;
  ctx.fillStyle = COLORS.clockText;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(
    clockText,
    cX,
    Math.round(visualMidY + (hm.actualBoundingBoxAscent - hm.actualBoundingBoxDescent) / 2),
  );
}

function formatClock(ms: number): string {
  const d = new Date(ms);
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;
}
