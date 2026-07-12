import { createAuditLog } from "@/lib/audit";
import { UserRole, ProgramStatus, ProgramApprovalStatus } from "@prisma/client";
import type { ActiveUser } from "@/lib/guards";
import type { ProgramInput } from "./types";
import {
  dbFindProgramById,
  dbFindDivisionMembershipsByUser,
  dbFindDivisionMembershipInDivisions,
  dbFindDivisionHeadInDivisions,
  dbCreateProgram,
  dbUpdateProgram,
  dbUpdateProgramStatus,
  dbUpdateProgramApproval,
} from "./repository";

export async function createProgram(actor: ActiveUser, data: ProgramInput) {
  const program = await dbCreateProgram({
    title: data.title,
    description: data.description || null,
    picUserId: data.picUserId || null,
    authorId: actor.id,
    startDate: data.startDate ? new Date(data.startDate) : null,
    endDate: data.endDate ? new Date(data.endDate) : null,
    divisionIds: data.divisionIds,
  });

  await createAuditLog(actor.id, "PROGRAM_CREATE", "Program", program.id, { title: program.title });

  return { success: true as const, programId: program.id };
}

export async function updateProgram(actor: ActiveUser, programId: string, data: ProgramInput) {
  const existing = await dbFindProgramById(programId);
  if (!existing) return { success: false as const, error: "PROGRAM_NOT_FOUND" as const };

  const isAdmin = actor.role === UserRole.KOORDINATOR_UMUM;
  const isAuthor = existing.authorId === actor.id;

  const memberships = await dbFindDivisionMembershipsByUser(actor.id);
  const isAnyDivMember = memberships.length > 0;
  const existingDivisionIds = existing.divisions.map((d) => d.id);
  const isInvolvedDivMember = memberships.some((m) => existingDivisionIds.includes(m.divisionId));

  const canEdit = isAdmin || isAuthor || (
    existingDivisionIds.length === 0 ? isAnyDivMember : isInvolvedDivMember
  );

  if (!canEdit) {
    return { success: false as const, error: "UNAUTHORIZED" as const };
  }

  const isManager = isAdmin || (
    existingDivisionIds.length === 0 ? isAnyDivMember : isInvolvedDivMember
  );

  const updateData: {
    title: string;
    description: string | null;
    picUserId?: string | null;
    startDate?: Date | null;
    endDate?: Date | null;
    divisionIds?: string[];
  } = {
    title: data.title,
    description: data.description || null,
  };

  if (isManager) {
    updateData.picUserId = data.picUserId || null;
    updateData.startDate = data.startDate ? new Date(data.startDate) : null;
    updateData.endDate = data.endDate ? new Date(data.endDate) : null;
    updateData.divisionIds = data.divisionIds;
  }

  await dbUpdateProgram(programId, updateData);
  await createAuditLog(actor.id, "PROGRAM_UPDATE", "Program", programId, { title: data.title });

  return { success: true as const };
}

export async function updateProgramStatus(actor: ActiveUser, programId: string, status: ProgramStatus) {
  const existing = await dbFindProgramById(programId);
  if (!existing) return { success: false as const, error: "PROGRAM_NOT_FOUND" as const };

  if (existing.approvalStatus !== ProgramApprovalStatus.APPROVED) {
    return { success: false as const, error: "PROGRAM_NOT_APPROVED_YET" as const };
  }

  const isAdmin = actor.role === UserRole.KOORDINATOR_UMUM;
  const isAuthor = existing.authorId === actor.id;
  const isPic = existing.picUserId === actor.id;

  let isDivMember = false;
  if (existing.divisions.length > 0) {
    const currentMember = await dbFindDivisionMembershipInDivisions(
      actor.id,
      existing.divisions.map((d) => d.id)
    );
    if (currentMember) isDivMember = true;
  }

  if (!isAdmin && !isAuthor && !isPic && !isDivMember) {
    return { success: false as const, error: "UNAUTHORIZED" as const };
  }

  await dbUpdateProgramStatus(programId, status);
  await createAuditLog(actor.id, "PROGRAM_STATUS_UPDATE", "Program", programId, {
    from: existing.status,
    to: status,
  });

  return { success: true as const };
}

export async function approveProgram(actor: ActiveUser, programId: string, approvalStatus: ProgramApprovalStatus) {
  const program = await dbFindProgramById(programId);
  if (!program) return { success: false as const, error: "PROGRAM_NOT_FOUND" as const };

  const isAdmin = actor.role === UserRole.KOORDINATOR_UMUM;
  let isDivHead = false;
  if (program.divisions.length > 0) {
    const membership = await dbFindDivisionHeadInDivisions(
      actor.id,
      program.divisions.map((d) => d.id)
    );
    isDivHead = !!membership;
  }

  if (!isAdmin && !isDivHead) {
    return { success: false as const, error: "UNAUTHORIZED" as const };
  }

  await dbUpdateProgramApproval(programId, approvalStatus);
  await createAuditLog(
    actor.id,
    "PROGRAM_APPROVAL_UPDATE",
    "Program",
    programId,
    { from: program.approvalStatus, to: approvalStatus }
  );

  return { success: true as const };
}
