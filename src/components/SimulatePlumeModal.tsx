import React, { useEffect, useRef, useState } from 'react';

interface SimulatePlumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultWind?: string;
  geoNodeName?: string;
}

export const SimulatePlumeModal: React.FC<SimulatePlumeModalProps> = ({
  isOpen,
  onClose,
  defaultWind = '4 km/h NE',
  geoNodeName = 'Ranchi',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [windSpeed, setWindSpeed] = useState<number>(4);
  const [windDir, setWindDir] = useState<number>(45); // 45deg = NE
  const [inversionHeight, setInversionHeight] = useState<number>(380); // meters
  const [emissionRate, setEmissionRate] = useState<number>(65); // kg/hr
  const [isCurtailmentActive, setIsCurtailmentActive] = useState<boolean>(false);
  const [simulatedMaxAqi, setSimulatedMaxAqi] = useState<number>(186);

  // Simulation physics loop
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    // Particle representation for dispersion
    const particles: { x: number; y: number; age: number; life: number; size: number; opacity: number }[] = [];
    const maxParticles = 300;

    const render = () => {
      time += 0.05;
      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = '#0a0e16';
      ctx.fillRect(0, 0, width, height);

      // Draw grid
      ctx.strokeStyle = '#181c24';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Inversion Lid line
      const lidY = Math.max(30, height - (inversionHeight / 1000) * (height - 60));
      ctx.strokeStyle = '#93000a';
      ctx.setLineDash([6, 4]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, lidY);
      ctx.lineTo(width, lidY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#ffb4ab';
      ctx.font = '10px monospace';
      ctx.fillText(`THERMAL INVERSION LID: ${inversionHeight}m (Entrapment Ceiling)`, 15, lidY - 6);

      // Ground plane
      const groundY = height - 30;
      ctx.strokeStyle = '#262a33';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(width, groundY);
      ctx.stroke();

      // Smoke Stack source position
      const stackX = 90;
      const stackHeight = 55;
      const stackY = groundY - stackHeight;

      // Draw Stack
      ctx.fillStyle = '#31353e';
      ctx.fillRect(stackX - 8, stackY, 16, stackHeight);
      ctx.fillStyle = '#ffb4ab';
      ctx.fillRect(stackX - 10, stackY - 4, 20, 4);

      // Emit new particles from stack tip
      const activeRate = isCurtailmentActive ? emissionRate * 0.45 : emissionRate;
      const spawnCount = Math.floor(activeRate / 15) + 1;

      for (let i = 0; i < spawnCount; i++) {
        if (particles.length < maxParticles) {
          particles.push({
            x: stackX,
            y: stackY - 2,
            age: 0,
            life: 80 + Math.random() * 60,
            size: 4 + Math.random() * 4,
            opacity: 0.8,
          });
        }
      }

      // Update and draw particles with Gaussian dispersion & reflection
      const rad = (windDir * Math.PI) / 180;
      const vx = Math.max(0.8, (windSpeed / 10) * Math.sin(rad) * 4);
      const vy = -0.6 * Math.cos(rad);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.age += 1;
        p.x += vx + (Math.random() - 0.5) * 1.5;
        p.y += vy + (Math.random() - 0.5) * 1.8;

        // Reflection against inversion lid
        if (p.y <= lidY) {
          p.y = lidY + 1;
        }
        // Reflection against ground
        if (p.y >= groundY) {
          p.y = groundY - 1;
        }

        // Particle expands with distance (Gaussian puff)
        p.size += 0.22;
        p.opacity = Math.max(0, 0.75 * (1 - p.age / p.life));

        if (p.age >= p.life || p.x > width + 20) {
          particles.splice(i, 1);
          continue;
        }

        // Color based on concentration/distance
        const distRatio = p.x / width;
        let color = 'rgba(239, 68, 68, ';
        if (distRatio > 0.6) {
          color = 'rgba(173, 198, 255, ';
        } else if (distRatio > 0.3) {
          color = 'rgba(6, 182, 212, ';
        }

        ctx.fillStyle = `${color}${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Re-calculate peak AQI
      const factor = (emissionRate / 65) * (400 / inversionHeight) * (6 / Math.max(2, windSpeed));
      const calculated = Math.round(110 + factor * 50 * (isCurtailmentActive ? 0.5 : 1));
      setSimulatedMaxAqi(calculated);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isOpen, windSpeed, windDir, inversionHeight, emissionRate, isCurtailmentActive]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#181c24] border border-[#31353e] rounded-xl shadow-2xl p-6 text-[#dfe2ee]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#31353e] pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#06b6d4]/15 text-[#4cd7f6]">
              <span className="material-symbols-outlined text-2xl">airwave</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#06b6d4]/20 text-[#4cd7f6] font-bold">
                  ATMOSPHERIC DISPERSION ENGINE
                </span>
                <span className="text-xs font-mono text-[#869397]">
                  MODEL: AERMOD / GAUSSIAN PLUME INVERSION
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
                Simulate AQI Plume Trajectory — {geoNodeName} Airshed
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#bcc9cd] hover:text-white hover:bg-[#262a33]"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Live Simulation Canvas */}
        <div className="relative w-full h-[280px] rounded-lg overflow-hidden border border-[#262a33] bg-[#0a0e16] shadow-inner mb-4">
          <canvas
            ref={canvasRef}
            width={780}
            height={280}
            className="w-full h-full block"
          />

          {/* Canvas HUD overlay */}
          <div className="absolute top-3 right-3 p-2.5 rounded-lg bg-[#0f131c]/90 backdrop-blur-md border border-[#31353e] text-right font-mono text-xs space-y-1">
            <div className="text-[10px] text-[#869397]">SIMULATED DOWNWIND PEAK</div>
            <div className="text-xl font-bold text-[#ffb4ab] leading-none">
              AQI {simulatedMaxAqi}
            </div>
            <div className="text-[10px] text-[#4cd7f6]">
              {simulatedMaxAqi > 200
                ? 'Severe Inversion Risk'
                : simulatedMaxAqi > 150
                ? 'Unhealthy Plume Buffer'
                : 'Moderate Airshed Flow'}
            </div>
          </div>
        </div>

        {/* Dynamic Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-lg bg-[#0f131c] border border-[#262a33] text-xs font-mono">
          {/* Slider 1: Wind Speed */}
          <div>
            <div className="flex justify-between text-[#bcc9cd] mb-1">
              <span>Wind Speed:</span>
              <span className="font-bold text-[#4cd7f6]">{windSpeed} km/h</span>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              value={windSpeed}
              onChange={(e) => setWindSpeed(Number(e.target.value))}
              className="w-full accent-[#4cd7f6]"
            />
            <span className="text-[10px] text-[#869397]">Lower speeds = higher entrapment</span>
          </div>

          {/* Slider 2: Wind Direction */}
          <div>
            <div className="flex justify-between text-[#bcc9cd] mb-1">
              <span>Wind Direction:</span>
              <span className="font-bold text-[#adc6ff]">{windDir}° (NE Flow)</span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              value={windDir}
              onChange={(e) => setWindDir(Number(e.target.value))}
              className="w-full accent-[#adc6ff]"
            />
            <span className="text-[10px] text-[#869397]">Drifts toward Doranda basin</span>
          </div>

          {/* Slider 3: Boundary Layer Height */}
          <div>
            <div className="flex justify-between text-[#bcc9cd] mb-1">
              <span>Inversion Cap:</span>
              <span className="font-bold text-[#ffb4ab]">{inversionHeight}m</span>
            </div>
            <input
              type="range"
              min="150"
              max="900"
              step="20"
              value={inversionHeight}
              onChange={(e) => setInversionHeight(Number(e.target.value))}
              className="w-full accent-[#ffb4ab]"
            />
            <span className="text-[10px] text-[#869397]">Atmospheric mixing lid</span>
          </div>

          {/* Slider 4: Stack Emission Rate */}
          <div>
            <div className="flex justify-between text-[#bcc9cd] mb-1">
              <span>Emission Rate:</span>
              <span className="font-bold text-[#4edea3]">{emissionRate} kg/hr</span>
            </div>
            <input
              type="range"
              min="20"
              max="120"
              value={emissionRate}
              onChange={(e) => setEmissionRate(Number(e.target.value))}
              className="w-full accent-[#4edea3]"
            />
            <span className="text-[10px] text-[#869397]">Point-source particulate mass</span>
          </div>
        </div>

        {/* Toggle Industrial Curtailment Policy */}
        <div className="flex items-center justify-between mt-4 p-3 bg-[#1c2028] rounded-lg border border-[#31353e]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4edea3]">shield</span>
            <div>
              <div className="text-xs font-bold text-white">
                Simulate Mandatory Industrial Curtailment (-55% Load)
              </div>
              <div className="text-[10px] text-[#869397] font-mono">
                Immediately applies emergency kiln throttles and night-shift shift delay
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsCurtailmentActive(!isCurtailmentActive)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              isCurtailmentActive
                ? 'bg-[#1bbd85] text-[#00452e] shadow-[0_0_12px_rgba(27,189,133,0.4)]'
                : 'bg-[#262a33] text-[#bcc9cd] hover:text-white'
            }`}
          >
            {isCurtailmentActive ? 'Curtailment Engaged' : 'Simulate Curtailment'}
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-[#31353e]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#06b6d4] hover:brightness-110 text-[#00424f] font-bold font-mono text-xs transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)]"
          >
            Apply Simulation to Tactical Grid
          </button>
        </div>
      </div>
    </div>
  );
};
