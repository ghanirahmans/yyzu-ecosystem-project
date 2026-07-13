import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { apiRateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  // Rate limit: 60 requests per minute per IP
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const { allowed } = apiRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user: session });
}