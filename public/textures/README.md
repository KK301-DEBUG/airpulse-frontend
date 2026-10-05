# Globe textures

- `earth_atmos_2048.jpg` — equirectangular day map
- `earth_lights_2048.png` — equirectangular city-lights (night) map

Source: [three.js](https://github.com/mrdoob/three.js) `examples/textures/planets/`,
MIT licensed. Vendored here deliberately rather than loaded from a CDN so the
AIRGUARD demo renders with no network access.

Used by `src/components/Globe3D.jsx`:
- day map → `material.map` (multiplied by the dark base colour, so landmasses read
  as silhouette rather than a bright blue marble)
- night map → `material.emissiveMap`, so city lights glow

Both load asynchronously. If either fails, the globe still renders as a lit
sphere with graticule — it degrades, it does not break.