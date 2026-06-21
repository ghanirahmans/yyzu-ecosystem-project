import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CreateTeamForm from "@/components/dashboard/CreateTeamForm";

export default async function CreateTeamPage() {
  const session = await getSession();

  if (!session) {
    redirect("/dashboard/login");
  }

  // Check if current user is already in a team
  const membership = await prisma.teamMembership.findFirst({
    where: { userId: session.userId, leftAt: null },
  });

  if (membership) {
    redirect("/dashboard/team");
  }

  return <CreateTeamForm session={session} />;
}
