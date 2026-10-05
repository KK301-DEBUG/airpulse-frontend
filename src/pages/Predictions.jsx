import { useEffect, useState } from "react";
import { api } from "../hooks/api";

export default function Predictions() {
  const [location, setLocation] = useState("Bengaluru");
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [horizon, setHorizon] = useState(6);

  async function loadPrediction(nextLocation = location, nextHorizon = horizon) {
    setLoading(true);
    setError("");
    try {
      setPrediction(await api.getPrediction(nextLocation.trim() || "Bengaluru", nextHorizon));
    } catch (requestError) {
      setPrediction(null);
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    api
      .getPrediction("Bengaluru", 6)
      .then(setPrediction)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    loadPrediction();
  }

  return (
    <div className="predictions prediction-page">
      <h1>Predictions</h1>
      <form className="prediction-location-form" onSubmit={handleSubmit}>
        <label htmlFor="prediction-location">Location</label>
        <input
          id="prediction-location"
          list="prediction-location-options"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="Enter a city"
        />
        <datalist id="prediction-location-options">
          <option value="Bengaluru" />
          <option value="Mumbai" />
          <option value="Delhi" />
          <option value="Chennai" />
          <option value="Hyderabad" />
          <option value="Kolkata" />
        </datalist>
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Get prediction"}
        </button>
      </form>
      <div className="prediction-horizons">{[6, 12, 24, 168].map((hours) => <button type="button" className={horizon === hours ? "active" : ""} key={hours} onClick={() => { setHorizon(hours); loadPrediction(location, hours); }}>{hours === 168 ? "7 days" : `${hours} hours`}</button>)}</div>
      {error ? <p role="alert">Unable to load prediction: {error}</p> : loading && !prediction ? <p>Loading prediction...</p> : prediction && <>
        <div className="prediction-metric-grid"><div><small>Current AQI</small><strong>{prediction.currentAqi}</strong></div><div><small>Predicted +{prediction.horizonHours}h</small><strong>{prediction.predictedAqi}</strong></div><div><small>Spike probability</small><strong>{prediction.spikeProbability}%</strong></div><div><small>Model confidence</small><strong>{Math.round(prediction.confidence * 100)}%</strong></div></div>
        <div className="prediction-summary">
          <strong>{prediction.location}</strong>
          <span>Expected change: {prediction.predictedAqi - prediction.currentAqi >= 0 ? "+" : ""}{prediction.predictedAqi - prediction.currentAqi} AQI points</span>
          <span className="prediction-basis">{prediction.dataBasis === "station" ? "Based on fresh reference-station data" : prediction.dataBasis === "stale-station" ? "Nearest station is stale — forecast is modelled" : "No fresh station data — forecast is modelled"}</span>
        </div>
        <section className="prediction-factors"><h2>Prediction factors</h2><div className="factor-grid"><Factor label="Fire activity" value={prediction.factors.fireDetections ? "HIGH IMPACT" : "LOW IMPACT"} /><Factor label="Wind conditions" value={prediction.factors.windSpeed < 8 ? "HIGH IMPACT" : "MEDIUM IMPACT"} /><Factor label="Weather humidity" value={`${prediction.factors.humidity}%`} /><Factor label="Citizen reports" value={`${prediction.factors.citizenReports} reports`} /></div></section>
      </>}
    </div>
  );
}

function Factor({ label, value }) { return <div className="factor-card"><span>{label}</span><strong>{value}</strong></div>; }
