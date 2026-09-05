import React from 'react';
import { GeoNodeKey } from '../types';

interface AnalyticsScreenProps {
  selectedGeoNode: GeoNodeKey;
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({ selectedGeoNode }) => {
  return (
    <div className="flex flex-col w-full p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#4cd7f6]/10 text-[#4cd7f6] font-bold">
            LONGITUDINAL TELEMETRY
          </span>
          <span className="text-xs font-mono text-[#869397]">NODE: {selectedGeoNode}</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight mt-1">
          Historical Inversion &amp; Curtailment Impact
        </h1>
        <p className="text-xs text-[#bcc9cd]">
          Comparative trendlines evaluating industrial compliance, particulate deposition, and meteorological containment.
        </p>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#1c2028] border border-[#31353e]">
          <span className="text-[10px] uppercase font-mono text-[#869397] block">
            30-DAY INVERSION FREQUENCY
          </span>
          <span className="text-3xl font-bold font-mono text-white mt-1 block">18 Days</span>
          <p className="text-xs text-[#ffb4ab] mt-1">+4 days higher than 5-year average</p>
        </div>

        <div className="p-4 rounded-xl bg-[#1c2028] border border-[#31353e]">
          <span className="text-[10px] uppercase font-mono text-[#869397] block">
            CURTAILMENT AVOIDANCE YIELD
          </span>
          <span className="text-3xl font-bold font-mono text-[#4edea3] mt-1 block">-34% PM2.5</span>
          <p className="text-xs text-[#bcc9cd] mt-1">During emergency 48-hour kiln pauses</p>
        </div>

        <div className="p-4 rounded-xl bg-[#1c2028] border border-[#31353e]">
          <span className="text-[10px] uppercase font-mono text-[#869397] block">
            GROUND VS SATELLITE CORRELATION
          </span>
          <span className="text-3xl font-bold font-mono text-[#4cd7f6] mt-1 block">r = 0.91</span>
          <p className="text-xs text-[#bcc9cd] mt-1">TROPOMI NO2 to surface micro-sensors</p>
        </div>
      </div>

      {/* Monthly Trendline Chart */}
      <div className="p-5 rounded-xl bg-[#1c2028] border border-[#31353e] shadow-xl space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-white font-sans">
            Seasonal Inversion &amp; Boundary Layer Dynamics
          </h3>
          <span className="text-xs font-mono text-[#869397]">Past 6 Months • 24h Moving Average</span>
        </div>

        <div className="h-60 w-full bg-[#0a0e16] rounded-lg p-3 border border-[#262a33] relative">
          <svg className="w-full h-full" viewBox="0 0 700 180" preserveAspectRatio="none">
            {/* Guide grid lines */}
            <line x1="0" y1="40" x2="700" y2="40" stroke="#31353e" strokeWidth="0.8" />
            <line x1="0" y1="90" x2="700" y2="90" stroke="#31353e" strokeWidth="0.8" />
            <line x1="0" y1="140" x2="700" y2="140" stroke="#31353e" strokeWidth="0.8" />

            {/* Inversion curve */}
            <path
              d="M 10 140 C 120 130, 200 60, 320 80 C 420 100, 520 40, 680 70"
              fill="none"
              stroke="#adc6ff"
              strokeWidth="2.5"
            />
            {/* Ground PM2.5 curve */}
            <path
              d="M 10 120 C 120 110, 200 45, 320 65 C 420 85, 520 30, 680 50"
              fill="none"
              stroke="#ffb4ab"
              strokeWidth="2.5"
            />
          </svg>

          <div className="flex justify-between text-[10px] font-mono text-[#869397] mt-2">
            <span>OCT</span>
            <span>NOV (Crop Burning Peak)</span>
            <span>DEC (Winter Inversion)</span>
            <span>JAN (Severe Lid)</span>
            <span>FEB</span>
            <span>MAR (Current)</span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs font-mono text-[#bcc9cd] pt-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-[#ffb4ab]"></span>
            <span>Surface PM2.5 Micro-mesh</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-[#adc6ff]"></span>
            <span>Planetary Boundary Layer Lid (Inverted)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
