import { auth } from "./firebase";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://airpulse-backend-2muo.onrender.com";
const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

function coordinateParams(latitude, longitude) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error("A valid latitude and longitude are required");
  }
  return new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
  });
}

async function requestJson(path, latitude, longitude, token) {
  const params = coordinateParams(latitude, longitude);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  const response = await fetch(`${API_BASE_URL}${path}?${params}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    signal: controller.signal,
  });
  clearTimeout(timeout);

  if (!response.ok) {
    throw new Error(`${path} request failed with ${response.status}`);
  }

  return response.json();
}

export async function getAirQuality(latitude, longitude) {
  const token = auth?.currentUser ? await auth.currentUser.getIdToken() : null;
  return requestJson("/api/air-quality", latitude, longitude, token);
}

export async function getWeather(latitude, longitude) {
  const params = coordinateParams(latitude, longitude);
  params.set(
    "current",
    "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m",
  );
  params.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset",
  );
  params.set("timezone", "auto");
  params.set("forecast_days", "4");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  const response = await fetch(`${OPEN_METEO_URL}?${params}`, { signal: controller.signal });
  clearTimeout(timeout);
  if (!response.ok) {
    throw new Error(`Open-Meteo request failed with ${response.status}`);
  }
  return response.json();
}

export async function getPrediction(latitude, longitude) {
  const token = auth?.currentUser ? await auth.currentUser.getIdToken() : null;
  const predictionUrl = import.meta.env.VITE_PREDICTION_API_URL;

  if (predictionUrl) {
    const response = await fetch(predictionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ features: { latitude, longitude } }),
    });
    if (!response.ok) throw new Error(`Prediction request failed with ${response.status}`);
    return response.json();
  }

  return requestJson("/api/predictions", latitude, longitude, token);
}

export async function getDashboardData(latitude, longitude) {
  const token = auth?.currentUser ? await auth.currentUser.getIdToken() : null;
  const routes = {
    overview: "/api/overview",
    airQuality: "/api/air-quality",
    hotspots: "/api/hotspots",
    reports: "/api/reports",
    alerts: "/api/alerts",
    analytics: "/api/analytics",
    environment: "/api/environment",
  };

  const entries = await Promise.all(
    Object.entries(routes).map(async ([key, path]) => {
      try {
        return [key, await requestJson(path, latitude, longitude, token)];
      } catch {
        return [key, null];
      }
    }),
  );

  try {
    entries.push(["predictions", await getPrediction(latitude, longitude)]);
  } catch {
    entries.push(["predictions", null]);
  }

  return Object.fromEntries(entries);
}
