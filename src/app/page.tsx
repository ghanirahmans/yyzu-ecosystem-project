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
      >
        {/* Dot grid background */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(0,21,165,0.07) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Gradient orbs */}
        <div
          className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full opacity-[0.20] blur-3xl -z-10"
          aria-hidden="true"
          style={{
            background: "radial-gradient(circle, #0015A5, transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full opacity-[0.18] blur-3xl -z-10"
          aria-hidden="true"
          style={{
            background: "radial-gradient(circle, #006A67, transparent 70%)",
          }}
        />

        {/* Network animation */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
          aria-hidden="true"
        >
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1200 800"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <radialGradient id="node-blue" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0015A5" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0015A5" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="node-teal" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#006A67" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#006A67" stopOpacity="0" />
              </radialGradient>
            </defs>
            <g stroke="#0015A5" strokeLinecap="round">
              <line
                x1="120"
                y1="200"
                x2="280"
                y2="380"
                strokeWidth="1"
                opacity="0.16"
              >
                <animate
                  attributeName="opacity"
                  values="0.10;0.22;0.10"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </line>
              <line
                x1="280"
                y1="380"
                x2="180"
                y2="580"
                strokeWidth="1"
                opacity="0.14"
              >
                <animate
                  attributeName="opacity"
                  values="0.09;0.20;0.09"
                  dur="5s"
                  repeatCount="indefinite"
                />
              </line>
              <line
                x1="280"
                y1="380"
                x2="480"
                y2="260"
                strokeWidth="1"
                opacity="0.18"
              >
                <animate
                  attributeName="opacity"
                  values="0.12;0.26;0.12"
                  dur="4.5s"
                  repeatCount="indefinite"
                />
              </line>
              <line
                x1="120"
                y1="200"
                x2="480"
                y2="260"
                strokeWidth="1"
                opacity="0.12"
              >
                <animate
                  attributeName="opacity"
                  values="0.08;0.18;0.08"
                  dur="5.5s"
                  repeatCount="indefinite"
                />
              </line>
              <line
                x1="180"
                y1="580"
                x2="420"
                y2="640"
                strokeWidth="1"
                opacity="0.14"
              >
                <animate
                  attributeName="opacity"
                  values="0.09;0.20;0.09"
                  dur="3.5s"
                  repeatCount="indefinite"
                />
              </line>
              <line
                x1="480"
                y1="260"
                x2="420"
                y2="640"
                strokeWidth="1"
                opacity="0.10"
              >
                <animate
                  attributeName="opacity"
                  values="0.07;0.16;0.07"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </line>
              <line
                x1="480"
                y1="260"
                x2="740"
                y2="340"
                strokeWidth="1"
                opacity="0.18"
              >
                <animate
                  attributeName="opacity"
                  values="0.12;0.26;0.12"
                  dur="5s"
                  repeatCount="indefinite"
                />
              </line>
              <line
                x1="420"
                y1="640"
                x2="740"
                y2="340"
                strokeWidth="1"
                opacity="0.12"
              >
                <animate
                  attributeName="opacity"
                  values="0.08;0.18;0.08"
                  dur="4.5s"
                  repeatCount="indefinite"
                />
              </line>
              <line
                x1="420"
                y1="640"
                x2="780"
                y2="620"
                strokeWidth="1"
                opacity="0.14"
              >
                <animate
                  attributeName="opacity"
                  values="0.09;0.20;0.09"
                  dur="3.5s"
                  repeatCount="indefinite"
                />
              </line>
              <line
                x1="740"
                y1="340"
                x2="960"
                y2="200"
                strokeWidth="1"
                opacity="0.16"
              >
                <animate
                  attributeName="opacity"
                  values="0.10;0.22;0.10"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </line>
              <line
                x1="740"
                y1="340"
                x2="900"
                y2="520"
                strokeWidth="1"
                opacity="0.18"
              >
                <animate
                  attributeName="opacity"
                  values="0.12;0.26;0.12"
                  dur="5s"
                  repeatCount="indefinite"
                />
              </line>
              <line
                x1="960"
                y1="200"
                x2="900"
                y2="520"
                strokeWidth="1"
                opacity="0.10"
              >
                <animate
                  attributeName="opacity"
                  values="0.07;0.16;0.07"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </line>
              <line
                x1="900"
                y1="520"
                x2="780"
                y2="620"
                strokeWidth="1"
                opacity="0.14"
              >
                <animate
                  attributeName="opacity"
                  values="0.09;0.20;0.09"
                  dur="4.5s"
                  repeatCount="indefinite"
                />
              </line>
              <line
                x1="960"
                y1="200"
                x2="1100"
                y2="420"
                strokeWidth="1"
                opacity="0.12"
              >
                <animate
                  attributeName="opacity"
                  values="0.08;0.18;0.08"
                  dur="5.5s"
                  repeatCount="indefinite"
                />
              </line>
              <line
                x1="900"
                y1="520"
                x2="1100"
                y2="420"
                strokeWidth="1"
                opacity="0.14"
              >
                <animate
                  attributeName="opacity"
                  values="0.09;0.20;0.09"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </line>
            </g>
            <circle cx="120" cy="200" r="3.5" fill="#006A67" opacity="0.20">
              <animate
                attributeName="r"
                values="3;5;3"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="280" cy="380" r="5" fill="#0015A5" opacity="0.28">
              <animate
                attributeName="r"
                values="4;7;4"
                dur="5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="180" cy="580" r="3.5" fill="#006A67" opacity="0.20">
              <animate
                attributeName="r"
                values="3;5;3"
                dur="3.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="480" cy="260" r="4.5" fill="#0015A5" opacity="0.26">
              <animate
                attributeName="r"
                values="3.5;6;3.5"
                dur="4.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="420" cy="640" r="3.5" fill="#006A67" opacity="0.18">
              <animate
                attributeName="r"
                values="3;5;3"
                dur="3.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="740" cy="340" r="5" fill="#006A67" opacity="0.28">
              <animate
                attributeName="r"
                values="4;7;4"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="780" cy="620" r="3.5" fill="#0015A5" opacity="0.20">
              <animate
                attributeName="r"
                values="3;5;3"
                dur="4.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="960" cy="200" r="4" fill="#0015A5" opacity="0.24">
              <animate
                attributeName="r"
                values="3;6;3"
                dur="5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="900" cy="520" r="4" fill="#006A67" opacity="0.22">
              <animate
                attributeName="r"
                values="3;5;3"
                dur="3.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="1100" cy="420" r="3.5" fill="#0015A5" opacity="0.18">
              <animate
                attributeName="r"
                values="3;5;3"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="280" cy="380" r="20" fill="url(#node-teal)">
              <animate
                attributeName="r"
                values="14;26;14"
                dur="5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="740" cy="340" r="20" fill="url(#node-teal)">
              <animate
                attributeName="r"
                values="14;26;14"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="480" cy="260" r="16" fill="url(#node-blue)">
              <animate
                attributeName="r"
                values="10;22;10"
                dur="5.5s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>

        {/* Floating shapes */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
          aria-hidden="true"
        >
          <svg
            className="absolute top-[12%] right-[8%] w-16 h-16 text-[#0015A5] opacity-[0.20] animate-float"
            viewBox="0 0 100 100"
          >
            <polygon
              points="50,3 93,25 93,75 50,97 7,75 7,25"
              fill="currentColor"
            />
          </svg>
          <svg
            className="absolute bottom-[18%] left-[6%] w-12 h-12 text-[#006A67] opacity-[0.22] animate-float-delayed"
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="45" fill="currentColor" />
          </svg>
          <svg
            className="absolute top-[40%] right-[8%] w-10 h-10 text-[#0015A5] opacity-[0.18] animate-float"
            viewBox="0 0 100 100"
            style={{ animationDelay: "2s" }}
          >
            <rect
              x="15"
              y="15"
              width="70"
              height="70"
              rx="4"
              fill="currentColor"
              transform="rotate(45 50 50)"
            />
          </svg>
          <svg
            className="absolute bottom-[20%] right-[15%] w-14 h-14 text-[#0015A5] opacity-[0.15] animate-float-delayed"
            viewBox="0 0 100 100"
          >
            <polygon points="50,10 90,90 10,90" fill="currentColor" />
          </svg>
        </div>

        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-4xl flex-col items-center justify-center px-5 py-20 text-center sm:px-6 sm:py-24 lg:px-8">
          <div
            className="mb-9 inline-flex items-center gap-2.5 rounded-full border border-[#006A67]/20 bg-[#006A67]/[0.06] px-4 py-2 shadow-sm animate-slide-in-up"
            role="status"
            aria-label="Ecosystem status: Batch 1 active"
            style={{ animationDelay: "0ms" }}
          >
            <span
              className="relative flex h-2 w-2 flex-shrink-0"
              aria-hidden="true"
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#006A67] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#006A67]" />
            </span>
            <span className="text-xs font-bold tracking-wide text-[#006A67]">
              Now Open &mdash; Batch 1 Accepting Applications
            </span>
          </div>

          <h1
            id="hero-heading"
            className="mx-auto max-w-3xl text-balance text-5xl font-black leading-[1.07] tracking-tight text-slate-950 sm:text-6xl lg:text-[4.5rem] animate-slide-in-up"
            style={{ animationDelay: "80ms" }}
          >
            Tempat{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #0015A5 0%, #006A67 100%)",
              }}
            >
              builder Indonesia
            </span>{" "}
            tumbuh bersama.
          </h1>

          <p
            className="mx-auto mt-7 max-w-xl text-balance text-base leading-7 text-slate-600 sm:text-[17px] sm:leading-[1.8] animate-slide-in-up"
            style={{ animationDelay: "160ms" }}
          >
            YYZU adalah ekosistem teknologi kolaboratif yang menghubungkan
            mahasiswa, mentor praktisi, dan industri melalui project nyata,
            simulasi workflow, dan mentoring terstruktur.
          </p>

          <div
            className="mt-10 flex flex-wrap items-center justify-center gap-3 animate-slide-in-up"
            style={{ animationDelay: "240ms" }}
          >
            <Link
              href="/join/"
              prefetch={false}
              className="group inline-flex min-h-11 items-center justify-center rounded-full bg-[#0015A5] px-7 py-2.5 text-sm font-bold text-white shadow-md shadow-[#0015A5]/20 transition-all duration-200 hover:bg-[#00118a] hover:shadow-lg hover:shadow-[#0015A5]/25 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0015A5] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
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
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-7 py-2.5 text-sm font-semibold text-slate-600 transition-all duration-200 hover:border-slate-300 hover:text-slate-900 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Read the Docs
            </Link>
          </div>

          <p
            className="mt-5 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 animate-fade-in"
            style={{ animationDelay: "320ms" }}
          >
            For students &bull; mentors &bull; campus partners &bull; industry
          </p>

          <div
            className="mt-14 flex flex-wrap items-center justify-center gap-x-0 gap-y-4 animate-fade-in"
            aria-label="YYZU growth model: Learn, Build, Collaborate, Grow"
            style={{ animationDelay: "420ms" }}
          >
            {modelSteps.map((step, i) => (
              <div key={step} className="flex items-center">
                <div className="px-5 text-center">
                  <div className="mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-full border border-[#0015A5]/15 bg-[#0015A5]/[0.05]">
                    <span className="text-[10px] font-black text-[#0015A5]">
                      {i + 1}
                    </span>
                  </div>
                  <p className="text-[13px] font-bold text-slate-700">{step}</p>
                </div>
                {i < modelSteps.length - 1 && (
                  <div
                    className="hidden h-px w-8 bg-gradient-to-r from-slate-200 to-slate-300 sm:block"
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
                <h3 className="text-lg font-bold text-slate-950">
                  {pillar.title}
                </h3>
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
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  {item.body}
                </p>
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
                  <h3 className="text-xl font-bold text-slate-950">
                    {category.title}
                  </h3>
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
