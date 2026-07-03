# Timeframe

A real-time team calendar dashboard rendered on HTML5 Canvas with a parametric non-linear zoom. Events near the current time get more visual space, while events farther away compress — like a magnifying glass that follows the clock.

## Features

- **Gaussian zoom timeline** — the X-axis dynamically distorts so the present moment gets maximum resolution
- **Real-time sync** — 60 FPS canvas loop with a live HH:MM:SS overlay and a red current-time indicator
- **Three event types** — Meeting (blue), Focus (purple), Out-of-Office (red)
- **Click-to-zoom** — click anywhere to center the zoom there for 10 seconds, then smooth decay back to realtime
- **Google Calendar integration** — fetches events via a service account for each team member
- **Mock data mode** — `MockAdapter` generates fake events for development without API access
- **Dark theme** — `#0f0f1a` background with zebra-striped rows
- **Retina / HiDPI** — respects `devicePixelRatio`
- **Responsive** — `ResizeObserver` keeps the canvas locked to the viewport

## How the zoom works

The scale factor at any time *t* follows a Gaussian bump centered on the current time:

```
S(t) = S_base + A * exp(-(t - tc)^2 / (2 * sigma^2))
```

A lookup table (LUT) is built from this function so that every frame resolves positions in O(1) — no integration per event.

## Prerequisites

- Node.js
- A Google Calendar service account with read-only access to team members' calendars

## Getting started

```bash
git clone <repo-url>
cd timeframe
npm install
```

### 1. Google Calendar service account

Create a service account in the Google Cloud Console, enable the Calendar API, and share your team's calendars with the service account email. Then provide credentials by one of:

- **JSON key file** — download the key and set:
  ```bash
  export GOOGLE_SERVICE_ACCOUNT_KEY_PATH=/path/to/key.json
  ```
- **Environment variables**:
  ```bash
  export GOOGLE_SERVICE_ACCOUNT_EMAIL="your-sa@project.iam.gserviceaccount.com"
  export GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
  ```

The server falls back to `GOOGLE_APPLICATION_CREDENTIALS` if the explicit path is unset.

### 2. Configure team members

Edit `server/calendarApi.ts` — the `TEAM_MEMBERS` array maps display names to Google Calendar emails.

### 3. Run

```bash
# Terminal 1 — backend (Express, port 3001)
npm run server

# Terminal 2 — frontend (Vite, port 5173)
npm run dev

# Or both at once:
npm run dev:all
```

The Vite dev server proxies `/api/*` to the Express backend.

### 4. Open

[http://localhost:5173](http://localhost:5173)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server (port 5173) |
| `npm run server` | Express backend via `tsx watch` (port 3001) |
| `npm run dev:all` | Both server and frontend concurrently |
| `npm run build` | Type-check (`tsc -b`) then Vite production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run oxlint |

## Environment variables

| Variable | Purpose |
|----------|---------|
| `PORT` | Express port (default `3001`) |
| `GOOGLE_SERVICE_ACCOUNT_KEY_PATH` | Path to JSON key file |
| `GOOGLE_APPLICATION_CREDENTIALS` | Fallback path for JSON key |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | SA email (alternative to file) |
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | SA private key (alternative to file) |

## Project structure

```
src/
├── adapters/          # Data sources (GoogleApiAdapter, MockAdapter)
├── canvas/            # Rendering engine
│   ├── config.ts      # Layout constants, colors, fonts
│   ├── engine.ts      # Main loop, click handling, data refresh
│   ├── grid.ts        # Row/column grid, member status
│   ├── blocks.ts      # Event block rendering with text truncation
│   ├── overlay.ts     # Time indicator, floating clock
│   └── zoom.ts        # ZoomLUT — Gaussian lookup table
├── data/
│   └── model.ts       # CalendarAdapter interface & types
├── main.ts            # Entry point
└── style.css          # Dark background, full-viewport canvas

server/
├── index.ts           # Express entry point
├── types.ts           # Shared types (CalendarEvent, TeamMember, CalendarData)
└── calendarApi.ts     # Google Calendar API integration

.design/               # Specs and design docs (Spanish + English)
```

## Data flow

```
Google Calendar API
       ↓
  server/calendarApi.ts   ← GET /api/calendar?date=YYYY-MM-DD
       ↓
  src/adapters/google.ts  (or mock.ts for development)
       ↓
  src/canvas/engine.ts    (poll every 60s, updates event list)
       ↓
  zoom.ts → grid.ts → blocks.ts → overlay.ts  (per frame, 60 FPS)
```

## Architecture notes

- **No React used** — the scaffold was from a template but the app is vanilla Canvas
- **Mock adapter** — `src/adapters/mock.ts` generates 20 fictional team members with random events; swap the adapter in `main.ts` to develop without a live API
- **Click interaction** — the engine toggles between `realtime`, `goto`, `hold`, and `return` modes
- **Culling** — events outside the visible X range are skipped per frame
- **Text truncation** — `ctx.measureText` + ellipsis when zoom narrows a block below its text width

## License

Proprietary — internal use at Datawheel.
