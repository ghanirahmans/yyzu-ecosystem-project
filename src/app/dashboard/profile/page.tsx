import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/dashboard/ProfileForm";

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect("/dashboard/login");
  }

  // Fetch current user and profile
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      profile: true,
    },
  });

  if (!user) {
    redirect("/dashboard/login");
  }

  // Fetch current team membership
  const membership = await prisma.teamMembership.findFirst({
    where: { userId: user.id, leftAt: null },
    include: {
      team: true,
    },
  });

  return (
    <ProfileForm
      user={user}
      teamName={membership?.team.name ?? null}
      teamRole={membership?.role ?? null}
      session={session}
    />
  );
}
