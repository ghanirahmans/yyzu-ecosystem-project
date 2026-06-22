"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Settings,
  Edit3,
  Save,
  Crown,
  LogOut,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Shield,
  AlertCircle,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { cn, getInitials, stringToColor } from "@/lib/utils";
import { updateTeamInfoAction, transferLeadershipAction, deleteTeamAction, leaveTeamAction } from "@/features/team/actions";
import type { JWTSessionPayload } from "@/lib/auth";

interface MemberItem {
  role: string;
  user: {
    id: string;
    username: string;
    fullName: string;
  };
}

interface TeamSettingsFormProps {
  team: {
    id: string;
    name: string;
    description: string | null;
    status: string;
  };
  members: MemberItem[];
  userRole: string;
  session: JWTSessionPayload;
}

export default function TeamSettingsForm({ team, members, userRole, session }: TeamSettingsFormProps) {
  const router = useRouter();
  const [teamName, setTeamName] = useState(team.name);
  const [teamDesc, setTeamDesc] = useState(team.description ?? "");
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [selectedLeader, setSelectedLeader] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLeader = userRole === "TEAM_LEADER";
  const isSuspended = team.status === "SUSPENDED";
  const otherMembers = members.filter((m) => m.user.id !== session.userId && m.role !== "TEAM_LEADER");

  const handleSaveInfo = async () => {
    if (!teamName.trim() || teamName.trim().length < 3) {
      setError("Team name must be at least 3 characters.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await updateTeamInfoAction({ name: teamName, description: teamDesc });
      if (res.success) {
        setSaved(true);
        setEditing(false);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(res.error || "Failed to update team info.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleTransferLeadership = async () => {
    if (!selectedLeader) return;
    if (!window.confirm("Are you sure you want to transfer leadership? You will immediately lose leader permissions and become a regular team member.")) return;

    setLoading(true);
    setError(null);
    try {
      const res = await transferLeadershipAction(selectedLeader);
      if (res.success) {
        router.push("/dashboard/team");
        router.refresh();
      } else {
        setError(res.error || "Failed to transfer leadership.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveTeam = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await leaveTeamAction();
      if (res.success) {
        router.push("/dashboard/teams");
        router.refresh();
      } else {
        setError(res.error || "Failed to leave team.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (deleteInput !== team.name) return;
    setLoading(true);
    setError(null);
    try {
      const res = await deleteTeamAction(deleteInput);
      if (res.success) {
        router.push("/dashboard/teams");
        router.refresh();
      } else {
        setError(res.error || "Failed to delete team.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardShell user={session}>
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Back */}
        <Link
          href="/dashboard/team"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Workspace
        </Link>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
            <Settings size={18} className="text-white/60" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Team Settings</h1>
            <p className="text-xs text-white/40">{team.name}</p>
          </div>
        </div>

        {saved && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 text-sm text-emerald-400">
            <CheckCircle2 size={14} />
            Team information updated.
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 text-sm text-rose-400">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        {isSuspended && (
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-sm text-amber-400">
            <AlertTriangle size={14} />
            This team is suspended. Editing is disabled.
          </div>
        )}

        {/* Team Info */}
        <div className="bg-[#161b22] border border-white/8 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white">Team Information</h2>
            {!editing && !isSuspended && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all cursor-pointer border border-white/8"
              >
                <Edit3 size={12} />
                Edit
              </button>
            )}
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-white/40 mb-1.5">Team Name</label>
              {editing ? (
                <input
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              ) : (
                <p className="text-sm text-white font-medium">{teamName}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-white/40 mb-1.5">Description</label>
              {editing ? (
                <textarea
                  value={teamDesc}
                  onChange={(e) => setTeamDesc(e.target.value)}
                  rows={3}
                  maxLength={500}
                  className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              ) : (
                <p className="text-sm text-white/60 whitespace-pre-wrap">{teamDesc || "—"}</p>
              )}
            </div>
          </div>
          {editing && (
            <div className="flex gap-2 pt-1">
              <button
                disabled={loading}
                onClick={handleSaveInfo}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
              >
                {loading ? (
                  <span className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin block" />
                ) : (
                  <Save size={13} />
                )}
                Save
              </button>
              <button
                disabled={loading}
                onClick={() => {
                  setEditing(false);
                  setTeamName(team.name);
                  setTeamDesc(team.description ?? "");
                }}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 text-sm font-medium rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Transfer Leadership */}
        {isLeader && !isSuspended && (
          <div className="bg-[#161b22] border border-white/8 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Crown size={15} className="text-amber-400" />
              <h2 className="font-semibold text-white">Transfer Leadership</h2>
            </div>
            <p className="text-xs text-white/40">
              Select a team member to become the new Team Leader. You will become a regular Member.
            </p>
            {otherMembers.length === 0 ? (
              <p className="text-xs text-white/30 italic">No other members to transfer to. Invite members first.</p>
            ) : (
              <div className="space-y-3">
                <div className="grid gap-2">
                  {otherMembers.map(({ user }) => {
                    const initials = getInitials(user.fullName);
                    const color = stringToColor(user.username);
                    return (
                      <label
                        key={user.id}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all",
                          selectedLeader === user.id ? "bg-amber-500/10 border-amber-500/25" : "bg-white/3 border-white/6 hover:border-white/12"
                        )}
                      >
                        <input
                          type="radio"
                          name="new-leader"
                          value={user.id}
                          checked={selectedLeader === user.id}
                          onChange={() => setSelectedLeader(user.id)}
                          className="accent-amber-500"
                        />
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                          style={{ background: color }}
                        >
                          {initials}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{user.fullName}</p>
                          <p className="text-xs text-white/40">@{user.username}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
                <button
                  disabled={!selectedLeader || loading}
                  onClick={handleTransferLeadership}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500/15 hover:bg-amber-500/25 disabled:opacity-40 disabled:cursor-not-allowed text-amber-400 text-sm font-medium rounded-xl transition-all cursor-pointer"
                >
                  {loading ? (
                    <span className="w-3.5 h-3.5 border border-amber-400/30 border-t-amber-400 rounded-full animate-spin block" />
                  ) : (
                    <Crown size={13} />
                  )}
                  Transfer Leadership
                </button>
              </div>
            )}
          </div>
        )}

        {/* Leave Team */}
        {!isLeader && !isSuspended && (
          <div className="bg-[#161b22] border border-white/8 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <LogOut size={15} className="text-white/40" />
              <h2 className="font-semibold text-white">Leave Team</h2>
            </div>
            <p className="text-xs text-white/40 mb-4">
              You will be removed from the team. You can join or create another team afterward.
            </p>
            {!confirmLeave ? (
              <button
                onClick={() => setConfirmLeave(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/8 text-white/60 hover:text-white text-sm font-medium rounded-xl transition-all cursor-pointer"
              >
                <LogOut size={13} />
                Leave Team
              </button>
            ) : (
              <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-4 space-y-3">
                <p className="text-sm text-amber-400 font-medium">Are you sure you want to leave <strong>{team.name}</strong>?</p>
                <div className="flex gap-2">
                  <button
                    disabled={loading}
                    onClick={handleLeaveTeam}
                    className="px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    {loading ? "Leaving…" : "Confirm Leave"}
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => setConfirmLeave(false)}
                    className="px-3 py-1.5 bg-white/5 text-white/50 text-xs font-semibold rounded-lg transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Delete Team */}
        {isLeader && (
          <div className="bg-[#161b22] border border-rose-500/15 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Trash2 size={15} className="text-rose-400" />
              <h2 className="font-semibold text-white">Delete Team</h2>
            </div>
            <p className="text-xs text-white/40 mb-4">
              Permanently delete this team. All workspace data, links, and submission records will be soft-deleted. This action cannot be undone.
            </p>
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-sm font-medium rounded-xl transition-all cursor-pointer"
              >
                <Trash2 size={13} />
                Delete Team
              </button>
            ) : (
              <div className="bg-rose-500/8 border border-rose-500/20 rounded-xl p-4 space-y-3">
                <p className="text-sm text-rose-300">
                  Type the team name <strong className="font-mono">{team.name}</strong> to confirm deletion:
                </p>
                <input
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  placeholder={team.name}
                  className="w-full bg-[#0d1117] border border-rose-500/30 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                />
                <div className="flex gap-2">
                  <button
                    disabled={deleteInput !== team.name || loading}
                    onClick={handleDeleteTeam}
                    className="px-3 py-1.5 bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-rose-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    {loading ? "Deleting…" : "Delete Permanently"}
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => {
                      setConfirmDelete(false);
                      setDeleteInput("");
                    }}
                    className="px-3 py-1.5 bg-white/5 text-white/50 text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
