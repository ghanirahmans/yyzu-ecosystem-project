"use client";

// ============================================================
// YYZU Operational Dashboard — Dashboard Shell Component
// Props-based layout. Supports mobile bottom nav.
// ============================================================

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/dashboard/Breadcrumbs";
import { CommandPalette } from "@/components/dashboard/CommandPalette";
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
  GraduationCap,
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
  bphOnly?: boolean;
  mentorOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: <LayoutDashboard size={16} /> },
  { href: "/dashboard/divisions", label: "Divisions", icon: <Layers size={16} /> },
  { href: "/dashboard/programs", label: "Programs", icon: <Calendar size={16} /> },
  { href: "/dashboard/partnerships", label: "Partnerships", icon: <Briefcase size={16} /> },
  { href: "/dashboard/members", label: "Members", icon: <UserRound size={16} /> },
  { href: "/dashboard/team", label: "My Team", icon: <Users size={16} /> },
  { href: "/dashboard/teams", label: "Browse Teams", icon: <Home size={16} /> },
  { href: "/dashboard/profile", label: "My Profile", icon: <User size={16} /> },
  { href: "/dashboard/mentor", label: "Mentor", icon: <GraduationCap size={16} />, mentorOnly: true },
  { href: "/dashboard/admin/users", label: "Manage Users", icon: <Shield size={16} />, adminOnly: true },
  { href: "/dashboard/admin/teams", label: "Manage Teams", icon: <Settings size={16} />, adminOnly: true },
  { href: "/dashboard/admin/audit", label: "Audit Log", icon: <ScrollText size={16} />, adminOnly: true },
  { href: "/dashboard/admin/links", label: "Org Links", icon: <Layers size={16} />, bphOnly: true },
];

export default function DashboardShell({ children, user }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = user.role === "FOUNDER" || user.role === "KOORDINATOR_UMUM";
  const isBph = user.role === "KOORDINATOR_UMUM" || user.role === "KEPALA_DIVISI";
  const isKetuaDewanMentor = user.role === "KETUA_DEWAN_MENTOR";
  const isMentor = isKetuaDewanMentor || user.role === "MENTOR" || isAdmin;
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

  const visibleNav = NAV_ITEMS.filter((item) => {
    if (item.adminOnly && !isAdmin) return false;
    if (item.bphOnly && !isBph) return false;
    if (item.mentorOnly && !isMentor) return false;
    return true;
  });

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const activeLabel = NAV_ITEMS.find((n) => isActive(n.href))?.label ?? "Dashboard";
  const userInitials = getInitials(user.fullName);
  const avatarColor = stringToColor(user.username);

  return (
    <div className="yyzu-dashboard min-h-screen bg-[#0d1117] text-white flex flex-col md:flex-row">
      {/* ── Sidebar (Desktop only, ≥768px) ─────────────────── */}
      <aside
        className="hidden md:flex md:w-60 md:flex-col bg-[#161b22] border-r border-white/8 flex-shrink-0 h-screen sticky top-0"
        aria-label="Main navigation"
      >
        {/* Brand */}
        <div className="flex items-center px-4 h-14 border-b border-white/8 flex-shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2.5 group" aria-label="YYZU Operasional — dashboard home">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#0015A5] to-[#006A67] flex items-center justify-center text-[11px] font-black text-white flex-shrink-0 shadow-sm">
              Y
            </div>
            <span className="font-bold text-[13px] text-white tracking-tight leading-none">YYZU Operasional</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto" aria-label="Sidebar navigation">
          {(isAdmin || isBph) && (
            <p className="px-2 mb-2 pt-1 text-[10px] font-semibold tracking-widest text-white/25 uppercase select-none">
              General
            </p>
          )}

          {visibleNav
            .filter((item) => !item.adminOnly && !item.bphOnly)
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 focus-visible:ring-offset-[#161b22]",
                  isActive(item.href)
                    ? "bg-indigo-500/12 text-indigo-400"
                    : "text-white/45 hover:text-white/90 hover:bg-white/5"
                )}
              >
                <span
                  className={cn(
                    "flex-shrink-0 transition-colors",
                    isActive(item.href) ? "text-indigo-400" : "text-white/25 group-hover:text-white/55"
                  )}
                >
                  {item.icon}
                </span>
                {item.label}
                {isActive(item.href) && (
                  <ChevronRight size={11} className="ml-auto text-indigo-400/60" />
                )}
              </Link>
            ))}

          {/* BPH Section */}
          {isBph && visibleNav.filter((item) => item.bphOnly).length > 0 && (
            <>
              <p className="px-2 mt-5 mb-2 text-[10px] font-semibold tracking-widest text-yellow-400/40 uppercase select-none">
                BPH
              </p>
              {visibleNav
                .filter((item) => item.bphOnly)
                .map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-1 focus-visible:ring-offset-[#161b22]",
                      isActive(item.href)
                        ? "bg-yellow-500/12 text-yellow-400"
                        : "text-white/45 hover:text-white/90 hover:bg-white/5"
                    )}
                  >
                    <span
                      className={cn(
                        "flex-shrink-0 transition-colors",
                        isActive(item.href) ? "text-yellow-400" : "text-white/25 group-hover:text-white/55"
                      )}
                    >
                      {item.icon}
                    </span>
                    {item.label}
                    {isActive(item.href) && (
                      <ChevronRight size={11} className="ml-auto text-yellow-400/60" />
                    )}
                  </Link>
                ))}
            </>
          )}

          {isAdmin && (
            <>
              <p className="px-2 mt-5 mb-2 text-[10px] font-semibold tracking-widest text-white/25 uppercase select-none">
                Administration
              </p>
              {visibleNav
                .filter((item) => item.adminOnly)
                .map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-1 focus-visible:ring-offset-[#161b22]",
                      isActive(item.href)
                        ? "bg-rose-500/12 text-rose-400"
                        : "text-white/45 hover:text-white/90 hover:bg-white/5"
                    )}
                  >
                    <span
                      className={cn(
                        "flex-shrink-0 transition-colors",
                        isActive(item.href) ? "text-rose-400" : "text-white/25 group-hover:text-white/55"
                      )}
                    >
                      {item.icon}
                    </span>
                    {item.label}
                    {isActive(item.href) && (
                      <ChevronRight size={11} className="ml-auto text-rose-400/60" />
                    )}
                  </Link>
                ))}
            </>
          )}
        </nav>

        {/* User Footer */}
        <div className="border-t border-white/8 p-2.5 flex-shrink-0">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
              style={{ background: avatarColor }}
              aria-hidden="true"
            >
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-white truncate leading-tight">{user.fullName}</p>
              <p className="text-[11px] text-white/35 truncate">@{user.username}</p>
            </div>
            {user.role === "FOUNDER" && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-purple-600/10 text-purple-400/70 border border-purple-600/10 flex-shrink-0">
                Founder
              </span>
            )}
            {user.role === "KEPALA_DIVISI" && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-yellow-400/10 text-yellow-400/70 border border-yellow-400/10 flex-shrink-0">
                Ketua Divisi
              </span>
            )}
            {user.role === "KOORDINATOR_UMUM" && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-rose-500/10 text-rose-400/70 border border-rose-500/10 flex-shrink-0">
                BPH
              </span>
            )}
            {isKetuaDewanMentor && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-violet-500/10 text-violet-400/70 border border-violet-500/10 flex-shrink-0">
                KETUA MENTOR
              </span>
            )}
            <button
              onClick={handleLogout}
              className="text-white/25 hover:text-rose-400 transition-colors flex-shrink-0 p-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              aria-label="Sign out of your account"
              title="Sign out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 lg:px-5 bg-[#0d1117]/85 backdrop-blur-xl border-b border-white/8">
          {/* Mobile brand + Breadcrumb */}
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-md bg-gradient-to-br from-[#0015A5] to-[#006A67] flex items-center justify-center text-[11px] font-black text-white md:hidden"
              aria-hidden="true"
            >
              Y
            </div>
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px]">
              <span className="text-white/30 hidden sm:inline font-medium">YYZU</span>
              <ChevronRight size={11} className="text-white/18 hidden sm:inline" aria-hidden="true" />
              <span className="text-white font-semibold">{activeLabel}</span>
            </nav>
          </div>

          <div className="flex items-center gap-1">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-white/35 hover:text-white hover:bg-white/5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Notification bell */}
            <button
              className="relative p-2 rounded-lg text-white/35 hover:text-white hover:bg-white/5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label="Notifications — 1 unread"
              title="Notifications"
            >
              <Bell size={16} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full" aria-hidden="true" />
            </button>

            {/* Cmd+K quick search */}
            <CommandPalette role={user.role} />

            {/* Avatar */}
            <Link
              href="/dashboard/profile"
              aria-label="Go to your profile"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-full"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white cursor-pointer hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2 hover:ring-offset-[#0d1117] transition-all"
                style={{ background: avatarColor }}
                aria-hidden="true"
              >
                {userInitials}
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-5 overflow-auto animate-fade-in">
          <Breadcrumbs className="mb-2" />
          {children}
        </main>
      </div>

      {/* ── Bottom Nav (Mobile only, <768px) ─────────────────── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#161b22]/95 backdrop-blur-xl border-t border-white/8 flex justify-around items-center h-16 px-1"
        aria-label="Mobile bottom navigation"
      >
        <Link
          href="/dashboard"
          aria-current={pathname === "/dashboard" ? "page" : undefined}
          aria-label="Overview"
          className={cn(
            "flex flex-col items-center justify-center flex-1 py-1 text-center transition-colors focus-visible:outline-none",
            pathname === "/dashboard" ? "text-indigo-400" : "text-white/35 hover:text-white/70"
          )}
        >
          <LayoutDashboard size={19} />
          <span className="text-[9px] mt-1 font-medium">Overview</span>
        </Link>
        <Link
          href="/dashboard/teams"
          aria-current={isActive("/dashboard/teams") ? "page" : undefined}
          aria-label="Browse Teams"
          className={cn(
            "flex flex-col items-center justify-center flex-1 py-1 text-center transition-colors focus-visible:outline-none",
            isActive("/dashboard/teams") ? "text-indigo-400" : "text-white/35 hover:text-white/70"
          )}
        >
          <Home size={19} />
          <span className="text-[9px] mt-1 font-medium">Teams</span>
        </Link>
        <Link
          href="/dashboard/team"
          aria-current={isActive("/dashboard/team") ? "page" : undefined}
          aria-label="My Team"
          className={cn(
            "flex flex-col items-center justify-center flex-1 py-1 text-center transition-colors focus-visible:outline-none",
            isActive("/dashboard/team") ? "text-indigo-400" : "text-white/35 hover:text-white/70"
          )}
        >
          <Users size={19} />
          <span className="text-[9px] mt-1 font-medium">My Team</span>
        </Link>
        <Link
          href="/dashboard/profile"
          aria-current={isActive("/dashboard/profile") ? "page" : undefined}
          aria-label="My Profile"
          className={cn(
            "flex flex-col items-center justify-center flex-1 py-1 text-center transition-colors focus-visible:outline-none",
            isActive("/dashboard/profile") ? "text-indigo-400" : "text-white/35 hover:text-white/70"
          )}
        >
          <User size={19} />
          <span className="text-[9px] mt-1 font-medium">Profile</span>
        </Link>
        <Link
          href="/dashboard/members"
          aria-current={isActive("/dashboard/members") ? "page" : undefined}
          aria-label="Members"
          className={cn(
            "flex flex-col items-center justify-center flex-1 py-1 text-center transition-colors focus-visible:outline-none",
            isActive("/dashboard/members") ? "text-indigo-400" : "text-white/35 hover:text-white/70"
          )}
        >
          <UserRound size={19} />
          <span className="text-[9px] mt-1 font-medium">Members</span>
        </Link>
        {isAdmin && (
          <Link
            href="/dashboard/admin/users"
            aria-current={pathname.startsWith("/dashboard/admin") ? "page" : undefined}
            aria-label="Admin panel"
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-1 text-center transition-colors focus-visible:outline-none",
              pathname.startsWith("/dashboard/admin") ? "text-rose-400" : "text-white/35 hover:text-white/70"
            )}
          >
            <Shield size={19} />
            <span className="text-[9px] mt-1 font-medium">Admin</span>
          </Link>
        )}
      </nav>
    </div>
  );
}
