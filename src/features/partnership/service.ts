import { createAuditLog } from "@/lib/audit";
import { UserRole } from "@prisma/client";
import type { ActiveUser } from "@/lib/guards";
import type { PartnershipInput } from "./types";
import {
  dbFindPartnershipDivision,
  dbFindDivisionMembership,
  dbCreatePartnership,
  dbUpdatePartnership,
} from "./repository";

async function verifyPartnershipManager(actor: ActiveUser) {
  if (actor.role === UserRole.KOORDINATOR_UMUM) return;

  const partnershipDiv = await dbFindPartnershipDivision();
  if (partnershipDiv) {
    const membership = await dbFindDivisionMembership(actor.id, partnershipDiv.id);
    if (membership) return;
  }

  throw new Error("UNAUTHORIZED");
}

export async function createPartnership(actor: ActiveUser, data: PartnershipInput) {
  await verifyPartnershipManager(actor);

  const partnership = await dbCreatePartnership({
    name: data.name,
    type: data.type,
    status: data.status,
    contactName: data.contactName || null,
    contactInfo: data.contactInfo || null,
    notes: data.notes || null,
    picUserId: data.picUserId || null,
  });

  await createAuditLog(actor.id, "PARTNERSHIP_CREATE", "Partnership", partnership.id, {
    name: partnership.name,
  });

  return { success: true as const, partnershipId: partnership.id };
}

export async function updatePartnership(actor: ActiveUser, partnershipId: string, data: PartnershipInput) {
  await verifyPartnershipManager(actor);

  await dbUpdatePartnership(partnershipId, {
    name: data.name,
    type: data.type,
    status: data.status,
    contactName: data.contactName || null,
    contactInfo: data.contactInfo || null,
    notes: data.notes || null,
    picUserId: data.picUserId || null,
  });

  await createAuditLog(actor.id, "PARTNERSHIP_UPDATE", "Partnership", partnershipId, {
    name: data.name,
  });

  return { success: true as const };
}
