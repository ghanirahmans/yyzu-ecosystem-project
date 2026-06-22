import { createAuditLog } from "@/lib/audit";
import type { ActiveUser } from "@/lib/guards";
import type { ProfileInput } from "./types";
import { dbUpdateProfile } from "./repository";

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
