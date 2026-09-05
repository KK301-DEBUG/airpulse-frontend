import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Wind,
} from "lucide-react";

import { animate, createScope, createTimeline } from "animejs";

import { auth } from "../firebase";

export default function Login() {
  const root = useRef(null);
  const scope = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const from = location.state?.from || "/dashboard";

  // ----------------------------------------
  // ANIME.JS
  // ----------------------------------------

  useEffect(() => {
    scope.current = createScope({ root }).add(() => {
      const tl = createTimeline({
        defaults: {
          ease: "out(4)",
        },
      });

      tl.add(
        ".auth-bg",
        {
          opacity: [0, 1],
          duration: 700,
        },
        0,
      );

      tl.add(
        ".auth-particle",
        {
          opacity: [0, 0.4],
          scale: [0, 1],
          duration: 500,
        },
        100,
      );

      tl.add(
        ".auth-brand",
        {
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 600,
        },
        150,
      );

      tl.add(
        ".auth-card",
        {
          opacity: [0, 1],
          translateY: [35, 0],
          scale: [0.97, 1],
          duration: 700,
        },
        250,
      );

      tl.add(
        ".auth-field",
        {
          opacity: [0, 1],
          translateX: [-15, 0],
          duration: 350,
        },
        500,
      );

      tl.add(
        ".auth-action",
        {
          opacity: [0, 1],
          translateY: [10, 0],
          duration: 350,
        },
        800,
      );

      animate(".orb", {
        scale: [1, 1.15, 1],
        opacity: [0.15, 0.3, 0.15],
        duration: 3500,
        loop: true,
        ease: "inOut(2)",
      });
    });

    return () => {
      scope.current?.revert();
    };
  }, []);

  // ----------------------------------------
  // EMAIL LOGIN
  // ----------------------------------------

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      await signInWithEmailAndPassword(auth, email, password);

      navigate(from, {
        replace: true,
      });
    } catch (err) {
      console.error(err);

      switch (err.code) {
        case "auth/invalid-credential":
          setError("Invalid email or password.");
          break;

        case "auth/user-not-found":
          setError("No account exists with this email.");
          break;

        case "auth/wrong-password":
          setError("Incorrect password.");
          break;

        case "auth/too-many-requests":
          setError("Too many attempts. Try again later.");
          break;

        default:
          setError("Unable to sign in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------
  // GOOGLE LOGIN
  // ----------------------------------------

  const handleGoogleLogin = async () => {
    setError("");

    try {
      setLoading(true);

      const provider = new GoogleAuthProvider();

      await signInWithPopup(auth, provider);

      navigate(from, {
        replace: true,
      });
    } catch (err) {
      console.error(err);

      setError("Google sign-in was unsuccessful.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={root}
      className="relative min-h-screen overflow-hidden bg-[#020807] text-white"
    >
      {/* -------------------------------- */}
      {/* BACKGROUND */}
      {/* -------------------------------- */}

      <div className="auth-bg pointer-events-none absolute inset-0 opacity-0">
        <div className="absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/[0.035] blur-[130px]" />

        <div className="orb absolute left-[20%] top-[25%] h-32 w-32 rounded-full bg-emerald-400/10 blur-[70px]" />

        <div className="orb absolute bottom-[15%] right-[15%] h-40 w-40 rounded-full bg-cyan-400/5 blur-[80px]" />

        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(52,211,153,0.04) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(52,211,153,0.04) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "45px 45px",
            maskImage: "radial-gradient(circle, black, transparent 75%)",
          }}
        />
      </div>

      {/* -------------------------------- */}
      {/* PARTICLES */}
      {/* -------------------------------- */}

      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <span
            key={i}
            className="auth-particle absolute h-[2px] w-[2px] rounded-full bg-emerald-300 opacity-0"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 61) % 100}%`,
            }}
          />
        ))}
      </div>

      {/* -------------------------------- */}
      {/* CONTENT */}
      {/* -------------------------------- */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          {/* Brand */}

          <div className="auth-brand mb-8 text-center opacity-0">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-400/10">
                <div className="absolute inset-0 rounded-xl bg-emerald-400/10 blur-xl" />

                <Wind size={22} className="relative text-emerald-400" />
              </div>

              <span className="text-2xl font-semibold tracking-tight">
                AIR
                <span className="text-emerald-400">PULSE</span>
              </span>
            </Link>

            <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.3em] text-white/25">
              Climate Intelligence Platform
            </p>
          </div>

          {/* Card */}

          <div className="auth-card rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl opacity-0 sm:p-8">
            {/* Header */}

            <div className="mb-7">
              <div className="mb-3 flex items-center gap-2">
                <ShieldCheck size={15} className="text-emerald-400" />

                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-emerald-400/60">
                  Secure Access
                </span>
              </div>

              <h1 className="text-2xl font-semibold">Welcome back</h1>

              <p className="mt-2 text-sm text-white/35">
                Sign in to access your climate intelligence dashboard.
              </p>
            </div>

            {/* Error */}

            {error && (
              <div className="mb-5 rounded-lg border border-red-400/20 bg-red-400/5 px-4 py-3 text-xs text-red-300">
                {error}
              </div>
            )}

            {/* Google */}

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="auth-action flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-white/[0.08] bg-white/[0.035] text-sm text-white/75 transition hover:border-emerald-400/20 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            {/* Divider */}

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/[0.07]" />

              <span className="font-mono text-[8px] uppercase tracking-widest text-white/20">
                OR
              </span>

              <div className="h-px flex-1 bg-white/[0.07]" />
            </div>

            {/* Form */}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}

              <div className="auth-field opacity-0">
                <label className="mb-2 block font-mono text-[9px] uppercase tracking-widest text-white/35">
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="h-11 w-full rounded-lg border border-white/[0.08] bg-black/20 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/20 transition focus:border-emerald-400/40 focus:bg-emerald-400/[0.02]"
                  />
                </div>
              </div>

              {/* Password */}

              <div className="auth-field opacity-0">
                <div className="mb-2 flex items-center justify-between">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-white/35">
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="font-mono text-[8px] text-emerald-400/60 hover:text-emerald-400"
                  >
                    FORGOT?
                  </Link>
                </div>

                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="h-11 w-full rounded-lg border border-white/[0.08] bg-black/20 pl-10 pr-11 text-sm text-white outline-none placeholder:text-white/20 transition focus:border-emerald-400/40 focus:bg-emerald-400/[0.02]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="auth-action group mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-400 text-sm font-medium text-[#020807] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Signup */}

            <p className="mt-7 text-center text-xs text-white/30">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-emerald-400/80 hover:text-emerald-400"
              >
                Create one
              </Link>
            </p>
          </div>

          {/* Back */}

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/20 transition hover:text-white/50"
            >
              ← Return to AirPulse
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <path
        fill="#4285F4"
        d="M21.35 12.23c0-.79-.07-1.55-.2-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.42z"
      />

      <path
        fill="#34A853"
        d="M12 21.6c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.75 9.75 0 0 0 12 21.6z"
      />

      <path
        fill="#FBBC05"
        d="M6.54 13.69A5.86 5.86 0 0 1 6.23 12c0-.59.1-1.16.31-1.69V7.78H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.22l3.24-2.53z"
      />

      <path
        fill="#EA4335"
        d="M12 6.28c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.37 14.63 2.4 12 2.4a9.75 9.75 0 0 0-8.7 5.38l3.24 2.53C7.31 8 9.46 6.28 12 6.28z"
      />
    </svg>
  );
}
