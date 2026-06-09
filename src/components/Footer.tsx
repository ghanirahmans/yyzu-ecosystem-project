import { navigation } from "../data/site";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-6 md:grid-cols-[1.1fr_0.9fr_0.9fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-white">
              <img
                src="/yyz-project-logo_ft.svg"
                alt=""
                width="26"
                height="26"
                decoding="async"
              />
            </span>
            <span className="font-bold tracking-[0.18em]">YYZU</span>
          </div>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
            Collaborative technology ecosystem dan talent bridge yang menghubungkan
            kampus, talenta teknologi, mentor praktisi, dan industri untuk tumbuh bersama lewat
            pembelajaran kolaboratif, mentoring, simulasi workflow, dan pengerjaan project brief terarah.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
            Navigation
          </h3>
          <div className="mt-4 grid gap-3">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-slate-300 transition hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
            Contact
          </h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-300">
            <span>
              Email:{" "}
              <a href="mailto:yyzuecosystem@gmail.com" className="hover:text-white">
                yyzuecosystem@gmail.com
              </a>
            </span>

            <span>
              LinkedIn:{" "}
              <a
                href="https://www.linkedin.com/in/yyzu-ecosystem"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                yyzu-ecosystem
              </a>
            </span>
            <span>
              Instagram:{" "}
              <a
                href="https://instagram.com/yyzuecosystem"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                yyzuecosystem
              </a>
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-slate-400">
        Copyright 2026 YYZU. All rights reserved.
      </div>
    </footer>
  );
}
