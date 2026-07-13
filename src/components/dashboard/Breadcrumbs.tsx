"use client";

// ============================================================
// YYZU Breadcrumbs — auto-build from pathname segments
//
// Reads `pathname`, maps segments to human labels via
// a central registry (SEGMENT_LABELS). When a segment is an
// ID (UUID / cuid), it resolves the label from an async
// resolver map passed as prop.
//
// Industry pattern: Linear.app / Vercel-style auto breadcrumb.
// ============================================================

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Label registry ──────────────────────────────────────────

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  admin: "Admin",
  users: "Users",
  teams: "Teams",
  approvals: "Approvals",
  audit: "Audit",
  links: "Links",
  divisions: "Divisions",
  programs: "Programs",
  partnerships: "Partnerships",
  members: "Members",
  mentor: "Mentor",
  team: "My Team",
  create: "Create",
  settings: "Settings",
  profile: "Profile",
  register: "Register",
  login: "Login",
  pending: "Pending",
  browse: "Browse",
};

// ── Props ───────────────────────────────────────────────────

interface BreadcrumbsProps {
  /** Map of [segment] → label for ID-style segments (UUIDs/slugs) */
  idLabels?: Record<string, string>;
  /** Custom override for specific paths */
  customLabels?: Record<string, string>;
  className?: string;
}

// ── ID detection ────────────────────────────────────────────

const UUIDISH = /^[A-Za-z0-9]{20,}$|^[a-f0-9-]{20,}$/;

function isIdSegment(segment: string): boolean {
  return UUIDISH.test(segment) || /^[^/]{3,36}$/.test(segment);
}

// ── Component ───────────────────────────────────────────────

export function Breadcrumbs({
  idLabels = {},
  customLabels = {},
  className,
}: BreadcrumbsProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Build breadcrumb items
  const items = segments.reduce<
    { label: string; href: string; isLast: boolean }[]
  >((acc, seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    const isLast = idx === segments.length - 1;

    let label: string;
    if (customLabels[seg]) {
      label = customLabels[seg];
    } else if (isIdSegment(seg) && idLabels[seg]) {
      label = idLabels[seg];
    } else if (SEGMENT_LABELS[seg]) {
      label = SEGMENT_LABELS[seg];
    } else {
      // Shorten UUID for display
      label = seg.length > 12 ? seg.slice(0, 8) + "..." : seg;
    }

    acc.push({ label, href, isLast });
    return acc;
  }, []);

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center gap-1.5 text-[12px] text-white/45 mb-4 overflow-x-auto scrollbar-none",
        className,
      )}
    >
      <Link
        href="/dashboard"
        className="flex items-center gap-1 hover:text-white/80 transition-colors flex-shrink-0"
      >
        <Home size={12} />
      </Link>
      {items.map((item) => (
        <div key={item.href} className="flex items-center gap-1.5 flex-shrink-0">
          <ChevronRight size={10} className="text-white/20" />
          {item.isLast ? (
            <span className="text-white/70 font-medium">{item.label}</span>
          ) : (
            <Link
              href={item.href}
              className="hover:text-white/80 transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}