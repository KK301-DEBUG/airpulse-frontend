import { useEffect, useState } from "react";
import { api } from "../hooks/api";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getReports().then(setReports).catch((requestError) => setError(requestError.message));
  }, []);

  return (
    <div className="reports">
      <h1>Reports</h1>
      {error ? <p role="alert">Unable to load reports: {error}</p> : reports.length ? <ul>{reports.map((report) => <li key={report.id}>{report.location}: {report.description}</li>)}</ul> : <p>No reports yet.</p>}
    </div>
  );
}
