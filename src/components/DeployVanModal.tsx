import React, { useState } from 'react';
import { MOBILE_VANS_DATA } from '../data/mockData';
import { MobileVanUnit } from '../types';

interface DeployVanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVanDispatched: (van: MobileVanUnit, destination: string) => void;
}

export const DeployVanModal: React.FC<DeployVanModalProps> = ({
  isOpen,
  onClose,
  onVanDispatched,
}) => {
  const [selectedVanId, setSelectedVanId] = useState<string>('VAN-01');
  const [destination, setDestination] = useState<string>('Tupudana Industrial Corridor');
  const [protocol, setProtocol] = useState<string>('Optical LiDAR & Boundary Speciation');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedSuccess, setDeployedSuccess] = useState(false);

  if (!isOpen) return null;

  const destinations = [
    'Tupudana Industrial Corridor (Sub-grid 4B)',
    'Namkum Valley Agro-Corridor',
    'Doranda Residential Buffer Sector',
    'Ring Road Biomass Bypass',
    'Kanke Catchment Biosphere',
  ];

  const protocols = [
    'Optical LiDAR & Boundary Speciation',
    'Mobile Anti-Smog Mist Cannon Deployment',
    'Stack Emission Optical Telemetry Audit',
    'Rapid Citizen Smoke Corroboration',
  ];

  const selectedVan = MOBILE_VANS_DATA.find((v) => v.id === selectedVanId) || MOBILE_VANS_DATA[0];

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      setDeployedSuccess(true);
      onVanDispatched(selectedVan, destination);
      setTimeout(() => {
        setDeployedSuccess(false);
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#181c24] border border-[#31353e] rounded-xl shadow-2xl p-6 text-[#dfe2ee]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#31353e] pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#4cd7f6]/15 text-[#4cd7f6]">
              <span className="material-symbols-outlined text-2xl">airport_shuttle</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Deploy Mobile Air Quality Telemetry Van
              </h2>
              <p className="text-xs text-[#bcc9cd] font-mono">
                Rapid response ground unit with real-time multi-gas & optical spectrometers
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

        {deployedSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#1bbd85]/20 text-[#4edea3] flex items-center justify-center animate-bounce">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>
            <h3 className="text-lg font-bold text-white">Mobile Van Dispatched!</h3>
            <p className="text-xs text-[#bcc9cd] font-mono max-w-md">
              {selectedVan.name} is en route to {destination}. Real-time telemetry feed integrated into tactical GIS mesh.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Choose Mobile Unit */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#bcc9cd] mb-2">
                1. Select Mobile Monitoring Unit
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {MOBILE_VANS_DATA.map((van) => {
                  const isSelected = selectedVanId === van.id;
                  return (
                    <div
                      key={van.id}
                      onClick={() => setSelectedVanId(van.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#06b6d4]/10 border-[#06b6d4] shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                          : 'bg-[#0f131c] border-[#262a33] hover:border-[#31353e]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-mono text-white">{van.id}</span>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            van.status === 'Standby'
                              ? 'bg-[#4edea3]/20 text-[#4edea3]'
                              : 'bg-[#adc6ff]/20 text-[#adc6ff]'
                          }`}
                        >
                          {van.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#dfe2ee] font-medium mt-1 truncate">
                        {van.name}
                      </div>
                      <div className="text-[10px] text-[#869397] font-mono mt-1 flex items-center justify-between">
                        <span>Batt: {van.battery}%</span>
                        <span className="text-[#4cd7f6]">AQI {van.liveAQI}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Van equipment telemetry pill */}
            <div className="p-3 rounded-lg bg-[#0f131c] border border-[#262a33] text-xs font-mono space-y-1">
              <span className="text-[10px] text-[#869397] block uppercase font-bold">
                Assigned Unit Specs: {selectedVan.name}
              </span>
              <div className="text-[#bcc9cd]">Crew: {selectedVan.driver}</div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedVan.equipment.map((eq, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-[#262a33] text-[#4cd7f6] text-[10px]"
                  >
                    {eq}
                  </span>
                ))}
              </div>
            </div>

            {/* Target Destination */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#bcc9cd] mb-2">
                2. Target Airshed Hotspot / Sector
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0f131c] border border-[#31353e] text-[#dfe2ee] text-xs font-mono focus:border-[#4cd7f6] focus:outline-none"
              >
                {destinations.map((d, i) => (
                  <option key={i} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Mission Protocol */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#bcc9cd] mb-2">
                3. Deployment Protocol
              </label>
              <select
                value={protocol}
                onChange={(e) => setProtocol(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0f131c] border border-[#31353e] text-[#dfe2ee] text-xs font-mono focus:border-[#4cd7f6] focus:outline-none"
              >
                {protocols.map((p, i) => (
                  <option key={i} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#31353e]">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-[#262a33] hover:bg-[#31353e] text-[#dfe2ee] font-mono text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeploy}
                disabled={isDeploying}
                className="px-4 py-2 rounded-lg bg-[#06b6d4] hover:brightness-110 text-[#00424f] font-bold font-mono text-xs flex items-center gap-2 shadow-[0_0_12px_rgba(6,182,212,0.35)] transition-all disabled:opacity-60"
              >
                {isDeploying ? (
                  <>
                    <span className="material-symbols-outlined text-sm animate-spin">
                      progress_activity
                    </span>
                    <span>Transmitting Dispatch Code...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">send</span>
                    <span>Authorize & Deploy Van</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
