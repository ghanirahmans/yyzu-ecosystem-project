import type { TeamRole, TeamStatus, InvitationStatus, RequestStatus, LinkCategory, LinkScope } from "@prisma/client";

// ---------------------------------------------------------------------------
// Action result wrapper
// ---------------------------------------------------------------------------

export type ActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string };

// ---------------------------------------------------------------------------
// Input types
// ---------------------------------------------------------------------------

export interface CreateTeamInput {
  name: string;
  description?: string;
}

export interface UpdateTeamInfoInput {
  name: string;
  description?: string;
}

export interface AddUsefulLinkInput {
  title: string;
  url: string;
  category: LinkCategory;
  notes?: string;
}

export interface UpdateSubmissionInput {
  submissionLink: string;
}

export interface ReviewSubmissionInput {
  teamId: string;
  status: "APPROVED" | "REVISION";
  feedback?: string;
}

// ---------------------------------------------------------------------------
// Read types (returned from repository)
// ---------------------------------------------------------------------------

export interface TeamBasic {
  id: string;
  name: string;
  description: string | null;
  status: TeamStatus;
  createdBy: string;
  createdAt: Date;
  deletedAt: Date | null;
}

export interface MembershipWithTeam {
  id: string;
  userId: string;
  teamId: string;
  role: TeamRole;
  joinedAt: Date;
  leftAt: Date | null;
  team: TeamBasic;
}

export interface InvitationBasic {
  id: string;
  teamId: string;
  invitedBy: string;
  invitedUserId: string;
  status: InvitationStatus;
  expiresAt: Date;
  team: TeamBasic;
}

export interface JoinRequestBasic {
  id: string;
  userId: string;
  teamId: string;
  message: string | null;
  status: RequestStatus;
  processedBy: string | null;
  processedAt: Date | null;
  createdAt: Date;
}

export interface SubmissionBasic {
  id: string;
  teamId: string;
  submissionLink: string | null;
  status: string;
  submittedBy: string | null;
  submittedAt: Date | null;
  feedback: string | null;
  reviewedBy: string | null;
  reviewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
