import { createAuditLog } from "@/lib/audit";
import { hashPassword, verifyPassword } from "@/lib/auth";
import type { ActiveUser } from "@/lib/guards";
import type { ProfileInput } from "./types";
import { dbUpdateProfile, dbUpdatePassword } from "./repository";

export async function updateProfile(actor: ActiveUser, data: ProfileInput) {
  const updatedUser = await dbUpdateProfile(actor.id, {
    fullName: data.fullName,
    bio: data.bio || null,
    avatarUrl: data.avatarUrl || null,
  });

  const auditMeta: Record<string, string | number | boolean> = {
    fullName: data.fullName,
  };
  if (data.bio) auditMeta.bio = data.bio;
  if (data.avatarUrl) auditMeta.avatarUrl = data.avatarUrl;

  await createAuditLog(actor.id, "USER_PROFILE_UPDATE", "User", actor.id, auditMeta);

  return { success: true as const, updatedUser };
}

export async function changePassword(
  actor: ActiveUser,
  data: { currentPassword: string; newPassword: string }
) {
  // Fetch current user with password hash
  const { prisma } = await import("@/lib/prisma");
  const user = await prisma.user.findUnique({
    where: { id: actor.id },
    select: { passwordHash: true },
  });

  if (!user) {
    return { success: false as const, error: "USER_NOT_FOUND" as const };
  }

  // Verify current password
  const isValid = await verifyPassword(data.currentPassword, user.passwordHash);
  if (!isValid) {
    return { success: false as const, error: "CURRENT_PASSWORD_INCORRECT" as const };
  }

  // Validate new password length
  if (data.newPassword.length < 6 || data.newPassword.length > 100) {
    return { success: false as const, error: "INVALID_NEW_PASSWORD" as const };
  }

  const newHash = await hashPassword(data.newPassword);
  await dbUpdatePassword(actor.id, newHash);

  await createAuditLog(actor.id, "USER_PASSWORD_CHANGE", "User", actor.id);

  return { success: true as const };
}
