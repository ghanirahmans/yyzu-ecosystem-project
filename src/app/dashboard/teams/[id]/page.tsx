import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import TeamWorkspace from "@/components/dashboard/TeamWorkspace";
import { UserRole } from "@prisma/client";

export default async function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();

  if (!session) {
    redirect("/dashboard/login");
  }

  const { id } = await params;

  // 1. Fetch team
  const team = await prisma.team.findUnique({
    where: { id },
  });

  if (!team || team.deletedAt !== null) {
    notFound();
  }

  // 2. Check if user is allowed to view this team
  const isAdmin = session.role === UserRole.SYSTEM_ADMIN;
  const isMentor = session.role === UserRole.MENTOR;

  const membership = await prisma.teamMembership.findFirst({
    where: { teamId: team.id, userId: session.userId, leftAt: null },
  });

  const canView = isAdmin || isMentor || !!membership;

  if (!canView) {
    redirect("/dashboard/teams");
  }

  // 3. Fetch team members (active only)
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

  // 4. Fetch pending inbound join requests
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

  // 5. Fetch pending outbound invitations
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

  // 6. Fetch useful links
  const usefulLinks = await prisma.usefulLink.findMany({
    where: { teamId: team.id },
    orderBy: { createdAt: "desc" },
  });

  // 7. Fetch submissions
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
      userRole={membership?.role ?? null}
      session={session}
    />
  );
}
