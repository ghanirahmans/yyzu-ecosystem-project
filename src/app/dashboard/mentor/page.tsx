import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import MentorDashboard from "@/components/dashboard/MentorDashboard";
import { UserRole } from "@prisma/client";

export const metadata = {
  title: "Mentor Dashboard | YYZU Operasional",
  description: "Overview semua tim dan submission untuk mentor.",
};

export default async function MentorPage() {
  const session = await getSession();

  if (!session) {
    redirect("/dashboard/login");
  }

  const isMentor = session.role === UserRole.MENTOR || session.role === UserRole.KETUA_DEWAN_MENTOR;
  if (!isMentor && session.role !== UserRole.FOUNDER && session.role !== UserRole.KOORDINATOR_UMUM) {
    redirect("/dashboard");
  }

  // Fetch all active teams with latest submission per team
  const teams = await prisma.team.findMany({
    where: { deletedAt: null, status: "ACTIVE" },
    include: {
      submissions: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      _count: {
        select: { memberships: { where: { leftAt: null } } },
      },
    },
    orderBy: { name: "asc" },
  });

  // Fetch review history for this mentor (or admin)
  const reviewHistory = await prisma.submission.findMany({
    where: {
      reviewedBy: session.userId,
      status: { in: ["APPROVED", "REVISION"] },
    },
    orderBy: { reviewedAt: "desc" },
    take: 10,
    include: {
      team: { select: { name: true } },
    },
  });

  return (
    <MentorDashboard
      teams={teams.map((t) => ({
        id: t.id,
        name: t.name,
        description: t.description,
        status: t.status,
        memberCount: t._count.memberships,
        latestSubmission: t.submissions[0]
          ? {
              id: t.submissions[0].id,
              status: t.submissions[0].status,
              feedback: t.submissions[0].feedback,
              submittedAt: t.submissions[0].submittedAt?.toISOString() ?? null,
              reviewedAt: t.submissions[0].reviewedAt?.toISOString() ?? null,
            }
          : null,
      }))}
      reviewHistory={reviewHistory.map((s) => ({
        id: s.id,
        teamId: s.teamId,
        teamName: s.team.name,
        status: s.status,
        feedback: s.feedback,
        reviewedAt: s.reviewedAt?.toISOString() ?? null,
      }))}
      session={session}
    />
  );
}
