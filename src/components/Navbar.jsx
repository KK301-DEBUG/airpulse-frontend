import { Bell, ChevronDown, LogOut, Menu, User, X } from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setProfileOpen(false);
      setMobileOpen(false);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  // Close menus whenever route changes
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <nav className="fixed left-0 top-0 z-50 w-full border-b border-white/[0.07] bg-[#020807]/85 backdrop-blur-2xl">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* ================= LOGO ================= */}
          <Link
            id="airpulse-navbar-logo"
            to="/"
            className="group flex shrink-0 items-center gap-2.5"
          >
            {/* Logo icon */}
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/25 bg-emerald-400/[0.08] transition duration-300 group-hover:border-emerald-400/50 group-hover:bg-emerald-400/[0.12]">
              <div className="absolute inset-0 rounded-xl bg-emerald-400/10 blur-xl opacity-70 transition duration-300 group-hover:opacity-100" />

              <svg
                viewBox="0 0 24 24"
                className="relative h-[19px] w-[19px] text-emerald-400 transition duration-300 group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M3 12c3-5 6-6 9-2s6 3 9-2" />
                <path d="M3 16c3-3 6-4 9-1s6 2 9-1" />
              </svg>
            </div>

            {/* Brand */}
            <div className="leading-none">
              <span className="poppins text-[17px] font-bold tracking-tight text-white sm:text-lg">
                Air<span className="text-emerald-400">Pulse</span>
              </span>

              <span className="mt-1 hidden font-mono text-[7px] tracking-[0.25em] text-white/25 sm:block">
                CLIMATE INTELLIGENCE
              </span>
            </div>
          </Link>

          {/* ================= DESKTOP NAV ================= */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-white/[0.05] bg-white/[0.015] p-1 lg:flex">
            <NavItem to="/dashboard">Overview</NavItem>
            <NavItem to="/map">Live Map</NavItem>
            <NavItem to="/predictions">Predictions</NavItem>
            <NavItem to="/reports">Reports</NavItem>
            <NavItem to="/analytics">Analytics</NavItem>
          </div>

          {/* ================= DESKTOP RIGHT ================= */}
          <div className="hidden items-center gap-2.5 md:flex">
            {/* Online */}
            <div className="flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/[0.05] px-3 py-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>

              <span className="font-mono text-[8px] tracking-[0.15em] text-emerald-400/70">
                ONLINE
              </span>
            </div>

            {/* Notification */}
            <button
              type="button"
              aria-label="Notifications"
              className="group flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.015] text-white/35 transition hover:border-white/[0.1] hover:bg-white/[0.04] hover:text-emerald-400"
            >
              <Bell size={15} className="transition group-hover:scale-110" />
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                aria-expanded={profileOpen}
                className="flex h-10 items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.015] px-2 transition hover:border-white/[0.1] hover:bg-white/[0.04]"
              >
                {/* Avatar */}
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt=""
                    className="h-7 w-7 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400">
                    <User size={14} />
                  </div>
                )}

                {/* Username */}
                <div className="hidden max-w-[100px] text-left xl:block">
                  <p className="truncate text-[11px] font-medium text-white/70">
                    {user?.displayName || user?.email?.split("@")[0] || "User"}
                  </p>
                </div>

                <ChevronDown
                  size={13}
                  className={`text-white/25 transition duration-300 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-[calc(100%+10px)] w-60 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#07100e]/95 shadow-2xl shadow-black/40 backdrop-blur-2xl">
                  {/* User info */}
                  <div className="border-b border-white/[0.06] p-3.5">
                    <div className="flex items-center gap-3">
                      {user?.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt=""
                          className="h-9 w-9 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                          <User size={16} />
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-white/80">
                          {user?.displayName || "AirPulse User"}
                        </p>

                        <p className="mt-0.5 truncate text-[10px] text-white/30">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Sign out */}
                  <div className="p-1.5">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs text-red-400/70 transition hover:bg-red-400/[0.06] hover:text-red-400"
                    >
                      <LogOut size={14} />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ================= MOBILE ACTIONS ================= */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile notification */}
            <button
              type="button"
              aria-label="Notifications"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.015] text-white/40 active:scale-95"
            >
              <Bell size={16} />
            </button>

            {/* Menu button */}
            <button
              type="button"
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((prev) => !prev)}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.015] text-white/50 transition hover:bg-white/[0.04] hover:text-emerald-400 active:scale-95"
            >
              <Menu
                size={18}
                className={`absolute transition-all duration-300 ${
                  mobileOpen
                    ? "rotate-90 scale-0 opacity-0"
                    : "rotate-0 scale-100 opacity-100"
                }`}
              />

              <X
                size={18}
                className={`absolute transition-all duration-300 ${
                  mobileOpen
                    ? "rotate-0 scale-100 opacity-100"
                    : "-rotate-90 scale-0 opacity-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* ================= MOBILE MENU ================= */}
        <div
          className={`overflow-hidden border-t border-white/[0.06] bg-[#020807]/95 backdrop-blur-2xl transition-all duration-300 md:hidden ${
            mobileOpen
              ? "max-h-[600px] opacity-100"
              : "max-h-0 border-t-transparent opacity-0"
          }`}
        >
          <div className="px-4 pb-5 pt-3 sm:px-6">
            {/* Mobile user */}
            <div className="mb-4 flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt=""
                  className="h-9 w-9 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                  <User size={16} />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-white/75">
                  {user?.displayName ||
                    user?.email?.split("@")[0] ||
                    "AirPulse User"}
                </p>

                <p className="truncate text-[10px] text-white/25">
                  {user?.email}
                </p>
              </div>

              <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/10 bg-emerald-400/[0.05] px-2 py-1 font-mono text-[7px] tracking-wider text-emerald-400/70">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                ONLINE
              </span>
            </div>

            {/* Navigation */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <MobileNavItem to="/dashboard" label="Overview" />

              <MobileNavItem to="/map" label="Live Map" />

              <MobileNavItem to="/predictions" label="Predictions" />

              <MobileNavItem to="/reports" label="Reports" />

              <MobileNavItem to="/analytics" label="Analytics" />
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/10 bg-red-400/[0.03] py-3 text-xs text-red-400/70 transition hover:bg-red-400/[0.06] hover:text-red-400 active:scale-[0.99]"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] md:hidden"
        />
      )}
    </>
  );
}

/* =========================================================
   DESKTOP NAV ITEM
========================================================= */

function NavItem({ to, children }) {
  const location = useLocation();

  const active =
    location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <Link
      to={to}
      className={`relative rounded-full px-3 py-2 font-mono text-[9px] uppercase tracking-[0.13em] transition-all duration-200 ${
        active
          ? "bg-emerald-400/10 text-emerald-400"
          : "text-white/35 hover:bg-white/[0.03] hover:text-white/70"
      }`}
    >
      {children}

      {active && (
        <span className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-emerald-400" />
      )}
    </Link>
  );
}

/* =========================================================
   MOBILE NAV ITEM
========================================================= */

function MobileNavItem({ to, label }) {
  const location = useLocation();

  const active =
    location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <Link
      to={to}
      className={`flex min-h-[52px] items-center rounded-xl border px-3 transition-all duration-200 active:scale-[0.98] ${
        active
          ? "border-emerald-400/15 bg-emerald-400/[0.08] text-emerald-400"
          : "border-white/[0.05] bg-white/[0.015] text-white/40 hover:bg-white/[0.035] hover:text-white/70"
      }`}
    >
      <div>
        <p className="font-mono text-[9px] uppercase tracking-[0.12em]">
          {label}
        </p>

        {active && (
          <p className="mt-1 text-[7px] uppercase tracking-widest text-emerald-400/40">
            Current
          </p>
        )}
      </div>
    </Link>
  );
}
