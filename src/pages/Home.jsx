import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  ChevronRight,
  Cloud,
  Droplets,
  MapPin,
  ShieldCheck,
  Sparkles,
  Wind,
  Zap,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

export default function Home() {
  const [activeMetric, setActiveMetric] = useState(0);

  const metrics = [
    {
      label: "PM2.5",
      value: "128",
      unit: "µg/m³",
      status: "Elevated",
      color: "text-red-500",
    },
    {
      label: "AQI",
      value: "176",
      unit: "US AQI",
      status: "Unhealthy",
      color: "text-orange-500",
    },
    {
      label: "NO₂",
      value: "83",
      unit: "INDEX",
      status: "Abnormal",
      color: "text-yellow-500",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % metrics.length);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen overflow-hidden bg-[#f8faf9] text-slate-900">
        {/* =====================================================
          HERO
      ===================================================== */}

        <section className="relative flex min-h-[calc(100vh-68px)] items-center pt-[68px]">
          {/* Background grid */}

          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              backgroundImage: `
              linear-gradient(
                rgba(16,185,129,0.055) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(16,185,129,0.055) 1px,
                transparent 1px
              )
            `,
              backgroundSize: "48px 48px",
              maskImage:
                "radial-gradient(circle at center, black 15%, transparent 75%)",
              WebkitMaskImage:
                "radial-gradient(circle at center, black 15%, transparent 75%)",
            }}
          />

          {/* Green atmospheric glow */}

          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/[0.08] blur-[140px]" />

          {/* Decorative particles */}

          <HeroParticles />

          <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 px-5 py-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-24">
            {/* =================================================
              LEFT CONTENT
          ================================================= */}

            <div className="relative z-10">
              {/* Status */}

              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-500/15 bg-emerald-500/[0.06] px-3 py-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-40" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>

                <span className="font-mono text-[8px] tracking-[0.18em] text-emerald-700">
                  AI CLIMATE INTELLIGENCE ONLINE
                </span>
              </div>

              {/* Heading */}

              <h1 className="max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-[76px]">
                Understand the air.
                <span className="block text-emerald-600">
                  Protect tomorrow.
                </span>
              </h1>

              {/* Description */}

              <p className="mt-7 max-w-xl text-base leading-7 text-slate-500 sm:text-lg">
                AirPulse combines satellite intelligence, atmospheric data, and
                AI-powered predictions to help you understand air quality before
                it becomes a problem.
              </p>

              {/* CTA */}

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/dashboard"
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 text-sm font-medium text-white shadow-lg shadow-emerald-500/20 transition duration-300 hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/25"
                >
                  Explore AirPulse
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  to="/map"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-medium text-slate-600 shadow-sm transition duration-300 hover:border-emerald-500/25 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <MapPin size={15} />
                  View live map
                </Link>
              </div>

              {/* Trust indicators */}

              <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-[9px] font-mono uppercase tracking-[0.12em] text-slate-400">
                <span className="flex items-center gap-2">
                  <ShieldCheck size={13} className="text-emerald-500" />
                  Real-time data
                </span>

                <span className="flex items-center gap-2">
                  <BrainCircuit size={13} className="text-emerald-500" />
                  AI powered
                </span>

                <span className="flex items-center gap-2">
                  <Zap size={13} className="text-emerald-500" />
                  Predictive
                </span>
              </div>
            </div>

            {/* =================================================
              RIGHT VISUAL
          ================================================= */}

            <div className="relative mx-auto w-full max-w-[560px]">
              {/* Outer glow */}

              <div className="absolute left-1/2 top-1/2 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/[0.09] blur-[90px]" />

              {/* Dashboard card */}

              <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white/85 p-4 shadow-2xl shadow-slate-900/[0.07] backdrop-blur-xl sm:p-5">
                {/* Header */}

                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <p className="font-mono text-[8px] tracking-[0.2em] text-slate-400">
                      ATMOSPHERIC MONITOR
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <MapPin size={12} className="text-emerald-500" />

                      <span className="text-sm font-medium text-slate-700">
                        Ranchi, India
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/15 bg-emerald-500/[0.06] px-2.5 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                    <span className="font-mono text-[7px] tracking-wider text-emerald-600">
                      LIVE
                    </span>
                  </div>
                </div>

                {/* Map visualization */}

                <div className="relative mt-4 h-[280px] overflow-hidden rounded-2xl border border-emerald-500/[0.08] bg-[#f4faf7]">
                  <div
                    className="absolute inset-0 opacity-60"
                    style={{
                      backgroundImage: `
                      linear-gradient(
                        rgba(16,185,129,0.08) 1px,
                        transparent 1px
                      ),
                      linear-gradient(
                        90deg,
                        rgba(16,185,129,0.08) 1px,
                        transparent 1px
                      )
                    `,
                      backgroundSize: "30px 30px",
                    }}
                  />

                  {/* Radar rings */}

                  <div className="absolute left-1/2 top-1/2 h-[210px] w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/10" />

                  <div className="absolute left-1/2 top-1/2 h-[155px] w-[155px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/10" />

                  <div className="absolute left-1/2 top-1/2 h-[95px] w-[95px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/10" />

                  {/* Crosshair */}

                  <div className="absolute left-1/2 top-0 h-full w-px bg-emerald-500/[0.08]" />
                  <div className="absolute left-0 top-1/2 h-px w-full bg-emerald-500/[0.08]" />

                  {/* India */}

                  <MiniIndiaMap />

                  {/* Scan */}

                  <div className="absolute left-[18%] top-[48%] h-px w-[64%] animate-pulse bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_12px_rgba(16,185,129,0.5)]" />

                  {/* Hotspots */}

                  <MapHotspot
                    className="left-[35%] top-[35%]"
                    color="bg-red-500"
                    large
                  />

                  <MapHotspot
                    className="right-[29%] top-[45%]"
                    color="bg-orange-400"
                  />

                  <MapHotspot
                    className="bottom-[25%] left-[49%]"
                    color="bg-yellow-400"
                  />

                  {/* Map label */}

                  <div className="absolute bottom-3 left-3 rounded-lg border border-white/80 bg-white/80 px-2.5 py-1.5 shadow-sm backdrop-blur">
                    <p className="font-mono text-[7px] tracking-wider text-slate-400">
                      SATELLITE COVERAGE
                    </p>

                    <p className="mt-0.5 text-[10px] font-medium text-slate-600">
                      INDIA REGION
                    </p>
                  </div>

                  {/* Coordinates */}

                  <div className="absolute bottom-3 right-3 font-mono text-[7px] text-slate-400">
                    23.3441° N / 85.3096° E
                  </div>
                </div>

                {/* Metrics */}

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {metrics.map((metric, index) => (
                    <div
                      key={metric.label}
                      className={`rounded-xl border p-3 transition-all duration-500 ${
                        activeMetric === index
                          ? "border-emerald-500/20 bg-emerald-50"
                          : "border-slate-100 bg-slate-50/70"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[7px] tracking-wider text-slate-400">
                          {metric.label}
                        </span>

                        {activeMetric === index && (
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        )}
                      </div>

                      <div className="mt-2">
                        <span className={`text-xl font-light ${metric.color}`}>
                          {metric.value}
                        </span>
                      </div>

                      <div className="mt-0.5 font-mono text-[6px] text-slate-400">
                        {metric.unit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating card */}

              <div className="absolute -bottom-6 -left-5 hidden rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xl shadow-slate-900/[0.08] sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                    <BrainCircuit size={17} />
                  </div>

                  <div>
                    <p className="font-mono text-[7px] tracking-wider text-slate-400">
                      AI CONFIDENCE
                    </p>

                    <p className="mt-0.5 text-sm font-semibold text-slate-700">
                      94%
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating weather card */}

              <div className="absolute -right-5 -top-5 hidden rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xl shadow-slate-900/[0.08] sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500">
                    <Cloud size={17} />
                  </div>

                  <div>
                    <p className="font-mono text-[7px] tracking-wider text-slate-400">
                      WEATHER
                    </p>

                    <p className="mt-0.5 text-sm font-semibold text-slate-700">
                      24°C
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom fade */}

          <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-[#f8faf9] to-transparent" />
        </section>

        {/* =====================================================
          STATS
      ===================================================== */}

        <section className="relative border-y border-slate-200/80 bg-white/70">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-200/80 px-5 sm:grid-cols-4 sm:px-8 lg:px-10">
            <Stat value="500+" label="Monitoring locations" />

            <Stat value="24/7" label="Atmospheric tracking" />

            <Stat value="94%" label="AI confidence" />

            <Stat value="10M+" label="Data points analyzed" />
          </div>
        </section>

        {/* =====================================================
          FEATURES
      ===================================================== */}

        <section className="relative bg-[#f8faf9] py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            {/* Section heading */}

            <div className="max-w-2xl">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-px w-7 bg-emerald-500" />

                <span className="font-mono text-[8px] tracking-[0.25em] text-emerald-600">
                  THE AIRPULSE SYSTEM
                </span>
              </div>

              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-900 sm:text-5xl">
                From raw atmosphere data
                <span className="text-emerald-600">
                  {" "}
                  to actionable insight.
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                Everything you need to monitor, understand, and anticipate
                changes in air quality — presented in one intelligent platform.
              </p>
            </div>

            {/* Feature grid */}

            <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon={MapPin}
                number="01"
                title="Live Monitoring"
                description="Track air quality conditions across cities and regions with continuously updated atmospheric data."
              />

              <FeatureCard
                icon={BrainCircuit}
                number="02"
                title="AI Predictions"
                description="Understand what air quality could look like hours and days ahead with predictive intelligence."
              />

              <FeatureCard
                icon={BarChart3}
                number="03"
                title="Deep Analytics"
                description="Explore trends, pollution patterns, environmental factors, and historical air quality data."
              />

              <FeatureCard
                icon={ShieldCheck}
                number="04"
                title="Smart Alerts"
                description="Stay informed when pollution levels change or potentially harmful conditions are detected."
              />
            </div>
          </div>
        </section>

        {/* =====================================================
          PREDICTION SECTION
      ===================================================== */}

        <section className="relative overflow-hidden bg-slate-950 py-24 text-white sm:py-32">
          {/* Green glow */}

          <div className="absolute right-[-10%] top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[130px]" />

          <div className="absolute left-[-10%] top-[-20%] h-[350px] w-[350px] rounded-full bg-emerald-400/[0.06] blur-[100px]" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-2 lg:px-10">
            {/* Content */}

            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1.5">
                <Sparkles size={12} className="text-emerald-400" />

                <span className="font-mono text-[8px] tracking-[0.2em] text-emerald-400/80">
                  PREDICTIVE INTELLIGENCE
                </span>
              </div>

              <h2 className="max-w-xl text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                Don't just see pollution.
                <span className="block text-emerald-400">
                  See what's coming.
                </span>
              </h2>

              <p className="mt-6 max-w-lg text-sm leading-7 text-slate-400">
                AirPulse analyzes historical patterns, weather conditions,
                atmospheric movement, and pollution signals to identify where
                air quality is heading next.
              </p>

              <Link
                to="/predictions"
                className="group mt-8 inline-flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08] px-5 py-3 text-sm text-emerald-300 transition hover:bg-emerald-400/[0.13]"
              >
                Explore predictions
                <ChevronRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>

            {/* Prediction visual */}

            <PredictionCard />
          </div>
        </section>

        {/* =====================================================
          CTA
      ===================================================== */}

        <section className="relative overflow-hidden bg-[#f8faf9] py-24 sm:py-32">
          <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.07] text-emerald-600">
              <Wind size={21} />
            </div>

            <h2 className="mt-7 text-4xl font-semibold tracking-[-0.045em] text-slate-900 sm:text-6xl">
              The air is changing.
              <span className="block text-emerald-600">Stay ahead of it.</span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Start exploring real-time atmospheric intelligence with AirPulse.
            </p>

            <Link
              to="/dashboard"
              className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-medium text-white shadow-xl shadow-slate-900/10 transition hover:bg-emerald-600 hover:shadow-emerald-500/20"
            >
              Open AirPulse
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </section>

        {/* =====================================================
          FOOTER
      ===================================================== */}

        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                <Wind size={15} />
              </div>

              <div>
                <p className="text-sm font-bold tracking-tight text-slate-800">
                  Air<span className="text-emerald-600">Pulse</span>
                </p>

                <p className="font-mono text-[6px] tracking-[0.2em] text-slate-400">
                  CLIMATE INTELLIGENCE
                </p>
              </div>
            </div>

            <p className="font-mono text-[8px] tracking-wider text-slate-400">
              © {new Date().getFullYear()} AIRPULSE. ALL SYSTEMS OPERATIONAL.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}

/* =========================================================
   HERO PARTICLES
========================================================= */

function HeroParticles() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {Array.from({ length: 28 }).map((_, index) => (
        <span
          key={index}
          className="absolute h-1 w-1 rounded-full bg-emerald-400/30"
          style={{
            left: `${(index * 37) % 100}%`,
            top: `${(index * 53) % 100}%`,
            animation: `airpulseFloat ${4 + (index % 4)}s ease-in-out infinite`,
            animationDelay: `${(index % 5) * 0.5}s`,
          }}
        />
      ))}

      <style>
        {`
          @keyframes airpulseFloat {
            0%, 100% {
              transform: translateY(0);
              opacity: .25;
            }

            50% {
              transform: translateY(-14px);
              opacity: .7;
            }
          }
        `}
      </style>
    </div>
  );
}

/* =========================================================
   MINI INDIA MAP
========================================================= */

function MiniIndiaMap() {
  return (
    <svg
      viewBox="0 0 300 320"
      className="absolute left-1/2 top-1/2 h-[68%] w-[68%] -translate-x-1/2 -translate-y-1/2"
    >
      <path
        d="
          M112 18
          L132 27
          L149 21
          L171 33
          L193 34
          L210 48
          L227 52
          L218 67
          L234 78
          L216 91
          L215 108
          L231 116
          L214 126
          L206 146
          L192 158
          L182 179
          L168 198
          L161 222
          L149 250
          L139 286
          L128 270
          L119 244
          L103 224
          L87 210
          L75 188
          L62 173
          L65 154
          L48 140
          L56 119
          L74 105
          L76 84
          L89 69
          L92 48
          Z
        "
        fill="rgba(16,185,129,0.055)"
        stroke="rgba(16,185,129,0.55)"
        strokeWidth="1.4"
      />

      <path
        d="M92 48 L132 70 L164 61 L196 83"
        stroke="rgba(16,185,129,0.15)"
        strokeWidth="0.8"
        fill="none"
      />

      <path
        d="M74 105 L118 115 L160 106 L215 108"
        stroke="rgba(16,185,129,0.15)"
        strokeWidth="0.8"
        fill="none"
      />

      <path
        d="M62 173 L108 164 L168 198"
        stroke="rgba(16,185,129,0.15)"
        strokeWidth="0.8"
        fill="none"
      />

      <path
        d="M103 224 L149 205 L182 179"
        stroke="rgba(16,185,129,0.15)"
        strokeWidth="0.8"
        fill="none"
      />
    </svg>
  );
}

/* =========================================================
   MAP HOTSPOT
========================================================= */

function MapHotspot({ className, color, large = false }) {
  return (
    <div className={`absolute ${className}`}>
      <div className="relative">
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full ${color} opacity-20 ${
            large ? "h-12 w-12" : "h-9 w-9"
          }`}
        />

        <div
          className={`rounded-full ${color} shadow-lg ${
            large ? "h-3 w-3" : "h-2 w-2"
          }`}
        />
      </div>
    </div>
  );
}

/* =========================================================
   STAT
========================================================= */

function Stat({ value, label }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center sm:py-10">
      <span className="text-2xl font-semibold tracking-tight text-slate-800 sm:text-3xl">
        {value}
      </span>

      <span className="mt-1 font-mono text-[7px] tracking-[0.15em] text-slate-400 sm:text-[8px]">
        {label}
      </span>
    </div>
  );
}

/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureCard({ icon: Icon, number, title, description }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-500/20 hover:shadow-xl hover:shadow-slate-900/[0.05]">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/[0.08] text-emerald-600 transition duration-300 group-hover:bg-emerald-500/10">
          <Icon size={18} />
        </div>

        <span className="font-mono text-[8px] tracking-widest text-slate-300">
          {number}
        </span>
      </div>

      <h3 className="mt-7 text-base font-semibold text-slate-800">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>

      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-emerald-500 transition-all duration-500 group-hover:w-full" />
    </div>
  );
}

/* =========================================================
   PREDICTION CARD
========================================================= */

function PredictionCard() {
  const points = [
    { x: 0, y: 72 },
    { x: 12, y: 66 },
    { x: 24, y: 69 },
    { x: 36, y: 52 },
    { x: 48, y: 58 },
    { x: 60, y: 42 },
    { x: 72, y: 47 },
    { x: 84, y: 28 },
    { x: 100, y: 34 },
  ];

  const path = points
    .map((point, index) => {
      const x = point.x * 4.3;
      const y = point.y * 2.5;

      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <div className="relative rounded-[26px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-6">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[8px] tracking-[0.2em] text-slate-500">
            AIR QUALITY FORECAST
          </p>

          <p className="mt-1 text-sm font-medium text-white">Next 24 hours</p>
        </div>

        <div className="rounded-lg border border-emerald-400/10 bg-emerald-400/[0.06] px-2 py-1 font-mono text-[7px] text-emerald-400">
          AI MODEL
        </div>
      </div>

      {/* Chart */}

      <div className="relative mt-7 h-[220px] overflow-hidden rounded-xl border border-white/[0.05] bg-black/10">
        {/* Horizontal lines */}

        {[25, 50, 75].map((top) => (
          <div
            key={top}
            className="absolute left-0 right-0 h-px bg-white/[0.05]"
            style={{ top: `${top}%` }}
          />
        ))}

        {/* Chart */}

        <svg
          viewBox="0 0 430 180"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient id="airpulseChart" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.3" />

              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path d={`${path} L 430 180 L 0 180 Z`} fill="url(#airpulseChart)" />

          <path
            d={path}
            fill="none"
            stroke="#34d399"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />

          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x * 4.3}
              cy={point.y * 2.5}
              r="3"
              fill="#0f172a"
              stroke="#34d399"
              strokeWidth="2"
            />
          ))}
        </svg>

        {/* Labels */}

        <div className="absolute bottom-2 left-3 right-3 flex justify-between font-mono text-[7px] text-slate-600">
          <span>NOW</span>
          <span>06H</span>
          <span>12H</span>
          <span>18H</span>
          <span>24H</span>
        </div>
      </div>

      {/* Prediction summary */}

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
          <p className="font-mono text-[7px] tracking-wider text-slate-500">
            PREDICTED AQI
          </p>

          <p className="mt-1 text-lg font-light text-emerald-400">94</p>

          <p className="mt-0.5 font-mono text-[6px] text-slate-600">
            IMPROVING
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
          <p className="font-mono text-[7px] tracking-wider text-slate-500">
            CONFIDENCE
          </p>

          <p className="mt-1 text-lg font-light text-white">94%</p>

          <p className="mt-0.5 font-mono text-[6px] text-slate-600">HIGH</p>
        </div>
      </div>
    </div>
  );
}
