import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Building, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { PartnershipType, PartnershipStatus, Prisma } from "@prisma/client";

const PARTNERSHIP_STATUS_LABELS: Record<PartnershipStatus, { label: string; color: string }> = {
  PROSPECT: { label: "Prospect", color: "bg-white/5 border-white/10 text-white/40" },
  CONTACTED: { label: "Contacted", color: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" },
  NEGOTIATING: { label: "Negotiating", color: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" },
  ACTIVE: { label: "Active", color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" },
  INACTIVE: { label: "Inactive", color: "bg-rose-500/10 border-rose-500/20 text-rose-400" },
};

const TYPE_LABELS: Record<PartnershipType, string> = {
  KAMPUS: "Kampus",
  INDUSTRI: "Industri",
  KOMUNITAS: "Komunitas",
  MENTOR_INDIVIDUAL: "Mentor Individual",
};

export const metadata = {
  title: "Partnerships | YYZU Admin",
  description: "Mengelola relasi kemitraan kampus dan industri YYZU.",
};

export default async function PartnershipsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string; q?: string; page?: string }>;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/dashboard/login");
  }

  const resolvedSearchParams = await searchParams;
  const activeStatus = resolvedSearchParams.status || "ALL";
  const activeType = resolvedSearchParams.type || "ALL";
  const searchQuery = resolvedSearchParams.q || "";
  const page = parseInt(resolvedSearchParams.page || "1", 10);
  const take = 20;
  const skip = (page - 1) * take;

  // Check if partnership manager (admin or PARTNERSHIP division member)
  const isManager = async () => {
    if (session.role === "SYSTEM_ADMIN") return true;
    const pDiv = await prisma.division.findUnique({ where: { name: "PARTNERSHIP" } });
    if (pDiv) {
      const membership = await prisma.divisionMembership.findFirst({
        where: {
          userId: session.userId,
          divisionId: pDiv.id,
          leftAt: null,
          user: {
            deletedAt: null,
            status: "ACTIVE",
          },
        },
      });
      return !!membership;
    }
    return false;
  };
  const canManage = await isManager();

  // Query conditions
  const whereClause: Prisma.PartnershipWhereInput = {};
  if (activeStatus !== "ALL") {
    whereClause.status = activeStatus as PartnershipStatus;
  }
  if (activeType !== "ALL") {
    whereClause.type = activeType as PartnershipType;
  }
  if (searchQuery) {
    whereClause.name = { contains: searchQuery, mode: "insensitive" };
  }

  const [partnerships, total] = await Promise.all([
    prisma.partnership.findMany({
      where: whereClause,
      include: {
        pic: {
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
    prisma.partnership.count({ where: whereClause }),
  ]);

  const totalPages = Math.ceil(total / take);

  const buildUrl = (targetPage: number) => {
    const params = new URLSearchParams();
    if (activeStatus !== "ALL") params.set("status", activeStatus);
    if (activeType !== "ALL") params.set("type", activeType);
    if (searchQuery) params.set("q", searchQuery);
    params.set("page", targetPage.toString());
    return `/dashboard/partnerships?${params.toString()}`;
  };

  const sanitizedPartnerships = partnerships.map((p) => ({
    ...p,
    contactName: canManage ? p.contactName : null,
    contactInfo: canManage ? p.contactInfo : null,
  }));

  const statuses: (PartnershipStatus | "ALL")[] = ["ALL", "PROSPECT", "CONTACTED", "NEGOTIATING", "ACTIVE", "INACTIVE"];
  const types: (PartnershipType | "ALL")[] = ["ALL", "KAMPUS", "INDUSTRI", "KOMUNITAS", "MENTOR_INDIVIDUAL"];

  return (
    <DashboardShell user={session}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Kemitraan & CRM</h1>
            <p className="text-sm text-white/40 mt-1">Kelola relasi eksternal dengan institusi, industri, komunitas, dan mentor.</p>
          </div>
          {canManage && (
            <Link
              id="create-partnership-btn"
              href="/dashboard/partnerships/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-600/10 border border-transparent"
            >
              <Plus size={16} />
              Tambah Mitra
            </Link>
          )}
        </div>

        {/* Filters and Search Bar */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Status Filters */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-white/3 border border-white/5 rounded-xl self-start">
              {statuses.map((status) => {
                const isActive = activeStatus === status;
                return (
                  <Link
                    key={status}
                    href={`/dashboard/partnerships?status=${status}&type=${activeType}${searchQuery ? `&q=${searchQuery}` : ""}`}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-white/10 text-white shadow-sm"
                        : "text-white/40 hover:text-white/70"
                    }`}
                  >
                    {status === "ALL" ? "Semua Status" : PARTNERSHIP_STATUS_LABELS[status]?.label || status}
                  </Link>
                );
              })}
            </div>

            {/* Search Input */}
            <form className="relative w-full lg:w-72" method="GET" action="/dashboard/partnerships">
              {activeStatus !== "ALL" && <input type="hidden" name="status" value={activeStatus} />}
              {activeType !== "ALL" && <input type="hidden" name="type" value={activeType} />}
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                name="q"
                placeholder="Cari nama mitra..."
                defaultValue={searchQuery}
                className="w-full bg-[#161b22] border border-white/8 hover:border-white/12 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
            </form>
          </div>

          {/* Type Filters */}
          <div className="flex flex-wrap gap-2 pb-2">
            {types.map((type) => {
              const isActive = activeType === type;
              return (
                <Link
                  key={type}
                  href={`/dashboard/partnerships?status=${activeStatus}&type=${type}${searchQuery ? `&q=${searchQuery}` : ""}`}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    isActive
                      ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 font-semibold"
                      : "bg-white/2 border-white/5 text-white/50 hover:border-white/10 hover:text-white/70"
                  }`}
                >
                  {type === "ALL" ? "Semua Tipe" : TYPE_LABELS[type]}
                </Link>
              );
            })}
          </div>
        </div>

        {/* CRM Partnerships Grid */}
        {sanitizedPartnerships.length === 0 ? (
          <div className="bg-[#161b22] border border-white/8 rounded-2xl p-12 text-center max-w-md mx-auto space-y-3">
            <Building size={32} className="mx-auto text-white/20 animate-pulse" />
            <h3 className="text-white font-semibold">Tidak Ada Mitra</h3>
            <p className="text-xs text-white/40">
              Tidak ditemukan mitra dengan filter pencarian saat ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sanitizedPartnerships.map((partner) => {
              const statusMeta = PARTNERSHIP_STATUS_LABELS[partner.status] || { label: partner.status, color: "bg-white/5 border-white/10 text-white/40" };
              const typeLabel = TYPE_LABELS[partner.type];

              return (
                <Link
                  key={partner.id}
                  href={`/dashboard/partnerships/${partner.id}`}
                  className="bg-[#161b22] border border-white/8 hover:border-white/15 hover:bg-white/1 rounded-2xl p-5 flex flex-col justify-between gap-4 group transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-start">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${statusMeta.color}`}>
                        {statusMeta.label}
                      </span>
                      <span className="text-[10px] text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10 font-medium">
                        {typeLabel}
                      </span>
                    </div>
                    <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug">
                      {partner.name}
                    </h3>
                    {partner.notes && (
                      <p className="text-xs text-white/50 line-clamp-2">
                        {partner.notes}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/5 space-y-2">
                    <div className="flex justify-between items-center text-[11px] text-white/40">
                      <span>Kontak:</span>
                      <span className="text-white/60 truncate max-w-[150px]">
                        {partner.contactName || "—"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-white/30">PIC Internal:</span>
                      {partner.pic ? (
                        <span className="font-medium text-white/70">👤 {partner.pic.fullName}</span>
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
