"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";
import { UserRole, DivisionRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== UserRole.SYSTEM_ADMIN) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export async function addDivisionMemberAction(divisionId: string, username: string, role: DivisionRole) {
  try {
    const admin = await requireAdmin();

    const user = await prisma.user.findUnique({
      where: { username, deletedAt: null },
    });

    if (!user) {
      return { success: false, error: "USER_NOT_FOUND" };
    }

    if (user.status !== "ACTIVE") {
      return { success: false, error: "USER_NOT_ACTIVE" };
    }

    // Check if user already in this division
    const existing = await prisma.divisionMembership.findUnique({
      where: { userId_divisionId: { userId: user.id, divisionId } },
    });

    if (existing) {
      if (existing.leftAt === null) {
        return { success: false, error: "USER_ALREADY_IN_DIVISION" };
      } else {
        // Reactivate former membership
        await prisma.divisionMembership.update({
          where: { id: existing.id },
          data: {
            leftAt: null,
            role,
            joinedAt: new Date(),
          },
        });
      }
    } else {
      // Add new membership
      await prisma.divisionMembership.create({
        data: {
          divisionId,
          userId: user.id,
          role,
        },
      });
    }

    await createAuditLog(admin.userId, "DIVISION_MEMBER_ADD", "Division", divisionId, { userId: user.id, role });

    revalidatePath(`/dashboard/divisions/${divisionId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "SERVER_ERROR" };
  }
}

export async function removeDivisionMemberAction(divisionId: string, membershipId: string) {
  try {
    const admin = await requireAdmin();

    const membership = await prisma.divisionMembership.findUnique({
      where: { id: membershipId },
    });

    if (!membership) {
      return { success: false, error: "MEMBERSHIP_NOT_FOUND" };
    }

    await prisma.divisionMembership.update({
      where: { id: membershipId },
      data: { leftAt: new Date() },
    });

    await createAuditLog(admin.userId, "DIVISION_MEMBER_REMOVE", "Division", divisionId, { userId: membership.userId });

    revalidatePath(`/dashboard/divisions/${divisionId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "SERVER_ERROR" };
  }
}

export async function changeDivisionRoleAction(divisionId: string, membershipId: string, role: DivisionRole) {
  try {
    const admin = await requireAdmin();

    const membership = await prisma.divisionMembership.findUnique({
      where: { id: membershipId },
    });

    if (!membership) {
      return { success: false, error: "MEMBERSHIP_NOT_FOUND" };
    }

    await prisma.divisionMembership.update({
      where: { id: membershipId },
      data: { role },
    });

    await createAuditLog(admin.userId, "DIVISION_MEMBER_ROLE_CHANGE", "Division", divisionId, { userId: membership.userId, role });

    revalidatePath(`/dashboard/divisions/${divisionId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "SERVER_ERROR" };
  }
}
