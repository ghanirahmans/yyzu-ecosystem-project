import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import AdminAuditList from "@/components/dashboard/AdminAuditList";

export default async function AdminAuditLogPage() {
  const session = await getSession();

  if (!session || session.role !== UserRole.SYSTEM_ADMIN) {
    redirect("/dashboard");
  }

  // Load all audit logs, including the actor's details
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      actor: {
        select: {
          username: true,
          fullName: true,
        },
      },
    },
  });

  return <AdminAuditList logs={logs} session={session} />;
}
