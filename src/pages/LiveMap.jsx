import { useEffect, useState } from "react";
import { api } from "../hooks/api";

export default function LiveMap() {
  const [hotspots, setHotspots] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getHotspots().then(setHotspots).catch((requestError) => setError(requestError.message));
  }, []);

  return (
    <div className="live-map">
      <h1>Live Map</h1>
      {error ? <p role="alert">Unable to load hotspots: {error}</p> : <ul>{hotspots.map((hotspot) => <li key={hotspot.location}>{hotspot.location}: AQI {hotspot.aqi} ({hotspot.latitude}, {hotspot.longitude})</li>)}</ul>}
    </div>
  );
}
