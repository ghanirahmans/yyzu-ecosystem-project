"use server"; // Refresh IDE type diagnostics

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";
import { UserRole, DivisionRole, ProgramStatus, ProgramApprovalStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createProgramAction(data: {
  title: string;
  description?: string;
  divisionIds: string[];
  picUserId?: string;
  startDate?: string;
  endDate?: string;
}) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "UNAUTHORIZED" };
    if (session.status !== "ACTIVE") return { success: false, error: "USER_NOT_ACTIVE" };

    const program = await prisma.program.create({
      data: {
        title: data.title,
        description: data.description || null,
        picUserId: data.picUserId || null,
        authorId: session.userId,
        approvalStatus: ProgramApprovalStatus.PENDING,
        status: ProgramStatus.DRAFT,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        // divisions will be connected after creation
      },
    });

    await prisma.program.update({
      where: { id: program.id },
      data: {
        divisions: {
          connect: data.divisionIds.map((id) => ({ id })),
        },
      },
    });

    await createAuditLog(session.userId, "PROGRAM_CREATE", "Program", program.id, { title: program.title });

    revalidatePath("/dashboard/programs");
    return { success: true, programId: program.id };
  } catch (error: any) {
    return { success: false, error: error.message || "SERVER_ERROR" };
  }
}

export async function updateProgramAction(
  programId: string,
  data: {
    title: string;
    description?: string;
    divisionIds: string[];
    picUserId?: string;
    startDate?: string;
    endDate?: string;
  }
) {
  try {
    const existing = await prisma.program.findUnique({
      where: { id: programId },
      include: { divisions: true },
    });
    if (!existing) return { success: false, error: "PROGRAM_NOT_FOUND" };

    const session = await getSession();
    if (!session) return { success: false, error: "UNAUTHORIZED" };
    
    const isAdmin = session.role === UserRole.SYSTEM_ADMIN;
    const isAuthor = existing.authorId === session.userId;
    
    // Fetch all active division memberships of the logged-in user
    const memberships = await prisma.divisionMembership.findMany({
      where: {
        userId: session.userId,
        leftAt: null,
        user: {
          deletedAt: null,
          status: "ACTIVE",
        },
      },
    });

    const isAnyDivMember = memberships.length > 0;
    const existingDivisionIds = existing.divisions.map((d: { id: string }) => d.id);
    const isInvolvedDivMember = memberships.some((m) => existingDivisionIds.includes(m.divisionId));

    // Can edit if Admin, Author, or Division Member (of involved division, or any if empty)
    const canEdit = isAdmin || isAuthor || (
      existingDivisionIds.length === 0 ? isAnyDivMember : isInvolvedDivMember
    );

    if (!canEdit) {
      return { success: false, error: "UNAUTHORIZED" };
    }

    // Is a manager who can update advanced fields
    const isManager = isAdmin || (
      existingDivisionIds.length === 0 ? isAnyDivMember : isInvolvedDivMember
    );

    const updateData: any = {
      title: data.title,
      description: data.description || null,
    };

    if (isManager) {
      updateData.picUserId = data.picUserId || null;
      updateData.startDate = data.startDate ? new Date(data.startDate) : null;
      updateData.endDate = data.endDate ? new Date(data.endDate) : null;
      
      // Update divisions separately after main update
      await prisma.program.update({
        where: { id: programId },
        data: updateData,
      });
      // Connect updated divisions
      await prisma.program.update({
        where: { id: programId },
        data: {
          divisions: {
            set: data.divisionIds.map((id) => ({ id })),
          },
        },
      });
    } else {
      await prisma.program.update({
        where: { id: programId },
        data: updateData,
      });
    }

    await createAuditLog(session.userId, "PROGRAM_UPDATE", "Program", programId, { title: data.title });

    revalidatePath("/dashboard/programs");
    revalidatePath(`/dashboard/programs/${programId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "SERVER_ERROR" };
  }
}

export async function updateProgramStatusAction(programId: string, status: ProgramStatus) {
  try {
    const existing = await prisma.program.findUnique({
      where: { id: programId },
      include: { divisions: true },
    });
    if (!existing) return { success: false, error: "PROGRAM_NOT_FOUND" };

    const session = await getSession();
    if (!session) return { success: false, error: "UNAUTHORIZED" };

    if (existing.approvalStatus !== ProgramApprovalStatus.APPROVED) {
      return { success: false, error: "PROGRAM_NOT_APPROVED_YET" };
    }

    const isAdmin = session.role === UserRole.SYSTEM_ADMIN;
    const isAuthor = existing.authorId === session.userId;
    const isPic = existing.picUserId === session.userId;
    
    let isDivMember = false;
    if (existing.divisions.length > 0) {
      const currentMember = await prisma.divisionMembership.findFirst({
        where: {
          userId: session.userId,
          divisionId: { in: existing.divisions.map((d) => d.id) },
          leftAt: null,
          user: {
            deletedAt: null,
            status: "ACTIVE",
          },
        },
      });
      if (currentMember) isDivMember = true;
    }

    if (!isAdmin && !isAuthor && !isPic && !isDivMember) {
      return { success: false, error: "UNAUTHORIZED" };
    }

    await prisma.program.update({
      where: { id: programId },
      data: { status },
    });

    await createAuditLog(session.userId, "PROGRAM_STATUS_UPDATE", "Program", programId, { from: existing.status, to: status });

    revalidatePath("/dashboard/programs");
    revalidatePath(`/dashboard/programs/${programId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "SERVER_ERROR" };
  }
}

export async function approveProgramAction(
  programId: string,
  approvalStatus: ProgramApprovalStatus
) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "UNAUTHORIZED" };

    const program = await prisma.program.findUnique({
      where: { id: programId },
      include: { divisions: true },
    });
    if (!program) return { success: false, error: "PROGRAM_NOT_FOUND" };

    const isAdmin = session.role === UserRole.SYSTEM_ADMIN;
    let isDivHead = false;
    if (program.divisions.length > 0) {
      const membership = await prisma.divisionMembership.findFirst({
        where: {
          userId: session.userId,
          divisionId: { in: program.divisions.map((d: { id: string }) => d.id) },
          role: DivisionRole.HEAD,
          leftAt: null,
          user: {
            deletedAt: null,
            status: "ACTIVE",
          },
        },
      });
      isDivHead = !!membership;
    }

    if (!isAdmin && !isDivHead) {
      return { success: false, error: "UNAUTHORIZED" };
    }

    await prisma.program.update({
      where: { id: programId },
      data: { approvalStatus },
    });

    await createAuditLog(
      session.userId,
      "PROGRAM_APPROVAL_UPDATE",
      "Program",
      programId,
      { from: program.approvalStatus, to: approvalStatus }
    );

    revalidatePath("/dashboard/programs");
    revalidatePath(`/dashboard/programs/${programId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "SERVER_ERROR" };
  }
}
