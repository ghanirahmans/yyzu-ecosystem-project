import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: {
    default: "Dashboard — YYZU",
    template: "%s | YYZU Dashboard",
  },
  description: "YYZU Internal Operational System",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  
  if (session) {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });
    if (!user) {
      redirect("/dashboard/login?clear=1");
    }
  }

  return <>{children}</>;
}
