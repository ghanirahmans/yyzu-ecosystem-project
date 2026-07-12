"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Link2,
  Send,
  Info,
  Check,
  X,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  UserMinus,
  UserCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Settings,
  Mail,
  Copy,
  GitBranch,
  BookOpen,
  HardDrive,
  MessageCircle,
  Kanban,
  Notebook,
  Pen,
  Globe,
  Save,
  Crown,
  AlertCircle,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { cn, formatDate, formatDateTime, timeAgo, getInitials, stringToColor, isValidUrl } from "@/lib/utils";
import type { JWTSessionPayload } from "@/lib/auth";
import {
  inviteMemberAction,
  removeMemberAction,
  leaveTeamAction,
  approveJoinRequestAction,
  rejectJoinRequestAction,
  addUsefulLinkAction,
  deleteUsefulLinkAction,
  updateSubmissionAction,
  reviewSubmissionAction,
} from "@/features/team/actions";

type SectionTab = "info" | "members" | "links" | "submission";

type UsefulLinkCategory =
  | "GITHUB"
  | "JIRA"
  | "NOTION"
  | "FIGMA"
  | "DISCORD"
  | "GOOGLE_DRIVE"
  | "DOCUMENTATION"
  | "OTHER";

const CATEGORY_ICON: Record<UsefulLinkCategory, React.ReactNode> = {
  GITHUB: <GitBranch size={14} />,
  JIRA: <Kanban size={14} />,
  NOTION: <Notebook size={14} />,
  FIGMA: <Pen size={14} />,
  DISCORD: <MessageCircle size={14} />,
  GOOGLE_DRIVE: <HardDrive size={14} />,
  DOCUMENTATION: <BookOpen size={14} />,
  OTHER: <Globe size={14} />,
};

const CATEGORY_COLOR: Record<UsefulLinkCategory, string> = {
  GITHUB: "bg-neutral-700/60 text-neutral-300",
  JIRA: "bg-blue-500/15 text-blue-400",
  NOTION: "bg-white/10 text-white/60",
  FIGMA: "bg-orange-500/15 text-orange-400",
  DISCORD: "bg-indigo-500/15 text-indigo-400",
  GOOGLE_DRIVE: "bg-sky-500/15 text-sky-400",
  DOCUMENTATION: "bg-emerald-500/15 text-emerald-400",
  OTHER: "bg-white/8 text-white/50",
};

const CATEGORIES: UsefulLinkCategory[] = [
  "GITHUB",
  "JIRA",
  "NOTION",
  "FIGMA",
  "DISCORD",
  "GOOGLE_DRIVE",
  "DOCUMENTATION",
  "OTHER",
];

const CATEGORY_LABELS: Record<UsefulLinkCategory, string> = {
  GITHUB: "GitHub",
  JIRA: "Jira",
  NOTION: "Notion",
  FIGMA: "Figma",
  DISCORD: "Discord",
  GOOGLE_DRIVE: "Google Drive",
  DOCUMENTATION: "Documentation",
  OTHER: "Other",
};

interface MemberItem {
  role: string;
  joinedAt: Date;
  user: {
    id: string;
    username: string;
    fullName: string;
  };
}

interface JoinRequestItem {
  id: string;
  message: string | null;
  createdAt: Date;
  user: {
    fullName: string;
    username: string;
  };
}

interface OutboundInviteItem {
  id: string;
  expiresAt: Date;
  status: string;
  invitedUser: {
    username: string;
  };
}

interface UsefulLinkItem {
  id: string;
  title: string;
  url: string;
  category: UsefulLinkCategory;
  notes: string | null;
  createdAt: Date;
}

interface SubmissionItem {
  id: string;
  submissionLink: string | null;
  status: string;
  submittedAt: Date | null;
  feedback: string | null;
  reviewedBy: string | null;
  reviewedAt: Date | null;
  createdAt: Date;
}

interface TeamWorkspaceProps {
  team: {
    id: string;
    name: string;
    description: string | null;
    status: string;
    createdAt: Date;
  };
  members: MemberItem[];
  pendingRequests: JoinRequestItem[];
  outboundInvites: OutboundInviteItem[];
  usefulLinks: UsefulLinkItem[];
  submissions: SubmissionItem[];
  userRole: string | null;
  session: JWTSessionPayload;
}

export default function TeamWorkspace({
  team,
  members,
  pendingRequests,
  outboundInvites,
  usefulLinks,
  submissions,
  userRole,
  session,
}: TeamWorkspaceProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SectionTab>("info");
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isLeader = userRole === "TEAM_LEADER";
  const isAdmin = session.role === "SYSTEM_ADMIN";
  const isMentor = session.role === "MENTOR" || session.role === "KETUA_DEWAN_MENTOR";
  const isSuspended = team.status === "SUSPENDED";
  const isArchived = team.status === "ARCHIVED";

  const latestSubmission = submissions.length > 0 ? submissions[0] : null;

  // For Mentor Review feedback
  const [reviewFeedback, setReviewFeedback] = useState("");

  // --- Members Section State ---
  const [inviteUsername, setInviteUsername] = useState("");
  const [inviteSentConfirm, setInviteSentConfirm] = useState<string | null>(null);

  // --- Links Section State ---
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [linkForm, setLinkForm] = useState({ title: "", url: "", category: "GITHUB" as UsefulLinkCategory, notes: "" });
  const [linkErrors, setLinkErrors] = useState<Record<string, string>>({});

  // --- Submission Section State ---
  const [editingSubmission, setEditingSubmission] = useState(false);
  const [submissionUrl, setSubmissionUrl] = useState(latestSubmission?.submissionLink ?? "");
  const [submissionSavedConfirm, setSubmissionSavedConfirm] = useState(false);

  const TABS = [
    { id: "info" as SectionTab, label: "Team Info", icon: <Info size={14} /> },
    {
      id: "members" as SectionTab,
      label: "Members",
      icon: <Users size={14} />,
      badge: isLeader ? pendingRequests.length : 0,
    },
    { id: "links" as SectionTab, label: "Useful Links", icon: <Link2 size={14} />, count: usefulLinks.length },
    {
      id: "submission" as SectionTab,
      label: "Final Project",
      icon: <Send size={14} />,
      status: latestSubmission?.status,
    },
  ];

  // --- handlers ---
  const handleInvite = async () => {
    if (!inviteUsername.trim()) {
      setError("Please enter a username.");
      return;
    }
    setLoadingAction("invite");
    setError(null);
    setInviteSentConfirm(null);
    try {
      const res = await inviteMemberAction(inviteUsername.trim());
      if (res.success) {
        setInviteSentConfirm(inviteUsername.trim());
        setInviteUsername("");
      } else {
        setError(res.error || "Failed to send invitation.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRemoveMember = async (userId: string, memberName: string) => {
    if (!window.confirm(`Are you sure you want to remove ${memberName} from the team?`)) return;
    setLoadingAction(`remove_${userId}`);
    setError(null);
    try {
      const res = await removeMemberAction(userId);
      if (!res.success) setError(res.error || "Failed to remove member.");
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleLeaveTeam = async () => {
    if (!window.confirm("Are you sure you want to leave this team?")) return;
    setLoadingAction("leave");
    setError(null);
    try {
      const res = await leaveTeamAction();
      if (res.success) {
        router.push("/dashboard/teams");
        router.refresh();
      } else {
        setError(res.error || "Failed to leave team.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    setLoadingAction(`approve_${requestId}`);
    setError(null);
    try {
      const res = await approveJoinRequestAction(requestId);
      if (!res.success) setError(res.error || "Failed to approve request.");
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    setLoadingAction(`reject_${requestId}`);
    setError(null);
    try {
      const res = await rejectJoinRequestAction(requestId);
      if (!res.success) setError(res.error || "Failed to reject request.");
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleAddLink = async () => {
    const errs: Record<string, string> = {};
    if (!linkForm.title.trim()) errs.title = "Title is required.";
    if (!linkForm.url.trim()) errs.url = "URL is required.";
    else if (!isValidUrl(linkForm.url)) errs.url = "Please enter a valid URL.";

    if (Object.keys(errs).length > 0) {
      setLinkErrors(errs);
      return;
    }

    setLoadingAction("addLink");
    setError(null);
    try {
      const res = await addUsefulLinkAction(linkForm);
      if (res.success) {
        setLinkForm({ title: "", url: "", category: "GITHUB", notes: "" });
        setLinkErrors({});
        setShowLinkForm(false);
      } else {
        setError(res.error || "Failed to add useful link.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;
    setLoadingAction(`deleteLink_${linkId}`);
    setError(null);
    try {
      const res = await deleteUsefulLinkAction(linkId);
      if (!res.success) setError(res.error || "Failed to delete link.");
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleUpdateSubmission = async () => {
    if (!isValidUrl(submissionUrl)) {
      setError("Please enter a valid submission URL.");
      return;
    }
    setLoadingAction("submission");
    setError(null);
    try {
      const res = await updateSubmissionAction({ submissionLink: submissionUrl });
      if (res.success) {
        setEditingSubmission(false);
        setSubmissionSavedConfirm(true);
        setTimeout(() => setSubmissionSavedConfirm(false), 3000);
      } else {
        setError(res.error || "Failed to update project submission.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleReviewSubmission = async (status: "APPROVED" | "REVISION") => {
    setLoadingAction("review");
    setError(null);
    try {
      const res = await reviewSubmissionAction(team.id, status, reviewFeedback);
      if (res.success) {
        setReviewFeedback("");
        router.refresh();
      } else {
        setError(res.error || "Gagal menyimpan review.");
      }
    } catch {
      setError("Terjadi kesalahan.");
    } finally {
      setLoadingAction(null);
    }
  };

  // Group links by category
  const groupedLinks = CATEGORIES.reduce<Record<string, UsefulLinkItem[]>>((acc, cat) => {
    const catLinks = usefulLinks.filter((l) => l.category === cat);
    if (catLinks.length > 0) acc[cat] = catLinks;
    return acc;
  }, {});

  const leaderObj = members.find((m) => m.role === "TEAM_LEADER");

  return (
    <DashboardShell user={session}>
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Workspace Header */}
        <div className="bg-[#161b22] border border-white/8 rounded-2xl overflow-hidden">
          <div className="h-20 bg-gradient-to-r from-indigo-900/50 via-violet-900/30 to-slate-900/50 relative">
            {isSuspended && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <span className="flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-500/15 border border-amber-500/20 px-3 py-1.5 rounded-full">
                  <AlertTriangle size={12} />
                  Team Suspended — Read-only mode
                </span>
              </div>
            )}
            {isArchived && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <span className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                  <CheckCircle2 size={12} />
                  Team Diarsipkan (Prasasti) — Read-only mode
                </span>
              </div>
            )}
            {!isSuspended && !isArchived && (isMentor || isAdmin) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <span className="flex items-center gap-2 text-xs font-semibold text-cyan-400 bg-cyan-500/15 border border-cyan-500/20 px-3 py-1.5 rounded-full">
                  <Info size={12} />
                  {isMentor ? "Ecosystem Mentor" : "Administrator"} — Reviewer Mode
                </span>
              </div>
            )}
          </div>
          <div className="px-6 pb-5 pt-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <h1 className="text-xl font-bold text-white">{team.name}</h1>
                  {isLeader && (
                    <span className="flex items-center gap-1 text-xs bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full font-medium">
                      <Crown size={9} />
                      Team Leader
                    </span>
                  )}
                </div>
                <p className="text-sm text-white/50">{team.description ?? "No description."}</p>
                <p className="text-xs text-white/25 mt-1.5">
                  Created {formatDate(team.createdAt)} · {members.length} member{members.length !== 1 ? "s" : ""}
                </p>
              </div>
              {(isLeader || isAdmin) && !isSuspended && !isArchived && (
                <Link
                  href="/dashboard/team/settings"
                  className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/8 text-white/60 hover:text-white text-xs font-medium rounded-xl transition-all flex-shrink-0"
                >
                  <Settings size={13} />
                  Settings
                </Link>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 text-sm text-rose-400">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-[#161b22] border border-white/8 rounded-2xl p-1.5">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setError(null);
              }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium transition-all relative cursor-pointer",
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/30 font-semibold"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              {/* Requests Badge */}
              {tab.id === "members" && tab.badge && tab.badge > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
              {/* Links Count */}
              {tab.id === "links" && tab.count && tab.count > 0 && activeTab !== "links" && (
                <span className="text-xs bg-white/10 text-white/40 px-1.5 py-0.5 rounded-full font-normal">
                  {tab.count}
                </span>
              )}
              {/* Submission Status Dot */}
              {tab.id === "submission" && (
                <span
                  className={cn(
                    "w-2 h-2 rounded-full flex-shrink-0",
                    tab.status === "APPROVED"
                      ? "bg-emerald-500"
                      : tab.status === "REVISION"
                      ? "bg-rose-500 animate-pulse"
                      : tab.status === "SUBMITTED"
                      ? "bg-blue-500 animate-pulse"
                      : "bg-amber-500"
                  )}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-64">
          {/* TAB 1: INFO */}
          {activeTab === "info" && (
            <div className="bg-[#161b22] border border-white/8 rounded-2xl p-6 space-y-6">
              <h2 className="font-semibold text-white">Team Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/3 border border-white/5 rounded-xl px-4 py-3">
                  <p className="text-xs text-white/30 mb-1">Team Name</p>
                  <p className="text-sm font-semibold text-white">{team.name}</p>
                </div>
                <div className="bg-white/3 border border-white/5 rounded-xl px-4 py-3">
                  <p className="text-xs text-white/30 mb-1">Status</p>
                  <span
                    className={cn(
                      "text-xs font-semibold px-2.5 py-1 rounded-full inline-block",
                      team.status === "ACTIVE" ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"
                    )}
                  >
                    {team.status}
                  </span>
                </div>
                <div className="bg-white/3 border border-white/5 rounded-xl px-4 py-3">
                  <p className="text-xs text-white/30 mb-1">Team Leader</p>
                  <p className="text-sm font-semibold text-white">{leaderObj?.user.fullName ?? "—"}</p>
                </div>
                <div className="bg-white/3 border border-white/5 rounded-xl px-4 py-3">
                  <p className="text-xs text-white/30 mb-1">Total Members</p>
                  <p className="text-sm font-semibold text-white">
                    {members.length} member{members.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="bg-white/3 border border-white/5 rounded-xl px-4 py-3">
                  <p className="text-xs text-white/30 mb-1">Created</p>
                  <p className="text-sm font-semibold text-white">{formatDate(team.createdAt)}</p>
                </div>
              </div>

              {team.description && (
                <div>
                  <p className="text-xs font-medium text-white/30 uppercase tracking-wider mb-2">Description</p>
                  <p className="text-sm text-white/70 leading-relaxed bg-white/3 rounded-xl px-4 py-3 border border-white/5 whitespace-pre-wrap">
                    {team.description}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MEMBERS */}
          {activeTab === "members" && (
            <div className="space-y-4">
              {/* Member list */}
              <div className="bg-[#161b22] border border-white/8 rounded-2xl p-5">
                <h3 className="font-semibold text-white mb-4">Members ({members.length})</h3>
                <div className="space-y-2.5">
                  {members.map(({ user: mUser, role, joinedAt }) => {
                    const initials = getInitials(mUser.fullName);
                    const color = stringToColor(mUser.username);
                    const isSelf = mUser.id === session.userId;
                    const isMLeader = role === "TEAM_LEADER";
                    const removing = loadingAction === `remove_${mUser.id}`;

                    return (
                      <div
                        key={mUser.id}
                        className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-white/3 transition-colors group"
                      >
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                          style={{ background: color }}
                        >
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-white truncate">{mUser.fullName}</p>
                            {isSelf && <span className="text-xs text-white/30">(you)</span>}
                          </div>
                          <p className="text-xs text-white/40">
                            @{mUser.username} · Joined {timeAgo(joinedAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "text-xs px-2.5 py-1 rounded-full font-medium inline-block border",
                              isMLeader
                                ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/20"
                                : "bg-white/6 text-white/40 border-transparent"
                            )}
                          >
                            {isMLeader ? "Leader" : "Member"}
                          </span>
                          {isLeader && !isMLeader && !isSuspended && !isArchived && (
                            <button
                               disabled={loadingAction !== null}
                               onClick={() => handleRemoveMember(mUser.id, mUser.fullName)}
                               className="opacity-0 group-hover:opacity-100 p-1.5 text-white/25 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all disabled:opacity-30 cursor-pointer"
                               title="Remove member"
                            >
                               {removing ? (
                                 <span className="w-3.5 h-3.5 border border-rose-400/30 border-t-rose-400 rounded-full animate-spin block" />
                               ) : (
                                 <UserMinus size={13} />
                               )}
                            </button>
                          )}
                          {!isLeader && isSelf && !isSuspended && !isArchived && (
                            <button
                               disabled={loadingAction !== null}
                               onClick={handleLeaveTeam}
                               className="opacity-0 group-hover:opacity-100 px-3 py-1.5 text-xs text-white/30 hover:text-rose-400 bg-white/4 hover:bg-rose-500/10 rounded-lg transition-all disabled:opacity-30 cursor-pointer"
                            >
                               {loadingAction === "leave" ? "Leaving…" : "Leave"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Invite Member (Leader only) */}
              {isLeader && !isSuspended && !isArchived && (
                <div className="bg-[#161b22] border border-white/8 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Mail size={15} className="text-indigo-400" />
                    <h3 className="font-semibold text-white">Invite a Member</h3>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">@</span>
                        <input
                          type="text"
                          value={inviteUsername}
                          onChange={(e) => setInviteUsername(e.target.value)}
                          placeholder="username"
                          className="w-full bg-[#0d1117] border border-white/10 rounded-xl pl-7 pr-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                        />
                      </div>
                    </div>
                    <button
                      disabled={loadingAction !== null}
                      onClick={handleInvite}
                      className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors flex-shrink-0 cursor-pointer"
                    >
                      {loadingAction === "invite" ? (
                        <span className="w-4.5 h-4.5 border border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Mail size={14} />
                      )}
                      Invite
                    </button>
                  </div>

                  {inviteSentConfirm && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/8 px-3 py-2 rounded-lg border border-emerald-500/10">
                      <CheckCircle2 size={12} />
                      Invitation sent to @{inviteSentConfirm}
                    </div>
                  )}

                  {outboundInvites.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/6">
                      <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">
                        Pending Invitations
                      </p>
                      <div className="space-y-2">
                        {outboundInvites.map((invite) => (
                          <div key={invite.id} className="flex items-center justify-between text-sm py-1">
                            <span className="text-white/70">@{invite.invitedUser.username}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-white/35">Expires {formatDate(invite.expiresAt)}</span>
                              <span className="text-xs text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 font-medium">
                                Pending
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Join Requests (Leader only) */}
              {isLeader && pendingRequests.length > 0 && !isArchived && (
                <div className="bg-[#161b22] border border-amber-500/15 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 bg-amber-500/15 rounded-full flex items-center justify-center">
                      <Clock size={11} className="text-amber-400" />
                    </div>
                    <h3 className="font-semibold text-white">
                      Join Requests
                      <span className="ml-2 text-xs bg-rose-500/15 text-rose-400 px-2 py-0.5 rounded-full font-medium">
                        {pendingRequests.length} pending
                      </span>
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {pendingRequests.map((req) => {
                      const processing =
                        loadingAction === `approve_${req.id}` || loadingAction === `reject_${req.id}`;
                      return (
                        <div key={req.id} className="bg-white/3 border border-white/6 rounded-xl p-4">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div className="flex items-start gap-3">
                              <div
                                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                                style={{ background: stringToColor(req.user.username) }}
                              >
                                {getInitials(req.user.fullName)}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-white">{req.user.fullName}</p>
                                <p className="text-xs text-white/40">
                                  @{req.user.username} · {timeAgo(req.createdAt)}
                                </p>
                                {req.message && (
                                  <p className="text-xs text-white/60 mt-2 italic bg-white/4 px-3 py-2 rounded-lg border border-white/6">
                                    &quot;{req.message}&quot;
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button
                                disabled={processing}
                                onClick={() => handleApproveRequest(req.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                              >
                                <UserCheck size={12} />
                                Approve
                              </button>
                              <button
                                disabled={processing}
                                onClick={() => handleRejectRequest(req.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/6 hover:bg-rose-500/10 text-white/50 hover:text-rose-400 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                              >
                                <X size={12} />
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: USEFUL LINKS */}
          {activeTab === "links" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">Useful Links</h3>
                  <p className="text-xs text-white/40 mt-0.5">External tools and resources for the team</p>
                </div>
                {isLeader && !isSuspended && !isArchived && (
                  <button
                    onClick={() => setShowLinkForm(!showLinkForm)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl transition-all cursor-pointer",
                      showLinkForm ? "bg-white/10 text-white" : "bg-indigo-600 hover:bg-indigo-500 text-white"
                    )}
                  >
                    {showLinkForm ? <X size={14} /> : <Plus size={14} />}
                    {showLinkForm ? "Cancel" : "Add Link"}
                  </button>
                )}
              </div>

              {showLinkForm && isLeader && !isArchived && (
                <div className="bg-[#161b22] border border-indigo-500/20 rounded-2xl p-5 space-y-4">
                  <h4 className="text-sm font-semibold text-white">New Useful Link</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5">Title *</label>
                      <input
                        value={linkForm.title}
                        onChange={(e) => {
                          setLinkForm((f) => ({ ...f, title: e.target.value }));
                          setLinkErrors((er) => {
                            const n = { ...er };
                            delete n.title;
                            return n;
                          });
                        }}
                        placeholder="Our GitHub Repo"
                        className={cn(
                          "w-full bg-[#0d1117] border rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 transition-all",
                          linkErrors.title
                            ? "border-rose-500/40 focus:ring-rose-500/30"
                            : "border-white/10 focus:ring-indigo-500/40"
                        )}
                      />
                      {linkErrors.title && <p className="text-xs text-rose-400 mt-1">{linkErrors.title}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5">Category *</label>
                      <select
                        value={linkForm.category}
                        onChange={(e) => setLinkForm((f) => ({ ...f, category: e.target.value as UsefulLinkCategory }))}
                        className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all cursor-pointer"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {CATEGORY_LABELS[c]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5">URL *</label>
                    <input
                      value={linkForm.url}
                      onChange={(e) => {
                        setLinkForm((f) => ({ ...f, url: e.target.value }));
                        setLinkErrors((er) => {
                          const n = { ...er };
                          delete n.url;
                          return n;
                        });
                      }}
                      placeholder="https://github.com/your-team/repo"
                      className={cn(
                        "w-full bg-[#0d1117] border rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 transition-all",
                        linkErrors.url ? "border-rose-500/40 focus:ring-rose-500/30" : "border-white/10 focus:ring-indigo-500/40"
                      )}
                    />
                    {linkErrors.url && <p className="text-xs text-rose-400 mt-1">{linkErrors.url}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5">Notes (optional)</label>
                    <input
                      value={linkForm.notes}
                      onChange={(e) => setLinkForm((f) => ({ ...f, notes: e.target.value }))}
                      placeholder="Brief description of this link"
                      className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      disabled={loadingAction !== null}
                      onClick={handleAddLink}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
                    >
                      {loadingAction === "addLink" ? (
                        <span className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin block" />
                      ) : (
                        <Save size={13} />
                      )}
                      Save Link
                    </button>
                    <button
                      onClick={() => {
                        setShowLinkForm(false);
                        setLinkErrors({});
                      }}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 text-sm font-medium rounded-xl transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {usefulLinks.length === 0 ? (
                <div className="bg-[#161b22] border border-white/8 border-dashed rounded-2xl p-10 text-center">
                  <Link2 size={28} className="mx-auto mb-3 text-white/15" />
                  <p className="text-sm text-white/30">No links added yet.</p>
                  {isLeader && !isSuspended && !isArchived && (
                    <p className="text-xs text-white/25 mt-1">
                      Click <strong>Add Link</strong> to store your team&apos;s resources.
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(groupedLinks).map(([category, catLinks]) => (
                    <div key={category} className="bg-[#161b22] border border-white/8 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/6">
                        <span
                          className={cn(
                            "flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full",
                            CATEGORY_COLOR[category as UsefulLinkCategory]
                          )}
                        >
                          {CATEGORY_ICON[category as UsefulLinkCategory]}
                          {CATEGORY_LABELS[category as UsefulLinkCategory]}
                        </span>
                        <span className="text-xs text-white/30">
                          {catLinks.length} link{catLinks.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {catLinks.map((link) => {
                          const deleting = loadingAction === `deleteLink_${link.id}`;
                          return (
                            <div key={link.id} className="flex items-start justify-between gap-3 group py-1">
                              <div className="flex-1 min-w-0">
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm font-medium text-white hover:text-indigo-300 transition-colors group/link"
                                >
                                  {link.title}
                                  <ExternalLink
                                    size={11}
                                    className="opacity-0 group-hover/link:opacity-100 transition-opacity flex-shrink-0"
                                  />
                                </a>
                                {link.notes && <p className="text-xs text-white/45 mt-0.5">{link.notes}</p>}
                              </div>
                              {isLeader && !isSuspended && !isArchived && (
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                  <button
                                    onClick={() => navigator.clipboard.writeText(link.url)}
                                    className="p-1.5 text-white/25 hover:text-white/60 hover:bg-white/5 rounded-lg transition-all cursor-pointer"
                                    title="Copy URL"
                                  >
                                    <Copy size={12} />
                                  </button>
                                  <button
                                    disabled={loadingAction !== null}
                                    onClick={() => handleDeleteLink(link.id)}
                                    className="p-1.5 text-white/25 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer"
                                    title="Delete link"
                                  >
                                    {deleting ? (
                                      <span className="w-3.5 h-3.5 border border-rose-400/30 border-t-rose-400 rounded-full animate-spin block" />
                                    ) : (
                                      <Trash2 size={12} />
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SUBMISSION */}
          {activeTab === "submission" && (
            <div className="bg-[#161b22] border border-white/8 rounded-2xl p-6 space-y-5">
            <div className="space-y-6">
              {isArchived && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl p-5 space-y-2 flex items-start gap-3">
                  <CheckCircle2 className="flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white">Tim Proyek Selesai & Diarsipkan (Prasasti)</h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Proyek tim ini telah dinilai, disetujui oleh Mentor, dan secara resmi diselesaikan. Status saat ini adalah arsip prasasti permanen (read-only) sebagai bukti pencapaian tim.
                    </p>
                  </div>
                </div>
              )}

              {latestSubmission?.status === "REVISION" && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl p-5 space-y-2 flex items-start gap-3">
                  <AlertCircle className="flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white">Butuh Revisi dari Mentor</h4>
                    <p className="text-xs text-white/80 leading-relaxed font-medium bg-white/3 border border-white/5 p-3 rounded-lg mt-1 whitespace-pre-wrap">
                      Feedback: {latestSubmission.feedback || "Tidak ada catatan feedback tambahan."}
                    </p>
                    <p className="text-[11px] text-white/40 mt-2">
                      Harap lakukan perbaikan sesuai petunjuk mentor dan kumpulkan kembali link proyek baru di bawah.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-white">Final Project Submission</h3>
                  <p className="text-xs text-white/40 mt-0.5">
                    Submit the link to your completed project. Only submission links are stored.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full inline-block border",
                      latestSubmission?.status === "APPROVED"
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                        : latestSubmission?.status === "REVISION"
                        ? "bg-rose-500/15 text-rose-400 border-rose-500/20"
                        : latestSubmission?.status === "SUBMITTED"
                        ? "bg-blue-500/15 text-blue-400 border-blue-500/20"
                        : "bg-amber-500/15 text-amber-400 border-amber-500/20"
                    )}
                  >
                    {latestSubmission?.status === "APPROVED" && <CheckCircle2 size={11} />}
                    {latestSubmission?.status === "REVISION" && <AlertCircle size={11} />}
                    {latestSubmission?.status === "SUBMITTED" && <Clock size={11} />}
                    {(!latestSubmission || latestSubmission.status === "NOT_SUBMITTED") && <Clock size={11} />}

                    {latestSubmission?.status === "APPROVED" && "Disetujui"}
                    {latestSubmission?.status === "REVISION" && "Revisi"}
                    {latestSubmission?.status === "SUBMITTED" && "Menunggu Review"}
                    {(!latestSubmission || latestSubmission.status === "NOT_SUBMITTED") && "Belum Dikumpul"}
                  </span>
                </div>
              </div>

              {/* Saved toast */}
              {submissionSavedConfirm && (
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <CheckCircle2 size={14} />
                  Submission link saved successfully.
                </div>
              )}

              {/* Current URL display */}
              {latestSubmission?.status === "SUBMITTED" && latestSubmission.submissionLink && !editingSubmission && (
                <div className="bg-white/3 border border-white/6 rounded-xl p-4">
                  <p className="text-xs font-medium text-white/30 uppercase tracking-wider mb-2">Submission Link</p>
                  <a
                    href={latestSubmission.submissionLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 break-all transition-colors font-medium"
                  >
                    {latestSubmission.submissionLink}
                    <ExternalLink size={12} className="flex-shrink-0" />
                  </a>
                  {latestSubmission.submittedAt && (
                    <p className="text-xs text-white/25 mt-2">
                      Submitted {formatDateTime(latestSubmission.submittedAt)}
                    </p>
                  )}
                </div>
              )}

              {/* Form editing */}
              {isLeader && !isSuspended && !isArchived && (
                <div>
                  {!editingSubmission ? (
                    <button
                      onClick={() => setEditingSubmission(true)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
                    >
                      {latestSubmission?.status === "SUBMITTED" ? <Edit3 size={14} /> : <Send size={14} />}
                      {latestSubmission?.status === "SUBMITTED" ? "Update Submission" : "Submit Project"}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-white/60 mb-1.5">Submission URL *</label>
                        <input
                          type="url"
                          value={submissionUrl}
                          onChange={(e) => setSubmissionUrl(e.target.value)}
                          placeholder="https://github.com/your-team/project"
                          className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                        />
                        <p className="text-xs text-white/25 mt-1.5">
                          Provide a publicly accessible link (e.g. GitHub Repository, Google Drive).
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          disabled={loadingAction === "submission"}
                          onClick={handleUpdateSubmission}
                          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
                        >
                          {loadingAction === "submission" ? (
                            <span className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin block" />
                          ) : (
                            <Save size={13} />
                          )}
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingSubmission(false);
                            setSubmissionUrl(latestSubmission?.submissionLink ?? "");
                          }}
                          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 text-sm font-medium rounded-xl transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Teamless/member view when not submitted */}
              {!isLeader && latestSubmission?.status !== "SUBMITTED" && latestSubmission?.status !== "APPROVED" && (
                <div className="text-center py-8 text-white/30 bg-[#161b22] rounded-2xl border border-dashed border-white/5">
                  <Send size={24} className="mx-auto mb-2 opacity-15" />
                  <p className="text-sm">No project submitted yet.</p>
                  <p className="text-xs mt-1 opacity-60">The Team Leader can submit the final project link here.</p>
                </div>
              )}

              {/* Mentor Review Panel */}
              {((isMentor || isAdmin) && latestSubmission?.status === "SUBMITTED" && !isArchived) && (
                <div className="bg-[#1c1612] border border-amber-500/20 rounded-2xl p-5 space-y-4">
                  <div>
                    <h4 className="font-semibold text-amber-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Settings size={14} /> Panel Penilaian Mentor
                    </h4>
                    <p className="text-xs text-white/40 mt-1">
                      Tinjau submission proyek tim ini. Anda dapat memberikan feedback tertulis dan menentukan apakah proyek ini **Disetujui (Selesai/Arsip)** atau **Butuh Revisi**.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Catatan Review / Feedback</label>
                      <textarea
                        rows={4}
                        value={reviewFeedback}
                        onChange={(e) => setReviewFeedback(e.target.value)}
                        placeholder="Masukkan catatan evaluasi atau instruksi revisi di sini..."
                        className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        disabled={loadingAction === "review"}
                        onClick={() => handleReviewSubmission("APPROVED")}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-600/10"
                      >
                        {loadingAction === "review" ? (
                          <span className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <CheckCircle2 size={12} />
                        )}
                        Approve & Selesaikan Proyek
                      </button>

                      <button
                        disabled={loadingAction === "review"}
                        onClick={() => handleReviewSubmission("REVISION")}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-lg shadow-rose-600/10"
                      >
                        {loadingAction === "review" ? (
                          <span className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <AlertCircle size={12} />
                        )}
                        Minta Revisi
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Submissions History */}
              {submissions.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Riwayat Pengumpulan & Review</h4>
                  <div className="space-y-3.5">
                    {submissions.map((sub, idx) => {
                      const attemptNum = submissions.length - idx;
                      return (
                        <div key={sub.id} className="bg-white/2 border border-white/5 rounded-xl p-4 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-white/60">Percobaan #{attemptNum}</span>
                            <span
                              className={cn(
                                "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border",
                                sub.status === "APPROVED"
                                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                                  : sub.status === "REVISION"
                                  ? "bg-rose-500/15 border-rose-500/30 text-rose-400"
                                  : sub.status === "SUBMITTED"
                                  ? "bg-blue-500/15 border-blue-500/30 text-blue-400"
                                  : "bg-white/5 border-white/10 text-white/40"
                              )}
                            >
                              {sub.status === "SUBMITTED" ? "Menunggu Review" : sub.status === "APPROVED" ? "Disetujui" : sub.status === "REVISION" ? "Revisi" : "Draft"}
                            </span>
                          </div>
                          
                          {sub.submissionLink && (
                            <a
                              href={sub.submissionLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 font-medium break-all"
                            >
                              {sub.submissionLink}
                              <ExternalLink size={11} className="flex-shrink-0" />
                            </a>
                          )}

                          {sub.submittedAt && (
                            <p className="text-[10px] text-white/25">
                              Dikirim pada {formatDateTime(sub.submittedAt)}
                            </p>
                          )}

                          {sub.feedback && (
                            <div className="bg-[#0d1117] border border-white/5 rounded-lg p-3 text-xs space-y-1 mt-1">
                              <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">Catatan Mentor:</p>
                              <p className="text-white/70 whitespace-pre-wrap leading-relaxed">{sub.feedback}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
