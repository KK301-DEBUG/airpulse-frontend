import React, { useState } from 'react';
import { GEO_NODES_DATA } from '../data/mockData';
import { GeoNodeKey, HotspotData } from '../types';

interface HotspotsScreenProps {
  selectedGeoNode: GeoNodeKey;
  onDispatchHotspot: (hotspot: HotspotData) => void;
  onSimulatePlume: () => void;
}

export const HotspotsScreen: React.FC<HotspotsScreenProps> = ({
  selectedGeoNode,
  onDispatchHotspot,
  onSimulatePlume,
}) => {
  const nodeData = GEO_NODES_DATA[selectedGeoNode];
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'high' | 'moderate'>('all');
  const [activeHotspot, setActiveHotspot] = useState<HotspotData>(nodeData.hotspots[0]);

  const filteredHotspots = nodeData.hotspots.filter(
    (h) => severityFilter === 'all' || h.severity === severityFilter
  );

  return (
    <div className="flex flex-col w-full p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#93000a]/30 text-[#ffdad6] font-bold">
              URBAN POLLUTION COHORTS
            </span>
            <span className="text-xs font-mono text-[#869397]">
              {nodeData.activeHotspotsCount} ACTIVE CLUSTERS
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight mt-1">
            Industrial & Biomass Hotspot Analysis
          </h1>
          <p className="text-xs text-[#bcc9cd]">
            Synthetic attribution linking satellite thermal passes, industrial stack telemetry, and local meteorology.
          </p>
        </div>

        <button
          onClick={onSimulatePlume}
          className="px-4 py-2 rounded-lg bg-[#06b6d4] text-[#00424f] font-mono font-bold text-xs flex items-center gap-2 shadow-md hover:brightness-110 transition-all"
        >
          <span className="material-symbols-outlined text-sm">airwave</span>
          <span>Simulate Dispersal</span>
        </button>
      </div>

      {/* Severity Filter Pills */}
      <div className="flex items-center gap-2 font-mono text-xs">
        <span className="text-[#869397]">Filter:</span>
        {(['all', 'critical', 'high', 'moderate'] as const).map((sev) => (
          <button
            key={sev}
            onClick={() => setSeverityFilter(sev)}
            className={`px-3 py-1 rounded-full uppercase text-[10px] font-bold transition-all ${
              severityFilter === sev
                ? 'bg-[#06b6d4] text-[#00424f]'
                : 'bg-[#1c2028] text-[#bcc9cd] hover:text-white'
            }`}
          >
            {sev}
          </button>
        ))}
      </div>

      {/* Hotspots Grid & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hotspots List (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {filteredHotspots.map((hotspot) => {
            const isSelected = activeHotspot.id === hotspot.id;
            return (
              <div
                key={hotspot.id}
                onClick={() => setActiveHotspot(hotspot)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#1c2028] border-[#06b6d4] shadow-[0_0_16px_rgba(6,182,212,0.25)]'
                    : 'bg-[#181c24] border-[#31353e] hover:border-[#4cd7f6]/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                        hotspot.severity === 'critical'
                          ? 'bg-[#ffb4ab] text-[#690005]'
                          : hotspot.severity === 'high'
                          ? 'bg-[#0566d9] text-[#e6ecff]'
                          : 'bg-[#1bbd85] text-[#00452e]'
                      }`}
                    >
                      {hotspot.code}
                    </span>
                    <span className="text-white font-bold text-sm">{hotspot.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-xs text-[#869397]">AQI</span>
                    <span className="text-lg font-bold text-[#ffb4ab]">{hotspot.aqi}</span>
                  </div>
                </div>

                <div className="text-xs text-[#bcc9cd] mb-3">{hotspot.cluster}</div>

                <div className="grid grid-cols-3 gap-2 p-2 rounded-lg bg-[#0a0e16] text-[11px] font-mono">
                  <div>
                    <span className="text-[#869397] block text-[9px]">PM2.5</span>
                    <span className="text-white font-bold">{hotspot.pm25} μg/m³</span>
                  </div>
                  <div>
                    <span className="text-[#869397] block text-[9px]">T+6H PREDICTED</span>
                    <span className="text-[#ffb4ab] font-bold">{hotspot.predictedPm25T6h} μg/m³</span>
                  </div>
                  <div>
                    <span className="text-[#869397] block text-[9px]">THERMAL FLUX</span>
                    <span className="text-[#4cd7f6] font-bold">{hotspot.thermalFluxMW ?? 4.5} MW</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Hotspot Deep Dossier (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-[#1c2028] border border-[#31353e] shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#31353e] pb-3">
            <div>
              <span className="text-[10px] font-mono text-[#4cd7f6] font-bold uppercase">
                HOTSPOT EVIDENCE DOSSIER
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">{activeHotspot.name}</h3>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#ffb4ab]/20 text-[#ffb4ab] font-mono text-[10px] font-bold">
              ID: {activeHotspot.id.toUpperCase()}
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="text-[#869397] text-[10px] uppercase font-bold">
              Likely Source Attribution
            </div>
            <div className="space-y-1.5">
              <div>
                <div className="flex justify-between text-[#bcc9cd]">
                  <span>Industrial Foundries &amp; Kilns</span>
                  <span className="text-white font-bold">{activeHotspot.attribution.industrial}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#31353e] rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-[#ffb4ab] rounded-full"
                    style={{ width: `${activeHotspot.attribution.industrial}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#bcc9cd]">
                  <span>Biomass &amp; Crop Burning</span>
                  <span className="text-white font-bold">{activeHotspot.attribution.biomass}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#31353e] rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-[#adc6ff] rounded-full"
                    style={{ width: `${activeHotspot.attribution.biomass}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#bcc9cd]">
                  <span>Transport Freight</span>
                  <span className="text-white font-bold">{activeHotspot.attribution.transport}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#31353e] rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-[#4cd7f6] rounded-full"
                    style={{ width: `${activeHotspot.attribution.transport}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#31353e] text-xs">
            <div className="text-[#869397] text-[10px] uppercase font-mono font-bold">
              Multispectral Satellite &amp; Ground Evidence
            </div>
            <ul className="space-y-1.5">
              {activeHotspot.evidence.map((ev, i) => (
                <li key={i} className="flex items-start gap-2 text-[#dfe2ee]">
                  <span className="material-symbols-outlined text-[#4edea3] text-sm mt-0.5 shrink-0">
                    check_circle
                  </span>
                  <span>{ev}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-3 border-t border-[#31353e]">
            <button
              onClick={() => onDispatchHotspot(activeHotspot)}
              className="w-full py-2.5 px-4 rounded-lg bg-[#ffb4ab] hover:brightness-110 text-[#690005] font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <span className="material-symbols-outlined text-base">emergency</span>
              <span>Deploy Containment Squad to {activeHotspot.name}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
