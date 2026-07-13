"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { actionAddDivisionMember, actionRemoveDivisionMember, actionChangeDivisionRole } from "@/features/division/actions";
import { Crown, Trash2, Plus, ShieldAlert, CheckCircle2 } from "lucide-react";
import { getInitials, stringToColor } from "@/lib/utils";

interface Membership {
  id: string;
  role: "HEAD" | "STAFF" | string;
  user: {
    id: string;
    username: string;
    fullName: string;
  };
}

interface DivisionMemberManagerProps {
  divisionId: string;
  memberships: Membership[];
  canManage: boolean;
}

export default function DivisionMemberManager({ divisionId, memberships, canManage }: DivisionMemberManagerProps) {
  const router = useRouter();
  const [newUsername, setNewUsername] = useState("");
  const [newRole, setNewRole] = useState<"HEAD" | "STAFF">("STAFF");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await actionAddDivisionMember(divisionId, newUsername.trim(), newRole);
      if (res.success) {
        setSuccess(`User @${newUsername} berhasil ditambahkan.`);
        setNewUsername("");
        router.refresh();
      } else {
        setError(res.error || "Gagal menambahkan anggota.");
      }
    } catch {
      setError("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (membershipId: string, username: string) => {
    if (!confirm(`Apakah Anda yakin ingin mengeluarkan @${username} dari divisi ini?`)) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await actionRemoveDivisionMember(divisionId, membershipId);
      if (res.success) {
        setSuccess(`User @${username} berhasil dikeluarkan.`);
        router.refresh();
      } else {
        setError(res.error || "Gagal mengeluarkan anggota.");
      }
    } catch {
      setError("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (membershipId: string, role: "HEAD" | "STAFF", username: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await actionChangeDivisionRole(divisionId, membershipId, role);
      if (res.success) {
        setSuccess(`Role @${username} diubah menjadi ${role}.`);
        router.refresh();
      } else {
        setError(res.error || "Gagal mengubah role.");
      }
    } catch {
      setError("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="space-y-6">
      {/* Alert Messages */}
      {success && (
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 text-sm text-emerald-400">
          <CheckCircle2 size={15} />
          {success}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 text-sm text-rose-400">
          <ShieldAlert size={15} />
          {error}
        </div>
      )}

      {/* Manager Panel: Add Member */}
      {canManage && (
        <form onSubmit={handleAddMember} className="bg-[#161b22] border border-white/8 rounded-2xl p-5 space-y-4">
          <h3 className="font-semibold text-white text-sm">Tambah Anggota Divisi</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <input
                type="text"
                placeholder="Username anggota..."
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                disabled={loading}
                className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
            </div>
            <div>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as unknown as "HEAD" | "STAFF")}
                disabled={loading}
                className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                <option value="STAFF">Staff</option>
                <option value="HEAD">Head</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || !newUsername.trim()}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all cursor-pointer border border-transparent"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Plus size={16} />
            )}
            Tambah Anggota
          </button>
        </form>
      )}

      {/* Members List */}
      <div className="bg-[#161b22] border border-white/8 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/6 flex justify-between items-center">
          <h3 className="font-semibold text-white text-sm">Daftar Anggota ({memberships.length})</h3>
        </div>

        {memberships.length === 0 ? (
          <div className="p-8 text-center text-white/30 text-sm">
            Belum ada anggota di divisi ini.
          </div>
        ) : (
          <div className="divide-y divide-white/6">
            {memberships.map((m) => {
              const initials = getInitials(m.user.fullName);
              const color = stringToColor(m.user.username);
              const isHead = m.role === "HEAD";

              return (
                <div key={m.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 font-mono"
                      style={{ background: color }}
                    >
                      {initials}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                        {m.user.fullName}
                        {isHead && (
                          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/25">
                            <Crown size={8} /> Head
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-white/40">@{m.user.username}</p>
                    </div>
                  </div>

                  {canManage && (
                    <div className="flex items-center gap-2">
                      <select
                        value={m.role}
                        disabled={loading}
                        onChange={(e) => handleChangeRole(m.id, e.target.value as unknown as "HEAD" | "STAFF", m.user.username)}
                        className="bg-[#0d1117] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                      >
                        <option value="STAFF">Staff</option>
                        <option value="HEAD">Head</option>
                      </select>

                      <button
                        onClick={() => handleRemoveMember(m.id, m.user.username)}
                        disabled={loading}
                        title="Keluarkan dari Divisi"
                        className="p-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
