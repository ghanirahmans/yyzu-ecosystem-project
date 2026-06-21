"use server";

import { prisma } from "@/lib/prisma";
import { getSession, setSession } from "@/lib/auth";
import { profileSchema } from "@/lib/validations";
import { createAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(data: any) {
  const session = await getSession();
  if (!session) return { success: false, error: "UNAUTHORIZED" };

  const validation = profileSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: "VALIDATION_FAILED" };
  }

  const { fullName, bio, avatarUrl } = validation.data;

  try {
    // 1. Update user fullName
    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: {
        fullName,
      },
    });

    // 2. Update profile
    await prisma.profile.upsert({
      where: { userId: session.userId },
      update: {
        bio: bio || null,
        avatarUrl: avatarUrl || null,
      },
      create: {
        userId: session.userId,
        bio: bio || null,
        avatarUrl: avatarUrl || null,
      },
    });

    // 3. Update session cookie with new fullName
    await setSession({
      ...session,
      fullName: updatedUser.fullName,
    });

    // 4. Audit Log
    await createAuditLog(session.userId, "USER_PROFILE_UPDATE", "User", session.userId, {
      fullName,
      bio,
      avatarUrl,
    });

    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Update profile error:", error);
    return { success: false, error: "SERVER_ERROR" };
  }
}
