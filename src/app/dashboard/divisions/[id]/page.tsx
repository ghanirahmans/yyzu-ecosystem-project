import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, ShieldCheck } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import DivisionMemberManager from "@/components/dashboard/DivisionMemberManager";
import { DivisionName } from "@prisma/client";

const DIVISION_LABELS: Record<DivisionName, { label: string; description: string; color: string }> = {
  PARTNERSHIP: {
    label: "Partnership",
    description: "Mengelola hubungan eksternal dengan kampus, industri, komunitas, dan mentor.",
    color: "from-cyan-500/10 to-teal-500/10 border-cyan-500/20 text-cyan-400",
  },
  SDM_MANAGEMENT: {
    label: "SDM & Management",
    description: "Fokus pada pengembangan internal anggota, keaktifan, dan kesejahteraan komunitas.",
    color: "from-purple-500/10 to-indigo-500/10 border-purple-500/20 text-purple-400",
  },
  EVENT_ORGANIZER: {
    label: "Event Organizer",
    description: "Merancang dan mengeksekusi program kerja, webinar, hackathon, dan gathering.",
    color: "from-pink-500/10 to-rose-500/10 border-pink-500/20 text-pink-400",
  },
  PRODUCT_PROJECT_MANAGEMENT: {
    label: "Product & Project Management",
    description: "Mengawasi jalannya proyek internal, timeline, dan koordinasi antar tim proyek.",
    color: "from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-400",
  },
  LEARNING_CURRICULUM: {
    label: "Learning & Curriculum",
    description: "Menyusun silabus pembelajaran, mentoring session, dan peningkatan skill tech members.",
    color: "from-emerald-500/10 to-green-500/10 border-emerald-500/20 text-emerald-400",
  },
  MEDIA_BRANDING: {
    label: "Media & Branding",
    description: "Mengelola publikasi media sosial, desain grafis, dokumentasi, dan citra YYZU.",
    color: "from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-400",
  },
  KOORDINATOR_UMUM: {
    label: "Koordinator Umum (BPH)",
    description: "Pengurus Harian Utama yang memimpin arah strategis organisasi YYZU.",
    color: "from-violet-500/10 to-fuchsia-500/10 border-violet-500/20 text-violet-400",
  },
};

const PROGRAM_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Draft", color: "bg-white/5 border-white/10 text-white/40" },
  PERSIAPAN: { label: "Persiapan", color: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" },
  PUBLIKASI: { label: "Publikasi", color: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" },
  EVALUASI: { label: "Evaluasi", color: "bg-amber-500/10 border-amber-500/20 text-amber-400" },
  SELESAI: { label: "Selesai", color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" },
  DIBATALKAN: { label: "Dibatalkan", color: "bg-rose-500/10 border-rose-500/20 text-rose-400" },
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const division = await prisma.division.findUnique({ where: { id } });
  const label = division ? (DIVISION_LABELS[division.name]?.label || division.name) : "Division";
  return {
    title: `${label} Division | YYZU Admin`,
  };
}

export default async function DivisionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();

  if (!session) {
    redirect("/dashboard/login");
  }

  const { id } = await params;
  const division = await prisma.division.findUnique({
    where: { id },
    include: {
      memberships: {
        where: {
          leftAt: null,
          user: {
            deletedAt: null,
            status: "ACTIVE",
          },
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
            },
          },
        },
        orderBy: { joinedAt: "asc" },
      },
      programs: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!division) {
    notFound();
  }

  const meta = DIVISION_LABELS[division.name] || {
    label: division.name,
    description: division.description || "",
    color: "from-white/5 to-white/5 border-white/10 text-white/60",
  };

  const isAdmin = session.role === "SYSTEM_ADMIN";
  const userMembership = division.memberships.find((m) => m.userId === session.userId);
  const isDivisionMember = !!userMembership || isAdmin;

  return (
    <DashboardShell user={session}>
      <div className="space-y-6">
        {/* Back */}
        <Link
          href="/dashboard/divisions"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          Kembali ke Divisi
        </Link>

        {/* Division Header */}
        <div className={`bg-gradient-to-r ${meta.color.split(" ").slice(0, 2).join(" ")} border border-white/8 rounded-2xl p-6`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className={`text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded border ${meta.color.split(" ").slice(2, 4).join(" ")} bg-white/3`}>
                Divisi
              </span>
              <h1 className="text-2xl font-bold text-white mt-2">{meta.label}</h1>
              <p className="text-sm text-white/60 mt-1 max-w-2xl">{division.description || meta.description}</p>
            </div>
            {isAdmin && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                <ShieldCheck size={14} /> Admin Mode
              </span>
            )}
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Member Management (2/3 width on desktop) */}
          <div className="lg:col-span-2 space-y-6">
            <DivisionMemberManager divisionId={division.id} memberships={division.memberships} isAdmin={isAdmin} />
          </div>

          {/* Programs Sidebar (1/3 width) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white text-sm">Program Divisi ({division.programs.length})</h3>
              {isDivisionMember && (
                <Link
                  href={`/dashboard/programs/create?divisionId=${division.id}`}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Buat Program
                </Link>
              )}
            </div>
            
            {division.programs.length === 0 ? (
              <div className="bg-[#161b22] border border-white/8 rounded-2xl p-5 text-center text-white/30 text-xs italic">
                Belum ada program untuk divisi ini.
              </div>
            ) : (
              <div className="grid gap-3">
                {division.programs.map((prog) => {
                  const statusMeta = PROGRAM_STATUS_LABELS[prog.status] || { label: prog.status, color: "bg-white/5 border-white/10 text-white/40" };
                  const startFormatted = prog.startDate ? new Date(prog.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : "—";
                  const endFormatted = prog.endDate ? new Date(prog.endDate).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : "—";

                  return (
                    <Link
                      key={prog.id}
                      href={`/dashboard/programs/${prog.id}`}
                      className="bg-[#161b22] border border-white/8 hover:border-white/15 hover:bg-white/1 rounded-2xl p-4 flex flex-col justify-between gap-3 group transition-all duration-300"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-1.5">
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${statusMeta.color}`}>
                            {statusMeta.label}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">
                          {prog.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] text-white/40">
                        <Calendar size={10} />
                        <span>{startFormatted} - {endFormatted}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
