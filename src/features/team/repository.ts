import { prisma } from "@/lib/prisma";
import {
  TeamRole,
  InvitationStatus,
  RequestStatus,
  TeamStatus,
} from "@prisma/client";
import type {
  TeamBasic,
  MembershipWithTeam,
  InvitationBasic,
  JoinRequestBasic,
  SubmissionBasic,
} from "./types";

// ---------------------------------------------------------------------------
// Team queries
// ---------------------------------------------------------------------------

export async function dbFindTeamById(teamId: string): Promise<TeamBasic | null> {
  return prisma.team.findUnique({ where: { id: teamId } });
}

export async function dbFindActiveTeamByName(name: string): Promise<TeamBasic | null> {
  return prisma.team.findFirst({ where: { name, deletedAt: null } });
}

export async function dbCreateTeam(data: {
  name: string;
  description: string | null;
  createdBy: string;
}): Promise<TeamBasic> {
  return prisma.$transaction(async (tx) => {
    const team = await tx.team.create({
      data: {
        name: data.name,
        description: data.description,
        createdBy: data.createdBy,
      },
    });

    await tx.teamMembership.create({
      data: {
        userId: data.createdBy,
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

    await tx.joinRequest.updateMany({
      where: { userId: data.createdBy, status: RequestStatus.PENDING },
      data: { status: RequestStatus.CANCELLED },
    });

    return team;
  });
}

export async function dbUpdateTeam(
  teamId: string,
  data: { name: string; description: string | null }
): Promise<TeamBasic> {
  return prisma.team.update({ where: { id: teamId }, data });
}

export async function dbSoftDeleteTeam(teamId: string): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const team = await tx.team.findUnique({
      where: { id: teamId },
      select: { name: true },
    });

    if (!team) {
      throw new Error(`Team with ID ${teamId} not found`);
    }

    await tx.team.update({
      where: { id: teamId },
      data: {
        name: `${team.name}_deleted_${Date.now()}`,
        deletedAt: new Date(),
      },
    });

    await tx.teamMembership.updateMany({
      where: { teamId },
      data: { leftAt: new Date() },
    });

    await tx.joinRequest.updateMany({
      where: { teamId, status: RequestStatus.PENDING },
      data: { status: RequestStatus.CANCELLED },
    });
  });
}

export async function dbArchiveTeam(teamId: string): Promise<void> {
  await prisma.team.update({
    where: { id: teamId },
    data: { status: TeamStatus.ARCHIVED },
  });
}

// ---------------------------------------------------------------------------
// Membership queries
// ---------------------------------------------------------------------------

export async function dbFindActiveMembership(userId: string): Promise<MembershipWithTeam | null> {
  return prisma.teamMembership.findFirst({
    where: { userId, leftAt: null },
    include: { team: true },
  });
}

export async function dbFindLeaderMembership(userId: string): Promise<MembershipWithTeam | null> {
  return prisma.teamMembership.findFirst({
    where: { userId, leftAt: null, role: TeamRole.TEAM_LEADER },
    include: { team: true },
  });
}

export async function dbFindLeaderMembershipInTeam(
  userId: string,
  teamId: string
): Promise<MembershipWithTeam | null> {
  return prisma.teamMembership.findFirst({
    where: { userId, teamId, leftAt: null, role: TeamRole.TEAM_LEADER },
    include: { team: true },
  });
}

export async function dbFindMembershipInTeam(
  userId: string,
  teamId: string
): Promise<{ id: string; userId: string; teamId: string; role: TeamRole; leftAt: Date | null } | null> {
  return prisma.teamMembership.findUnique({
    where: { userId_teamId: { userId, teamId } },
  });
}

export async function dbLeaveMembership(membershipId: string): Promise<void> {
  await prisma.teamMembership.update({
    where: { id: membershipId },
    data: { leftAt: new Date() },
  });
}

export async function dbTransferLeadership(
  currentLeaderMembershipId: string,
  newLeaderMembershipId: string
): Promise<void> {
  await prisma.$transaction([
    prisma.teamMembership.update({
      where: { id: currentLeaderMembershipId },
      data: { role: TeamRole.MEMBER },
    }),
    prisma.teamMembership.update({
      where: { id: newLeaderMembershipId },
      data: { role: TeamRole.TEAM_LEADER },
    }),
  ]);
}

export async function dbCancelPendingJoinRequests(userId: string): Promise<void> {
  await prisma.joinRequest.updateMany({
    where: { userId, status: RequestStatus.PENDING },
    data: { status: RequestStatus.CANCELLED },
  });
}

// ---------------------------------------------------------------------------
// Invitation queries
// ---------------------------------------------------------------------------

export async function dbFindInvitationById(invitationId: string): Promise<InvitationBasic | null> {
  return prisma.invitation.findUnique({
    where: { id: invitationId },
    include: { team: true },
  });
}

export async function dbFindPendingInvitation(
  teamId: string,
  invitedUserId: string
): Promise<{ id: string } | null> {
  return prisma.invitation.findFirst({
    where: { teamId, invitedUserId, status: InvitationStatus.PENDING },
    select: { id: true },
  });
}

export async function dbAcceptInvitation(
  invitationId: string,
  userId: string,
  teamId: string
): Promise<void> {
  await prisma.$transaction([
    prisma.invitation.update({
      where: { id: invitationId },
      data: { status: InvitationStatus.ACCEPTED },
    }),
    prisma.teamMembership.create({
      data: { userId, teamId, role: TeamRole.MEMBER },
    }),
    prisma.joinRequest.updateMany({
      where: { userId, status: RequestStatus.PENDING },
      data: { status: RequestStatus.CANCELLED },
    }),
  ]);
}

export async function dbRejectInvitation(invitationId: string): Promise<void> {
  await prisma.invitation.update({
    where: { id: invitationId },
    data: { status: InvitationStatus.REJECTED },
  });
}

export async function dbExpireInvitation(invitationId: string): Promise<void> {
  await prisma.invitation.update({
    where: { id: invitationId },
    data: { status: InvitationStatus.EXPIRED },
  });
}

export async function dbCreateInvitation(data: {
  teamId: string;
  invitedBy: string;
  invitedUserId: string;
  expiresAt: Date;
}): Promise<{ id: string }> {
  return prisma.invitation.create({
    data: { ...data, status: InvitationStatus.PENDING },
    select: { id: true },
  });
}

// ---------------------------------------------------------------------------
// Join request queries
// ---------------------------------------------------------------------------

export async function dbFindJoinRequestById(requestId: string): Promise<JoinRequestBasic | null> {
  return prisma.joinRequest.findUnique({ where: { id: requestId } });
}

export async function dbFindPendingJoinRequest(userId: string): Promise<{ id: string } | null> {
  return prisma.joinRequest.findFirst({
    where: { userId, status: RequestStatus.PENDING },
    select: { id: true },
  });
}

export async function dbCreateJoinRequest(data: {
  userId: string;
  teamId: string;
  message: string | null;
}): Promise<JoinRequestBasic> {
  return prisma.joinRequest.create({
    data: { ...data, status: RequestStatus.PENDING },
  });
}

export async function dbCancelJoinRequest(requestId: string): Promise<void> {
  await prisma.joinRequest.update({
    where: { id: requestId },
    data: { status: RequestStatus.CANCELLED },
  });
}

export async function dbApproveJoinRequest(
  requestId: string,
  processedBy: string,
  userId: string,
  teamId: string
): Promise<void> {
  await prisma.$transaction([
    prisma.joinRequest.update({
      where: { id: requestId },
      data: {
        status: RequestStatus.APPROVED,
        processedBy,
        processedAt: new Date(),
      },
    }),
    prisma.teamMembership.create({
      data: { userId, teamId, role: TeamRole.MEMBER },
    }),
    prisma.joinRequest.updateMany({
      where: { userId, status: RequestStatus.PENDING },
      data: { status: RequestStatus.CANCELLED },
    }),
  ]);
}

export async function dbRejectJoinRequest(requestId: string, processedBy: string): Promise<void> {
  await prisma.joinRequest.update({
    where: { id: requestId },
    data: {
      status: RequestStatus.REJECTED,
      processedBy,
      processedAt: new Date(),
    },
  });
}

// ---------------------------------------------------------------------------
// Useful link queries
// ---------------------------------------------------------------------------

export async function dbCreateUsefulLink(data: {
  teamId?: string;
  scope?: string;
  divisionId?: string;
  title: string;
  url: string;
  category: string;
  notes: string | null;
  createdBy: string;
}): Promise<{ id: string; teamId: string | null; title: string }> {
  return prisma.usefulLink.create({
    data: {
      scope: (data.scope as any) ?? "TEAM",
      teamId: data.teamId ?? null,
      divisionId: data.divisionId ?? null,
      title: data.title,
      url: data.url,
      category: data.category as any,
      notes: data.notes,
      createdBy: data.createdBy,
    },
    select: { id: true, teamId: true, title: true },
  });
}

export async function dbFindUsefulLinkById(
  linkId: string
): Promise<{ id: string; teamId: string | null; title: string; scope: string } | null> {
  return prisma.usefulLink.findUnique({
    where: { id: linkId },
    select: { id: true, teamId: true, title: true, scope: true },
  });
}

export async function dbDeleteUsefulLink(linkId: string): Promise<void> {
  await prisma.usefulLink.delete({ where: { id: linkId } });
}

export async function dbFindOrgUsefulLinks(): Promise<
  Array<{ id: string; title: string; url: string; category: string; notes: string | null; createdAt: Date }>
> {
  return prisma.usefulLink.findMany({
    where: { scope: "ORG" },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, url: true, category: true, notes: true, createdAt: true },
  });
}

export async function dbFindDivisionUsefulLinks(
  divisionId: string
): Promise<
  Array<{ id: string; title: string; url: string; category: string; notes: string | null; createdAt: Date }>
> {
  return prisma.usefulLink.findMany({
    where: { scope: "DIVISION", divisionId },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, url: true, category: true, notes: true, createdAt: true },
  });
}

// ---------------------------------------------------------------------------
// Submission queries
// ---------------------------------------------------------------------------

export async function dbFindLatestSubmission(teamId: string): Promise<SubmissionBasic | null> {
  return prisma.submission.findFirst({
    where: { teamId },
    orderBy: { createdAt: "desc" },
  });
}

export async function dbCreateSubmission(data: {
  teamId: string;
  submissionLink: string;
  submittedBy: string;
}): Promise<SubmissionBasic> {
  return prisma.submission.create({
    data: {
      teamId: data.teamId,
      submissionLink: data.submissionLink,
      status: "SUBMITTED",
      submittedBy: data.submittedBy,
      submittedAt: new Date(),
    },
  });
}

export async function dbUpdateSubmission(
  submissionId: string,
  data: {
    submissionLink: string;
    submittedBy: string;
    status?: string;
  }
): Promise<SubmissionBasic> {
  return prisma.submission.update({
    where: { id: submissionId },
    data: {
      submissionLink: data.submissionLink,
      submittedBy: data.submittedBy,
      submittedAt: new Date(),
      ...(data.status ? { status: data.status as "SUBMITTED" } : {}),
    },
  });
}

export async function dbReviewSubmission(
  submissionId: string,
  data: {
    status: "APPROVED" | "REVISION";
    feedback: string | null;
    reviewedBy: string;
  }
): Promise<void> {
  await prisma.submission.update({
    where: { id: submissionId },
    data: {
      status: data.status,
      feedback: data.feedback,
      reviewedBy: data.reviewedBy,
      reviewedAt: new Date(),
    },
  });
}

// ---------------------------------------------------------------------------
// User queries (read-only, needed for invite flow)
// ---------------------------------------------------------------------------

export async function dbFindActiveUserByUsername(
  username: string
): Promise<{ id: string; status: string } | null> {
  return prisma.user.findUnique({
    where: { username, deletedAt: null },
    select: { id: true, status: true },
  });
}

// ---------------------------------------------------------------------------
// Division membership queries (needed for division link auth)
// ---------------------------------------------------------------------------

export async function dbFindDivisionHeadMembership(
  userId: string,
  divisionId: string
): Promise<{ id: string; role: string } | null> {
  return prisma.divisionMembership.findUnique({
    where: { userId_divisionId: { userId, divisionId } },
    select: { id: true, role: true },
  });
}
