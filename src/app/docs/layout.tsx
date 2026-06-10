import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { source } from "@/lib/source";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      sidebar={{
        prefetch: false,
      }}
      themeSwitch={{
        enabled: false,
      }}
      nav={{
        title: (
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded bg-white shadow-sm ring-1 ring-slate-200">
              <img
                src="/yyz-project-logo_ft.svg"
                alt="YYZU Logo"
                width="18"
                height="18"
              />
            </span>
            <span className="font-bold tracking-[0.1em] text-slate-950 dark:text-slate-50">YYZU Docs</span>
          </div>
        ),
      }}
    >
      {children}
    </DocsLayout>
  );
}
