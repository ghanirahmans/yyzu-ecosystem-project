"use client";

import { useState } from "react";
import { Search, Shield, UserX, UserCheck, ChevronDown, Check, X, AlertCircle } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { cn, formatDate, getInitials, stringToColor } from "@/lib/utils";
import { approveUserAction, rejectUserAction, toggleUserSuspensionAction, updateUserRoleAction } from "@/app/actions/admin";
import type { JWTSessionPayload } from "@/lib/auth";

interface UserItem {
  id: string;
  username: string;
  email: string | null;
  fullName: string;
  status: string;
  role: string;
  createdAt: Date;
  teamMemberships: Array<{
    role: string;
    team: {
      name: string;
    };
  }>;
}

interface AdminUsersListProps {
  users: UserItem[];
  session: JWTSessionPayload;
}

export default function AdminUsersList({ users, session }: AdminUsersListProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async (userId: string) => {
    setLoadingId(userId);
    setError(null);
    try {
      const res = await approveUserAction(userId);
      if (!res.success) setError(res.error || "Failed to approve user.");
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (userId: string) => {
    setLoadingId(userId);
    setError(null);
    try {
      const res = await rejectUserAction(userId);
      if (!res.success) setError(res.error || "Failed to reject user.");
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleToggleSuspension = async (userId: string) => {
    setLoadingId(userId);
    setError(null);
    try {
      const res = await toggleUserSuspensionAction(userId);
      if (!res.success) setError(res.error || "Failed to change user status.");
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoadingId(null);
    }
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(query.toLowerCase()) ||
      u.username.toLowerCase().includes(query.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(query.toLowerCase()));
    const matchesStatus = statusFilter === "ALL" || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardShell user={session}>
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Manage Users</h1>
            <p className="text-sm text-white/40 mt-0.5">{users.length} total registered users</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#161b22] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="REJECTED">Rejected</option>
            </select>
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
            placeholder="Search by name, username, or email…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#161b22] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
          />
        </div>

        {/* Table / List */}
        <div className="bg-[#161b22] border border-white/8 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 bg-white/1 text-left">
                  <th className="px-5 py-3.5 text-xs font-semibold text-white/30 uppercase tracking-wider">User</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-white/30 uppercase tracking-wider hidden sm:table-cell">Role</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-white/30 uppercase tracking-wider hidden md:table-cell">Team</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-white/30 uppercase tracking-wider hidden lg:table-cell">Joined</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-white/30 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold text-white/30 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((u) => {
                  const initials = getInitials(u.fullName);
                  const color = stringToColor(u.username);
                  const isSelf = u.id === session.userId;
                  const activeMembership = u.teamMemberships[0];

                  return (
                    <tr key={u.id} className="hover:bg-white/1 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                            style={{ background: color }}
                          >
                            {initials}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-white">{u.fullName}</p>
                              {u.role === "SYSTEM_ADMIN" && (
                                <span className="flex items-center gap-0.5 text-[10px] bg-rose-500/15 text-rose-400 px-1.5 py-0.5 rounded-full">
                                  <Shield size={9} />
                                  Admin
                                </span>
                              )}
                              {isSelf && <span className="text-xs text-white/25">(you)</span>}
                            </div>
                            <p className="text-xs text-white/40">@{u.username} {u.email ? `· ${u.email}` : ""}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <RoleBadge role={u.role} />
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <p className="text-sm text-white/60">
                          {activeMembership ? (
                            <>
                              {activeMembership.team.name}
                              <span className={cn("ml-1.5 text-xs", activeMembership.role === "TEAM_LEADER" ? "text-indigo-400" : "text-white/30")}>
                                ({activeMembership.role === "TEAM_LEADER" ? "Leader" : "Member"})
                              </span>
                            </>
                          ) : (
                            <span className="text-white/25">—</span>
                          )}
                        </p>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell text-xs text-white/30">
                        {formatDate(u.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "text-xs px-2.5 py-1 rounded-full font-medium inline-block",
                            u.status === "ACTIVE"
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/10"
                              : u.status === "PENDING_APPROVAL"
                              ? "bg-amber-500/15 text-amber-400 border border-amber-500/10"
                              : u.status === "SUSPENDED"
                              ? "bg-rose-500/15 text-rose-400 border border-rose-500/10"
                              : "bg-white/5 text-white/40 border border-white/5"
                          )}
                        >
                          {u.status === "PENDING_APPROVAL" ? "PENDING" : u.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {!isSelf && (
                          <div className="flex items-center justify-end gap-2">
                            {u.status === "PENDING_APPROVAL" && (
                              <>
                                <button
                                  disabled={loadingId !== null}
                                  onClick={() => handleApprove(u.id)}
                                  className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors"
                                >
                                  {loadingId === u.id ? (
                                    <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                                  ) : (
                                    <Check size={11} />
                                  )}
                                  Approve
                                </button>
                                <button
                                  disabled={loadingId !== null}
                                  onClick={() => handleReject(u.id)}
                                  className="inline-flex items-center gap-1 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-white/60 hover:text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors border border-white/8"
                                >
                                  <X size={11} />
                                  Reject
                                </button>
                              </>
                            )}
                            {u.status === "ACTIVE" && u.role !== "SYSTEM_ADMIN" && (
                              <>
                                <button
                                  disabled={loadingId !== null}
                                  onClick={() => handleToggleSuspension(u.id)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border bg-white/5 hover:bg-rose-500/15 text-white/50 hover:text-rose-400 border-white/8 hover:border-rose-500/20"
                                >
                                  {loadingId === u.id ? (
                                    <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                                  ) : (
                                    <UserX size={11} />
                                  )}
                                  Suspend
                                </button>
                                <RoleSelect
                                  userId={u.id}
                                  currentRole={u.role}
                                  onError={setError}
                                />
                              </>
                            )}
                            {u.status === "SUSPENDED" && u.role !== "SYSTEM_ADMIN" && (
                              <button
                                disabled={loadingId !== null}
                                onClick={() => handleToggleSuspension(u.id)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20"
                              >
                                {loadingId === u.id ? (
                                  <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                  <UserCheck size={11} />
                                )}
                                Reactivate
                              </button>
                            )}
                            {u.status !== "ACTIVE" && u.status !== "SUSPENDED" && u.status !== "PENDING_APPROVAL" && u.role !== "SYSTEM_ADMIN" && (
                              <span className="text-xs text-white/25 italic">-</span>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-white/30 text-sm">No users found.</div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

/** Inline role selector for admin users table */
function RoleSelect({
  userId,
  currentRole,
  onError,
}: {
  userId: string;
  currentRole: string;
  onError: (msg: string | null) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState(currentRole);

  const ALL_ROLES = [
    { value: "MEMBER", label: "Talenta" },
    { value: "MENTOR", label: "Mentor" },
    { value: "KETUA_DEWAN_MENTOR", label: "Ketua Mentor" },
    { value: "BPH", label: "Ketua Divisi" },
  ];

  const handleChange = async (newRole: string) => {
    if (newRole === currentRole) {
      setEditing(false);
      return;
    }
    setSaving(true);
    onError(null);
    try {
      const res = await updateUserRoleAction(userId, newRole);
      if (res.success) {
        setSelected(newRole);
        setEditing(false);
      } else {
        onError(res.error || "Failed to change role.");
      }
    } catch {
      onError("An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <select
        value={currentRole}
        onChange={(e) => handleChange(e.target.value)}
        disabled={saving}
        className="bg-[#0d1117] border border-indigo-500/30 rounded-lg px-1.5 py-1 text-[10px] font-medium text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/40 cursor-pointer max-w-[80px]"
        autoFocus
        onBlur={() => !saving && setEditing(false)}
      >
        {ALL_ROLES.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      disabled={saving}
      className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium rounded-lg border border-white/8 bg-white/3 text-white/40 hover:text-white/70 hover:border-white/15 transition-all"
      title="Change role"
    >
      {saving ? (
        <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          <Shield size={9} />
          {ALL_ROLES.find((r) => r.value === currentRole)?.label || currentRole}
          <ChevronDown size={9} />
        </>
      )}
    </button>
  );
}

/** Role badge matching the rest of the dashboard. */
const ROLE_BADGE_META: Record<string, { label: string; color: string }> = {
  SYSTEM_ADMIN: { label: "Koordinator Umum", color: "bg-rose-500/15 text-rose-400 border-rose-500/20" },
  BPH: { label: "Ketua Divisi", color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20" },
  KETUA_DEWAN_MENTOR: { label: "Ketua Mentor", color: "bg-violet-500/15 text-violet-400 border-violet-500/20" },
  MENTOR: { label: "Mentor", color: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  MEMBER: { label: "Talenta", color: "bg-white/8 text-white/50 border-white/10" },
};

function RoleBadge({ role }: { role: string }) {
  const meta = ROLE_BADGE_META[role] ?? { label: role, color: "bg-white/5 text-white/30 border-white/5" };
  return (
    <span className={cn(
      "text-[11px] font-bold px-2 py-0.5 rounded-full border inline-block whitespace-nowrap",
      meta.color
    )}>
      {meta.label}
    </span>
  );
}
