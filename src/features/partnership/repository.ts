import { prisma } from "@/lib/prisma";
import { PartnershipType, PartnershipStatus } from "@prisma/client";

export async function dbFindPartnershipDivision() {
  return prisma.division.findUnique({
    where: { name: "PARTNERSHIP" },
  });
}

export async function dbFindDivisionMembership(userId: string, divisionId: string) {
  return prisma.divisionMembership.findFirst({
    where: {
      userId,
      divisionId,
      leftAt: null,
      user: {
        deletedAt: null,
        status: "ACTIVE",
      },
    },
  });
}

export async function dbCreatePartnership(data: {
  name: string;
  type: PartnershipType;
  status: PartnershipStatus;
  contactName: string | null;
  contactInfo: string | null;
  notes: string | null;
  picUserId: string | null;
}) {
  return prisma.partnership.create({
    data,
  });
}

export async function dbUpdatePartnership(
  partnershipId: string,
  data: {
    name: string;
    type: PartnershipType;
    status: PartnershipStatus;
    contactName: string | null;
    contactInfo: string | null;
    notes: string | null;
    picUserId: string | null;
  }
) {
  return prisma.partnership.update({
    where: { id: partnershipId },
    data,
  });
}
