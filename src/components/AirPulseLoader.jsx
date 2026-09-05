import { useEffect, useRef, useState } from "react";
import { createScope, createTimeline, stagger } from "animejs";

export default function AirPulseLoader({ onComplete }) {
  const root = useRef(null);
  const scope = useRef(null);

  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("INITIALIZING SENSORS");

  useEffect(() => {
    const statuses = [
      "INITIALIZING SENSORS",
      "CONNECTING SATELLITE",
      "SCANNING ATMOSPHERE",
      "ANALYZING POLLUTION",
      "DETECTING HOTSPOTS",
      "AI ENGINE READY",
    ];

    let progressTimer;

    // ---------------------------------------
    // Progress counter
    // ---------------------------------------

    let value = 0;

    progressTimer = setInterval(() => {
      value += 1;

      setProgress(value);

      const index = Math.min(
        Math.floor((value / 100) * statuses.length),
        statuses.length - 1,
      );

      setStatus(statuses[index]);

      if (value >= 100) {
        clearInterval(progressTimer);
      }
    }, 21);

    // ---------------------------------------
    // Anime.js
    // ---------------------------------------

    scope.current = createScope({ root }).add(() => {
      const tl = createTimeline({
        defaults: {
          ease: "out(3)",
        },
      });

      // ---------------------------------------
      // Background
      // ---------------------------------------

      tl.add(
        ".loader-grid",
        {
          opacity: [0, 1],
          duration: 500,
        },
        0,
      );

      // ---------------------------------------
      // Particles
      // ---------------------------------------

      tl.add(
        ".particle",
        {
          opacity: [0, 0.45],
          scale: [0, 1],
          duration: 400,
          delay: stagger(20),
        },
        100,
      );

      // ---------------------------------------
      // Satellite
      // ---------------------------------------

      tl.add(
        ".satellite",
        {
          opacity: [0, 1],
          translateX: ["-80px", "0px"],
          translateY: ["-50px", "0px"],
          rotate: ["-20deg", "0deg"],
          duration: 650,
        },
        150,
      );

      // ---------------------------------------
      // Radar rings
      // ---------------------------------------

      tl.add(
        ".radar-ring",
        {
          opacity: [0, 1],
          scale: [0.4, 1],
          duration: 500,
          delay: stagger(80),
        },
        300,
      );

      // ---------------------------------------
      // Map
      // ---------------------------------------

      tl.add(
        ".india-map",
        {
          opacity: [0, 1],
          scale: [0.8, 1],
          filter: ["blur(8px)", "blur(0px)"],
          duration: 600,
        },
        400,
      );

      // ---------------------------------------
      // Scan
      // ---------------------------------------

      tl.add(
        ".scan-line",
        {
          opacity: [0, 1],
          translateY: ["-140px", "140px"],
          duration: 700,
        },
        600,
      );

      // ---------------------------------------
      // Hotspots
      // ---------------------------------------

      tl.add(
        ".hotspot",
        {
          opacity: [0, 1],
          scale: [0, 1],
          duration: 250,
          delay: stagger(90),
        },
        900,
      );

      // ---------------------------------------
      // Data
      // ---------------------------------------

      tl.add(
        ".data-item",
        {
          opacity: [0, 1],
          translateY: [12, 0],
          duration: 300,
          delay: stagger(60),
        },
        1100,
      );

      // ---------------------------------------
      // Center logo
      // ---------------------------------------

      tl.add(
        ".logo-wrapper",
        {
          opacity: [0, 1],
          scale: [0.65, 1],
          filter: ["blur(10px)", "blur(0px)"],
          duration: 500,
        },
        1450,
      );

      // ---------------------------------------
      // Subtitle
      // ---------------------------------------

      tl.add(
        ".logo-subtitle",
        {
          opacity: [0, 1],
          translateY: [8, 0],
          duration: 300,
        },
        1700,
      );

      // ---------------------------------------
      // LOGO → NAVBAR TRANSITION
      // ---------------------------------------

      tl.add(
        {
          duration: 1,

          onBegin: () => {
            const loaderLogo = document.querySelector("#airpulse-loader-logo");

            const navbarLogo = document.querySelector("#airpulse-navbar-logo");

            if (!loaderLogo || !navbarLogo) {
              onComplete?.();
              return;
            }

            const from = loaderLogo.getBoundingClientRect();
            const to = navbarLogo.getBoundingClientRect();

            const fromX = from.left + from.width / 2;
            const fromY = from.top + from.height / 2;

            const toX = to.left + to.width / 2;
            const toY = to.top + to.height / 2;

            const translateX = toX - fromX;
            const translateY = toY - fromY;

            // Create second timeline for the handoff
            const transition = createTimeline({
              defaults: {
                ease: "inOut(4)",
              },

              onComplete: () => {
                onComplete?.();
              },
            });

            // Logo flies to navbar
            transition.add(loaderLogo, {
              translateX,
              translateY,
              scale: 0.38,
              duration: 650,
            });

            // Navbar logo appears
            transition.add(
              "#airpulse-navbar-logo",
              {
                opacity: [0, 1],
                scale: [0.8, 1],
                duration: 250,
              },
              "-=250",
            );

            // Fade everything behind it
            transition.add(
              ".loader-analysis",
              {
                opacity: 0,
                duration: 250,
              },
              "-=200",
            );

            // Fade loader
            transition.add(
              ".loader-root",
              {
                opacity: [1, 0],
                duration: 300,
              },
              "-=150",
            );
          },
        },
        1900,
      );
    });

    return () => {
      clearInterval(progressTimer);
      scope.current?.revert();
    };
  }, [onComplete]);

  return (
    <div
      ref={root}
      className="loader-root fixed inset-0 z-[9999] overflow-hidden bg-[#f8faf9] text-slate-900"
    >
      <div className="relative h-full w-full">
        {/* -------------------------------- */}
        {/* BACKGROUND */}
        {/* -------------------------------- */}

        <div
          className="loader-grid absolute inset-0 opacity-0"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(16,185,129,0.09) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(16,185,129,0.09) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "45px 45px",
            maskImage: "radial-gradient(circle, black 15%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(circle, black 15%, transparent 75%)",
          }}
        />

        {/* Background glow */}
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/[0.08] blur-[120px]" />

        {/* -------------------------------- */}
        {/* PARTICLES */}
        {/* -------------------------------- */}

        <Particles />

        {/* -------------------------------- */}
        {/* ANALYSIS AREA */}
        {/* -------------------------------- */}

        <div className="loader-analysis absolute inset-0">
          {/* Top left */}
          <div className="absolute left-6 top-6 hidden font-mono text-[9px] tracking-[0.25em] text-emerald-600/60 sm:block">
            AIRPULSE // CLIMATE INTELLIGENCE
          </div>

          {/* Top right */}
          <div className="absolute right-6 top-6 hidden text-right font-mono text-[9px] leading-5 text-slate-400 sm:block">
            SATELLITE: ONLINE
            <br />
            WEATHER: CONNECTED
            <br />
            AI ENGINE: ACTIVE
          </div>

          {/* -------------------------------- */}
          {/* RADAR */}
          {/* -------------------------------- */}

          <div className="absolute left-1/2 top-1/2 flex h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 items-center justify-center sm:h-[390px] sm:w-[390px]">
            {/* Rings */}

            {[92, 72, 52].map((size, i) => (
              <div
                key={i}
                className="radar-ring absolute rounded-full border border-emerald-500/20 opacity-0"
                style={{
                  width: `${size}%`,
                  height: `${size}%`,
                }}
              />
            ))}

            {/* Crosshair */}

            <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-emerald-500/15 to-transparent" />

            <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-emerald-500/15 to-transparent" />

            {/* Map */}

            <IndiaMap />

            {/* Scan */}

            <div className="scan-line absolute h-[1px] w-[65%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 shadow-[0_0_15px_rgba(16,185,129,0.55)]" />

            {/* Hotspots */}

            <Hotspot
              className="left-[36%] top-[34%]"
              color="bg-red-500"
              large
            />

            <Hotspot className="right-[29%] top-[45%]" color="bg-orange-400" />

            <Hotspot
              className="bottom-[29%] left-[47%]"
              color="bg-yellow-400"
            />

            {/* Satellite */}

            <div className="satellite absolute -right-4 -top-6 opacity-0 sm:-right-10">
              <Satellite />
            </div>
          </div>

          {/* -------------------------------- */}
          {/* DATA LEFT */}
          {/* -------------------------------- */}

          <div className="absolute left-[5%] top-1/2 hidden -translate-y-1/2 space-y-5 lg:block">
            <DataItem
              label="PM2.5"
              value="128"
              unit="µg/m³"
              status="ELEVATED"
            />

            <DataItem label="WIND" value="4.2" unit="KM/H" status="STAGNANT" />

            <DataItem label="HUMIDITY" value="71" unit="%" status="HIGH" />
          </div>

          {/* -------------------------------- */}
          {/* DATA RIGHT */}
          {/* -------------------------------- */}

          <div className="absolute right-[5%] top-1/2 hidden -translate-y-1/2 space-y-5 text-right lg:block">
            <DataItem label="ACTIVE FIRES" value="07" status="DETECTED" right />

            <DataItem label="NO₂ INDEX" value="83" status="ABNORMAL" right />

            <DataItem
              label="AI CONFIDENCE"
              value="94"
              unit="%"
              status="HIGH"
              right
            />
          </div>
        </div>

        {/* -------------------------------- */}
        {/* AIRPULSE LOGO */}
        {/* -------------------------------- */}

        <div
          id="airpulse-loader-logo"
          className="logo-wrapper absolute left-1/2 top-1/2 z-50 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 opacity-0"
        >
          {/* Icon */}

          <img src="logo.png" alt="logo" className="w-15 h-15" />

          {/* Text */}

          <div>
            <h1 className="text-3xl font-bold tracking-[-0.04em] text-slate-900 sm:text-4xl">
              Air
              <span className="text-emerald-600">Pulse</span>
            </h1>

            <p className="logo-subtitle mt-1 font-mono text-[8px] uppercase tracking-[0.3em] text-slate-400 opacity-0">
              Predict • Detect • Protect
            </p>
          </div>
        </div>

        {/* -------------------------------- */}
        {/* PROGRESS */}
        {/* -------------------------------- */}

        <div className="absolute bottom-8 left-1/2 w-[82%] max-w-md -translate-x-1/2">
          <div className="mb-2 flex justify-between font-mono text-[9px] tracking-wider">
            <span className="text-slate-400">{status}</span>

            <span className="text-emerald-600">
              {String(progress).padStart(3, "0")}%
            </span>
          </div>

          <div className="h-px overflow-hidden bg-slate-200">
            <div
              className="h-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.65)] transition-[width] duration-75"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        {/* Coordinates */}

        <div className="absolute bottom-4 left-6 hidden font-mono text-[8px] text-slate-300 sm:block">
          LAT 23.3441° N / LON 85.3096° E
        </div>

        <div className="absolute bottom-4 right-6 hidden font-mono text-[8px] text-slate-300 sm:block">
          DATA FUSION ENGINE
        </div>
      </div>
    </div>
  );
}

/* ================================================= */
/* PARTICLES */
/* ================================================= */

function Particles() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {Array.from({ length: 35 }).map((_, i) => (
        <span
          key={i}
          className="particle absolute h-[2px] w-[2px] rounded-full bg-emerald-400 opacity-0"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 100}%`,
          }}
        />
      ))}
    </div>
  );
}

/* ================================================= */
/* HOTSPOT */
/* ================================================= */

function Hotspot({ className, color, large = false }) {
  return (
    <div className={`hotspot absolute opacity-0 ${className}`}>
      <div className="relative">
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ${color} animate-ping opacity-20 ${
            large ? "h-12 w-12" : "h-9 w-9"
          }`}
        />

        <div
          className={`rounded-full ${color} ${large ? "h-3 w-3" : "h-2 w-2"}`}
        />
      </div>
    </div>
  );
}

/* ================================================= */
/* DATA ITEM */
/* ================================================= */

function DataItem({ label, value, unit, status, right = false }) {
  return (
    <div className="data-item min-w-[145px] opacity-0">
      <div className="font-mono text-[8px] tracking-[0.25em] text-slate-400">
        {label}
      </div>

      <div
        className={`mt-1 flex items-baseline gap-1 ${
          right ? "justify-end" : ""
        }`}
      >
        <span className="text-2xl font-light text-slate-700">{value}</span>

        <span className="font-mono text-[8px] text-slate-400">{unit}</span>
      </div>

      <div className="mt-1 font-mono text-[7px] tracking-[0.2em] text-emerald-600/70">
        {status}
      </div>
    </div>
  );
}

/* ================================================= */
/* SATELLITE */
/* ================================================= */

function Satellite() {
  return (
    <div className="relative flex items-center">
      <div className="h-4 w-7 border border-emerald-500/30 bg-emerald-400/10" />

      <div className="mx-1 h-3 w-3 rotate-45 border border-emerald-500/60 bg-white" />

      <div className="h-4 w-7 border border-emerald-500/30 bg-emerald-400/10" />
    </div>
  );
}

/* ================================================= */
/* INDIA MAP */
/* ================================================= */

function IndiaMap() {
  return (
    <svg viewBox="0 0 300 320" className="india-map h-[70%] w-[70%] opacity-0">
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
        fill="rgba(16,185,129,0.045)"
        stroke="rgba(16,185,129,0.55)"
        strokeWidth="1.2"
      />

      <path
        d="M92 48 L132 70 L164 61 L196 83"
        stroke="rgba(16,185,129,0.16)"
        strokeWidth="0.7"
        fill="none"
      />

      <path
        d="M74 105 L118 115 L160 106 L215 108"
        stroke="rgba(16,185,129,0.16)"
        strokeWidth="0.7"
        fill="none"
      />

      <path
        d="M62 173 L108 164 L168 198"
        stroke="rgba(16,185,129,0.16)"
        strokeWidth="0.7"
        fill="none"
      />

      <path
        d="M103 224 L149 205 L182 179"
        stroke="rgba(16,185,129,0.16)"
        strokeWidth="0.7"
        fill="none"
      />
    </svg>
  );
}
