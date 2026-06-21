"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";
import { UserRole, PartnershipType, PartnershipStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

async function requirePartnershipManager() {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORIZED");
  if (session.role === UserRole.SYSTEM_ADMIN) return session;

  // Check if member of PARTNERSHIP division
  const partnershipDiv = await prisma.division.findUnique({
    where: { name: "PARTNERSHIP" },
  });

  if (partnershipDiv) {
    const membership = await prisma.divisionMembership.findFirst({
      where: {
        userId: session.userId,
        divisionId: partnershipDiv.id,
        leftAt: null,
        user: {
          deletedAt: null,
          status: "ACTIVE",
        },
      },
    });
    if (membership) return session;
  }

  throw new Error("UNAUTHORIZED");
}

export async function createPartnershipAction(data: {
  name: string;
  type: PartnershipType;
  status: PartnershipStatus;
  contactName?: string;
  contactInfo?: string;
  notes?: string;
  picUserId?: string;
}) {
  try {
    const session = await requirePartnershipManager();

    const partnership = await prisma.partnership.create({
      data: {
        name: data.name,
        type: data.type,
        status: data.status,
        contactName: data.contactName || null,
        contactInfo: data.contactInfo || null,
        notes: data.notes || null,
        picUserId: data.picUserId || null,
      },
    });

    await createAuditLog(session.userId, "PARTNERSHIP_CREATE", "Partnership", partnership.id, { name: partnership.name });

    revalidatePath("/dashboard/partnerships");
    return { success: true, partnershipId: partnership.id };
  } catch (error: any) {
    return { success: false, error: error.message || "SERVER_ERROR" };
  }
}

export async function updatePartnershipAction(
  partnershipId: string,
  data: {
    name: string;
    type: PartnershipType;
    status: PartnershipStatus;
    contactName?: string;
    contactInfo?: string;
    notes?: string;
    picUserId?: string;
  }
) {
  try {
    const session = await requirePartnershipManager();

    await prisma.partnership.update({
      where: { id: partnershipId },
      data: {
        name: data.name,
        type: data.type,
        status: data.status,
        contactName: data.contactName || null,
        contactInfo: data.contactInfo || null,
        notes: data.notes || null,
        picUserId: data.picUserId || null,
      },
    });

    await createAuditLog(session.userId, "PARTNERSHIP_UPDATE", "Partnership", partnershipId, { name: data.name });

    revalidatePath("/dashboard/partnerships");
    revalidatePath(`/dashboard/partnerships/${partnershipId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "SERVER_ERROR" };
  }
}
