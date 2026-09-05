import { useEffect, useState } from "react";
import { api } from "../hooks/api";

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getOverview().then(setOverview).catch((requestError) => setError(requestError.message));
  }, []);

  if (error) return <p role="alert">Unable to load dashboard: {error}</p>;
  if (!overview) return <p>Loading dashboard...</p>;

  const { airQuality, hotspots = [] } = overview;
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>{airQuality.location}: AQI {airQuality.aqi} ({airQuality.category})</p>
      <p>PM2.5: {airQuality.pm25} | PM10: {airQuality.pm10}</p>
      <h2>Hotspots</h2>
      <ul>{hotspots.map((hotspot) => <li key={hotspot.location}>{hotspot.location}: AQI {hotspot.aqi}</li>)}</ul>
    </div>
  );
}
