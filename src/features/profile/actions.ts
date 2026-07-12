"use server";

import { revalidatePath } from "next/cache";
import { validateActiveUser } from "@/lib/guards";
import { setSession, getSession } from "@/lib/auth";
import { profileSchema } from "./schema";
import type { ProfileInput } from "./types";
import * as profileService from "./service";

export async function actionUpdateProfile(data: ProfileInput) {
  try {
    const actor = await validateActiveUser();

    const validation = profileSchema.safeParse(data);
    if (!validation.success) {
      return { success: false as const, error: "VALIDATION_FAILED" as const };
    }

    const result = await profileService.updateProfile(actor, validation.data);
    if (!result.success) {
      return result;
    }

    // Update session cookie with new fullName
    const session = await getSession();
    if (session) {
      await setSession({
        ...session,
        fullName: result.updatedUser.fullName,
      });
    }

    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard");

    return { success: true as const };
  } catch (error) {
    console.error("Update profile error:", error);
    return { success: false as const, error: "SERVER_ERROR" as const };
  }
}

export async function actionChangePassword(data: { currentPassword: string; newPassword: string }) {
  try {
    const actor = await validateActiveUser();
    const result = await profileService.changePassword(actor, data);
    if (!result.success) {
      return result;
    }
    revalidatePath("/dashboard/profile");
    return { success: true as const };
  } catch (error) {
    console.error("Change password error:", error);
    return { success: false as const, error: "SERVER_ERROR" as const };
  }
}
