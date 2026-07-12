// ============================================================
// YYZU Admin System — Shared TypeScript Types
// Aligned with domain model: yyzu_admin_system_spec.md
// ============================================================

// ── Enums ────────────────────────────────────────────────────

export type UserStatus = "PENDING_APPROVAL" | "ACTIVE" | "SUSPENDED" | "REJECTED";
export type UserRole = "FOUNDER" | "KOORDINATOR_UMUM" | "KEPALA_DIVISI" | "TALENTA_INTI" | "KETUA_DEWAN_MENTOR" | "MENTOR" | "TALENTA";

export type TeamStatus = "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export type TeamMemberRole = "MEMBER" | "TEAM_LEADER";

export type JoinRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export type InvitationStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED";

export type SubmissionStatus = "NOT_SUBMITTED" | "SUBMITTED" | "APPROVED" | "REVISION";

export type UsefulLinkCategory =
  | "GITHUB"
  | "JIRA"
  | "NOTION"
  | "FIGMA"
  | "DISCORD"
  | "GOOGLE_DRIVE"
  | "DOCUMENTATION"
  | "OTHER";

// ── Core Entities ─────────────────────────────────────────────

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  status: UserStatus;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface Profile {
  id: string;
  userId: string;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  description: string | null;
  status: TeamStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface TeamMembership {
  id: string;
  userId: string;
  teamId: string;
  role: TeamMemberRole;
  joinedAt: string;
  leftAt?: string | null;
}

export interface JoinRequest {
  id: string;
  userId: string;
  teamId: string;
  message: string | null;
  status: JoinRequestStatus;
  processedBy: string | null;
  processedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Invitation {
  id: string;
  teamId: string;
  invitedBy: string;
  invitedUserId: string;
  status: InvitationStatus;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsefulLink {
  id: string;
  teamId: string;
  title: string;
  url: string;
  category: UsefulLinkCategory;
  notes: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  id: string;
  teamId: string;
  submissionLink: string | null;
  status: SubmissionStatus;
  submittedBy: string | null;
  submittedAt: string | null;
  feedback: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

// ── Enriched / View Types ─────────────────────────────────────

/** User profile merged for display */
export interface UserWithProfile extends User {
  profile: Profile;
}

/** Team member enriched with user info */
export interface TeamMemberView {
  membership: TeamMembership;
  user: UserWithProfile;
}

/** Join request enriched with user info */
export interface JoinRequestView {
  request: JoinRequest;
  user: UserWithProfile;
}

/** Invitation enriched with invitee info */
export interface InvitationView {
  invitation: Invitation;
  invitedUser: UserWithProfile;
  invitedByUser: UserWithProfile;
}

/** Full team workspace view */
export interface TeamWorkspaceView {
  team: Team;
  members: TeamMemberView[];
  pendingRequests: JoinRequestView[];
  outboundInvitations: InvitationView[];
  usefulLinks: UsefulLink[];
  submission: Submission;
  currentUserRole: TeamMemberRole;
}

// ── Auth Session ──────────────────────────────────────────────

export interface AuthSession {
  user: UserWithProfile;
  accessToken: string;
}

// ── UI State Helpers ──────────────────────────────────────────

export type AsyncStatus = "idle" | "loading" | "success" | "error";

export interface ApiError {
  code: string;
  message: string;
  field?: string;
}

// ── Useful link category metadata ─────────────────────────────

export const LINK_CATEGORY_META: Record<
  UsefulLinkCategory,
  { label: string; color: string; icon: string }
> = {
  GITHUB: { label: "GitHub", color: "#24292e", icon: "github" },
  JIRA: { label: "Jira", color: "#0052cc", icon: "kanban-square" },
  NOTION: { label: "Notion", color: "#000000", icon: "notebook" },
  FIGMA: { label: "Figma", color: "#f24e1e", icon: "figma" },
  DISCORD: { label: "Discord", color: "#5865f2", icon: "message-circle" },
  GOOGLE_DRIVE: { label: "Google Drive", color: "#4285f4", icon: "hard-drive" },
  DOCUMENTATION: { label: "Docs", color: "#059669", icon: "book-open" },
  OTHER: { label: "Other", color: "#6b7280", icon: "link" },
};
