import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRateLimit } from "@/lib/rate-limit";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  // Rate limit
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const { allowed } = apiRateLimit(ip);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  // Auth
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const q = request.nextUrl.searchParams.get("q") ?? "";
  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const [members, teams, programs] = await Promise.all([
    prisma.user.findMany({
      where: {
        deletedAt: null,
        status: "ACTIVE",
        OR: [
          { fullName: { contains: q, mode: "insensitive" } },
          { username: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { id: true, username: true, fullName: true, role: true },
      take: 5,
    }),
    prisma.team.findMany({
      where: {
        deletedAt: null,
        name: { contains: q, mode: "insensitive" },
      },
      select: { id: true, name: true },
      take: 5,
    }),
    prisma.program.findMany({
      where: {
        title: { contains: q, mode: "insensitive" },
      },
      select: { id: true, title: true },
      take: 5,
    }),
  ]);

  return NextResponse.json({
    results: [
      ...members.map((m) => ({
        type: "member" as const,
        label: m.fullName,
        sub: `@${m.username} · ${m.role}`,
        href: `/dashboard/members/${m.username}`,
      })),
      ...teams.map((t) => ({
        type: "team" as const,
        label: t.name,
        sub: "Team",
        href: `/dashboard/teams/${t.id}`,
      })),
      ...programs.map((p) => ({
        type: "program" as const,
        label: p.title,
        sub: "Program",
        href: `/dashboard/programs/${p.id}`,
      })),
    ],
  });
}