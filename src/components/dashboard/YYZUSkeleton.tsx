// ============================================================
// YYZU Skeleton — shared loading skeleton primitives
//
// Used in route-level loading.tsx for Suspense boundaries.
// Pattern: Vercel / Stripe-style pulse animation + dark bg.
// ============================================================

import { cn } from "@/lib/utils";

// ── Base pulse atom ──────────────────────────────────────────

function Pulse({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded bg-white/5",
        className,
      )}
    />
  );
}

// ── Primitive shapes ─────────────────────────────────────────

export function SkeletonText({
  lines = 1,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Pulse
          key={i}
          className={cn(
            "h-3 rounded",
            i === lines - 1 && lines > 1 ? "w-3/4" : "w-full",
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonHeading({ className }: { className?: string }) {
  return <Pulse className={cn("h-7 w-48", className)} />;
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/8 bg-[#161b22] p-6 space-y-4",
        className,
      )}
    >
      <Pulse className="h-4 w-2/3" />
      <Pulse className="h-3 w-full" />
      <Pulse className="h-3 w-5/6" />
    </div>
  );
}

export function SkeletonGrid({
  cols = 3,
  className,
}: {
  cols?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-4",
        cols === 1
          ? "grid-cols-1"
          : cols === 2
            ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1 md:grid-cols-3",
        className,
      )}
    >
      {Array.from({ length: cols }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex gap-4 pb-2 mb-1">
        <Pulse className="h-3 w-1/4" />
        <Pulse className="h-3 w-1/5" />
        <Pulse className="h-3 w-1/6" />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 py-3 border-t border-white/5"
        >
          <Pulse className="h-8 w-8 rounded-full" />
          <Pulse className="h-3 flex-1" />
          <Pulse className="h-6 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonPage() {
  return (
    <div className="space-y-5">
      <SkeletonHeading />
      <SkeletonGrid cols={2} />
      <SkeletonTable rows={4} />
    </div>
  );
}