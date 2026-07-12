import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import AdminTeamsList from "@/components/dashboard/AdminTeamsList";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default async function AdminTeamsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await getSession();

  if (!session || session.role !== UserRole.FOUNDER && session.role !== UserRole.KOORDINATOR_UMUM) {
    redirect("/dashboard");
  }

  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1", 10);
  const take = 20;
  const skip = (page - 1) * take;

  // Load all active teams with pagination and count
  const [teams, total] = await Promise.all([
    prisma.team.findMany({
      where: { deletedAt: null },
      skip,
      take,
      include: {
        memberships: {
          where: { leftAt: null },
          include: {
            user: {
              select: {
                fullName: true,
              },
            },
          },
        },
        submissions: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.team.count({ where: { deletedAt: null } }),
  ]);

  const totalPages = Math.ceil(total / take);

  const buildUrl = (targetPage: number) => {
    return `/dashboard/admin/teams?page=${targetPage}`;
  };

  return (
    <>
      <AdminTeamsList teams={teams} session={session} />
      {totalPages > 1 && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#161b22]/90 backdrop-blur border border-white/10 px-4 py-2.5 rounded-xl shadow-2xl transition-all hover:border-white/15">
          <Link
            href={page > 1 ? buildUrl(page - 1) : "#"}
            className={`p-1.5 rounded-lg border transition-colors ${
              page > 1
                ? "border-white/10 hover:bg-white/5 text-white/80"
                : "border-white/5 text-white/20 pointer-events-none"
            }`}
          >
            <ChevronLeft size={16} />
          </Link>
          <span className="text-xs font-medium text-white/60 px-1">
            Page {page} of {totalPages}
          </span>
          <Link
            href={page < totalPages ? buildUrl(page + 1) : "#"}
            className={`p-1.5 rounded-lg border transition-colors ${
              page < totalPages
                ? "border-white/10 hover:bg-white/5 text-white/80"
                : "border-white/5 text-white/20 pointer-events-none"
            }`}
          >
            <ChevronRight size={16} />
          </Link>
        </div>
      )}
    </>
  );
}

