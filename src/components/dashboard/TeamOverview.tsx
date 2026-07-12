import Link from "next/link";
import { Users, Link2, Send, ArrowRight } from "lucide-react";
import { StatCard } from "./DashboardWidgets";

interface TeamOverviewProps {
  name: string;
  status: string;
  membersCount: number;
  linksCount: number;
  submissionStatus?: string;
  isLeader: boolean;
  pendingRequestsCount: number;
}

export default function TeamOverview({
  name,
  status,
  membersCount,
  linksCount,
  submissionStatus,
  isLeader,
  pendingRequestsCount,
}: TeamOverviewProps) {
  return (
    <div className="space-y-6">
      {status === "SUSPENDED" && (
        <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-sm text-amber-400">
          <span>Your team is currently suspended. Actions are read-only until the administrator lifts the suspension.</span>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Members" value={membersCount} icon={<Users size={15} />} color="indigo" href="/dashboard/team" delay="stagger-1" />
        <StatCard label="Useful Links" value={linksCount} icon={<Link2 size={15} />} color="violet" href="/dashboard/team" delay="stagger-2" />
        <StatCard
          label="Submission"
          value={
            submissionStatus === "APPROVED"
              ? "Selesai"
              : submissionStatus === "REVISION"
              ? "Revisi"
              : submissionStatus === "SUBMITTED"
              ? "Menunggu Review"
              : "Belum Dikumpul"
          }
          icon={<Send size={15} />}
          color={
            submissionStatus === "APPROVED"
              ? "emerald"
              : submissionStatus === "REVISION"
              ? "rose"
              : submissionStatus === "SUBMITTED"
              ? "indigo"
              : "amber"
          }
          href="/dashboard/team"
          delay="stagger-3"
        />
        {isLeader && (
          <StatCard
            label="Join Requests"
            value={pendingRequestsCount}
            icon={<Users size={15} />}
            color="rose"
            href="/dashboard/team"
            badge={pendingRequestsCount > 0}
            delay="stagger-4"
          />
        )}
      </div>

      <div className="bg-[#161b22] border border-white/8 rounded-2xl p-5 animate-slide-in-up stagger-3">
        <h2 className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-3.5">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {[
            { href: "/dashboard/team", label: "Team Workspace" },
            { href: "/dashboard/team#links", label: "Useful Links" },
            { href: "/dashboard/team#submission", label: "Final Submission" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/4 hover:bg-white/8 text-[13px] text-white/55 hover:text-white transition-all duration-150 group"
            >
              {item.label}
              <ArrowRight size={11} className="ml-auto text-white/15 group-hover:text-white/40" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
