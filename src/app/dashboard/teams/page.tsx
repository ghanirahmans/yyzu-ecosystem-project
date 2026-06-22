import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import BrowseTeamsList from "@/components/dashboard/BrowseTeamsList";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Prisma } from "@prisma/client";

export default async function BrowseTeamsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/dashboard/login");
  }

  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1", 10);
  const searchQuery = resolvedSearchParams.q || "";
  const take = 20;
  const skip = (page - 1) * take;

  const whereClause: Prisma.TeamWhereInput = { deletedAt: null };
  if (searchQuery) {
    whereClause.name = { contains: searchQuery, mode: "insensitive" };
  }

  // Load teams with pagination and count non soft-deleted teams
  const [teams, total] = await Promise.all([
    prisma.team.findMany({
      where: whereClause,
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
    prisma.team.count({ where: whereClause }),
  ]);

  // Check if current user is in a team
  const membership = await prisma.teamMembership.findFirst({
    where: { userId: session.userId, leftAt: null },
    include: {
      team: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // Check if user has an active pending join request
  const pendingRequest = await prisma.joinRequest.findFirst({
    where: { userId: session.userId, status: "PENDING" },
    select: {
      id: true,
      teamId: true,
      status: true,
    },
  });

  const totalPages = Math.ceil(total / take);

  const buildUrl = (targetPage: number) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    params.set("page", targetPage.toString());
    return `/dashboard/teams?${params.toString()}`;
  };

  return (
    <>
      <BrowseTeamsList
        teams={teams}
        pendingRequest={pendingRequest}
        currentTeam={membership?.team ?? null}
        session={session}
        searchQuery={searchQuery}
      />
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

