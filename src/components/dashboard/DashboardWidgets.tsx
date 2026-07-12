"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ── StatCard ─────────────────────────────────────────────────
export function StatCard({
  label,
  value,
  icon,
  color,
  href,
  badge,
  delay,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: "indigo" | "violet" | "emerald" | "amber" | "rose";
  href: string;
  badge?: boolean;
  delay?: string;
}) {
  const colorMap = {
    indigo: "bg-indigo-500/10 text-indigo-400",
    violet: "bg-violet-500/10 text-violet-400",
    emerald: "bg-emerald-500/10 text-emerald-400",
    amber: "bg-amber-500/10 text-amber-400",
    rose: "bg-rose-500/10 text-rose-400",
  };

  return (
    <Link
      href={href}
      className={cn(
        "relative bg-[#161b22] border border-white/8 hover:border-white/18 rounded-2xl p-4 transition-all duration-200 hover:bg-[#1c2129] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 group block animate-slide-in-up",
        delay
      )}
    >
      {badge && (
        <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" aria-hidden="true" />
      )}
      <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center mb-3", colorMap[color])}>
        {icon}
      </div>
      <p className="text-[22px] font-bold text-white tabular-nums">{value}</p>
      <p className="text-[11px] text-white/40 mt-0.5 leading-snug">{label}</p>
    </Link>
  );
}

// ── QuickLink ────────────────────────────────────────────────
export function QuickLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/4 hover:bg-white/8 text-[13px] text-white/55 hover:text-white transition-all duration-150 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      <span className="text-white/25 group-hover:text-indigo-400 transition-colors flex-shrink-0">{icon}</span>
      {label}
      <ArrowRight size={11} className="ml-auto text-white/15 group-hover:text-white/40 transition-all group-hover:translate-x-0.5" />
    </Link>
  );
}
