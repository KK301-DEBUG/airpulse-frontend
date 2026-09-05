import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Wind } from "lucide-react";

import { createScope, createTimeline } from "animejs";

import { auth } from "../firebase";

export default function Signup() {
  const root = useRef(null);
  const scope = useRef(null);

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    scope.current = createScope({ root }).add(() => {
      const tl = createTimeline({
        defaults: {
          ease: "out(4)",
        },
      });

      tl.add(
        ".signup-brand",
        {
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 600,
        },
        0,
      );

      tl.add(
        ".signup-card",
        {
          opacity: [0, 1],
          translateY: [30, 0],
          scale: [0.97, 1],
          duration: 700,
        },
        150,
      );

      tl.add(
        ".signup-field",
        {
          opacity: [0, 1],
          translateX: [-12, 0],
          duration: 300,
        },
        400,
      );
    });

    return () => scope.current?.revert();
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      await updateProfile(result.user, {
        displayName: name,
      });

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err) {
      console.error(err);

      switch (err.code) {
        case "auth/email-already-in-use":
          setError("An account already exists with this email.");
          break;

        case "auth/invalid-email":
          setError("Please enter a valid email.");
          break;

        case "auth/weak-password":
          setError("Password is too weak.");
          break;

        default:
          setError("Unable to create your account.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setLoading(true);

      const provider = new GoogleAuthProvider();

      await signInWithPopup(auth, provider);

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err) {
      console.error(err);

      setError("Google sign-up was unsuccessful.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={root}
      className="relative min-h-screen overflow-hidden bg-[#020807] text-white"
    >
      {/* Background */}

      <div
        className="absolute inset-0 opacity-40"
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

      <div className="absolute left-1/2 top-1/2 h-[550px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/[0.035] blur-[120px]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          {/* Brand */}

          <div className="signup-brand mb-8 text-center opacity-0">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-400/10">
                <Wind size={22} className="text-emerald-400" />
              </div>

              <span className="text-2xl font-semibold">
                AIR
                <span className="text-emerald-400">PULSE</span>
              </span>
            </Link>

            <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.3em] text-white/25">
              Join Climate Intelligence
            </p>
          </div>

          {/* Card */}

          <div className="signup-card rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-xl opacity-0 sm:p-8">
            <h1 className="text-2xl font-semibold">Create account</h1>

            <p className="mt-2 text-sm text-white/35">
              Start monitoring the air around you.
            </p>

            {error && (
              <div className="mt-5 rounded-lg border border-red-400/20 bg-red-400/5 px-4 py-3 text-xs text-red-300">
                {error}
              </div>
            )}

            {/* Google */}

            <button
              onClick={handleGoogle}
              disabled={loading}
              className="mt-6 flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-white/[0.08] bg-white/[0.035] text-sm text-white/70 transition hover:bg-white/[0.06] disabled:opacity-50"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/[0.07]" />

              <span className="font-mono text-[8px] text-white/20">OR</span>

              <div className="h-px flex-1 bg-white/[0.07]" />
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              {/* Name */}

              <div className="signup-field opacity-0">
                <label className="mb-2 block font-mono text-[9px] uppercase tracking-widest text-white/35">
                  Name
                </label>

                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
                  />

                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="h-11 w-full rounded-lg border border-white/[0.08] bg-black/20 pl-10 text-sm outline-none placeholder:text-white/20 focus:border-emerald-400/40"
                  />
                </div>
              </div>

              {/* Email */}

              <div className="signup-field opacity-0">
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
                    className="h-11 w-full rounded-lg border border-white/[0.08] bg-black/20 pl-10 text-sm outline-none placeholder:text-white/20 focus:border-emerald-400/40"
                  />
                </div>
              </div>

              {/* Password */}

              <div className="signup-field opacity-0">
                <label className="mb-2 block font-mono text-[9px] uppercase tracking-widest text-white/35">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="h-11 w-full rounded-lg border border-white/[0.08] bg-black/20 pl-10 pr-11 text-sm outline-none placeholder:text-white/20 focus:border-emerald-400/40"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm */}

              <div className="signup-field opacity-0">
                <label className="mb-2 block font-mono text-[9px] uppercase tracking-widest text-white/35">
                  Confirm Password
                </label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="h-11 w-full rounded-lg border border-white/[0.08] bg-black/20 px-4 text-sm outline-none placeholder:text-white/20 focus:border-emerald-400/40"
                />
              </div>

              {/* Submit */}

              <button
                disabled={loading}
                className="signup-field group flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-400 text-sm font-medium text-[#020807] transition hover:bg-emerald-300 disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                ) : (
                  <>
                    Create account
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-white/30">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-emerald-400/80 hover:text-emerald-400"
              >
                Sign in
              </Link>
            </p>
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
