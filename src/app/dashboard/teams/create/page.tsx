import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CreateTeamForm from "@/components/dashboard/CreateTeamForm";

export default async function CreateTeamPage() {
  const session = await getSession();

  // Redirect unauthenticated users to login
  if (!session) {
    redirect("/dashboard/login");
  }

  // Prevent mentors from accessing the create-team page
  if (session.role === "MENTOR") {
    redirect("/dashboard/teams");
  }

  // Check if current user is already in a team (skip for admin/Founder)
  if (session.role !== "FOUNDER" && session.role !== "KOORDINATOR_UMUM") {
    const membership = await prisma.teamMembership.findFirst({
      where: { userId: session.userId, leftAt: null },
    });

    if (membership) {
      redirect("/dashboard/team");
    }
  }

  return <CreateTeamForm session={session} />;
}
