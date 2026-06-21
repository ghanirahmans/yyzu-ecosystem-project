"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit3, Save, Phone, User, Building2, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { updatePartnershipAction } from "@/app/actions/partnership";
import { PartnershipType, PartnershipStatus } from "@prisma/client";

interface UserOption {
  id: string;
  fullName: string;
  username: string;
}

interface PartnershipDetailViewProps {
  partnership: {
    id: string;
    name: string;
    type: PartnershipType;
    status: PartnershipStatus;
    contactName: string | null;
    contactInfo: string | null;
    notes: string | null;
    picUserId: string | null;
    pic: { id: string; fullName: string; username: string } | null;
  };
  users: UserOption[];
  canEdit: boolean;
  session: any;
}

const PARTNERSHIP_STATUSES: PartnershipStatus[] = ["PROSPECT", "CONTACTED", "NEGOTIATING", "ACTIVE", "INACTIVE"];

const STATUS_DETAILS: Record<PartnershipStatus, { label: string; color: string; desc: string }> = {
  PROSPECT: { label: "Prospect", color: "bg-white/5 border-white/10 text-white/40", desc: "Mitra potensial baru diidentifikasi." },
  CONTACTED: { label: "Contacted", color: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400", desc: "Komunikasi awal telah dimulai." },
  NEGOTIATING: { label: "Negotiating", color: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400", desc: "Negosiasi kerja sama/MoU sedang berjalan." },
  ACTIVE: { label: "Active", color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400", desc: "Kemitraan aktif terjalin resmi." },
  INACTIVE: { label: "Inactive", color: "bg-rose-500/10 border-rose-500/20 text-rose-400", desc: "Kemitraan ditangguhkan atau tidak aktif." },
};

const TYPE_LABELS: Record<PartnershipType, string> = {
  KAMPUS: "Kampus",
  INDUSTRI: "Industri",
  KOMUNITAS: "Komunitas",
  MENTOR_INDIVIDUAL: "Mentor Individual",
};

export default function PartnershipDetailView({ partnership, users, canEdit, session }: PartnershipDetailViewProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(partnership.name);
  const [type, setType] = useState<PartnershipType>(partnership.type);
  const [status, setStatus] = useState<PartnershipStatus>(partnership.status);
  const [contactName, setContactName] = useState(partnership.contactName ?? "");
  const [contactInfo, setContactInfo] = useState(partnership.contactInfo ?? "");
  const [notes, setNotes] = useState(partnership.notes ?? "");
  const [picUserId, setPicUserId] = useState(partnership.picUserId ?? "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleUpdateStatus = async (newStatus: PartnershipStatus) => {
    if (!confirm(`Ubah status kemitraan menjadi ${STATUS_DETAILS[newStatus].label}?`)) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await updatePartnershipAction(partnership.id, {
        name,
        type,
        status: newStatus,
        contactName,
        contactInfo,
        notes,
        picUserId,
      });

      if (res.success) {
        setSuccess(`Status kemitraan berhasil diubah menjadi ${STATUS_DETAILS[newStatus].label}.`);
        setStatus(newStatus);
        router.refresh();
      } else {
        setError(res.error || "Gagal mengubah status kemitraan.");
      }
    } catch {
      setError("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 3) {
      setError("Nama mitra minimal 3 karakter.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await updatePartnershipAction(partnership.id, {
        name,
        type,
        status,
        contactName,
        contactInfo,
        notes,
        picUserId,
      });

      if (res.success) {
        setSuccess("Detail kemitraan berhasil diperbarui.");
        setEditing(false);
        router.refresh();
      } else {
        setError(res.error || "Gagal memperbarui kemitraan.");
      }
    } catch {
      setError("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const activeStatusMeta = STATUS_DETAILS[partnership.status] || { label: partnership.status, color: "bg-white/5 border-white/10 text-white/40", desc: "" };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Link */}
      <div className="flex justify-between items-center">
        <Link
          href="/dashboard/partnerships"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          Kembali ke Kemitraan
        </Link>
        {canEdit && !editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer font-semibold"
          >
            <Edit3 size={13} />
            Edit Mitra
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

      {/* Visual Status pipeline */}
      {!editing && (
        <div className="bg-[#161b22] border border-white/8 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white text-xs uppercase tracking-wider text-white/40">Status Hubungan Kemitraan</h3>
            <span className="text-[10px] text-white/30 font-medium">CRM Pipeline</span>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/5 -translate-y-1/2 z-0 hidden md:block" />

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 relative z-10">
              {PARTNERSHIP_STATUSES.map((s) => {
                const isCurrent = partnership.status === s;
                const meta = STATUS_DETAILS[s];
                return (
                  <button
                    key={s}
                    disabled={!canEdit || loading}
                    onClick={() => handleUpdateStatus(s)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${isCurrent
                      ? `${meta.color} bg-white/3 ring-2 ring-indigo-500/20 font-bold`
                      : "bg-white/2 border-white/5 text-white/30 hover:border-white/12 hover:text-white/60 disabled:hover:border-white/5 disabled:hover:text-white/30"
                      } ${canEdit ? "cursor-pointer" : "cursor-default"}`}
                  >
                    <span className="text-xs font-semibold">{meta.label}</span>
                    {isCurrent && <span className="text-[9px] mt-1 font-medium animate-pulse">Current</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-white/40 italic">
            <strong>Keterangan Pipeline:</strong> {activeStatusMeta.desc}
          </p>
        </div>
      )}

      {/* Main Card View / Edit Form */}
      {editing ? (
        <form onSubmit={handleSaveInfo} className="bg-[#161b22] border border-white/8 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white mb-2">Edit Detail Mitra</h2>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Nama Mitra <span className="text-rose-400">*</span></label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          {/* Type & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Tipe Kemitraan</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as PartnershipType)}
                disabled={loading}
                className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                <option value="KAMPUS">Kampus</option>
                <option value="INDUSTRI">Industri</option>
                <option value="KOMUNITAS">Komunitas</option>
                <option value="MENTOR_INDIVIDUAL">Mentor Individual</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Status Hubungan</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PartnershipStatus)}
                disabled={loading}
                className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                <option value="PROSPECT">Prospect</option>
                <option value="CONTACTED">Contacted</option>
                <option value="NEGOTIATING">Negotiating</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Nama Kontak</label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                disabled={loading}
                className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Info Kontak</label>
              <input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                disabled={loading}
                className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
            </div>
          </div>

          {/* PIC */}
          <div>
            <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">PIC Internal YYZU</label>
            <select
              value={picUserId}
              onChange={(e) => setPicUserId(e.target.value)}
              disabled={loading}
              className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            >
              <option value="">-- Pilih PIC --</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName} (@{u.username})
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Catatan Tambahan</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={loading}
              rows={4}
              maxLength={1000}
              className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

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
                setName(partnership.name);
                setType(partnership.type);
                setStatus(partnership.status);
                setContactName(partnership.contactName ?? "");
                setContactInfo(partnership.contactInfo ?? "");
                setNotes(partnership.notes ?? "");
                setPicUserId(partnership.picUserId ?? "");
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
              <div className="flex gap-2 items-center">
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${activeStatusMeta.color}`}>
                  {activeStatusMeta.label}
                </span>
                <span className="text-[10px] text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10 font-medium">
                  {TYPE_LABELS[partnership.type]}
                </span>
              </div>
              <h1 className="text-xl font-bold text-white mt-2 leading-tight">{partnership.name}</h1>
            </div>
          </div>

          {/* Notes / Description */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Catatan Kemitraan</h3>
            <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
              {partnership.notes || "Belum ada catatan detail mengenai kemitraan ini."}
            </p>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-white/5">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/3 rounded-xl flex items-center justify-center text-white/50 border border-white/5">
                  <Phone size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-white/30 uppercase tracking-wider block font-semibold">Kontak Utama</span>
                  <span className="text-sm font-medium text-white/80">
                    {canEdit ? (
                      <>
                        {partnership.contactName || "disembunyikan"}{" "}
                        {partnership.contactInfo && <span className="text-white/40 font-normal">({partnership.contactInfo})</span>}
                      </>
                    ) : (
                      <span className="text-white/30 italic flex items-center gap-1.5">
                        🔒 Terbatas (Hanya Divisi Partnership & Founder)
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/3 rounded-xl flex items-center justify-center text-white/50 border border-white/5">
                  <User size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-white/30 uppercase tracking-wider block font-semibold">PIC Internal YYZU</span>
                  {partnership.pic ? (
                    <span className="text-sm font-semibold text-white">
                      {partnership.pic.fullName} <span className="text-white/40 font-normal">(@{partnership.pic.username})</span>
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
