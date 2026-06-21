import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import AdminTeamsList from "@/components/dashboard/AdminTeamsList";

export default async function AdminTeamsPage() {
  const session = await getSession();

  if (!session || session.role !== UserRole.SYSTEM_ADMIN) {
    redirect("/dashboard");
  }

  // Load all active (non soft-deleted) teams
  const teams = await prisma.team.findMany({
    where: { deletedAt: null },
    include: {
      memberships: {
        where: { leftAt: null },
        include: {
          user: {
            select: {
              fullName: true,
            },
          },
        },
      },
      submissions: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          status: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return <AdminTeamsList teams={teams} session={session} />;
}
