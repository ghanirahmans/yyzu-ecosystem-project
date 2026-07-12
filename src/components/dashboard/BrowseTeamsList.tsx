"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Plus, Users, Calendar, ChevronRight, AlertTriangle, Send, AlertCircle, XCircle } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { cn, formatDate } from "@/lib/utils";
import { sendJoinRequestAction, cancelJoinRequestAction } from "@/features/team/actions";
import type { JWTSessionPayload } from "@/lib/auth";

interface TeamItem {
  id: string;
  name: string;
  description: string | null;
  status: string;
  createdAt: Date;
  memberships: Array<{
    role: string;
    user: {
      fullName: string;
    };
  }>;
  submissions: Array<{
    status: string;
  }>;
}

interface BrowseTeamsListProps {
  teams: TeamItem[];
  pendingRequest: {
    id: string;
    teamId: string;
    status: string;
  } | null;
  currentTeam: {
    id: string;
    name: string;
  } | null;
  session: JWTSessionPayload;
  searchQuery?: string;
}

export default function BrowseTeamsList({ teams, pendingRequest, currentTeam, session, searchQuery = "" }: BrowseTeamsListProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = async (teamId: string) => {
    setLoadingId(teamId);
    setError(null);
    try {
      const res = await sendJoinRequestAction(teamId);
      if (!res.success) setError(res.error || "Failed to send join request.");
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    setLoadingId(requestId);
    setError(null);
    try {
      const res = await cancelJoinRequestAction(requestId);
      if (!res.success) setError(res.error || "Failed to cancel join request.");
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoadingId(null);
    }
  };

  // Removed client-side search filter logic

  return (
    <DashboardShell user={session}>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Browse Teams</h1>
            <p className="text-sm text-white/40 mt-0.5">Discover and join an active team</p>
          </div>
          {(session.role === "FOUNDER" || session.role === "KOORDINATOR_UMUM" || !currentTeam) && session.role !== "MENTOR" && (
            <Link
              href="/dashboard/teams/create"
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors self-start sm:self-auto"
            >
              <Plus size={15} />
              Create Team
            </Link>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 text-sm text-rose-400">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        {/* In-team notice */}
        {currentTeam && (
          <div className="flex items-center gap-3 bg-white/4 border border-white/8 rounded-xl px-4 py-3 text-sm text-white/60">
            <Users size={15} className="text-white/30 flex-shrink-0" />
            <span>You&apos;re already in <strong className="text-white">{currentTeam.name}</strong>. You can browse teams but cannot join another.</span>
          </div>
        )}

        {/* Search */}
        <form method="GET" action="/dashboard/teams" className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            name="q"
            placeholder="Search teams by name or description…"
            defaultValue={searchQuery}
            className="w-full bg-[#161b22] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all"
          />
        </form>

        {/* Teams list */}
        {teams.length === 0 ? (
          <div className="text-center py-16 text-white/30 bg-[#161b22] border border-white/8 rounded-2xl">
            <Users size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No teams found matching &quot;{searchQuery}&quot;</p>
          </div>
        ) : (
          <div className="space-y-3">
            {teams.map((team) => {
              const isSuspended = team.status === "SUSPENDED";
              const isMyTeam = currentTeam?.id === team.id;
              const leader = team.memberships.find((m) => m.role === "TEAM_LEADER");
              const isRequestedThisTeam = pendingRequest?.teamId === team.id;
              const latestSub = team.submissions && team.submissions.length > 0 ? team.submissions[0] : null;

              return (
                <div
                  key={team.id}
                  className={cn(
                    "bg-[#161b22] border rounded-2xl p-5 transition-all",
                    isSuspended ? "border-amber-500/15 opacity-60" : "border-white/8 hover:border-white/15"
                  )}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                        <h3 className="font-bold text-white text-base truncate">{team.name}</h3>
                        {isSuspended && (
                          <span className="flex items-center gap-1 text-xs bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20 flex-shrink-0">
                            <AlertTriangle size={10} />
                            Suspended
                          </span>
                        )}
                        {isMyTeam && (
                          <span className="text-xs bg-indigo-500/15 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/20 flex-shrink-0">
                            Your team
                          </span>
                        )}
                        <span
                          className={cn(
                            "text-xs px-2.5 py-0.5 rounded-full border font-medium flex-shrink-0",
                            latestSub?.status === "APPROVED"
                              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                              : latestSub?.status === "REVISION"
                                ? "bg-rose-500/15 text-rose-400 border-rose-500/25"
                                : latestSub?.status === "SUBMITTED"
                                  ? "bg-blue-500/15 text-blue-400 border-blue-500/25"
                                  : "bg-[#0d1117] text-white/40 border-white/5"
                          )}
                        >
                          {latestSub?.status === "APPROVED" && "Selesai"}
                          {latestSub?.status === "REVISION" && "Revisi"}
                          {latestSub?.status === "SUBMITTED" && "Menunggu Review"}
                          {(!latestSub || latestSub.status === "NOT_SUBMITTED") && "Belum Dikumpul"}
                        </span>
                      </div>
                      <p className="text-sm text-white/50 mb-3.5 line-clamp-2 leading-relaxed">
                        {team.description ?? "No description provided."}
                      </p>
                      <div className="flex flex-wrap gap-4 text-xs text-white/30">
                        <span className="flex items-center gap-1.5">
                          <Users size={11} />
                          {team.memberships.length} member{team.memberships.length !== 1 ? "s" : ""}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar size={11} />
                          Created {formatDate(team.createdAt)}
                        </span>
                        <span>
                          Leader: <span className="text-white/50">{leader?.user.fullName ?? "—"}</span>
                        </span>
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="flex-shrink-0 self-end sm:self-center">
                      {isMyTeam ? (
                        <Link
                          href="/dashboard/team"
                          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-400 text-sm font-medium rounded-xl transition-colors"
                        >
                          Open <ChevronRight size={13} />
                        </Link>
                      ) : session.role === "FOUNDER" || session.role === "KOORDINATOR_UMUM" || session.role === "MENTOR" ? (
                        <Link
                          href={`/dashboard/teams/${team.id}`}
                          className="flex items-center gap-1.5 px-4 py-2 bg-[#2f1f47] hover:bg-[#3d275c] text-indigo-300 text-sm font-medium rounded-xl transition-colors"
                        >
                          {session.role === "MENTOR" ? "Review" : "View"} <ChevronRight size={13} />
                        </Link>
                      ) : currentTeam ? (
                        <span className="text-xs text-white/25">Already in a team</span>
                      ) : isSuspended ? (
                        <span className="text-xs text-amber-400/60">Unavailable</span>
                      ) : isRequestedThisTeam ? (
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1.5 text-xs text-indigo-400 bg-indigo-500/10 px-3 py-2 rounded-xl">
                            <Send size={12} />
                            Requested
                          </span>
                          <button
                            disabled={loadingId !== null}
                            onClick={() => handleCancelRequest(pendingRequest.id)}
                            className="flex items-center justify-center p-2 bg-white/5 hover:bg-rose-500/15 text-white/40 hover:text-rose-400 rounded-xl transition-colors border border-white/8 hover:border-rose-500/20"
                            title="Cancel Request"
                          >
                            <XCircle size={15} />
                          </button>
                        </div>
                      ) : pendingRequest ? (
                        <span className="text-xs text-white/25">Active request elsewhere</span>
                      ) : (
                        <button
                          onClick={() => handleRequest(team.id)}
                          disabled={loadingId !== null}
                          className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/15 text-white/70 hover:text-white text-sm font-medium rounded-xl transition-all"
                        >
                          {loadingId === team.id ? (
                            <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                          ) : (
                            <Send size={13} />
                          )}
                          Request
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
