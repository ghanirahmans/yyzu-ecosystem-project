"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit3, Save, Calendar, User, Layers, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { actionUpdateProgram, actionUpdateProgramStatus, actionApproveProgram } from "@/features/program/actions";
import { ProgramStatus, ProgramApprovalStatus } from "@prisma/client";
import type { JWTSessionPayload } from "@/lib/auth";

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

interface ProgramDetailViewProps {
  program: {
    id: string;
    title: string;
    description: string | null;
    status: ProgramStatus;
    approvalStatus: ProgramApprovalStatus;
    picUserId: string | null;
    startDate: Date | null;
    endDate: Date | null;
    divisions: { id: string; name: string }[];
    pic: { id: string; fullName: string; username: string } | null;
    author: { id: string; fullName: string; username: string } | null;
  };
  divisions: DivisionOption[];
  users: UserOption[];
  canEdit: boolean;
  isManager: boolean;
  canModerate: boolean;
  session: JWTSessionPayload;
}

const PROGRAM_STATUSES: ProgramStatus[] = ["DRAFT", "PERSIAPAN", "PUBLIKASI", "EVALUASI", "SELESAI", "DIBATALKAN"];

const STATUS_DETAILS: Record<ProgramStatus, { label: string; color: string; desc: string }> = {
  DRAFT: { label: "Draft", color: "bg-white/5 border-white/10 text-white/40", desc: "Program sedang direncanakan awal." },
  PERSIAPAN: { label: "Persiapan", color: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400", desc: "Persiapan teknis, logistik, dan koordinasi sedang berjalan." },
  PUBLIKASI: { label: "Publikasi", color: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400", desc: "Program sedang dipublikasikan atau aktif berlangsung." },
  EVALUASI: { label: "Evaluasi", color: "bg-amber-500/10 border-amber-500/20 text-amber-400", desc: "Pelaksanaan selesai, sedang dalam tahap penilaian/LPJ." },
  SELESAI: { label: "Selesai", color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400", desc: "Program kerja telah diselesaikan sepenuhnya." },
  DIBATALKAN: { label: "Dibatalkan", color: "bg-rose-500/10 border-rose-500/20 text-rose-400", desc: "Program dibatalkan karena hal tertentu." },
};

const PROGRAM_APPROVAL_STATUS_LABELS: Record<ProgramApprovalStatus, { label: string; color: string }> = {
  PENDING: { label: "Menunggu Persetujuan", color: "bg-amber-500/15 border-amber-500/30 text-amber-400" },
  APPROVED: { label: "Disetujui", color: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" },
  REJECTED: { label: "Ditolak", color: "bg-rose-500/15 border-rose-500/30 text-rose-400" },
  DRAFT: { label: "Draft Ide (Belum Jalan)", color: "bg-blue-500/15 border-blue-500/30 text-blue-400" },
};

export default function ProgramDetailView({
  program,
  divisions,
  users,
  canEdit,
  isManager,
  canModerate,
  session,
}: ProgramDetailViewProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(program.title);
  const [description, setDescription] = useState(program.description ?? "");
  const [divisionIds, setDivisionIds] = useState<string[]>(program.divisions.map((d) => d.id));
  const [picUserId, setPicUserId] = useState(program.picUserId ?? "");

  // Format Date objects to YYYY-MM-DD for html date inputs
  const formatDateForInput = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  const [startDate, setStartDate] = useState(formatDateForInput(program.startDate));
  const [endDate, setEndDate] = useState(formatDateForInput(program.endDate));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    if (divisionIds.length === 0) return true;
    return u.divisionMemberships?.some((dm) => divisionIds.includes(dm.divisionId));
  });

  const handleUpdateStatus = async (newStatus: ProgramStatus) => {
    if (program.approvalStatus !== "APPROVED") {
      setError("Status alur program hanya dapat diubah setelah usulan disetujui (Approved) oleh Admin atau Ketua Divisi.");
      return;
    }

    if (!confirm(`Ubah status program menjadi ${STATUS_DETAILS[newStatus].label}?`)) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await actionUpdateProgramStatus(program.id, newStatus);
      if (res.success) {
        setSuccess(`Status program berhasil diubah menjadi ${STATUS_DETAILS[newStatus].label}.`);
        router.refresh();
      } else {
        setError(res.error || "Gagal mengubah status program.");
      }
    } catch {
      setError("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (newApprovalStatus: ProgramApprovalStatus) => {
    if (!confirm(`Ubah status persetujuan usulan program menjadi ${PROGRAM_APPROVAL_STATUS_LABELS[newApprovalStatus].label}?`)) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await actionApproveProgram(program.id, newApprovalStatus);
      if (res.success) {
        setSuccess(`Status persetujuan program berhasil diubah menjadi ${PROGRAM_APPROVAL_STATUS_LABELS[newApprovalStatus].label}.`);
        router.refresh();
      } else {
        setError(res.error || "Gagal mengubah status persetujuan.");
      }
    } catch {
      setError("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || title.trim().length < 3) {
      setError("Judul program minimal 3 karakter.");
      return;
    }
    if (isManager && divisionIds.length === 0) {
      setError("Harap pilih minimal satu divisi.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await actionUpdateProgram(program.id, {
        title,
        description,
        divisionIds,
        picUserId,
        startDate,
        endDate,
      });

      if (res.success) {
        setSuccess("Detail program berhasil diperbarui.");
        setEditing(false);
        router.refresh();
      } else {
        setError(res.error || "Gagal memperbarui program.");
      }
    } catch {
      setError("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const startFormatted = program.startDate ? new Date(program.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "—";
  const endFormatted = program.endDate ? new Date(program.endDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "—";
  
  const activeStatusMeta = STATUS_DETAILS[program.status] || { label: program.status, color: "bg-white/5 border-white/10 text-white/40", desc: "" };
  const approvalMeta = PROGRAM_APPROVAL_STATUS_LABELS[program.approvalStatus] || { label: program.approvalStatus, color: "bg-white/5 border-white/10 text-white/40" };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Link */}
      <div className="flex justify-between items-center">
        <Link
          href="/dashboard/programs"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          Kembali ke Program
        </Link>
        {canEdit && !editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer font-semibold"
          >
            Edit Program
          </button>
        )}
      </div>

      {/* Alert Messages */}
      {success && (
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 text-sm text-emerald-400">
          <CheckCircle2 size={15} />
          {success}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 text-sm text-rose-400">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      {/* Moderation / Approval Panel (Visible to Admins and Division Heads) */}
      {canModerate && !editing && (
        <div className="bg-[#1c1612] border border-amber-500/20 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-amber-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck size={14} /> Panel Moderasi Pengurus
            </h3>
            <span className="text-[10px] text-white/30 font-medium">BPH Moderation</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-white/70">Ubah Status Usulan:</span>

            <button
              onClick={() => handleApprove("APPROVED")}
              disabled={loading}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                program.approvalStatus === "APPROVED"
                  ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400 font-bold"
                  : "bg-white/3 border-white/5 text-white/40 hover:bg-white/5 hover:text-white"
              }`}
            >
              Approve (Jalankan)
            </button>

            <button
              onClick={() => handleApprove("DRAFT")}
              disabled={loading}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                program.approvalStatus === "DRAFT"
                  ? "bg-blue-500/20 border-blue-500/30 text-blue-400 font-bold"
                  : "bg-white/3 border-white/5 text-white/40 hover:bg-white/5 hover:text-white"
              }`}
            >
              Draft Ide (Diterima, Belum Jalan)
            </button>

            <button
              onClick={() => handleApprove("REJECTED")}
              disabled={loading}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                program.approvalStatus === "REJECTED"
                  ? "bg-rose-500/20 border-rose-500/30 text-rose-400 font-bold"
                  : "bg-white/3 border-white/5 text-white/40 hover:bg-white/5 hover:text-white"
              }`}
            >
              Reject
            </button>
          </div>

          <p className="text-[10px] text-white/30">
            * Hanya Admin atau Ketua Divisi pelaksana yang dapat memoderasi usulan program kerja ini.
          </p>
        </div>
      )}

      {/* Visual Status Flow Tracker */}
      {!editing && (
        <div className="bg-[#161b22] border border-white/8 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white text-xs uppercase tracking-wider text-white/40">Status Alur Program</h3>
            <span className="text-[10px] text-white/30 font-medium">Progressive Pipeline</span>
          </div>

          {program.approvalStatus !== "APPROVED" ? (
            <div className="bg-[#1e1612] border border-amber-500/10 rounded-xl p-4 text-center text-amber-500/70 text-xs italic">
              Alur progres program dinonaktifkan karena program belum disetujui (Status saat ini: {approvalMeta.label}).
            </div>
          ) : (
            <div className="relative">
              {/* Connection Line */}
              <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/5 -translate-y-1/2 z-0 hidden md:block" />
              
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3 relative z-10">
                {PROGRAM_STATUSES.map((status) => {
                  const isCurrent = program.status === status;
                  const meta = STATUS_DETAILS[status];
                  return (
                    <button
                      key={status}
                      disabled={!canEdit || loading}
                      onClick={() => handleUpdateStatus(status)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                        isCurrent
                          ? `${meta.color} bg-white/3 ring-2 ring-indigo-500/20 font-bold`
                          : "bg-white/2 border-white/5 text-white/30 hover:border-white/12 hover:text-white/60 disabled:hover:border-white/5 disabled:hover:text-white/30"
                      } ${canEdit ? "cursor-pointer" : "cursor-default"}`}
                    >
                      <span className="text-xs font-semibold">{meta.label}</span>
                      {isCurrent && <span className="text-[9px] mt-1 font-medium animate-pulse">Active</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {program.approvalStatus === "APPROVED" && (
            <p className="text-xs text-white/40 italic">
              <strong>Deskripsi Tahap:</strong> {activeStatusMeta.desc}
            </p>
          )}
        </div>
      )}

      {/* Main View / Edit Form */}
      {editing ? (
        <form onSubmit={handleSaveInfo} className="bg-[#161b22] border border-white/8 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white mb-2">Edit Detail Program</h2>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Judul Program <span className="text-rose-400">*</span></label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
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
              className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          {isManager && (
            <>
              {/* Involved Divisions (Multi-select) */}
              <div>
                <label className="block text-xs font-semibold text-white/40 mb-2 uppercase tracking-wider">Divisi yang Terlibat <span className="text-rose-400">*</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#0d1117] border border-white/10 rounded-xl p-3 max-h-48 overflow-y-auto">
                  {divisions.map((d) => {
                    const isChecked = divisionIds.includes(d.id);
                    return (
                      <label key={d.id} className="flex items-center gap-2.5 text-xs text-white/70 hover:text-white cursor-pointer select-none py-1">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={loading}
                          onChange={() => {
                            if (isChecked) {
                              setDivisionIds(divisionIds.filter((id) => id !== d.id));
                            } else {
                              setDivisionIds([...divisionIds, d.id]);
                            }
                          }}
                          className="rounded border-white/10 text-indigo-600 focus:ring-indigo-500/40 bg-transparent"
                        />
                        {d.name.replace(/_/g, " ")}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* PIC select */}
              <div>
                <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">PIC Program</label>
                <select
                  value={picUserId}
                  onChange={(e) => setPicUserId(e.target.value)}
                  disabled={loading}
                  className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                >
                  <option value="">-- Pilih PIC --</option>
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
              Simpan Perubahan
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setEditing(false);
                setTitle(program.title);
                setDescription(program.description ?? "");
                setDivisionIds(program.divisions.map((d) => d.id));
                setPicUserId(program.picUserId ?? "");
                setStartDate(formatDateForInput(program.startDate));
                setEndDate(formatDateForInput(program.endDate));
              }}
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white/60 text-sm font-semibold rounded-xl transition-all"
            >
              Batal
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-[#161b22] border border-white/8 rounded-2xl p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-5 border-b border-white/5">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${approvalMeta.color}`}>
                  {approvalMeta.label}
                </span>
                {program.approvalStatus === "APPROVED" && (
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${activeStatusMeta.color}`}>
                    {activeStatusMeta.label}
                  </span>
                )}
              </div>
              <h1 className="text-xl font-bold text-white mt-2 leading-tight">{program.title}</h1>

              {/* Divisions Badges */}
              {program.divisions && program.divisions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {program.divisions.map((d) => (
                    <span key={d.id} className="text-[10px] text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-lg font-medium">
                      🗂️ {d.name.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Deskripsi Program</h3>
            <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
              {program.description || "Tidak ada deskripsi rinci untuk program ini."}
            </p>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-white/5">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/3 rounded-xl flex items-center justify-center text-white/50 border border-white/5">
                  <Calendar size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-white/30 uppercase tracking-wider block font-semibold">Tanggal Mulai</span>
                  <span className="text-sm font-medium text-white/80">{startFormatted}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/3 rounded-xl flex items-center justify-center text-white/50 border border-white/5">
                  <Calendar size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-white/30 uppercase tracking-wider block font-semibold">Tanggal Selesai</span>
                  <span className="text-sm font-medium text-white/80">{endFormatted}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/3 rounded-xl flex items-center justify-center text-white/50 border border-white/5">
                  <User size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-white/30 uppercase tracking-wider block font-semibold">Diusulkan Oleh (Author)</span>
                  <span className="text-sm font-semibold text-white">
                    {program.author?.fullName || "System"} <span className="text-white/40 font-normal">(@{program.author?.username || "system"})</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/3 rounded-xl flex items-center justify-center text-white/50 border border-white/5">
                  <User size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-white/30 uppercase tracking-wider block font-semibold">PIC Program</span>
                  {program.pic ? (
                    <span className="text-sm font-semibold text-white">
                      {program.pic.fullName} <span className="text-white/40 font-normal">(@{program.pic.username})</span>
                    </span>
                  ) : (
                    <span className="text-sm text-white/30 italic">Belum ditentukan</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
