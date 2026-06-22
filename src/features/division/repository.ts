import { prisma } from "@/lib/prisma";
import { DivisionRole } from "@prisma/client";

export async function dbFindUserRoleAndStatus(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, status: true },
  });
}

export async function dbFindUserByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username, deletedAt: null },
  });
}

export async function dbFindDivisionMembership(userId: string, divisionId: string) {
  return prisma.divisionMembership.findUnique({
    where: { userId_divisionId: { userId, divisionId } },
  });
}

export async function dbFindDivisionMembershipById(membershipId: string) {
  return prisma.divisionMembership.findUnique({
    where: { id: membershipId },
  });
}

export async function dbReactivateDivisionMembership(membershipId: string, role: DivisionRole) {
  return prisma.divisionMembership.update({
    where: { id: membershipId },
    data: {
      leftAt: null,
      role,
      joinedAt: new Date(),
    },
  });
}

export async function dbCreateDivisionMembership(data: {
  divisionId: string;
  userId: string;
  role: DivisionRole;
}) {
  return prisma.divisionMembership.create({
    data: {
      divisionId: data.divisionId,
      userId: data.userId,
      role: data.role,
    },
  });
}

export async function dbSoftDeleteDivisionMembership(membershipId: string) {
  return prisma.divisionMembership.update({
    where: { id: membershipId },
    data: { leftAt: new Date() },
  });
}

export async function dbUpdateDivisionMembershipRole(membershipId: string, role: DivisionRole) {
  return prisma.divisionMembership.update({
    where: { id: membershipId },
    data: { role },
  });
}
