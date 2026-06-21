import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  Users,
  Link2,
  Send,
  ArrowRight,
  Plus,
  Search,
  Mail,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Shield,
  Settings,
  ScrollText,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import InboundInvitations from "@/components/dashboard/InboundInvitations";
import { cn, formatDate, getInitials, stringToColor } from "@/lib/utils";
import Link from "next/link";
import { UserStatus, UserRole, TeamRole } from "@prisma/client";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/dashboard/login");
  }

  // Fetch current user details to check status/role
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  if (!user) {
    redirect("/dashboard/login");
  }

  const isAdmin = user.role === UserRole.SYSTEM_ADMIN;

  // ── Gather Data based on Role ───────────────────────────────
  let currentTeam = null;
  let currentTeamRole: TeamRole | null = null;
  let members: any[] = [];
  let links: any[] = [];
  let submission: any = null;
  let pendingRequestsCount = 0;
  let inboundInvites: any[] = [];

  // Admin specific stats
  let totalUsers = 0;
  let totalTeams = 0;
  let pendingApprovals = 0;
  let recentLogs: any[] = [];

  if (isAdmin) {
    totalUsers = await prisma.user.count({ where: { deletedAt: null } });
    totalTeams = await prisma.team.count({ where: { deletedAt: null } });
    pendingApprovals = await prisma.user.count({ where: { status: UserStatus.PENDING_APPROVAL } });
    recentLogs = await prisma.auditLog.findMany({
      take: 5,
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
  } else {
    // Regular member data gathering
    const membership = await prisma.teamMembership.findFirst({
      where: { userId: user.id, leftAt: null },
      include: {
        team: {
          include: {
            memberships: {
              where: { leftAt: null },
              include: {
                user: true,
              },
            },
            usefulLinks: true,
            submissions: {
              orderBy: { createdAt: "desc" },
            },
          },
        },
      },
    });

    if (membership) {
      currentTeam = membership.team;
      currentTeamRole = membership.role;
      members = membership.team.memberships;
      links = membership.team.usefulLinks;
      submission = membership.team.submissions[0] || null;

      if (currentTeamRole === TeamRole.TEAM_LEADER) {
        pendingRequestsCount = await prisma.joinRequest.count({
          where: { teamId: currentTeam.id, status: "PENDING" },
        });
      }
    } else {
      // Teamless member: fetch inbound invitations
      inboundInvites = await prisma.invitation.findMany({
        where: {
          invitedUserId: user.id,
          status: "PENDING",
          expiresAt: { gt: new Date() },
        },
        include: {
          team: {
            select: { name: true },
          },
          invitedByUser: {
            select: { fullName: true },
          },
        },
      });
    }
  }

  const isLeader = currentTeamRole === TeamRole.TEAM_LEADER;

  // --- Today's Focus Data Gather ---
  const todaysFocus: { title: string; desc: string; href: string; type: "info" | "warning" | "success" }[] = [];

  if (isAdmin) {
    if (pendingApprovals > 0) {
      todaysFocus.push({
        title: "Persetujuan Anggota Baru",
        desc: `${pendingApprovals} akun baru menunggu verifikasi admin.`,
        href: "/dashboard/admin/approvals",
        type: "warning",
      });
    }

    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const endingPrograms = await prisma.program.count({
      where: {
        endDate: { lte: sevenDaysFromNow, gte: new Date() },
        status: { notIn: ["SELESAI", "DIBATALKAN"] },
      },
    });
    if (endingPrograms > 0) {
      todaysFocus.push({
        title: "Evaluasi Program Kerja",
        desc: `${endingPrograms} program kerja divisi akan berakhir dalam 7 hari ke depan.`,
        href: "/dashboard/programs",
        type: "info",
      });
    }

    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    const stalePartnerships = await prisma.partnership.count({
      where: {
        status: { in: ["CONTACTED", "NEGOTIATING"] },
        updatedAt: { lte: fourteenDaysAgo },
      },
    });
    if (stalePartnerships > 0) {
      todaysFocus.push({
        title: "Tindak Lanjut Kemitraan",
        desc: `${stalePartnerships} prospek atau negosiasi kemitraan belum di-update selama 14 hari.`,
        href: "/dashboard/partnerships",
        type: "warning",
      });
    }
  } else {
    if (currentTeam) {
      if (isLeader && pendingRequestsCount > 0) {
        todaysFocus.push({
          title: "Permintaan Join Tim",
          desc: `${pendingRequestsCount} calon anggota mengajukan permintaan untuk bergabung ke tim Anda.`,
          href: "/dashboard/team",
          type: "warning",
        });
      }

      if (isLeader) {
        const twoDaysFromNow = new Date();
        twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
        const expiringInvitesCount = await prisma.invitation.count({
          where: {
            teamId: currentTeam.id,
            status: "PENDING",
            expiresAt: { lte: twoDaysFromNow, gte: new Date() },
          },
        });
        if (expiringInvitesCount > 0) {
          todaysFocus.push({
            title: "Undangan Kedaluwarsa",
            desc: `${expiringInvitesCount} undangan masuk tim akan kedaluwarsa dalam 2 hari.`,
            href: "/dashboard/team",
            type: "info",
          });
        }
      }

      if (!submission || (submission.status !== "SUBMITTED" && submission.status !== "APPROVED")) {
        todaysFocus.push({
          title: "Submission Proyek Belum Dikumpul",
          desc: isLeader 
            ? "Segera kumpulkan link submission akhir proyek tim Anda." 
            : "Tim Anda belum mengumpulkan submission akhir. Silakan ingatkan Team Leader Anda!",
          href: "/dashboard/team",
          type: "warning",
        });
      }
    } else {
      todaysFocus.push({
        title: "Belum Memiliki Tim Proyek",
        desc: "Buat tim baru atau cari tim yang sudah ada untuk mulai mendaftarkan submission proyek.",
        href: "/dashboard/teams",
        type: "info",
      });
    }
  }

  return (
    <DashboardShell user={session}>
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          Welcome back, <span className="text-indigo-400">{user.fullName.split(" ")[0]}</span> 👋
        </h1>
        <p className="text-sm text-white/40 mt-1">
          {isAdmin
            ? "Platform Administrator Overview"
            : currentTeam
            ? `You're in ${currentTeam.name} as ${isLeader ? "Team Leader" : "Member"}`
            : "You're not in a team yet."}
        </p>
      </div>

      {/* Today's Focus Widget */}
      {todaysFocus.length > 0 && (
        <div className="mb-8 bg-[#161b22] border border-white/8 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
              Fokus Hari Ini
            </h2>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-mono font-semibold">
              Action Items
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {todaysFocus.map((focus, idx) => (
              <Link
                key={idx}
                href={focus.href}
                className="flex items-start gap-3 p-3.5 rounded-xl border border-white/5 bg-white/2 hover:bg-white/4 hover:border-white/10 transition-all group"
              >
                <div className={cn(
                  "w-2 h-2 rounded-full mt-1.5 flex-shrink-0 animate-pulse",
                  focus.type === "warning" ? "bg-amber-500" :
                  focus.type === "success" ? "bg-emerald-500" : "bg-cyan-500"
                )} />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {focus.title}
                  </h4>
                  <p className="text-[11px] text-white/50 mt-0.5 leading-relaxed">
                    {focus.desc}
                  </p>
                </div>
                <ArrowRight size={12} className="text-white/20 group-hover:text-white/40 self-center ml-auto flex-shrink-0 transition-all group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Admin Overview State ───────────────────────────────── */}
      {isAdmin && (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Total Registered Users"
              value={totalUsers}
              icon={<Users size={16} />}
              color="indigo"
              href="/dashboard/admin/users"
            />
            <StatCard
              label="Total Project Teams"
              value={totalTeams}
              icon={<Settings size={16} />}
              color="violet"
              href="/dashboard/admin/teams"
            />
            <StatCard
              label="Pending User Approvals"
              value={pendingApprovals}
              icon={<Clock size={16} />}
              color="amber"
              href="/dashboard/admin/users"
              badge={pendingApprovals > 0}
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-[#161b22] border border-white/8 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
              Admin Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <QuickLink href="/dashboard/admin/users" icon={<Users size={15} />} label="Manage Users" />
              <QuickLink href="/dashboard/admin/teams" icon={<Settings size={15} />} label="Manage Teams" />
              <QuickLink href="/dashboard/admin/audit" icon={<ScrollText size={15} />} label="Audit Logs" />
            </div>
          </div>

          {/* Recent Audit Logs */}
          <div className="bg-[#161b22] border border-white/8 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">Recent Audit Logs</h2>
              <Link href="/dashboard/admin/audit" className="text-xs text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1">
                View all <ArrowRight size={11} />
              </Link>
            </div>
            {recentLogs.length === 0 ? (
              <p className="text-sm text-white/30 text-center py-4">No audit logs recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {recentLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between border-b border-white/4 pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium text-white">{log.action}</p>
                      <p className="text-xs text-white/40">
                        {log.entityType} ({log.entityId}) · By {log.actor?.fullName || "@" + log.actor?.username || "System"}
                      </p>
                    </div>
                    <span className="text-xs text-white/30 font-mono">
                      {formatDate(log.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── No Team State ─────────────────────────────────────── */}
      {!currentTeam && !isAdmin && (
        <div className="space-y-4">
          {/* Invitations list */}
          <InboundInvitations invitations={inboundInvites} />

          {/* CTA Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/dashboard/teams/create"
              className="group relative bg-[#161b22] border border-white/8 hover:border-indigo-500/30 rounded-2xl p-6 transition-all duration-200 hover:bg-[#1c2129]"
            >
              <div className="w-10 h-10 bg-indigo-500/15 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-500/25 transition-colors">
                <Plus size={20} className="text-indigo-400" />
              </div>
              <h3 className="font-bold text-white mb-1">Create a Team</h3>
              <p className="text-sm text-white/40">Start a new team and become the Team Leader.</p>
              <ArrowRight size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/dashboard/teams"
              className="group relative bg-[#161b22] border border-white/8 hover:border-violet-500/30 rounded-2xl p-6 transition-all duration-200 hover:bg-[#1c2129]"
            >
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

      {/* ── Has Team: Stats Grid ──────────────────────────────── */}
      {currentTeam && (
        <div className="space-y-6">
          {/* Team suspended warning */}
          {currentTeam.status === "SUSPENDED" && (
            <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-sm text-amber-400">
              <AlertTriangle size={16} className="flex-shrink-0" />
              Your team is currently suspended. Actions are read-only until the administrator lifts the suspension.
            </div>
          )}

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Members"
              value={members.length}
              icon={<Users size={16} />}
              color="indigo"
              href="/dashboard/team"
            />
            <StatCard
              label="Useful Links"
              value={links.length}
              icon={<Link2 size={16} />}
              color="violet"
              href="/dashboard/team"
            />
            <StatCard
              label="Submission"
              value={
                submission?.status === "APPROVED"
                  ? "Selesai"
                  : submission?.status === "REVISION"
                  ? "Revisi"
                  : submission?.status === "SUBMITTED"
                  ? "Menunggu Review"
                  : "Belum Dikumpul"
              }
              icon={<Send size={16} />}
              color={
                submission?.status === "APPROVED"
                  ? "emerald"
                  : submission?.status === "REVISION"
                  ? "rose"
                  : submission?.status === "SUBMITTED"
                  ? "indigo"
                  : "amber"
              }
              href="/dashboard/team"
            />
            {isLeader && (
              <StatCard
                label="Join Requests"
                value={pendingRequestsCount}
                icon={<Clock size={16} />}
                color="rose"
                href="/dashboard/team"
                badge={pendingRequestsCount > 0}
              />
            )}
          </div>

          {/* Quick navigation */}
          <div className="bg-[#161b22] border border-white/8 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <QuickLink href="/dashboard/team" icon={<Users size={15} />} label="Team Workspace" />
              <QuickLink href="/dashboard/team#links" icon={<Link2 size={15} />} label="Useful Links" />
              <QuickLink href="/dashboard/team#submission" icon={<Send size={15} />} label="Final Submission" />
            </div>
          </div>

          {/* Recent members */}
          <div className="bg-[#161b22] border border-white/8 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">Team Members</h2>
              <Link href="/dashboard/team" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
                View all <ArrowRight size={11} />
              </Link>
            </div>
            <div className="space-y-2.5">
              {members.slice(0, 4).map(({ user: memberUser, role }) => {
                const initials = getInitials(memberUser.fullName);
                const color = stringToColor(memberUser.username);
                return (
                  <div key={memberUser.id} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: color }}
                    >
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{memberUser.fullName}</p>
                      <p className="text-xs text-white/40">@{memberUser.username}</p>
                    </div>
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-medium",
                        role === TeamRole.TEAM_LEADER
                          ? "bg-indigo-500/15 text-indigo-400"
                          : "bg-white/5 text-white/40"
                      )}
                    >
                      {role === TeamRole.TEAM_LEADER ? "Leader" : "Member"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

// ── Sub-components ─────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
  color,
  href,
  badge,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: "indigo" | "violet" | "emerald" | "amber" | "rose";
  href: string;
  badge?: boolean;
}) {
  const colorMap = {
    indigo: "bg-indigo-500/10 text-indigo-400",
    violet: "bg-violet-500/10 text-violet-400",
    emerald: "bg-emerald-500/10 text-emerald-400",
    amber: "bg-amber-500/10 text-amber-400",
    rose: "bg-rose-500/10 text-rose-400",
  };

  return (
    <Link
      href={href}
      className="relative bg-[#161b22] border border-white/8 hover:border-white/15 rounded-2xl p-4 transition-all duration-200 hover:bg-[#1c2129] group block"
    >
      {badge && (
        <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
      )}
      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-3", colorMap[color])}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-white/40 mt-0.5">{label}</p>
    </Link>
  );
}

function QuickLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/4 hover:bg-white/8 text-sm text-white/60 hover:text-white transition-all group"
    >
      <span className="text-white/30 group-hover:text-indigo-400 transition-colors">{icon}</span>
      {label}
      <ArrowRight size={12} className="ml-auto text-white/20 group-hover:text-white/40 transition-colors" />
    </Link>
  );
}
