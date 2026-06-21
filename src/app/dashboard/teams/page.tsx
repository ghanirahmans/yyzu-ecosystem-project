import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import BrowseTeamsList from "@/components/dashboard/BrowseTeamsList";

export default async function BrowseTeamsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/dashboard/login");
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

  // Check if current user is in a team
  const membership = await prisma.teamMembership.findFirst({
    where: { userId: session.userId, leftAt: null },
    include: {
      team: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // Check if user has an active pending join request
  const pendingRequest = await prisma.joinRequest.findFirst({
    where: { userId: session.userId, status: "PENDING" },
    select: {
      id: true,
      teamId: true,
      status: true,
    },
  });

  return (
    <BrowseTeamsList
      teams={teams}
      pendingRequest={pendingRequest}
      currentTeam={membership?.team ?? null}
      session={session}
    />
  );
}
