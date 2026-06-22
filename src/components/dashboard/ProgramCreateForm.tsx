"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import { actionCreateProgram } from "@/features/program/actions";
import { cn } from "@/lib/utils";

interface DivisionOption {
  id: string;
  name: string;
}

interface UserOption {
  id: string;
  fullName: string;
  username: string;
  divisionMemberships?: { divisionId: string }[];
}

interface ProgramCreateFormProps {
  divisions: DivisionOption[];
  users: UserOption[];
  isManager: boolean;
  defaultDivisionId?: string;
}

export default function ProgramCreateForm({ divisions, users, isManager, defaultDivisionId }: ProgramCreateFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [divisionIds, setDivisionIds] = useState<string[]>(defaultDivisionId ? [defaultDivisionId] : []);
  const [picUserId, setPicUserId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    if (divisionIds.length === 0) return true;
    return u.divisionMemberships?.some((dm) => divisionIds.includes(dm.divisionId));
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || title.trim().length < 3) {
      setError("Title must be at least 3 characters.");
      return;
    }
    if (isManager && divisionIds.length === 0) {
      setError("Please select at least one division.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await actionCreateProgram({
        title,
        description,
        divisionIds,
        picUserId,
        startDate,
        endDate,
      });

      if (res.success) {
        router.push(`/dashboard/programs/${res.programId}`);
        router.refresh();
      } else {
        setError(res.error || "Gagal membuat program.");
      }
    } catch {
      setError("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Back Link */}
      <Link
        href="/dashboard/programs"
        className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
      >
        <ArrowLeft size={14} />
        Kembali ke Program
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Buat Usulan Program Baru</h1>
        <p className="text-sm text-white/40 mt-1">Usulkan program kerja atau event baru. Usulan ini akan melalui proses persetujuan oleh Admin atau Ketua Divisi terkait.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 text-sm text-rose-400">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#161b22] border border-white/8 rounded-2xl p-6 space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Judul Program <span className="text-rose-400">*</span></label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            placeholder="e.g. YYZU Hackathon 2026"
            className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Deskripsi</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            rows={4}
            maxLength={1000}
            placeholder="Detail mengenai tujuan dan jalannya program..."
            className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>

        {isManager && (
          <>
            {/* Divisions Involved (Multi-select) */}
            <div>
              <label className="block text-xs font-semibold text-white/40 mb-2 uppercase tracking-wider">Divisi yang Terlibat <span className="text-rose-400">*</span></label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#0d1117] border border-white/10 rounded-xl p-3 max-h-48 overflow-y-auto">
                {divisions.map((d) => {
                  const isChecked = divisionIds.includes(d.id);
                  return (
                    <label
                      key={d.id}
                      className={cn(
                        "flex items-center gap-2.5 text-xs select-none py-1",
                        d.id === defaultDivisionId
                          ? "text-indigo-400 cursor-not-allowed opacity-80"
                          : "text-white/70 hover:text-white cursor-pointer"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={loading || d.id === defaultDivisionId}
                        onChange={() => {
                          if (d.id === defaultDivisionId) return;
                          if (isChecked) {
                            setDivisionIds(divisionIds.filter((id) => id !== d.id));
                          } else {
                            setDivisionIds([...divisionIds, d.id]);
                          }
                        }}
                        className={cn(
                          "rounded border-white/10 text-indigo-600 focus:ring-indigo-500/40 bg-transparent",
                          d.id === defaultDivisionId && "opacity-50 cursor-not-allowed"
                        )}
                      />
                      {d.name.replace(/_/g, " ")}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* PIC Select */}
            <div>
              <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">PIC Program</label>
              <select
                value={picUserId}
                onChange={(e) => setPicUserId(e.target.value)}
                disabled={loading}
                className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                <option value="">-- Pilih PIC (User) --</option>
                {filteredUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.fullName} (@{u.username})
                  </option>
                ))}
              </select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Tanggal Mulai</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  disabled={loading}
                  className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Tanggal Selesai</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={loading}
                  className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>
            </div>
          </>
        )}

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all cursor-pointer border border-transparent shadow-lg shadow-indigo-600/10"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin block" />
            ) : (
              <Save size={14} />
            )}
            Ajukan Program
          </button>

          <Link
            href="/dashboard/programs"
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white/60 text-sm font-semibold rounded-xl transition-all"
          >
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
