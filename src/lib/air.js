/* Air-data semantics for the AIRGUARD UI.
   Rule 1: saturated colour is reserved for air data.
   Rule 3: freshness is visible — an old reading must look old. */

/** US AQI category -> severity token used for every data-coloured element. */
export function severityClass(aqi) {
  if (aqi == null) return "sev-unknown";
  if (aqi <= 50) return "sev-good";
  if (aqi <= 100) return "sev-moderate";
  if (aqi <= 150) return "sev-high";
  if (aqi <= 200) return "sev-critical";
  return "sev-severe";
}

/**
 * Freshness of an air-quality reading.
 * `source` comes straight from the backend: station | stale-station | estimate.
 * A modelled value is never "live" no matter how new its timestamp is.
 */
export function freshnessOf(airQuality) {
  if (!airQuality) return "stale";
  if (airQuality.source === "station") {
    const age = airQuality.readingAgeHours;
    return age == null || age <= 3 ? "live" : age <= 12 ? "aging" : "stale";
  }
  if (airQuality.source === "stale-station") return "stale";
  return "aging"; // modelled estimate: real computation, not a measurement
}

const FRESHNESS_COPY = {
  live: "measured",
  aging: "modelled",
  stale: "stale source",
};

/** Human-readable provenance. Never hides the age. */
export function freshnessLabel(airQuality) {
  if (!airQuality) return "no data";
  if (airQuality.source === "station") {
    const age = airQuality.readingAgeHours;
    return age == null ? "station · age unknown" : `station · ${formatAge(age)} old`;
  }
  if (airQuality.source === "stale-station") {
    const age = airQuality.readingAgeHours;
    return `modelled · station ${age == null ? "age unknown" : `${formatAge(age)} old`}`;
  }
  return "modelled estimate";
}

export function formatAge(hours) {
  if (hours == null) return "unknown";
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))}m`;
  if (hours < 48) return `${Math.round(hours)}h`;
  return `${Math.round(hours / 24)}d`;
}

export { FRESHNESS_COPY };