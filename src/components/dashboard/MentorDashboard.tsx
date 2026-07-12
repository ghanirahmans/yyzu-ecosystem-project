"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Clock,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Shield,
  AlertCircle,
  MessageSquare,
  Send,
  X,
  Check,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { cn, timeAgo } from "@/lib/utils";
import { reviewSubmissionAction } from "@/features/team/actions";
import type { JWTSessionPayload } from "@/lib/auth";

// ── Types ──────────────────────────────────────────────
type SubmissionStatus = "NOT_SUBMITTED" | "SUBMITTED" | "APPROVED" | "REVISION";

interface TeamItem {
  id: string;
  name: string;
  description: string | null;
  status: string;
  memberCount: number;
  latestSubmission: {
    id: string;
    status: SubmissionStatus;
    feedback: string | null;
    submittedAt: string | null;
    reviewedAt: string | null;
  } | null;
}

interface ReviewItem {
  id: string;
  teamId: string;
  teamName: string;
  status: SubmissionStatus;
  feedback: string | null;
  reviewedAt: string | null;
}

interface MentorDashboardProps {
  teams: TeamItem[];
  reviewHistory: ReviewItem[];
  session: JWTSessionPayload;
}

// ── Status helpers ──────────────────────────────────────
const STATUS_META: Record<SubmissionStatus, { label: string; color: string }> = {
  NOT_SUBMITTED: { label: "Belum Submit", color: "bg-white/5 text-white/30 border-white/5" },
  SUBMITTED: { label: "Menunggu Review", color: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  APPROVED: { label: "Disetujui", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  REVISION: { label: "Revisi", color: "bg-rose-500/15 text-rose-400 border-rose-500/20" },
};

// ── Component ───────────────────────────────────────────
export default function MentorDashboard({ teams, reviewHistory, session }: MentorDashboardProps) {
  const [reviewingTeam, setReviewingTeam] = useState<string | null>(null);
  const [reviewFeedback, setReviewFeedback] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Stats
  const totalTeams = teams.length;
  const pendingReview = teams.filter(
    (t) => t.latestSubmission?.status === "SUBMITTED"
  ).length;
  const approved = teams.filter(
    (t) => t.latestSubmission?.status === "APPROVED"
  ).length;
  const revision = teams.filter(
    (t) => t.latestSubmission?.status === "REVISION"
  ).length;

  // Open review modal for a team
  const openReview = (teamId: string, currentFeedback?: string | null) => {
    setReviewingTeam(teamId);
    setReviewFeedback(currentFeedback ?? "");
    setActionError(null);
  };

  // Submit review action
  const handleReview = async (teamId: string, status: "APPROVED" | "REVISION") => {
    setActionLoading(teamId);
    setActionError(null);
    try {
      const res = await reviewSubmissionAction(teamId, status, reviewFeedback || undefined);
      if (res.success) {
        setReviewingTeam(null);
        setReviewFeedback("");
      } else {
        setActionError(res.error || "Gagal menyimpan review.");
      }
    } catch {
      setActionError("Terjadi kesalahan.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <DashboardShell user={session}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Mentor Dashboard</h1>
          <p className="text-sm text-white/40 mt-1">
            Pantau progress semua tim dan berikan review submission.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<Users size={18} />} label="Total Tim" value={totalTeams} color="text-blue-400 bg-blue-500/10" />
          <StatCard icon={<Clock size={18} />} label="Menunggu Review" value={pendingReview} color="text-amber-400 bg-amber-500/10" />
          <StatCard icon={<CheckCircle2 size={18} />} label="Disetujui" value={approved} color="text-emerald-400 bg-emerald-500/10" />
          <StatCard icon={<RefreshCw size={18} />} label="Perlu Revisi" value={revision} color="text-rose-400 bg-rose-500/10" />
        </div>

        {/* Team Table */}
        <div className="bg-[#161b22] border border-white/8 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/8">
            <h3 className="font-semibold text-white">Semua Tim</h3>
            <p className="text-xs text-white/40 mt-0.5">{teams.length} tim aktif</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 bg-white/1 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-white/30 uppercase tracking-wider">Team</th>
                  <th className="px-5 py-3 text-xs font-semibold text-white/30 uppercase tracking-wider hidden sm:table-cell">Anggota</th>
                  <th className="px-5 py-3 text-xs font-semibold text-white/30 uppercase tracking-wider">Submission</th>
                  <th className="px-5 py-3 text-xs font-semibold text-white/30 uppercase tracking-wider hidden md:table-cell">Review</th>
                  <th className="px-5 py-3 text-xs font-semibold text-white/30 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {teams.map((team) => {
                  const sub = team.latestSubmission;
                  const subStatus = sub?.status;
                  const needsReview = subStatus === "SUBMITTED" || subStatus === "REVISION";

                  return (
                    <tr key={team.id} className="hover:bg-white/1 transition-colors">
                      {/* Team name */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-white">{team.name}</p>
                        {team.description && (
                          <p className="text-xs text-white/40 mt-0.5 line-clamp-1">{team.description}</p>
                        )}
                      </td>

                      {/* Members count */}
                      <td className="px-5 py-4 hidden sm:table-cell text-sm text-white/50">
                        {team.memberCount} org
                      </td>

                      {/* Submission status badge */}
                      <td className="px-5 py-4">
                        {subStatus ? (
                          <span className={cn(
                            "text-[10px] font-bold px-2 py-1 rounded-full border inline-block",
                            STATUS_META[subStatus]?.color ?? "bg-white/5 text-white/30"
                          )}>
                            {STATUS_META[subStatus]?.label ?? subStatus}
                          </span>
                        ) : (
                          <span className="text-xs text-white/30 italic">—</span>
                        )}
                      </td>

                      {/* Review result badge */}
                      <td className="px-5 py-4 hidden md:table-cell">
                        {sub?.status === "APPROVED" ? (
                          <span className="text-xs text-emerald-400/70 flex items-center gap-1">
                            <CheckCircle2 size={12} />
                            {sub.reviewedAt ? timeAgo(new Date(sub.reviewedAt)) : "Selesai"}
                          </span>
                        ) : sub?.status === "REVISION" ? (
                          <span className="text-xs text-rose-400/70 flex items-center gap-1">
                            <RefreshCw size={12} />
                            {sub.reviewedAt ? timeAgo(new Date(sub.reviewedAt)) : "Perlu revisi"}
                          </span>
                        ) : (
                          <span className="text-xs text-white/25">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/teams/${team.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-white/8 bg-white/3 text-white/40 hover:text-white/70 hover:border-white/15 transition-all"
                          >
                            <ExternalLink size={11} />
                            <span className="hidden sm:inline">Lihat</span>
                          </Link>
                          {needsReview && (
                            <button
                              onClick={() => openReview(team.id, sub?.feedback)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all"
                            >
                              <Send size={11} />
                              Review
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {teams.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-white/30 text-sm">
                      Belum ada tim aktif.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Review History */}
        {reviewHistory.length > 0 && (
          <div className="bg-[#161b22] border border-white/8 rounded-2xl p-5">
            <h3 className="font-semibold text-white mb-4">Riwayat Review</h3>
            <div className="space-y-2">
              {reviewHistory.map((r) => (
                <div
                  key={r.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/2 border border-white/5 hover:bg-white/4 transition-colors"
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                    r.status === "APPROVED" ? "bg-emerald-500/15" : "bg-rose-500/15"
                  )}>
                    {r.status === "APPROVED"
                      ? <CheckCircle2 size={14} className="text-emerald-400" />
                      : <RefreshCw size={14} className="text-rose-400" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">
                      {r.status === "APPROVED" ? "Disetujui" : "Revisi"} — {r.teamName}
                    </p>
                    {r.feedback && (
                      <p className="text-xs text-white/50 mt-0.5 line-clamp-2">{r.feedback}</p>
                    )}
                    {r.reviewedAt && (
                      <p className="text-xs text-white/30 mt-1">{timeAgo(new Date(r.reviewedAt))}</p>
                    )}
                  </div>
                  <Link
                    href={`/dashboard/teams/${r.teamId}`}
                    className="flex-shrink-0 p-1.5 text-white/25 hover:text-white/60 transition-colors"
                  >
                    <ExternalLink size={13} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Review Modal */}
        {reviewingTeam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[#161b22] border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Beri Review</h3>
                <button
                  onClick={() => setReviewingTeam(null)}
                  className="p-1 text-white/30 hover:text-white/70 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {actionError && (
                <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 text-sm text-rose-400 mb-4">
                  <AlertCircle size={14} />
                  {actionError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                    Feedback (opsional)
                  </label>
                  <textarea
                    value={reviewFeedback}
                    onChange={(e) => setReviewFeedback(e.target.value)}
                    rows={4}
                    placeholder="Tulis catatan untuk tim..."
                    className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/25 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleReview(reviewingTeam, "APPROVED")}
                    disabled={actionLoading === reviewingTeam}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors"
                  >
                    {actionLoading === reviewingTeam ? (
                      <span className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Check size={14} />
                    )}
                    Setujui
                  </button>
                  <button
                    onClick={() => handleReview(reviewingTeam, "REVISION")}
                    disabled={actionLoading === reviewingTeam}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors"
                  >
                    {actionLoading === reviewingTeam ? (
                      <span className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <RefreshCw size={14} />
                    )}
                    Minta Revisi
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

// ── Stat Card Sub-component ─────────────────────────────
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-[#161b22] border border-white/8 rounded-2xl p-5 flex items-center gap-4">
      <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0", color)}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-white/40 mt-0.5">{label}</p>
      </div>
    </div>
  );
}
