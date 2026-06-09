"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

export function DocTOCHeader() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-9 w-full rounded-lg bg-fd-accent/20 animate-pulse mb-4" />;
  }

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex items-center justify-between rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/80 p-1 w-full shadow-xs backdrop-blur-xs">
        <button
          onClick={() => setTheme("light")}
          className={`flex items-center justify-center flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all duration-200 ${
            theme === "light"
              ? "bg-white text-slate-950 shadow-xs font-bold border border-slate-200/60"
              : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
          title="Light Mode"
        >
          <Sun className="size-3.5 mr-1" />
          Light
        </button>
        <button
          onClick={() => setTheme("dark")}
          className={`flex items-center justify-center flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all duration-200 ${
            theme === "dark"
              ? "bg-[#0015A5] text-white shadow-xs font-bold"
              : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
          title="Dark Mode"
        >
          <Moon className="size-3.5 mr-1" />
          Dark
        </button>
        <button
          onClick={() => setTheme("system")}
          className={`flex items-center justify-center flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all duration-200 ${
            theme === "system"
              ? "bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs font-bold border border-slate-200/60 dark:border-slate-700/50"
              : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
          title="System Default"
        >
          <Monitor className="size-3.5 mr-1" />
          System
        </button>
      </div>
    </div>
  );
}
