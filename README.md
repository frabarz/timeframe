# Timeframe

A real-time team calendar on HTML5 Canvas with a non-linear zoom — events near the present get more space, distant ones compress. Like a magnifying glass that follows the clock.

- Gaussian zoom on the timeline, centered on current time
- 60 FPS canvas with live clock and current-time indicator
- Meetings (blue), Focus (purple), Out-of-Office (red)
- Click anywhere to zoom there for 10 seconds, then smoothly returns
- Google Calendar via service account, or mock data for local dev
- Dark theme, HiDPI and responsive

How it works: scale at time *t* is `S(t) = S_base + A * exp(-(t - tc)^2 / 2σ²)`. A lookup table is built from this so positions resolve in O(1) per frame.

## Setup

Requires Node.js and a Google Calendar service account with read access to your team's calendars.

```bash
git clone <repo-url>
cd timeframe
npm install
```

Create a service account in Google Cloud Console, enable the Calendar API, and share the team calendars with it. Then provide credentials either as a JSON key file:

```bash
export GOOGLE_SERVICE_ACCOUNT_KEY_PATH=/path/to/key.json
```

or via env vars:

```bash
export GOOGLE_SERVICE_ACCOUNT_EMAIL="your-sa@project.iam.gserviceaccount.com"
export GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
```

(`GOOGLE_APPLICATION_CREDENTIALS` also works as fallback.) Edit `server/calendarApi.ts` to set your `TEAM_MEMBERS` (name → calendar email).

Run it:

```bash
npm run dev:all  # frontend on 5173 + backend on 3001
# or separately: npm run server and npm run dev
```

Then open http://localhost:5173. Vite proxies `/api/*` to the Express server.

For local dev without Google access, swap to `MockAdapter` in `src/main.ts` — it generates fake events for 20 fictional members.

## Development

- `npm run dev` — Vite frontend (5173)
- `npm run server` — Express backend with `tsx watch` (3001)
- `npm run build` — type-check + production build
- `npm run preview` / `npm run lint`

`PORT` env var overrides the backend port (default 3001).

Canvas code lives in `src/canvas/` (`zoom.ts` for the LUT, `engine.ts` for the main loop), data sources in `src/adapters/`, server in `server/`.

## License

The [Unlicense](https://unlicense.org/).
