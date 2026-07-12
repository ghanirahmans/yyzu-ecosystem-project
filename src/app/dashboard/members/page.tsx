import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, AtSign, Shield, Star, ChevronLeft, ChevronRight } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { getInitials, stringToColor, cn } from "@/lib/utils";

export const metadata = {
  title: "Members | YYZU Dashboard",
  description: "Daftar semua anggota aktif ekosistem YYZU.",
};

const DIVISION_LABELS: Record<string, string> = {
  PARTNERSHIP: "Partnership",
  SDM_MANAGEMENT: "SDM & Management",
  EVENT_ORGANIZER: "Event Organizer",
  PRODUCT_PROJECT_MANAGEMENT: "Product & PM",
  LEARNING_CURRICULUM: "Learning & Curriculum",
  MEDIA_BRANDING: "Media & Branding",
  KOORDINATOR_UMUM: "Koordinator Umum",
};

function getRoleBadge(role: string) {
  if (role === "SYSTEM_ADMIN") return { label: "Koordinator Umum", color: "bg-rose-500/15 text-rose-400 border-rose-500/20" };
  if (role === "BPH") return { label: "Ketua Divisi", color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20" };
  if (role === "MENTOR") return { label: "Mentor", color: "bg-amber-500/15 text-amber-400 border-amber-500/20" };
  return { label: "Member", color: "bg-white/8 text-white/50 border-white/10" };
}

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/dashboard/login");

  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1", 10);
  const take = 20;
  const skip = (page - 1) * take;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: { status: "ACTIVE", deletedAt: null },
      orderBy: { fullName: "asc" },
      skip,
      take,
      include: {
        profile: { select: { bio: true, avatarUrl: true } },
        teamMemberships: {
          where: { leftAt: null },
          include: { team: { select: { name: true } } },
        },
        divisionMemberships: {
          where: { leftAt: null },
          include: { division: { select: { name: true } } },
        },
      },
    }),
    prisma.user.count({ where: { status: "ACTIVE", deletedAt: null } }),
  ]);

  const totalPages = Math.ceil(total / take);

  const buildUrl = (targetPage: number) => {
    return `/dashboard/members?page=${targetPage}`;
  };

  return (
    <DashboardShell user={session}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Anggota</h1>
          <p className="text-sm text-white/60 mt-1">
            {total} anggota aktif di ekosistem YYZU
          </p>
        </div>


        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((u) => {
            const initials = getInitials(u.fullName);
            const avatarColor = stringToColor(u.username);
            const roleBadge = getRoleBadge(u.role);
            const teamMembership = u.teamMemberships[0];
            const divMemberships = u.divisionMemberships;

            return (
              <Link
                key={u.id}
                href={`/dashboard/members/${u.username}`}
                className="group bg-[#161b22] border border-white/8 hover:border-white/20 rounded-2xl p-5 flex flex-col gap-4 transition-all hover:-translate-y-0.5"
              >
                {/* Avatar + name */}
                <div className="flex items-center gap-3">
                  {u.profile?.avatarUrl ? (
                    <img
                      src={u.profile.avatarUrl}
                      alt={u.fullName}
                      className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ background: avatarColor }}
                    >
                      {initials}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-white text-sm truncate group-hover:text-indigo-300 transition-colors">
                      {u.fullName}
                    </p>
                    <p className="text-xs text-white/40 flex items-center gap-1 truncate">
                      <AtSign size={10} /> {u.username}
                    </p>
                  </div>
                </div>

                {/* Role badges */}
                <div className="flex flex-wrap gap-1.5">
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium", roleBadge.color)}>
                    {roleBadge.label}
                  </span>
                  {teamMembership?.role === "TEAM_LEADER" && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full border font-medium bg-indigo-500/15 text-indigo-400 border-indigo-500/20">
                      Team Leader
                    </span>
                  )}
                  {divMemberships.map((dm) => (
                    <span
                      key={dm.id}
                      className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full border font-medium",
                        dm.role === "HEAD"
                          ? "bg-violet-500/15 text-violet-400 border-violet-500/20"
                          : "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                      )}
                    >
                      {dm.role === "HEAD" ? "Head · " : ""}
                      {DIVISION_LABELS[dm.division.name] ?? dm.division.name}
                    </span>
                  ))}
                </div>

                {/* Team name */}
                {teamMembership && (
                  <p className="text-xs text-white/40 flex items-center gap-1.5 -mt-1">
                    <Users size={11} />
                    {teamMembership.team.name}
                  </p>
                )}
              </Link>
            );
          })}
        </div>

        {users.length === 0 && (
          <div className="text-center py-20 text-white/30">
            <Users size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Belum ada anggota aktif.</p>
          </div>
        )}

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
      </div>
    </DashboardShell>
  );
}

