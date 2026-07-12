"use client";

import { useRouter } from "next/navigation";
import { Link2 } from "lucide-react";
import UsefulLinkCard from "@/components/dashboard/UsefulLinkCard";

interface UsefulLink {
  id: string;
  title: string;
  url: string;
  category: string;
  notes: string | null;
}

interface UsefulLinkListProps {
  title: string;
  links: UsefulLink[];
  onDelete?: (id: string) => void;
  canDelete?: boolean;
  emptyMessage?: string;
}

export default function UsefulLinkList({
  title,
  links,
  onDelete,
  canDelete,
  emptyMessage,
}: UsefulLinkListProps) {
  const router = useRouter();

  return (
    <div>
      <h3 className="text-sm font-semibold text-white mb-3">{title}</h3>
      {links.length === 0 ? (
        <div className="bg-gray-900/50 border border-white/[0.08] border-dashed rounded-2xl p-8 text-center">
          <Link2 size={24} className="mx-auto mb-2 text-white/15" />
          <p className="text-sm text-gray-400">
            {emptyMessage ?? "No links yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((link) => (
            <UsefulLinkCard
              key={link.id}
              link={link}
              onDelete={onDelete}
              canDelete={canDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
