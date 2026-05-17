"use client";

import Image from "next/image";
import { useState } from "react";

const navigation = [
  { label: "Tentang", href: "#tentang" },
  { label: "Visi", href: "#visi" },
  { label: "Fokus", href: "#fokus" },
  { label: "Aktivitas", href: "#aktivitas" },
  { label: "Ekosistem", href: "#ekosistem" },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/88 backdrop-blur-xl">
      <nav
        aria-label="Navigasi utama"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8"
      >
        <a
          href="#beranda"
          className="flex items-center gap-3 text-slate-950"
          aria-label="YYZU beranda"
          onClick={() => setIsOpen(false)}
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
            <Image
              src="/yyz-project-logo_ft.svg"
              alt=""
              width={24}
              height={24}
              priority
            />
          </span>
          <span className="text-base font-bold tracking-[0.18em]">YYZU</span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-[#0015A5]"
            >
              {item.label}
            </a>
          ))}
        </div>

        <a
          href="#kontak"
          className="hidden rounded-full bg-[#0015A5] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#00118a] md:inline-flex"
        >
          Hubungi
        </a>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-lg border border-slate-200 text-slate-800 transition hover:border-slate-300 hover:bg-slate-50 md:hidden"
          aria-label="Buka menu navigasi"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsOpen((value) => !value)}
        >
          <span className="sr-only">Menu</span>
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-5 rounded bg-current transition ${
                isOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] h-0.5 w-5 rounded bg-current transition ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 h-0.5 w-5 rounded bg-current transition ${
                isOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={`border-t border-slate-200 bg-white px-5 py-4 shadow-sm md:hidden ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-1">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-[#0015A5]"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#kontak"
            className="mt-2 rounded-lg bg-[#0015A5] px-3 py-3 text-center text-sm font-semibold text-white"
            onClick={() => setIsOpen(false)}
          >
            Hubungi YYZU
          </a>
        </div>
      </div>
    </header>
  );
}
