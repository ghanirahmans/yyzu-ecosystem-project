import { createAuditLog } from "@/lib/audit";
import { UserRole } from "@prisma/client";
import type { ActiveUser } from "@/lib/guards";
import type {
  AddDivisionMemberInput,
  RemoveDivisionMemberInput,
  ChangeDivisionRoleInput,
} from "./types";
import {
  dbFindUserRoleAndStatus,
  dbFindUserByUsername,
  dbFindDivisionMembership,
  dbFindDivisionMembershipById,
  dbFindIsDivisionHead,
  dbReactivateDivisionMembership,
  dbCreateDivisionMembership,
  dbSoftDeleteDivisionMembership,
  dbUpdateDivisionMembershipRole,
} from "./repository";

async function verifyDivisionManager(actorId: string, divisionId: string) {
  const dbUser = await dbFindUserRoleAndStatus(actorId);
  if (!dbUser || dbUser.status !== "ACTIVE") {
    throw new Error("UNAUTHORIZED");
  }

  // SYSTEM_ADMIN can manage any division
  if (dbUser.role === UserRole.SYSTEM_ADMIN) return;

  // BPH can manage if they are HEAD of this division
  if (dbUser.role === UserRole.BPH) {
    const membership = await dbFindIsDivisionHead(actorId, divisionId);
    if (membership?.role === "HEAD") return;
  }

  throw new Error("UNAUTHORIZED");
}

export async function addDivisionMember(actor: ActiveUser, data: AddDivisionMemberInput) {
  await verifyDivisionManager(actor.id, data.divisionId);

  const user = await dbFindUserByUsername(data.username);
  if (!user) {
    return { success: false as const, error: "USER_NOT_FOUND" as const };
  }

  if (user.status !== "ACTIVE") {
    return { success: false as const, error: "USER_NOT_ACTIVE" as const };
  }

  const existing = await dbFindDivisionMembership(user.id, data.divisionId);
  if (existing) {
    if (existing.leftAt === null) {
      return { success: false as const, error: "USER_ALREADY_IN_DIVISION" as const };
    } else {
      await dbReactivateDivisionMembership(existing.id, data.role);
    }
  } else {
    await dbCreateDivisionMembership({
      divisionId: data.divisionId,
      userId: user.id,
      role: data.role,
    });
  }

  await createAuditLog(actor.id, "DIVISION_MEMBER_ADD", "Division", data.divisionId, {
    userId: user.id,
    role: data.role,
  });

  return { success: true as const };
}

export async function removeDivisionMember(actor: ActiveUser, data: RemoveDivisionMemberInput) {
  await verifyDivisionManager(actor.id, data.divisionId);

  const membership = await dbFindDivisionMembershipById(data.membershipId);
  if (!membership) {
    return { success: false as const, error: "MEMBERSHIP_NOT_FOUND" as const };
  }

  await dbSoftDeleteDivisionMembership(data.membershipId);

  await createAuditLog(actor.id, "DIVISION_MEMBER_REMOVE", "Division", data.divisionId, {
    userId: membership.userId,
  });

  return { success: true as const };
}

export async function changeDivisionRole(actor: ActiveUser, data: ChangeDivisionRoleInput) {
  await verifyDivisionManager(actor.id, data.divisionId);

  const membership = await dbFindDivisionMembershipById(data.membershipId);
  if (!membership) {
    return { success: false as const, error: "MEMBERSHIP_NOT_FOUND" as const };
  }

  await dbUpdateDivisionMembershipRole(data.membershipId, data.role);

  await createAuditLog(actor.id, "DIVISION_MEMBER_ROLE_CHANGE", "Division", data.divisionId, {
    userId: membership.userId,
    role: data.role,
  });

  return { success: true as const };
}
