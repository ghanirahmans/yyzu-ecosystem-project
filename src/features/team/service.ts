import { createAuditLog } from "@/lib/audit";
import { UserRole, TeamStatus } from "@prisma/client";
import type { ActiveUser } from "@/lib/guards";
import type { AddUsefulLinkInput, UpdateSubmissionInput } from "./types";
import {
  dbFindTeamById,
  dbFindActiveTeamByName,
  dbCreateTeam,
  dbUpdateTeam,
  dbSoftDeleteTeam,
  dbArchiveTeam,
  dbFindActiveMembership,
  dbFindLeaderMembership,
  dbFindLeaderMembershipInTeam,
  dbFindMembershipInTeam,
  dbLeaveMembership,
  dbTransferLeadership,
  dbFindInvitationById,
  dbFindPendingInvitation,
  dbAcceptInvitation,
  dbRejectInvitation,
  dbExpireInvitation,
  dbCreateInvitation,
  dbFindJoinRequestById,
  dbFindPendingJoinRequest,
  dbCreateJoinRequest,
  dbCancelJoinRequest,
  dbApproveJoinRequest,
  dbRejectJoinRequest,
  dbCreateUsefulLink,
  dbFindUsefulLinkById,
  dbDeleteUsefulLink,
  dbFindOrgUsefulLinks,
  dbFindDivisionUsefulLinks,
  dbFindLatestSubmission,
  dbCreateSubmission,
  dbUpdateSubmission,
  dbReviewSubmission,
  dbFindActiveUserByUsername,
  dbFindDivisionHeadMembership,
} from "./repository";

// ---------------------------------------------------------------------------
// Invitation
// ---------------------------------------------------------------------------

export async function acceptInvitation(
  actor: ActiveUser,
  invitationId: string
): Promise<{ success: true } | { success: false; error: string }> {
  const invitation = await dbFindInvitationById(invitationId);
  if (!invitation || invitation.status !== "PENDING") {
    return { success: false, error: "INVITATION_NOT_FOUND" };
  }

  if (new Date() > invitation.expiresAt) {
    await dbExpireInvitation(invitationId);
    return { success: false, error: "INVITATION_EXPIRED" };
  }

  if (invitation.team.status === TeamStatus.SUSPENDED) {
    return { success: false, error: "TEAM_SUSPENDED" };
  }
  if (invitation.team.status === TeamStatus.ARCHIVED) {
    return { success: false, error: "TEAM_ARCHIVED" };
  }

  const currentMembership = await dbFindActiveMembership(actor.id);
  if (currentMembership) {
    return { success: false, error: "ALREADY_IN_TEAM" };
  }

  await dbAcceptInvitation(invitationId, actor.id, invitation.teamId);
  await createAuditLog(actor.id, "TEAM_INVITE_ACCEPT", "Team", invitation.teamId, { invitationId });

  return { success: true };
}

export async function rejectInvitation(
  actor: ActiveUser,
  invitationId: string
): Promise<{ success: true } | { success: false; error: string }> {
  const invitation = await dbFindInvitationById(invitationId);
  if (!invitation || invitation.status !== "PENDING") {
    return { success: false, error: "INVITATION_NOT_FOUND" };
  }

  await dbRejectInvitation(invitationId);
  await createAuditLog(actor.id, "TEAM_INVITE_REJECT", "Team", invitation.teamId, { invitationId });

  return { success: true };
}

export async function sendJoinRequest(
  actor: ActiveUser,
  teamId: string,
  message?: string
): Promise<{ success: true } | { success: false; error: string }> {
  const team = await dbFindTeamById(teamId);
  if (
    !team ||
    team.status === TeamStatus.SUSPENDED ||
    team.status === TeamStatus.ARCHIVED ||
    team.deletedAt !== null
  ) {
    return { success: false, error: "TEAM_NOT_AVAILABLE" };
  }

  const membership = await dbFindActiveMembership(actor.id);
  if (membership) {
    return { success: false, error: "ALREADY_IN_TEAM" };
  }

  const existingRequest = await dbFindPendingJoinRequest(actor.id);
  if (existingRequest) {
    return { success: false, error: "PENDING_REQUEST_EXISTS" };
  }

  const request = await dbCreateJoinRequest({
    userId: actor.id,
    teamId,
    message: message ?? null,
  });

  await createAuditLog(actor.id, "TEAM_JOIN_REQUEST_SEND", "Team", teamId, { requestId: request.id });

  return { success: true };
}

export async function cancelJoinRequest(
  actor: ActiveUser,
  requestId: string
): Promise<{ success: true } | { success: false; error: string }> {
  const request = await dbFindJoinRequestById(requestId);
  if (!request || request.userId !== actor.id || request.status !== "PENDING") {
    return { success: false, error: "REQUEST_NOT_FOUND" };
  }

  await dbCancelJoinRequest(requestId);
  await createAuditLog(actor.id, "TEAM_JOIN_REQUEST_CANCEL", "Team", request.teamId, { requestId });

  return { success: true };
}

// ---------------------------------------------------------------------------
// Team CRUD
// ---------------------------------------------------------------------------

export async function createTeam(
  actor: ActiveUser,
  data: { name: string; description?: string }
): Promise<{ success: true } | { success: false; error: string }> {
  if (actor.role === UserRole.MENTOR) {
    return { success: false, error: "MENTOR_CANNOT_CREATE_TEAM" };
  }

  const name = data.name.trim();
  if (!name || name.length < 3 || name.length > 60) {
    return { success: false, error: "INVALID_NAME" };
  }

  const description = data.description?.trim() || null;
  if (description && description.length > 500) {
    return { success: false, error: "DESCRIPTION_TOO_LONG" };
  }

  if (actor.role !== UserRole.SYSTEM_ADMIN) {
    const existing = await dbFindActiveMembership(actor.id);
    if (existing) {
      return { success: false, error: "ALREADY_IN_TEAM" };
    }
  }

  const existingTeam = await dbFindActiveTeamByName(name);
  if (existingTeam) {
    return { success: false, error: "TEAM_NAME_TAKEN" };
  }

  const newTeam = await dbCreateTeam({ name, description, createdBy: actor.id });
  await createAuditLog(actor.id, "TEAM_CREATED", "Team", newTeam.id);

  return { success: true };
}

export async function inviteMember(
  actor: ActiveUser,
  username: string
): Promise<{ success: true } | { success: false; error: string }> {
  const callerMembership = await dbFindLeaderMembership(actor.id);
  if (!callerMembership) return { success: false, error: "NOT_TEAM_LEADER" };
  if (callerMembership.team.status === TeamStatus.ARCHIVED) {
    return { success: false, error: "TEAM_ARCHIVED" };
  }
  const teamId = callerMembership.teamId;

  const targetUser = await dbFindActiveUserByUsername(username);
  if (!targetUser) return { success: false, error: "USER_NOT_FOUND" };
  if (targetUser.status !== "ACTIVE") return { success: false, error: "USER_NOT_ACTIVE" };

  const targetMembership = await dbFindActiveMembership(targetUser.id);
  if (targetMembership) return { success: false, error: "USER_ALREADY_IN_TEAM" };

  const existingInvite = await dbFindPendingInvitation(teamId, targetUser.id);
  if (existingInvite) return { success: false, error: "INVITATION_ALREADY_PENDING" };

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const invitation = await dbCreateInvitation({
    teamId,
    invitedBy: actor.id,
    invitedUserId: targetUser.id,
    expiresAt,
  });

  await createAuditLog(actor.id, "MEMBER_INVITED", "Team", teamId, {
    invitedUserId: targetUser.id,
    invitationId: invitation.id,
  });

  return { success: true };
}

export async function removeMember(
  actor: ActiveUser,
  userIdToDelete: string
): Promise<{ success: true } | { success: false; error: string }> {
  const callerMembership = await dbFindLeaderMembership(actor.id);
  if (!callerMembership) return { success: false, error: "NOT_TEAM_LEADER" };
  if (callerMembership.team.status === TeamStatus.ARCHIVED) {
    return { success: false, error: "TEAM_ARCHIVED" };
  }
  const teamId = callerMembership.teamId;

  if (userIdToDelete === actor.id) return { success: false, error: "CANNOT_REMOVE_SELF" };

  const targetMembership = await dbFindMembershipInTeam(userIdToDelete, teamId);
  if (!targetMembership || targetMembership.leftAt !== null) {
    return { success: false, error: "MEMBER_NOT_IN_TEAM" };
  }

  await dbLeaveMembership(targetMembership.id);
  await createAuditLog(actor.id, "TEAM_REMOVE_MEMBER", "Team", teamId, { removedUserId: userIdToDelete });

  return { success: true };
}

export async function leaveTeam(
  actor: ActiveUser
): Promise<{ success: true } | { success: false; error: string }> {
  const membership = await dbFindActiveMembership(actor.id);
  if (!membership) return { success: false, error: "NOT_IN_TEAM" };
  if (membership.team.status === TeamStatus.ARCHIVED) {
    return { success: false, error: "TEAM_ARCHIVED" };
  }

  if (membership.role === "TEAM_LEADER") {
    return { success: false, error: "LEADER_CANNOT_LEAVE" };
  }

  await dbLeaveMembership(membership.id);
  await createAuditLog(actor.id, "TEAM_LEAVE", "Team", membership.teamId);

  return { success: true };
}

export async function approveJoinRequest(
  actor: ActiveUser,
  requestId: string
): Promise<{ success: true } | { success: false; error: string }> {
  const request = await dbFindJoinRequestById(requestId);
  if (!request || request.status !== "PENDING") {
    return { success: false, error: "REQUEST_NOT_FOUND" };
  }

  const callerMembership = await dbFindLeaderMembershipInTeam(actor.id, request.teamId);
  if (!callerMembership) return { success: false, error: "NOT_TEAM_LEADER" };
  if (callerMembership.team.status === TeamStatus.ARCHIVED) {
    return { success: false, error: "TEAM_ARCHIVED" };
  }

  const targetMembership = await dbFindActiveMembership(request.userId);
  if (targetMembership) {
    await dbCancelJoinRequest(requestId);
    return { success: false, error: "USER_ALREADY_IN_TEAM" };
  }

  await dbApproveJoinRequest(requestId, actor.id, request.userId, request.teamId);
  await createAuditLog(actor.id, "MEMBER_JOINED", "Team", request.teamId, {
    joinedUserId: request.userId,
    requestId,
  });

  return { success: true };
}

export async function rejectJoinRequest(
  actor: ActiveUser,
  requestId: string
): Promise<{ success: true } | { success: false; error: string }> {
  const request = await dbFindJoinRequestById(requestId);
  if (!request || request.status !== "PENDING") {
    return { success: false, error: "REQUEST_NOT_FOUND" };
  }

  const callerMembership = await dbFindLeaderMembershipInTeam(actor.id, request.teamId);
  if (!callerMembership) return { success: false, error: "NOT_TEAM_LEADER" };
  if (callerMembership.team.status === TeamStatus.ARCHIVED) {
    return { success: false, error: "TEAM_ARCHIVED" };
  }

  await dbRejectJoinRequest(requestId, actor.id);
  await createAuditLog(actor.id, "TEAM_JOIN_REQUEST_REJECT", "Team", request.teamId, { requestId });

  return { success: true };
}

export async function addUsefulLink(
  actor: ActiveUser,
  data: AddUsefulLinkInput
): Promise<{ success: true } | { success: false; error: string }> {
  const callerMembership = await dbFindLeaderMembership(actor.id);
  if (!callerMembership) return { success: false, error: "NOT_TEAM_LEADER" };
  if (callerMembership.team.status === TeamStatus.ARCHIVED) {
    return { success: false, error: "TEAM_ARCHIVED" };
  }
  const teamId = callerMembership.teamId;

  const link = await dbCreateUsefulLink({
    teamId,
    title: data.title,
    url: data.url,
    category: data.category,
    notes: data.notes ?? null,
    createdBy: actor.id,
  });

  await createAuditLog(actor.id, "TEAM_LINK_ADD", "Team", teamId, {
    linkId: link.id,
    title: data.title,
  });

  return { success: true };
}

export async function deleteUsefulLink(
  actor: ActiveUser,
  linkId: string
): Promise<{ success: true } | { success: false; error: string }> {
  const link = await dbFindUsefulLinkById(linkId);
  if (!link) return { success: false, error: "LINK_NOT_FOUND" };

  if (!link.teamId || link.scope !== "TEAM") {
    return { success: false, error: "INVALID_SCOPE" };
  }

  const callerMembership = await dbFindLeaderMembershipInTeam(actor.id, link.teamId);
  if (!callerMembership) return { success: false, error: "NOT_TEAM_LEADER" };
  if (callerMembership.team.status === TeamStatus.ARCHIVED) {
    return { success: false, error: "TEAM_ARCHIVED" };
  }

  await dbDeleteUsefulLink(linkId);
  await createAuditLog(actor.id, "TEAM_LINK_DELETE", "Team", link.teamId, {
    linkId,
    title: link.title,
  });

  return { success: true };
}

// ---------------------------------------------------------------------------
// Org-wide link management (admin/BPH only)
// ---------------------------------------------------------------------------

export async function addOrgLink(
  actor: ActiveUser,
  data: { title: string; url: string; category: string; notes?: string }
): Promise<{ success: true } | { success: false; error: string }> {
  if (actor.role !== UserRole.SYSTEM_ADMIN && actor.role !== UserRole.BPH) {
    return { success: false, error: "UNAUTHORIZED" };
  }

  const link = await dbCreateUsefulLink({
    scope: "ORG",
    title: data.title,
    url: data.url,
    category: data.category,
    notes: data.notes ?? null,
    createdBy: actor.id,
  });

  await createAuditLog(actor.id, "ORG_LINK_ADD", "UsefulLink", link.id, {
    title: data.title,
  });

  return { success: true };
}

export async function deleteOrgLink(
  actor: ActiveUser,
  linkId: string
): Promise<{ success: true } | { success: false; error: string }> {
  if (actor.role !== UserRole.SYSTEM_ADMIN && actor.role !== UserRole.BPH) {
    return { success: false, error: "UNAUTHORIZED" };
  }

  const link = await dbFindUsefulLinkById(linkId);
  if (!link) return { success: false, error: "LINK_NOT_FOUND" };
  if (link.scope !== "ORG") return { success: false, error: "INVALID_SCOPE" };

  await dbDeleteUsefulLink(linkId);
  await createAuditLog(actor.id, "ORG_LINK_DELETE", "UsefulLink", linkId, {
    title: link.title,
  });

  return { success: true };
}

// ---------------------------------------------------------------------------
// Division link management (admin/BPH/division head)
// ---------------------------------------------------------------------------

export async function addDivisionLink(
  actor: ActiveUser,
  divisionId: string,
  data: { title: string; url: string; category: string; notes?: string }
): Promise<{ success: true } | { success: false; error: string }> {
  // Admin, BPH, or Division HEAD can manage division links
  const isPrivileged = actor.role === UserRole.SYSTEM_ADMIN || actor.role === UserRole.BPH;

  if (!isPrivileged) {
    // Check if they are the division head
    const membership = await dbFindDivisionHeadMembership(actor.id, divisionId);
    if (!membership || membership.role !== "HEAD") {
      return { success: false, error: "UNAUTHORIZED" };
    }
  }

  const link = await dbCreateUsefulLink({
    scope: "DIVISION",
    divisionId,
    title: data.title,
    url: data.url,
    category: data.category,
    notes: data.notes ?? null,
    createdBy: actor.id,
  });

  await createAuditLog(actor.id, "DIVISION_LINK_ADD", "UsefulLink", link.id, {
    divisionId,
    title: data.title,
  });

  return { success: true };
}

export async function deleteDivisionLink(
  actor: ActiveUser,
  linkId: string,
  divisionId: string
): Promise<{ success: true } | { success: false; error: string }> {
  const isPrivileged = actor.role === UserRole.SYSTEM_ADMIN || actor.role === UserRole.BPH;

  if (!isPrivileged) {
    const membership = await dbFindDivisionHeadMembership(actor.id, divisionId);
    if (!membership || membership.role !== "HEAD") {
      return { success: false, error: "UNAUTHORIZED" };
    }
  }

  const link = await dbFindUsefulLinkById(linkId);
  if (!link) return { success: false, error: "LINK_NOT_FOUND" };
  if (link.scope !== "DIVISION") return { success: false, error: "INVALID_SCOPE" };

  await dbDeleteUsefulLink(linkId);
  await createAuditLog(actor.id, "DIVISION_LINK_DELETE", "UsefulLink", linkId, {
    divisionId,
    title: link.title,
  });

  return { success: true };
}

export async function updateSubmission(
  actor: ActiveUser,
  data: UpdateSubmissionInput
): Promise<{ success: true } | { success: false; error: string }> {
  const callerMembership = await dbFindLeaderMembership(actor.id);
  if (!callerMembership) return { success: false, error: "NOT_TEAM_LEADER" };
  if (callerMembership.team.status === TeamStatus.ARCHIVED) {
    return { success: false, error: "TEAM_ARCHIVED" };
  }
  const teamId = callerMembership.teamId;

  const latest = await dbFindLatestSubmission(teamId);
  let submission;

  if (!latest || latest.status === "NOT_SUBMITTED") {
    if (latest) {
      submission = await dbUpdateSubmission(latest.id, {
        submissionLink: data.submissionLink,
        submittedBy: actor.id,
        status: "SUBMITTED",
      });
    } else {
      submission = await dbCreateSubmission({
        teamId,
        submissionLink: data.submissionLink,
        submittedBy: actor.id,
      });
    }
  } else if (latest.status === "SUBMITTED") {
    submission = await dbUpdateSubmission(latest.id, {
      submissionLink: data.submissionLink,
      submittedBy: actor.id,
    });
  } else if (latest.status === "REVISION") {
    submission = await dbCreateSubmission({
      teamId,
      submissionLink: data.submissionLink,
      submittedBy: actor.id,
    });
  } else if (latest.status === "APPROVED") {
    return { success: false, error: "SUBMISSION_ALREADY_APPROVED" };
  }

  if (!submission) {
    return { success: false, error: "SUBMISSION_FAILED" };
  }

  await createAuditLog(actor.id, "TEAM_SUBMISSION", "Team", teamId, {
    submissionId: submission.id,
    link: data.submissionLink,
  });

  return { success: true };
}

export async function updateTeamInfo(
  actor: ActiveUser,
  data: { name: string; description?: string }
): Promise<{ success: true } | { success: false; error: string }> {
  const name = data.name.trim();
  if (!name || name.length < 3 || name.length > 60) {
    return { success: false, error: "INVALID_NAME" };
  }

  const description = data.description?.trim() || null;
  if (description && description.length > 500) {
    return { success: false, error: "DESCRIPTION_TOO_LONG" };
  }

  const callerMembership = await dbFindActiveMembership(actor.id);
  const isLeader = callerMembership?.role === "TEAM_LEADER";
  const isAdmin = actor.role === UserRole.SYSTEM_ADMIN;

  if (!isLeader && !isAdmin) {
    return { success: false, error: "UNAUTHORIZED" };
  }

  const teamId = callerMembership?.teamId;
  if (!teamId) return { success: false, error: "TEAM_NOT_FOUND" };

  if (callerMembership.team.status === TeamStatus.ARCHIVED) {
    return { success: false, error: "TEAM_ARCHIVED" };
  }

  const currentTeam = await dbFindTeamById(teamId);
  if (currentTeam?.name !== name) {
    const existingTeam = await dbFindActiveTeamByName(name);
    if (existingTeam) return { success: false, error: "TEAM_NAME_TAKEN" };
  }

  await dbUpdateTeam(teamId, { name, description });
  const auditMeta: Record<string, string | number | boolean> = { name };
  if (description) auditMeta.description = description;
  await createAuditLog(actor.id, "TEAM_UPDATED", "Team", teamId, auditMeta);

  return { success: true };
}

export async function transferLeadership(
  actor: ActiveUser,
  newLeaderUserId: string
): Promise<{ success: true } | { success: false; error: string }> {
  const callerMembership = await dbFindLeaderMembership(actor.id);
  if (!callerMembership) return { success: false, error: "NOT_TEAM_LEADER" };
  if (callerMembership.team.status === TeamStatus.ARCHIVED) {
    return { success: false, error: "TEAM_ARCHIVED" };
  }
  const teamId = callerMembership.teamId;

  if (newLeaderUserId === actor.id) {
    return { success: false, error: "CANNOT_TRANSFER_TO_SELF" };
  }

  const targetMembership = await dbFindMembershipInTeam(newLeaderUserId, teamId);
  if (!targetMembership || targetMembership.leftAt !== null) {
    return { success: false, error: "MEMBER_NOT_IN_TEAM" };
  }

  await dbTransferLeadership(callerMembership.id, targetMembership.id);
  await createAuditLog(actor.id, "TEAM_LEADERSHIP_TRANSFER", "Team", teamId, { newLeaderUserId });

  return { success: true };
}

export async function deleteTeam(
  actor: ActiveUser,
  confirmName: string
): Promise<{ success: true } | { success: false; error: string }> {
  const callerMembership = await dbFindLeaderMembership(actor.id);
  if (!callerMembership) return { success: false, error: "NOT_TEAM_LEADER" };
  if (callerMembership.team.status === TeamStatus.ARCHIVED) {
    return { success: false, error: "TEAM_ARCHIVED" };
  }
  const teamId = callerMembership.teamId;

  const team = await dbFindTeamById(teamId);
  if (!team) return { success: false, error: "TEAM_NOT_FOUND" };
  if (team.name !== confirmName) return { success: false, error: "CONFIRM_NAME_MISMATCH" };

  await dbSoftDeleteTeam(teamId);
  await createAuditLog(actor.id, "TEAM_DELETED", "Team", teamId, { name: team.name });

  return { success: true };
}

export async function reviewSubmission(
  actor: ActiveUser,
  teamId: string,
  status: "APPROVED" | "REVISION",
  feedback?: string
): Promise<{ success: true } | { success: false; error: string }> {
  const isMentor = actor.role === UserRole.MENTOR || actor.role === UserRole.KETUA_DEWAN_MENTOR;
  const isAdmin = actor.role === UserRole.SYSTEM_ADMIN;
  if (!isMentor && !isAdmin) {
    return { success: false, error: "UNAUTHORIZED" };
  }

  const team = await dbFindTeamById(teamId);
  if (!team) return { success: false, error: "TEAM_NOT_FOUND" };
  if (team.status === TeamStatus.ARCHIVED) {
    return { success: false, error: "TEAM_ALREADY_ARCHIVED" };
  }

  const latestSubmission = await dbFindLatestSubmission(teamId);
  if (!latestSubmission || latestSubmission.status !== "SUBMITTED") {
    return { success: false, error: "NO_ACTIVE_SUBMISSION" };
  }

  await dbReviewSubmission(latestSubmission.id, {
    status,
    feedback: feedback ?? null,
    reviewedBy: actor.id,
  });

  if (status === "APPROVED") {
    await dbArchiveTeam(teamId);
  }

  const auditMeta: Record<string, string | number | boolean> = {
    submissionId: latestSubmission.id,
  };
  if (feedback) auditMeta.feedback = feedback;

  await createAuditLog(
    actor.id,
    status === "APPROVED" ? "TEAM_SUBMISSION_APPROVE" : "TEAM_SUBMISSION_REVISION",
    "Team",
    teamId,
    auditMeta
  );

  return { success: true };
}
