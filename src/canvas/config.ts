import { THEMES, DEFAULT_THEME, type ThemeId } from "./themes.ts";

export const DAY_START_HOUR = 8;
export const DAY_END_HOUR = 18;
export const LABEL_WIDTH = 120;
export const MIN_ROW_HEIGHT = 40;
export const TOP_PAD = 8;
export const CLOCK_ROW_HEIGHT = 96;
export const HOUR_ROW_HEIGHT = 22;

export const COLORS: import("./themes.ts").ThemeColors = {
  ...THEMES[DEFAULT_THEME].colors,
  event: {
    meeting: { ...THEMES[DEFAULT_THEME].colors.event.meeting },
    focus: { ...THEMES[DEFAULT_THEME].colors.event.focus },
    ooo: { ...THEMES[DEFAULT_THEME].colors.event.ooo },
  },
};

export function setTheme(id: ThemeId): void {
  const theme = THEMES[id];
  if (!theme) return;
  Object.assign(COLORS, {
    ...theme.colors,
    event: {
      meeting: { ...theme.colors.event.meeting },
      focus: { ...theme.colors.event.focus },
      ooo: { ...theme.colors.event.ooo },
    },
  });
  // keep page background in sync (canvas clears with COLORS.bg but body needs it too)
  if (typeof document !== "undefined") {
    document.documentElement.style.background = COLORS.bg;
    document.body.style.background = COLORS.bg;
  }
  try {
    localStorage.setItem("timeframe:theme", id);
  } catch { /* ignore */ }
}

export function initTheme(): ThemeId {
  let id: string | null = null;
  try {
    id = localStorage.getItem("timeframe:theme");
  } catch { /* ignore */ }
  if (id && id in THEMES) {
    setTheme(id as ThemeId);
    return id as ThemeId;
  }
  const param = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("theme") : null;
  if (param && param in THEMES) {
    setTheme(param as ThemeId);
    return param as ThemeId;
  }
  // apply default to sync DOM background even on first load
  if (typeof document !== "undefined") {
    document.documentElement.style.background = COLORS.bg;
    document.body.style.background = COLORS.bg;
  }
  return DEFAULT_THEME;
}

export { THEMES, DEFAULT_THEME, type ThemeId };

export const FONTS = {
  label: "500 14px Jetbrains Mono, system-ui, sans-serif",
  availability: "11px Jetbrains Mono, ui-monospace, monospace",
  timeMarker: "11px Jetbrains Mono,ui-monospace, monospace",
  eventTitle: "500 12px Jetbrains Mono,system-ui, sans-serif",
  clock: "200 96px Roboto Mono, monospace",
} as const;
