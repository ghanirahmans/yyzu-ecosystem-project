/**
 * src/lib/guards.ts
 *
 * Server-side session guard utilities.
 * Use validateActiveUser() di awal setiap Server Action atau Route Handler
 * yang membutuhkan user yang sudah login dan berstatus ACTIVE.
 */

import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import { JWT_SECRET } from "@/lib/config";
import type { UserRole, UserStatus } from "@prisma/client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ActiveUser {
  id: string;
  role: UserRole;
  status: UserStatus;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

const key = new TextEncoder().encode(JWT_SECRET);

interface RawJWTPayload {
  userId: string;
  username: string;
  role: string;
  status: string;
  fullName: string;
}

// ---------------------------------------------------------------------------
// Public guard
// ---------------------------------------------------------------------------

/**
 * Validates that the current request has an authenticated, ACTIVE user.
 *
 * Flow:
 *   1. Read "session" cookie from Next.js cookie store
 *   2. Verify JWT signature and expiry using jose
 *   3. Query the database to get the live user record (never trust JWT alone)
 *   4. Assert that user.status === "ACTIVE"
 *
 * @throws Error with a descriptive message on any failure step
 * @returns {ActiveUser} Fresh { id, role, status } sourced from the database
 */
export async function validateActiveUser(): Promise<ActiveUser> {
  // Step 1 — Read session cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    throw new Error("Unauthorized: No session cookie found.");
  }

  // Step 2 — Verify JWT
  let payload: RawJWTPayload;
  try {
    const { payload: jwtPayload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    payload = jwtPayload as unknown as RawJWTPayload;
  } catch {
    throw new Error("Unauthorized: Session token is invalid or expired.");
  }

  if (!payload.userId) {
    throw new Error("Unauthorized: JWT payload is missing userId.");
  }

  // Step 3 — Query DB for the live user record
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, role: true, status: true },
  });

  if (!user) {
    throw new Error(`Unauthorized: User with id "${payload.userId}" no longer exists.`);
  }

  // Step 4 — Assert ACTIVE status
  if (user.status !== "ACTIVE") {
    throw new Error(
      `Forbidden: User account is not active. Current status: "${user.status}".`
    );
  }

  return user;
}
