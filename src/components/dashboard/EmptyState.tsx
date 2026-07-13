"use client";

// ============================================================
// YYZU EmptyState — compound component pattern (industry best)
//
// Pattern: Radix UI / Headless UI-style slot architecture.
// Each slot is a child component; EmptyState composes them.
//
// Usage:
//   <EmptyState>
//     <EmptyState.Icon><BoxIcon size={48} /></EmptyState.Icon>
//     <EmptyState.Heading>Belum ada program</EmptyState.Heading>
//     <EmptyState.Description>
//       Jadilah yang pertama membuat program kerja untuk divisi ini.
//     </EmptyState.Description>
//     <EmptyState.Actions>
//       <Link href="/programs/create" className="...">✨ Buat Program</Link>
//     </EmptyState.Actions>
//   </EmptyState>
//
// If no Actions slot, renders heading+description centered.
// ============================================================

import { cn } from "@/lib/utils";
import React from "react";

// ── Context for slot detection ──────────────────────────────

interface EmptyStateContextValue {
  hasActions: boolean;
}

const EmptyStateContext = React.createContext<EmptyStateContextValue>({
  hasActions: false,
});

// ── Root ────────────────────────────────────────────────────

function Root({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  // Detect if Actions slot exists
  const childrenArray = React.Children.toArray(children);
  const hasActions = childrenArray.some(
    (child) =>
      React.isValidElement(child) &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (child as any).type?.displayName === "EmptyState.Actions",
  );

  return (
    <EmptyStateContext.Provider value={{ hasActions }}>
      <div
        className={cn(
          "flex flex-col items-center justify-center py-14 text-center",
          className,
        )}
      >
        <div className="max-w-md">{children}</div>
      </div>
    </EmptyStateContext.Provider>
  );
}

Root.displayName = "EmptyState";

// ── Icon Slot ───────────────────────────────────────────────

function Icon({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-5 flex justify-center opacity-40", className)}>
      {children}
    </div>
  );
}

Icon.displayName = "EmptyState.Icon";

// ── Heading Slot ────────────────────────────────────────────

function Heading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "text-lg font-bold text-white/80 mb-2 tracking-tight",
        className,
      )}
    >
      {children}
    </h3>
  );
}

Heading.displayName = "EmptyState.Heading";

// ── Description Slot ────────────────────────────────────────

function Description({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-sm text-white/40 max-w-sm mx-auto leading-relaxed",
        className,
      )}
    >
      {children}
    </p>
  );
}

Description.displayName = "EmptyState.Description";

// ── Actions Slot ────────────────────────────────────────────

function Actions({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mt-6 flex gap-2 justify-center", className)}>
      {children}
    </div>
  );
}

Actions.displayName = "EmptyState.Actions";

// ── Export ──────────────────────────────────────────────────

export const EmptyState = Object.assign(Root, {
  Icon,
  Heading,
  Description,
  Actions,
});