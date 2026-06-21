import { getSession, destroySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Clock, LogOut } from "lucide-react";

export default async function PendingPage() {
  const session = await getSession();

  if (!session) {
    redirect("/dashboard/login");
  }

  if (session.status !== "PENDING_APPROVAL") {
    redirect("/dashboard");
  }

  async function handleLogout() {
    "use server";
    await destroySession();
    redirect("/dashboard/login");
  }

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-[#161b22] border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
            <Clock size={32} className="text-amber-500 animate-pulse" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">Approval Pending</h1>
          <p className="text-sm text-white/60 mb-6 leading-relaxed">
            Welcome to YYZU, <span className="font-semibold text-white">@{session.username}</span>!<br />
            Your account is currently waiting for administrator approval. Once approved, you'll gain access to the dashboard.
          </p>

          <div className="bg-white/5 border border-white/5 rounded-xl p-4 mb-8 text-left text-xs font-mono space-y-1.5 text-white/50">
            <div><span className="text-white/30">Username:</span> {session.username}</div>
            <div><span className="text-white/30">Role:</span> {session.role}</div>
            <div><span className="text-white/30">Status:</span> {session.status}</div>
          </div>

          <form action={handleLogout}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#21262d] hover:bg-[#30363d] text-white/80 hover:text-white font-semibold text-sm py-3 rounded-xl transition-colors border border-white/10"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
