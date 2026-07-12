import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Link2, ArrowRight } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function AdminLinksPage() {
  const session = await getSession();

  if (!session) {
    redirect("/dashboard/login");
  }

  if (session.role !== "FOUNDER" && session.role !== "KOORDINATOR_UMUM" && session.role !== "KEPALA_DIVISI") {
    redirect("/dashboard");
  }

  const links = await prisma.usefulLink.findMany({
    where: { scope: "ORG" },
    orderBy: { createdAt: "desc" },
    include: {
      creator: {
        select: { username: true, fullName: true },
      },
    },
  });

  return (
    <DashboardShell user={session}>
      <div className="space-y-6">
        <div>
          <h1 className="text-[22px] font-bold text-white">Organization Links</h1>
          <p className="text-[13px] text-white/40 mt-1">
            Kelola tautan penting yang muncul di dashboard semua anggota YYZU.
          </p>
        </div>

        <div className="bg-[#161b22] border border-white/8 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[11px] font-semibold text-white/40 uppercase tracking-widest">
              All Org Links ({links.length})
            </h2>
          </div>

          {links.length === 0 ? (
            <p className="text-[13px] text-white/30 text-center py-8">No organization links yet.</p>
          ) : (
            <div className="space-y-2">
              {links.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/2 hover:bg-white/4 transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      {link.title}
                    </a>
                    <p className="text-[11px] text-white/40 mt-0.5 truncate">{link.url}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] bg-white/5 text-white/40 px-1.5 py-0.5 rounded-md">
                        {link.category}
                      </span>
                      <span className="text-[10px] text-white/30">
                        by @{link.creator?.username || "unknown"}
                      </span>
                    </div>
                  </div>
                  <form
                    action={async () => {
                      "use server";
                      const { validateActiveUser } = await import("@/lib/guards");
                      const { deleteOrgLink } = await import("@/features/team/service");
                      const actor = await validateActiveUser();
                      await deleteOrgLink(actor, link.id);
                      revalidatePath("/dashboard/admin/links");
                    }}
                  >
                    <button
                      type="submit"
                      className="text-[11px] text-rose-400/60 hover:text-rose-400 transition-colors px-2 py-1 rounded-md hover:bg-rose-500/10"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
