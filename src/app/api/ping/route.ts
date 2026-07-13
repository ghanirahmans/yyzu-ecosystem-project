import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { pingRateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  // Rate limit: 30 requests per minute per IP
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const { allowed } = pingRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      message: "Database connection is active",
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Database connection failed";
    return NextResponse.json(
      { status: "unhealthy", error: message },
      { status: 500 },
    );
  }
}