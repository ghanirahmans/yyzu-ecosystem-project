"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";

// ── Types ────────────────────────────────────────────────────

interface QuickAction {
  label: string;
  href?: string;
  shortcut?: string;
  icon?: string;
  section: "Navigate" | "Create" | "Admin";
}

// ── Action registry ──────────────────────────────────────────

function buildActions(): QuickAction[] {
  return [
    // Navigate
    { label: "Overview", href: "/dashboard", section: "Navigate", shortcut: "G H" },
    { label: "My Team", href: "/dashboard/team", section: "Navigate" },
    { label: "Browse Teams", href: "/dashboard/teams", section: "Navigate", shortcut: "G T" },
    { label: "Members", href: "/dashboard/members", section: "Navigate", shortcut: "G M" },
    { label: "Divisions", href: "/dashboard/divisions", section: "Navigate", shortcut: "G D" },
    { label: "Programs", href: "/dashboard/programs", section: "Navigate", shortcut: "G P" },
    { label: "Partnerships", href: "/dashboard/partnerships", section: "Navigate" },
    { label: "My Profile", href: "/dashboard/profile", section: "Navigate" },
    { label: "Mentor Dashboard", href: "/dashboard/mentor", section: "Navigate" },

    // Create
    { label: "Create Team", href: "/dashboard/teams/create", section: "Create", icon: "👥" },
    { label: "Create Program", href: "/dashboard/programs/create", section: "Create", icon: "📋" },

    // Admin
    { label: "Manage Users", href: "/dashboard/admin/users", section: "Admin" },
    { label: "Manage Teams", href: "/dashboard/admin/teams", section: "Admin" },
    { label: "Approvals", href: "/dashboard/admin/approvals", section: "Admin" },
    { label: "Audit Log", href: "/dashboard/admin/audit", section: "Admin" },
    { label: "Org Links", href: "/dashboard/admin/links", section: "Admin" },
  ];
}

// ── Props ────────────────────────────────────────────────────

interface CommandPaletteProps {
  /** Optionally filter actions by role */
  role?: string;
}

// ── Sections ─────────────────────────────────────────────────

function ActionItem({ action, onSelect }: { action: QuickAction; onSelect: (a: QuickAction) => void }) {
  return (
    <Command.Item
      value={action.label}
      onSelect={() => onSelect(action)}
      className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/80 aria-selected:bg-indigo-500/20 aria-selected:text-white rounded-lg cursor-pointer transition-colors mx-1"
    >
      {action.icon && <span className="text-base flex-shrink-0">{action.icon}</span>}
      <span className="flex-1">{action.label}</span>
      {action.shortcut && (
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-white/30 bg-white/5 rounded border border-white/10">
          {action.shortcut}
        </kbd>
      )}
    </Command.Item>
  );
}

// ── Component ────────────────────────────────────────────────

export function CommandPalette({ role }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const actions = useMemo(() => {
    const all = buildActions();
    // Filter out admin actions for non-admin roles
    if (role && !["FOUNDER", "KOORDINATOR_UMUM"].includes(role)) {
      return all.filter((a) => a.section !== "Admin");
    }
    return all;
  }, [role]);

  const handleSelect = useCallback(
    (action: QuickAction) => {
      setOpen(false);
      if (action.href) {
        router.push(action.href);
      }
    },
    [router],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      // Close on Escape
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      {/* Trigger hint — shown in topbar */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 text-[11px] text-white/30 bg-[#161b22] border border-white/8 hover:border-white/15 hover:text-white/50 rounded-lg transition-all flex-shrink-0"
          aria-label="Open command palette"
        >
          <span>Search</span>
          <kbd className="font-mono text-[10px] px-1.5 py-0.5 bg-white/5 rounded text-white/25">
            ⌘K
          </kbd>
        </button>
      )}

      {/* Command Dialog */}
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="YYZU Command Palette"
        className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      >
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Modal */}
        <div className="relative z-50 w-full max-w-lg mx-4 bg-[#0d1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <Command.Input
            placeholder="Type a command or search..."
            autoFocus
            className="w-full bg-transparent border-b border-white/8 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none"
          />

          <Command.List className="max-h-72 overflow-y-auto p-2 scrollbar-thin">
            <Command.Empty className="px-4 py-8 text-center text-sm text-white/25">
              No results found.
            </Command.Empty>

            {/* Navigate */}
            <Command.Group heading="Navigate" className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:text-white/25 [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:uppercase">
              {actions
                .filter((a) => a.section === "Navigate")
                .map((a) => (
                  <ActionItem key={a.label} action={a} onSelect={handleSelect} />
                ))}
            </Command.Group>

            {/* Create */}
            <Command.Group heading="Create" className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:text-white/25 [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:uppercase">
              {actions
                .filter((a) => a.section === "Create")
                .map((a) => (
                  <ActionItem key={a.label} action={a} onSelect={handleSelect} />
                ))}
            </Command.Group>

            {/* Admin */}
            {actions.some((a) => a.section === "Admin") && (
              <Command.Group heading="Admin" className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:text-white/25 [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:uppercase">
                {actions
                  .filter((a) => a.section === "Admin")
                  .map((a) => (
                    <ActionItem key={a.label} action={a} onSelect={handleSelect} />
                  ))}
              </Command.Group>
            )}
          </Command.List>

          {/* Footer */}
          <div className="border-t border-white/8 px-4 py-2 flex items-center gap-4 text-[10px] text-white/20">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white/5 rounded text-[9px]">↑↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white/5 rounded text-[9px]">↵</kbd> Open
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white/5 rounded text-[9px]">Esc</kbd> Close
            </span>
          </div>
        </div>
      </Command.Dialog>
    </>
  );
}