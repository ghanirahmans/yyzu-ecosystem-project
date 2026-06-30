"use client";

// ============================================================
// YYZU Operational Dashboard — Login Page
// ============================================================

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";
import { actionLogin } from "@/features/auth/actions";

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
      const result = await actionLogin({ username, password });
      if (result.success) {
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

  const DEMO_ACCOUNTS = [
    { label: "System Admin", username: "ghanirahmans", password: "Admin@YYZU2024" },
    { label: "Team Leader (Nexus)", username: "arjun_pratama", password: "Member@YYZU2024" },
    { label: "Member (Nexus)", username: "rizky_ramadan", password: "Member@YYZU2024" },
    { label: "Pending Approval", username: "pending_user_1", password: "Member@YYZU2024" },
  ];

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full animate-float"
          style={{
            background: "radial-gradient(circle, rgba(0,21,165,0.14) 0%, transparent 70%)",
          }}
        />
        <div className="absolute -bottom-40 -right-40 w-[560px] h-[560px] rounded-full animate-float-delayed"
          style={{
            background: "radial-gradient(circle, rgba(0,106,103,0.12) 0%, transparent 70%)",
          }}
        />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)",
            animation: "float 13s ease-in-out infinite",
            animationDelay: "-6s",
          }}
        />
      </div>

      <div className="relative w-full max-w-sm animate-slide-in-up">
        {/* Card */}
        <div className="bg-[#161b22] border border-white/10 rounded-2xl p-7 shadow-2xl shadow-black/40">
          {/* Logo */}
          <div className="flex flex-col items-center mb-7">
            <div
              className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0015A5] to-[#006A67] flex items-center justify-center text-lg font-black text-white mb-4 shadow-lg"
              style={{ boxShadow: "0 8px 24px rgba(0, 21, 165, 0.25)" }}
              aria-hidden="true"
            >
              Y
            </div>
            <h1 className="text-[22px] font-bold text-white tracking-tight">Welcome back</h1>
            <p className="text-[13px] text-white/40 mt-1">Sign in to YYZU Operasional</p>
          </div>

          {/* Error banner */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 mb-5 text-[13px] text-rose-400"
            >
              <AlertCircle size={15} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-[13px] font-medium text-white/65 mb-1.5" htmlFor="username">
                Username or Email
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
                autoComplete="username"
                className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-2.5 text-[13px] text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/40 transition-all"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-white/65 mb-1.5" htmlFor="password">
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
                  autoComplete="current-password"
                  className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-[13px] text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/55 transition-colors p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-[13px] py-2.5 rounded-xl transition-all duration-150 mt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161b22]"
            >
              {loading ? (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
              ) : (
                <LogIn size={15} aria-hidden="true" />
              )}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {/* Register link */}
          <p className="text-center text-[12px] text-white/35 mt-5">
            Don&apos;t have an account?{" "}
            <Link href="/dashboard/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Register
            </Link>
          </p>

          {process.env.NODE_ENV === "development" && (
            <div className="mt-5 pt-5 border-t border-white/8">
              <p className="text-[10px] text-white/40 text-center mb-3 font-semibold uppercase tracking-wider">
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
                    className="text-left px-3 py-2 rounded-lg bg-white/4 hover:bg-white/8 border border-white/6 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    <span className="text-[11px] font-semibold text-white/75 group-hover:text-white/95 block transition-colors truncate">
                      {acc.label}
                    </span>
                    <span className="text-[10px] text-white/40 font-mono truncate block">@{acc.username}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Back to site */}
        <p className="text-center text-[11px] text-white/20 mt-5">
          <Link href="/" className="hover:text-white/45 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded">
            ← Back to yyzu.tech
          </Link>
        </p>
      </div>
    </div>
  );
}
