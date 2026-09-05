import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Firebase hasn't finished checking the session
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020807]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/10" />

            <div className="h-10 w-10 animate-spin rounded-full border border-white/10 border-t-emerald-400" />
          </div>

          <span className="font-mono text-[9px] tracking-[0.3em] text-white/30">
            VERIFYING SESSION
          </span>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return <Outlet />;
}
