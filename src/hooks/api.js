const API_BASE_URL = (
	import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || ""
).replace(/\/$/, "");

const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

async function request(path, options = {}) {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		headers: {
			"Content-Type": "application/json",
			...options.headers,
		},
		...options,
	});

	if (!response.ok) {
		let message = `Request failed with status ${response.status}`;
		try {
			const body = await response.json();
			if (body?.error) message = body.error;
		} catch {
			// Keep the HTTP status when the response is not JSON.
		}
		throw new Error(message);
	}

	return response.status === 204 ? null : response.json();
}

function query(params) {
	const search = new URLSearchParams();
	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== "") search.set(key, String(value));
	});
	const stringified = search.toString();
	return stringified ? `?${stringified}` : "";
}

/** Open-Meteo is called directly from the browser: no API key, no backend hop. */
export async function getWeather(latitude, longitude) {
	const params = query({
		latitude,
		longitude,
		current:
			"temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m",
		daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset",
		timezone: "auto",
		forecast_days: "4",
	});
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 12000);
	const response = await fetch(`${OPEN_METEO_URL}${params}`, { signal: controller.signal });
	clearTimeout(timeout);
	if (!response.ok) throw new Error(`Open-Meteo request failed with ${response.status}`);
	return response.json();
}

export const api = {
	getOverview: (location, coordinates) =>
		request(`/api/overview${query({ location, ...coordinates })}`),
	getDataHealth: () => request("/api/data-health"),
	getAirQuality: (location = "Bengaluru", coordinates) =>
		request(`/api/air-quality${query({ location, ...coordinates })}`),
	getHotspots: (location = "") =>
		request(`/api/hotspots${query({ location })}`),
	detectHotspots: () => request("/api/hotspots/detect", { method: "POST" }),
	getFires: (bbox, days = 2) => request(`/api/environment/fires${query({ bbox, days })}`),
	getPrediction: (location = "Bengaluru", horizonHours = 24, coordinates) =>
		request(`/api/predictions${query({ location, horizonHours, ...coordinates })}`),
	getCorridors: () => request("/api/corridors"),
	refreshCorridors: () => request("/api/corridors/refresh", { method: "POST" }),
	getAnalytics: (location) => request(`/api/analytics${query({ location })}`),
	getNetwork: () => request("/api/federation"),
	getFederationStats: () => request("/api/federation/stats"),
	getSharedModels: () => request("/api/federation/models"),
	publishModel: (model) => request("/api/federation/models", { method: "POST", body: JSON.stringify(model) }),
	registerNode: (node) => request("/api/federation/nodes", { method: "POST", body: JSON.stringify(node) }),
	reverseGeocode: (latitude, longitude) =>
		request(`/api/geocoding/reverse${query({ latitude, longitude })}`),
	searchCities: (q) => request(`/api/geocoding/search${query({ q })}`),
	getReports: () => request("/api/reports"),
	/** Multipart when a photo is attached so the backend can run the vision model. */
	createReport: (report, file) => {
		if (!file) return request("/api/reports", { method: "POST", body: JSON.stringify(report) });
		const form = new FormData();
		form.append("location", report.location);
		form.append("description", report.description);
		form.append("category", report.category || "Other");
		form.append("latitude", String(report.latitude ?? ""));
		form.append("longitude", String(report.longitude ?? ""));
		form.append("image", file);
		return request("/api/reports", { method: "POST", body: form, headers: {} });
	},
	updateReport: (id, status) =>
		request(`/api/reports/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),
	getAlerts: () => request("/api/alerts"),
	getIncidents: () => request("/api/alerts/incidents"),
	evaluateAlerts: (refresh = false) =>
		request(`/api/alerts/evaluate${query({ refresh })}`, { method: "POST" }),
	createAlert: (alert) =>
		request("/api/alerts", { method: "POST", body: JSON.stringify(alert) }),
	updateAlert: (id, action) =>
		request(`/api/alerts/${id}`, { method: "PATCH", body: JSON.stringify({ action }) }),
};

export { API_BASE_URL };