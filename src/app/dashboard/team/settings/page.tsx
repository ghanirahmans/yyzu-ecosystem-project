import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Shield } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import TeamSettingsForm from "@/components/dashboard/TeamSettingsForm";

export default async function TeamSettingsPage() {
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
  const isLeader = membership.role === "TEAM_LEADER";
  const isAdmin = session.role === "FOUNDER" || session.role === "KOORDINATOR_UMUM";

  if (!isLeader && !isAdmin) {
    return (
      <DashboardShell user={session}>
        <div className="max-w-xl mx-auto text-center py-16 text-white/40">
          <Shield size={32} className="mx-auto mb-3 opacity-20" />
          <p>You do not have permission to access team settings.</p>
          <Link href="/dashboard/team" className="text-sm text-indigo-400 hover:text-indigo-300 mt-2 inline-block">
            ← Back to Workspace
          </Link>
        </div>
      </DashboardShell>
    );
  }

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

  // Transform members to match expected shape in TeamSettingsForm
  const formattedMembers = members.map((m) => ({
    role: m.role,
    user: {
      id: m.user.id,
      username: m.user.username,
      fullName: m.user.fullName,
    },
  }));

  return (
    <TeamSettingsForm
      team={{
        id: team.id,
        name: team.name,
        description: team.description,
        status: team.status,
      }}
      members={formattedMembers}
      userRole={membership.role}
      session={session}
    />
  );
}
