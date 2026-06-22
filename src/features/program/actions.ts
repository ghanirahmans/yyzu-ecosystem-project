"use server";

import { revalidatePath } from "next/cache";
import { validateActiveUser } from "@/lib/guards";
import { ProgramStatus, ProgramApprovalStatus } from "@prisma/client";
import { programSchema } from "./schema";
import type { ProgramInput } from "./types";
import * as programService from "./service";

export async function actionCreateProgram(data: ProgramInput) {
  try {
    const actor = await validateActiveUser();

    const validation = programSchema.safeParse(data);
    if (!validation.success) {
      return { success: false as const, error: "INVALID_INPUTS" as const };
    }

    const result = await programService.createProgram(actor, validation.data);
    if (result.success) {
      revalidatePath("/dashboard/programs");
    }
    return result;
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "SERVER_ERROR";
    return { success: false as const, error: errMsg };
  }
}

export async function actionUpdateProgram(programId: string, data: ProgramInput) {
  try {
    const actor = await validateActiveUser();

    const validation = programSchema.safeParse(data);
    if (!validation.success) {
      return { success: false as const, error: "INVALID_INPUTS" as const };
    }

    const result = await programService.updateProgram(actor, programId, validation.data);
    if (result.success) {
      revalidatePath("/dashboard/programs");
      revalidatePath(`/dashboard/programs/${programId}`);
    }
    return result;
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "SERVER_ERROR";
    return { success: false as const, error: errMsg };
  }
}

export async function actionUpdateProgramStatus(programId: string, status: ProgramStatus) {
  try {
    const actor = await validateActiveUser();

    const result = await programService.updateProgramStatus(actor, programId, status);
    if (result.success) {
      revalidatePath("/dashboard/programs");
      revalidatePath(`/dashboard/programs/${programId}`);
    }
    return result;
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "SERVER_ERROR";
    return { success: false as const, error: errMsg };
  }
}

export async function actionApproveProgram(programId: string, approvalStatus: ProgramApprovalStatus) {
  try {
    const actor = await validateActiveUser();

    const result = await programService.approveProgram(actor, programId, approvalStatus);
    if (result.success) {
      revalidatePath("/dashboard/programs");
      revalidatePath(`/dashboard/programs/${programId}`);
    }
    return result;
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "SERVER_ERROR";
    return { success: false as const, error: errMsg };
  }
}
