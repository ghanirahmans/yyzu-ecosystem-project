import { ArrowRight, BookOpen, Compass } from "lucide-react";
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
} from "../data/site";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "YYZU Ecosystem",
    "url": "https://yyzu.tech",
    "logo": "https://yyzu.tech/yyz-project-logo_ft.svg",
    "description": "YYZU adalah collaborative technology ecosystem dan talent bridge yang menghubungkan kampus, talenta teknologi, mentor praktisi, dan industri.",
    "sameAs": [
      "https://instagram.com/yyzuecosystem",
      "https://www.linkedin.com/in/yyzu-ecosystem"
    ],
    "knowsAbout": [
      "Software Development",
      "UI/UX Design",
      "Product Management",
      "Collaborative Learning",
      "Team Collaboration",
      "Mentoring"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="relative isolate overflow-hidden bg-slate-950 text-white flex flex-col justify-center min-h-[calc(100vh-4rem)]">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(0,21,165,0.9)_0%,rgba(0,106,103,0.78)_48%,rgba(15,23,42,0.96)_100%)]"></div>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.11)_1px,transparent_1px)] bg-[size:42px_42px] opacity-20"></div>
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="mb-8 flex size-18 items-center justify-center rounded-lg bg-white shadow-2xl shadow-slate-950/25 ring-1 ring-white/30">
                <img
                  src="/yyz-project-logo_ft.svg"
                  alt="Logo YYZU"
                  width="52"
                  height="52"
                  decoding="async"
                />
              </div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-100">
                Bridging Campus, Talent, and Industry
              </p>
              <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
                YYZU
              </h1>
              <p className="mt-6 max-w-3xl text-xl font-semibold leading-8 text-white sm:text-2xl sm:leading-10">
                Collaborative technology ecosystem & talent bridge untuk belajar, membangun, dan tumbuh melalui pengalaman nyata.
              </p>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-200 sm:text-lg">
                YYZU mempertemukan talenta teknologi, kampus, mentor praktisi, dan industri melalui pembelajaran kolaboratif, simulasi workflow industri, mentoring, dan pengerjaan project brief terarah.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <a
                  href="/join/"
                  className="group inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-[#0015A5] shadow-lg shadow-slate-950/20 transition-all duration-300 hover:bg-slate-100 hover:scale-[1.03] active:scale-[0.97]"
                >
                  <span>Join as Member</span>
                  <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
                <a
                  href="/docs/"
                  className="group inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-white/40 hover:scale-[1.03] active:scale-[0.97]"
                >
                  <BookOpen className="mr-2 size-4 text-teal-300 transition-colors duration-300 group-hover:text-teal-200" />
                  <span>Read YYZU Docs</span>
                </a>
                <a
                  href="/about/"
                  className="group inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-white/40 hover:scale-[1.03] active:scale-[0.97]"
                >
                  <Compass className="mr-2 size-4 text-blue-300 transition-colors duration-300 group-hover:text-blue-200" />
                  <span>Explore the Ecosystem</span>
                </a>
              </div>
            </div>

            <div className="rounded-lg border border-white/12 bg-white/[0.06] p-6 shadow-2xl shadow-slate-950/20 backdrop-blur">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-100">
                Growth Model
              </p>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">
                Learn, build, collaborate, grow.
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Sistem pertumbuhan YYZU membantu partisipan bergerak dari pemahaman fundamental dasar menuju praktik langsung, koordinasi tim lintas peran, hingga kesiapan industri yang matang.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-4 lg:grid-cols-1 xl:grid-cols-4 xl:gap-2 2xl:gap-3">
                {modelSteps.map((step, index) => (
                  <div
                    key={step}
                    className="min-w-0 rounded-lg border border-white/12 bg-slate-950/30 px-4 py-3 xl:px-2.5 xl:py-2.5 2xl:px-4 2xl:py-3"
                  >
                    <span className="text-xs font-bold text-teal-100">
                      0{index + 1}
                    </span>
                    <p className="mt-1 whitespace-nowrap text-sm font-bold leading-5 text-white xl:text-xs 2xl:text-sm">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

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
            <a
              href="/activities/"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-bold text-slate-800 transition hover:border-[#0015A5] hover:text-[#0015A5]"
            >
              Lihat Aktivitas
            </a>
          </div>
        </div>
      </section>

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
