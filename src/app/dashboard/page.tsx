import { getSession } from "@/lib/auth";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ArrowRight, Plus, Search } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { UserRole, TeamRole, UserStatus, LinkScope } from "@prisma/client";
import InboundInvitations from "@/components/dashboard/InboundInvitations";
import OrgLinksWidget from "@/components/dashboard/OrgLinksWidget";
import { StreamingAdminStats } from "@/components/dashboard/StreamingAdminStats";
import { TalentaIntiBadge } from "@/components/dashboard/TalentaIntiBadge";
import AdminOverview from "@/components/dashboard/AdminOverview";
import BphOverview from "@/components/dashboard/BphOverview";
import TeamOverview from "@/components/dashboard/TeamOverview";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/dashboard/login");

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) redirect("/dashboard/login");

  const isAdmin = user.role === UserRole.FOUNDER || user.role === UserRole.KOORDINATOR_UMUM;
  const isBph = user.role === UserRole.FOUNDER || user.role === UserRole.KOORDINATOR_UMUM || user.role === UserRole.KEPALA_DIVISI;

  // ── Data containers ────────────────────────────────────────
  let currentTeam: any = null;
  let currentTeamRole: TeamRole | null = null;
  let teamMembersCount = 0;
  let teamLinksCount = 0;
  let submissionStatus: string | undefined;
  let isLeader = false;
  let pendingRequestsCount = 0;
  let inboundInvites: { id: string; expiresAt: Date; team: { name: string }; invitedByUser: { fullName: string } }[] = [];

  // Admin
  let pendingApprovals = 0;
  // BPH
  let totalDivisions = 0, totalPrograms = 0;

  // ── Admin: pending approvals only (rest streamed via Suspense) ──
  if (isAdmin) {
    pendingApprovals = await prisma.user.count({ where: { status: "PENDING_APPROVAL" as UserStatus } });
  }

  // ── Org links (shared) ─────────────────────────────────────
  const orgLinks = await prisma.usefulLink.findMany({
    where: { scope: "ORG" as LinkScope },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, url: true, category: true },
  });

  // ── BPH stats ──────────────────────────────────────────────
  if (isBph) {
    totalDivisions = await prisma.division.count();
    totalPrograms = await prisma.program.count();
  }

  // ── Member data ────────────────────────────────────────────
  if (!isAdmin) {
    const membership = await prisma.teamMembership.findFirst({
      where: { userId: user.id, leftAt: null },
      include: {
        team: {
          include: {
            memberships: { where: { leftAt: null }, include: { user: true } },
            usefulLinks: true,
            submissions: { orderBy: { createdAt: "desc" } },
          },
        },
      },
    });

    if (membership) {
      currentTeam = membership.team;
      currentTeamRole = membership.role;
      teamMembersCount = membership.team.memberships.length;
      teamLinksCount = membership.team.usefulLinks?.length ?? 0;
      const sub = membership.team.submissions?.[0] ?? null;
      submissionStatus = sub?.status as string | undefined;
      isLeader = currentTeamRole === TeamRole.TEAM_LEADER;

      if (isLeader) {
        pendingRequestsCount = await prisma.joinRequest.count({
          where: { teamId: currentTeam.id, status: "PENDING" },
        });
      }
    } else {
      const rawInvites = await prisma.invitation.findMany({
        where: { invitedUserId: user.id, status: "PENDING", expiresAt: { gt: new Date() } },
        include: { team: { select: { name: true } }, invitedByUser: { select: { fullName: true } } },
      });
      inboundInvites = rawInvites.map((invite) => ({
        id: invite.id,
        expiresAt: invite.expiresAt,
        team: invite.team,
        invitedByUser: invite.invitedByUser || { fullName: "System" },
      }));
    }
  }

  // ── Today's Focus ──────────────────────────────────────────
  const focusItems: { title: string; desc: string; href: string; type: "info" | "warning" | "success" }[] = [];

  if (isAdmin) {
    if (pendingApprovals > 0) focusItems.push({ title: "Persetujuan Anggota Baru", desc: `${pendingApprovals} akun baru menunggu verifikasi admin.`, href: "/dashboard/admin/approvals", type: "warning" });

    const sevenDays = new Date(Date.now() + 7 * 86400000);
    const ending = await prisma.program.count({ where: { endDate: { lte: sevenDays, gte: new Date() }, status: { notIn: ["SELESAI", "DIBATALKAN"] } } });
    if (ending > 0) focusItems.push({ title: "Evaluasi Program Kerja", desc: `${ending} program kerja divisi akan berakhir dalam 7 hari ke depan.`, href: "/dashboard/programs", type: "info" });

    const fourteenAgo = new Date(Date.now() - 14 * 86400000);
    const stale = await prisma.partnership.count({ where: { status: { in: ["CONTACTED", "NEGOTIATING"] }, updatedAt: { lte: fourteenAgo } } });
    if (stale > 0) focusItems.push({ title: "Tindak Lanjut Kemitraan", desc: `${stale} kemitraan perlu ditindaklanjuti.`, href: "/dashboard/partnerships", type: "warning" });
  } else if (isBph) {
    const sevenDays = new Date(Date.now() + 7 * 86400000);
    const ending = await prisma.program.count({ where: { endDate: { lte: sevenDays, gte: new Date() }, status: { notIn: ["SELESAI", "DIBATALKAN"] } } });
    if (ending > 0) focusItems.push({ title: "Monitoring Program Kerja", desc: `${ending} program lintas divisi akan berakhir dalam 7 hari.`, href: "/dashboard/programs", type: "info" });

    const fourteenAgo = new Date(Date.now() - 14 * 86400000);
    const stale = await prisma.partnership.count({ where: { status: { in: ["CONTACTED", "NEGOTIATING"] }, updatedAt: { lte: fourteenAgo } } });
    if (stale > 0) focusItems.push({ title: "Tindak Lanjut Kemitraan", desc: `${stale} kemitraan perlu ditindaklanjuti.`, href: "/dashboard/partnerships", type: "warning" });
  } else if (currentTeam) {
    if (isLeader && pendingRequestsCount > 0) focusItems.push({ title: "Permintaan Join Tim", desc: `${pendingRequestsCount} calon anggota mengajukan permintaan.`, href: "/dashboard/team", type: "warning" });

    if (isLeader) {
      const twoDays = new Date(Date.now() + 2 * 86400000);
      const expiring = await prisma.invitation.count({ where: { teamId: currentTeam.id, status: "PENDING", expiresAt: { lte: twoDays, gte: new Date() } } });
      if (expiring > 0) focusItems.push({ title: "Undangan Kedaluwarsa", desc: `${expiring} undangan masuk tim akan kedaluwarsa dalam 2 hari.`, href: "/dashboard/team", type: "info" });
    }

    if (!submissionStatus || !["SUBMITTED", "APPROVED"].includes(submissionStatus)) {
      focusItems.push({ title: "Submission Proyek Belum Dikumpul", desc: isLeader ? "Segera kumpulkan link submission akhir." : "Tim Anda belum mengumpulkan submission akhir.", href: "/dashboard/team", type: "warning" });
    }
  } else if (!isBph) {
    focusItems.push({ title: "Belum Memiliki Tim Proyek", desc: "Buat tim baru atau cari tim yang sudah ada.", href: "/dashboard/teams", type: "info" });
  }

  return (
    <DashboardShell user={session}>
      {/* Welcome + Quick Actions Grid */}
            <div className="mb-6 animate-slide-in-up">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                  <h1 className="text-[22px] font-bold text-white leading-snug">
                    Welcome back, <span className="text-indigo-400">{user.fullName.split(" ")[0]}</span> 👋
                  </h1>
                  <p className="text-[13px] text-white/40 mt-1.5">
                    {isAdmin ? "Platform Administrator Overview"
                      : currentTeam ? `You're in ${currentTeam.name} as ${isLeader ? "Team Leader" : "Member"}`
                      : "You're not in a team yet."}
                  </p>
                </div>

                {/* Quick Actions — contextual per role */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {isAdmin && (
                    <>
                      <Link href="/dashboard/admin/users"
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 rounded-lg transition-colors">
                        Manage Users
                      </Link>
                      <Link href="/dashboard/admin/approvals"
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 rounded-lg transition-colors">
                        {pendingApprovals > 0 ? `${pendingApprovals} Pending` : "Approvals"}
                      </Link>
                    </>
                  )}
                  {isBph && (
                    <>
                      <Link href="/dashboard/programs/create"
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 rounded-lg transition-colors">
                        + Program
                      </Link>
                      {isAdmin && (
                        <Link href="/dashboard/partnerships/create"
                          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 rounded-lg transition-colors">
                          + Partnership
                        </Link>
                      )}
                    </>
                  )}
                  {!currentTeam && !isBph && (
                    <Link href="/dashboard/teams/create"
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 rounded-lg transition-colors">
                      + Create Team
                    </Link>
                  )}
                  {currentTeam && (
                    <Link href="/dashboard/team"
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white/5 text-white/70 border border-white/10 hover:bg-white/8 rounded-lg transition-colors">
                      Open Workspace →
                    </Link>
                  )}
                </div>
              </div>
            </div>

      {user.role === "TALENTA_INTI" && <TalentaIntiBadge />}

      <OrgLinksWidget links={orgLinks} />

      {/* Today's Focus */}
      {focusItems.length > 0 && (
        <div className="mb-8 bg-[#161b22] border border-white/8 rounded-2xl p-5 space-y-4 animate-slide-in-up stagger-1">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-semibold text-white/40 uppercase tracking-widest">Fokus Hari Ini</h2>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-md font-mono font-semibold">Action Items</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {focusItems.map((f, i) => (
              <Link key={i} href={f.href}
                className="flex items-start gap-3 p-3.5 rounded-xl border border-white/5 bg-white/2 hover:bg-white/4 hover:border-white/10 transition-all duration-150 group">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 animate-pulse-soft ${f.type === "warning" ? "bg-amber-400" : f.type === "success" ? "bg-emerald-400" : "bg-cyan-400"}`} />
                <div className="flex-1 min-w-0">
                  <h4 className="text-[12px] font-semibold text-white group-hover:text-indigo-400 transition-colors">{f.title}</h4>
                  <p className="text-[11px] text-white/45 mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
                <ArrowRight size={11} className="text-white/15 group-hover:text-white/40 self-center ml-auto flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Admin stats — streamed via Suspense */}
      {isAdmin && (
        <Suspense fallback={<div className="animate-pulse bg-white/5 rounded-2xl h-48" />}>
          <StreamingAdminStats />
        </Suspense>
      )}
      {!isAdmin && isBph && <BphOverview totalDivisions={totalDivisions} totalPrograms={totalPrograms} totalOrgLinks={orgLinks.length} />}

      {/* No Team */}
      {!currentTeam && !isAdmin && !isBph && (
        <div className="space-y-4">
          <InboundInvitations invitations={inboundInvites} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/dashboard/teams/create"
              className="group relative bg-[#161b22] border border-white/8 hover:border-indigo-500/30 rounded-2xl p-6 transition-all duration-200 hover:bg-[#1c2129]">
              <div className="w-10 h-10 bg-indigo-500/15 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-500/25 transition-colors">
                <Plus size={20} className="text-indigo-400" />
              </div>
              <h3 className="font-bold text-white mb-1">Create a Team</h3>
              <p className="text-sm text-white/40">Start a new team and become the Team Leader.</p>
              <ArrowRight size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
            </Link>
            <Link href="/dashboard/teams"
              className="group relative bg-[#161b22] border border-white/8 hover:border-violet-500/30 rounded-2xl p-6 transition-all duration-200 hover:bg-[#1c2129]">
              <div className="w-10 h-10 bg-violet-500/15 rounded-xl flex items-center justify-center mb-4 group-hover:bg-violet-500/25 transition-colors">
                <Search size={20} className="text-violet-400" />
              </div>
              <h3 className="font-bold text-white mb-1">Browse Teams</h3>
              <p className="text-sm text-white/40">Find an existing team and request to join.</p>
              <ArrowRight size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      )}

      {/* Has Team */}
      {currentTeam && (
        <TeamOverview
          name={currentTeam.name}
          status={currentTeam.status}
          membersCount={teamMembersCount}
          linksCount={teamLinksCount}
          submissionStatus={submissionStatus}
          isLeader={isLeader}
          pendingRequestsCount={pendingRequestsCount}
        />
      )}
    </DashboardShell>
  );
}
