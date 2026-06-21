import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import TeamWorkspace from "@/components/dashboard/TeamWorkspace";

export default async function TeamWorkspacePage() {
  const session = await getSession();

  if (!session) {
    redirect("/dashboard/login");
  }

  // 1. Fetch current team membership
  const membership = await prisma.teamMembership.findFirst({
    where: { userId: session.userId, leftAt: null },
    include: {
      team: true,
    },
  });

  if (!membership) {
    // Redirect to browse teams if user doesn't have a team
    redirect("/dashboard/teams");
  }

  const team = membership.team;

  // 2. Fetch team members (active only)
  const members = await prisma.teamMembership.findMany({
    where: { teamId: team.id, leftAt: null },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          fullName: true,
        },
      },
    },
    orderBy: { joinedAt: "asc" },
  });

  // 3. Fetch pending inbound join requests
  const pendingRequests = await prisma.joinRequest.findMany({
    where: { teamId: team.id, status: "PENDING" },
    include: {
      user: {
        select: {
          fullName: true,
          username: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // 4. Fetch pending outbound invitations
  const outboundInvites = await prisma.invitation.findMany({
    where: { teamId: team.id, status: "PENDING" },
    include: {
      invitedUser: {
        select: {
          username: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // 5. Fetch useful links
  const usefulLinks = await prisma.usefulLink.findMany({
    where: { teamId: team.id },
    orderBy: { createdAt: "desc" },
  });

  // 6. Fetch submissions
  const submissions = await prisma.submission.findMany({
    where: { teamId: team.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <TeamWorkspace
      team={team}
      members={members}
      pendingRequests={pendingRequests}
      outboundInvites={outboundInvites}
      usefulLinks={usefulLinks as any}
      submissions={submissions}
      userRole={membership.role}
      session={session}
    />
  );
}
