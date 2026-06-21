"use client";

import { useState } from "react";
import { Search, Users, AlertTriangle, CheckCircle2, Trash2, AlertCircle, Clock } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { cn, formatDate } from "@/lib/utils";
import { toggleTeamSuspensionAction, forceDeleteTeamAction } from "@/app/actions/admin";

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

interface AdminTeamsListProps {
  teams: TeamItem[];
  session: any;
}

export default function AdminTeamsList({ teams, session }: AdminTeamsListProps) {
  const [query, setQuery] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleToggleSuspension = async (teamId: string) => {
    setLoadingId(teamId);
    setError(null);
    try {
      const res = await toggleTeamSuspensionAction(teamId);
      if (!res.success) setError(res.error || "Failed to toggle team status.");
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDeleteTeam = async (teamId: string, teamName: string) => {
    if (!window.confirm(`Are you absolutely sure you want to force-delete the team "${teamName}"? This will dissolve the team and soft-delete all associated links and submission data.`)) {
      return;
    }

    setLoadingId(teamId);
    setError(null);
    try {
      const res = await forceDeleteTeamAction(teamId);
      if (!res.success) setError(res.error || "Failed to delete team.");
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoadingId(null);
    }
  };

  const filtered = teams.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <DashboardShell user={session}>
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Manage Teams</h1>
            <p className="text-sm text-white/40 mt-0.5">{teams.length} total teams</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 text-sm text-rose-400">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search by team name…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#161b22] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
          />
        </div>

        {/* Teams grid */}
        <div className="space-y-3">
          {filtered.map((team) => {
            const leader = team.memberships.find((m) => m.role === "TEAM_LEADER");
            const latestSub = team.submissions && team.submissions.length > 0 ? team.submissions[0] : null;
            const submitted = latestSub?.status === "SUBMITTED";

            return (
              <div
                key={team.id}
                className={cn(
                  "bg-[#161b22] border rounded-2xl p-5 transition-all",
                  team.status === "SUSPENDED" ? "border-amber-500/20" : "border-white/8"
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <h3 className="font-bold text-white text-base">{team.name}</h3>
                      <span
                        className={cn(
                          "text-xs px-2.5 py-0.5 rounded-full font-medium inline-block",
                          team.status === "ACTIVE"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/10"
                            : "bg-amber-500/15 text-amber-400 border border-amber-500/10"
                        )}
                      >
                        {team.status}
                      </span>
                    </div>
                    <p className="text-sm text-white/50 mb-4">
                      {team.description ?? "No description."}
                    </p>
                    <div className="flex flex-wrap gap-5 text-xs text-white/30">
                      <span className="flex items-center gap-1.5">
                        <Users size={12} />
                        {team.memberships.length} member{team.memberships.length !== 1 ? "s" : ""}
                      </span>
                      <span>
                        Leader: <span className="text-white/50">{leader?.user.fullName ?? "—"}</span>
                      </span>
                      <span>
                        Created: <span className="text-white/50">{formatDate(team.createdAt)}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        {latestSub?.status === "APPROVED" && (
                          <span className="flex items-center gap-1 text-emerald-400 font-medium">
                            <CheckCircle2 size={11} />
                            Selesai
                          </span>
                        )}
                        {latestSub?.status === "REVISION" && (
                          <span className="flex items-center gap-1 text-rose-400 font-medium animate-pulse">
                            <AlertTriangle size={11} />
                            Revisi
                          </span>
                        )}
                        {latestSub?.status === "SUBMITTED" && (
                          <span className="flex items-center gap-1 text-blue-400 font-medium animate-pulse">
                            <Clock size={11} />
                            Menunggu Review
                          </span>
                        )}
                        {(!latestSub || latestSub.status === "NOT_SUBMITTED") && (
                          <span className="flex items-center gap-1 text-white/30 font-medium">
                            <AlertCircle size={11} />
                            Belum Dikumpul
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-start">
                    <button
                      disabled={loadingId !== null}
                      onClick={() => handleToggleSuspension(team.id)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border",
                        team.status === "ACTIVE"
                          ? "bg-white/5 hover:bg-amber-500/15 text-white/50 hover:text-amber-400 border-white/8 hover:border-amber-500/20"
                          : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20"
                      )}
                    >
                      {loadingId === team.id ? (
                        <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                      ) : team.status === "ACTIVE" ? (
                        <AlertTriangle size={11} />
                      ) : (
                        <CheckCircle2 size={11} />
                      )}
                      {team.status === "ACTIVE" ? "Suspend" : "Unsuspend"}
                    </button>
                    <button
                      disabled={loadingId !== null}
                      onClick={() => handleDeleteTeam(team.id, team.name)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-500/8 hover:bg-rose-500/20 text-rose-400 border border-rose-500/15 transition-all"
                    >
                      <Trash2 size={11} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-white/30 text-sm bg-[#161b22] border border-white/8 rounded-2xl">
              No teams found.
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
