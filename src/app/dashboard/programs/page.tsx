import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, Layers, Plus, Search, User, ChevronLeft, ChevronRight } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { ProgramStatus, ProgramApprovalStatus, Prisma } from "@prisma/client";

const PROGRAM_STATUS_LABELS: Record<ProgramStatus, { label: string; color: string }> = {
  DRAFT: { label: "Draft", color: "bg-white/5 border-white/10 text-white/40" },
  PERSIAPAN: { label: "Persiapan", color: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" },
  PUBLIKASI: { label: "Publikasi", color: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" },
  EVALUASI: { label: "Evaluasi", color: "bg-amber-500/10 border-amber-500/20 text-amber-400" },
  SELESAI: { label: "Selesai", color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" },
  DIBATALKAN: { label: "Dibatalkan", color: "bg-rose-500/10 border-rose-500/20 text-rose-400" },
};

const PROGRAM_APPROVAL_STATUS_LABELS: Record<ProgramApprovalStatus, { label: string; color: string }> = {
  PENDING: { label: "Menunggu Persetujuan", color: "bg-amber-500/15 border-amber-500/30 text-amber-400" },
  APPROVED: { label: "Disetujui", color: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" },
  REJECTED: { label: "Ditolak", color: "bg-rose-500/15 border-rose-500/30 text-rose-400" },
  DRAFT: { label: "Draft Ide (Belum Jalan)", color: "bg-blue-500/15 border-blue-500/30 text-blue-400" },
};

export const metadata = {
  title: "Programs | YYZU Admin",
  description: "Daftar program kerja dan event komunitas YYZU.",
};

export default async function ProgramsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/dashboard/login");
  }

  const resolvedSearchParams = await searchParams;
  const activeStatus = resolvedSearchParams.status || "ALL";
  const searchQuery = resolvedSearchParams.q || "";
  const page = parseInt(resolvedSearchParams.page || "1", 10);
  const take = 20;
  const skip = (page - 1) * take;

  const canCreate = session.status === "ACTIVE";

  // Build prisma query where clause
  const whereClause: Prisma.ProgramWhereInput = {};
  if (activeStatus !== "ALL") {
    whereClause.status = activeStatus as ProgramStatus;
  }
  if (searchQuery) {
    whereClause.title = { contains: searchQuery, mode: "insensitive" };
  }

  // Fetch programs with pagination and count
  const [programs, total] = await Promise.all([
    prisma.program.findMany({
      where: whereClause,
      include: {
        divisions: true,
        pic: {
          select: {
            fullName: true,
            username: true,
          },
        },
        author: {
          select: {
            fullName: true,
            username: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.program.count({ where: whereClause }),
  ]);

  const totalPages = Math.ceil(total / take);

  const buildUrl = (targetPage: number) => {
    const params = new URLSearchParams();
    if (activeStatus !== "ALL") params.set("status", activeStatus);
    if (searchQuery) params.set("q", searchQuery);
    params.set("page", targetPage.toString());
    return `/dashboard/programs?${params.toString()}`;
  };

  const statuses: (ProgramStatus | "ALL")[] = ["ALL", "DRAFT", "PERSIAPAN", "PUBLIKASI", "EVALUASI", "SELESAI", "DIBATALKAN"];

  return (
    <DashboardShell user={session}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Program & Event Kerja</h1>
            <p className="text-sm text-white/40 mt-1">Mengelola proyek, program kerja, dan ide/event yang sedang berjalan atau diusulkan di YYZU.</p>
          </div>
          {canCreate && (
            <Link
              id="create-program-btn"
              href="/dashboard/programs/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-600/10 border border-transparent"
            >
              <Plus size={16} />
              Buat Program
            </Link>
          )}
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-white/3 border border-white/5 rounded-xl self-start">
            {statuses.map((status) => {
              const isActive = activeStatus === status;
              return (
                <Link
                  key={status}
                  href={`/dashboard/programs?status=${status}${searchQuery ? `&q=${searchQuery}` : ""}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-white/10 text-white shadow-sm"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {status === "ALL" ? "Semua" : PROGRAM_STATUS_LABELS[status]?.label || status}
                </Link>
              );
            })}
          </div>

          {/* Search Input */}
          <form className="relative w-full md:w-72" method="GET" action="/dashboard/programs">
            {activeStatus !== "ALL" && <input type="hidden" name="status" value={activeStatus} />}
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              name="q"
              placeholder="Cari program..."
              defaultValue={searchQuery}
              className="w-full bg-[#161b22] border border-white/8 hover:border-white/12 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </form>
        </div>

        {/* Programs Grid */}
        {programs.length === 0 ? (
          <div className="bg-[#161b22] border border-white/8 rounded-2xl p-12 text-center max-w-md mx-auto space-y-3">
            <Layers size={32} className="mx-auto text-white/20 animate-pulse" />
            <h3 className="text-white font-semibold">Tidak Ada Program</h3>
            <p className="text-xs text-white/40">
              Tidak ditemukan program kerja dengan kriteria pencarian saat ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {programs.map((prog) => {
              const statusMeta = PROGRAM_STATUS_LABELS[prog.status] || { label: prog.status, color: "bg-white/5 border-white/10 text-white/40" };
              const approvalMeta = PROGRAM_APPROVAL_STATUS_LABELS[prog.approvalStatus] || { label: prog.approvalStatus, color: "bg-white/5 border-white/10 text-white/40" };
              const startFormatted = prog.startDate ? new Date(prog.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—";
              const endFormatted = prog.endDate ? new Date(prog.endDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—";

              return (
                <Link
                  key={prog.id}
                  href={`/dashboard/programs/${prog.id}`}
                  className="bg-[#161b22] border border-white/8 hover:border-white/15 hover:bg-white/1 rounded-2xl p-5 flex flex-col justify-between gap-4 group transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${approvalMeta.color}`}>
                        {approvalMeta.label}
                      </span>
                      {prog.approvalStatus === "APPROVED" && (
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${statusMeta.color}`}>
                          {statusMeta.label}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug">
                      {prog.title}
                    </h3>
                    
                    <p className="text-xs text-white/50 line-clamp-2">
                      {prog.description || "Tidak ada deskripsi."}
                    </p>

                    {/* Divisions Involved */}
                    {prog.divisions && prog.divisions.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {prog.divisions.map((d) => (
                          <span key={d.id} className="text-[9px] text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded">
                            🗂️ {d.name.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-white/40">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {startFormatted} - {endFormatted}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-white/40">
                      <span>Author: <strong className="text-white/60">@{prog.author?.username || "system"}</strong></span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-white/30">PIC:</span>
                      {prog.pic ? (
                        <span className="font-medium text-white/70">👤 {prog.pic.fullName}</span>
                      ) : (
                        <span className="text-white/30 italic">Belum ditentukan</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
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
