import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import AdminUsersList from "@/components/dashboard/AdminUsersList";

export default async function AdminUsersPage() {
  const session = await getSession();

  if (!session || session.role !== UserRole.SYSTEM_ADMIN) {
    redirect("/dashboard");
  }

  // Load all users who aren't soft deleted, including their active team memberships
  const users = await prisma.user.findMany({
    where: { deletedAt: null },
    include: {
      teamMemberships: {
        where: { leftAt: null },
        include: {
          team: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return <AdminUsersList users={users} session={session} />;
}
