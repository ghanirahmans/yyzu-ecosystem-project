"use client";

import { useState } from "react";
import { ScrollText, Search, Filter } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { cn, formatDateTime, getInitials, stringToColor } from "@/lib/utils";
import type { JWTSessionPayload } from "@/lib/auth";

const ACTION_BADGE: Record<string, { label: string; color: string }> = {
  USER_REGISTER: { label: "User Registered", color: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" },
  USER_LOGIN: { label: "User Logged In", color: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" },
  USER_PROFILE_UPDATE: { label: "Profile Updated", color: "bg-sky-500/10 text-sky-400 border border-sky-500/20" },
  ADMIN_APPROVE_USER: { label: "User Approved", color: "bg-emerald-500/15 text-emerald-400" },
  ADMIN_REJECT_USER: { label: "User Rejected", color: "bg-rose-500/15 text-rose-400" },
  ADMIN_SUSPEND_USER: { label: "User Suspended", color: "bg-rose-500/15 text-rose-400" },
  ADMIN_REACTIVATE_USER: { label: "User Reactivated", color: "bg-emerald-500/15 text-emerald-400" },
  ADMIN_SUSPEND_TEAM: { label: "Team Suspended", color: "bg-amber-500/15 text-amber-400" },
  ADMIN_UNSUSPEND_TEAM: { label: "Team Unsuspended", color: "bg-emerald-500/15 text-emerald-400" },
  ADMIN_FORCE_DELETE_TEAM: { label: "Team Deleted (Force)", color: "bg-rose-500/15 text-rose-400" },
  ADMIN_FORCE_TRANSFER_LEADERSHIP: { label: "Leadership Transferred (Force)", color: "bg-amber-500/15 text-amber-400" },
  TEAM_CREATED: { label: "Team Created", color: "bg-indigo-500/10 text-indigo-400" },
  TEAM_INVITE_ACCEPT: { label: "Invite Accepted", color: "bg-emerald-500/10 text-emerald-400" },
  TEAM_INVITE_REJECT: { label: "Invite Rejected", color: "bg-rose-500/10 text-rose-400" },
  TEAM_LINK_ADD: { label: "Link Added", color: "bg-indigo-500/10 text-indigo-400" },
  TEAM_LINK_EDIT: { label: "Link Edited", color: "bg-amber-500/10 text-amber-400" },
  TEAM_LINK_DELETE: { label: "Link Deleted", color: "bg-rose-500/10 text-rose-400" },
  TEAM_SUBMISSION: { label: "Submission Updated", color: "bg-sky-500/10 text-sky-400" },
  TEAM_LEAVE: { label: "Member Left", color: "bg-rose-500/10 text-rose-400" },
  TEAM_REMOVE_MEMBER: { label: "Member Kicked", color: "bg-rose-500/15 text-rose-400" },
  TEAM_LEADERSHIP_TRANSFER: { label: "Leadership Transferred", color: "bg-amber-500/10 text-amber-400" },
};

interface AuditLogItem {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: import("@prisma/client").Prisma.JsonValue;
  createdAt: Date;
  actor: {
    username: string;
    fullName: string;
  } | null;
}

interface AdminAuditListProps {
  logs: AuditLogItem[];
  session: JWTSessionPayload;
}

export default function AdminAuditList({ logs, session }: AdminAuditListProps) {
  const [query, setQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");

  const uniqueActions = ["ALL", ...Array.from(new Set(logs.map((l) => l.action)))];

  const filtered = logs.filter((log) => {
    const matchesAction = actionFilter === "ALL" || log.action === actionFilter;
    const matchesSearch =
      !query ||
      log.action.toLowerCase().includes(query.toLowerCase()) ||
      log.entityType.toLowerCase().includes(query.toLowerCase()) ||
      (log.actor?.fullName ?? "").toLowerCase().includes(query.toLowerCase()) ||
      (log.actor?.username ?? "").toLowerCase().includes(query.toLowerCase());
    return matchesAction && matchesSearch;
  });

  return (
    <DashboardShell user={session}>
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
            <ScrollText size={18} className="text-white/50" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Audit Log</h1>
            <p className="text-sm text-white/40 mt-0.5">Chronological record of platform events</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search by action, actor, or target..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-[#161b22] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-white/30 flex-shrink-0" />
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-[#161b22] border border-white/10 rounded-xl px-3 py-3 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all cursor-pointer"
            >
              {uniqueActions.map((a) => (
                <option key={a} value={a}>
                  {a === "ALL" ? "All Events" : (ACTION_BADGE[a]?.label ?? a)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Log entries */}
        <div className="bg-[#161b22] border border-white/8 rounded-2xl divide-y divide-white/5 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-white/30 text-sm">No events found.</div>
          ) : (
            filtered.map((log) => {
              const badge = ACTION_BADGE[log.action] ?? { label: log.action, color: "bg-white/8 text-white/50 border border-white/10" };
              const actorInitials = log.actor ? getInitials(log.actor.fullName) : "SY";
              const actorColor = log.actor ? stringToColor(log.actor.username) : "#6b7280";

              return (
                <div key={log.id} className="px-5 py-4 hover:bg-white/2 transition-colors">
                  <div className="flex items-start gap-3">
                    {/* Actor avatar */}
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
                      style={{ background: actorColor }}
                    >
                      {actorInitials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full inline-block", badge.color)}>
                          {badge.label}
                        </span>
                        <span className="text-[11px] text-white/20">
                          {log.entityType} ({log.entityId.slice(0, 8)}…)
                        </span>
                      </div>
                      <p className="text-sm text-white/70">
                        <span className="text-white/50 font-medium">
                          {log.actor ? log.actor.fullName : "System"}
                        </span>
                        {log.actor && (
                          <span className="text-white/30"> (@{log.actor.username})</span>
                        )}
                      </p>
                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <p className="text-xs text-white/30 mt-1.5 font-mono bg-white/3 px-2 py-1.5 rounded-lg overflow-x-auto">
                          {JSON.stringify(log.metadata)}
                        </p>
                      )}
                    </div>

                    <div className="text-xs text-white/25 flex-shrink-0 text-right">
                      {formatDateTime(log.createdAt)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
