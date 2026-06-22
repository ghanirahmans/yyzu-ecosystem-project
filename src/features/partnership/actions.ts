"use server";

import { revalidatePath } from "next/cache";
import { validateActiveUser } from "@/lib/guards";
import { partnershipSchema } from "./schema";
import type { PartnershipInput } from "./types";
import * as partnershipService from "./service";

export async function actionCreatePartnership(data: PartnershipInput) {
  try {
    const actor = await validateActiveUser();

    const validation = partnershipSchema.safeParse(data);
    if (!validation.success) {
      return { success: false as const, error: "INVALID_INPUTS" as const };
    }

    const result = await partnershipService.createPartnership(actor, validation.data);
    if (result.success) {
      revalidatePath("/dashboard/partnerships");
    }
    return result;
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "SERVER_ERROR";
    return { success: false as const, error: errMsg };
  }
}

export async function actionUpdatePartnership(partnershipId: string, data: PartnershipInput) {
  try {
    const actor = await validateActiveUser();

    const validation = partnershipSchema.safeParse(data);
    if (!validation.success) {
      return { success: false as const, error: "INVALID_INPUTS" as const };
    }

    const result = await partnershipService.updatePartnership(actor, partnershipId, validation.data);
    if (result.success) {
      revalidatePath("/dashboard/partnerships");
      revalidatePath(`/dashboard/partnerships/${partnershipId}`);
    }
    return result;
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "SERVER_ERROR";
    return { success: false as const, error: errMsg };
  }
}
