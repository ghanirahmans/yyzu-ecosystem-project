import { ArrowRight } from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  GITHUB: "bg-gray-700/50 text-gray-300 border-gray-600/30",
  DISCORD: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  NOTION: "bg-white/10 text-white border-white/15",
  FIGMA: "bg-green-500/10 text-green-400 border-green-500/20",
  GOOGLE_DRIVE: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  DOCUMENTATION: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  OTHER: "bg-white/5 text-white/60 border-white/10",
};

interface OrgLink {
  id: string;
  title: string;
  url: string;
  category: string;
}

export default function OrgLinksWidget({ links }: { links: OrgLink[] }) {
  if (links.length === 0) return null;

  return (
    <div className="mb-6 bg-[#161b22] border border-white/8 rounded-2xl p-5 animate-slide-in-up stagger-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[11px] font-semibold text-white/40 uppercase tracking-widest">
          Link Penting YYZU
        </h2>
        <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-md font-mono font-semibold">
          Single Source of Truth
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {links.map((link) => {
          const borderColor = CATEGORY_COLORS[link.category] || CATEGORY_COLORS.OTHER;
          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border ${borderColor} hover:bg-white/5 transition-all duration-150 group`}
            >
              <span className="text-[11px] font-medium truncate group-hover:text-white transition-colors">
                {link.title}
              </span>
              <ArrowRight size={10} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
