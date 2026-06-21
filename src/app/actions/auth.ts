"use server";

import { prisma } from "@/lib/prisma";
import { loginSchema, registerSchema } from "@/lib/validations";
import { hashPassword, verifyPassword, setSession, destroySession } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";
import { UserStatus, UserRole } from "@prisma/client";

export async function loginAction(formData: any) {
  // Validate fields
  const validation = loginSchema.safeParse(formData);
  if (!validation.success) {
    return { success: false, error: "INVALID_INPUTS" };
  }

  const { username, password } = validation.data;

  // Find user by username or email
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: username },
        { email: username },
      ],
    },
  });

  if (!user) {
    return { success: false, error: "INVALID_CREDENTIALS" };
  }

  // Verify password
  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return { success: false, error: "INVALID_CREDENTIALS" };
  }

  // Check if user is suspended or rejected
  if (user.status === UserStatus.SUSPENDED) {
    return { success: false, error: "ACCOUNT_SUSPENDED" };
  }
  if (user.status === UserStatus.REJECTED) {
    return { success: false, error: "ACCOUNT_REJECTED" };
  }

  // Set session cookie
  await setSession({
    userId: user.id,
    username: user.username,
    role: user.role,
    status: user.status,
    fullName: user.fullName,
  });

  // Log audit
  await createAuditLog(user.id, "USER_LOGIN", "User", user.id);

  return { success: true };
}

export async function registerAction(formData: any) {
  // Validate fields
  const validation = registerSchema.safeParse(formData);
  if (!validation.success) {
    return { success: false, error: "Validation failed." };
  }

  const { username, fullName, email, password } = validation.data;

  // Check username uniqueness
  const existingUsername = await prisma.user.findUnique({
    where: { username },
  });
  if (existingUsername) {
    return { success: false, error: "Username is already taken." };
  }

  // Check email uniqueness
  const existingEmail = await prisma.user.findUnique({
    where: { email },
  });
  if (existingEmail) {
    return { success: false, error: "Email address is already in use." };
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      username,
      fullName,
      email,
      passwordHash,
      status: UserStatus.PENDING_APPROVAL,
      role: UserRole.MEMBER,
      profile: {
        create: {},
      },
    },
  });

  // Log audit
  await createAuditLog(user.id, "USER_REGISTER", "User", user.id);

  return { success: true };
}

export async function logoutAction() {
  await destroySession();
  return { success: true };
}
