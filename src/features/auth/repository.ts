import { prisma } from "@/lib/prisma";
import { UserStatus, UserRole } from "@prisma/client";

export async function dbFindUserByUsernameOrEmail(usernameOrEmail: string) {
  return prisma.user.findFirst({
    where: {
      OR: [
        { username: usernameOrEmail },
        { email: usernameOrEmail },
      ],
    },
  });
}

export async function dbFindUserByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username },
  });
}

export async function dbFindUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function dbCreateUser(data: {
  username: string;
  fullName: string;
  email: string;
  passwordHash: string;
}) {
  return prisma.user.create({
    data: {
      username: data.username,
      fullName: data.fullName,
      email: data.email,
      passwordHash: data.passwordHash,
      status: UserStatus.PENDING_APPROVAL,
      role: UserRole.MEMBER,
      profile: {
        create: {},
      },
    },
  });
}
