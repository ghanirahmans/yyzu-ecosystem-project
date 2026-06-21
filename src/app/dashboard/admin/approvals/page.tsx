import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { UserRole, UserStatus } from "@prisma/client";
import AdminUsersList from "@/components/dashboard/AdminUsersList";

export default async function AdminApprovalsPage() {
  const session = await getSession();

  if (!session || session.role !== UserRole.SYSTEM_ADMIN) {
    redirect("/dashboard");
  }

  // Load only users pending approval
  const users = await prisma.user.findMany({
    where: { deletedAt: null, status: UserStatus.PENDING_APPROVAL },
    include: {
      teamMemberships: {
        where: { leftAt: null },
        include: {
          team: {
            select: { name: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return <AdminUsersList users={users} session={session} />;
}
