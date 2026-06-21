// Cleaned team actions file
"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";
import { TeamRole, InvitationStatus, RequestStatus, TeamStatus, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function acceptInvitationAction(invitationId: string) {
  const session = await getSession();
  if (!session) return { success: false, error: "UNAUTHORIZED" };

  try {
    // 1. Find invitation
    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
      include: { team: true },
    });

    if (!invitation || invitation.status !== InvitationStatus.PENDING) {
      return { success: false, error: "INVITATION_NOT_FOUND" };
    }

    if (new Date() > invitation.expiresAt) {
      // Mark as expired
      await prisma.invitation.update({
        where: { id: invitationId },
        data: { status: InvitationStatus.EXPIRED },
      });
      return { success: false, error: "INVITATION_EXPIRED" };
    }

    if (invitation.team.status === TeamStatus.SUSPENDED) {
      return { success: false, error: "TEAM_SUSPENDED" };
    }

    if (invitation.team.status === TeamStatus.ARCHIVED) {
      return { success: false, error: "TEAM_ARCHIVED" };
    }

    // 2. Check if user already in a team
    const currentMembership = await prisma.teamMembership.findFirst({
      where: { userId: session.userId, leftAt: null },
    });
    if (currentMembership) {
      return { success: false, error: "ALREADY_IN_TEAM" };
    }

    // 3. Accept invitation
    await prisma.$transaction([
      // Update invitation status
      prisma.invitation.update({
        where: { id: invitationId },
        data: { status: InvitationStatus.ACCEPTED },
      }),
      // Create team membership
      prisma.teamMembership.create({
        data: {
          userId: session.userId,
          teamId: invitation.teamId,
          role: TeamRole.MEMBER,
        },
      }),
      // Cancel all other join requests for this user
      prisma.joinRequest.updateMany({
        where: { userId: session.userId, status: RequestStatus.PENDING },
        data: { status: RequestStatus.CANCELLED },
      }),
    ]);

    // 4. Log audit
    await createAuditLog(session.userId, "TEAM_INVITE_ACCEPT", "Team", invitation.teamId, { invitationId });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Accept invitation error:", error);
    return { success: false, error: "SERVER_ERROR" };
  }
}

export async function rejectInvitationAction(invitationId: string) {
  const session = await getSession();
  if (!session) return { success: false, error: "UNAUTHORIZED" };

  try {
    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation || invitation.status !== InvitationStatus.PENDING) {
      return { success: false, error: "INVITATION_NOT_FOUND" };
    }

    // Update invitation status
    await prisma.invitation.update({
      where: { id: invitationId },
      data: { status: InvitationStatus.REJECTED },
    });

    // Log audit
    await createAuditLog(session.userId, "TEAM_INVITE_REJECT", "Team", invitation.teamId, { invitationId });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Reject invitation error:", error);
    return { success: false, error: "SERVER_ERROR" };
  }
}

export async function sendJoinRequestAction(teamId: string, message?: string) {
  const session = await getSession();
  if (!session) return { success: false, error: "UNAUTHORIZED" };

  try {
    // 1. Verify team active
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team || team.status === TeamStatus.SUSPENDED || team.status === TeamStatus.ARCHIVED || team.deletedAt !== null) {
      return { success: false, error: "TEAM_NOT_AVAILABLE" };
    }

    // 2. Check current team membership
    const membership = await prisma.teamMembership.findFirst({
      where: { userId: session.userId, leftAt: null },
    });
    if (membership) {
      return { success: false, error: "ALREADY_IN_TEAM" };
    }

    // 3. Check existing pending join request
    const existingRequest = await prisma.joinRequest.findFirst({
      where: { userId: session.userId, status: RequestStatus.PENDING },
    });
    if (existingRequest) {
      return { success: false, error: "PENDING_REQUEST_EXISTS" };
    }

    // 4. Create request
    const request = await prisma.joinRequest.create({
      data: {
        userId: session.userId,
        teamId,
        message: message || null,
        status: RequestStatus.PENDING,
      },
    });

    // 5. Log audit
    await createAuditLog(session.userId, "TEAM_JOIN_REQUEST_SEND", "Team", teamId, { requestId: request.id });

    revalidatePath("/dashboard/teams");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Send join request error:", error);
    return { success: false, error: "SERVER_ERROR" };
  }
}

export async function cancelJoinRequestAction(requestId: string) {
  const session = await getSession();
  if (!session) return { success: false, error: "UNAUTHORIZED" };

  try {
    const request = await prisma.joinRequest.findUnique({
      where: { id: requestId },
    });

    if (!request || request.userId !== session.userId || request.status !== RequestStatus.PENDING) {
      return { success: false, error: "REQUEST_NOT_FOUND" };
    }

    await prisma.joinRequest.update({
      where: { id: requestId },
      data: { status: RequestStatus.CANCELLED },
    });

    await createAuditLog(session.userId, "TEAM_JOIN_REQUEST_CANCEL", "Team", request.teamId, { requestId });

    revalidatePath("/dashboard/teams");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Cancel join request error:", error);
    return { success: false, error: "SERVER_ERROR" };
  }
}

export async function createTeamAction(data: { name: string; description?: string }) {
  const session = await getSession();
  if (!session) return { success: false, error: "UNAUTHORIZED" };
  // Mentor role is not allowed to create a team
  if (session.role === UserRole.MENTOR) {
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

  try {
    // 1. Check if user is already in a team (skip for SYSTEM_ADMIN)
    if (session.role !== UserRole.SYSTEM_ADMIN) {
      const membership = await prisma.teamMembership.findFirst({
        where: { userId: session.userId, leftAt: null },
      });
      if (membership) {
        return { success: false, error: "ALREADY_IN_TEAM" };
      }
    }

    // 2. Check name uniqueness
    const existingTeam = await prisma.team.findFirst({
      where: { name, deletedAt: null },
    });
    if (existingTeam) {
      return { success: false, error: "TEAM_NAME_TAKEN" };
    }

    // 3. Create team, membership, and submission record in transaction
    const newTeam = await prisma.$transaction(async (tx) => {
      const team = await tx.team.create({
        data: {
          name,
          description,
          createdBy: session.userId,
        },
      });

      await tx.teamMembership.create({
        data: {
          userId: session.userId,
          teamId: team.id,
          role: TeamRole.TEAM_LEADER,
        },
      });

      await tx.submission.create({
        data: {
          teamId: team.id,
          status: "NOT_SUBMITTED",
        },
      });

      // Cancel any pending join requests of the user since they are now in a team
      await tx.joinRequest.updateMany({
        where: { userId: session.userId, status: RequestStatus.PENDING },
        data: { status: RequestStatus.CANCELLED },
      });

      return team;
    });

    // 4. Log audit
    await createAuditLog(session.userId, "TEAM_CREATED", "Team", newTeam.id);

    revalidatePath("/dashboard/teams");
    revalidatePath("/dashboard/team");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Create team error:", error);
    return { success: false, error: "SERVER_ERROR" };
  }
}

// --- Remaining actions (inviteMemberAction onward) ---
export async function inviteMemberAction(username: string) {
  const session = await getSession();
  if (!session) return { success: false, error: "UNAUTHORIZED" };

  try {
    // 1. Verify caller is leader
    const callerMembership = await prisma.teamMembership.findFirst({
      where: { userId: session.userId, leftAt: null, role: TeamRole.TEAM_LEADER },
      include: { team: true },
    });
    if (!callerMembership) return { success: false, error: "NOT_TEAM_LEADER" };
    if (callerMembership.team.status === TeamStatus.ARCHIVED) {
      return { success: false, error: "TEAM_ARCHIVED" };
    }
    const teamId = callerMembership.teamId;

    // 2. Find target user
    const targetUser = await prisma.user.findUnique({
      where: { username, deletedAt: null },
    });
    if (!targetUser) return { success: false, error: "USER_NOT_FOUND" };
    if (targetUser.status !== "ACTIVE") return { success: false, error: "USER_NOT_ACTIVE" };

    // 3. Check if user already in a team
    const targetMembership = await prisma.teamMembership.findFirst({
      where: { userId: targetUser.id, leftAt: null },
    });
    if (targetMembership) return { success: false, error: "USER_ALREADY_IN_TEAM" };

    // 4. Check if invite already pending
    const existingInvite = await prisma.invitation.findFirst({
      where: { teamId, invitedUserId: targetUser.id, status: InvitationStatus.PENDING },
    });
    if (existingInvite) return { success: false, error: "INVITATION_ALREADY_PENDING" };

    // 5. Create invite (expires in 7 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invitation = await prisma.invitation.create({
      data: {
        teamId,
        invitedBy: session.userId,
        invitedUserId: targetUser.id,
        expiresAt,
        status: InvitationStatus.PENDING,
      },
    });

    // 6. Log audit
    await createAuditLog(session.userId, "MEMBER_INVITED", "Team", teamId, { invitedUserId: targetUser.id, invitationId: invitation.id });

    revalidatePath("/dashboard/team");
    return { success: true };
  } catch (error) {
    console.error("Invite member error:", error);
    return { success: false, error: "SERVER_ERROR" };
  }
}

export async function removeMemberAction(userIdToDelete: string) {
  const session = await getSession();
  if (!session) return { success: false, error: "UNAUTHORIZED" };

  try {
    // 1. Verify caller is leader
    const callerMembership = await prisma.teamMembership.findFirst({
      where: { userId: session.userId, leftAt: null, role: TeamRole.TEAM_LEADER },
      include: { team: true },
    });
    if (!callerMembership) return { success: false, error: "NOT_TEAM_LEADER" };
    if (callerMembership.team.status === TeamStatus.ARCHIVED) {
      return { success: false, error: "TEAM_ARCHIVED" };
    }
    const teamId = callerMembership.teamId;

    if (userIdToDelete === session.userId) return { success: false, error: "CANNOT_REMOVE_SELF" };

    // 2. Check if target user is in this team
    const targetMembership = await prisma.teamMembership.findUnique({
      where: { userId_teamId: { userId: userIdToDelete, teamId } },
    });
    if (!targetMembership || targetMembership.leftAt !== null) {
      return { success: false, error: "MEMBER_NOT_IN_TEAM" };
    }

    // 3. Remove membership
    await prisma.teamMembership.update({
      where: { id: targetMembership.id },
      data: { leftAt: new Date() },
    });

    // 4. Log audit
    await createAuditLog(session.userId, "TEAM_REMOVE_MEMBER", "Team", teamId, { removedUserId: userIdToDelete });

    revalidatePath("/dashboard/team");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Remove member error:", error);
    return { success: false, error: "SERVER_ERROR" };
  }
}

export async function leaveTeamAction() {
  const session = await getSession();
  if (!session) return { success: false, error: "UNAUTHORIZED" };

  try {
    // 1. Find membership
    const membership = await prisma.teamMembership.findFirst({
      where: { userId: session.userId, leftAt: null },
      include: { team: true },
    });
    if (!membership) return { success: false, error: "NOT_IN_TEAM" };
    if (membership.team.status === TeamStatus.ARCHIVED) {
      return { success: false, error: "TEAM_ARCHIVED" };
    }

    // 2. Prevent leader from leaving
    if (membership.role === TeamRole.TEAM_LEADER) {
      return { success: false, error: "LEADER_CANNOT_LEAVE" };
    }

    // 3. Leave team
    await prisma.teamMembership.update({
      where: { id: membership.id },
      data: { leftAt: new Date() },
    });

    // 4. Log audit
    await createAuditLog(session.userId, "TEAM_LEAVE", "Team", membership.teamId);

    revalidatePath("/dashboard/team");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Leave team error:", error);
    return { success: false, error: "SERVER_ERROR" };
  }
}

export async function approveJoinRequestAction(requestId: string) {
  const session = await getSession();
  if (!session) return { success: false, error: "UNAUTHORIZED" };

  try {
    // 1. Find request
    const request = await prisma.joinRequest.findUnique({
      where: { id: requestId },
    });
    if (!request || request.status !== RequestStatus.PENDING) {
      return { success: false, error: "REQUEST_NOT_FOUND" };
    }

    // 2. Verify caller is leader
    const callerMembership = await prisma.teamMembership.findFirst({
      where: { userId: session.userId, leftAt: null, role: TeamRole.TEAM_LEADER, teamId: request.teamId },
      include: { team: true },
    });
    if (!callerMembership) return { success: false, error: "NOT_TEAM_LEADER" };
    if (callerMembership.team.status === TeamStatus.ARCHIVED) {
      return { success: false, error: "TEAM_ARCHIVED" };
    }

    // 3. Check if target user is already in a team
    const targetMembership = await prisma.teamMembership.findFirst({
      where: { userId: request.userId, leftAt: null },
    });
    if (targetMembership) {
      // Mark request as cancelled/rejected since user is in a team
      await prisma.joinRequest.update({
        where: { id: requestId },
        data: { status: RequestStatus.CANCELLED },
      });
      return { success: false, error: "USER_ALREADY_IN_TEAM" };
    }

    // 4. Approve request in transaction
    await prisma.$transaction([
      prisma.joinRequest.update({
        where: { id: requestId },
        data: {
          status: RequestStatus.APPROVED,
          processedBy: session.userId,
          processedAt: new Date(),
        },
      }),
      prisma.teamMembership.create({
        data: {
          userId: request.userId,
          teamId: request.teamId,
          role: TeamRole.MEMBER,
        },
      }),
      // Cancel all other requests of this user
      prisma.joinRequest.updateMany({
        where: { userId: request.userId, status: RequestStatus.PENDING },
        data: { status: RequestStatus.CANCELLED },
      }),
    ]);

    // 5. Log audit
    await createAuditLog(session.userId, "MEMBER_JOINED", "Team", request.teamId, { joinedUserId: request.userId, requestId });

    revalidatePath("/dashboard/team");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Approve join request error:", error);
    return { success: false, error: "SERVER_ERROR" };
  }
}

export async function rejectJoinRequestAction(requestId: string) {
  const session = await getSession();
  if (!session) return { success: false, error: "UNAUTHORIZED" };

  try {
    const request = await prisma.joinRequest.findUnique({
      where: { id: requestId },
    });
    if (!request || request.status !== RequestStatus.PENDING) {
      return { success: false, error: "REQUEST_NOT_FOUND" };
    }

    // Verify caller is leader
    const callerMembership = await prisma.teamMembership.findFirst({
      where: { userId: session.userId, leftAt: null, role: TeamRole.TEAM_LEADER, teamId: request.teamId },
      include: { team: true },
    });
    if (!callerMembership) return { success: false, error: "NOT_TEAM_LEADER" };
    if (callerMembership.team.status === TeamStatus.ARCHIVED) {
      return { success: false, error: "TEAM_ARCHIVED" };
    }

    // Reject request
    await prisma.joinRequest.update({
      where: { id: requestId },
      data: {
        status: RequestStatus.REJECTED,
        processedBy: session.userId,
        processedAt: new Date(),
      },
    });

    // Log audit
    await createAuditLog(session.userId, "TEAM_JOIN_REQUEST_REJECT", "Team", request.teamId, { requestId });

    revalidatePath("/dashboard/team");
    return { success: true };
  } catch (error) {
    console.error("Reject join request error:", error);
    return { success: false, error: "SERVER_ERROR" };
  }
}

export async function addUsefulLinkAction(data: { title: string; url: string; category: any; notes?: string }) {
  const session = await getSession();
  if (!session) return { success: false, error: "UNAUTHORIZED" };

  try {
    // Verify caller is leader
    const callerMembership = await prisma.teamMembership.findFirst({
      where: { userId: session.userId, leftAt: null, role: TeamRole.TEAM_LEADER },
      include: { team: true },
    });
    if (!callerMembership) return { success: false, error: "NOT_TEAM_LEADER" };
    if (callerMembership.team.status === TeamStatus.ARCHIVED) {
      return { success: false, error: "TEAM_ARCHIVED" };
    }
    const teamId = callerMembership.teamId;

    // Create link
    const link = await prisma.usefulLink.create({
      data: {
        teamId,
        title: data.title,
        url: data.url,
        category: data.category,
        notes: data.notes || null,
        createdBy: session.userId,
      },
    });

    // Log audit
    await createAuditLog(session.userId, "TEAM_LINK_ADD", "Team", teamId, { linkId: link.id, title: data.title });

    revalidatePath("/dashboard/team");
    return { success: true };
  } catch (error) {
    console.error("Add useful link error:", error);
    return { success: false, error: "SERVER_ERROR" };
  }
}

export async function deleteUsefulLinkAction(linkId: string) {
  const session = await getSession();
  if (!session) return { success: false, error: "UNAUTHORIZED" };

  try {
    // Find link
    const link = await prisma.usefulLink.findUnique({
      where: { id: linkId },
    });
    if (!link) return { success: false, error: "LINK_NOT_FOUND" };

    // Verify caller is leader
    const callerMembership = await prisma.teamMembership.findFirst({
      where: { userId: session.userId, leftAt: null, role: TeamRole.TEAM_LEADER, teamId: link.teamId },
      include: { team: true },
    });
    if (!callerMembership) return { success: false, error: "NOT_TEAM_LEADER" };
    if (callerMembership.team.status === TeamStatus.ARCHIVED) {
      return { success: false, error: "TEAM_ARCHIVED" };
    }

    // Delete link
    await prisma.usefulLink.delete({
      where: { id: linkId },
    });

    // Log audit
    await createAuditLog(session.userId, "TEAM_LINK_DELETE", "Team", link.teamId, { linkId, title: link.title });

    revalidatePath("/dashboard/team");
    return { success: true };
  } catch (error) {
    console.error("Delete useful link error:", error);
    return { success: false, error: "SERVER_ERROR" };
  }
}

export async function updateSubmissionAction(data: { submissionLink: string }) {
  const session = await getSession();
  if (!session) return { success: false, error: "UNAUTHORIZED" };

  try {
    // Verify caller is leader
    const callerMembership = await prisma.teamMembership.findFirst({
      where: { userId: session.userId, leftAt: null, role: TeamRole.TEAM_LEADER },
      include: { team: true },
    });
    if (!callerMembership) return { success: false, error: "NOT_TEAM_LEADER" };
    if (callerMembership.team.status === TeamStatus.ARCHIVED) {
      return { success: false, error: "TEAM_ARCHIVED" };
    }
    const teamId = callerMembership.teamId;

    // Find latest submission
    const latestSubmission = await prisma.submission.findFirst({
      where: { teamId },
      orderBy: { createdAt: "desc" },
    });

    let submission = null;
    if (!latestSubmission || latestSubmission.status === "NOT_SUBMITTED") {
      if (latestSubmission) {
        submission = await prisma.submission.update({
          where: { id: latestSubmission.id },
          data: {
            submissionLink: data.submissionLink,
            status: "SUBMITTED",
            submittedBy: session.userId,
            submittedAt: new Date(),
          },
        });
      } else {
        submission = await prisma.submission.create({
          data: {
            teamId,
            submissionLink: data.submissionLink,
            status: "SUBMITTED",
            submittedBy: session.userId,
            submittedAt: new Date(),
          },
        });
      }
    } else if (latestSubmission.status === "SUBMITTED") {
      // Overwrite the current active submission link
      submission = await prisma.submission.update({
        where: { id: latestSubmission.id },
        data: {
          submissionLink: data.submissionLink,
          submittedBy: session.userId,
          submittedAt: new Date(),
        },
      });
    } else if (latestSubmission.status === "REVISION") {
      // Create new submission record for the new attempt
      submission = await prisma.submission.create({
        data: {
          teamId,
          submissionLink: data.submissionLink,
          status: "SUBMITTED",
          submittedBy: session.userId,
          submittedAt: new Date(),
        },
      });
    } else if (latestSubmission.status === "APPROVED") {
      return { success: false, error: "SUBMISSION_ALREADY_APPROVED" };
    }

    if (!submission) {
      return { success: false, error: "SUBMISSION_FAILED" };
    }

    // Log audit
    await createAuditLog(session.userId, "TEAM_SUBMISSION", "Team", teamId, { submissionId: submission.id, link: data.submissionLink });

    revalidatePath("/dashboard/team");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Update submission error:", error);
    return { success: false, error: "SERVER_ERROR" };
  }
}

export async function updateTeamInfoAction(data: { name: string; description?: string }) {
  const session = await getSession();
  if (!session) return { success: false, error: "UNAUTHORIZED" };

  const name = data.name.trim();
  if (!name || name.length < 3 || name.length > 60) {
    return { success: false, error: "INVALID_NAME" };
  }

  const description = data.description?.trim() || null;
  if (description && description.length > 500) {
    return { success: false, error: "DESCRIPTION_TOO_LONG" };
  }

  try {
    // 1. Verify caller is leader or admin
    const callerMembership = await prisma.teamMembership.findFirst({
      where: { userId: session.userId, leftAt: null },
      include: { team: true },
    });

    const isLeader = callerMembership?.role === TeamRole.TEAM_LEADER;
    const isAdmin = session.role === UserRole.SYSTEM_ADMIN;

    if (!isLeader && !isAdmin) {
      return { success: false, error: "UNAUTHORIZED" };
    }

    const teamId = callerMembership?.teamId;
    if (!teamId) return { success: false, error: "TEAM_NOT_FOUND" };

    if (callerMembership.team.status === TeamStatus.ARCHIVED) {
      return { success: false, error: "TEAM_ARCHIVED" };
    }

    // 2. Check team name uniqueness (if name changed)
    const currentTeam = await prisma.team.findUnique({ where: { id: teamId } });
    if (currentTeam?.name !== name) {
      const existingTeam = await prisma.team.findFirst({
        where: { name, deletedAt: null },
      });
      if (existingTeam) return { success: false, error: "TEAM_NAME_TAKEN" };
    }

    // 3. Update team
    await prisma.team.update({
      where: { id: teamId },
      data: {
        name,
        description,
      },
    });

    // 4. Log audit
    await createAuditLog(session.userId, "TEAM_UPDATED", "Team", teamId, { name, description });

    revalidatePath("/dashboard/team");
    revalidatePath("/dashboard/team/settings");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Update team info error:", error);
    return { success: false, error: "SERVER_ERROR" };
  }
}

export async function transferLeadershipAction(newLeaderUserId: string) {
  const session = await getSession();
  if (!session) return { success: false, error: "UNAUTHORIZED" };

  try {
    // 1. Verify caller is leader
    const callerMembership = await prisma.teamMembership.findFirst({
      where: { userId: session.userId, leftAt: null, role: TeamRole.TEAM_LEADER },
      include: { team: true },
    });
    if (!callerMembership) return { success: false, error: "NOT_TEAM_LEADER" };
    if (callerMembership.team.status === TeamStatus.ARCHIVED) {
      return { success: false, error: "TEAM_ARCHIVED" };
    }
    const teamId = callerMembership.teamId;

    if (newLeaderUserId === session.userId) return { success: false, error: "CANNOT_TRANSFER_TO_SELF" };

    // 2. Check if target user is in the team
    const targetMembership = await prisma.teamMembership.findUnique({
      where: { userId_teamId: { userId: newLeaderUserId, teamId } },
    });
    if (!targetMembership || targetMembership.leftAt !== null) {
      return { success: false, error: "MEMBER_NOT_IN_TEAM" };
    }

    // 3. Perform transfer in transaction
    await prisma.$transaction([
      // Demote current leader
      prisma.teamMembership.update({
        where: { id: callerMembership.id },
        data: { role: TeamRole.MEMBER },
      }),
      // Promote new leader
      prisma.teamMembership.update({
        where: { id: targetMembership.id },
        data: { role: TeamRole.TEAM_LEADER },
      }),
    ]);

    // 4. Log audit
    await createAuditLog(session.userId, "TEAM_LEADERSHIP_TRANSFER", "Team", teamId, { newLeaderUserId });

    revalidatePath("/dashboard/team");
    revalidatePath("/dashboard/team/settings");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Transfer leadership error:", error);
    return { success: false, error: "SERVER_ERROR" };
  }
}

export async function deleteTeamAction(confirmName: string) {
  const session = await getSession();
  if (!session) return { success: false, error: "UNAUTHORIZED" };

  try {
    // 1. Verify caller is leader
    const callerMembership = await prisma.teamMembership.findFirst({
      where: { userId: session.userId, leftAt: null, role: TeamRole.TEAM_LEADER },
      include: { team: true },
    });
    if (!callerMembership) return { success: false, error: "NOT_TEAM_LEADER" };
    if (callerMembership.team.status === TeamStatus.ARCHIVED) {
      return { success: false, error: "TEAM_ARCHIVED" };
    }
    const teamId = callerMembership.teamId;

    // 2. Load team to check name matching
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) return { success: false, error: "TEAM_NOT_FOUND" };
    if (team.name !== confirmName) return { success: false, error: "CONFIRM_NAME_MISMATCH" };

    // 3. Soft delete team and memberships
    await prisma.$transaction([
      prisma.team.update({
        where: { id: teamId },
        data: { deletedAt: new Date() },
      }),
      prisma.teamMembership.updateMany({
        where: { teamId },
        data: { leftAt: new Date() },
      }),
      prisma.joinRequest.updateMany({
        where: { teamId, status: RequestStatus.PENDING },
        data: { status: RequestStatus.CANCELLED },
      }),
    ]);

    // 4. Log audit
    await createAuditLog(session.userId, "TEAM_DELETED", "Team", teamId, { name: team.name });

    revalidatePath("/dashboard/teams");
    revalidatePath("/dashboard/team");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Delete team error:", error);
    return { success: false, error: "SERVER_ERROR" };
  }
}

export async function reviewSubmissionAction(
  teamId: string,
  status: "APPROVED" | "REVISION",
  feedback?: string
) {
  const session = await getSession();
  if (!session) return { success: false, error: "UNAUTHORIZED" };

  // Only MENTOR or SYSTEM_ADMIN can review
  const isMentor = session.role === UserRole.MENTOR;
  const isAdmin = session.role === UserRole.SYSTEM_ADMIN;
  if (!isMentor && !isAdmin) {
    return { success: false, error: "UNAUTHORIZED" };
  }

  try {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });
    if (!team) return { success: false, error: "TEAM_NOT_FOUND" };
    if (team.status === TeamStatus.ARCHIVED) {
      return { success: false, error: "TEAM_ALREADY_ARCHIVED" };
    }

    // Find the latest submission for this team
    const latestSubmission = await prisma.submission.findFirst({
      where: { teamId },
      orderBy: { createdAt: "desc" },
    });

    if (!latestSubmission || latestSubmission.status !== "SUBMITTED") {
      return { success: false, error: "NO_ACTIVE_SUBMISSION" };
    }

    // Update the submission with review details
    await prisma.submission.update({
      where: { id: latestSubmission.id },
      data: {
        status: status as any,
        feedback: feedback || null,
        reviewedBy: session.userId,
        reviewedAt: new Date(),
      },
    });

    // If approved, archive the team
    if (status === "APPROVED") {
      await prisma.team.update({
        where: { id: teamId },
        data: { status: TeamStatus.ARCHIVED },
      });
    }

    // Log audit
    await createAuditLog(
      session.userId,
      status === "APPROVED" ? "TEAM_SUBMISSION_APPROVE" : "TEAM_SUBMISSION_REVISION",
      "Team",
      teamId,
      { submissionId: latestSubmission.id, feedback }
    );

    revalidatePath("/dashboard/team");
    revalidatePath(`/dashboard/teams/${teamId}`);
    revalidatePath("/dashboard/teams");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Review submission error:", error);
    return { success: false, error: "SERVER_ERROR" };
  }
}
