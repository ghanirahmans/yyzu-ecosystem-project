"use client";

import {
  Code,
  BookOpen,
  Pen,
  MessageSquare,
  HardDrive,
  KanbanSquare,
  FileText,
  Link2,
  Trash2,
} from "lucide-react";

const CATEGORY_ICON: Record<string, React.ReactNode> = {
  GITHUB: <Code size={16} />,
  NOTION: <BookOpen size={16} />,
  FIGMA: <Pen size={16} />,
  DISCORD: <MessageSquare size={16} />,
  GOOGLE_DRIVE: <HardDrive size={16} />,
  JIRA: <KanbanSquare size={16} />,
  DOCUMENTATION: <FileText size={16} />,
  OTHER: <Link2 size={16} />,
};

interface UsefulLink {
  id: string;
  title: string;
  url: string;
  category: string;
  notes: string | null;
}

interface UsefulLinkCardProps {
  link: UsefulLink;
  onDelete?: (id: string) => void;
  canDelete?: boolean;
}

export default function UsefulLinkCard({
  link,
  onDelete,
  canDelete,
}: UsefulLinkCardProps) {
  const icon = CATEGORY_ICON[link.category] ?? CATEGORY_ICON.OTHER;

  return (
    <div className="group relative bg-gray-900/50 rounded-2xl p-4 border border-white/[0.08] hover:border-white/20 transition-all">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/60">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-white hover:text-indigo-300 transition-colors line-clamp-1"
          >
            {link.title}
          </a>
          {link.notes && (
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">
              {link.notes}
            </p>
          )}
        </div>
        {canDelete && onDelete && (
          <button
            onClick={() => onDelete(link.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 p-1.5 text-white/25 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg"
            title="Delete link"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </div>
  );
}
