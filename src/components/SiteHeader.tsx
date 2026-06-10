"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navigation } from "../data/site";

export default function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/88 backdrop-blur-xl">
      <nav
        aria-label="Navigasi utama"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8"
      >
        <Link
          href="/"
          className="flex items-center gap-3 text-slate-950"
          aria-label="YYZU beranda"
          onClick={closeMenu}
          prefetch={false}
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
            <img
              src="/yyz-project-logo_ft.svg"
              alt=""
              width="24"
              height="24"
              decoding="async"
            />
          </span>
          <span className="text-base font-bold tracking-[0.18em]">YYZU</span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`text-sm font-medium transition hover:text-[#0015A5] ${
                isActive(item.href) ? "text-[#0015A5]" : "text-slate-600"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Link
          href="/join/"
          prefetch={false}
          className="hidden rounded-full bg-[#0015A5] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#00118a] lg:inline-flex"
        >
          Join
        </Link>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-lg border border-slate-200 text-slate-800 transition hover:border-slate-300 hover:bg-slate-50 lg:hidden"
          aria-label="Buka menu navigasi"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          onClick={toggleMenu}
        >
          <span className="sr-only">Menu</span>
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-5 rounded bg-current transition ${
                isOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            ></span>
            <span
              className={`absolute left-0 top-[7px] h-0.5 w-5 rounded bg-current transition ${
                isOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`absolute bottom-0 left-0 h-0.5 w-5 rounded bg-current transition ${
                isOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            ></span>
          </span>
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={`${isOpen ? "block" : "hidden"} border-t border-slate-200 bg-white px-5 py-4 shadow-sm lg:hidden`}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-1">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`rounded-lg px-3 py-3 text-sm font-semibold transition hover:bg-slate-50 hover:text-[#0015A5] ${
                isActive(item.href)
                  ? "bg-slate-50 text-[#0015A5]"
                  : "text-slate-700"
              }`}
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/join/"
            prefetch={false}
            className="mt-2 rounded-lg bg-[#0015A5] px-3 py-3 text-center text-sm font-semibold text-white"
            onClick={closeMenu}
          >
            Join YYZU
          </Link>
        </div>
      </div>
    </header>
  );
}
