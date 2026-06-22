"use server";

import { revalidatePath } from "next/cache";
import { validateActiveUser } from "@/lib/guards";
import { DivisionRole } from "@prisma/client";
import {
  addDivisionMemberSchema,
  removeDivisionMemberSchema,
  changeDivisionRoleSchema,
} from "./schema";
import * as divisionService from "./service";

export async function actionAddDivisionMember(divisionId: string, username: string, role: DivisionRole) {
  try {
    const actor = await validateActiveUser();

    const validation = addDivisionMemberSchema.safeParse({ divisionId, username, role });
    if (!validation.success) {
      return { success: false as const, error: "INVALID_INPUTS" as const };
    }

    const result = await divisionService.addDivisionMember(actor, validation.data);
    if (result.success) {
      revalidatePath(`/dashboard/divisions/${divisionId}`);
    }
    return result;
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "SERVER_ERROR";
    return { success: false as const, error: errMsg };
  }
}

export async function actionRemoveDivisionMember(divisionId: string, membershipId: string) {
  try {
    const actor = await validateActiveUser();

    const validation = removeDivisionMemberSchema.safeParse({ divisionId, membershipId });
    if (!validation.success) {
      return { success: false as const, error: "INVALID_INPUTS" as const };
    }

    const result = await divisionService.removeDivisionMember(actor, validation.data);
    if (result.success) {
      revalidatePath(`/dashboard/divisions/${divisionId}`);
    }
    return result;
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "SERVER_ERROR";
    return { success: false as const, error: errMsg };
  }
}

export async function actionChangeDivisionRole(divisionId: string, membershipId: string, role: DivisionRole) {
  try {
    const actor = await validateActiveUser();

    const validation = changeDivisionRoleSchema.safeParse({ divisionId, membershipId, role });
    if (!validation.success) {
      return { success: false as const, error: "INVALID_INPUTS" as const };
    }

    const result = await divisionService.changeDivisionRole(actor, validation.data);
    if (result.success) {
      revalidatePath(`/dashboard/divisions/${divisionId}`);
    }
    return result;
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "SERVER_ERROR";
    return { success: false as const, error: errMsg };
  }
}
