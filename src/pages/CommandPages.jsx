import { useEffect, useMemo, useState } from "react";
import {
  Activity, CheckCircle2, Flame, MapPin, Plus, Radio, RefreshCw, ShieldCheck, TriangleAlert, Upload, Wind,
} from "lucide-react";
import { api } from "../hooks/api";

const basisLabel = { station: "station data", "stale-station": "stale station", estimate: "model only" };

function BasisBadge({ basis }) {
  if (!basis) return null;
  return <span className={`basis-badge ${basis}`}>{basisLabel[basis] ?? basis}</span>;
}

function PageFrame({ eyebrow, title, description, children, action }) {
  return <div className="command-page"><div className="command-page-heading"><div><span className="section-kicker">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{action}</div>{children}</div>;
}

/* ---------------------------------------------------------------- live map */

// Equirectangular projection over the monitored bbox so markers land on real coordinates.
const MAP_BOUNDS = { minLat: 6.5, maxLat: 37.5, minLon: 68, maxLon: 97.5 };

function project({ latitude, longitude }) {
  const left = ((longitude - MAP_BOUNDS.minLon) / (MAP_BOUNDS.maxLon - MAP_BOUNDS.minLon)) * 100;
  const top = (1 - (latitude - MAP_BOUNDS.minLat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 100;
  return { left: `${Math.min(96, Math.max(4, left))}%`, top: `${Math.min(92, Math.max(6, top))}%` };
}

const LAYERS = ["AQI", "PM2.5", "Fire", "Reports", "Wind"];

export function LiveMapPage() {
  const [hotspots, setHotspots] = useState([]);
  const [fires, setFires] = useState([]);
  const [selected, setSelected] = useState(null);
  const [layer, setLayer] = useState("AQI");
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  async function load(refresh = false) {
    setStatus("loading");
    const [hotspotResult, fireResult] = await Promise.all([
      refresh ? api.detectHotspots() : api.getHotspots(),
      api.getFires().catch(() => ({ fires: [] })),
    ]);
    setHotspots(hotspotResult.hotspots ?? hotspotResult);
    setFires(fireResult.fires ?? []);
    setError("");
    setStatus("ready");
  }

  useEffect(() => {
    let active = true;
    Promise.all([api.getHotspots(), api.getFires().catch(() => ({ fires: [] }))])
      .then(([hotspotResult, fireResult]) => {
        if (!active) return;
        setHotspots(hotspotResult.hotspots ?? hotspotResult);
        setFires(fireResult.fires ?? []);
        setStatus("ready");
      })
      .catch((requestError) => {
        if (!active) return;
        setError(requestError.message);
        setStatus("error");
      });
    return () => { active = false; };
  }, []);

  const visibleFires = useMemo(
    () => (layer === "Fire" ? fires.slice(0, 120) : fires.slice(0, 12)),
    [fires, layer]
  );

  return <PageFrame
    eyebrow="GEOSPATIAL INTELLIGENCE"
    title="Live Environmental Map"
    description="Satellite fire detections fused with reference stations and citizen reports"
    action={<button className="map-layer-button" type="button" onClick={() => load(true)}><RefreshCw size={14} /> Re-detect</button>}
  >
    {error && <p role="alert" className="page-error">{error}</p>}
    <div className="full-map-layout">
      <div className="full-map-stage">
        <div className="map-grid-lines" />
        <div className="india-silhouette"><span /></div>
        {layer === "Fire" && visibleFires.map((fire, index) => (
          <span className="fire-pixel" key={`${fire.latitude}-${fire.longitude}-${index}`} style={project(fire)} title={`FRP ${fire.frp} MW`} />
        ))}
        {layer !== "Fire" && hotspots.map((hotspot) => (
          <button key={hotspot.location} className={`map-hotspot ${hotspot.severity}`} style={project(hotspot)} onClick={() => setSelected(hotspot)}>
            <i />{hotspot.location.replace(" metro cluster", "")}
          </button>
        ))}
        <div className="full-map-toolbar">
          <div className="map-search"><MapPin size={14} /> {status === "loading" ? "Detecting hotspots…" : `${hotspots.length} hotspots · ${fires.length} fires`}</div>
          {LAYERS.map((item) => <button key={item} className={layer === item ? "active" : ""} onClick={() => setLayer(item)}>{item}</button>)}
        </div>
        <div className="full-map-legend"><strong>{layer} layer</strong><span><i className="safe" /> Good</span><span><i className="warning" /> Moderate</span><span><i className="critical-dot" /> Critical</span></div>
      </div>
      {selected ? <HotspotPanel hotspot={selected} /> : <div className="map-empty-panel"><Radio size={22} /><strong>Select a hotspot</strong><p>Markers are placed at real coordinates. Choose one to inspect source attribution, evidence and the routed authority.</p></div>}
    </div>
  </PageFrame>;
}

function HotspotPanel({ hotspot }) {
  const attribution = Object.entries(hotspot.attribution ?? {}).sort((a, b) => b[1] - a[1]);
  return <aside className="hotspot-panel">
    <div className="panel-status critical-text">{hotspot.severity.toUpperCase()}</div>
    <h2>{hotspot.location}</h2>
    <div className="hotspot-big-metric"><strong>{hotspot.aqi}</strong><span>Current AQI</span></div>
    <div className="detail-pairs">
      <div><small>PM2.5</small><strong>{hotspot.pm25 === null ? "—" : `${hotspot.pm25} µg/m³`}</strong></div>
      <div><small>Confidence</small><strong>{Math.round(hotspot.confidence * 100)}%</strong></div>
      <div><small>Fire detections</small><strong>{hotspot.evidence?.fireDetections ?? 0}</strong></div>
      <div><small>Citizen reports</small><strong>{hotspot.evidence?.citizenReports ?? 0}</strong></div>
    </div>
    <div className="source-bars">
      <p>Source attribution</p>
      {attribution.length ? attribution.map(([label, share]) => (
        <span key={label}>{label} <b style={{ width: `${Math.round(share * 100)}%` }} /></span>
      )) : <span>No corroborating signals yet <b style={{ width: "4%" }} /></span>}
    </div>
    <p className="panel-note"><ShieldCheck size={14} /> {hotspot.source}</p>
    <p className="panel-note"><Wind size={14} /> Wind {hotspot.evidence?.windSpeed ?? "--"} km/h · humidity {hotspot.evidence?.humidity ?? "--"}%</p>
    <button className="primary-action" onClick={() => { window.location.href = "/alerts"; }}>Escalate to authority <Plus size={14} /></button>
  </aside>;
}

/* ------------------------------------------------------------------ reports */

export function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState({ location: "", category: "Smoke", description: "", latitude: "", longitude: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(({ coords }) =>
      setForm((current) => ({ ...current, latitude: coords.latitude, longitude: coords.longitude })), () => undefined);
    api.getReports().then(setReports).catch(() => setReports([]));
  }, []);

  function selectImage(event) {
    const selected = event.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  async function submit(event) {
    event.preventDefault();
    if (!form.description.trim()) return;
    setBusy(true);
    try {
      const report = await api.createReport({
        location: form.location || "Current location",
        category: form.category,
        description: form.description,
        latitude: form.latitude ? Number(form.latitude) : undefined,
        longitude: form.longitude ? Number(form.longitude) : undefined
      }, file);
      setReports((items) => [report, ...items]);
      setForm({ ...form, description: "" });
      setFile(null);
      setPreview("");
      setMessage(`${report.aiClassification} · ${Math.round((report.aiConfidence ?? 0) * 100)}% confidence · ${report.aiModel}`);
    } catch (requestError) {
      setMessage(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return <PageFrame eyebrow="COMMUNITY SIGNALS" title="Citizen Intelligence" description="Photos and observations classified by the vision model, then fed into hotspot detection">
    <div className="reports-layout">
      <section className="report-form-panel">
        <label className="upload-illustration"><Upload size={24} /><strong>Capture pollution</strong><span>{file?.name || "Attach a photo - the vision model grades it"}</span><input type="file" accept="image/*" onChange={selectImage} /></label>
        {preview && <img className="report-preview" src={preview} alt="Selected pollution report" />}
        <form onSubmit={submit} className="command-form">
          <label>Location<input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} placeholder="City or locality" /></label>
          <label>Category<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{["Smoke", "Industrial", "Garbage burning", "Crop burning", "Dust", "Traffic", "Other"].map((category) => <option key={category}>{category}</option>)}</select></label>
          <label>Description<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Describe what you observed..." /></label>
          <button className="primary-action" type="submit" disabled={busy}>{busy ? "Classifying…" : "Submit report"} <Plus size={14} /></button>
          {message && <p className="success-message"><CheckCircle2 size={14} /> {message}</p>}
        </form>
      </section>
      <section className="report-list">
        <div className="section-title-row"><h2>Recent reports</h2><span>{reports.length} total</span></div>
        {reports.length ? reports.map((report) => <article className="report-item" key={report.id}>
          <div className="report-icon"><Flame size={16} /></div>
          <div>
            <strong>{report.description}</strong>
            <p>{report.category} · {report.location} · {report.status}</p>
            <small>{report.aiClassification} · {Math.round((report.aiConfidence || 0) * 100)}% confidence · {report.aiModel}</small>
          </div>
        </article>) : <div className="empty-state">No citizen reports yet. Your observations will appear here.</div>}
      </section>
    </div>
  </PageFrame>;
}

/* ------------------------------------------------------------------- alerts */

export function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [location, setLocation] = useState("Delhi");
  const [threshold, setThreshold] = useState(150);
  const [busy, setBusy] = useState(false);

  async function load(runEvaluation = false) {
    setBusy(true);
    if (runEvaluation) await api.evaluateAlerts(true);
    const [alertResult, incidentResult] = await Promise.all([api.getAlerts(), api.getIncidents()]);
    setAlerts(alertResult);
    setIncidents(incidentResult);
    setBusy(false);
  }

  useEffect(() => {
    let active = true;
    Promise.all([api.getAlerts(), api.getIncidents()])
      .then(([alertResult, incidentResult]) => {
        if (!active) return;
        setAlerts(alertResult);
        setIncidents(incidentResult);
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  async function create(event) {
    event.preventDefault();
    const alert = await api.createAlert({ location, threshold: Number(threshold) });
    setAlerts((items) => [alert, ...items]);
  }

  async function change(alert, action) {
    const updated = await api.updateAlert(alert.id, action);
    setAlerts((items) => items.map((item) => (item.id === updated.id ? updated : item)));
  }

  const critical = incidents.filter((incident) => incident.severity === "critical" || incident.severity === "warning");

  return <PageFrame eyebrow="RESPONSE OPERATIONS" title="Alerts & Incidents" description="Predicted spikes routed to the responsible pollution board" action={<button className="map-layer-button" type="button" onClick={() => load(true)} disabled={busy}><RefreshCw size={14} /> {busy ? "Evaluating…" : "Run evaluation"}</button>}>
    {critical.length > 0 ? <div className="alert-hero"><TriangleAlert size={25} /><div><span>AIR QUALITY WATCH</span><h2>{critical.length} predicted spike{critical.length > 1 ? "s" : ""} routed to authorities</h2><p>{critical[0].location} · predicted {critical[0].predictedAqi ?? "--"} AQI · {critical[0].authority.body}</p></div><strong>{critical[0].severity.toUpperCase()}</strong></div> : <div className="alert-hero calm"><ShieldCheck size={25} /><div><span>NETWORK CLEAR</span><h2>No predicted spikes above threshold</h2><p>Alerts require a clear margin over the threshold; modelled forecasts need a wider one than station data.</p></div><strong>LOW</strong></div>}

    <div className="alerts-columns">
      <section className="alert-list">
        <h2>Active alert rules</h2>
        {alerts.length ? alerts.map((alert) => <div className="alert-row" key={alert.id}>
          <span className={`severity-dot ${alert.status === "resolved" ? "resolved" : ""}`} />
          <div>
            <strong>{alert.location}</strong>
            <p>{alert.origin === "auto" ? `Auto-raised · predicted ${alert.predictedAqi ?? "--"} AQI` : `Notify when AQI exceeds ${alert.threshold}`} · {alert.authority.body}</p>
          </div>
          <div className="alert-badges"><BasisBadge basis={alert.dataBasis} /><em>{alert.status === "resolved" ? "RESOLVED" : alert.enabled ? alert.severity.toUpperCase() : "PAUSED"}</em></div>
          <button type="button" className="alert-action" onClick={() => change(alert, alert.status === "resolved" ? "enable" : "resolve")}>{alert.status === "resolved" ? "Reopen" : "Resolve"}</button>
        </div>) : <div className="empty-state">No alert rules configured yet.</div>}
      </section>
      <form className="alert-create command-form" onSubmit={create}>
        <h2>Create alert rule</h2>
        <label>Location<input value={location} onChange={(event) => setLocation(event.target.value)} /></label>
        <label>AQI threshold<input type="number" min="50" max="500" value={threshold} onChange={(event) => setThreshold(event.target.value)} /></label>
        <button className="primary-action" type="submit">Create alert <Plus size={14} /></button>
      </form>
    </div>
  </PageFrame>;
}

/* ---------------------------------------------------------------- analytics */

export function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getAnalytics().then(setAnalytics).catch((requestError) => setError(requestError.message));
  }, []);

  const trend = analytics?.trend?.perCity?.[0]?.points ?? [];
  const max = Math.max(1, ...trend.map((point) => point.aqi));

  return <PageFrame eyebrow="SIGNAL ANALYSIS" title="Environmental Analytics" description="Computed from recorded observations, not placeholder series">
    {error && <p role="alert" className="page-error">{error}</p>}
    <div className="analytics-metrics">
      <Metric label="Observed readings" value={analytics?.metrics.observedReadings ?? "--"} />
      <Metric label="Citizen reports" value={analytics?.metrics.reports ?? "--"} />
      <Metric label="Active alerts" value={analytics?.metrics.activeAlerts ?? "--"} />
      <Metric label="Federated nodes" value={analytics?.metrics.federatedNodes ?? "--"} />
    </div>
    <section className="chart-panel">
      <div className="section-title-row">
        <div><span className="section-kicker">LAST 7 DAYS</span><h2>AQI trend</h2></div>
        <span className="chart-unit">US AQI</span>
      </div>
      {trend.length ? <div className="bar-chart">{trend.map((point) => <div className="chart-column" key={point.at}><span style={{ height: `${(point.aqi / max) * 100}%` }} /><small>{new Date(point.at).toLocaleDateString([], { weekday: "short" })}</small><b>{point.aqi}</b></div>)}</div>
        : <div className="empty-state">No readings recorded yet.</div>}
      <p className="panel-note">{analytics?.dataNote}</p>
    </section>
    <section className="zone-ranking">
      <div className="section-title-row"><h2>Most affected zones</h2><Activity size={16} /></div>
      {(analytics?.affectedZones ?? []).map((zone, index) => <div className="zone-row" key={zone.location}><b>0{index + 1}</b><span>{zone.location}<small className="zone-source">{zone.source}</small></span><strong>{zone.aqi} AQI</strong></div>)}
    </section>
    <section className="zone-ranking">
      <div className="section-title-row"><h2>Corridor risk</h2><Activity size={16} /></div>
      {(analytics?.corridors ?? []).map((corridor) => <div className="zone-row" key={corridor.id}><b>{corridor.risk.toUpperCase()}</b><span>{corridor.name}</span><strong>{corridor.predictedPeakAqi} peak</strong></div>)}
    </section>
  </PageFrame>;
}

function Metric({ label, value }) {
  return <div className="analytics-metric"><small>{label}</small><strong>{value}</strong><span>Live network data</span></div>;
}

/* ----------------------------------------------------------------- network */

export function NetworkPage() {
  const [network, setNetwork] = useState(null);
  useEffect(() => { api.getNetwork().then(setNetwork); }, []);
  const model = network?.globalModel;

  return <PageFrame eyebrow="PRIVACY-PRESERVING AI" title="Federated Climate Network" description="City nodes train locally and share only model updates" action={<button className="map-layer-button" type="button" onClick={() => api.getNetwork().then(setNetwork)}><RefreshCw size={14} /> Refresh</button>}>
    <div className="network-hero">
      <div className="network-orbit">
        <div className="global-model"><strong>GLOBAL AI MODEL</strong><span>v{model?.version || "--"}</span><small>{model?.accuracy ?? "--"}% accuracy</small></div>
        {(network?.nodes ?? []).map((node, index) => <div className="network-node" style={{ transform: `rotate(${index * 51}deg) translateY(-128px) rotate(-${index * 51}deg)` }} key={node.city}><span>{node.city}</span><small>{node.accuracy}%</small></div>)}
      </div>
      <div className="network-copy">
        <span className="privacy-badge"><ShieldCheck size={14} /> RAW DATA NOT SHARED</span>
        <h2>Local insight. Global intelligence.</h2>
        <p>Each city trains its model on local stations and citizen signals. Only gradient statistics are aggregated — raw readings, photos and precise locations never leave the node.</p>
        <div className="network-steps"><span>Local city data</span><span>Local model training</span><span>Update statistics only</span><span>Federated aggregation</span></div>
      </div>
    </div>
    <div className="network-node-grid">
      {(network?.nodes ?? []).map((node) => <div className="network-card" key={node.city}>
        <span className={node.status}>{node.status}</span>
        <strong>{node.city}</strong>
        <small>Model {node.modelVersion} · {node.accuracy}% accuracy</small>
        <small>{node.samples.toLocaleString()} local samples · synced {new Date(node.lastSync).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</small>
      </div>)}
    </div>
    <div className="section-title-row" style={{ marginTop: 26 }}><h2>Shared model catalogue</h2><Radio size={16} /></div>
    <div className="model-table">
      {(network?.models ?? []).map((entry) => <div className="model-row" key={entry.city}>
        <strong>{entry.city}</strong><span>{entry.version}</span><span>{entry.accuracy}% acc</span><span>{entry.update.samples.toLocaleString()} samples</span><span>residual {entry.update.meanResidual}</span><span>drift {entry.update.drift}</span>
      </div>)}
    </div>
  </PageFrame>;
}

/* --------------------------------------------------------------- corridors */

export function CorridorsPage() {
  const [corridors, setCorridors] = useState([]);
  const [busy, setBusy] = useState(false);

  async function load(refresh = false) {
    setBusy(true);
    const result = await (refresh ? api.refreshCorridors() : api.getCorridors());
    setCorridors(result);
    setBusy(false);
  }

  useEffect(() => {
    let active = true;
    api.getCorridors()
      .then((result) => { if (active) setCorridors(result); })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  return <PageFrame eyebrow="ECONOMIC CORRIDORS" title="Corridor Forecasts" description="Every member city is predicted individually, then summarised by its worst peak" action={<button className="map-layer-button" type="button" onClick={() => load(true)} disabled={busy}><RefreshCw size={14} /> {busy ? "Forecasting…" : "Re-forecast"}</button>}>
    <div className="corridor-grid">
      {corridors.map((corridor) => <article className={`corridor-card ${corridor.risk}`} key={corridor.id}>
        <div className="corridor-card-head"><span className="corridor-risk">{corridor.risk}</span><span>{corridor.cities.join(" · ")}</span></div>
        <h2>{corridor.name}</h2>
        <p>{corridor.description}</p>
        <div className="corridor-metrics">
          <div><small>Current AQI</small><strong>{corridor.currentAqi}</strong></div>
          <div><small>Peak in 24h</small><strong>{corridor.predictedPeakAqi}</strong></div>
          <div><small>Spike risk</small><strong>{corridor.spikeProbability}%</strong></div>
          <div><small>Worst city</small><strong>{corridor.worstCity}</strong></div>
        </div>
      </article>)}
    </div>
  </PageFrame>;
}