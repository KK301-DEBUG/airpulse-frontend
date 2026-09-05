import React, { useState } from 'react';
import { GEO_NODES_DATA } from '../data/mockData';
import { CitizenReportItem, GeoNodeKey, HotspotData, IncidentAlert, TimeScrubKey } from '../types';

interface OverviewScreenProps {
  selectedGeoNode: GeoNodeKey;
  onSelectGeoNode: (node: GeoNodeKey) => void;
  onOpenSitRep: () => void;
  onOpenDeployVan: () => void;
  onOpenSimulatePlume: () => void;
  onOpenDispatch: (incidentId?: string, hotspotName?: string) => void;
  onInspectPhoto: (report: CitizenReportItem) => void;
  onNavigateScreen: (screen: any) => void;
  alerts: IncidentAlert[];
  onDismissAlert: (id: string) => void;
  onDispatchAlert: (alert: IncidentAlert) => void;
  citizenReports: CitizenReportItem[];
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  selectedGeoNode,
  onOpenSitRep,
  onOpenDeployVan,
  onOpenSimulatePlume,
  onOpenDispatch,
  onInspectPhoto,
  onNavigateScreen,
  alerts,
  onDismissAlert,
  onDispatchAlert,
  citizenReports,
}) => {
  const nodeData = GEO_NODES_DATA[selectedGeoNode];

  // Layer toggles on map
  const [layers, setLayers] = useState({
    aqiHeatmap: true,
    pm25: true,
    sentinelNo2: true,
    fires: true,
    citizenFlags: true,
    windVectors: true,
  });

  // Time scrubber state
  const [timeScrub, setTimeScrub] = useState<TimeScrubKey>('live');

  // Forecast scenario state
  const [forecastScenario, setForecastScenario] = useState<'standard' | 'windShift' | 'curtailment'>('standard');

  // Selected hotspot for drawer / inspector
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotData>(nodeData.hotspots[0]);

  // Adjust values dynamically based on time scrub & scenario
  const getTemporalAqiMultiplier = () => {
    switch (timeScrub) {
      case '-6h': return 0.72;
      case '-3h': return 0.85;
      case 'live': return 1.0;
      case '+3h': return 1.18;
      case '+6h': return 1.38;
      case '+12h': return 1.12;
      default: return 1.0;
    }
  };

  const currentAqi = Math.round(nodeData.weightedAQI * getTemporalAqiMultiplier());

  const getScenarioPoints = () => {
    if (forecastScenario === 'curtailment') {
      return {
        now: 92,
        t3: 104,
        t6: 122,
        t12: 108,
        t24: 84,
        path: "M 40 138 C 100 135, 130 126, 180 124 C 240 120, 280 110, 330 110 C 390 110, 420 124, 470 128 C 520 132, 550 144, 580 148 L 580 190 L 40 190 Z",
        line: "M 40 138 C 100 135, 130 126, 180 124 C 240 120, 280 110, 330 110 C 390 110, 420 124, 470 128 C 520 132, 550 144, 580 148",
        peakY: 110,
        peakVal: 122,
      };
    }
    if (forecastScenario === 'windShift') {
      return {
        now: 92,
        t3: 112,
        t6: 152,
        t12: 118,
        t24: 90,
        path: "M 40 138 C 100 135, 130 120, 180 118 C 240 114, 280 78, 330 78 C 390 78, 420 110, 470 112 C 520 116, 550 136, 580 140 L 580 190 L 40 190 Z",
        line: "M 40 138 C 100 135, 130 120, 180 118 C 240 114, 280 78, 330 78 C 390 78, 420 110, 470 112 C 520 116, 550 136, 580 140",
        peakY: 78,
        peakVal: 152,
      };
    }
    // standard
    return {
      now: 92,
      t3: 118,
      t6: 174,
      t12: 132,
      t24: 96,
      path: "M 40 138 C 100 135, 130 115, 180 112 C 240 108, 280 56, 330 56 C 390 56, 420 95, 470 98 C 520 102, 550 130, 580 134 L 580 190 L 40 190 Z",
      line: "M 40 138 C 100 135, 130 115, 180 112 C 240 108, 280 56, 330 56 C 390 56, 420 95, 470 98 C 520 102, 550 130, 580 134",
      peakY: 56,
      peakVal: 174,
    };
  };

  const scenarioPoints = getScenarioPoints();

  return (
    <div className="flex flex-col w-full">
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header Section */}
        <header className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#4cd7f6]/10 text-[#4cd7f6] uppercase font-bold font-mono tracking-widest">
                DEFENSE-GRADE TELEMETRY
              </span>
              <span className="text-[#869397] text-xs">•</span>
              <span className="text-[11px] text-[#bcc9cd] font-mono">
                {nodeData.gridCode}
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white font-sans">
              Air Quality Command Center
            </h1>
            <p className="text-sm lg:text-base text-[#bcc9cd]">
              Real-time environmental intelligence for rapid climate action
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="btn-export-sitrep"
              onClick={onOpenSitRep}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#262a33] text-[#dfe2ee] hover:bg-[#353942] transition-colors shadow-md text-xs font-mono font-medium"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>Export SitRep</span>
            </button>
            <button
              id="btn-deploy-mobile-van"
              onClick={onOpenDeployVan}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#262a33] text-[#dfe2ee] hover:bg-[#353942] transition-colors shadow-md text-xs font-mono font-medium"
            >
              <span className="material-symbols-outlined text-base text-[#4cd7f6]">
                airport_shuttle
              </span>
              <span>Deploy Mobile Van</span>
            </button>
            <button
              id="btn-simulate-aqi-plume"
              onClick={onOpenSimulatePlume}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#06b6d4] text-[#00424f] font-bold hover:brightness-110 transition-all shadow-[0_0_16px_rgba(6,182,212,0.45)] text-xs font-mono"
            >
              <span className="material-symbols-outlined text-base">airwave</span>
              <span>Simulate AQI Plume</span>
            </button>
          </div>
        </header>

        {/* Operational Status Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-[#181c24] border border-[#262a33] shadow-sm">
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4edea3] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#4edea3]"></span>
            </span>
            <span className="font-semibold text-white font-mono tracking-wide">
              SYSTEM LIVE
            </span>
            <span className="text-[#869397] text-xs">•</span>
            <span className="text-[#bcc9cd]">Data updated 2 min ago</span>
            <span className="text-[#869397] text-xs">•</span>
            <span className="text-[#dfe2ee]">
              Regional Ground Sensors:{' '}
              <span className="font-bold text-[#4edea3] font-mono">142 Active</span>
            </span>
            <span className="text-[#869397] text-xs">•</span>
            <span className="text-[#dfe2ee]">
              Sentinel-5P Satellite Feed:{' '}
              <span className="font-bold text-[#4cd7f6]">Synced (11:20 IST)</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-[#bcc9cd] font-mono text-xs">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-[#4cd7f6]">speed</span>
              <span>LATENCY 42ms</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-[#adc6ff]">
                satellite_alt
              </span>
              <span>ESA/NASA FIRMS</span>
            </span>
          </div>
        </div>

        {/* Key Product Value Banner */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#1c2028] via-[#262a33] to-[#181c24] p-4 lg:p-6 border border-[#31353e] shadow-xl">
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#4cd7f6]/10 blur-3xl pointer-events-none"></div>
          <div className="relative flex flex-col xl:flex-row xl:items-center justify-between gap-6 z-10">
            <div className="flex items-start gap-4 max-w-3xl">
              <div className="p-2 rounded-lg bg-[#4cd7f6]/10 text-[#4cd7f6] mt-1 shrink-0">
                <span className="material-symbols-outlined text-2xl">neurology</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-[#4cd7f6] tracking-widest font-mono">
                    Predictive Inversion Engine v3.4
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-[#4cd7f6] text-[#003640] text-[10px] font-mono font-bold">
                    ACTIVE FORECASTING
                  </span>
                </div>
                <p className="text-base lg:text-lg text-white font-semibold leading-snug">
                  AirGuard doesn’t just tell you where pollution is.{' '}
                  <span className="text-[#4cd7f6] underline decoration-[#4cd7f6]/50 underline-offset-4">
                    It predicts where pollution is going next.
                  </span>
                </p>
                <p className="text-xs lg:text-sm text-[#bcc9cd]">
                  Multi-modal synthesis of physical ground mesh, citizen optical telemetries,
                  multispectral satellite passes, and boundary wind layers.
                </p>
              </div>
            </div>

            {/* Flow Pipeline Visualization */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-[#bcc9cd] shrink-0">
              <div className="flex flex-col items-center p-2 rounded-lg bg-[#0a0e16] min-w-[65px] border border-[#262a33]">
                <span className="material-symbols-outlined text-[#4cd7f6] text-base">sensors</span>
                <span className="text-[10px] font-mono mt-1">Sensors</span>
              </div>
              <span className="material-symbols-outlined text-[#869397] text-xs">add</span>
              <div className="flex flex-col items-center p-2 rounded-lg bg-[#0a0e16] min-w-[65px] border border-[#262a33]">
                <span className="material-symbols-outlined text-[#4edea3] text-base">
                  crowdsource
                </span>
                <span className="text-[10px] font-mono mt-1">Citizens</span>
              </div>
              <span className="material-symbols-outlined text-[#869397] text-xs">add</span>
              <div className="flex flex-col items-center p-2 rounded-lg bg-[#0a0e16] min-w-[65px] border border-[#262a33]">
                <span className="material-symbols-outlined text-[#adc6ff] text-base">
                  satellite_alt
                </span>
                <span className="text-[10px] font-mono mt-1">Satellites</span>
              </div>
              <span className="material-symbols-outlined text-[#869397] text-xs">add</span>
              <div className="flex flex-col items-center p-2 rounded-lg bg-[#0a0e16] min-w-[65px] border border-[#262a33]">
                <span className="material-symbols-outlined text-[#ffb4ab] text-base">
                  local_fire_department
                </span>
                <span className="text-[10px] font-mono mt-1">Fires</span>
              </div>
              <span className="material-symbols-outlined text-[#4cd7f6] text-sm font-bold">
                arrow_forward
              </span>
              <div className="flex flex-col items-center px-3 py-1.5 rounded-lg bg-[#06b6d4] text-[#00424f] font-bold shadow-[0_0_12px_rgba(6,182,212,0.35)]">
                <span className="material-symbols-outlined text-base">psychology</span>
                <span className="text-[10px] font-mono mt-0.5">AI Engine</span>
              </div>
              <span className="material-symbols-outlined text-[#4cd7f6] text-sm font-bold">
                arrow_forward
              </span>
              <div className="flex flex-col items-center px-3 py-1.5 rounded-lg bg-[#1bbd85] text-[#00452e] font-bold shadow-md">
                <span className="material-symbols-outlined text-base">shield</span>
                <span className="text-[10px] font-mono mt-0.5">Mitigation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Four Premium KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* KPI 1: Current AQI */}
          <div className="flex flex-col justify-between p-4 rounded-xl bg-[#1c2028] border border-[#31353e]/60 shadow-md hover:border-[#4cd7f6]/40 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase tracking-wider text-[#bcc9cd] font-bold font-mono">
                CURRENT AQI (WEIGHTED)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#31353e] text-[#adc6ff] text-[10px] font-mono">
                STATION #04
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl lg:text-5xl font-bold font-mono text-[#adc6ff] leading-none">
                  {currentAqi}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#adc6ff]/15 text-[#adc6ff] font-mono">
                  {nodeData.aqiCategory}
                </span>
              </div>
              <div className="flex items-center text-[#ffb4ab] font-mono text-xs font-semibold">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                <span>+18%</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-[#262a33] flex items-center justify-between">
              <span className="text-xs text-[#bcc9cd]">vs yesterday peak (151)</span>
              {/* Mini Sparkline */}
              <svg className="w-20 h-5 overflow-visible" fill="none" viewBox="0 0 96 24">
                <path
                  className="text-[#adc6ff]"
                  d="M2 18 L18 17 L34 19 L48 13 L64 15 L78 6 L94 2"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                ></path>
                <circle className="fill-[#adc6ff]" cx="94" cy="2" r="3"></circle>
              </svg>
            </div>
          </div>

          {/* KPI 2: Active Hotspots */}
          <div className="flex flex-col justify-between p-4 rounded-xl bg-[#1c2028] border border-[#31353e]/60 shadow-md hover:border-[#ffb4ab]/40 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase tracking-wider text-[#bcc9cd] font-bold font-mono">
                ACTIVE HOTSPOTS
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#ffb4ab] text-[#690005] text-[10px] font-bold font-mono animate-pulse">
                URGENT
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl lg:text-5xl font-bold font-mono text-[#ffb4ab] leading-none">
                  {nodeData.activeHotspotsCount}
                </span>
                <span className="text-[10px] text-[#bcc9cd] font-mono">ZONAL COHORTS</span>
              </div>
              <div className="flex items-center text-[#ffb4ab] font-mono text-xs font-semibold">
                <span className="material-symbols-outlined text-sm">north_east</span>
                <span>+3 (4h)</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-[#262a33] flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ffb4ab]"></span>
                <span className="text-white font-semibold">4 Critical</span>
                <span className="text-[#869397] text-xs">•</span>
                <span className="w-2 h-2 rounded-full bg-[#adc6ff]"></span>
                <span className="text-[#bcc9cd]">8 High</span>
              </div>
              <span className="text-[#869397] font-mono text-[10px]">FIRMS 2.1</span>
            </div>
          </div>

          {/* KPI 3: Predicted Spikes */}
          <div className="flex flex-col justify-between p-4 rounded-xl bg-[#1c2028] border border-[#31353e]/60 shadow-md hover:border-[#4cd7f6]/40 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase tracking-wider text-[#bcc9cd] font-bold font-mono">
                PREDICTED SPIKES
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#4cd7f6]/20 text-[#4cd7f6] text-[10px] font-bold font-mono">
                T+12H
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl lg:text-5xl font-bold font-mono text-[#4cd7f6] leading-none">
                  0{nodeData.predictedSpikesCount}
                </span>
                <span className="text-[11px] text-[#4cd7f6] font-semibold font-mono">CLUSTERS</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#06b6d4] text-[#00424f] font-mono font-bold">
                87% CONF
              </span>
            </div>
            <div className="mt-3 pt-2 border-t border-[#262a33] flex items-center justify-between text-xs">
              <span className="text-[#bcc9cd]">
                Highest Risk: <span className="text-[#4cd7f6] font-semibold">Namkum Valley</span>
              </span>
              <span className="text-[#4cd7f6] font-mono text-[10px]">Spike in ~6h</span>
            </div>
          </div>

          {/* KPI 4: Citizen Reports */}
          <div className="flex flex-col justify-between p-4 rounded-xl bg-[#1c2028] border border-[#31353e]/60 shadow-md hover:border-[#4edea3]/40 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase tracking-wider text-[#bcc9cd] font-bold font-mono">
                CITIZEN REPORTS
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#1bbd85] text-[#00452e] text-[10px] font-bold font-mono">
                42 VERIFIED
              </span>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl lg:text-5xl font-bold font-mono text-[#4edea3] leading-none">
                  {nodeData.citizenReportsCount}
                </span>
                <span className="text-[10px] text-[#bcc9cd] font-mono">SUBMISSIONS</span>
              </div>
              <div className="flex items-center text-[#4edea3] font-mono text-xs font-semibold">
                <span className="material-symbols-outlined text-sm">arrow_upward</span>
                <span>+23% today</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-[#262a33] flex items-center justify-between text-xs">
              <span className="text-[#bcc9cd]">
                <span className="text-white font-semibold">6 pending</span> cross-validation
              </span>
              {/* Mini activity bar chart */}
              <div className="flex items-end gap-1 h-5">
                <span className="w-1.5 h-2 bg-[#31353e] rounded-t"></span>
                <span className="w-1.5 h-3 bg-[#4edea3]/50 rounded-t"></span>
                <span className="w-1.5 h-4 bg-[#4edea3]/70 rounded-t"></span>
                <span className="w-1.5 h-5 bg-[#4edea3] rounded-t"></span>
                <span className="w-1.5 h-3 bg-[#4edea3]/80 rounded-t"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid: 65% Geospatial Map / 35% AI Intelligence Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Column A: Geospatial Tactical Canvas (8 cols on lg) */}
          <div className="lg:col-span-8 flex flex-col rounded-xl bg-[#1c2028] border border-[#31353e] overflow-hidden shadow-xl">
            {/* Map Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-[#262a33]/80 backdrop-blur-md border-b border-[#31353e]">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded bg-[#1c2028] text-[#4cd7f6]">
                  <span className="material-symbols-outlined text-lg">explore</span>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white leading-none">
                    {nodeData.name}, {nodeData.state}
                  </h2>
                  <span className="text-[10px] text-[#bcc9cd] font-mono">
                    {nodeData.basin} • {nodeData.coords}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px]">
                <span className="px-2 py-0.5 rounded bg-[#0a0e16] text-[#bcc9cd] border border-[#31353e]">
                  RESOLUTION: 250m
                </span>
                <span className="px-2 py-0.5 rounded bg-[#0a0e16] text-[#bcc9cd] border border-[#31353e]">
                  SRTM v3
                </span>
              </div>
            </div>

            {/* Map Layer Switcher Bar */}
            <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 bg-[#0a0e16]/80 border-b border-[#262a33] overflow-x-auto">
              <button
                onClick={() => setLayers({ ...layers, aqiHeatmap: !layers.aqiHeatmap })}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold font-mono transition-all ${
                  layers.aqiHeatmap
                    ? 'bg-[#06b6d4] text-[#00424f] shadow-sm'
                    : 'bg-[#1c2028] text-[#869397]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#00424f]"></span>
                <span>AQI Heatmap</span>
              </button>

              <button
                onClick={() => setLayers({ ...layers, pm25: !layers.pm25 })}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono transition-all ${
                  layers.pm25
                    ? 'bg-[#1c2028] text-white border border-[#4cd7f6]/40'
                    : 'bg-[#1c2028] text-[#869397]'
                }`}
              >
                <span>PM2.5 μg/m³</span>
              </button>

              <button
                onClick={() => setLayers({ ...layers, sentinelNo2: !layers.sentinelNo2 })}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono transition-all ${
                  layers.sentinelNo2
                    ? 'bg-[#1c2028] text-white border border-[#adc6ff]/40'
                    : 'bg-[#1c2028] text-[#869397]'
                }`}
              >
                <span>Sentinel-5P NO₂</span>
              </button>

              <button
                onClick={() => setLayers({ ...layers, fires: !layers.fires })}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold transition-all ${
                  layers.fires
                    ? 'bg-[#93000a] text-[#ffdad6] shadow-sm'
                    : 'bg-[#1c2028] text-[#869397]'
                }`}
              >
                <span className="material-symbols-outlined text-xs">local_fire_department</span>
                <span>Fires (14)</span>
              </button>

              <button
                onClick={() => setLayers({ ...layers, citizenFlags: !layers.citizenFlags })}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold transition-all ${
                  layers.citizenFlags
                    ? 'bg-[#1bbd85] text-[#00452e] shadow-sm'
                    : 'bg-[#1c2028] text-[#869397]'
                }`}
              >
                <span className="material-symbols-outlined text-xs">photo_camera</span>
                <span>Citizen Flags (6)</span>
              </button>

              <button
                onClick={() => setLayers({ ...layers, windVectors: !layers.windVectors })}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold transition-all ${
                  layers.windVectors
                    ? 'bg-[#0566d9] text-[#e6ecff] shadow-sm'
                    : 'bg-[#1c2028] text-[#869397]'
                }`}
              >
                <span className="material-symbols-outlined text-xs">air</span>
                <span>Vectors 4km/h NE</span>
              </button>
            </div>

            {/* Tactical Canvas Display */}
            <div className="relative w-full h-[520px] bg-[#0a0e16] overflow-hidden select-none">
              {/* SVG Tactical Grid & Plumes */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid-tactical-overview" width="48" height="48" patternUnits="userSpaceOnUse">
                    <path
                      d="M 48 0 L 0 0 0 48"
                      fill="none"
                      stroke="#3d494c"
                      strokeOpacity="0.25"
                      strokeWidth="0.8"
                    ></path>
                    <circle cx="48" cy="48" r="1" fill="#869397" fillOpacity="0.3"></circle>
                  </pattern>

                  {/* Plumes */}
                  <radialGradient id="plume-hotspot-24" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffb4ab" stopOpacity={timeScrub === '+6h' ? '0.85' : '0.6'}></stop>
                    <stop offset="35%" stopColor="#93000a" stopOpacity={timeScrub === '+6h' ? '0.6' : '0.45'}></stop>
                    <stop offset="70%" stopColor="#31353e" stopOpacity="0.2"></stop>
                    <stop offset="100%" stopColor="#0f131c" stopOpacity="0"></stop>
                  </radialGradient>

                  <radialGradient id="plume-hotspot-19" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#adc6ff" stopOpacity="0.5"></stop>
                    <stop offset="50%" stopColor="#0566d9" stopOpacity="0.3"></stop>
                    <stop offset="100%" stopColor="#0f131c" stopOpacity="0"></stop>
                  </radialGradient>

                  <radialGradient id="plume-kanke" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#4edea3" stopOpacity="0.4"></stop>
                    <stop offset="60%" stopColor="#1bbd85" stopOpacity="0.15"></stop>
                    <stop offset="100%" stopColor="#0f131c" stopOpacity="0"></stop>
                  </radialGradient>

                  <marker
                    id="wind-arrow-marker"
                    viewBox="0 0 10 10"
                    refX="5"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 9 5 L 0 9 z" fill="#4cd7f6"></path>
                  </marker>
                </defs>

                {/* Base Pattern */}
                <rect width="100%" height="100%" fill="url(#grid-tactical-overview)"></rect>

                {/* Radar Sweep Effect */}
                <g className="radar-sweep-animation" style={{ transformOrigin: '480px 270px' }}>
                  <line
                    x1="480"
                    y1="270"
                    x2="900"
                    y2="270"
                    stroke="#4cd7f6"
                    strokeWidth="1.5"
                    strokeOpacity="0.6"
                  />
                  <path
                    d="M 480 270 L 900 270 A 420 420 0 0 0 840 50 Z"
                    fill="url(#radar-gradient)"
                    opacity="0.12"
                  />
                </g>

                {/* River Subarnarekha Representation */}
                <path
                  d="M -20 220 C 140 190, 240 260, 420 210 C 600 160, 780 280, 960 230"
                  fill="none"
                  stroke="#4cd7f6"
                  strokeOpacity="0.2"
                  strokeWidth="6"
                  strokeLinecap="round"
                ></path>
                <path
                  d="M 40 460 C 220 380, 360 410, 520 340 C 680 270, 840 330, 1020 310"
                  fill="none"
                  stroke="#4cd7f6"
                  strokeOpacity="0.1"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                ></path>

                {/* Arterial Ring Road Vectors */}
                <ellipse
                  cx="480"
                  cy="270"
                  rx="360"
                  ry="180"
                  fill="none"
                  stroke="#3d494c"
                  strokeWidth="1.5"
                  strokeDasharray="10 6"
                  strokeOpacity="0.6"
                ></ellipse>
                <line x1="480" y1="20" x2="480" y2="520" stroke="#3d494c" strokeWidth="1.5" strokeOpacity="0.4"></line>
                <line x1="40" y1="270" x2="920" y2="270" stroke="#3d494c" strokeWidth="1.5" strokeOpacity="0.4"></line>
                <path d="M 180 80 L 760 450" stroke="#3d494c" strokeWidth="1" strokeOpacity="0.3"></path>

                {/* Smoke Dispersion Plume Overlays */}
                {layers.aqiHeatmap && (
                  <>
                    <ellipse
                      cx="680"
                      cy="380"
                      rx={timeScrub === '+6h' ? 220 : 160}
                      ry={timeScrub === '+6h' ? 120 : 90}
                      fill="url(#plume-hotspot-24)"
                    ></ellipse>
                    <ellipse cx="320" cy="320" rx="120" ry="70" fill="url(#plume-hotspot-19)"></ellipse>
                    <ellipse cx="460" cy="130" rx="90" ry="50" fill="url(#plume-kanke)"></ellipse>
                  </>
                )}

                {/* Wind Vector Streams */}
                {layers.windVectors && (
                  <g stroke="#4cd7f6" strokeWidth="1.5" opacity="0.6" markerEnd="url(#wind-arrow-marker)">
                    <path d="M 220 420 Q 300 370 380 340"></path>
                    <path d="M 380 320 Q 480 260 560 210"></path>
                    <path d="M 520 460 Q 610 390 700 330"></path>
                    <path d="M 640 310 Q 720 240 800 180"></path>
                  </g>
                )}

                {/* Critical Hotspot #24 Circles */}
                <circle cx="680" cy="380" r="45" fill="none" stroke="#ffb4ab" strokeWidth="1" opacity="0.4" className="animate-ping"></circle>
                <circle cx="680" cy="380" r="28" fill="none" stroke="#ffb4ab" strokeWidth="1.5" strokeDasharray="3 3"></circle>
                <circle cx="680" cy="380" r="8" fill="#ffb4ab"></circle>

                {/* High Risk Hotspot #19 */}
                <circle cx="320" cy="320" r="22" fill="none" stroke="#adc6ff" strokeWidth="1.5" strokeDasharray="4 2"></circle>
                <circle cx="320" cy="320" r="6" fill="#adc6ff"></circle>

                {/* Moderate Node #08 */}
                <circle cx="460" cy="130" r="14" fill="none" stroke="#4edea3" strokeWidth="1.5"></circle>
                <circle cx="460" cy="130" r="5" fill="#4edea3"></circle>
              </svg>

              {/* Node 1: Critical Hotspot #24 Marker */}
              <div
                id="marker-hotspot-24"
                onClick={() => setSelectedHotspot(nodeData.hotspots[0])}
                className="absolute left-[62%] top-[64%] transform -translate-x-1/2 -translate-y-full z-20 cursor-pointer"
              >
                <div className="group relative flex flex-col items-start p-2 rounded-lg bg-[#0a0e16]/90 backdrop-blur-md shadow-[0_0_20px_rgba(239,68,68,0.5)] border border-[#93000a] hover:border-[#ffb4ab] transition-all">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffb4ab] animate-pulse"></span>
                    <span className="text-[10px] font-bold text-[#ffb4ab] font-mono uppercase">
                      CRITICAL #24
                    </span>
                    <span className="font-mono text-[10px] text-white font-bold">AQI 178</span>
                  </div>
                  <div className="text-xs text-white font-semibold mt-0.5">
                    Ranchi Industrial Corridor
                  </div>
                  <div className="font-mono text-[10px] text-[#bcc9cd]">
                    Tupudana/Hatia Cluster • PM2.5: 128 μg/m³
                  </div>
                  <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-[#0a0e16] border-r border-b border-[#93000a] rotate-45"></div>
                </div>
              </div>

              {/* Node 2: High Risk Hotspot #19 */}
              <div
                id="marker-hotspot-19"
                onClick={() => nodeData.hotspots[1] && setSelectedHotspot(nodeData.hotspots[1])}
                className="absolute left-[30%] top-[56%] transform -translate-x-1/2 -translate-y-full z-10 cursor-pointer"
              >
                <div className="flex flex-col items-start px-2 py-1.5 rounded-lg bg-[#0a0e16]/90 backdrop-blur-md shadow-md border border-[#0566d9] hover:border-[#adc6ff] transition-all">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#adc6ff]"></span>
                    <span className="text-[10px] font-bold text-[#adc6ff] font-mono">
                      HOTSPOT #19
                    </span>
                    <span className="font-mono text-[10px] text-white">AQI 154</span>
                  </div>
                  <span className="text-[11px] text-white leading-tight">
                    Ring Road Biomass Cluster
                  </span>
                  <div className="absolute -bottom-1 left-4 w-2 h-2 bg-[#0a0e16] border-r border-b border-[#0566d9] rotate-45"></div>
                </div>
              </div>

              {/* Node 3: Moderate Node #08 (Kanke) */}
              <div
                id="marker-node-08"
                onClick={() => nodeData.hotspots[2] && setSelectedHotspot(nodeData.hotspots[2])}
                className="absolute left-[44%] top-[22%] transform -translate-x-1/2 -translate-y-full z-10 cursor-pointer"
              >
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#0a0e16]/85 backdrop-blur-md shadow-sm border border-[#1bbd85]">
                  <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
                  <span className="text-[10px] font-semibold text-white font-mono">
                    Node #08 Kanke
                  </span>
                  <span className="font-mono text-[10px] text-[#4edea3] font-bold">AQI 86</span>
                </div>
              </div>

              {/* Citizen Flag Pin 1 (Namkum Edge) */}
              {layers.citizenFlags && (
                <div
                  onClick={() => onInspectPhoto(citizenReports[0])}
                  className="absolute left-[78%] top-[48%] z-20 flex items-center gap-1 group cursor-pointer"
                  title="Click to inspect citizen photo proof"
                >
                  <div className="p-1.5 rounded-full bg-[#1bbd85] text-[#00452e] shadow-[0_0_12px_rgba(78,222,163,0.6)] hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-xs">photo_camera</span>
                  </div>
                  <span className="hidden group-hover:block px-2 py-0.5 rounded bg-[#0a0e16] text-white text-[10px] font-mono shadow-md whitespace-nowrap border border-[#1bbd85]">
                    Photo: Dense Kiln Smoke (14m ago)
                  </span>
                </div>
              )}

              {/* Citizen Flag Pin 2 (Kokar Crossing) */}
              {layers.citizenFlags && (
                <div
                  onClick={() => onInspectPhoto(citizenReports[1])}
                  className="absolute left-[54%] top-[38%] z-20 flex items-center gap-1 group cursor-pointer"
                  title="Click to inspect citizen photo proof"
                >
                  <div className="p-1.5 rounded-full bg-[#1bbd85] text-[#00452e] shadow-md hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-xs">photo_camera</span>
                  </div>
                  <span className="hidden group-hover:block px-2 py-0.5 rounded bg-[#0a0e16] text-white text-[10px] font-mono shadow-md whitespace-nowrap border border-[#1bbd85]">
                    Photo: Burning Waste Pile
                  </span>
                </div>
              )}

              {/* Thermal Satellite Anomaly (NASA FIRMS Tag) */}
              {layers.fires && (
                <div className="absolute left-[22%] top-[42%] z-10 flex items-center gap-1 px-2 py-0.5 rounded bg-[#93000a]/80 text-[#ffdad6] font-mono text-[10px] font-bold border border-[#ffb4ab]/40">
                  <span className="material-symbols-outlined text-xs animate-pulse">
                    local_fire_department
                  </span>
                  <span>FIRMS 14.2 MW</span>
                </div>
              )}

              {/* Top-Right Tactical Crosshair & Telemetry HUD Overlay */}
              <div className="absolute top-3 right-3 p-2.5 rounded-lg bg-[#0a0e16]/85 backdrop-blur-md shadow-md text-white font-mono text-xs space-y-1 border border-[#31353e]">
                <div className="flex items-center justify-between gap-4 text-[#bcc9cd]">
                  <span>SCAN GRID</span>
                  <span className="text-[#4cd7f6] font-bold">{nodeData.scanGrid}</span>
                </div>
                <div className="text-[#869397] text-[10px]">
                  BOUNDARY LAYER: {nodeData.boundaryLayer}
                </div>
                <div className="text-[#869397] text-[10px]">
                  ATM PRESSURE: {nodeData.pressure}
                </div>
                <div className="text-[#869397] text-[10px]">HUMIDITY: {nodeData.humidity}</div>
              </div>

              {/* Bottom-Left Floating AQI Severity Legend */}
              <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0a0e16]/90 backdrop-blur-xl shadow-lg border border-[#262a33]">
                <span className="text-[10px] uppercase text-[#869397] font-bold mr-1 font-mono">
                  AQI SCALE
                </span>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-[#4edea3]"></span>
                  <span className="text-[10px] text-white font-mono">0-50 Good</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-[#4cd7f6]"></span>
                  <span className="text-[10px] text-white font-mono">51-100 Mod</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-[#adc6ff]"></span>
                  <span className="text-[10px] text-white font-mono">101-200 Unhealthy</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-[#ffb4ab]"></span>
                  <span className="text-[10px] text-white font-mono">201-300 Severe</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-[#93000a]"></span>
                  <span className="text-[10px] text-white font-mono">300+ Haz</span>
                </div>
              </div>
            </div>

            {/* Time Slider Scrub Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 bg-[#262a33]/70 backdrop-blur-md border-t border-[#31353e]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4cd7f6] text-base">history</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-white font-mono">
                  TEMPORAL SCRUBBER
                </span>
              </div>

              <div className="flex items-center gap-1 bg-[#0a0e16] p-1 rounded-lg border border-[#31353e]/60">
                {(['-6h', '-3h', 'live', '+3h', '+6h', '+12h'] as TimeScrubKey[]).map((key) => {
                  const isActive = timeScrub === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setTimeScrub(key)}
                      className={`px-2.5 py-1 rounded font-mono text-[11px] transition-colors ${
                        isActive
                          ? 'bg-[#06b6d4] text-[#00424f] font-bold shadow-sm'
                          : key.includes('+')
                          ? 'text-[#4cd7f6] hover:bg-[#1c2028]'
                          : 'text-[#bcc9cd] hover:text-white hover:bg-[#1c2028]'
                      }`}
                    >
                      {key === 'live' ? (
                        'LIVE NOW'
                      ) : key === '+3h' ? (
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-ping"></span>
                          +3h AI
                        </span>
                      ) : (
                        key
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-1 font-mono text-xs text-[#bcc9cd]">
                <span className="material-symbols-outlined text-xs">tune</span>
                <span>MODEL: LSTM-GraphNet</span>
              </div>
            </div>
          </div>

          {/* Column B: Right-Side AI Intelligence Panel (4 cols on lg) */}
          <div className="lg:col-span-4 flex flex-col justify-between p-4 lg:p-5 rounded-xl bg-[#1c2028] border border-[#31353e] shadow-xl space-y-4">
            <div className="space-y-4">
              {/* Panel Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded bg-[#4cd7f6]/15 text-[#4cd7f6]">
                    <span className="material-symbols-outlined text-xl">psychology</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">
                      AI Intelligence Engine
                    </h3>
                    <span className="text-[10px] text-[#4cd7f6] font-mono font-semibold">
                      SYNTHETIC INFERENCE ACTIVE
                    </span>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-[#4cd7f6] animate-pulse"></span>
              </div>

              {/* Prominent Incident Card */}
              <div className="p-3.5 rounded-xl bg-[#181c24] border border-[#31353e] shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-[#ffb4ab]/20 text-[#ffb4ab] text-[10px] font-mono font-bold flex items-center gap-1 animate-pulse">
                    <span className="material-symbols-outlined text-xs">warning</span>
                    CRITICAL THREAT
                  </span>
                  <span className="font-mono text-[10px] text-[#bcc9cd]">ID: INC-8821</span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white leading-snug">
                    Hidden Hotspot Detected
                  </h4>
                  <p className="text-xs text-[#bcc9cd] font-mono">
                    {selectedHotspot.name} ({selectedHotspot.cluster})
                  </p>
                </div>

                {/* Projection Metric Pill */}
                <div className="p-2.5 rounded-lg bg-[#0a0e16] border border-[#262a33] flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#869397] font-mono uppercase">
                      Current PM2.5
                    </span>
                    <span className="text-lg font-bold font-mono text-[#adc6ff]">
                      {selectedHotspot.pm25} μg/m³
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-[#ffb4ab] text-xl">
                    trending_flat
                  </span>
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] text-[#ffb4ab] font-mono uppercase font-bold">
                      T+6H Prediction
                    </span>
                    <span className="text-lg font-bold font-mono text-[#ffb4ab]">
                      {selectedHotspot.predictedPm25T6h} μg/m³
                    </span>
                  </div>
                </div>

                <div className="text-right text-[10px] text-[#4cd7f6] font-mono">
                  91% Confidence • Temporal Dispersal Inversion
                </div>

                {/* Source Attribution Breakdown */}
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] uppercase tracking-wider text-white font-bold font-mono">
                    Likely Source Attribution
                  </span>
                  <div className="space-y-1.5 text-xs font-mono">
                    <div>
                      <div className="flex justify-between text-[#bcc9cd]">
                        <span>Industrial emissions (Foundries & Kilns)</span>
                        <span className="font-bold text-white">
                          {selectedHotspot.attribution.industrial}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#31353e] rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-[#ffb4ab] rounded-full"
                          style={{ width: `${selectedHotspot.attribution.industrial}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[#bcc9cd]">
                        <span>Biomass / Crop residue burning</span>
                        <span className="font-bold text-white">
                          {selectedHotspot.attribution.biomass}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#31353e] rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-[#adc6ff] rounded-full"
                          style={{ width: `${selectedHotspot.attribution.biomass}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[#bcc9cd]">
                        <span>Heavy transport bypass corridors</span>
                        <span className="font-bold text-white">
                          {selectedHotspot.attribution.transport}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#31353e] rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-[#4cd7f6] rounded-full"
                          style={{ width: `${selectedHotspot.attribution.transport}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[#bcc9cd]">
                        <span>Road dust & fugitive particles</span>
                        <span className="font-bold text-white">
                          {selectedHotspot.attribution.roadDust}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#31353e] rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-[#869397] rounded-full"
                          style={{ width: `${selectedHotspot.attribution.roadDust}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Evidence Checklist */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] uppercase tracking-wider text-white font-bold font-mono">
                    Multispectral Evidence Chain
                  </span>
                  <ul className="space-y-1 text-xs">
                    {selectedHotspot.evidence.map((ev, i) => (
                      <li key={i} className="flex items-start gap-2 text-[#dfe2ee]">
                        <span className="material-symbols-outlined text-[#4edea3] text-sm mt-0.5 shrink-0">
                          check_circle
                        </span>
                        <span className="leading-tight">{ev}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Incident Action CTAs */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                id="btn-view-hotspot-analysis"
                onClick={() => onNavigateScreen('hotspots')}
                className="w-full py-2.5 px-4 rounded-lg bg-[#06b6d4] text-[#00424f] font-mono font-bold text-xs text-center hover:brightness-110 transition-all shadow-[0_0_16px_rgba(6,182,212,0.45)]"
              >
                View Hotspot Analysis
              </button>
              <button
                id="btn-create-incident-dispatch"
                onClick={() => onOpenDispatch('INC-8821', selectedHotspot.name)}
                className="w-full py-2.5 px-4 rounded-lg bg-[#ffb4ab] text-[#690005] font-mono font-bold text-xs text-center hover:brightness-110 transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">emergency</span>
                <span>Create Incident & Dispatch Team</span>
              </button>
            </div>
          </div>
        </div>

        {/* Lower Section Grid: AQI Forecast Chart & Active Alert Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Section C: Wide AQI Forecast Section (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col justify-between p-4 lg:p-5 rounded-xl bg-[#1c2028] border border-[#31353e] shadow-xl">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white font-sans">
                    AI Predictive Plume & AQI Forecast
                  </h3>
                  <p className="text-xs text-[#bcc9cd]">
                    Proprietary deep temporal graph network predicting atmospheric dispersion and
                    night-time inversion
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#4cd7f6]/10 text-[#4cd7f6] font-mono font-bold text-[10px]">
                  HORIZON: +24H
                </span>
              </div>

              {/* Alert Callout */}
              <div className="p-2.5 rounded-lg bg-[#ffb4ab]/15 text-[#ffb4ab] border border-[#ffb4ab]/30 flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 font-semibold text-xs">
                  <span className="material-symbols-outlined text-base">warning</span>
                  <span>
                    87% probability of severe AQI spike in Central Valley within 6 hours
                  </span>
                </div>
                <span className="font-mono text-[10px] font-bold uppercase shrink-0">
                  ACTION SUGGESTED
                </span>
              </div>
            </div>

            {/* High-Fidelity SVG Area Chart */}
            <div className="relative w-full h-64 mt-4 select-none">
              <svg
                className="w-full h-full overflow-visible"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 600 200"
              >
                <defs>
                  <linearGradient id="forecast-glow-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#4cd7f6" stopOpacity="0.45"></stop>
                    <stop offset="60%" stopColor="#4cd7f6" stopOpacity="0.1"></stop>
                    <stop offset="100%" stopColor="#4cd7f6" stopOpacity="0.0"></stop>
                  </linearGradient>
                </defs>

                {/* Horizontal Guide Lines */}
                <line x1="0" y1="40" x2="600" y2="40" stroke="#3d494c" strokeWidth="1" strokeOpacity="0.3"></line>
                <text x="6" y="36" fill="#869397" className="text-[10px] font-mono">
                  AQI 200 (Severe)
                </text>

                {/* Unhealthy Threshold Line (AQI 150) */}
                <line
                  x1="0"
                  y1="80"
                  x2="600"
                  y2="80"
                  stroke="#adc6ff"
                  strokeOpacity="0.6"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                ></line>
                <text x="6" y="76" fill="#adc6ff" className="text-[10px] font-mono">
                  THRESHOLD: AQI 150 (Unhealthy)
                </text>

                <line x1="0" y1="130" x2="600" y2="130" stroke="#3d494c" strokeWidth="1" strokeOpacity="0.3"></line>
                <text x="6" y="126" fill="#869397" className="text-[10px] font-mono">
                  AQI 100 (Moderate)
                </text>

                {/* Filled Area Curve */}
                <path d={scenarioPoints.path} fill="url(#forecast-glow-grad)"></path>

                {/* Foreground Line Curve */}
                <path
                  d={scenarioPoints.line}
                  stroke="#4cd7f6"
                  strokeWidth="3"
                  strokeLinecap="round"
                ></path>

                {/* Key Timeline Anchors */}
                <circle cx="40" cy="138" r="4" fill="#0a0e16" stroke="#4cd7f6" strokeWidth="2"></circle>
                <circle cx="180" cy="112" r="4" fill="#0a0e16" stroke="#4cd7f6" strokeWidth="2"></circle>

                {/* Peak Spike Marker */}
                <circle
                  cx="330"
                  cy={scenarioPoints.peakY}
                  r="6"
                  fill="#ffb4ab"
                  stroke="#ffffff"
                  strokeWidth="2"
                ></circle>
                <circle
                  cx="330"
                  cy={scenarioPoints.peakY}
                  r="14"
                  fill="none"
                  stroke="#ffb4ab"
                  strokeWidth="1.5"
                  opacity="0.5"
                  className="animate-ping"
                ></circle>

                <circle cx="470" cy="98" r="4" fill="#0a0e16" stroke="#4cd7f6" strokeWidth="2"></circle>
                <circle cx="580" cy="134" r="4" fill="#0a0e16" stroke="#4cd7f6" strokeWidth="2"></circle>
              </svg>

              {/* Floating Peak Tooltip */}
              <div
                className="absolute left-[55%] transform -translate-x-1/2 -translate-y-full p-2 rounded-lg bg-[#0a0e16] border border-[#ffb4ab]/60 shadow-xl text-center z-10 pointer-events-none"
                style={{ top: forecastScenario === 'curtailment' ? '40%' : '14%' }}
              >
                <span className="text-[10px] uppercase text-[#ffb4ab] font-bold tracking-wider font-mono">
                  PEAK SPIKE PREDICTED
                </span>
                <div className="text-base font-mono font-bold text-[#ffb4ab] leading-none mt-0.5">
                  AQI {scenarioPoints.peakVal}
                </div>
                <span className="font-mono text-[9px] text-[#bcc9cd]">
                  Estimated at {nodeData.peakSpikeTime}
                </span>
                <div className="w-2 h-2 bg-[#0a0e16] border-r border-b border-[#ffb4ab]/60 rotate-45 mx-auto -mb-1 mt-0.5"></div>
              </div>
            </div>

            {/* Bottom Axis & Scenario Toggles */}
            <div className="mt-4 pt-3 border-t border-[#262a33] flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 font-mono text-[11px] text-[#bcc9cd]">
                <div className="flex flex-col">
                  <span className="text-white font-bold">Now</span>
                  <span>AQI {scenarioPoints.now}</span>
                </div>
                <span className="text-[#869397]">→</span>
                <div className="flex flex-col">
                  <span className="text-white font-bold">+3h</span>
                  <span>AQI {scenarioPoints.t3}</span>
                </div>
                <span className="text-[#869397]">→</span>
                <div className="flex flex-col">
                  <span className="text-[#ffb4ab] font-bold">+6h (Peak)</span>
                  <span className="text-[#ffb4ab]">AQI {scenarioPoints.peakVal}</span>
                </div>
                <span className="text-[#869397]">→</span>
                <div className="flex flex-col">
                  <span className="text-white font-bold">+12h</span>
                  <span>AQI {scenarioPoints.t12}</span>
                </div>
                <span className="text-[#869397]">→</span>
                <div className="flex flex-col">
                  <span className="text-white font-bold">+24h</span>
                  <span>AQI {scenarioPoints.t24}</span>
                </div>
              </div>

              {/* Scenario Toggles */}
              <div className="flex items-center gap-1 bg-[#0a0e16] p-1 rounded-lg border border-[#31353e]">
                <button
                  onClick={() => setForecastScenario('standard')}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                    forecastScenario === 'standard'
                      ? 'bg-[#262a33] text-white font-bold'
                      : 'text-[#bcc9cd] hover:text-white'
                  }`}
                >
                  Standard Inversion
                </button>
                <button
                  onClick={() => setForecastScenario('windShift')}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                    forecastScenario === 'windShift'
                      ? 'bg-[#262a33] text-white font-bold'
                      : 'text-[#bcc9cd] hover:text-white'
                  }`}
                >
                  Wind Shift +45°
                </button>
                <button
                  onClick={() => setForecastScenario('curtailment')}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                    forecastScenario === 'curtailment'
                      ? 'bg-[#1bbd85] text-[#00452e] font-bold'
                      : 'text-[#bcc9cd] hover:text-white'
                  }`}
                >
                  Industrial Curtailment
                </button>
              </div>
            </div>
          </div>

          {/* Section D: Live Environmental Advisory Feed (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col justify-between p-4 lg:p-5 rounded-xl bg-[#1c2028] border border-[#31353e] shadow-xl space-y-4">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ffb4ab] text-xl">
                    notifications_active
                  </span>
                  <h3 className="text-sm font-bold text-white">
                    Live Environmental Advisory Feed
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#262a33] text-white font-mono text-[10px]">
                  {alerts.length} ACTIVE
                </span>
              </div>

              {/* Alert Items */}
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 rounded-xl bg-[#181c24] border border-[#31353e]/80 shadow-sm space-y-2 hover:border-[#4cd7f6]/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          alert.severityType === 'critical'
                            ? 'bg-[#ffb4ab] text-[#690005]'
                            : alert.severityType === 'high'
                            ? 'bg-[#0566d9] text-[#e6ecff]'
                            : 'bg-[#1bbd85] text-[#00452e]'
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <span className="font-mono text-[10px] text-[#bcc9cd]">
                        {alert.timeAgo}
                      </span>
                    </div>

                    <h5 className="text-sm font-semibold text-white leading-snug">
                      {alert.title}
                    </h5>
                    <p className="text-xs text-[#bcc9cd] leading-relaxed">
                      {alert.description}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span
                        className={`font-mono text-[11px] font-semibold flex items-center gap-1 ${
                          alert.severityType === 'critical'
                            ? 'text-[#ffb4ab]'
                            : alert.severityType === 'high'
                            ? 'text-[#adc6ff]'
                            : 'text-[#4edea3]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-xs">schedule</span>
                        {alert.impactTime}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {alert.severityType === 'critical' && (
                          <>
                            <button
                              onClick={() => onDismissAlert(alert.id)}
                              className="px-2 py-0.5 rounded text-[#bcc9cd] hover:text-white text-[11px] font-mono"
                            >
                              Dismiss
                            </button>
                            <button
                              onClick={() => onDispatchAlert(alert)}
                              className="px-2.5 py-0.5 rounded bg-[#ffb4ab] text-[#690005] text-[11px] font-mono font-bold hover:brightness-110"
                            >
                              Dispatch
                            </button>
                          </>
                        )}
                        {alert.severityType === 'high' && (
                          <button
                            onClick={onOpenSimulatePlume}
                            className="px-2.5 py-0.5 rounded bg-[#262a33] text-white text-[11px] font-mono hover:bg-[#31353e]"
                          >
                            Track Plume
                          </button>
                        )}
                        {alert.severityType === 'tertiary' && (
                          <button
                            onClick={() => onInspectPhoto(citizenReports[0])}
                            className="px-2.5 py-0.5 rounded bg-[#262a33] text-white text-[11px] font-mono hover:bg-[#31353e]"
                          >
                            Inspect
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar at bottom */}
            <div className="pt-2 border-t border-[#262a33] flex items-center justify-between">
              <button
                id="btn-view-all-incidents"
                onClick={() => onNavigateScreen('alerts-incidents')}
                className="text-[11px] text-[#4cd7f6] hover:underline flex items-center gap-1 font-bold font-mono uppercase tracking-wider"
              >
                <span>View All Incidents (14)</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
              <button
                onClick={() => alert('Non-urgent advisories muted for 2 hours.')}
                className="text-[11px] px-2.5 py-1 rounded bg-[#262a33] text-[#bcc9cd] hover:text-white font-mono transition-colors"
              >
                Mute Non-Urgent
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
