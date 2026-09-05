import React, { useState } from 'react';
import { GeoNodeKey } from '../types';

interface HeaderProps {
  selectedGeoNode: GeoNodeKey;
  onSelectGeoNode: (node: GeoNodeKey) => void;
  onOpenMobileMenu: () => void;
  windSpeedText: string;
  tempText: string;
  onQuickRefresh: () => void;
  activeAlertsCount: number;
  onOpenAlertsFeed: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedGeoNode,
  onSelectGeoNode,
  onOpenMobileMenu,
  windSpeedText,
  tempText,
  onQuickRefresh,
  activeAlertsCount,
  onOpenAlertsFeed,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const geoNodes: GeoNodeKey[] = ['Ranchi', 'Delhi NCR', 'Patna', 'Mumbai'];

  const handleRefresh = () => {
    setIsRefreshing(true);
    onQuickRefresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <header
      id="command-header"
      className="fixed top-0 left-0 lg:left-80 right-0 h-16 bg-[#0a0e16]/90 backdrop-blur-xl z-40 flex items-center justify-between px-4 lg:px-6 border-b border-[#262a33] shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
    >
      {/* Left zone info & mobile toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-[#bcc9cd] hover:text-white hover:bg-[#262a33]"
        >
          <span className="material-symbols-outlined text-xl">menu</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 font-mono text-xs">
          <span className="material-symbols-outlined text-[#4cd7f6] text-base animate-pulse">
            radar
          </span>
          <span className="text-[#dfe2ee] font-bold tracking-wider uppercase text-[11px]">
            ZONE: EASTERN INDIA
          </span>
          <span className="text-[#869397]">|</span>
          <span className="text-[#bcc9cd] text-[11px]">
            NODE: {selectedGeoNode.toUpperCase()} CENTER
          </span>
        </div>
      </div>

      {/* Center Geo Node Switcher */}
      <div className="flex items-center gap-1 bg-[#1c2028] px-2.5 py-1 rounded-full border border-[#31353e]/60 shadow-inner">
        <span className="material-symbols-outlined text-[#869397] text-sm hidden md:inline">
          search
        </span>
        <span className="text-[11px] text-[#bcc9cd] font-mono pr-1 hidden md:inline">
          Geo Node:
        </span>
        {geoNodes.map((node) => {
          const isSelected = selectedGeoNode === node;
          return (
            <button
              key={node}
              id={`geo-node-btn-${node.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => onSelectGeoNode(node)}
              className={`text-[11px] px-2 py-0.5 rounded font-mono transition-colors ${
                isSelected
                  ? 'bg-[#06b6d4] text-[#00424f] font-bold shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                  : 'text-[#bcc9cd] hover:text-[#dfe2ee] hover:bg-[#262a33]'
              }`}
            >
              {node}
            </button>
          );
        })}
      </div>

      {/* Right Telemetry stats & alerts */}
      <div className="flex items-center gap-3 lg:gap-5">
        {/* Live Telemetry Ping */}
        <button
          onClick={handleRefresh}
          title="Click to force telemetry resync"
          className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#1c2028] border border-[#31353e]/50 hover:border-[#4cd7f6]/50 transition-colors"
        >
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4cd7f6] opacity-75 ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            ></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4cd7f6]"></span>
          </span>
          <span className="text-[10px] text-[#4cd7f6] font-bold font-mono tracking-wider uppercase">
            LIVE TELEMETRY
          </span>
          <span className="text-[#869397] text-xs">•</span>
          <span className="text-[11px] text-[#bcc9cd] font-mono">
            {isRefreshing ? 'Syncing...' : 'Synced 2m ago'}
          </span>
        </button>

        {/* Environmental Telemetry */}
        <div className="hidden sm:flex items-center gap-2 text-[#bcc9cd] font-mono text-[11px]">
          <span className="material-symbols-outlined text-[#adc6ff] text-sm">
            air
          </span>
          <span className="font-bold text-[#dfe2ee]">{windSpeedText}</span>
          <span className="text-[#869397] text-xs">|</span>
          <span className="material-symbols-outlined text-[#adc6ff] text-sm">
            thermostat
          </span>
          <span className="font-bold text-[#dfe2ee]">{tempText}</span>
        </div>

        {/* Notifications Icon with Ping */}
        <button
          id="btn-notifications-feed"
          onClick={onOpenAlertsFeed}
          className="relative p-1.5 rounded-lg text-[#bcc9cd] hover:text-[#dfe2ee] hover:bg-[#1c2028] transition-colors"
          title={`${activeAlertsCount} active critical advisories`}
        >
          <span className="material-symbols-outlined text-xl">
            notifications
          </span>
          {activeAlertsCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#ffb4ab] ring-2 ring-[#0a0e16] animate-pulse"></span>
          )}
        </button>

        {/* Profile Avatar */}
        <div className="flex items-center pl-1">
          <img
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-[#4cd7f6]/40"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4aQKjELELeGJsoGsOejkkp-_HhMa6MaPzd0oJOCmOLDinjX7VaSvG90EeK-CusYxNrDM6Apt3GLTpvMbf23N3QdcLjuX61s8qyZ1MqodYZbpXMmKgSvzypUASY_RzahsVS4fSf6fXygjPa_l8irEeOLTsT1cwhT8XFT78QhduEpZK67bTQflQ1yQN2nMMl02BMd68EDF7JNCOxzR3GVTIG5c2R9qUbacF67Ly0pVfxW-uM_eQQ4bL"
          />
        </div>
      </div>
    </header>
  );
};
