import { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { ArrowLeft, Mail, Wind } from "lucide-react";

import { auth } from "../firebase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    setError("");

    if (!email) {
      setError("Enter your email address.");
      return;
    }

    try {
      setLoading(true);

      await sendPasswordResetEmail(auth, email);

      setSent(true);
    } catch (err) {
      console.error(err);

      setError("Unable to send reset email. Check the email address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020807] px-5 text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-400/10">
              <Wind size={21} className="text-emerald-400" />
            </div>

            <span className="text-2xl font-semibold">
              AIR
              <span className="text-emerald-400">PULSE</span>
            </span>
          </Link>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-7 backdrop-blur-xl">
          {!sent ? (
            <>
              <h1 className="text-2xl font-semibold">Reset password</h1>

              <p className="mt-2 text-sm text-white/35">
                We'll send you a secure password reset link.
              </p>

              {error && (
                <div className="mt-5 rounded-lg border border-red-400/20 bg-red-400/5 p-3 text-xs text-red-300">
                  {error}
                </div>
              )}

              <form onSubmit={handleReset} className="mt-6">
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
                    className="h-11 w-full rounded-lg border border-white/[0.08] bg-black/20 pl-10 pr-4 text-sm outline-none placeholder:text-white/20 focus:border-emerald-400/40"
                  />
                </div>

                <button
                  disabled={loading}
                  className="mt-4 h-11 w-full rounded-lg bg-emerald-400 text-sm font-medium text-[#020807] hover:bg-emerald-300 disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send reset link"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10">
                <Mail size={20} className="text-emerald-400" />
              </div>

              <h1 className="mt-5 text-xl font-semibold">Check your email</h1>

              <p className="mt-2 text-sm text-white/35">
                If an account exists for{" "}
                <span className="text-white/60">{email}</span>, we've sent a
                password reset link.
              </p>
            </div>
          )}

          <Link
            to="/login"
            className="mt-7 flex items-center justify-center gap-2 text-xs text-white/30 hover:text-white/60"
          >
            <ArrowLeft size={13} />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
