"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { loginSchema, registerSchema } from "@/lib/validations";
import { hashPassword, verifyPassword, setSession, destroySession } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";
import { UserStatus, UserRole } from "@prisma/client";

// ---------------------------------------------------------------------------
// Input types (derived from Zod schemas via manual mirror — no any)
// ---------------------------------------------------------------------------

interface LoginInput {
  username: string;
  password: string;
}

interface RegisterInput {
  username: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// ---------------------------------------------------------------------------
// In-memory rate limiter: max 5 requests per minute per IP
// ---------------------------------------------------------------------------

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

const rateLimitStore = new Map<string, { count: number; windowStart: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(ip, { count: 1, windowStart: now });
    return true; // allowed
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false; // blocked
  }

  entry.count += 1;
  return true; // allowed
}

async function getClientIp(): Promise<string> {
  const headerStore = await headers();
  return (
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerStore.get("x-real-ip") ??
    "unknown"
  );
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export async function loginAction(formData: LoginInput) {
  // Rate limit check
  const ip = await getClientIp();
  if (!checkRateLimit(ip)) {
    return { success: false, error: "TOO_MANY_REQUESTS" };
  }

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

export async function registerAction(formData: RegisterInput) {
  // Rate limit check
  const ip = await getClientIp();
  if (!checkRateLimit(ip)) {
    return { success: false, error: "Too many requests. Please wait a minute and try again." };
  }

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
