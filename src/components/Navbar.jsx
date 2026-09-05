import { Activity, Bell, Menu, X } from "lucide-react";

import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-white/[0.06] bg-[#020807]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        {/* ================================= */}
        {/* LOGO */}
        {/* ================================= */}

        <div
          id="airpulse-navbar-logo"
          className="flex items-center gap-2 opacity-0"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-400/30 bg-emerald-400/10">
            <div className="absolute inset-0 rounded-lg bg-emerald-400/10 blur-lg" />

            <Activity
              size={19}
              strokeWidth={1.5}
              className="relative text-emerald-400"
            />
          </div>

          <div className="flex flex-col">
            <span className="text-lg font-semibold tracking-tight">
              AIR
              <span className="text-emerald-400">PULSE</span>
            </span>

            <span className="hidden font-mono text-[7px] tracking-[0.25em] text-white/30 sm:block">
              CLIMATE INTELLIGENCE
            </span>
          </div>
        </div>

        {/* ================================= */}
        {/* DESKTOP NAV */}
        {/* ================================= */}

        <div className="hidden items-center gap-8 md:flex">
          <NavItem active>Overview</NavItem>

          <NavItem>Live Map</NavItem>

          <NavItem>Predictions</NavItem>

          <NavItem>Reports</NavItem>

          <NavItem>Analytics</NavItem>
        </div>

        {/* ================================= */}
        {/* RIGHT */}
        {/* ================================= */}

        <div className="hidden items-center gap-3 md:flex">
          {/* Status */}

          <div className="flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/5 px-3 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

            <span className="font-mono text-[9px] tracking-wider text-emerald-400/70">
              SYSTEM ONLINE
            </span>
          </div>

          {/* Notification */}

          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] text-white/40 transition hover:border-emerald-400/20 hover:text-emerald-400">
            <Bell size={16} />
          </button>
        </div>

        {/* ================================= */}
        {/* MOBILE */}
        {/* ================================= */}

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] text-white/50 md:hidden"
        >
          {mobileOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>

      {/* ================================= */}
      {/* MOBILE MENU */}
      {/* ================================= */}

      {mobileOpen && (
        <div className="border-t border-white/[0.06] bg-[#020807]/95 px-5 py-5 md:hidden">
          <div className="flex flex-col gap-4">
            <NavItem active>Overview</NavItem>

            <NavItem>Live Map</NavItem>

            <NavItem>Predictions</NavItem>

            <NavItem>Reports</NavItem>

            <NavItem>Analytics</NavItem>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ================================= */
/* NAV ITEM */
/* ================================= */

function NavItem({ children, active = false }) {
  return (
    <button
      className={`relative font-mono text-[10px] uppercase tracking-[0.15em] transition ${
        active ? "text-emerald-400" : "text-white/40 hover:text-white/80"
      }`}
    >
      {children}

      {active && (
        <span className="absolute -bottom-2 left-0 h-px w-full bg-emerald-400" />
      )}
    </button>
  );
}
