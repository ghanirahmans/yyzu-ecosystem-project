import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { JWT_SECRET } from "@/lib/config";
import type { JWTSessionPayload } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

const key = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 0. Rate limit: 100 dashboard requests per minute per IP
  const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
  const { allowed } = rateLimit(`mw:${ip}`, 100, 60_000);
  if (!allowed) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: { "Retry-After": "60" },
    });
  }

  // 1. If clear parameter is present, delete session cookie and redirect to login
  if (request.nextUrl.searchParams.get("clear") === "1") {
    // Stale session detected — clear and redirect (no log in production)
    const response = NextResponse.redirect(new URL("/dashboard/login", request.url));
    response.cookies.delete("session");
    return response;
  }

  // 1. Skip static assets, api routes, etc.
  if (
    pathname.startsWith("/_next") ||
    pathname.includes(".") || // files with extensions
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 2. Read session cookie
  const sessionCookie = request.cookies.get("session")?.value;
  let payload: JWTSessionPayload | null = null;

  if (sessionCookie) {
    try {
      const { payload: jwtPayload } = await jwtVerify(sessionCookie, key, {
        algorithms: ["HS256"],
      });
      payload = jwtPayload as unknown as JWTSessionPayload;
    } catch (err) {
      // Invalid token, remove cookie
      const response = NextResponse.redirect(new URL("/dashboard/login", request.url));
      response.cookies.delete("session");
      return response;
    }
  }

  // 3. Routing rules
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAuthRoute = pathname === "/dashboard/login" || pathname === "/dashboard/register";
  const isPendingRoute = pathname === "/dashboard/pending";

  if (isDashboardRoute) {
    // If not logged in and not on auth page
    if (!payload && !isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard/login", request.url));
    }

    // If logged in and on auth page (login/register)
    if (payload && isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (payload) {
      // If user status is PENDING_APPROVAL, force redirect to /dashboard/pending
      if (payload.status === "PENDING_APPROVAL" && !isPendingRoute) {
        return NextResponse.redirect(new URL("/dashboard/pending", request.url));
      }

      // If user is ACTIVE (or any non-pending), they shouldn't access pending page
      if (payload.status !== "PENDING_APPROVAL" && isPendingRoute) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // Admin routes gating
      const isAdminRoute = pathname.startsWith("/dashboard/admin");
      if (isAdminRoute && payload.role !== "FOUNDER" && payload.role !== "KOORDINATOR_UMUM") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard"],
};
