import { useState, useEffect } from "react";

import AirPulseLoader from "./components/AirPulseLoader";
import Navbar from "./components/Navbar";
import Lenis from "@studio-freight/lenis";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      smoothTouch: false,
      lerp: 0.08,
    });

    let frameId;

    const raf = (time) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };

    frameId = requestAnimationFrame(raf);

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#020807] text-white">
      {/* Navbar exists behind loader */}
      <Navbar />

      {/* Loader */}
      {loading && <AirPulseLoader onComplete={() => setLoading(false)} />}

      {/* ================================= */}
      {/* YOUR WEBSITE */}
      {/* ================================= */}

      <main className="pt-16">
        <section className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <p className="mb-3 font-mono text-xs tracking-[0.3em] text-emerald-400/50">
              CLIMATE INTELLIGENCE PLATFORM
            </p>

            <h1 className="text-5xl font-semibold tracking-tight">AirPulse</h1>

            <p className="mt-4 max-w-lg text-white/40">
              Predicting pollution before it becomes a public health crisis.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
