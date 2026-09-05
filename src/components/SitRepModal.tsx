import React, { useState } from 'react';

interface SitRepModalProps {
  isOpen: boolean;
  onClose: () => void;
  geoNodeName: string;
  gridCode: string;
  weightedAQI: number;
  hotspotsCount: number;
}

export const SitRepModal: React.FC<SitRepModalProps> = ({
  isOpen,
  onClose,
  geoNodeName,
  gridCode,
  weightedAQI,
  hotspotsCount,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#181c24] border border-[#31353e] rounded-xl shadow-2xl p-6 text-[#dfe2ee]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#31353e] pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#4cd7f6]/10 text-[#4cd7f6]">
              <span className="material-symbols-outlined text-2xl">description</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#4cd7f6]/20 text-[#4cd7f6] font-bold">
                  DEFENSE-GRADE SITREP
                </span>
                <span className="text-xs font-mono text-[#869397]">CLASSIFICATION: OFFICIAL</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white mt-1">
                Air Quality Tactical Situation Report (SitRep)
              </h2>
              <p className="text-xs text-[#bcc9cd] font-mono">
                Jurisdiction: {geoNodeName} Airshed • {gridCode} • Timestamp: 2026-09-05 11:24 IST
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#bcc9cd] hover:text-white hover:bg-[#262a33]"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Content Document */}
        <div className="space-y-4 text-xs font-mono bg-[#0f131c] p-4 rounded-lg border border-[#262a33]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-[#181c24] rounded-lg border border-[#31353e]/40">
            <div>
              <span className="text-[#869397] block text-[10px]">WEIGHTED AQI</span>
              <span className="text-base font-bold text-[#adc6ff]">{weightedAQI} (UNHEALTHY)</span>
            </div>
            <div>
              <span className="text-[#869397] block text-[10px]">ACTIVE COHORTS</span>
              <span className="text-base font-bold text-[#ffb4ab]">{hotspotsCount} Critical Zonal</span>
            </div>
            <div>
              <span className="text-[#869397] block text-[10px]">SATELLITE SYNC</span>
              <span className="text-base font-bold text-[#4edea3]">Sentinel-5P OK</span>
            </div>
            <div>
              <span className="text-[#869397] block text-[10px]">PREDICTED SPIKE</span>
              <span className="text-base font-bold text-[#4cd7f6]">T+6h (+38% PM2.5)</span>
            </div>
          </div>

          <div>
            <h4 className="text-[#4cd7f6] font-bold uppercase tracking-wider mb-1">
              1. Executive Summary & Atmospheric Dynamics
            </h4>
            <p className="text-[#bcc9cd] leading-relaxed">
              Thermal inversion cap expected at 380m AGL within the next 4 hours. Stagnant surface winds (speed &lt; 4.0 km/h, NE flow) indicate high particulate entrapment across the central basin. Multiple industrial point-source emissions in Tupudana and Ring Road peripheral agricultural biomass fires pose compound respiratory threats to nearby residential sectors.
            </p>
          </div>

          <div>
            <h4 className="text-[#4cd7f6] font-bold uppercase tracking-wider mb-1">
              2. Identified Priority Hotspots
            </h4>
            <ul className="space-y-1 text-[#bcc9cd]">
              <li className="flex items-start gap-2">
                <span className="text-[#ffb4ab] font-bold">[CRITICAL #24]</span>
                <span>Ranchi Industrial Corridor (PM2.5: 128 μg/m³ → Projected 174 μg/m³). Source: Foundries, refractory kilns.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#adc6ff] font-bold">[HOTSPOT #19]</span>
                <span>Ring Road Agri-Cluster (FIRMS 14.2 MW thermal flux anomaly, stubble residue burn).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4edea3] font-bold">[STATION #04]</span>
                <span>Central Core Monitoring Tower operational, latency nominal at 18ms.</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#4cd7f6] font-bold uppercase tracking-wider mb-1">
              3. Operational Directives & Dispatch Advice
            </h4>
            <p className="text-[#bcc9cd] leading-relaxed">
              Immediate deployment of Mobile Optical Van 01 to the Tupudana perimeter recommended. Anti-smog water mist canons should be placed on standby at Doranda sector border. Environmental enforcement units to conduct spot audits on non-compliant nocturnal kiln firings.
            </p>
          </div>

          <div className="pt-2 border-t border-[#262a33] flex items-center justify-between text-[11px] text-[#869397]">
            <span>Authorized by: Commander Roy (Lead Tactical Operations)</span>
            <span>Cryptographic Checksum: SHA256-4c9f8e...</span>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex flex-wrap items-center justify-end gap-3 mt-5 pt-4 border-t border-[#31353e]">
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-lg bg-[#262a33] hover:bg-[#31353e] text-[#dfe2ee] font-mono text-xs flex items-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">content_copy</span>
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Raw SitRep'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-[#262a33] hover:bg-[#31353e] text-[#dfe2ee] font-mono text-xs flex items-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">print</span>
            <span>Print / Save PDF</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#06b6d4] hover:brightness-110 text-[#00424f] font-bold font-mono text-xs flex items-center gap-2 shadow-[0_0_12px_rgba(6,182,212,0.35)] transition-all"
          >
            <span className="material-symbols-outlined text-sm">check</span>
            <span>Acknowledge & Dismiss</span>
          </button>
        </div>
      </div>
    </div>
  );
};
