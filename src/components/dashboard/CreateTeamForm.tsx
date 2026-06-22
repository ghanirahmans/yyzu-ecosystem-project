"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { cn } from "@/lib/utils";
import { createTeamAction } from "@/features/team/actions";

interface CreateTeamFormProps {
  session: any;
}

export default function CreateTeamForm({ session }: CreateTeamFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", description: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    const name = form.name.trim();
    if (!name || name.length < 3) {
      errs.name = "Team name must be at least 3 characters.";
    } else if (name.length > 60) {
      errs.name = "Team name cannot exceed 60 characters.";
    }
    if (form.description.length > 500) {
      errs.description = "Description cannot exceed 500 characters.";
    }
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const res = await createTeamAction(form);
      if (res.success) {
        setCreated(true);
        setTimeout(() => {
          router.push("/dashboard/team");
          router.refresh();
        }, 1800);
      } else {
        if (res.error === "TEAM_NAME_TAKEN") {
          setErrors({ name: "This team name is already taken. Please choose another." });
        } else {
          setServerError(res.error || "Failed to create team.");
        }
      }
    } catch {
      setServerError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (created) {
    return (
      <DashboardShell user={session}>
        <div className="max-w-md mx-auto mt-16 text-center">
          <div className="w-16 h-16 bg-emerald-500/15 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
            <CheckCircle2 size={30} className="text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Team Created!</h2>
          <p className="text-sm text-white/40">
            You are now the Team Leader of <strong className="text-white">{form.name}</strong>.
          </p>
          <p className="text-xs text-white/25 mt-2">Redirecting to your workspace…</p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell user={session}>
      <div className="max-w-xl mx-auto">
        {/* Back */}
        <Link
          href="/dashboard/teams"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Browse Teams
        </Link>

        {serverError && (
          <div className="flex items-center gap-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 mb-5 text-sm text-rose-400">
            <AlertCircle size={15} />
            {serverError}
          </div>
        )}

        <div className="bg-[#161b22] border border-white/8 rounded-2xl p-7">
          {/* Header */}
          <div className="flex items-center gap-3 mb-7">
            <div className="w-10 h-10 bg-indigo-500/15 rounded-xl flex items-center justify-center">
              <Users size={18} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Create a Team</h1>
              <p className="text-xs text-white/40">You will automatically become the Team Leader.</p>
            </div>
          </div>

          {/* Business rule notice */}
          <div className="flex items-start gap-3 bg-white/4 border border-white/8 rounded-xl px-4 py-3 mb-6 text-xs text-white/50">
            <AlertCircle size={13} className="mt-0.5 flex-shrink-0 text-white/30" />
            <span>
              You can only belong to <strong className="text-white/70">one team</strong> at a time.
              Creating this team means you cannot join another until you leave or delete this one.
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Team name */}
            <div>
              <label htmlFor="team-name" className="block text-sm font-medium text-white/70 mb-1.5">
                Team Name <span className="text-rose-400">*</span>
              </label>
              <input
                id="team-name"
                type="text"
                maxLength={60}
                value={form.name}
                onChange={(e) => {
                  setForm((f) => ({ ...f, name: e.target.value }));
                  setErrors((er) => {
                    const n = { ...er };
                    delete n.name;
                    return n;
                  });
                }}
                placeholder="e.g. Team Nexus"
                className={cn(
                  "w-full bg-[#0d1117] border rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 transition-all",
                  errors.name
                    ? "border-rose-500/40 focus:ring-rose-500/30"
                    : "border-white/10 focus:ring-indigo-500/40"
                )}
              />
              <div className="flex justify-between mt-1">
                {errors.name && (
                  <p className="text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle size={10} />
                    {errors.name}
                  </p>
                )}
                <p className="text-xs text-white/25 ml-auto">{form.name.length}/60</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="team-desc" className="block text-sm font-medium text-white/70 mb-1.5">
                Description
              </label>
              <textarea
                id="team-desc"
                rows={4}
                maxLength={500}
                value={form.description}
                onChange={(e) => {
                  setForm((f) => ({ ...f, description: e.target.value }));
                  setErrors((er) => {
                    const n = { ...er };
                    delete n.description;
                    return n;
                  });
                }}
                placeholder="What is this team building? What tools are you using?"
                className={cn(
                  "w-full bg-[#0d1117] border rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 resize-none focus:outline-none focus:ring-2 transition-all",
                  errors.description
                    ? "border-rose-500/40 focus:ring-rose-500/30"
                    : "border-white/10 focus:ring-indigo-500/40"
                )}
              />
              <div className="flex justify-between mt-1">
                {errors.description && (
                  <p className="text-xs text-rose-400">{errors.description}</p>
                )}
                <p className="text-xs text-white/25 ml-auto">{form.description.length}/500</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Users size={15} />
              )}
              {loading ? "Creating team…" : "Create Team"}
            </button>
          </form>
        </div>
      </div>
    </DashboardShell>
  );
}
