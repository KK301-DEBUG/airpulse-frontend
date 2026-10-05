# AirPulse Frontend

React 19 + Vite command centre for the AirPulse federated climate platform.

## Run

```bash
cp .env.example .env
npm install
npm run dev      # http://localhost:5173
```

Point `VITE_API_BASE_URL` at the backend (`http://localhost:4000` for local dev; the Vite proxy is not required,
the API base URL is used directly). Weather is fetched client-side from Open-Meteo — no key, no backend hop.

## Surfaces

| Route | What it shows |
| --- | --- |
| `/dashboard` | Live AQI (station vs estimate labelled), projected hotspot markers, evidence-ranked AI intelligence card, recorded history chart, pollutant breakdown |
| `/map` | Hotspots projected from **real coordinates**, NASA FIRMS fire pixels, per-hotspot source attribution and evidence |
| `/predictions` | 6 h → 7 day spike forecast for any city, with contributing factors |
| `/corridors` | Economic-corridor forecasts (Delhi–Kolkata belt, western, southern, central mining belt, east coast) |
| `/reports` | Citizen photo + description, classified by the vision model |
| `/alerts` | Auto-raised and manual alerts, each routed to the responsible pollution board |
| `/network` | Federated nodes plus the shared model catalogue (update stats only, no raw data) |
| `/analytics` | Trends computed from observed readings, affected zones, corridor risk |

## Conventions

- `src/hooks/api.js` is the only HTTP client. It is also the place to add endpoints.
- Every panel degrades to an explicit empty state instead of showing a placeholder value.
- The map is a schematic stage; markers are placed with a real equirectangular projection over India's bbox.