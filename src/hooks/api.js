const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/$/, "");

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

export const api = {
	getOverview: () => request("/api/overview"),
	getAirQuality: (location = "Bengaluru") =>
		request(`/api/air-quality?location=${encodeURIComponent(location)}`),
	getHotspots: () => request("/api/hotspots"),
	getPrediction: (location = "Bengaluru", horizonHours = 24) =>
		request(
			`/api/predictions?location=${encodeURIComponent(location)}&horizonHours=${horizonHours}`,
		),
	getAnalytics: () => request("/api/analytics"),
	getReports: () => request("/api/reports"),
	createReport: (report) =>
		request("/api/reports", {
			method: "POST",
			body: JSON.stringify(report),
		}),
	getAlerts: () => request("/api/alerts"),
	createAlert: (alert) =>
		request("/api/alerts", {
			method: "POST",
			body: JSON.stringify(alert),
		}),
};

export { API_BASE_URL };
