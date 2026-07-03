export const DAY_START_HOUR = 8;
export const DAY_END_HOUR = 18;
export const LABEL_WIDTH = 120;
export const MIN_ROW_HEIGHT = 40;
export const TOP_PAD = 8;
export const CLOCK_ROW_HEIGHT = 96;
export const HOUR_ROW_HEIGHT = 22;

export const COLORS = {
  bg: "#0f0f1a",
  zebraEven: "#1a1a2e",
  zebraOdd: "#151525",
  gridLine: "#2a2a3e",
  gridLabel: "#6b7280",
  labelText: "#e5e7eb",
  timeIndicator: "#ef4444",
  clockBg: "rgba(15,15,26,0)",
  clockText: "#ffffff",
  eventBorder: "rgba(255,255,255,0.08)",
  event: {
    meeting: { bg: "#1e3a5f", border: "#4A90D9", text: "#e0f2fe" },
    focus: { bg: "#2e1065", border: "#7B61FF", text: "#ede9fe" },
    ooo: { bg: "#4c0519", border: "#E57373", text: "#ffe4e6" },
  },
} as const;

export const FONTS = {
  label: "500 14px Jetbrains Mono, system-ui, sans-serif",
  availability: "11px Jetbrains Mono, ui-monospace, monospace",
  timeMarker: "11px Jetbrains Mono,ui-monospace, monospace",
  eventTitle: "500 12px Jetbrains Mono,system-ui, sans-serif",
  clock: "200 96px Roboto Mono, monospace",
} as const;
