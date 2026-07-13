import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ProgramDetailView from "@/components/dashboard/ProgramDetailView";

export default async function ProgramDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();

  if (!session) {
    redirect("/dashboard/login");
  }

  const { id } = await params;
  const program = await prisma.program.findUnique({
    where: { id },
    include: {
      divisions: {
        select: {
          id: true,
          name: true,
        },
      },
      pic: {
        select: {
          id: true,
          fullName: true,
          username: true,
        },
      },
      author: {
        select: {
          id: true,
          fullName: true,
          username: true,
        },
      },
    },
  });

  if (!program) {
    notFound();
  }

  const isAdmin = session.role === "FOUNDER" || session.role === "KOORDINATOR_UMUM";
  const isAuthor = program.authorId === session.userId;

  // Fetch all active division memberships of the logged-in user
  const memberships = await prisma.divisionMembership.findMany({
    where: {
      userId: session.userId,
      leftAt: null,
      user: {
        deletedAt: null,
        status: "ACTIVE",
      },
    },
  });

  const isAnyDivMember = memberships.length > 0;
  const involvedDivisionIds = program.divisions.map((d) => d.id);
  const isInvolvedDivMember = memberships.some((m) => involvedDivisionIds.includes(m.divisionId));
  const isInvolvedDivHead = memberships.some((m) => m.role === "HEAD" && involvedDivisionIds.includes(m.divisionId));

  // User is a manager (can edit advanced fields) if they are Admin,
  // or if program has no divisions and they are a division member,
  // or if program has divisions and they are a member of the involved divisions.
  const isManager = isAdmin || (
    involvedDivisionIds.length === 0 ? isAnyDivMember : isInvolvedDivMember
  );

  // User can moderate (approve/reject) if they are Admin or head of involved divisions
  const canModerate = isAdmin || isInvolvedDivHead;

  // User can edit if they are a manager or the author
  const canEdit = isManager || isAuthor;

  // Fetch divisions for selection dropdown
  const divisions = await prisma.division.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  // Fetch active users for selection dropdown
  const users = await prisma.user.findMany({
    where: { status: "ACTIVE", deletedAt: null },
    select: {
      id: true,
      fullName: true,
      username: true,
      divisionMemberships: {
        where: { leftAt: null },
        select: {
          divisionId: true,
        },
      },
    },
    orderBy: { fullName: "asc" },
  });

  return (
    <DashboardShell user={session}>
      <ProgramDetailView
        program={program as unknown as Parameters<typeof ProgramDetailView>[0]["program"]}
        divisions={divisions}
        users={users}
        canEdit={canEdit}
        isManager={isManager}
        canModerate={canModerate}
        session={session}
      />
    </DashboardShell>
  );
}
