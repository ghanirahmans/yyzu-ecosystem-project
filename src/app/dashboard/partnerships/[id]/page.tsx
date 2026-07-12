import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import PartnershipDetailView from "@/components/dashboard/PartnershipDetailView";

export default async function PartnershipDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();

  if (!session) {
    redirect("/dashboard/login");
  }

  const { id } = await params;
  const partnership = await prisma.partnership.findUnique({
    where: { id },
    include: {
      pic: {
        select: {
          id: true,
          fullName: true,
          username: true,
        },
      },
    },
  });

  if (!partnership) {
    notFound();
  }

  const isAdmin = session.role === "FOUNDER" || session.role === "KOORDINATOR_UMUM";
  let isPartnerMember = false;

  const pDiv = await prisma.division.findUnique({ where: { name: "PARTNERSHIP" } });
  if (pDiv) {
    const membership = await prisma.divisionMembership.findFirst({
      where: {
        userId: session.userId,
        divisionId: pDiv.id,
        leftAt: null,
        user: {
          deletedAt: null,
          status: "ACTIVE",
        },
      },
    });
    if (membership) {
      isPartnerMember = true;
    }
  }

  const canEdit = isAdmin || isPartnerMember;

  // Fetch active users for selection dropdown
  const users = await prisma.user.findMany({
    where: { status: "ACTIVE", deletedAt: null },
    select: { id: true, fullName: true, username: true },
    orderBy: { fullName: "asc" },
  });

  const sanitizedPartnership = {
    ...partnership,
    contactName: canEdit ? partnership.contactName : null,
    contactInfo: canEdit ? partnership.contactInfo : null,
  };

  return (
    <DashboardShell user={session}>
      <PartnershipDetailView
        partnership={sanitizedPartnership}
        users={users}
        canEdit={canEdit}
        session={session}
      />
    </DashboardShell>
  );
}
