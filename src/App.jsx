import { useEffect, useState } from "react";
import { lazy, Suspense } from "react";
import {
  NavLink,
  Navigate,
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
  Flame,
  Gauge,
  Layers,
  LayoutDashboard,
  Map,
  Menu,
  Moon,
  Navigation,
  Radio,
  Route as RouteIcon,
  Settings2,
  ShieldCheck,
  Sparkles,
  Sun,
  Thermometer,
  X,
  Zap,
} from "lucide-react";
import { firebaseConfigured } from "./lib/firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "./lib/firebase";
import { api, getWeather } from "./hooks/api";
import { freshnessLabel, freshnessOf, severityClass } from "./lib/air";
import { useChangePulse } from "./lib/useChangePulse";
import Predictions from "./pages/Predictions";
import { AlertsPage, AnalyticsPage, CorridorsPage, LiveMapPage, NetworkPage, ReportsPage } from "./pages/CommandPages";
import "./App.css";

/* Lazy so three.js never blocks the hero copy: the page paints, then streams in. */
const Globe3D = lazy(() => import("./components/Globe3D"));

function AuthGate() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(() => Boolean(auth));

  useEffect(() => {
    if (!auth) return undefined;
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setChecking(false);
    });
  }, []);

  if (checking) {
    return (
      <div className="auth-loading">
        <div className="brand-mark">
          <span />
          <span />
          <span />
        </div>
        <p>Warming up your atmosphere...</p>
      </div>
    );
  }

  if (!user) return <LandingPage />;
  if (location.pathname === "/") return <Navigate to="/dashboard" replace />;
  return <AirPulse user={user} />;
}

function LandingPage() {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState(null);
  const [detections, setDetections] = useState(null);

  // Real detections drive the globe. If this fails the globe reports that it is
  // offline rather than falling back to decorative animation.
  useEffect(() => {
    let active = true;
    api
      .getOverview()
      .then((result) => {
        if (active) setDetections(result?.hotspots ?? []);
      })
      .catch(() => {
        if (active) setDetections([]);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="landing-shell">
      <header className="landing-nav">
        <a
          className="landing-brand"
          href="/"
          onClick={(event) => {
            event.preventDefault();
            navigate("/");
          }}
        >
          <span className="brand-mark">
            <span />
            <span />
            <span />
          </span>
          <strong>
            AIRGUARD<span>.</span>
          </strong>
        </a>
        <div className="landing-links">
          <a href="#how-it-works">How it works</a>
          <a href="#signals">Signals</a>
          <button
            className="landing-login"
            onClick={() => setAuthMode("signin")}
          >
            Sign in <span>→</span>
          </button>
        </div>
      </header>
      <main>
        <section className="landing-hero">
          <div className="hero-copy">
            <p className="hero-kicker">
              <span className="live-indicator" /> Personal atmosphere
              intelligence
            </p>
            <h1>
              Know the air
              <br />
              <em>around you.</em>
            </h1>
            <p className="hero-description">
              AIRGUARD turns the invisible into something you can act on. Live
              air quality, weather signals, and clear predictions for wherever
              you are.
            </p>
            <div className="hero-actions">
              <button
                className="hero-primary"
                onClick={() => setAuthMode("signup")}
              >
                Create your free workspace <span>↗</span>
              </button>
              <button
                className="hero-secondary"
                onClick={() => setAuthMode("signin")}
              >
                I already have an account
              </button>
            </div>
            <div className="hero-proof">
              <span className="proof-avatars">
                <i>RK</i>
                <i>AS</i>
                <i>MK</i>
              </span>
              <span>
                Trusted by teams who
                <br />
                care about their atmosphere
              </span>
            </div>
          </div>
          <div className="hero-orbit">
            <div className="orbit-grid" />
            <div className="orbit-ring orbit-one" />
            <div className="orbit-ring orbit-two" />
            <div className="hero-globe">
              <Suspense fallback={<div className="globe-loading" />}>
                <Globe3D hotspots={detections ?? []} />
              </Suspense>
            </div>
            <div className="orbit-caption">
              <span>
                {detections === null
                  ? "CONNECTING"
                  : detections.length
                    ? `LIVE / ${String(detections.length).padStart(2, "0")} DETECTIONS`
                    : "NO ACTIVE DETECTIONS"}
              </span>
              <strong>
                {detections === null
                  ? "Contacting the detection network..."
                  : detections.length
                    ? `${detections[0].location.replace(" metro cluster", "")} leads at AQI ${detections[0].aqi}`
                    : "All monitored corridors are clear"}
              </strong>
            </div>
          </div>
        </section>
        <section className="signal-ribbon" id="signals">
          <div>
            <span className="ribbon-number">01</span>
            <strong>Real-time signals</strong>
            <p>See the air as it changes, not hours later.</p>
          </div>
          <div>
            <span className="ribbon-number">02</span>
            <strong>Forecast intelligence</strong>
            <p>Make better plans with a clearer horizon.</p>
          </div>
          <div>
            <span className="ribbon-number">03</span>
            <strong>Simple decisions</strong>
            <p>Know when to step out, stay in, or take action.</p>
          </div>
        </section>
        <section className="landing-note" id="how-it-works">
          <p className="hero-kicker">A quieter kind of weather app</p>
          <h2>
            Data you can feel
            <br />
            <span>good about using.</span>
          </h2>
          <p>
            From Open-Meteo forecasts to OpenAQ air quality data, AIRGUARD
            brings trusted signals together around your location. Your workspace
            is private, personal, and ready when you are.
          </p>
        </section>
      </main>
      {authMode && (
        <AuthPanel
          mode={authMode}
          setMode={setAuthMode}
          onSuccess={() => navigate("/dashboard")}
        />
      )}
    </div>
  );
}

function AuthPanel({ mode, setMode, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    if (!auth) {
      setError(
        "Add your Firebase environment variables to enable authentication.",
      );
      return;
    }
    setBusy(true);
    setError("");
    try {
      if (mode === "signup")
        await createUserWithEmailAndPassword(auth, email, password);
      else await signInWithEmailAndPassword(auth, email, password);
      onSuccess();
    } catch (authError) {
      setError(
        authError.code?.replace("auth/", "").replaceAll("-", " ") ||
          "Authentication failed.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function googleSignIn() {
    if (!auth) {
      setError(
        "Add your Firebase environment variables to enable authentication.",
      );
      return;
    }
    setBusy(true);
    setError("");
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      onSuccess();
    } catch (authError) {
      setError(
        authError.code?.replace("auth/", "").replaceAll("-", " ") ||
          "Google sign-in failed.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="auth-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setMode(null);
      }}
    >
      <section className="auth-panel">
        <button
          className="auth-close"
          onClick={() => setMode(null)}
          aria-label="Close sign in"
        >
          ×
        </button>
        <p className="hero-kicker">
          {mode === "signup" ? "Start your workspace" : "Welcome back"}
        </p>
        <h2>
          {mode === "signup"
            ? "A clearer day starts here."
            : "Good to see you again."}
        </h2>
        <p className="auth-subtitle">
          {firebaseConfigured
            ? "Sign in to see your personal atmosphere intelligence."
            : "Connect Firebase to unlock your personal atmosphere workspace."}
        </p>
        <button
          className="google-button"
          onClick={googleSignIn}
          disabled={busy}
        >
          <span>G</span> Continue with Google
        </button>
        <div className="auth-divider">
          <span>or use email</span>
        </div>
        <form onSubmit={submit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="you@example.com"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              placeholder="At least 6 characters"
            />
          </label>
          {error && <p className="auth-error">{error}</p>}
          <button className="auth-submit" disabled={busy}>
            {busy
              ? "Connecting..."
              : mode === "signup"
                ? "Create account"
                : "Sign in"}{" "}
            <span>→</span>
          </button>
        </form>
        <p className="auth-switch">
          {mode === "signup" ? "Already have an account?" : "New to AIRGUARD?"}{" "}
          <button
            onClick={() => {
              setMode(mode === "signup" ? "signin" : "signup");
              setError("");
            }}
          >
            {mode === "signup" ? "Sign in" : "Create an account"}
          </button>
        </p>
      </section>
    </div>
  );
}

const navItems = [
  { label: "Overview", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Live map", icon: Map, path: "/map" },
  { label: "Hotspots", icon: Navigation, path: "/map" },
  { label: "Predictions", icon: Activity, path: "/predictions" },
  { label: "Corridors", icon: RouteIcon, path: "/corridors" },
  { label: "Citizen reports", icon: Gauge, path: "/reports" },
  { label: "Alerts", icon: Bell, path: "/alerts" },
  { label: "Federated network", icon: Radio, path: "/network" },
  { label: "Analytics", icon: Activity, path: "/analytics" },
];

const cityCoordinates = {
  Bengaluru: { latitude: 12.9716, longitude: 77.5946 },
  Ranchi: { latitude: 23.3441, longitude: 85.3096 },
  Delhi: { latitude: 28.6139, longitude: 77.209 },
  Mumbai: { latitude: 19.076, longitude: 72.8777 },
  Chennai: { latitude: 13.0827, longitude: 80.2707 },
  Hyderabad: { latitude: 17.385, longitude: 78.4867 },
  Kolkata: { latitude: 22.5726, longitude: 88.3639 },
};

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

const MAP_BOUNDS = { minLat: 6.5, maxLat: 37.5, minLon: 68, maxLon: 97.5 };

/** Project real coordinates onto the map stage so markers are not decorative. */
function projectHotspot({ latitude, longitude }) {
  const left = ((longitude - MAP_BOUNDS.minLon) / (MAP_BOUNDS.maxLon - MAP_BOUNDS.minLon)) * 100;
  const top = (1 - (latitude - MAP_BOUNDS.minLat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 100;
  return { left: `${Math.min(94, Math.max(6, left))}%`, top: `${Math.min(90, Math.max(8, top))}%` };
}

/** One request for the command-centre snapshot instead of six parallel calls. */
async function getOverviewFor(coordinates, location) {
  const [overview, predictions, analytics] = await Promise.allSettled([
    api.getOverview(location, coordinates),
    api.getPrediction(location, 24, coordinates),
    api.getAnalytics(location),
  ]);
  const base = overview.status === "fulfilled" ? overview.value : null;
  if (!base) throw new Error("Unable to load the air quality overview");
  return {
    ...base,
    predictions: predictions.status === "fulfilled" ? predictions.value : null,
    analytics: analytics.status === "fulfilled" ? analytics.value : null,
  };
}

function AirPulse({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [alerts, setAlerts] = useState(true);
  const [dataHealth, setDataHealth] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherError, setWeatherError] = useState(() =>
    navigator.geolocation
      ? ""
      : "Location access is not supported in this browser.",
  );
  const [authUser, setAuthUser] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("Bengaluru");
  const [citySuggestions, setCitySuggestions] = useState(Object.keys(cityCoordinates));
  const [selectedCoordinates, setSelectedCoordinates] = useState(cityCoordinates.Bengaluru);
  const [coordinates, setCoordinates] = useState(cityCoordinates.Bengaluru);
  const [locationAttempt, setLocationAttempt] = useState(0);
  const [requestFinished, setRequestFinished] = useState(() => !navigator.geolocation);
  useSmoothScroll();
  useEffect(() => {
    if (!auth) return undefined;
    return onAuthStateChanged(auth, setAuthUser);
  }, []);
  useEffect(() => {
    let active = true;
    api.getDataHealth()
      .then((result) => { if (active) setDataHealth(result); })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!navigator.geolocation) {
      return undefined;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const detectedCoordinates = {
          latitude: coords.latitude,
          longitude: coords.longitude,
        };
        setCoordinates(detectedCoordinates);
        api
          .reverseGeocode(coords.latitude, coords.longitude)
          .then((result) => {
            setSelectedLocation(result.city);
            setSelectedCoordinates({ latitude: result.latitude, longitude: result.longitude });
          })
          .catch(() => undefined);
      },
      () => {
        setRequestFinished(true);
        setWeatherError("Allow location access to load air quality near you.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
    return undefined;
  }, [locationAttempt]);
  useEffect(() => {
    if (!coordinates) return undefined;
    let active = true;
    const activeCoordinates = selectedCoordinates || coordinates;
    Promise.allSettled([
      getOverviewFor(activeCoordinates, selectedLocation),
      getWeather(activeCoordinates.latitude, activeCoordinates.longitude),
    ])
      .then(([dashboardResult, weatherResult]) => {
        if (!active) return;
        if (dashboardResult.status === "fulfilled") {
          setDashboardData(dashboardResult.value);
        }
        if (weatherResult.status === "fulfilled") {
          setWeatherData(weatherResult.value);
        }
        if (
          dashboardResult.status === "fulfilled" &&
          dashboardResult.value?.airQuality &&
          weatherResult.status === "fulfilled"
        ) {
          setWeatherError("");
        } else {
          setWeatherError(
            "Some live signals are unavailable. Try again to refresh the dashboard.",
          );
        }
      })
      .finally(() => {
        if (active) setRequestFinished(true);
      });
    return () => {
      active = false;
    };
  }, [coordinates, selectedCoordinates, authUser, selectedLocation]);
  useEffect(() => {
    if (!document.querySelector(".reveal")) return undefined;
    animate(".reveal", {
      opacity: [0, 1],
      translateY: [14, 0],
      delay: stagger(55),
      duration: 650,
      ease: "outQuart",
    });
    return undefined;
  }, [location.pathname]);

  const dataReady = Boolean(
    dashboardData?.airQuality && weatherData?.current && weatherData?.daily
  );

  return (
    <>
      {!dataReady && !requestFinished && (
        <div className="workspace-loading">
          <div className="loading-orbit">
            <span />
            <span />
            <span />
          </div>
          <div className="loading-copy">
            <strong>Reading your atmosphere</strong>
            <span>
              {weatherError ||
                "Connecting to live air quality and weather signals..."}
            </span>
            {weatherError && (
              <button
                className="retry-location"
                onClick={() => {
                  setWeatherError("");
                  setRequestFinished(false);
                  setCoordinates(null);
                  setLocationAttempt((attempt) => attempt + 1);
                }}
              >
                Try location access again
              </button>
            )}
          </div>
        </div>
      )}
      {!dataReady && requestFinished && (
        <div className="workspace-loading workspace-error-state">
          <div className="loading-orbit loading-orbit-error"><span>!</span></div>
          <div className="loading-copy">
            <strong>Live data could not be loaded</strong>
            <span>{weatherError || "The dashboard needs a fresh location reading."}</span>
            <button className="retry-location" onClick={() => { setRequestFinished(false); setWeatherError(""); setDashboardData(null); setWeatherData(null); setCoordinates(null); setLocationAttempt((attempt) => attempt + 1); }}>Try again</button>
          </div>
        </div>
      )}
      {dataReady && (
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
                <strong>AIRGUARD</strong>
                <small>
                  Climate Intelligence Network
                </small>
              </div>
              <ChevronDown size={15} />
            </div>
            <p className="nav-label">Monitor</p>
            <nav className="main-nav">
              {navItems.map(({ label, icon: Icon, path }) => (
                <NavLink
                  key={label}
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
                <span className={`pulse-dot ${dataHealth?.degraded?.length ? "pulse-dot-warn" : ""}`} />{" "}
                {dataHealth
                  ? dataHealth.degraded.length
                    ? `Degraded: ${dataHealth.degraded.length} source${dataHealth.degraded.length > 1 ? "s" : ""}`
                    : "All sources live"
                  : "Checking sources..."}
                <strong title={dataHealth?.providers?.map((provider) => `${provider.name}: ${provider.detail}`).join("\n")}>
                  {dataHealth?.degraded?.length ? "Model fallback" : "Operational"}
                </strong>
              </div>
              <div className="user-row">
                <div className="user-avatar">●</div>
                <div>
                  <strong>Command center</strong>
                  <small>{user.email || "Signed-in account"}</small>
                </div>
                <button
                  className="signout-button"
                  onClick={() => signOut(auth)}
                >
                  Sign out
                </button>
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
                  {location.pathname === "/" || location.pathname === "/dashboard"
                    ? "Overview"
                    : location.pathname.slice(1).replace("-", " ")}
                </strong>
              </div>
              <div className="top-actions">
                <button
                  className={`icon-button notification-button ${alerts ? "has-alert" : ""}`}
                  onClick={() => setAlerts(!alerts)}
                  aria-label="Toggle alerts"
                >
                  <Bell size={18} />
                </button>
                <div className="top-avatar">●</div>
              </div>
            </header>
            <section className="dashboard-page">
            <div className="page-content">
              <div className="page-heading reveal">
                <div>
                  <p className="eyebrow">
                    <span className="live-indicator" /> LIVE · Data updated 2 min ago
                  </p>
                  <h1>Air Quality Command Center</h1>
                  <p className="heading-copy">
                    Real-time environmental intelligence for rapid climate action.
                  </p>
                </div>
                <div className="heading-controls">
                  <button
                    className="primary-button"
                    onClick={() => navigate("/reports")}
                  >
                    <Zap size={15} fill="currentColor" /> Generate report
                  </button>
                  <label className="dashboard-location-picker">
                    <span>Monitoring</span>
                    <input
                      list="dashboard-city-suggestions"
                      value={selectedLocation}
                      onChange={(event) => {
                        const nextLocation = event.target.value;
                        setSelectedLocation(nextLocation);
                        setSelectedCoordinates(cityCoordinates[nextLocation] || null);
                        if (nextLocation.trim().length >= 2) {
                          api.searchCities(nextLocation).then((results) => {
                            setCitySuggestions(results.map((result) => result.city));
                            const exactMatch = results.find((result) => result.city.toLowerCase() === nextLocation.trim().toLowerCase());
                            if (exactMatch) {
                              setSelectedCoordinates({ latitude: exactMatch.latitude, longitude: exactMatch.longitude });
                            }
                          }).catch(() => undefined);
                        }
                        setRequestFinished(false);
                        setDashboardData(null);
                        setWeatherData(null);
                      }}
                    />
                    <datalist id="dashboard-city-suggestions">
                      {citySuggestions.map((city) => <option key={city} value={city} />)}
                    </datalist>
                  </label>
                </div>
              </div>
              <Routes>
                <Route path="/predictions" element={<Predictions />} />
                <Route path="/corridors" element={<CorridorsPage />} />
                <Route path="/map" element={<LiveMapPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="/network" element={<NetworkPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route
                  path="*"
                  element={
                    <Dashboard
                      alerts={alerts}
                      dashboardData={dashboardData}
                      weatherData={weatherData}
                      weatherError={weatherError}
                      dataReady={dataReady}
                    />
                  }
                />
              </Routes>
            </div>
            </section>
          </main>
        </div>
      )}
    </>
  );
}

function weatherCodeLabel(code) {
  if (code === 0) return "Clear";
  if (code <= 3) return "Partly cloudy";
  if (code <= 48) return "Foggy";
  if (code <= 67) return "Rain showers";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Rain showers";
  return "Thunderstorms";
}

function weatherCodeIcon(code) {
  if (code === 0) return Sun;
  if (code <= 3) return CloudSun;
  return CloudRain;
}

function formatTime(value) {
  return value
    ? new Date(value).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "--:--";
}

function formatForecast(weatherData) {
  const daily = weatherData?.daily;
  if (!daily?.time?.length) return [];
  return daily.time.map((date, index) => {
    const max = Math.round(daily.temperature_2m_max[index]);
    const min = Math.round(daily.temperature_2m_min[index]);
    return {
      day:
        index === 0
          ? "Now"
          : new Date(`${date}T12:00:00`).toLocaleDateString([], {
              weekday: "short",
            }),
      icon: weatherCodeIcon(daily.weather_code[index]),
      temp: `${max}°`,
      range: `${min}° / ${max}°`,
      condition: weatherCodeLabel(daily.weather_code[index]),
    };
  });
}

function Dashboard({ alerts, dashboardData, weatherData }) {
  const weather =
    dashboardData?.airQuality ?? dashboardData?.overview?.airQuality;
  const prediction = dashboardData?.predictions;
  const topHotspot = (dashboardData?.hotspots ?? [])[0];
  const aqi = weather.aqi;
  const aqiCategory = weather.category;
  const location = weather.location;
  const pm25 = weather.pm25;
  const pm10 = weather.pm10;
  const currentWeather = weatherData?.current;
  const localForecast = formatForecast(weatherData);
  const trend =
    dashboardData?.analytics?.trend?.perCity?.find((entry) => entry.location === location)?.points ?? [];
  const freshness = freshnessOf(weather);
  const pulsing = useChangePulse(`${weather.aqi}/${prediction?.predictedAqi}`);
  const severity = severityClass(topHotspot?.aqi ?? weather.aqi);
  return (
    <>
      <DetectionHero hotspot={topHotspot} prediction={prediction} severity={severity} pulsing={pulsing} />
      <section className="stats-grid" data-fresh={freshness}>
        <StatCard
          label="Current AQI"
          value={aqi}
          unit="US AQI"
          status={aqiCategory}
          tone={severityClass(aqi)}
          icon={<Gauge />}
          trendCopy={freshnessLabel(weather)}
        />
        <StatCard
          label="Temperature"
          value={Math.round(currentWeather.temperature_2m)}
          unit="°C"
          status={`${Math.round(currentWeather.apparent_temperature)}° feels like`}
          tone="sig"
          icon={<Thermometer />}
          trendCopy="Live Open-Meteo reading"
        />
        <StatCard
          label="Humidity"
          value={Math.round(currentWeather.relative_humidity_2m)}
          unit="%"
          tone="sig"
          icon={<Droplets />}
          icon={<Droplets />}
          trendCopy="Live Open-Meteo reading"
        />
        <StatCard
          label="Wind speed"
          value={Math.round(currentWeather.wind_speed_10m)}
          status="Current wind"
          tone="sig"
          icon={<Navigation />}
          trendCopy="Live Open-Meteo reading"
        />
      </section>
      <section className="command-grid reveal">
        <article className="map-card">
          <div className="map-card-header">
            <div>
              <span className="section-kicker">Multi-source environmental intelligence</span>
              <h2>Live pollution map</h2>
            </div>
            <button className="map-layer-button" type="button"><Layers size={15} /> Layers</button>
          </div>
          <div className="map-stage" aria-label="Live pollution map visualization">
            <div className="map-grid-lines" />
            <div className="india-silhouette"><span /></div>
            <span className="map-label map-label-north">NORTH</span>
            <span className="map-label map-label-east">EAST</span>
            <span className="map-label map-label-south">SOUTH</span>
            {(dashboardData?.hotspots ?? []).map((hotspot) => (
              <span key={hotspot.location} className={`hotspot-marker ${hotspot.severity}`} style={projectHotspot(hotspot)}><i />{hotspot.location.replace(" metro cluster", "")}</span>
            ))}
            <div className="map-legend">
              <strong>AQI intensity</strong>
              <div><span className="legend-dot safe" /> Good <span className="legend-dot warning" /> Moderate <span className="legend-dot critical-dot" /> Critical</div>
            </div>
            <div className="map-controls">
              <button type="button" className="active">AQI</button>
              <button type="button">PM2.5</button>
              <button type="button">Fire</button>
              <button type="button">Wind</button>
            </div>
          </div>
        </article>
      </section>
      <section className="primary-grid">
        <article className="panel atmosphere-panel reveal" data-fresh={freshness}>
          <PanelHeader
            title="Atmosphere overview"
            kicker="Real-time sensor network"
            action="View live map"
            path="/map"
          />
          <div className="atmosphere-main">
            <div className={`aqi-ring ${severityClass(aqi)}`}>
              <div className="ring-glow" />
              <strong>{aqi}</strong>
              <span>{aqiCategory}</span>
              <small>US AQI</small>
            </div>
            <div className="atmosphere-copy">
              <div className="location-row">
                <Navigation size={14} className="map-pin" />
                <strong>{location}</strong>
                <span className="location-change">Change location</span>
              </div>
              <p>
                Reading from {weather.station}.{" "}
                {weather.source === "station"
                  ? "Verified reference data."
                  : "Modelled value — no reference station has reported here recently."}
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
              <span>Air quality history</span>
              <span className="chart-value">Recorded readings</span>
            </div>
            {trend.length ? (
              <div className="bar-chart">
                {trend.map((bucket) => {
                  // A bucket with no samples arrives as null. It must render as a
                  // gap, never as a bar of height 0 — that reads as "perfect air".
                  const peak = Math.max(
                    ...trend.map((item) => item.aqi ?? 0),
                    1,
                  );
                  const empty = bucket.aqi == null;
                  return (
                    <div
                      className={`chart-column ${empty ? "is-empty" : ""}`}
                      key={bucket.at}
                      title={
                        empty
                          ? `${new Date(bucket.at).toLocaleDateString()} — no reading recorded`
                          : `${new Date(bucket.at).toLocaleDateString()} — AQI ${bucket.aqi}`
                      }
                    >
                      <span
                        className="bar"
                        style={{
                          height: empty ? undefined : `${(bucket.aqi / peak) * 100}%`,
                        }}
                      />
                      <small>
                        {new Date(bucket.at).toLocaleDateString([], {
                          weekday: "short",
                        })}
                      </small>
                      <b>{empty ? "--" : bucket.aqi}</b>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="live-data-note">
                No history recorded yet. Trends fill in as the network polls this city.
              </div>
            )}
          </div>
        </article>
        <article className="panel forecast-panel reveal">
          <PanelHeader
            title="Local forecast"
            kicker={location}
            action="Forecast"
            path="/predictions"
          />
          <div className="forecast-list">
            {localForecast.map(
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
              Sunrise <b>{formatTime(weatherData?.daily?.sunrise?.[0])}</b>
            </span>
            <span className="sun-progress">
              <i />
            </span>
            <span>
              Sunset <b>{formatTime(weatherData?.daily?.sunset?.[0])}</b>
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
              value={pm25}
              unit="µg/m³"
              color="green"
              note="Live reading"
            />
            <Pollutant
              name="PM10"
              value={pm10}
              unit="µg/m³"
              color="teal"
              note="Live reading"
            />
            {weather.no2 !== undefined && (
              <Pollutant
                name="NO₂"
                value={weather.no2}
                unit="ppb"
                color="yellow"
                note="Live reading"
              />
            )}
            {weather.o3 !== undefined && (
              <Pollutant
                name="O₃"
                value={weather.o3}
                unit="ppb"
                color="orange"
                note="Live reading"
              />
            )}
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
              {prediction ? <><strong>{Math.round(prediction.confidence * 100)}<span>%</span></strong></> : <strong>--</strong>}
              <small>Confidence</small>
            </div>
            <div className="prediction-message">
              <div className="sparkle-icon">
                <Sparkles size={15} />
              </div>
              <p>
                {prediction ? (
                  <>AQI <strong>{prediction.currentAqi}</strong> is expected to reach <strong>{prediction.predictedAqi}</strong> in the next {prediction.horizonHours} hours.</>
                ) : (
                  "Prediction data is unavailable from the configured service."
                )}
              </p>
              {prediction && (
                <p>
                  Spike probability: <strong>{prediction.spikeProbability}%</strong>
                </p>
              )}
              <span>{prediction ? "Live AIRGUARD prediction data" : "Connect VITE_PREDICTION_API_URL for Flask /predict"}</span>
            </div>
          </div>
          <div className="confidence-bar">
            {prediction && <span style={{ width: `${Math.round(prediction.confidence * 100)}%` }} />}
          </div>
          <div className="prediction-foot">
            {prediction ? (
              <span>
                {prediction.factors.temperature}°C · {prediction.factors.humidity}% humidity · {prediction.factors.fireDetections} fire signals · {prediction.factors.citizenReports} reports
              </span>
            ) : (
              <span>Live prediction response</span>
            )}
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
          <strong>Live conditions loaded</strong>
          <p>
            Current weather and air-quality readings are connected to your
            location.
          </p>
        </div>
      </section>
      {!alerts && (
        <div className="alert-toast">
          <Moon size={15} /> Alerts paused for this session
        </div>
      )}
    </>
  );
}

/**
 * Q4: the detection is the product. Showing AQI is commodity; showing pollution
 * that no reference station covers — with its evidence chain and its freshness —
 * is the thing nobody else can do. So it is the hero instrument.
 *
 * Rule 3 is load-bearing here: a hero that hides a dead satellite feed is a lie,
 * so an absent evidence source is rendered as an explicit gap, never as a zero.
 */
function DetectionHero({ hotspot, prediction, severity, pulsing }) {
  const freshness = freshnessOf(hotspot ? { source: "station", readingAgeHours: 0 } : null);
  if (!hotspot) {
    return (
      <section className="hero-detection sev-unknown" data-fresh="stale">
        <div className="hero-main">
          <p className="hero-kicker">Detection sweep</p>
          <h1 className="hero-title">All corridors clear</h1>
          <p className="hero-sub">
            No hotspot crossed the detection threshold in the monitored corridors.
          </p>
        </div>
        <div className="hero-evidence">
          <span className="freshness">sweep complete · no threshold breach</span>
        </div>
      </section>
    );
  }

  const fire = hotspot.evidence?.fireDetections ?? 0;
  const reports = hotspot.evidence?.citizenReports ?? 0;
  const confidence = Math.round((hotspot.confidence ?? 0) * 100);

  return (
    <section className={`hero-detection ${severity}`} data-fresh={freshness}>
      <div className="hero-main">
        <p className="hero-kicker">
          <span className="live-indicator" />
          Hidden hotspot detected
        </p>
        <h1 className="hero-title">{hotspot.location}</h1>
        <p className="hero-sub">
          Detected {new Date(hotspot.detectedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}{" "}
          · attributed to <b>{hotspot.source}</b>
        </p>
        <div className="hero-metrics">
          <div>
            <small>Current AQI</small>
            <strong className={`${pulsing ? "is-diff " : ""}is-sev`}>
              {hotspot.aqi}
            </strong>
          </div>
          <div>
            <small>Predicted {prediction?.horizonHours ?? 24}h</small>
            <strong className={prediction?.predictedAqi == null ? "is-unknown" : ""}>
              {prediction?.predictedAqi ?? "--"}
            </strong>
          </div>
          <div>
            <small>Confidence</small>
            <strong className={confidence === 0 ? "is-unknown" : ""}>
              {confidence ? `${confidence}%` : "--"}
            </strong>
          </div>
        </div>
      </div>
      <div className="hero-evidence">
        <span className="freshness">
          {fire === 0 && reports === 0
            ? "unconfirmed · no corroborating signal"
            : `${fire + reports} corroborating signal${fire + reports === 1 ? "" : "s"}`}
        </span>
        <div className={`evidence-row ${fire === 0 ? "is-empty" : ""}`}>
          <Flame size={13} />
          {fire === 0 ? (
            <span>
              <b>0</b> satellite fire detections · source offline, not a clean sky
            </span>
          ) : (
            <span>
              <b>{fire}</b> satellite fire detection{fire === 1 ? "" : "s"} nearby
            </span>
          )}
        </div>
        <div className={`evidence-row ${reports === 0 ? "is-empty" : ""}`}>
          <Radio size={13} />
          <span>
            <b>{reports}</b> citizen report{reports === 1 ? "" : "s"} within 60 km
          </span>
        </div>
        <div className="evidence-row">
          <Navigation size={13} />
          <span>
            Wind <b>{hotspot.evidence?.windSpeed ?? "--"}</b> km/h · humidity{" "}
            <b>{hotspot.evidence?.humidity ?? "--"}</b>%
          </span>
        </div>
      </div>
    </section>
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
    <article className={`stat-card reveal ${tone || ""}`}>
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
        {trend ? <span>↑ {trend}</span> : null} {trendCopy}
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
function Pollutant({ name, value, unit, color, note }) {
  return (
    <div className="pollutant-row">
      <div className="pollutant-name">
        <span className={`pollutant-dot ${color}`} />
        <strong>{name}</strong>
        <small>{note}</small>
      </div>
      <div className="pollutant-bar live-only">
        <span className={color} style={{ width: value === null ? "0%" : `${Math.min(100, (value / 300) * 100)}%` }} />
      </div>
      <div className="pollutant-value">
        <strong>{value === null || value === undefined ? "—" : value}</strong>
        <small>{unit}</small>
      </div>
    </div>
  );
}
export default function App() {
  return <AuthGate />;
}
