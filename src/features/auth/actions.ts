"use server";

import { headers } from "next/headers";
import { setSession, destroySession } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";
import { loginSchema, registerSchema } from "./schema";
import type { LoginInput, RegisterInput } from "./types";
import * as authService from "./service";

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

export async function actionLogin(formData: LoginInput) {
  // Rate limit check
  const ip = await getClientIp();
  if (!checkRateLimit(ip)) {
    return { success: false as const, error: "TOO_MANY_REQUESTS" };
  }

  // Validate fields
  const validation = loginSchema.safeParse(formData);
  if (!validation.success) {
    return { success: false as const, error: "INVALID_INPUTS" };
  }

  const result = await authService.loginUser(validation.data);
  if (!result.success || !result.user) {
    return { success: false as const, error: "error" in result ? result.error : "INVALID_CREDENTIALS" };
  }

  const user = result.user;

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

  return { success: true as const };
}

export async function actionRegister(formData: RegisterInput) {
  // Rate limit check
  const ip = await getClientIp();
  if (!checkRateLimit(ip)) {
    return { success: false as const, error: "Too many requests. Please wait a minute and try again." };
  }

  // Validate fields
  const validation = registerSchema.safeParse(formData);
  if (!validation.success) {
    return { success: false as const, error: "Validation failed." };
  }

  return authService.registerUser(validation.data);
}

export async function actionLogout() {
  await destroySession();
  return { success: true as const };
}
