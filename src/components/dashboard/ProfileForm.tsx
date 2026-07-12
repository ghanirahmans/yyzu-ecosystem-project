"use client";

import { useState } from "react";
import {
  User,
  Edit3,
  Save,
  X,
  Shield,
  Calendar,
  AtSign,
  Mail,
  CheckCircle2,
  AlertCircle,
  Users,
  Star,
  Lock,
  Eye,
  EyeOff,
  ChevronDown,
} from "lucide-react";
import type { JWTSessionPayload } from "@/lib/auth";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { cn, formatDate, getInitials, stringToColor } from "@/lib/utils";
import { actionUpdateProfile } from "@/features/profile/actions";
import { actionChangePassword } from "@/features/profile/actions";

const DIVISION_LABELS: Record<string, string> = {
  PARTNERSHIP: "Partnership",
  SDM_MANAGEMENT: "SDM & Management",
  EVENT_ORGANIZER: "Event Organizer",
  PRODUCT_PROJECT_MANAGEMENT: "Product & PM",
  LEARNING_CURRICULUM: "Learning & Curriculum",
  MEDIA_BRANDING: "Media & Branding",
  KOORDINATOR_UMUM: "Koordinator Umum",
};

interface DivisionMembershipInfo {
  divisionName: string;
  role: string;
}

interface ProfileFormProps {
  user: {
    id: string;
    username: string;
    email: string | null;
    fullName: string;
    role: string;
    status: string;
    createdAt: Date;
    profile: {
      bio: string | null;
      avatarUrl: string | null;
    } | null;
  };
  teamName: string | null;
  teamRole: string | null;
  divisionMemberships: DivisionMembershipInfo[];
  session: JWTSessionPayload;
}

export default function ProfileForm({
  user,
  teamName,
  teamRole,
  divisionMemberships,
  session,
}: ProfileFormProps) {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: user.fullName,
    bio: user.profile?.bio ?? "",
    avatarUrl: user.profile?.avatarUrl ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // Change password state
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const initials = getInitials(user.fullName);
  const avatarColor = stringToColor(user.username);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      errs.fullName = "Full name must be at least 2 characters.";
    }
    if (form.bio.length > 500) {
      errs.bio = "Bio cannot exceed 500 characters.";
    }
    if (form.avatarUrl && !/^https?:\/\/.+/.test(form.avatarUrl)) {
      errs.avatarUrl = "Avatar URL must be a valid URL.";
    }
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setServerError(null);

    try {
      const res = await actionUpdateProfile(form);
      if (res.success) {
        setEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setServerError(res.error || "Failed to update profile.");
      }
    } catch {
      setServerError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    // Validate
    if (!pwForm.currentPassword) {
      setPwError("Current password is required.");
      return;
    }
    if (!pwForm.newPassword || pwForm.newPassword.length < 6) {
      setPwError("New password must be at least 6 characters.");
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError("Passwords do not match.");
      return;
    }
    if (pwForm.newPassword === pwForm.currentPassword) {
      setPwError("New password must be different from current password.");
      return;
    }

    setPwLoading(true);
    setPwError(null);
    setPwSuccess(false);

    try {
      const res = await actionChangePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      if (res.success) {
        setPwSuccess(true);
        setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setShowPw(false);
        setTimeout(() => {
          setPwSuccess(false);
          setShowChangePassword(false);
        }, 3000);
      } else {
        setPwError(
          res.error === "CURRENT_PASSWORD_INCORRECT"
            ? "Current password is incorrect."
            : res.error === "INVALID_NEW_PASSWORD"
            ? "New password must be between 6 and 100 characters."
            : "Failed to change password."
        );
      }
    } catch {
      setPwError("An unexpected error occurred.");
    } finally {
      setPwLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setErrors({});
    setServerError(null);
    setForm({
      fullName: user.fullName,
      bio: user.profile?.bio ?? "",
      avatarUrl: user.profile?.avatarUrl ?? "",
    });
  };

  // Build role badges
  const roleBadges: { label: string; color: string }[] = [];

  if (user.role === "SYSTEM_ADMIN") {
    roleBadges.push({ label: "Koordinator Umum · BPH", color: "bg-rose-500/15 text-rose-400 border-rose-500/20" });
  } else if (user.role === "BPH") {
    roleBadges.push({ label: "Ketua Divisi · BPH", color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20" });
  } else if (user.role === "KETUA_DEWAN_MENTOR") {
    roleBadges.push({ label: "Ketua Dewan Mentor", color: "bg-violet-500/15 text-violet-400 border-violet-500/20" });
  } else if (user.role === "MENTOR") {
    roleBadges.push({ label: "Mentor", color: "bg-amber-500/15 text-amber-400 border-amber-500/20" });
  } else {
    roleBadges.push({ label: "Member", color: "bg-white/8 text-white/50 border-white/10" });
  }

  if (teamRole === "TEAM_LEADER") {
    roleBadges.push({ label: "Team Leader", color: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20" });
  } else if (teamRole === "MEMBER" && teamName) {
    roleBadges.push({ label: "Team Member", color: "bg-blue-500/15 text-blue-400 border-blue-500/20" });
  }

  for (const dm of divisionMemberships) {
    const divLabel = DIVISION_LABELS[dm.divisionName] ?? dm.divisionName;
    if (dm.role === "HEAD") {
      roleBadges.push({
        label: `Head of ${divLabel}`,
        color: "bg-violet-500/15 text-violet-400 border-violet-500/20",
      });
    } else {
      roleBadges.push({
        label: divLabel,
        color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
      });
    }
  }

  return (
    <DashboardShell user={session}>
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Saved toast */}
        {saved && (
          <div className="flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 text-sm text-emerald-400">
            <CheckCircle2 size={15} />
            Profile saved successfully.
          </div>
        )}

        {serverError && (
          <div className="flex items-center gap-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 text-sm text-rose-400">
            <AlertCircle size={15} />
            {serverError}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-[#161b22] border border-white/8 rounded-2xl overflow-hidden">
          {/* Header band */}
          <div className="h-24 bg-gradient-to-r from-indigo-900/40 via-violet-900/30 to-indigo-900/40 relative">
            <div className="absolute bottom-0 left-6 translate-y-1/2">
              {form.avatarUrl && !editing ? (
                <img
                  src={form.avatarUrl}
                  alt={user.fullName}
                  className="w-16 h-16 rounded-full border-4 border-[#161b22] object-cover"
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-full border-4 border-[#161b22] flex items-center justify-center text-xl font-bold text-white"
                  style={{ background: avatarColor }}
                >
                  {initials}
                </div>
              )}
            </div>
          </div>

          <div className="pt-12 px-6 pb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                {!editing ? (
                  <>
                    <h2 className="text-xl font-bold text-white">{form.fullName}</h2>
                    <p className="text-sm text-white/40">@{user.username}</p>
                  </>
                ) : (
                  <div>
                    <input
                      value={form.fullName}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, fullName: e.target.value }));
                        setErrors((e) => {
                          const n = { ...e };
                          delete n.fullName;
                          return n;
                        });
                      }}
                      className="bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2 text-base font-bold text-white w-full focus:outline-none focus:ring-2 focus:ring-indigo-500/40 mb-1"
                    />
                    {errors.fullName && <p className="text-xs text-rose-400">{errors.fullName}</p>}
                    <p className="text-sm text-white/40 mt-1">@{user.username} (cannot change)</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-medium rounded-lg transition-all border border-white/8"
                  >
                    <Edit3 size={12} />
                    Edit
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
                    >
                      {loading ? (
                        <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Save size={12} />
                      )}
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={loading}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 text-xs font-medium rounded-lg transition-all"
                    >
                      <X size={12} />
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Role badges */}
            <div className="flex flex-wrap gap-2 mb-5">
              {roleBadges.map((badge, i) => (
                <span
                  key={i}
                  className={cn("text-xs px-2.5 py-1 rounded-full border font-medium", badge.color)}
                >
                  {badge.label}
                </span>
              ))}
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap gap-4 text-xs text-white/50 mb-5">
              <span className="flex items-center gap-1.5">
                <AtSign size={12} /> {user.username}
              </span>
              {user.email && (
                <span className="flex items-center gap-1.5">
                  <Mail size={12} /> {user.email}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar size={12} /> Joined {formatDate(user.createdAt)}
              </span>
              {teamName && (
                <span className="flex items-center gap-1.5">
                  <Users size={12} /> {teamName}
                </span>
              )}
            </div>

            {/* Bio */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Bio</p>
              {!editing ? (
                <p className="text-sm text-white/70 leading-relaxed">
                  {form.bio || <span className="italic text-white/30">No bio yet.</span>}
                </p>
              ) : (
                <div>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                    rows={3}
                    maxLength={500}
                    placeholder="Tell the team about yourself…"
                    className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/25 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                  />
                  <div className="flex justify-between mt-1">
                    {errors.bio && <p className="text-xs text-rose-400">{errors.bio}</p>}
                    <p className="text-xs text-white/25 ml-auto">{form.bio.length}/500</p>
                  </div>
                </div>
              )}
            </div>

            {/* Avatar URL */}
            {editing && (
              <div>
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Avatar URL</p>
                <input
                  value={form.avatarUrl}
                  onChange={(e) => setForm((f) => ({ ...f, avatarUrl: e.target.value }))}
                  placeholder="https://example.com/avatar.jpg"
                  className={cn(
                    "w-full bg-[#0d1117] border rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 transition-all",
                    errors.avatarUrl
                      ? "border-rose-500/40 focus:ring-rose-500/30"
                      : "border-white/10 focus:ring-indigo-500/40"
                  )}
                />
                {errors.avatarUrl && <p className="text-xs text-rose-400 mt-1">{errors.avatarUrl}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Account info (read-only) */}
        <div className="bg-[#161b22] border border-white/8 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={14} className="text-white/30" />
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Account Details</h3>
          </div>
          <div className="space-y-3">
            <InfoRow label="User ID" value={user.id} mono />
            <InfoRow label="Username" value={`@${user.username}`} note="Cannot be changed" />
            {user.email && <InfoRow label="Email" value={user.email} note="Cannot be changed" />}
            <InfoRow label="Status" value={user.status} />
            <InfoRow label="Account Role" value={user.role} />
            <InfoRow label="Account Created" value={formatDate(user.createdAt)} />
          </div>
          </div>

          {/* Change Password */}
          <div className="bg-[#161b22] border border-white/8 rounded-2xl p-5">
          <button
            onClick={() => {
              setShowChangePassword(!showChangePassword);
              setPwError(null);
              setPwSuccess(false);
            }}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-2">
              <Lock size={14} className="text-white/30" />
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Change Password</h3>
            </div>
            <ChevronDown
              size={14}
              className={`text-white/30 transition-transform ${showChangePassword ? "rotate-180" : ""}`}
            />
          </button>

          {showChangePassword && (
            <div className="mt-4 space-y-4 border-t border-white/5 pt-4">
              {pwSuccess && (
                <div className="flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 text-sm text-emerald-400">
                  <CheckCircle2 size={15} />
                  Password changed successfully.
                </div>
              )}

              {pwError && (
                <div className="flex items-center gap-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 text-sm text-rose-400">
                  <AlertCircle size={15} />
                  {pwError}
                </div>
              )}

              {/* Current Password */}
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={pwForm.currentPassword}
                    onChange={(e) => setPwForm((f) => ({ ...f, currentPassword: e.target.value }))}
                    placeholder="Enter current password"
                    className="w-full bg-[#0d1117] border border-white/10 rounded-xl pl-3 pr-10 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                  >
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={pwForm.newPassword}
                    onChange={(e) => setPwForm((f) => ({ ...f, newPassword: e.target.value }))}
                    placeholder="Min 6 characters"
                    className="w-full bg-[#0d1117] border border-white/10 rounded-xl pl-3 pr-10 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type={showPw ? "text" : "password"}
                  value={pwForm.confirmPassword}
                  onChange={(e) => setPwForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                  placeholder="Re-enter new password"
                  className="w-full bg-[#0d1117] border border-white/10 rounded-xl pl-3 pr-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              <button
                onClick={handleChangePassword}
                disabled={pwLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                {pwLoading ? (
                  <span className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Lock size={14} />
                )}
                Update Password
              </button>
            </div>
          )}
          </div>
          </div>
    </DashboardShell>
  );
}

function InfoRow({ label, value, note, mono }: { label: string; value: string; note?: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-white/5 last:border-0">
      <div>
        <p className="text-xs text-white/40">{label}</p>
        {note && <p className="text-xs text-white/20 mt-0.5">{note}</p>}
      </div>
      <p className={cn("text-sm text-white text-right", mono ? "font-mono text-xs" : "")}>{value}</p>
    </div>
  );
}
