import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/authContext";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import AirPulseLoader from "./components/AirPulseLoader";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";

import Dashboard from "./pages/Dashboard";
import LiveMap from "./pages/LiveMap";
import Predictions from "./pages/Predictions";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";

import { useState } from "react";

export default function App() {
  const [showLoader, setShowLoader] = useState(true);

  return (
    <AuthProvider>
      {/* Loader on EVERY refresh */}

      {showLoader && <AirPulseLoader onComplete={() => setShowLoader(false)} />}

      <Routes>
        {/* ================================= */}
        {/* PUBLIC */}
        {/* ================================= */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ================================= */}
        {/* PROTECTED */}
        {/* ================================= */}

        <Route element={<ProtectedRoute />}>
          {/* Navbar only for logged-in area */}

          <Route element={<NavbarLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/map" element={<LiveMap />} />

            <Route path="/predictions" element={<Predictions />} />

            <Route path="/reports" element={<Reports />} />

            <Route path="/analytics" element={<Analytics />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

import { Outlet } from "react-router-dom";

function NavbarLayout() {
  return (
    <>
      <Navbar />

      <main className="pt-16">
        <Outlet />
      </main>
    </>
  );
}
