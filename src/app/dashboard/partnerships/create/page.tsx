import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Shield } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import PartnershipCreateForm from "@/components/dashboard/PartnershipCreateForm";

export const metadata = {
  title: "Tambah Mitra | YYZU Operasional",
  description: "Tambah relasi kemitraan eksternal baru untuk YYZU.",
};

export default async function PartnershipCreatePage() {
  const session = await getSession();

  if (!session) {
    redirect("/dashboard/login");
  }

  const checkManager = async () => {
    if (session.role === "SYSTEM_ADMIN") return true;
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
      return !!membership;
    }
    return false;
  };
  const canManage = await checkManager();

  if (!canManage) {
    return (
      <DashboardShell user={session}>
        <div className="max-w-xl mx-auto text-center py-16 text-white/40">
          <Shield size={32} className="mx-auto mb-3 opacity-20" />
          <p>Anda tidak memiliki akses untuk menambah data kemitraan.</p>
          <Link href="/dashboard/partnerships" className="text-sm text-indigo-400 hover:text-indigo-300 mt-2 inline-block">
            ← Kembali ke Kemitraan
          </Link>
        </div>
      </DashboardShell>
    );
  }

  // Fetch active users for PIC selection
  const users = await prisma.user.findMany({
    where: { status: "ACTIVE", deletedAt: null },
    select: { id: true, fullName: true, username: true },
    orderBy: { fullName: "asc" },
  });

  return (
    <DashboardShell user={session}>
      <PartnershipCreateForm users={users} />
    </DashboardShell>
  );
}
