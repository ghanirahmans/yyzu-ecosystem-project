import { NextResponse, type NextRequest } from "next/server";
import { destroySession } from "@/lib/auth";
import { apiRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  // Rate limit: 60 requests per minute per IP
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const { allowed } = apiRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  await destroySession();
  return NextResponse.json({ success: true });
}