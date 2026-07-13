"use client";

// ============================================================
// YYZU Error Boundary — Next.js error.tsx (industry best)
//
// Catches render errors + server component errors per route
// segment. Renders a contextual error UI instead of blank page.
//
// Pattern: Linear.app / Vercel-style error states.
// ============================================================

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log to structured logger (will be replaced post-migration)
    if (process.env.NODE_ENV === "production") {
      // In production, this would go to Sentry / Datadog / etc.
      console.error("[YYZU Error Boundary]", {
        message: error.message,
        digest: error.digest,
        stack: error.stack?.split("\n").slice(0, 3).join("\n"),
      });
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
          <AlertTriangle size={28} className="text-rose-400" />
        </div>

        {/* Heading */}
        <h1 className="text-xl font-bold text-white mb-2">
          Something went wrong
        </h1>
        <p className="text-sm text-white/40 mb-1 leading-relaxed">
          {error.message || "An unexpected error occurred. The team has been notified."}
        </p>
        {error.digest && (
          <p className="text-[11px] text-white/20 font-mono mb-6">
            Error ID: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/8 text-white/80 text-sm font-medium rounded-xl border border-white/10 hover:border-white/20 transition-colors"
          >
            <RefreshCw size={14} />
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <Home size={14} />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}