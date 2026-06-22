"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import { actionCreatePartnership } from "@/features/partnership/actions";
import { PartnershipType, PartnershipStatus } from "@prisma/client";

interface UserOption {
  id: string;
  fullName: string;
  username: string;
}

interface PartnershipCreateFormProps {
  users: UserOption[];
}

export default function PartnershipCreateForm({ users }: PartnershipCreateFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [type, setType] = useState<PartnershipType>("KAMPUS");
  const [status, setStatus] = useState<PartnershipStatus>("PROSPECT");
  const [contactName, setContactName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [notes, setNotes] = useState("");
  const [picUserId, setPicUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 3) {
      setError("Name must be at least 3 characters.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await actionCreatePartnership({
        name,
        type,
        status,
        contactName,
        contactInfo,
        notes,
        picUserId,
      });

      if (res.success) {
        router.push(`/dashboard/partnerships/${res.partnershipId}`);
        router.refresh();
      } else {
        setError(res.error || "Gagal menambah kemitraan.");
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
        href="/dashboard/partnerships"
        className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
      >
        <ArrowLeft size={14} />
        Kembali ke Kemitraan
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Tambah Kemitraan Baru</h1>
        <p className="text-sm text-white/40 mt-1">Tambahkan relasi eksternal baru ke dalam data CRM.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 text-sm text-rose-400">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#161b22] border border-white/8 rounded-2xl p-6 space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Nama Mitra <span className="text-rose-400">*</span></label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            placeholder="e.g. Universitas Teknologi Indonesia"
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

        {/* Contact Name & Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Nama Kontak</label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              disabled={loading}
              placeholder="e.g. Budi Santoso"
              className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Info Kontak (Email/No HP)</label>
            <input
              type="text"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              disabled={loading}
              placeholder="e.g. budi@gmail.com"
              className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>
        </div>

        {/* PIC select */}
        <div>
          <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">PIC Internal YYZU</label>
          <select
            value={picUserId}
            onChange={(e) => setPicUserId(e.target.value)}
            disabled={loading}
            className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          >
            <option value="">-- Pilih PIC (User) --</option>
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
            placeholder="Catatan diskusi, tindak lanjut, dll..."
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
            Simpan Kemitraan
          </button>

          <Link
            href="/dashboard/partnerships"
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white/60 text-sm font-semibold rounded-xl transition-all"
          >
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
