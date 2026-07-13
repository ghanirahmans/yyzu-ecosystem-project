// ============================================================
// StreamingAdminStats — Suspense-enabled admin data fetcher
//
// Fetches admin stats (users, teams, approvals, audit logs)
// in a separate async component so the dashboard shell can
// stream first, then hydrate this section when data arrives.
// ============================================================

import { prisma } from "@/lib/prisma";
import { UserStatus } from "@prisma/client";
import AdminOverview from "@/components/dashboard/AdminOverview";

export async function StreamingAdminStats() {
  const [totalUsers, totalTeams, pendingApprovals, recentLogs] =
    await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.team.count({ where: { deletedAt: null } }),
      prisma.user.count({ where: { status: "PENDING_APPROVAL" as UserStatus } }),
      prisma.auditLog.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { actor: { select: { username: true, fullName: true } } },
      }),
    ]);

  return (
    <AdminOverview
      totalUsers={totalUsers}
      totalTeams={totalTeams}
      pendingApprovals={pendingApprovals}
      recentLogs={recentLogs}
    />
  );
}