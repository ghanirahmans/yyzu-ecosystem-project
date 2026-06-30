import { ArrowRight } from "lucide-react";
import Link from "next/link";
import CtaBand from "../components/CtaBand";
import InfoCard from "../components/InfoCard";
import Section from "../components/Section";
import {
  activities,
  bridgeCards,
  currentFocus,
  ecosystemRoles,
  modelSteps,
  whyYYZU,
  learningPillars,
  expertiseTracks,
  projectCategories,
} from "../data/site";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "YYZU Ecosystem",
    alternateName: ["YYZU", "Yeyzu", "YYZU Ecosystem", "Yeyzu Ecosystem"],
    founder: {
      "@type": "Person",
      name: "Ghaniyyir Rahman Sudarsono",
      url: "https://github.com/ghanirahmans",
    },
    url: "https://yyzu.tech",
    logo: "https://yyzu.tech/yyz-project-logo_ft.svg",
    description:
      "YYZU adalah collaborative technology ecosystem dan talent bridge yang menghubungkan kampus, talenta teknologi, mentor praktisi, dan industri melalui kolaborasi aktif, mentoring, simulasi alur kerja, dan project-based growth.",
    slogan: "Bridging Campus, Talent, and Industry",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Medan",
      addressRegion: "Sumatera Utara",
      addressCountry: "ID",
    },
    sameAs: [
      "https://instagram.com/yyzuecosystem",
      "https://www.linkedin.com/in/yyzu-ecosystem",
      "https://github.com/ghanirahmans/yyzu-ecosystem-project",
    ],
    knowsAbout: [
      "Software Engineering",
      "UI/UX Design",
      "Product Management",
      "Collaborative Learning",
      "Agile Workflow Simulation",
      "Talent Development",
      "Tech Mentorship",
      "Industry Readiness",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section
        className="relative isolate overflow-hidden bg-white text-slate-950"
        aria-labelledby="hero-heading"
        style={{
          background:
            "linear-gradient(135deg, rgba(0,21,165,0.06) 0%, rgba(255,255,255,1) 42%, rgba(0,106,103,0.05) 100%)",
        }}
      >

        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-4xl flex-col items-center justify-center px-5 py-20 text-center sm:px-6 sm:py-24 lg:px-8">

          {/* Status badge */}
          <div
            className="mb-9 inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 py-1.5 shadow-sm animate-slide-in-up"
            role="status"
            aria-label="Ecosystem status: Batch 1 active"
            style={{ animationDelay: "0ms" }}
          >
            <span className="relative flex h-1.5 w-1.5 flex-shrink-0" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#006A67] opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#006A67]" />
            </span>
            <span className="text-xs font-semibold tracking-wide text-slate-500">
              Ecosystem Building Phase &mdash; Batch 1 Active
            </span>
          </div>

          {/* Main headline */}
          <h1
            id="hero-heading"
            className="mx-auto max-w-3xl text-balance text-5xl font-black leading-[1.07] tracking-tight text-slate-950 sm:text-6xl lg:text-[5rem] animate-slide-in-up"
            style={{ animationDelay: "80ms" }}
          >
            Where future{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #0015A5 0%, #006A67 100%)",
              }}
            >
              engineers
            </span>{" "}
            grow.
          </h1>

          <p
            className="mx-auto mt-7 max-w-xl text-balance text-base leading-7 text-slate-600 sm:text-[17px] sm:leading-[1.8] animate-slide-in-up"
            style={{ animationDelay: "160ms" }}
          >
            YYZU adalah ekosistem teknologi kolaboratif yang menjembatani mahasiswa,
            komunitas kampus, mentor praktisi, dan industri melalui proyek nyata,
            simulasi alur kerja, dan pendampingan terstruktur.
          </p>

          {/* CTAs */}
          <div
            className="mt-10 flex flex-wrap items-center justify-center gap-3 animate-slide-in-up"
            style={{ animationDelay: "240ms" }}
          >
            <Link
              href="/join/"
              prefetch={false}
              className="group inline-flex min-h-11 items-center justify-center rounded-full bg-[#0015A5] px-7 py-2.5 text-sm font-bold text-white shadow-md shadow-[#0015A5]/20 transition-all duration-200 hover:bg-[#00118a] hover:shadow-lg hover:shadow-[#0015A5]/25 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0015A5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f9fb]"
            >
              Join as Member
              <ArrowRight
                className="ml-2 size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="/docs/"
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-7 py-2.5 text-sm font-semibold text-slate-600 transition-all duration-200 hover:border-slate-300 hover:text-slate-900 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f9fb]"
            >
              Read the Docs
            </Link>
          </div>

          {/* Audience signal */}
          <p
            className="mt-5 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 animate-fade-in"
            style={{ animationDelay: "320ms" }}
          >
            For students &bull; mentors &bull; campus partners &bull; industry
          </p>

          {/* Growth model bar */}
          <div
            className="mt-14 flex flex-wrap items-center justify-center gap-x-0 gap-y-4 animate-fade-in"
            aria-label="YYZU growth model: Learn, Build, Collaborate, Grow"
            style={{ animationDelay: "420ms" }}
          >
            {modelSteps.map((step, i) => (
              <div key={step} className="flex items-center">
                <div className="px-5 text-center">
                  <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-slate-400">
                    0{i + 1}
                  </p>
                  <p className="mt-0.5 text-[13px] font-semibold text-slate-500">
                    {step}
                  </p>
                </div>
                {i < modelSteps.length - 1 && (
                  <div
                    className="hidden h-px w-6 bg-slate-200 sm:block"
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Positioning section ───────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <Section
            eyebrow="Positioning"
            title="YYZU adalah collaborative technology ecosystem dan talent bridge."
            description="YYZU bukan sekadar ruang belajar pasif atau komunitas kumpul santai. Kami adalah lingkungan tumbuh terstruktur untuk melatih kesiapan industri talenta teknologi melalui kolaborasi aktif, ulasan berkala, dan project-based growth."
          />
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {currentFocus.map((item) => (
              <article
                key={item.title}
                className="rounded-lg border border-slate-200 bg-slate-50 p-5"
              >
                <h3 className="font-bold text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pillars of Learning ────────────────────────────────── */}
      <section className="bg-[#f7f9fb] py-16 sm:py-20 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Section
            eyebrow="Learning Pillars"
            title="Empat pilar utama yang melandasi proses belajar di YYZU."
            description="Kami merancang cara belajar yang berorientasi pada output nyata, standar industri, serta kolaborasi aktif untuk mengikis ego individu."
            align="center"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {learningPillars.map((pillar) => (
              <article
                key={pillar.title}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="h-1 w-8 rounded-sm bg-[#0015A5] mb-4" />
                <h3 className="text-lg font-bold text-slate-950">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {pillar.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11 Specialization Tracks ───────────────────────────── */}
      <section className="bg-white py-16 sm:py-20 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Section
            eyebrow="Specialization Tracks"
            title="Peta Bidang Keahlian & Kurikulum."
            description="YYZU membagi fokus pembelajaran ke dalam 11 track spesifik berbasis standar kompetensi industri. Pilih jalur Anda dan bertumbuh bersama tim."
            align="center"
          />
          <div className="mt-12 flex flex-wrap justify-center gap-6">
            {expertiseTracks.map((track) => (
              <div
                key={track.title}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex"
              >
                <div className="flex-1 flex flex-col">
                  <InfoCard {...track} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/docs/learning/curriculum"
              prefetch={false}
              className="inline-flex items-center text-sm font-bold text-[#0015A5] hover:underline"
            >
              Lihat detail matriks kompetensi kurikulum &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why YYZU Exists ───────────────────────────────────── */}
      <section className="bg-[#f7f9fb] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Section
            eyebrow="Why YYZU Exists"
            title="Menjembatani celah antara teori belajar dan realitas dunia kerja."
            description="Banyak talenta memiliki fondasi akademis yang baik, tetapi belum terbiasa dengan sprint planning, version control, dokumentasi teknis, ulasan kritis (review), dan ownership tugas. YYZU hadir untuk melatih habits industri tersebut."
            align="center"
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {whyYYZU.map((item) => (
              <InfoCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Bridge Model ──────────────────────────────────────── */}
      <section className="bg-slate-950 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Section
            eyebrow="Bridge Model"
            title="Dari tahap belajar menuju kolaborasi aktif dan kesiapan industri."
            description="Tumbuh di YYZU bukanlah jalan pintas. Kesiapan industri dibangun melalui interaksi nyata dengan mentor praktisi, pembagian peran tim, dan ulasan hasil kerja yang transparan."
            align="center"
            tone="dark"
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {bridgeCards.map((item) => (
              <article
                key={item.title}
                className="rounded-lg border border-white/12 bg-white/[0.06] p-7"
              >
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Activities Preview ────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <Section
              eyebrow="Activities Preview"
              title="Latihan langsung lewat simulasi workflow dan kolaborasi proyek."
              description="Aktivitas kami dirancang agar partisipan terbiasa menyelesaikan tugas sesuai scope, berani mempresentasikan solusi, menerima masukan teknis, dan mendokumentasikan proses."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {activities.slice(0, 4).map((activity) => (
                <article
                  key={activity.title}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-5"
                >
                  <h3 className="font-bold text-slate-950">{activity.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {activity.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
          <div className="mt-8">
            <Link
              href="/activities/"
              prefetch={false}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-bold text-slate-800 transition hover:border-[#0015A5] hover:text-[#0015A5]"
            >
              Lihat Aktivitas
            </Link>
          </div>
        </div>
      </section>

      {/* ── Project Categories ─────────────────────────────────── */}
      <section className="bg-[#f7f9fb] py-16 sm:py-20 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Section
            eyebrow="Project Categories"
            title="Tiga Kategori Proyek sebagai Media Belajar."
            description="Pertumbuhan skill divalidasi langsung melalui pengerjaan proyek. Dari tingkat dasar secara mandiri hingga mengelola infrastruktur produksi riil."
            align="center"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {projectCategories.map((category) => (
              <article
                key={category.title}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center rounded-full bg-[#006A67]/10 px-2.5 py-0.5 text-xs font-semibold text-[#006A67]">
                      {category.focus}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      {category.duration}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-950">{category.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {category.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ecosystem roles ───────────────────────────────────── */}
      <section className="bg-[#f7f9fb] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Section
            eyebrow="Ecosystem"
            title="Menghubungkan future builders, kampus, mentor, dan industri."
            description="YYZU memfasilitasi kolaborasi multi-pihak untuk mendukung penyelarasan kompetensi talenta dengan standar kebutuhan industri digital."
            align="center"
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {ecosystemRoles.map((role) => (
              <InfoCard key={role.title} {...role} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Kembangkan portofolio proses dan kesiapan industri Anda."
        description="Mulai bergabung ke dalam ekosistem YYZU untuk tumbuh lewat pembelajaran kolaboratif, simulasi workflow industri, dan kontribusi nyata."
        primaryLabel="Join YYZU"
        primaryHref="/join/"
        secondaryLabel="Pelajari Culture"
        secondaryHref="/culture/"
      />
    </>
  );
}
