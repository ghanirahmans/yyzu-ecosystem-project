"use client";

import { usePathname } from "next/navigation";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isCustomLayout = pathname?.startsWith("/docs") || pathname?.startsWith("/dashboard");

  if (isCustomLayout) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-slate-900">
      <SiteHeader />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
