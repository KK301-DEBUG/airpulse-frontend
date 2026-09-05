import React, { useState } from 'react';
import { MOBILE_VANS_DATA, SENSOR_NODES_DATA } from '../data/mockData';
import { GeoNodeKey } from '../types';

interface LiveMapScreenProps {
  selectedGeoNode: GeoNodeKey;
  onDeployVan: () => void;
  onSimulatePlume: () => void;
}

export const LiveMapScreen: React.FC<LiveMapScreenProps> = ({
  selectedGeoNode,
  onDeployVan,
  onSimulatePlume,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'sensors' | 'vans' | 'fires'>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedPin, setSelectedPin] = useState<{ title: string; aqi: number; detail: string; coords: string } | null>({
    title: 'Station #04 Command Core',
    aqi: 178,
    detail: 'Tower Flux Array • 18ms Latency • Nominal calibration',
    coords: '23.3441° N, 85.3096° E',
  });

  return (
    <div className="flex flex-col w-full p-4 lg:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#4cd7f6]/10 text-[#4cd7f6] font-bold">
              TACTICAL GIS WORKSPACE
            </span>
            <span className="text-xs font-mono text-[#869397]">NODE: {selectedGeoNode}</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight mt-1">
            Real-Time Geospatial Tactical Mesh
          </h1>
          <p className="text-xs text-[#bcc9cd]">
            Multi-spectral satellite layer with active ground sensors, thermal fire anomalies, and mobile fleet units.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onDeployVan}
            className="px-3.5 py-2 rounded-lg bg-[#262a33] hover:bg-[#31353e] text-white text-xs font-mono flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm text-[#4cd7f6]">airport_shuttle</span>
            <span>Dispatch Mobile Unit</span>
          </button>
          <button
            onClick={onSimulatePlume}
            className="px-3.5 py-2 rounded-lg bg-[#06b6d4] text-[#00424f] font-bold text-xs font-mono flex items-center gap-2 shadow-md"
          >
            <span className="material-symbols-outlined text-sm">airwave</span>
            <span>Simulate Plume</span>
          </button>
        </div>
      </div>

      {/* Map Filter & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#1c2028] rounded-xl border border-[#31353e]">
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-[#869397] mr-1">Layer Focus:</span>
          {(['all', 'sensors', 'vans', 'fires'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-2.5 py-1 rounded-full uppercase text-[10px] font-bold transition-colors ${
                activeFilter === filter
                  ? 'bg-[#06b6d4] text-[#00424f]'
                  : 'bg-[#0a0e16] text-[#bcc9cd] hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-[#bcc9cd]">
          <span>Zoom:</span>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
            className="p-1 rounded bg-[#0a0e16] hover:bg-[#262a33] text-white"
          >
            <span className="material-symbols-outlined text-sm">remove</span>
          </button>
          <span className="text-[#4cd7f6]">{Math.round(zoomLevel * 100)}%</span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(2, z + 0.2))}
            className="p-1 rounded bg-[#0a0e16] hover:bg-[#262a33] text-white"
          >
            <span className="material-symbols-outlined text-sm">add</span>
          </button>
        </div>
      </div>

      {/* Main Full GIS Canvas */}
      <div className="relative w-full h-[600px] rounded-xl bg-[#0a0e16] border border-[#31353e] overflow-hidden shadow-2xl">
        <svg
          className="w-full h-full transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
        >
          <defs>
            <pattern id="gis-grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#262a33" strokeWidth="0.8"></path>
              <circle cx="40" cy="40" r="1" fill="#31353e"></circle>
            </pattern>
          </defs>

          <rect width="100%" height="100%" fill="url(#gis-grid-pattern)"></rect>

          {/* Contour Lines & Topo Ridges */}
          <path
            d="M 50 120 Q 300 80 550 160 T 950 220"
            fill="none"
            stroke="#4cd7f6"
            strokeOpacity="0.2"
            strokeWidth="2"
          />
          <path
            d="M 20 480 Q 280 380 620 420 T 1100 360"
            fill="none"
            stroke="#4cd7f6"
            strokeOpacity="0.15"
            strokeWidth="3"
            strokeDasharray="8 6"
          />

          {/* Major Highway Artery */}
          <path
            d="M 120 580 L 450 320 L 780 260 L 1050 140"
            fill="none"
            stroke="#3d494c"
            strokeWidth="4"
            strokeOpacity="0.5"
          />

          {/* Wind Field Streams */}
          <g stroke="#4cd7f6" strokeWidth="1.2" strokeOpacity="0.4" strokeDasharray="6 4">
            <path d="M 150 200 C 300 240, 500 210, 700 180" />
            <path d="M 250 350 C 420 380, 600 330, 800 290" />
            <path d="M 350 480 C 520 490, 720 440, 920 390" />
          </g>

          {/* Plume Footprint (Industrial Tupudana) */}
          <ellipse
            cx="640"
            cy="360"
            rx="200"
            ry="110"
            fill="rgba(239, 68, 68, 0.25)"
            stroke="rgba(239, 68, 68, 0.6)"
            strokeDasharray="4 2"
          />
        </svg>

        {/* Mobile Vans Floating Markers */}
        {(activeFilter === 'all' || activeFilter === 'vans') &&
          MOBILE_VANS_DATA.map((van, i) => {
            const leftPos = i === 0 ? '58%' : i === 1 ? '38%' : '75%';
            const topPos = i === 0 ? '52%' : i === 1 ? '68%' : '32%';
            return (
              <div
                key={van.id}
                onClick={() =>
                  setSelectedPin({
                    title: van.name,
                    aqi: van.liveAQI,
                    detail: `Mobile Fleet • ${van.driver} • Battery ${van.battery}%`,
                    coords: van.currentZone,
                  })
                }
                style={{ left: leftPos, top: topPos }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
              >
                <div className="p-2 rounded-full bg-[#06b6d4] text-[#00424f] shadow-[0_0_16px_rgba(6,182,212,0.6)] flex items-center justify-center hover:scale-125 transition-transform">
                  <span className="material-symbols-outlined text-sm font-bold">airport_shuttle</span>
                </div>
                <div className="hidden group-hover:block absolute left-8 top-0 p-2 rounded-lg bg-[#0a0e16]/95 border border-[#06b6d4] text-[10px] font-mono text-white shadow-xl whitespace-nowrap">
                  <div className="font-bold text-[#4cd7f6]">{van.id}: {van.name}</div>
                  <div>Live AQI: {van.liveAQI} • {van.status}</div>
                </div>
              </div>
            );
          })}

        {/* Sensor Nodes Markers */}
        {(activeFilter === 'all' || activeFilter === 'sensors') &&
          SENSOR_NODES_DATA.map((node, i) => {
            const leftPos = i === 0 ? '64%' : i === 1 ? '48%' : i === 2 ? '42%' : '72%';
            const topPos = i === 0 ? '60%' : i === 1 ? '45%' : i === 2 ? '22%' : '48%';
            return (
              <div
                key={node.id}
                onClick={() =>
                  setSelectedPin({
                    title: `${node.code}: ${node.name}`,
                    aqi: node.aqi,
                    detail: `${node.type} • PM2.5: ${node.pm25} μg/m³ • NO2: ${node.no2} ppb`,
                    coords: node.coordinates,
                  })
                }
                style={{ left: leftPos, top: topPos }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    node.aqi > 150
                      ? 'bg-[#ffb4ab] border-white shadow-[0_0_12px_rgba(255,180,171,0.6)]'
                      : 'bg-[#4edea3] border-white shadow-[0_0_12px_rgba(78,222,163,0.6)]'
                  }`}
                ></div>
                <div className="hidden group-hover:block absolute left-5 top-0 p-2 rounded-lg bg-[#0a0e16]/95 border border-[#31353e] text-[10px] font-mono text-white shadow-xl whitespace-nowrap">
                  <div className="font-bold">{node.code}</div>
                  <div>AQI {node.aqi} • Latency {node.latency}ms</div>
                </div>
              </div>
            );
          })}

        {/* Selected Pin Details Overlay Card */}
        {selectedPin && (
          <div className="absolute bottom-4 left-4 p-4 rounded-xl bg-[#0a0e16]/95 backdrop-blur-xl border border-[#4cd7f6]/50 shadow-2xl max-w-sm text-xs font-mono space-y-2 z-30">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#4cd7f6] uppercase font-bold">
                TELEMETRY PIN INSPECTION
              </span>
              <button
                onClick={() => setSelectedPin(null)}
                className="text-[#869397] hover:text-white"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <div className="text-white font-bold text-sm">{selectedPin.title}</div>
            <div className="flex items-center justify-between p-2 rounded bg-[#181c24] border border-[#262a33]">
              <span className="text-[#bcc9cd]">Reported AQI</span>
              <span className="text-base font-bold text-[#ffb4ab] font-mono">
                {selectedPin.aqi}
              </span>
            </div>
            <div className="text-[#bcc9cd]">{selectedPin.detail}</div>
            <div className="text-[10px] text-[#869397]">{selectedPin.coords}</div>
          </div>
        )}
      </div>
    </div>
  );
};
