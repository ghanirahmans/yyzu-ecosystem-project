"use client";

// ============================================================
// YYZU Admin System — Dashboard Shell Component
// Props-based layout without Zustand. Supports mobile bottom nav.
// ============================================================

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Shield,
  LogOut,
  User,
  UserRound,
  Settings,
  ChevronRight,
  Bell,
  Home,
  ScrollText,
  Layers,
  Calendar,
  Briefcase,
  Sun,
  Moon,
} from "lucide-react";
import { cn, getInitials, stringToColor } from "@/lib/utils";

interface DashboardShellProps {
  children: React.ReactNode;
  user: {
    userId: string;
    username: string;
    role: string;
    status: string;
    fullName: string;
  };
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: <LayoutDashboard size={18} /> },
  { href: "/dashboard/divisions", label: "Divisions", icon: <Layers size={18} /> },
  { href: "/dashboard/programs", label: "Programs", icon: <Calendar size={18} /> },
  { href: "/dashboard/partnerships", label: "Partnerships", icon: <Briefcase size={18} /> },
  { href: "/dashboard/members", label: "Members", icon: <UserRound size={18} /> },
  { href: "/dashboard/team", label: "My Team", icon: <Users size={18} /> },
  { href: "/dashboard/teams", label: "Browse Teams", icon: <Home size={18} /> },
  { href: "/dashboard/profile", label: "My Profile", icon: <User size={18} /> },
  { href: "/dashboard/admin/users", label: "Manage Users", icon: <Shield size={18} />, adminOnly: true },
  { href: "/dashboard/admin/teams", label: "Manage Teams", icon: <Settings size={18} />, adminOnly: true },
  { href: "/dashboard/admin/audit", label: "Audit Log", icon: <ScrollText size={18} />, adminOnly: true },
];

export default function DashboardShell({ children, user }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = user.role === "SYSTEM_ADMIN";
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const initialTheme = savedTheme || (document.documentElement.classList.contains("dark") ? "dark" : "light");
    setTheme(initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/dashboard/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const visibleNav = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const userInitials = getInitials(user.fullName);
  const avatarColor = stringToColor(user.username);

  return (
    <div className="yyzu-dashboard min-h-screen bg-[#0d1117] text-white flex flex-col md:flex-row">
      {/* ── Sidebar (Desktop only, >=768px) ─────────────────── */}
      <aside className="hidden md:flex md:w-64 md:flex-col bg-[#161b22] border-r border-white/8 flex-shrink-0 h-screen sticky top-0">
        {/* Brand */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/8 flex-shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-black text-white">
              Y
            </div>
            <span className="font-bold text-sm text-white tracking-tight">YYZU Operasional</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {isAdmin && (
            <p className="px-2 mb-2 text-[10px] font-semibold tracking-widest text-white/30 uppercase">
              General
            </p>
          )}

          {visibleNav
            .filter((item) => !item.adminOnly)
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                  isActive(item.href)
                    ? "bg-indigo-500/15 text-indigo-400"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                )}
              >
                <span
                  className={cn(
                    "transition-colors",
                    isActive(item.href) ? "text-indigo-400" : "text-white/30 group-hover:text-white/60"
                  )}
                >
                  {item.icon}
                </span>
                {item.label}
                {isActive(item.href) && (
                  <ChevronRight size={12} className="ml-auto text-indigo-400" />
                )}
              </Link>
            ))}

          {isAdmin && (
            <>
              <p className="px-2 mt-5 mb-2 text-[10px] font-semibold tracking-widest text-white/30 uppercase">
                Administration
              </p>
              {visibleNav
                .filter((item) => item.adminOnly)
                .map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                      isActive(item.href)
                        ? "bg-rose-500/15 text-rose-400"
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <span
                      className={cn(
                        "transition-colors",
                        isActive(item.href) ? "text-rose-400" : "text-white/30 group-hover:text-white/60"
                      )}
                    >
                      {item.icon}
                    </span>
                    {item.label}
                    {isActive(item.href) && (
                      <ChevronRight size={12} className="ml-auto text-rose-400" />
                    )}
                  </Link>
                ))}
            </>
          )}
        </nav>

        {/* User Footer */}
        <div className="border-t border-white/8 p-3 flex-shrink-0">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: avatarColor }}
            >
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.fullName}</p>
              <p className="text-xs text-white/40 truncate">@{user.username}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-white/30 hover:text-rose-400 transition-colors flex-shrink-0"
              title="Logout"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 lg:px-6 bg-[#0d1117]/80 backdrop-blur-xl border-b border-white/8">
          {/* Brand/Breadcrumb */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-black text-white md:hidden">
              Y
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-white/30 hidden sm:inline">YYZU</span>
              <ChevronRight size={12} className="text-white/20 hidden sm:inline" />
              <span className="text-white font-medium">
                {NAV_ITEMS.find((n) => isActive(n.href))?.label ?? "Dashboard"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Notification bell */}
            <button className="relative p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
            </button>

            {/* Avatar */}
            <Link href="/dashboard/profile">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white cursor-pointer hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2 hover:ring-offset-[#0d1117] transition-all"
                style={{ background: avatarColor }}
              >
                {userInitials}
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>
      </div>

      {/* ── Bottom Nav (Mobile only, <768px) ─────────────────── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#161b22]/90 backdrop-blur-lg border-t border-white/8 flex justify-around items-center h-16 px-2">
        <Link
          href="/dashboard"
          className={cn(
            "flex flex-col items-center justify-center flex-1 py-1 text-center transition-colors",
            isActive("/dashboard") && pathname === "/dashboard" ? "text-indigo-400" : "text-white/40 hover:text-white"
          )}
        >
          <LayoutDashboard size={20} />
          <span className="text-[10px] mt-1">Overview</span>
        </Link>
        <Link
          href="/dashboard/teams"
          className={cn(
            "flex flex-col items-center justify-center flex-1 py-1 text-center transition-colors",
            isActive("/dashboard/teams") ? "text-indigo-400" : "text-white/40 hover:text-white"
          )}
        >
          <Home size={20} />
          <span className="text-[10px] mt-1">Teams</span>
        </Link>
        <Link
          href="/dashboard/team"
          className={cn(
            "flex flex-col items-center justify-center flex-1 py-1 text-center transition-colors",
            isActive("/dashboard/team") ? "text-indigo-400" : "text-white/40 hover:text-white"
          )}
        >
          <Users size={20} />
          <span className="text-[10px] mt-1">My Team</span>
        </Link>
        <Link
          href="/dashboard/profile"
          className={cn(
            "flex flex-col items-center justify-center flex-1 py-1 text-center transition-colors",
            isActive("/dashboard/profile") ? "text-indigo-400" : "text-white/40 hover:text-white"
          )}
        >
          <User size={20} />
          <span className="text-[10px] mt-1">Profile</span>
        </Link>
        <Link
          href="/dashboard/members"
          className={cn(
            "flex flex-col items-center justify-center flex-1 py-1 text-center transition-colors",
            isActive("/dashboard/members") ? "text-indigo-400" : "text-white/40 hover:text-white"
          )}
        >
          <UserRound size={20} />
          <span className="text-[10px] mt-1">Members</span>
        </Link>
        {isAdmin && (
          <Link
            href="/dashboard/admin/users"
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-1 text-center transition-colors",
              pathname.startsWith("/dashboard/admin") ? "text-rose-400" : "text-white/40 hover:text-white"
            )}
          >
            <Shield size={20} />
            <span className="text-[10px] mt-1">Admin</span>
          </Link>
        )}
      </div>
    </div>
  );
}
