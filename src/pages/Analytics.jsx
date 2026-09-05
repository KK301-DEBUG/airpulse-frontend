import { useEffect, useState } from "react";
import { api } from "../hooks/api";

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getAnalytics().then(setAnalytics).catch((requestError) => setError(requestError.message));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Analytics Page</h1>
      {error ? <p role="alert">Unable to load analytics: {error}</p> : analytics && <p className="text-lg text-gray-600">Requests: {analytics.metrics.requests} | Reports: {analytics.metrics.reports} | Alerts: {analytics.metrics.alerts}</p>}
    </div>
  );
}
