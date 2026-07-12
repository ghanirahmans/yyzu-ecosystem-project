import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { AtSign, Calendar, Users, ArrowLeft, Mail, Shield } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { getInitials, stringToColor, formatDate, cn } from "@/lib/utils";

const DIVISION_LABELS: Record<string, string> = {
  PARTNERSHIP: "Partnership",
  SDM_MANAGEMENT: "SDM & Management",
  EVENT_ORGANIZER: "Event Organizer",
  PRODUCT_PROJECT_MANAGEMENT: "Product & Project Management",
  LEARNING_CURRICULUM: "Learning & Curriculum",
  MEDIA_BRANDING: "Media & Branding",
  KOORDINATOR_UMUM: "Koordinator Umum (BPH)",
};

function getRoleBadge(role: string) {
  if (role === "SYSTEM_ADMIN") return { label: "Koordinator Umum", color: "bg-rose-500/15 text-rose-400 border-rose-500/20" };
  if (role === "BPH") return { label: "Ketua Divisi", color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20" };
  if (role === "KETUA_DEWAN_MENTOR") return { label: "Ketua Dewan Mentor", color: "bg-violet-500/15 text-violet-400 border-violet-500/20" };
  if (role === "MENTOR") return { label: "Mentor", color: "bg-amber-500/15 text-amber-400 border-amber-500/20" };
  return { label: "Talenta", color: "bg-white/8 text-white/50 border-white/10" };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/dashboard/login");

  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username, deletedAt: null },
    include: {
      profile: { select: { bio: true, avatarUrl: true } },
      teamMemberships: {
        where: { leftAt: null },
        include: { team: { select: { id: true, name: true } } },
      },
      divisionMemberships: {
        where: { leftAt: null },
        include: { division: { select: { id: true, name: true } } },
      },
    },
  });

  if (!user || user.status !== "ACTIVE") {
    notFound();
  }

  const initials = getInitials(user.fullName);
  const avatarColor = stringToColor(user.username);
  const roleBadge = getRoleBadge(user.role);
  const teamMembership = user.teamMemberships[0];
  const isOwnProfile = session.userId === user.id;

  const allBadges: { label: string; color: string }[] = [roleBadge];

  if (teamMembership?.role === "TEAM_LEADER") {
    allBadges.push({ label: "Team Leader", color: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20" });
  } else if (teamMembership) {
    allBadges.push({ label: "Team Member", color: "bg-blue-500/15 text-blue-400 border-blue-500/20" });
  }

  for (const dm of user.divisionMemberships) {
    const divLabel = DIVISION_LABELS[dm.division.name] ?? dm.division.name;
    allBadges.push({
      label: dm.role === "HEAD" ? `Head of ${divLabel}` : divLabel,
      color: dm.role === "HEAD"
        ? "bg-violet-500/15 text-violet-400 border-violet-500/20"
        : "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    });
  }

  return (
    <DashboardShell user={session}>
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Back */}
        <Link
          href="/dashboard/members"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Members
        </Link>

        {/* Profile Card */}
        <div className="bg-[#161b22] border border-white/8 rounded-2xl overflow-hidden">
          {/* Header band */}
          <div className="h-28 bg-gradient-to-r from-indigo-900/40 via-violet-900/30 to-indigo-900/40 relative">
            <div className="absolute bottom-0 left-6 translate-y-1/2">
              {user.profile?.avatarUrl ? (
                <img
                  src={user.profile.avatarUrl}
                  alt={user.fullName}
                  className="w-20 h-20 rounded-full border-4 border-[#161b22] object-cover"
                />
              ) : (
                <div
                  className="w-20 h-20 rounded-full border-4 border-[#161b22] flex items-center justify-center text-2xl font-bold text-white"
                  style={{ background: avatarColor }}
                >
                  {initials}
                </div>
              )}
            </div>

            {/* Own profile edit button */}
            {isOwnProfile && (
              <div className="absolute top-3 right-4">
                <Link
                  href="/dashboard/profile"
                  className="text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white rounded-lg transition-colors border border-white/15"
                >
                  Edit Profile
                </Link>
              </div>
            )}
          </div>

          <div className="pt-14 px-6 pb-6">
            {/* Name + username */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-white">{user.fullName}</h1>
              <p className="text-sm text-white/50 flex items-center gap-1.5 mt-0.5">
                <AtSign size={12} /> {user.username}
              </p>
            </div>

            {/* Role badges */}
            <div className="flex flex-wrap gap-2 mb-5">
              {allBadges.map((badge, i) => (
                <span
                  key={i}
                  className={cn("text-xs px-2.5 py-1 rounded-full border font-medium", badge.color)}
                >
                  {badge.label}
                </span>
              ))}
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap gap-5 text-xs text-white/50 mb-6">
              <span className="flex items-center gap-1.5">
                <Calendar size={12} /> Joined {formatDate(user.createdAt)}
              </span>
              {teamMembership && (
                <Link
                  href={`/dashboard/teams/${teamMembership.team.id}`}
                  className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors"
                >
                  <Users size={12} /> {teamMembership.team.name}
                </Link>
              )}
            </div>

            {/* Bio */}
            <div>
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Bio</p>
              <p className="text-sm text-white/70 leading-relaxed">
                {user.profile?.bio || (
                  <span className="italic text-white/30">No bio yet.</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Divisions */}
        {user.divisionMemberships.length > 0 && (
          <div className="bg-[#161b22] border border-white/8 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={14} className="text-white/30" />
              <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Divisi</h2>
            </div>
            <div className="space-y-3">
              {user.divisionMemberships.map((dm) => (
                <div key={dm.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <p className="text-sm text-white">
                    {DIVISION_LABELS[dm.division.name] ?? dm.division.name}
                  </p>
                  <span
                    className={cn(
                      "text-xs px-2.5 py-0.5 rounded-full border font-medium",
                      dm.role === "HEAD"
                        ? "bg-violet-500/15 text-violet-400 border-violet-500/20"
                        : "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                    )}
                  >
                    {dm.role === "HEAD" ? "Head" : "Staff"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
