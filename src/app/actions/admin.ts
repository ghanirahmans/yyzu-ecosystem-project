"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";
import { UserStatus, UserRole, TeamStatus, TeamRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Helper to check if current user is an admin — queries DB for live role + status verification
async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }

  // Live DB check — never trust JWT payload alone for sensitive operations
  const dbUser = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { role: true, status: true },
  });

  if (!dbUser || dbUser.status !== UserStatus.ACTIVE || dbUser.role !== UserRole.SYSTEM_ADMIN) {
    throw new Error("UNAUTHORIZED");
  }

  return session;
}

export async function approveUserAction(userId: string) {
  try {
    const admin = await requireAdmin();

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.status !== UserStatus.PENDING_APPROVAL) {
      return { success: false, error: "USER_NOT_FOUND_OR_NOT_PENDING" };
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        status: UserStatus.ACTIVE,
        approvedBy: admin.userId,
        approvedAt: new Date(),
      },
    });

    await createAuditLog(admin.userId, "ADMIN_APPROVE_USER", "User", userId);

    revalidatePath("/dashboard/admin/users");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "SERVER_ERROR";
    return { success: false, error: errMsg };
  }
}

export async function rejectUserAction(userId: string) {
  try {
    const admin = await requireAdmin();

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.status !== UserStatus.PENDING_APPROVAL) {
      return { success: false, error: "USER_NOT_FOUND_OR_NOT_PENDING" };
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        status: UserStatus.REJECTED,
        approvedBy: admin.userId,
        approvedAt: new Date(),
      },
    });

    await createAuditLog(admin.userId, "ADMIN_REJECT_USER", "User", userId);

    revalidatePath("/dashboard/admin/users");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "SERVER_ERROR";
    return { success: false, error: errMsg };
  }
}

export async function toggleUserSuspensionAction(userId: string) {
  try {
    const admin = await requireAdmin();

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { success: false, error: "USER_NOT_FOUND" };
    if (user.role === UserRole.SYSTEM_ADMIN) return { success: false, error: "CANNOT_SUSPEND_ADMIN" };

    const nextStatus = user.status === UserStatus.SUSPENDED ? UserStatus.ACTIVE : UserStatus.SUSPENDED;

    await prisma.user.update({
      where: { id: userId },
      data: { status: nextStatus },
    });

    const action = nextStatus === UserStatus.SUSPENDED ? "ADMIN_SUSPEND_USER" : "ADMIN_REACTIVATE_USER";
    await createAuditLog(admin.userId, action, "User", userId);

    revalidatePath("/dashboard/admin/users");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "SERVER_ERROR";
    return { success: false, error: errMsg };
  }
}

export async function toggleTeamSuspensionAction(teamId: string) {
  try {
    const admin = await requireAdmin();

    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) return { success: false, error: "TEAM_NOT_FOUND" };

    if (team.status === TeamStatus.ARCHIVED) {
      return { success: false, error: "TEAM_ARCHIVED_CANNOT_SUSPEND" };
    }
    const nextStatus = team.status === TeamStatus.SUSPENDED ? TeamStatus.ACTIVE : TeamStatus.SUSPENDED;

    await prisma.team.update({
      where: { id: teamId },
      data: { status: nextStatus },
    });

    const action = nextStatus === TeamStatus.SUSPENDED ? "ADMIN_SUSPEND_TEAM" : "ADMIN_UNSUSPEND_TEAM";
    await createAuditLog(admin.userId, action, "Team", teamId);

    revalidatePath("/dashboard/admin/teams");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "SERVER_ERROR";
    return { success: false, error: errMsg };
  }
}

export async function forceDeleteTeamAction(teamId: string) {
  try {
    const admin = await requireAdmin();

    // Fetch team first to get current name for rename
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) return { success: false, error: "TEAM_NOT_FOUND" };

    // Rename team before soft-delete to free up the unique name constraint
    // so the same name can be reused in the future
    await prisma.$transaction([
      prisma.team.update({
        where: { id: teamId },
        data: {
          name: `${team.name}_deleted_${Date.now()}`,
          deletedAt: new Date(),
        },
      }),
      prisma.teamMembership.updateMany({
        where: { teamId },
        data: { leftAt: new Date() },
      }),
      prisma.submission.updateMany({
        where: { teamId },
        data: { updatedAt: new Date() }, // soft delete submission or similar
      }),
    ]);

    await createAuditLog(admin.userId, "ADMIN_FORCE_DELETE_TEAM", "Team", teamId);

    revalidatePath("/dashboard/admin/teams");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "SERVER_ERROR";
    return { success: false, error: errMsg };
  }
}

export async function forceTransferTeamLeadershipAction(teamId: string, newLeaderUserId: string) {
  try {
    const admin = await requireAdmin();

    // Check if new leader is member of the team
    const membership = await prisma.teamMembership.findUnique({
      where: { userId_teamId: { userId: newLeaderUserId, teamId } },
    });

    if (!membership) {
      return { success: false, error: "USER_NOT_IN_TEAM" };
    }

    await prisma.$transaction([
      // Demote current leader
      prisma.teamMembership.updateMany({
        where: { teamId, role: TeamRole.TEAM_LEADER },
        data: { role: TeamRole.MEMBER },
      }),
      // Promote new leader
      prisma.teamMembership.update({
        where: { userId_teamId: { userId: newLeaderUserId, teamId } },
        data: { role: TeamRole.TEAM_LEADER },
      }),
    ]);

    await createAuditLog(admin.userId, "ADMIN_FORCE_TRANSFER_LEADERSHIP", "Team", teamId, { newLeaderUserId });

    revalidatePath("/dashboard/admin/teams");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "SERVER_ERROR";
    return { success: false, error: errMsg };
  }
}
