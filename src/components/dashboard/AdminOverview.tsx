import Link from "next/link";
import { Users, Settings, Clock, ScrollText, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { StatCard, QuickLink } from "./DashboardWidgets";

interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  createdAt: Date;
  actor: { username: string; fullName: string } | null;
}

interface AdminOverviewProps {
  totalUsers: number;
  totalTeams: number;
  pendingApprovals: number;
  recentLogs: AuditLog[];
}

export default function AdminOverview({
  totalUsers,
  totalTeams,
  pendingApprovals,
  recentLogs,
}: AdminOverviewProps) {
  return (
    <div className="space-y-5">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Registered Users"
          value={totalUsers}
          icon={<Users size={15} />}
          color="indigo"
          href="/dashboard/admin/users"
          delay="stagger-1"
        />
        <StatCard
          label="Total Project Teams"
          value={totalTeams}
          icon={<Settings size={15} />}
          color="violet"
          href="/dashboard/admin/teams"
          delay="stagger-2"
        />
        <StatCard
          label="Pending User Approvals"
          value={pendingApprovals}
          icon={<Clock size={15} />}
          color="amber"
          href="/dashboard/admin/users"
          badge={pendingApprovals > 0}
          delay="stagger-3"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-[#161b22] border border-white/8 rounded-2xl p-5 animate-slide-in-up stagger-3">
        <h2 className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-3.5">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <QuickLink href="/dashboard/admin/users" icon={<Users size={14} />} label="Manage Users" />
          <QuickLink href="/dashboard/admin/teams" icon={<Settings size={14} />} label="Manage Teams" />
          <QuickLink href="/dashboard/admin/audit" icon={<ScrollText size={14} />} label="Audit Logs" />
        </div>
      </div>

      {/* Recent Audit Logs */}
      <div className="bg-[#161b22] border border-white/8 rounded-2xl p-5 animate-slide-in-up stagger-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[13px] font-semibold text-white">Recent Audit Logs</h2>
          <Link href="/dashboard/admin/audit" className="text-[12px] text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1">
            View all <ArrowRight size={10} />
          </Link>
        </div>
        {recentLogs.length === 0 ? (
          <p className="text-[13px] text-white/30 text-center py-4">No audit logs recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between border-b border-white/4 pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="text-[13px] font-medium text-white">{log.action}</p>
                  <p className="text-[11px] text-white/40 mt-0.5">
                    {log.entityType} ({log.entityId}) · By {log.actor?.fullName || "@" + log.actor?.username || "System"}
                  </p>
                </div>
                <span className="text-[11px] text-white/30 font-mono tabular-nums">
                  {formatDate(log.createdAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
