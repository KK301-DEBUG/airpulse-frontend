import React from 'react';
import { NavScreen } from '../types';

interface SidebarProps {
  currentScreen: NavScreen;
  onNavigate: (screen: NavScreen) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenDiagnostics?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  isOpenMobile = false,
  onCloseMobile,
  onOpenDiagnostics,
}) => {
  const navItems: {
    id: NavScreen;
    label: string;
    icon: string;
    badge?: string;
    badgeStyle?: string;
    pulse?: boolean;
  }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: 'dashboard',
      pulse: true,
    },
    {
      id: 'live-map',
      label: 'Live Map',
      icon: 'public',
      badge: 'GIS',
      badgeStyle: 'bg-[#262a33] text-[#bcc9cd]',
    },
    {
      id: 'hotspots',
      label: 'Hotspots',
      icon: 'local_fire_department',
      badge: 'Urban',
      badgeStyle: 'bg-[#93000a] text-[#ffdad6]',
    },
    {
      id: 'predictions',
      label: 'Predictions',
      icon: 'psychology',
      badge: 'AI',
      badgeStyle: 'bg-[#0566d9] text-[#e6ecff]',
    },
    {
      id: 'citizen-reports',
      label: 'Citizen Reports',
      icon: 'campaign',
      badge: '48 new',
      badgeStyle: 'bg-[#1bbd85] text-[#00452e] font-bold',
    },
    {
      id: 'alerts-incidents',
      label: 'Alerts & Incidents',
      icon: 'warning',
      badge: 'Critical 3',
      badgeStyle: 'bg-[#ffb4ab] text-[#690005] font-bold',
    },
    {
      id: 'federated-network',
      label: 'Federated Network',
      icon: 'hub',
      badge: 'Private',
      badgeStyle: 'bg-[#262a33] text-[#bcc9cd]',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'insights',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        id="airguard-sidebar"
        className={`fixed left-0 top-0 h-full w-80 bg-[#181c24]/95 backdrop-blur-xl z-50 flex flex-col justify-between shadow-[0_12px_32px_-4px_rgba(0,0,0,0.8)] border-r border-[#31353e]/60 transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          {/* Logo Header */}
          <div className="h-16 px-4 flex items-center justify-between bg-[#0a0e16]/80 border-b border-[#262a33]">
            <div className="flex items-center gap-3">
              <img
                alt="AirGuard Logo"
                className="h-8 w-auto object-contain drop-shadow-[0_0_8px_rgba(76,215,246,0.4)]"
                src="https://lh3.googleusercontent.com/aida/AEtjO1WfTDykC6ukm1X5X_aVzUzwYZlpdbLhvYRsL15Q7K3sUuYmA6sh-KUrDnJpdnfO6ZFZhsxP7Dy7JE3hvyekxFZj1n1xqAGRit8tW-3X8EAJfqyt-AbrpQh1Y9QZkn5rk1VG9VmuR16XrS-2PnWmUc_wf5Ny9g7yvZ3l9n7RzZl0R77RJOP5-hRkwUbmT5ILpGBWyXp5srmIcMF3D4KPBY6cHW_A4SUq9bp-wWWEVKpFSVHo6OZfuwjSdw"
              />
              <div className="flex flex-col">
                <span className="font-bold text-lg text-[#dfe2ee] tracking-tight uppercase leading-none">
                  AirGuard
                </span>
                <span className="text-[10px] text-[#4cd7f6] tracking-widest uppercase font-mono font-bold mt-1">
                  AI Telemetry Grid
                </span>
              </div>
            </div>
            {isOpenMobile && (
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-lg text-[#bcc9cd] hover:text-white hover:bg-[#262a33]"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            )}
          </div>

          {/* Nav Section */}
          <div className="px-3 py-4">
            <div className="text-[10px] text-[#869397] uppercase px-3 mb-2 font-mono font-semibold tracking-wider">
              Operational Radar
            </div>
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = currentScreen === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => {
                      onNavigate(item.id);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-left ${
                      isActive
                        ? 'bg-[#06b6d4] text-[#00424f] font-bold shadow-[0_0_16px_rgba(6,182,212,0.4)]'
                        : 'text-[#bcc9cd] hover:bg-[#262a33] hover:text-[#dfe2ee]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-lg">
                        {item.icon}
                      </span>
                      <span className="text-[13px] font-medium tracking-wide">
                        {item.label}
                      </span>
                    </div>

                    {item.pulse && isActive && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00424f] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00424f]"></span>
                      </span>
                    )}

                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${item.badgeStyle}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="p-3 bg-[#0a0e16]/90 border-t border-[#262a33] flex flex-col gap-2.5">
          {/* Grid Health Indicator */}
          <div className="p-2.5 rounded-lg bg-[#1c2028] flex items-center justify-between border border-[#31353e]/40">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4edea3] text-sm animate-pulse">
                sensors
              </span>
              <span className="text-[11px] text-[#bcc9cd] font-mono">
                Grid Health
              </span>
            </div>
            <span className="text-[11px] text-[#4edea3] font-bold font-mono">
              99.4% Online
            </span>
          </div>

          {/* System Links */}
          <div className="flex items-center justify-between px-1 text-xs">
            <button
              onClick={onOpenDiagnostics}
              className="text-[11px] text-[#bcc9cd] hover:text-[#4cd7f6] transition-colors flex items-center gap-1 font-mono"
            >
              <span className="material-symbols-outlined text-xs">tune</span>
              Diagnostics
            </button>
            <button
              onClick={() => onNavigate('federated-network')}
              className="text-[11px] text-[#bcc9cd] hover:text-[#4cd7f6] transition-colors flex items-center gap-1 font-mono"
            >
              <span className="material-symbols-outlined text-xs">settings</span>
              Settings
            </button>
          </div>

          {/* Commander Profile */}
          <div className="pt-1 flex items-center justify-between bg-[#181c24] rounded-lg p-2 border border-[#31353e]/40">
            <div className="flex items-center gap-2.5">
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-[#4cd7f6]/50"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4aQKjELELeGJsoGsOejkkp-_HhMa6MaPzd0oJOCmOLDinjX7VaSvG90EeK-CusYxNrDM6Apt3GLTpvMbf23N3QdcLjuX61s8qyZ1MqodYZbpXMmKgSvzypUASY_RzahsVS4fSf6fXygjPa_l8irEeOLTsT1cwhT8XFT78QhduEpZK67bTQflQ1yQN2nMMl02BMd68EDF7JNCOxzR3GVTIG5c2R9qUbacF67Ly0pVfxW-uM_eQQ4bL"
              />
              <div className="flex flex-col">
                <span className="text-xs text-[#dfe2ee] font-bold leading-none">
                  Commander Roy
                </span>
                <span className="text-[10px] text-[#869397] font-mono leading-none mt-1">
                  Ranchi Hub (Lead)
                </span>
              </div>
            </div>
            <button 
              onClick={onOpenDiagnostics}
              className="text-[#bcc9cd] hover:text-white p-1 rounded hover:bg-[#262a33]"
            >
              <span className="material-symbols-outlined text-sm">more_vert</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
