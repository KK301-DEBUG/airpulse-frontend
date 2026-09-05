import {
  Bell,
  ChevronDown,
  LogIn,
  LogOut,
  Menu,
  User,
  UserPlus,
  X,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const profileRef = useRef(null);

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = async () => {
    try {
      await logout();

      setProfileOpen(false);
      setMobileOpen(false);

      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  /* =========================================================
     CLOSE MENUS ON ROUTE CHANGE
  ========================================================= */

  useEffect(() => {
    // Route changes close transient menus; the state is not external data.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  /* =========================================================
     CLOSE PROFILE WHEN CLICKING OUTSIDE
  ========================================================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* =========================================================
     PREVENT BODY SCROLL ON MOBILE MENU
  ========================================================= */

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /* =========================================================
     USER INFO
  ========================================================= */

  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "AirPulse User";

  const email = user?.email || "";

  return (
    <>
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="fixed left-0 top-0 z-[100] w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-2xl">
        <div className="mx-auto flex h-[68px] w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            id="airpulse-navbar-logo"
            to="/"
            className="group flex shrink-0 items-center gap-2.5"
          >
            {/* Brand */}
            <img
              src="/logo.png"
              alt="AirPulse Logo"
              className="h-8 w-8 rounded-lg object-cover transition group-hover:scale-110"
            />

            <div className="leading-none">
              <span className="poppins text-[17px] font-bold tracking-tight text-slate-900 sm:text-lg">
                Air<span className="text-emerald-600">Pulse</span>
              </span>

              <span className="mt-1 hidden font-mono text-[7px] tracking-[0.25em] text-slate-400 sm:block">
                CLIMATE INTELLIGENCE
              </span>
            </div>
          </Link>

          {/* =================================================
              DESKTOP NAV
              
              IMPORTANT:
              xl = desktop
              below xl = mobile/tablet
          ================================================= */}

          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-slate-200 bg-slate-50/80 p-1 shadow-sm xl:flex">
            <NavItem to="/dashboard">Overview</NavItem>

            <NavItem to="/map">Live Map</NavItem>

            <NavItem to="/predictions">Predictions</NavItem>

            <NavItem to="/reports">Reports</NavItem>

            <NavItem to="/analytics">Analytics</NavItem>
          </div>

          {/* =================================================
              DESKTOP RIGHT
          ================================================= */}

          <div className="hidden items-center gap-2 xl:flex">
            {/* Online */}

            {user && (
              <div className="flex items-center gap-2 rounded-full border border-emerald-500/15 bg-emerald-500/[0.06] px-3 py-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-40" />

                  <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>

                <span className="font-mono text-[8px] tracking-[0.15em] text-emerald-600">
                  ONLINE
                </span>
              </div>
            )}

            {/* Notification */}

            {user && (
              <button
                type="button"
                aria-label="Notifications"
                className="group flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 shadow-sm transition hover:border-emerald-500/20 hover:bg-emerald-50 hover:text-emerald-600"
              >
                <Bell size={15} className="transition group-hover:scale-110" />
              </button>
            )}

            {/* =================================================
                AUTH BUTTONS WHEN LOGGED OUT
            ================================================= */}

            {!user && (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl px-3.5 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  <LogIn size={14} />
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-emerald-500 px-4 text-xs font-medium text-white shadow-sm shadow-emerald-500/20 transition hover:bg-emerald-600 hover:shadow-md hover:shadow-emerald-500/20"
                >
                  <UserPlus size={14} />
                  Sign up
                </Link>
              </div>
            )}

            {/* =================================================
                PROFILE
            ================================================= */}

            {user && (
              <div ref={profileRef} className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  aria-expanded={profileOpen}
                  className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 shadow-sm transition hover:border-emerald-500/20 hover:bg-slate-50"
                >
                  {/* Avatar */}

                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt=""
                      className="h-7 w-7 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                      <User size={14} />
                    </div>
                  )}

                  {/* Name */}

                  <div className="hidden max-w-[120px] text-left 2xl:block">
                    <p className="truncate text-[11px] font-medium text-slate-700">
                      {displayName}
                    </p>

                    <p className="truncate text-[8px] text-slate-400">
                      AirPulse user
                    </p>
                  </div>

                  <ChevronDown
                    size={13}
                    className={`text-slate-400 transition duration-300 ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* =================================================
                    PROFILE DROPDOWN
                ================================================= */}

                {profileOpen && (
                  <div className="absolute right-0 top-[calc(100%+10px)] w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
                    {/* User */}

                    <div className="border-b border-slate-100 p-4">
                      <div className="flex items-center gap-3">
                        {user?.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt=""
                            className="h-10 w-10 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                            <User size={17} />
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-slate-800">
                            {displayName}
                          </p>

                          <p className="mt-0.5 truncate text-[10px] text-slate-400">
                            {email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Profile */}

                    <div className="p-1.5">
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                      >
                        <User size={14} />
                        My profile
                      </Link>

                      {/* Logout */}

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs text-red-500/80 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <LogOut size={14} />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* =================================================
              TABLET + MOBILE ACTIONS
              
              Everything below xl uses this.
          ================================================= */}

          <div className="flex items-center gap-2 xl:hidden">
            {/* Login */}

            {!user && (
              <Link
                to="/login"
                className="hidden h-9 items-center rounded-xl px-3 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 sm:flex"
              >
                Login
              </Link>
            )}

            {/* Notification */}

            {user && (
              <button
                type="button"
                aria-label="Notifications"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 shadow-sm transition hover:text-emerald-600 active:scale-95"
              >
                <Bell size={16} />
              </button>
            )}

            {/* Menu */}

            <button
              type="button"
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((prev) => !prev)}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-emerald-500/20 hover:text-emerald-600 active:scale-95"
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

        {/* =====================================================
            MOBILE / TABLET MENU
        ===================================================== */}

        <div
          className={`overflow-hidden border-t border-slate-200 bg-white transition-all duration-300 xl:hidden ${
            mobileOpen
              ? "max-h-[700px] opacity-100"
              : "max-h-0 border-t-transparent opacity-0"
          }`}
        >
          <div className="mx-auto max-w-7xl px-4 pb-6 pt-4 sm:px-6">
            {/* =================================================
                AUTH USER
            ================================================= */}

            {user ? (
              <div className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt=""
                    className="h-10 w-10 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                    <User size={17} />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-800">
                    {displayName}
                  </p>

                  <p className="truncate text-[10px] text-slate-400">{email}</p>
                </div>

                <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/15 bg-emerald-500/[0.06] px-2 py-1 font-mono text-[7px] tracking-wider text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  ONLINE
                </span>
              </div>
            ) : (
              /* =================================================
                 LOGGED OUT MOBILE AUTH
              ================================================= */

              <div className="mb-4 grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  <LogIn size={14} />
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-500 text-xs font-medium text-white shadow-sm transition hover:bg-emerald-600"
                >
                  <UserPlus size={14} />
                  Sign up
                </Link>
              </div>
            )}

            {/* =================================================
                NAVIGATION
            ================================================= */}

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <MobileNavItem to="/dashboard" label="Overview" />

              <MobileNavItem to="/map" label="Live Map" />

              <MobileNavItem to="/predictions" label="Predictions" />

              <MobileNavItem to="/reports" label="Reports" />

              <MobileNavItem to="/analytics" label="Analytics" />

              {user && <MobileNavItem to="/profile" label="Profile" />}
            </div>

            {/* =================================================
                MOBILE LOGOUT
            ================================================= */}

            {user && (
              <button
                type="button"
                onClick={handleLogout}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/10 bg-red-50 py-3 text-xs font-medium text-red-500 transition hover:bg-red-100 active:scale-[0.99]"
              >
                <LogOut size={14} />
                Sign out
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* =====================================================
          MOBILE BACKDROP
      ===================================================== */}

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-[90] bg-slate-900/20 backdrop-blur-[2px] xl:hidden"
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
          ? "bg-emerald-500/10 text-emerald-600"
          : "text-slate-400 hover:bg-white hover:text-slate-700"
      }`}
    >
      {children}

      {active && (
        <span className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-emerald-500" />
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
      className={`flex min-h-[54px] items-center rounded-xl border px-3 transition-all duration-200 active:scale-[0.98] ${
        active
          ? "border-emerald-500/20 bg-emerald-500/[0.07] text-emerald-600"
          : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800"
      }`}
    >
      <div>
        <p className="font-mono text-[9px] uppercase tracking-[0.12em]">
          {label}
        </p>

        {active && (
          <p className="mt-1 text-[7px] uppercase tracking-widest text-emerald-500/50">
            Current
          </p>
        )}
      </div>
    </Link>
  );
}
