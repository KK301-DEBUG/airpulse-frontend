import React, { useState } from 'react';
import { GeoNodeKey } from '../types';

interface PredictionsScreenProps {
  selectedGeoNode: GeoNodeKey;
  onSimulatePlume: () => void;
}

export const PredictionsScreen: React.FC<PredictionsScreenProps> = ({
  selectedGeoNode,
  onSimulatePlume,
}) => {
  const [selectedHorizon, setSelectedHorizon] = useState<'24h' | '48h' | '72h'>('24h');
  const [inversionSensitivity, setInversionSensitivity] = useState<'high' | 'standard' | 'low'>('standard');
  const [curtailmentPolicy, setCurtailmentPolicy] = useState<boolean>(false);

  return (
    <div className="flex flex-col w-full p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0566d9]/20 text-[#adc6ff] font-bold">
              LSTM-GRAPHNET INVERSION ENGINE
            </span>
            <span className="text-xs font-mono text-[#869397]">NODE: {selectedGeoNode}</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight mt-1">
            Deep Atmospheric Dispersion &amp; Predictive Inversion
          </h1>
          <p className="text-xs text-[#bcc9cd]">
            Synthetic temporal forecasting utilizing planetary boundary layer meteorology, thermodynamic gradients, and emission physics.
          </p>
        </div>

        <button
          onClick={onSimulatePlume}
          className="px-4 py-2 rounded-lg bg-[#06b6d4] text-[#00424f] font-mono font-bold text-xs flex items-center gap-2 shadow-md hover:brightness-110 transition-all"
        >
          <span className="material-symbols-outlined text-sm">airwave</span>
          <span>Open Real-time Plume Physics</span>
        </button>
      </div>

      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-[#1c2028] rounded-xl border border-[#31353e]">
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-[#869397]">Forecast Horizon:</span>
          {(['24h', '48h', '72h'] as const).map((h) => (
            <button
              key={h}
              onClick={() => setSelectedHorizon(h)}
              className={`px-3 py-1 rounded-full uppercase text-[10px] font-bold transition-all ${
                selectedHorizon === h
                  ? 'bg-[#06b6d4] text-[#00424f]'
                  : 'bg-[#0a0e16] text-[#bcc9cd] hover:text-white'
              }`}
            >
              +{h}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#869397]">Inversion Model:</span>
            <button
              onClick={() =>
                setInversionSensitivity(
                  inversionSensitivity === 'standard' ? 'high' : 'standard'
                )
              }
              className="px-2.5 py-1 rounded bg-[#262a33] text-[#4cd7f6] text-[10px]"
            >
              {inversionSensitivity.toUpperCase()} SENSITIVITY
            </button>
          </div>
          <button
            onClick={() => setCurtailmentPolicy(!curtailmentPolicy)}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
              curtailmentPolicy
                ? 'bg-[#1bbd85] text-[#00452e]'
                : 'bg-[#0a0e16] text-[#bcc9cd] border border-[#31353e]'
            }`}
          >
            {curtailmentPolicy ? 'Policy: Curtailment ON' : 'Test Curtailment Policy'}
          </button>
        </div>
      </div>

      {/* Predictive Forecast Chart & Stats */}
      <div className="p-5 rounded-xl bg-[#1c2028] border border-[#31353e] shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white font-sans">
            72-Hour Diurnal Inversion Trajectory
          </h3>
          <span className="text-xs font-mono text-[#4cd7f6]">
            Confidence Interval: ±9.4% (Validation Score: 0.93 AUC)
          </span>
        </div>

        {/* SVG Multi-Day Curve */}
        <div className="relative w-full h-64 bg-[#0a0e16] rounded-lg p-3 border border-[#262a33]">
          <svg className="w-full h-full" viewBox="0 0 800 220" preserveAspectRatio="none">
            <defs>
              <linearGradient id="pred-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4cd7f6" stopOpacity="0.4"></stop>
                <stop offset="100%" stopColor="#4cd7f6" stopOpacity="0.0"></stop>
              </linearGradient>
            </defs>

            {/* Threshold line AQI 150 */}
            <line x1="0" y1="90" x2="800" y2="90" stroke="#ffb4ab" strokeDasharray="4 4" strokeWidth="1.5" />
            <text x="10" y="84" fill="#ffb4ab" className="text-[10px] font-mono">
              UNHEALTHY THRESHOLD (AQI 150)
            </text>

            {/* Simulated curve */}
            <path
              d={
                curtailmentPolicy
                  ? 'M 20 160 Q 120 150, 200 130 T 400 120 T 600 140 T 780 160 L 780 210 L 20 210 Z'
                  : 'M 20 160 Q 120 130, 200 60 T 400 140 T 600 50 T 780 150 L 780 210 L 20 210 Z'
              }
              fill="url(#pred-grad)"
            />
            <path
              d={
                curtailmentPolicy
                  ? 'M 20 160 Q 120 150, 200 130 T 400 120 T 600 140 T 780 160'
                  : 'M 20 160 Q 120 130, 200 60 T 400 140 T 600 50 T 780 150'
              }
              stroke={curtailmentPolicy ? '#4edea3' : '#4cd7f6'}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute top-3 right-3 p-2 rounded bg-[#0a0e16]/90 border border-[#31353e] text-xs font-mono">
            <span className="text-[#869397] block text-[10px]">PEAK ESTIMATION</span>
            <span className="text-white font-bold text-sm">
              {curtailmentPolicy ? 'AQI 130 (Moderate Spikes)' : 'AQI 184 (Severe Nightly Inversion)'}
            </span>
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-xs font-mono">
          <div className="p-3 rounded-lg bg-[#181c24] border border-[#262a33]">
            <span className="text-[#869397] block text-[10px]">TODAY EVENING</span>
            <span className="text-white font-bold">18:30 IST</span>
            <p className="text-[#ffb4ab] mt-1">Severe entrapment under 380m lid</p>
          </div>
          <div className="p-3 rounded-lg bg-[#181c24] border border-[#262a33]">
            <span className="text-[#869397] block text-[10px]">TOMORROW MORNING</span>
            <span className="text-white font-bold">06:00 IST</span>
            <p className="text-[#adc6ff] mt-1">Solar radiation breaks inversion</p>
          </div>
          <div className="p-3 rounded-lg bg-[#181c24] border border-[#262a33]">
            <span className="text-[#869397] block text-[10px]">TOMORROW NIGHT</span>
            <span className="text-white font-bold">20:00 IST</span>
            <p className="text-[#ffb4ab] mt-1">Secondary biomass spike anticipated</p>
          </div>
          <div className="p-3 rounded-lg bg-[#181c24] border border-[#262a33]">
            <span className="text-[#869397] block text-[10px]">DAY 3 CLEARANCE</span>
            <span className="text-white font-bold">14:00 IST</span>
            <p className="text-[#4edea3] mt-1">Frontal shift clears basin air</p>
          </div>
        </div>
      </div>
    </div>
  );
};
