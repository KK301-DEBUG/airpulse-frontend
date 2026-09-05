<<<<<<< HEAD
import { Routes, Route } from "react-router-dom";
=======
import { useEffect, useState } from "react";
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
  Gauge,
  LayoutDashboard,
  Map,
  Menu,
  Moon,
  Navigation,
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
import { getDashboardData, getWeather } from "./lib/api";
import DashboardPage from "./pages/DashboardPage";
import "./App.css";
>>>>>>> eb47bb5b5c5443ccc9fabaad1b2b7c7f0efb7ffb

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
            airpulse<span>.</span>
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
              AirPulse turns the invisible into something you can act on. Live
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
              <div className="globe-lines" />
              <span className="globe-pulse pulse-a" />
              <span className="globe-pulse pulse-b" />
              <span className="globe-pulse pulse-c" />
              <div className="globe-label label-a">
                AIR QUALITY <small>Live signal</small>
              </div>
              <div className="globe-label label-b">
                WEATHER <small>Live signal</small>
              </div>
              <div className="globe-label label-c">
                PARTICLES <small>Live signal</small>
              </div>
            </div>
            <div className="orbit-caption">
              <span>LIVE / 01</span>
              <strong>Reading your local atmosphere</strong>
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
            From Open-Meteo forecasts to OpenAQ air quality data, AirPulse
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
          {mode === "signup" ? "Already have an account?" : "New to AirPulse?"}{" "}
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
  { label: "Predictions", icon: Activity, path: "/predictions" },
  { label: "Reports", icon: Gauge, path: "/reports" },
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

function AirPulse({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [alerts, setAlerts] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherError, setWeatherError] = useState(() =>
    navigator.geolocation
      ? ""
      : "Location access is not supported in this browser.",
  );
  const [authUser, setAuthUser] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [locationAttempt, setLocationAttempt] = useState(0);
  const [requestFinished, setRequestFinished] = useState(() => !navigator.geolocation);
  useSmoothScroll();
  useEffect(() => {
    if (!auth) return undefined;
    return onAuthStateChanged(auth, setAuthUser);
  }, []);
  useEffect(() => {
    if (!navigator.geolocation) {
      return undefined;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCoordinates({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
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
    Promise.allSettled([
      getDashboardData(coordinates.latitude, coordinates.longitude),
      getWeather(coordinates.latitude, coordinates.longitude),
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
  }, [coordinates, authUser]);
  useEffect(() => {
    animate(".reveal", {
      opacity: [0, 1],
      translateY: [14, 0],
      delay: stagger(55),
      duration: 650,
      ease: "outQuart",
    });
  }, [location.pathname]);

  const dataReady = Boolean(
    dashboardData?.airQuality &&
    dashboardData?.analytics &&
    weatherData?.current &&
    weatherData?.daily,
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
                <div className="user-avatar">●</div>
                <div>
                  <strong>Authenticated workspace</strong>
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
                  {location.pathname === "/"
                    ? "Overview"
                    : location.pathname.slice(1)}
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
            <DashboardPage>
            <div className="page-content">
              <div className="page-heading reveal">
                <div>
                  <p className="eyebrow">
                    <span className="live-indicator" /> Live atmosphere
                    intelligence
                  </p>
                  <h1>Your atmosphere workspace</h1>
                  <p className="heading-copy">
                    Your atmosphere is being monitored. Here's what's happening
                    across your workspace.
                  </p>
                </div>
                <div className="heading-controls">
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
            </DashboardPage>
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
  const aqi = weather.aqi;
  const aqiCategory = weather.category;
  const location = weather.location;
  const pm25 = weather.pm25;
  const pm10 = weather.pm10;
  const currentWeather = weatherData?.current;
  const localForecast = formatForecast(weatherData);
  return (
    <>
      <section className="stats-grid">
        <StatCard
          label="Air quality index"
          value={aqi}
          unit="US AQI"
          status={aqiCategory}
          tone="green"
          trendCopy="Live OpenAQ reading"
        />
        <StatCard
          label="Temperature"
          value={Math.round(currentWeather.temperature_2m)}
          unit="°C"
          status={`${Math.round(currentWeather.apparent_temperature)}° feels like`}
          icon={<Thermometer />}
          trendCopy="Live Open-Meteo reading"
        />
        <StatCard
          label="Humidity"
          value={Math.round(currentWeather.relative_humidity_2m)}
          unit="%"
          tone="blue"
          icon={<Droplets />}
          trendCopy="Live Open-Meteo reading"
        />
        <StatCard
          label="Wind speed"
          value={Math.round(currentWeather.wind_speed_10m)}
          status="Current wind"
          tone="purple"
          icon={<Navigation />}
          trendCopy="Live Open-Meteo reading"
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
                Live air quality reading from the connected atmosphere network.
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
              <span className="chart-value">Live API</span>
            </div>
            <div className="live-data-note">
              Historical AQI values will appear when the backend provides a time
              series.
            </div>
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
                  <>Air quality is expected to reach <strong>{prediction.predictedAqi}</strong> AQI in the next {prediction.horizonHours} hours.</>
                ) : (
                  "Prediction data is unavailable from the configured service."
                )}
              </p>
              <span>{prediction ? "Live AirPulse prediction data" : "Connect VITE_PREDICTION_API_URL for Flask /predict"}</span>
            </div>
          </div>
          <div className="confidence-bar">
            {prediction && <span style={{ width: `${Math.round(prediction.confidence * 100)}%` }} />}
          </div>
          <div className="prediction-foot">
            <span>Live prediction response</span>
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
        <span className={color} />
      </div>
      <div className="pollutant-value">
        <strong>{value}</strong>
        <small>{unit}</small>
      </div>
    </div>
  );
}
export default function App() {
  return <AuthGate />;
}
