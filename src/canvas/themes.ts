export interface ThemeColors {
  bg: string;
  zebraEven: string;
  zebraOdd: string;
  gridLine: string;
  gridLabel: string;
  labelText: string;
  timeIndicator: string;
  clockBg: string;
  clockText: string;
  eventBorder: string;
  event: {
    meeting: { bg: string; border: string; text: string };
    focus: { bg: string; border: string; text: string };
    ooo: { bg: string; border: string; text: string };
  };
}

export interface Theme {
  id: string;
  label: string;
  colors: ThemeColors;
}

export const THEMES = {
  timeframe: {
    id: "timeframe",
    label: "Timeframe Dark",
    colors: {
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
    },
  },
  monokai: {
    id: "monokai",
    label: "Monokai",
    colors: {
      bg: "#272822",
      zebraEven: "#3e3d32",
      zebraOdd: "#313029",
      gridLine: "#49483e",
      gridLabel: "#90908a",
      labelText: "#f8f8f2",
      timeIndicator: "#f92672",
      clockBg: "rgba(39,40,34,0)",
      clockText: "#f8f8f2",
      eventBorder: "rgba(255,255,255,0.08)",
      event: {
        meeting: { bg: "#2d4a4a", border: "#66d9ef", text: "#e6fbff" },
        focus: { bg: "#3d2f56", border: "#ae81ff", text: "#f0e6ff" },
        ooo: { bg: "#4e2632", border: "#f92672", text: "#ffe0e8" },
      },
    },
  },
  dracula: {
    id: "dracula",
    label: "Dracula",
    colors: {
      bg: "#282a36",
      zebraEven: "#44475a",
      zebraOdd: "#343746",
      gridLine: "#44475a",
      gridLabel: "#6272a4",
      labelText: "#f8f8f2",
      timeIndicator: "#ff5555",
      clockBg: "rgba(40,42,54,0)",
      clockText: "#f8f8f2",
      eventBorder: "rgba(255,255,255,0.06)",
      event: {
        meeting: { bg: "#2a3f4f", border: "#8be9fd", text: "#e0fbff" },
        focus: { bg: "#3a2f4f", border: "#bd93f9", text: "#f0e6ff" },
        ooo: { bg: "#4a2b3a", border: "#ff5555", text: "#ffe4e6" },
      },
    },
  },
  catppuccin: {
    id: "catppuccin",
    label: "Catppuccin Mocha",
    colors: {
      bg: "#1e1e2e",
      zebraEven: "#313244",
      zebraOdd: "#262637",
      gridLine: "#45475a",
      gridLabel: "#6c7086",
      labelText: "#cdd6f4",
      timeIndicator: "#f38ba8",
      clockBg: "rgba(30,30,46,0)",
      clockText: "#cdd6f4",
      eventBorder: "rgba(255,255,255,0.06)",
      event: {
        meeting: { bg: "#22384f", border: "#89b4fa", text: "#dae6ff" },
        focus: { bg: "#332a4a", border: "#cba6f7", text: "#ede2ff" },
        ooo: { bg: "#4a2a3a", border: "#f38ba8", text: "#ffd6e0" },
      },
    },
  },
  oneDark: {
    id: "oneDark",
    label: "Atom One Dark",
    colors: {
      bg: "#282c34",
      zebraEven: "#353b45",
      zebraOdd: "#2c313c",
      gridLine: "#3e4451",
      gridLabel: "#5c6370",
      labelText: "#abb2bf",
      timeIndicator: "#e06c75",
      clockBg: "rgba(40,44,52,0)",
      clockText: "#abb2bf",
      eventBorder: "rgba(255,255,255,0.06)",
      event: {
        meeting: { bg: "#22354a", border: "#61afef", text: "#d6e9ff" },
        focus: { bg: "#332a4a", border: "#c678dd", text: "#e9d6ff" },
        ooo: { bg: "#4a2a32", border: "#e06c75", text: "#ffd6d9" },
      },
    },
  },
  lucario: {
    id: "lucario",
    label: "Lucario",
    colors: {
      bg: "#2b3e50",
      zebraEven: "#344a5e",
      zebraOdd: "#2e4356",
      gridLine: "#3e5a74",
      gridLabel: "#5c98b5",
      labelText: "#f8f8f2",
      timeIndicator: "#ff9d00",
      clockBg: "rgba(43,62,80,0)",
      clockText: "#f8f8f2",
      eventBorder: "rgba(255,255,255,0.07)",
      event: {
        meeting: { bg: "#1e4a5e", border: "#5ec4ff", text: "#d6f0ff" },
        focus: { bg: "#3a2e5e", border: "#c48dff", text: "#ede2ff" },
        ooo: { bg: "#5a2a32", border: "#f45c7a", text: "#ffe0e6" },
      },
    },
  },
  nord: {
    id: "nord",
    label: "Nord",
    colors: {
      bg: "#2e3440",
      zebraEven: "#3b4252",
      zebraOdd: "#343c4a",
      gridLine: "#4c566a",
      gridLabel: "#616e88",
      labelText: "#eceff4",
      timeIndicator: "#bf616a",
      clockBg: "rgba(46,52,64,0)",
      clockText: "#eceff4",
      eventBorder: "rgba(255,255,255,0.06)",
      event: {
        meeting: { bg: "#34495e", border: "#88c0d0", text: "#e5e9f0" },
        focus: { bg: "#3b3a4a", border: "#b48ead", text: "#e5e9f0" },
        ooo: { bg: "#4a3840", border: "#bf616a", text: "#eceff4" },
      },
    },
  },
  solarizedDark: {
    id: "solarizedDark",
    label: "Solarized Dark",
    colors: {
      bg: "#002b36",
      zebraEven: "#073642",
      zebraOdd: "#003847",
      gridLine: "#586e75",
      gridLabel: "#657b83",
      labelText: "#eee8d5",
      timeIndicator: "#dc322f",
      clockBg: "rgba(0,43,54,0)",
      clockText: "#eee8d5",
      eventBorder: "rgba(255,255,255,0.06)",
      event: {
        meeting: { bg: "#0a4a5a", border: "#268bd2", text: "#e6f3ff" },
        focus: { bg: "#3a2f5a", border: "#6c71c4", text: "#e9e2ff" },
        ooo: { bg: "#4a2a2a", border: "#dc322f", text: "#ffe6e6" },
      },
    },
  },
  solarizedLight: {
    id: "solarizedLight",
    label: "Solarized Light",
    colors: {
      bg: "#fdf6e3",
      zebraEven: "#eee8d5",
      zebraOdd: "#f5efdc",
      gridLine: "#93a1a1",
      gridLabel: "#657b83",
      labelText: "#586e75",
      timeIndicator: "#dc322f",
      clockBg: "rgba(253,246,227,0)",
      clockText: "#586e75",
      eventBorder: "rgba(0,0,0,0.08)",
      event: {
        meeting: { bg: "#d6e8ee", border: "#268bd2", text: "#0a3a4a" },
        focus: { bg: "#e2d9ee", border: "#6c71c4", text: "#30255a" },
        ooo: { bg: "#f0d6d6", border: "#dc322f", text: "#5a1a1a" },
      },
    },
  },
  githubLight: {
    id: "githubLight",
    label: "GitHub Light",
    colors: {
      bg: "#ffffff",
      zebraEven: "#f6f8fa",
      zebraOdd: "#ffffff",
      gridLine: "#d0d7de",
      gridLabel: "#656d76",
      labelText: "#24292f",
      timeIndicator: "#cf222e",
      clockBg: "rgba(255,255,255,0)",
      clockText: "#24292f",
      eventBorder: "rgba(0,0,0,0.08)",
      event: {
        meeting: { bg: "#ddf4ff", border: "#0969da", text: "#0550ae" },
        focus: { bg: "#fbefff", border: "#8250df", text: "#6639ba" },
        ooo: { bg: "#ffebe9", border: "#cf222e", text: "#82071e" },
      },
    },
  },
  oneLight: {
    id: "oneLight",
    label: "Atom One Light",
    colors: {
      bg: "#fafafa",
      zebraEven: "#f0f0f1",
      zebraOdd: "#fafafa",
      gridLine: "#d4d4d4",
      gridLabel: "#a0a1a7",
      labelText: "#383a42",
      timeIndicator: "#e45649",
      clockBg: "rgba(250,250,250,0)",
      clockText: "#383a42",
      eventBorder: "rgba(0,0,0,0.07)",
      event: {
        meeting: { bg: "#e0e8ff", border: "#4078f2", text: "#23408e" },
        focus: { bg: "#f0e6ff", border: "#a626a4", text: "#5a1a6b" },
        ooo: { bg: "#ffe0d6", border: "#e45649", text: "#7a1a1a" },
      },
    },
  },
  catppuccinLatte: {
    id: "catppuccinLatte",
    label: "Catppuccin Latte",
    colors: {
      bg: "#eff1f5",
      zebraEven: "#e6e9ef",
      zebraOdd: "#dce0e8",
      gridLine: "#bcc0cc",
      gridLabel: "#8c8fa1",
      labelText: "#4c4f69",
      timeIndicator: "#d20f39",
      clockBg: "rgba(239,241,245,0)",
      clockText: "#4c4f69",
      eventBorder: "rgba(0,0,0,0.07)",
      event: {
        meeting: { bg: "#dce8ff", border: "#1e66f5", text: "#1a4fa0" },
        focus: { bg: "#e8deff", border: "#8839ef", text: "#5a2ea6" },
        ooo: { bg: "#ffd6d9", border: "#d20f39", text: "#8a0f2b" },
      },
    },
  },
} as const satisfies Record<string, Theme>;

export type ThemeId = keyof typeof THEMES;
export const DEFAULT_THEME: ThemeId = "timeframe";
