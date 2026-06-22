"use client";

import { useState } from "react";
import { Mail, Check, X, AlertCircle } from "lucide-react";
import { acceptInvitationAction, rejectInvitationAction } from "@/features/team/actions";
import { formatDate } from "@/lib/utils";

interface InvitationItem {
  id: string;
  expiresAt: Date;
  team: {
    name: string;
  };
  invitedByUser: {
    fullName: string;
  };
}

export default function InboundInvitations({ invitations }: { invitations: InvitationItem[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (invitations.length === 0) return null;

  const handleAccept = async (id: string) => {
    setLoadingId(id);
    setError(null);
    try {
      const res = await acceptInvitationAction(id);
      if (!res.success) {
        setError(res.error || "Failed to accept invitation.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setLoadingId(id);
    setError(null);
    try {
      const res = await rejectInvitationAction(id);
      if (!res.success) {
        setError(res.error || "Failed to reject invitation.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-indigo-500/15 rounded-full flex items-center justify-center">
          <Mail size={15} className="text-indigo-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">
            You have {invitations.length} pending invitation{invitations.length > 1 ? "s" : ""}
          </p>
          <p className="text-xs text-white/40">Accept to join a team</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/25 rounded-xl px-4 py-2.5 mb-3 text-xs text-rose-400">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      <div className="space-y-2">
        {invitations.map((invite) => (
          <div
            key={invite.id}
            className="flex items-center justify-between bg-white/4 rounded-xl px-4 py-3"
          >
            <div>
              <p className="text-sm font-semibold text-white">{invite.team.name}</p>
              <p className="text-xs text-white/40">
                Invited by {invite.invitedByUser.fullName} · Expires {formatDate(invite.expiresAt)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={loadingId !== null}
                onClick={() => handleAccept(invite.id)}
                className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                {loadingId === invite.id ? (
                  <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Check size={12} />
                )}
                Accept
              </button>
              <button
                disabled={loadingId !== null}
                onClick={() => handleReject(invite.id)}
                className="flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-white/60 hover:text-white text-xs font-semibold rounded-lg transition-colors"
              >
                <X size={12} />
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
