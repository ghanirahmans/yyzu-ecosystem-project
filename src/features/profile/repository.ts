import { prisma } from "@/lib/prisma";

export async function dbUpdateProfile(
  userId: string,
  data: {
    fullName: string;
    bio: string | null;
    avatarUrl: string | null;
  }
) {
  return prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: { fullName: data.fullName },
    });

    await tx.profile.upsert({
      where: { userId },
      update: {
        bio: data.bio,
        avatarUrl: data.avatarUrl,
      },
      create: {
        userId,
        bio: data.bio,
        avatarUrl: data.avatarUrl,
      },
    });

    return updatedUser;
  });
}
