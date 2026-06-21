import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { DivisionName } from "@prisma/client";

// Metadata mapping
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

export const metadata = {
  title: "Divisions | YYZU Admin",
  description: "Struktur kepengurusan divisi dan BPH ekosistem YYZU.",
};

export default async function DivisionsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/dashboard/login");
  }

  // Fetch divisions and memberships
  const divisions = await prisma.division.findMany({
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
              fullName: true,
            },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <DashboardShell user={session}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Divisi & Kepengurusan</h1>
          <p className="text-sm text-white/60 mt-1">Struktur organisasi Badan Pengurus Harian (BPH) YYZU.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {divisions.map((div) => {
            const meta = DIVISION_LABELS[div.name] || {
              label: div.name,
              description: div.description || "",
              color: "from-white/5 to-white/5 border-white/10 text-white/60",
            };

            const heads = div.memberships.filter((m) => m.role === "HEAD");
            const staffCount = div.memberships.filter((m) => m.role === "STAFF").length;

            return (
              <div
                key={div.id}
                className={`group relative bg-gradient-to-br ${meta.color.split(" ").slice(0, 2).join(" ")} border border-white/8 hover:border-white/15 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className={`text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded border ${meta.color.split(" ").slice(2, 4).join(" ")} bg-white/10`}>
                      {meta.label}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {meta.label}
                    </h2>
                    <p className="text-xs text-white/70 mt-1.5 leading-relaxed">
                      {div.description || meta.description}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/5 space-y-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-white/50 block font-semibold mb-1">
                      Division Head
                    </span>
                    {heads.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {heads.map((h) => (
                          <span key={h.id} className="text-xs text-white font-medium">
                            👑 {h.user.fullName}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-white/50 italic">Belum ada Koordinator</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <div className="flex items-center gap-1 text-xs text-white/60">
                      <Users size={12} />
                      <span>{staffCount} Staff</span>
                    </div>

                    <Link
                      id={`view-div-${div.id}`}
                      href={`/dashboard/divisions/${div.id}`}
                      className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium group-hover:translate-x-0.5 transition-all"
                    >
                      Detail
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}
