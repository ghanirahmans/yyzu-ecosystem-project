import { Users, Settings, Link2 } from "lucide-react";
import { StatCard, QuickLink } from "./DashboardWidgets";

interface BphOverviewProps {
  totalDivisions: number;
  totalPrograms: number;
  totalOrgLinks: number;
}

export default function BphOverview({
  totalDivisions,
  totalPrograms,
  totalOrgLinks,
}: BphOverviewProps) {
  return (
    <div className="space-y-5">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Divisions"
          value={totalDivisions}
          icon={<Users size={15} />}
          color="indigo"
          href="/dashboard/divisions"
          delay="stagger-1"
        />
        <StatCard
          label="Active Programs"
          value={totalPrograms}
          icon={<Settings size={15} />}
          color="amber"
          href="/dashboard/programs"
          delay="stagger-2"
        />
        <StatCard
          label="Org-Wide Links"
          value={totalOrgLinks}
          icon={<Link2 size={15} />}
          color="violet"
          href="/dashboard/admin/links"
          delay="stagger-3"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-[#161b22] border border-white/8 rounded-2xl p-5 animate-slide-in-up stagger-3">
        <h2 className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-3.5">
          BPH Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <QuickLink href="/dashboard/divisions" icon={<Users size={14} />} label="Manage Divisions" />
          <QuickLink href="/dashboard/programs" icon={<Settings size={14} />} label="View Programs" />
          <QuickLink href="/dashboard/admin/links" icon={<Link2 size={14} />} label="Org Links" />
        </div>
      </div>
    </div>
  );
}
