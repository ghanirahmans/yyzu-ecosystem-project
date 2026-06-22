import { hashPassword, verifyPassword } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";
import { UserStatus } from "@prisma/client";
import type { LoginInput, RegisterInput } from "./types";
import {
  dbFindUserByUsernameOrEmail,
  dbFindUserByUsername,
  dbFindUserByEmail,
  dbCreateUser,
} from "./repository";

export async function loginUser(data: LoginInput) {
  const user = await dbFindUserByUsernameOrEmail(data.username);

  if (!user) {
    return { success: false as const, error: "INVALID_CREDENTIALS" as const };
  }

  const isValid = await verifyPassword(data.password, user.passwordHash);
  if (!isValid) {
    return { success: false as const, error: "INVALID_CREDENTIALS" as const };
  }

  if (user.status === UserStatus.SUSPENDED) {
    return { success: false as const, error: "ACCOUNT_SUSPENDED" as const };
  }
  if (user.status === UserStatus.REJECTED) {
    return { success: false as const, error: "ACCOUNT_REJECTED" as const };
  }

  return { success: true as const, user };
}

export async function registerUser(data: RegisterInput) {
  const existingUsername = await dbFindUserByUsername(data.username);
  if (existingUsername) {
    return { success: false as const, error: "Username is already taken." };
  }

  const existingEmail = await dbFindUserByEmail(data.email);
  if (existingEmail) {
    return { success: false as const, error: "Email address is already in use." };
  }

  const passwordHash = await hashPassword(data.password);

  const user = await dbCreateUser({
    username: data.username,
    fullName: data.fullName,
    email: data.email,
    passwordHash,
  });

  await createAuditLog(user.id, "USER_REGISTER", "User", user.id);

  return { success: true as const };
}
