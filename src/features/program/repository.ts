import { prisma } from "@/lib/prisma";
import { Prisma, ProgramStatus, ProgramApprovalStatus, DivisionRole } from "@prisma/client";

export async function dbFindProgramById(programId: string) {
  return prisma.program.findUnique({
    where: { id: programId },
    include: { divisions: true },
  });
}

export async function dbFindDivisionMembershipsByUser(userId: string) {
  return prisma.divisionMembership.findMany({
    where: {
      userId,
      leftAt: null,
      user: {
        deletedAt: null,
        status: "ACTIVE",
      },
    },
  });
}

export async function dbFindDivisionMembershipInDivisions(userId: string, divisionIds: string[]) {
  return prisma.divisionMembership.findFirst({
    where: {
      userId,
      divisionId: { in: divisionIds },
      leftAt: null,
      user: {
        deletedAt: null,
        status: "ACTIVE",
      },
    },
  });
}

export async function dbFindDivisionHeadInDivisions(userId: string, divisionIds: string[]) {
  return prisma.divisionMembership.findFirst({
    where: {
      userId,
      divisionId: { in: divisionIds },
      role: DivisionRole.HEAD,
      leftAt: null,
      user: {
        deletedAt: null,
        status: "ACTIVE",
      },
    },
  });
}

export async function dbCreateProgram(data: {
  title: string;
  description: string | null;
  picUserId: string | null;
  authorId: string;
  startDate: Date | null;
  endDate: Date | null;
  divisionIds: string[];
}) {
  return prisma.$transaction(async (tx) => {
    const program = await tx.program.create({
      data: {
        title: data.title,
        description: data.description,
        picUserId: data.picUserId,
        authorId: data.authorId,
        approvalStatus: ProgramApprovalStatus.PENDING,
        status: ProgramStatus.DRAFT,
        startDate: data.startDate,
        endDate: data.endDate,
      },
    });

    await tx.program.update({
      where: { id: program.id },
      data: {
        divisions: {
          connect: data.divisionIds.map((id) => ({ id })),
        },
      },
    });

    return program;
  });
}

export async function dbUpdateProgram(
  programId: string,
  data: {
    title: string;
    description: string | null;
    picUserId?: string | null;
    startDate?: Date | null;
    endDate?: Date | null;
    divisionIds?: string[];
  }
) {
  return prisma.$transaction(async (tx) => {
    const updateData: Prisma.ProgramUpdateInput = {
      title: data.title,
      description: data.description,
    };

    if (data.picUserId !== undefined) {
      updateData.pic = data.picUserId
        ? { connect: { id: data.picUserId } }
        : { disconnect: true };
    }
    if (data.startDate !== undefined) updateData.startDate = data.startDate;
    if (data.endDate !== undefined) updateData.endDate = data.endDate;

    const program = await tx.program.update({
      where: { id: programId },
      data: updateData,
    });

    if (data.divisionIds !== undefined) {
      await tx.program.update({
        where: { id: programId },
        data: {
          divisions: {
            set: data.divisionIds.map((id) => ({ id })),
          },
        },
      });
    }

    return program;
  });
}

export async function dbUpdateProgramStatus(programId: string, status: ProgramStatus) {
  return prisma.program.update({
    where: { id: programId },
    data: { status },
  });
}

export async function dbUpdateProgramApproval(programId: string, approvalStatus: ProgramApprovalStatus) {
  return prisma.program.update({
    where: { id: programId },
    data: { approvalStatus },
  });
}
