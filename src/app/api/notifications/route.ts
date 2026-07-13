import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRateLimit } from "@/lib/rate-limit";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const { allowed } = apiRateLimit(ip);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const notifications: {
    id: string;
    type: string;
    message: string;
    href: string;
    createdAt: string;
    read: boolean;
  }[] = [];

  // Admin: pending user approvals
  if (session.role === "FOUNDER" || session.role === "KOORDINATOR_UMUM") {
    const pendingCount = await prisma.user.count({
      where: { status: "PENDING_APPROVAL", deletedAt: null },
    });
    if (pendingCount > 0) {
      notifications.push({
        id: "admin-pending-users",
        type: "approval",
        message: `${pendingCount} new user${pendingCount > 1 ? "s" : ""} awaiting approval`,
        href: "/dashboard/admin/approvals",
        createdAt: now.toISOString(),
        read: false,
      });
    }
  }

  // Team leader: pending join requests
  const leaderMembership = await prisma.teamMembership.findFirst({
    where: { userId: session.userId, leftAt: null, role: "TEAM_LEADER" },
    select: { teamId: true },
  });

  if (leaderMembership) {
    const pendingJoins = await prisma.joinRequest.count({
      where: { teamId: leaderMembership.teamId, status: "PENDING" },
    });
    if (pendingJoins > 0) {
      notifications.push({
        id: `team-${leaderMembership.teamId}-joins`,
        type: "join_request",
        message: `${pendingJoins} pending join request${pendingJoins > 1 ? "s" : ""} for your team`,
        href: "/dashboard/team",
        createdAt: now.toISOString(),
        read: false,
      });
    }
  }

  // Member: pending invites
  const pendingInvites = await prisma.invitation.count({
    where: {
      invitedUserId: session.userId,
      status: "PENDING",
      expiresAt: { gt: now },
    },
  });
  if (pendingInvites > 0) {
    notifications.push({
      id: `user-${session.userId}-invites`,
      type: "invite",
      message: `${pendingInvites} team invitation${pendingInvites > 1 ? "s" : ""} waiting for you`,
      href: "/dashboard",
      createdAt: now.toISOString(),
      read: false,
    });
  }

  return NextResponse.json({ notifications });
}