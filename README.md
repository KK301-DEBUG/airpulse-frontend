# AirPulse Frontend

**React 19 + Vite** command centre for the AirPulse federated air-quality platform.  
Built on three rules:

1. **Saturated colour is RESERVED FOR AIR DATA** — chrome is cyan; green/red mean clean/hazardous air. Nothing decorative is ever green.
2. **Motion must never imply data that isn't there** — only diffs animate. Stale values hold still.
3. **Freshness is visible** — readings desaturate as they age. No placeholder series.

## Quick Start

```bash
cp .env.example .env
npm install
npm run dev      # http://localhost:5173
```

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_BASE_URL` | **Yes** | Backend URL (e.g. `http://localhost:4000` or Render URL) |
| `VITE_PREDICTION_API_URL` | No | Optional Flask `/predict` endpoint override |
| `VITE_FIREBASE_*` | No | Firebase Auth config (enables sign-in / workspaces) |

Open-Meteo weather is fetched **client-side** — no key, no backend hop.

## Routes & Surfaces

| Route | Purpose | Key Components |
|-------|---------|----------------|
| `/` | Landing + auth gate | `LandingPage`, `AuthPanel`, `Globe3D` (lazy) |
| `/dashboard` | Command-centre snapshot | `Dashboard`, `DetectionHero`, `StatCard`, pollutant/forecast/prediction panels |
| `/map` | Geospatial intelligence | `LiveMapPage`, `HotspotPanel`, real equirectangular projection |
| `/predictions` | Spike forecast explorer | `Predictions` page, horizon picker (6h–7d), factor breakdown |
| `/corridors` | Economic-corridor forecasts | `CorridorsPage`, per-city roll-up, re-forecast button |
| `/reports` | Citizen photo + classification | `ReportsPage`, multipart upload → vision model, live list |
| `/alerts` | Authority-routed incidents | `AlertsPage`, auto-evaluation, create/resolve rules |
| `/network` | Federated model catalogue | `NetworkPage`, node orbit, shared model table |
| `/analytics` | Trends from recorded data | `AnalyticsPage`, bar chart (gaps = no reading), zone/corridor rankings |

## Architecture

```
src/
├── App.jsx                    # Auth gate, router, dashboard shell, sidebar, topbar
├── main.jsx                   # Entry, React 19 + React Router v7
├── hooks/
│   └── api.js                 # Single HTTP client — all endpoints defined here
├── lib/
│   ├── air.js                 # freshnessOf(), freshnessLabel(), severityClass()
│   ├── firebase.js            # Firebase Auth init (optional)
│   └── useChangePulse.js      # Hook: animate only when value actually changes
├── components/
│   └── Globe3D.jsx            # Three.js globe — real coords, real severity, real rotation
├── pages/
│   ├── Dashboard.jsx          # Small landing dashboard (non-auth)
│   ├── Predictions.jsx        # Forecast explorer
│   └── CommandPages.jsx       # All authenticated pages (map, reports, alerts, network, analytics, corridors)
└── styles/
    └── tokens.css             # Design system (CSS custom properties, rules 1–3 enforced)
```

## Design System (`tokens.css`)

The entire visual language is encoded in CSS custom properties — **no Tailwind, no theme files**.

### Colour Philosophy
- **Chrome**: `--sig` (cyan `#2ad4f0`) — buttons, links, focus rings, loading states
- **Air Data Scale** (only saturated colours in the product):
  - `--aqi-good` `#2fd48f`
  - `--aqi-moderate` `#e8cf5a`
  - `--aqi-high` `#f1a545`
  - `--aqi-critical` `#ff5f58`
  - `--aqi-severe` `#b96cff`
- **Freshness**: `--fresh` (sig) → `--aging` (moderate) → `--stale` (slate)

### Rule 2 Enforcement (No Decorative Motion)
```css
.live-indicator, .ai-pulse { animation: none; background: var(--stale); }
[data-fresh="live"] .live-indicator { background: var(--sig); box-shadow: 0 0 8px var(--sig-glow); }
/* Only applied by React when value actually changes */
.is-diff { animation: sig-bloom 900ms var(--ease); }
```

### Rule 3 Enforcement (Freshness Visible)
```css
[data-fresh="live"]   { --fresh-opacity: 1;   }
[data-fresh="aging"]  { --fresh-opacity: 0.72; }
[data-fresh="stale"]  { --fresh-opacity: 0.44; }

/* Desaturate stale readings — never fake a zero */
[data-fresh="stale"] .aqi-ring,
[data-fresh="stale"] .stat-value { filter: saturate(0.55) brightness(0.82); }
```

### Chart Honesty
Empty time buckets arrive as `null`. They render as a **2 px gap line**, never as a bar of height 0 (which reads as "perfect air").

```css
.chart-column.is-empty .bar {
  height: 2px;
  background: var(--line);
  opacity: 0.55;
}
```

### Reduced Motion
Total opt-out via media query — all animations/transitions collapse to `0.001ms`.

## Key Components

### Globe3D (Lazy-loaded Three.js)
- **Real coordinates**: hotspots placed via `latLonToVector()` on sphere
- **Real severity**: marker colour = AQI severity palette
- **Real rotation**: globe turns to face worst detection; idle drift only when data exists
- **Textures**: vendored under `public/textures/` (MIT, three.js examples) — works offline
- **Fallback**: graceful "globe unavailable" message if WebGL missing or `prefers-reduced-motion`

### DetectionHero (Dashboard Hero)
The detection **is** the product. Shows:
- Location, detection time, source attribution
- Current vs predicted AQI (with confidence %)
- Evidence chain: fire detections, citizen reports, wind/humidity
- Explicit "unconfirmed" state when no corroborating signals

### LiveMapPage
- Equirectangular projection over India bbox (`6.5–37.5°N, 68–97.5°E`)
- Layer switcher: AQI / PM2.5 / Fire / Reports / Wind
- Fire pixels from NASA FIRMS (real FRP values in tooltips)
- Click hotspot → `HotspotPanel` with source attribution bars + authority routing

### ReportsPage
- **Multipart upload** → backend runs Python vision model (`/classify`)
- Returns `aiClassification`, `aiConfidence`, `aiModel`
- Live list with classification badges

### NetworkPage
- Federated node orbit visualisation (CSS, not canvas)
- "RAW DATA NOT SHARED" badge — only gradient statistics aggregated
- Shared model catalogue table: version, accuracy, samples, residual, drift

## Data Flow

```
Backend (Fastify)                          Frontend (React)
─────────────────                          ────────────────
/api/overview          ──GET──►  Dashboard, DetectionHero
/api/hotspots          ──GET──►  LiveMapPage, Dashboard
/api/hotspots/detect   ──POST──► LiveMapPage "Re-detect"
/api/predictions       ──GET──►  Predictions page, Dashboard
/api/corridors         ──GET──►  CorridorsPage
/api/reports           ──GET/POST► ReportsPage (multipart for photos)
/api/alerts            ──GET/POST► AlertsPage
/api/alerts/evaluate   ──POST──► AlertsPage "Run evaluation"
/api/federation        ──GET──►  NetworkPage
/api/analytics         ──GET──►  AnalyticsPage, Dashboard
/api/geocoding/*       ──GET──►  City search, reverse geocode
/api/environment/*     ──GET──►  Raw provider access (dev/debug)

Open-Meteo (client)    ──GET──►  Weather (current + 4-day forecast)
```

## Scripts

```bash
npm run dev      # Vite dev server + HMR
npm run build    # tsc + vite build → dist/
npm run preview  # Preview production build
npm run lint     # eslint (if configured)
```

## Deployment

- **Static hosting** (Vercel, Netlify, Cloudflare Pages, S3+CloudFront)
- Set `VITE_API_BASE_URL` to your backend URL
- Backend CORS must allow your frontend origin
- `public/textures/` served as-is (required for Globe3D offline support)

## Browser Support

- Modern browsers with ES2022 + WebGL2
- `prefers-reduced-motion` respected throughout
- No polyfills shipped — `esbuild` target: `ES2022`

## License

MIT — Part of the AirPulse hackathon project.