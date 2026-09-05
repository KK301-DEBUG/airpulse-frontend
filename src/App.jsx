import { useEffect, useState } from "react";
import {
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { animate, stagger } from "animejs";
import Lenis from "lenis";
import {
  Activity,
  Bell,
  ChevronDown,
  CloudRain,
  CloudSun,
  Droplets,
  Gauge,
  LayoutDashboard,
  Map,
  Menu,
  Moon,
  Navigation,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Sun,
  Thermometer,
  Wind,
  X,
  Zap,
} from "lucide-react";
import { firebaseConfigured } from "./lib/firebase";
import "./App.css";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, path: "/" },
  { label: "Live map", icon: Map, path: "/map" },
  { label: "Predictions", icon: Activity, path: "/predictions" },
  { label: "Reports", icon: Gauge, path: "/reports" },
];

const forecast = [
  {
    day: "Now",
    icon: Sun,
    temp: "24°",
    range: "18° / 26°",
    condition: "Clear",
  },
  {
    day: "Tue",
    icon: CloudSun,
    temp: "23°",
    range: "17° / 25°",
    condition: "Partly cloudy",
  },
  {
    day: "Wed",
    icon: CloudRain,
    temp: "21°",
    range: "16° / 23°",
    condition: "Light showers",
  },
  {
    day: "Thu",
    icon: Sun,
    temp: "25°",
    range: "18° / 27°",
    condition: "Clear",
  },
];

function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    let frame;
    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);
}

function AirPulse() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState("Ranchi");
  const [alerts, setAlerts] = useState(true);
  useSmoothScroll();
  useEffect(() => {
    animate(".reveal", {
      opacity: [0, 1],
      translateY: [14, 0],
      delay: stagger(55),
      duration: 650,
      ease: "outQuart",
    });
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "is-open" : ""}`}>
        <div className="brand-row">
          <div className="brand-mark">
            <span />
            <span />
            <span />
          </div>
          <span className="brand-name">
            airpulse<span>.</span>
          </span>
          <button
            className="icon-button close-menu"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>
        <div className="workspace-switcher">
          <div className="workspace-avatar">A</div>
          <div>
            <strong>AirPulse HQ</strong>
            <small>
              Workspace / {firebaseConfigured ? "Firebase" : "Local mode"}
            </small>
          </div>
          <ChevronDown size={15} />
        </div>
        <p className="nav-label">Monitor</p>
        <nav className="main-nav">
          {navItems.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={17} strokeWidth={1.8} />
              <span>{label}</span>
              {label === "Predictions" && <em>Beta</em>}
            </NavLink>
          ))}
        </nav>
        <p className="nav-label">Manage</p>
        <nav className="main-nav">
          <button className="nav-link">
            <Settings2 size={17} strokeWidth={1.8} />
            <span>Settings</span>
          </button>
          <button className="nav-link">
            <Bell size={17} strokeWidth={1.8} />
            <span>Alerts</span>
            <b className="alert-dot" />
          </button>
        </nav>
        <div className="sidebar-footer">
          <div className="status-line">
            <span className="pulse-dot" /> System status{" "}
            <strong>Operational</strong>
          </div>
          <div className="user-row">
            <div className="user-avatar">RK</div>
            <div>
              <strong>Riya Kapoor</strong>
              <small>Admin account</small>
            </div>
            <span className="more-dots">•••</span>
          </div>
        </div>
      </aside>
      {mobileOpen && (
        <button
          className="mobile-scrim"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
        />
      )}
      <main className="main-content">
        <header className="topbar">
          <button
            className="icon-button menu-button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="breadcrumb">
            <span>Workspace</span>
            <span>/</span>
            <strong>
              {location.pathname === "/"
                ? "Overview"
                : location.pathname.slice(1)}
            </strong>
          </div>
          <div className="top-actions">
            <div className="search-box">
              <Search size={16} />
              <input
                placeholder="Search location"
                aria-label="Search location"
              />
            </div>
            <button
              className={`icon-button notification-button ${alerts ? "has-alert" : ""}`}
              onClick={() => setAlerts(!alerts)}
              aria-label="Toggle alerts"
            >
              <Bell size={18} />
            </button>
            <div className="top-avatar">RK</div>
          </div>
        </header>
        <div className="page-content">
          <div className="page-heading reveal">
            <div>
              <p className="eyebrow">
                <span className="live-indicator" /> Live atmosphere intelligence
              </p>
              <h1>Good morning, Riya</h1>
              <p className="heading-copy">
                Your atmosphere is being monitored. Here's what's happening
                across your workspace.
              </p>
            </div>
            <div className="heading-controls">
              <button className="date-button">
                <span>Last updated</span>
                <strong>Today, 09:42 AM</strong>
                <ChevronDown size={15} />
              </button>
              <button
                className="primary-button"
                onClick={() => navigate("/reports")}
              >
                <Zap size={15} fill="currentColor" /> Generate report
              </button>
            </div>
          </div>
          <Routes>
            <Route
              path="*"
              element={
                <Dashboard
                  selectedZone={selectedZone}
                  setSelectedZone={setSelectedZone}
                  alerts={alerts}
                  forecast={forecast}
                />
              }
            />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function Dashboard({ selectedZone, setSelectedZone, alerts, forecast }) {
  return (
    <>
      <section className="stats-grid">
        <StatCard
          label="Air quality index"
          value="42"
          unit="US AQI"
          status="Good"
          tone="green"
          icon={<Wind />}
          trend="12%"
          trendCopy="better than yesterday"
        />
        <StatCard
          label="Temperature"
          value="24"
          unit="°C"
          status="Feels like 25°"
          tone="yellow"
          icon={<Thermometer />}
          trend="2°"
          trendCopy="warmer than avg."
        />
        <StatCard
          label="Humidity"
          value="48"
          unit="%"
          status="Comfortable"
          tone="blue"
          icon={<Droplets />}
          trend="6%"
          trendCopy="lower than yesterday"
        />
        <StatCard
          label="Wind speed"
          value="12"
          unit="km/h"
          status="From the NE"
          tone="purple"
          icon={<Navigation />}
          trend="3 km/h"
          trendCopy="faster than yesterday"
        />
      </section>
      <section className="primary-grid">
        <article className="panel atmosphere-panel reveal">
          <PanelHeader
            title="Atmosphere overview"
            kicker="Real-time sensor network"
            action="View live map"
            path="/map"
          />
          <div className="atmosphere-main">
            <div className="aqi-ring">
              <div className="ring-glow" />
              <strong>42</strong>
              <span>Good air</span>
              <small>US AQI</small>
            </div>
            <div className="atmosphere-copy">
              <div className="location-row">
                <Navigation size={14} className="map-pin" />
                <strong>{selectedZone}, India</strong>
                <span className="location-change">Change location</span>
              </div>
              <p>
                Air quality is ideal for outdoor activities. Enjoy your day
                outside.
              </p>
              <div className="meter">
                <div className="meter-track">
                  <span />
                </div>
                <div className="meter-labels">
                  <span>Good</span>
                  <span>Moderate</span>
                  <span>Unhealthy</span>
                  <span>Hazardous</span>
                </div>
              </div>
            </div>
          </div>
          <div className="chart-wrap">
            <div className="chart-title">
              <span>24-hour AQI trend</span>
              <span className="chart-value">
                42 <small>current</small>
              </span>
            </div>
            <AqiChart />
          </div>
        </article>
        <article className="panel forecast-panel reveal">
          <PanelHeader
            title="Local forecast"
            kicker="Ranchi, India"
            action="7 days"
            path="/predictions"
          />
          <div className="forecast-list">
            {forecast.map(
              ({ day, icon: Icon, temp, range, condition }, index) => (
                <div
                  className={`forecast-row ${index === 0 ? "current" : ""}`}
                  key={day}
                >
                  <span className="forecast-day">{day}</span>
                  <Icon
                    size={20}
                    className={`forecast-icon ${index === 2 ? "rain" : ""}`}
                  />
                  <strong>{temp}</strong>
                  <span className="forecast-range">{range}</span>
                  <small>{condition}</small>
                </div>
              ),
            )}
          </div>
          <div className="sun-line">
            <Sun size={15} />
            <span>
              Sunrise <b>05:38</b>
            </span>
            <span className="sun-progress">
              <i />
            </span>
            <span>
              Sunset <b>18:21</b>
            </span>
          </div>
        </article>
      </section>
      <section className="secondary-grid">
        <article className="panel pollutant-panel reveal">
          <PanelHeader
            title="Pollutant breakdown"
            kicker="Concentration by type"
            action="Details"
            path="/reports"
          />
          <div className="pollutants">
            <Pollutant
              name="PM2.5"
              value="12"
              unit="µg/m³"
              percent="18%"
              color="green"
              note="Excellent"
            />
            <Pollutant
              name="PM10"
              value="24"
              unit="µg/m³"
              percent="32%"
              color="teal"
              note="Good"
            />
            <Pollutant
              name="NO₂"
              value="18"
              unit="ppb"
              percent="26%"
              color="yellow"
              note="Normal"
            />
            <Pollutant
              name="O₃"
              value="31"
              unit="ppb"
              percent="44%"
              color="orange"
              note="Normal"
            />
          </div>
        </article>
        <article className="panel prediction-panel reveal">
          <PanelHeader
            title="Prediction confidence"
            kicker="AI-powered outlook"
            action="Explore predictions"
            path="/predictions"
          />
          <div className="prediction-content">
            <div className="confidence-score">
              <strong>
                94<span>%</span>
              </strong>
              <small>Confidence</small>
            </div>
            <div className="prediction-message">
              <div className="sparkle-icon">
                <Sparkles size={15} />
              </div>
              <p>
                Air quality is expected to remain <strong>good</strong> for the
                next 48 hours.
              </p>
              <span>Based on 14,280 data points</span>
            </div>
          </div>
          <div className="confidence-bar">
            <span />
          </div>
          <div className="prediction-foot">
            <span>Model updated 8 min ago</span>
            <span className="verified">
              <ShieldCheck size={14} /> Verified model
            </span>
          </div>
        </article>
      </section>
      <section className="bottom-strip reveal">
        <div className="strip-icon">
          <CloudSun size={22} />
        </div>
        <div>
          <strong>Conditions are favorable today</strong>
          <p>
            Low pollution and comfortable temperatures make it a great day to be
            outdoors.
          </p>
        </div>
        <button
          className="text-button"
          onClick={() =>
            setSelectedZone(selectedZone === "Ranchi" ? "New Delhi" : "Ranchi")
          }
        >
          Compare locations <span>→</span>
        </button>
      </section>
      {!alerts && (
        <div className="alert-toast">
          <Moon size={15} /> Alerts paused for this session
        </div>
      )}
    </>
  );
}

function StatCard({
  label,
  value,
  unit,
  status,
  tone,
  icon,
  trend,
  trendCopy,
}) {
  return (
    <article className="stat-card reveal">
      <div className={`stat-icon ${tone}`}>{icon}</div>
      <div className="stat-label">
        {label}
        <span className={`status-pill ${tone}`}>{status}</span>
      </div>
      <div className="stat-value">
        {value}
        <small>{unit}</small>
      </div>
      <div className="trend">
        <span>↑ {trend}</span> {trendCopy}
      </div>
    </article>
  );
}
function PanelHeader({ title, kicker, action, path }) {
  return (
    <div className="panel-header">
      <div>
        <p>{kicker}</p>
        <h2>{title}</h2>
      </div>
      <NavLink to={path} className="panel-action">
        {action} <span>→</span>
      </NavLink>
    </div>
  );
}
function Pollutant({ name, value, unit, percent, color, note }) {
  return (
    <div className="pollutant-row">
      <div className="pollutant-name">
        <span className={`pollutant-dot ${color}`} />
        <strong>{name}</strong>
        <small>{note}</small>
      </div>
      <div className="pollutant-bar">
        <span className={color} style={{ width: percent }} />
      </div>
      <div className="pollutant-value">
        <strong>{value}</strong>
        <small>{unit}</small>
      </div>
    </div>
  );
}
function AqiChart() {
  return (
    <div className="aqi-chart">
      <svg
        viewBox="0 0 700 170"
        preserveAspectRatio="none"
        role="img"
        aria-label="Air quality trend chart"
      >
        <defs>
          <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#3da977" stopOpacity=".25" />
            <stop offset="1" stopColor="#3da977" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          className="chart-area"
          d="M0,108 C45,98 65,115 100,97 S155,75 195,88 S245,111 280,89 S330,54 370,72 S425,96 460,73 S515,57 550,63 S610,43 700,34 V170 H0 Z"
        />
        <path
          className="chart-line"
          d="M0,108 C45,98 65,115 100,97 S155,75 195,88 S245,111 280,89 S330,54 370,72 S425,96 460,73 S515,57 550,63 S610,43 700,34"
        />
        <circle cx="700" cy="34" r="5" />
      </svg>
      <div className="chart-axis">
        <span>12 AM</span>
        <span>6 AM</span>
        <span>12 PM</span>
        <span>6 PM</span>
        <span>Now</span>
      </div>
    </div>
  );
}

export default function App() {
  return <AirPulse />;
}
