"use client";

import { Calendar } from "lucide-react";

interface TOCFooterProps {
  lastUpdated?: string | Date;
}

function formatDate(dateStr: string | Date | undefined) {
  if (!dateStr) return "";
  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  if (isNaN(date.getTime())) return String(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function DocTOCFooter({ lastUpdated }: TOCFooterProps) {
  if (!lastUpdated) return null;

  const formattedDate = formatDate(lastUpdated);

  return (
    <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/85 text-xs text-slate-500/90 dark:text-slate-400/90 flex items-center gap-1.5">
      <Calendar className="size-3.5" />
      <span>Last updated: {formattedDate}</span>
    </div>
  );
}
