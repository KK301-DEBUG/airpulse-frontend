import { useEffect, useState } from "react";
import { api } from "../hooks/api";

export default function Predictions() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getPrediction().then(setPrediction).catch((requestError) => setError(requestError.message));
  }, []);

  return (
    <div className="predictions">
      <h1>Predictions</h1>
      {error ? <p role="alert">Unable to load prediction: {error}</p> : prediction && <>
        <p>{prediction.location}: AQI {prediction.currentAqi} → {prediction.predictedAqi} in {prediction.horizonHours} hours</p>
        <p>Spike probability: {prediction.spikeProbability}% | Confidence: {Math.round(prediction.confidence * 100)}%</p>
        <p>Weather: {prediction.factors.temperature}°C, {prediction.factors.humidity}% humidity, wind {prediction.factors.windSpeed} km/h</p>
        <p>Fire detections: {prediction.factors.fireDetections} | Citizen reports: {prediction.factors.citizenReports}</p>
      </>}
    </div>
  );
}
