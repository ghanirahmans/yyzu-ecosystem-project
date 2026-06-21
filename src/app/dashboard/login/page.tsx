"use client";

// ============================================================
// YYZU Admin System — Login Page (Full-Stack wired)
// ============================================================

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";
import { loginAction } from "@/app/actions/auth";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const errorMessages: Record<string, string> = {
    INVALID_CREDENTIALS: "Incorrect username/email or password. Please try again.",
    ACCOUNT_SUSPENDED: "Your account has been suspended. Please contact the administrator.",
    ACCOUNT_REJECTED: "Your registration request has been rejected.",
    INVALID_INPUTS: "Please enter a valid username/email and password.",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await loginAction({ username, password });
      if (result.success) {
        // Refresh the router to trigger middleware state checks and redirect to dashboard
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(errorMessages[result.error ?? ""] ?? "Something went wrong.");
        setLoading(false);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  // Quick login helpers for demo matching seed data
  const DEMO_ACCOUNTS = [
    { label: "System Admin", username: "ghanirahmans", password: "Admin@YYZU2024" },
    { label: "Team Leader (Nexus)", username: "arjun_pratama", password: "Member@YYZU2024" },
    { label: "Member (Nexus)", username: "rizky_ramadan", password: "Member@YYZU2024" },
    { label: "Pending Approval", username: "pending_user_1", password: "Member@YYZU2024" },
  ];

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-[#161b22] border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xl font-black text-white mb-4 shadow-lg shadow-indigo-500/20">
              Y
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-sm text-white/40 mt-1">Sign in to YYZU Admin</p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="flex items-start gap-3 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 mb-5 text-sm text-rose-400">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5" htmlFor="username">
                Username or Email
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
                className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition-colors duration-150 mt-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn size={16} />
              )}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm text-white/40 mt-5">
            Don&apos;t have an account?{" "}
            <Link href="/dashboard/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Register
            </Link>
          </p>

          {/* Demo accounts */}
          <div className="mt-6 pt-5 border-t border-white/8">
            <p className="text-xs text-white/30 text-center mb-3 font-medium uppercase tracking-wider">
              Demo accounts (click to fill)
            </p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.username}
                  type="button"
                  onClick={() => {
                    setUsername(acc.username);
                    setPassword(acc.password);
                  }}
                  className="text-left px-3 py-2 rounded-lg bg-white/4 hover:bg-white/8 border border-white/6 transition-all group"
                >
                  <span className="text-xs font-semibold text-white/65 group-hover:text-white/95 block transition-colors truncate">
                    {acc.label}
                  </span>
                  <span className="text-[10px] text-white/35 font-mono truncate block">@{acc.username}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Back to site */}
        <p className="text-center text-xs text-white/25 mt-5">
          <Link href="/" className="hover:text-white/50 transition-colors">
            ← Back to yyzu.tech
          </Link>
        </p>
      </div>
    </div>
  );
}
