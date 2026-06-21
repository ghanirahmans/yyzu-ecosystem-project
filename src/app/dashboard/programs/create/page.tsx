import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Shield } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import ProgramCreateForm from "@/components/dashboard/ProgramCreateForm";

export const metadata = {
  title: "Buat Program | YYZU Admin",
  description: "Tambah program kerja dan event baru untuk ekosistem YYZU.",
};

export default async function ProgramCreatePage({ searchParams }: { searchParams?: Promise<{ divisionId?: string }> }) {
  const session = await getSession();

  if (!session) {
    redirect("/dashboard/login");
  }

  const resolvedParams = searchParams ? await searchParams : {};
  const defaultDivisionId = resolvedParams.divisionId || "";

  const canCreate = session.status === "ACTIVE";

  const isDivMember = await prisma.divisionMembership.findFirst({
    where: {
      userId: session.userId,
      leftAt: null,
      user: {
        deletedAt: null,
        status: "ACTIVE",
      },
    },
  });
  const isManager = session.role === "SYSTEM_ADMIN" || !!isDivMember;

  if (!canCreate) {
    return (
      <DashboardShell user={session}>
        <div className="max-w-xl mx-auto text-center py-16 text-white/40">
          <Shield size={32} className="mx-auto mb-3 opacity-20" />
          <p>Anda tidak memiliki akses untuk membuat program baru. Hanya anggota aktif yang dapat mengusulkan program baru.</p>
          <Link href="/dashboard/programs" className="text-sm text-indigo-400 hover:text-indigo-300 mt-2 inline-block">
            ← Kembali ke Program
          </Link>
        </div>
      </DashboardShell>
    );
  }

  // Fetch divisions
  const divisions = await prisma.division.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  // Fetch active users to be PICs
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
      <ProgramCreateForm divisions={divisions} users={users} isManager={isManager} defaultDivisionId={defaultDivisionId} />
    </DashboardShell>
  );
}
