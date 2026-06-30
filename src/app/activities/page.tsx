import type { Metadata } from "next";
import CtaBand from "../../components/CtaBand";
import InfoCard from "../../components/InfoCard";
import PageHero from "../../components/PageHero";
import Section from "../../components/Section";
import { activities, activityRhythm, projectCategories } from "../../data/site";

export const metadata: Metadata = {
  title: "Aktivitas & Program",
  description:
    "Rangkaian aktivitas di ekosistem YYZU: Study Groups, Mentoring & Technical Review, Mini Projects, Workflow Simulation, Real Case Collaboration, dan Portfolio Preparation.",
};

export default function ActivitiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Activities"
        title="Aktivitas terarah untuk menjembatani teori belajar dengan praktik industri."
        description="Setiap aktivitas di YYZU didesain agar Anda tidak sekadar menjadi penyimak pasif. Anda akan dilatih menganalisis problem statement, berkolaborasi memecahkan masalah, melakukan ulasan silang (review), dan mencatat dokumentasi proses."
        note="Model aktivitas kami mencakup Study Groups, Mentoring & Technical Review, Mini Projects, Workflow Simulation, Real Case Collaboration, serta Career & Portfolio Preparation."
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Section
            eyebrow="Activity Types"
            title="Model pembelajaran praktis yang mendekati lingkungan kerja nyata."
            description="Kami menyusun aktivitas agar member terbiasa dengan pembagian tugas tim, pembuatan dokumentasi, pengiriman hasil kerja terukur, serta evaluasi mandiri."
            align="center"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {activities.map((item) => (
              <InfoCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Section
            eyebrow="Working Rhythm"
            title="Ritme aktivitas Learn, Build, Collaborate, Grow."
            description="Sebuah kerangka kerja terarah untuk memandu kemajuan belajar Anda dari pemahaman dasar hingga portofolio proses yang kredibel."
            align="center"
            tone="dark"
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-4">
            {activityRhythm.map((item, index) => (
              <article
                key={item.title}
                className="rounded-lg border border-white/12 bg-white/[0.06] p-7"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-white text-sm font-black text-[#0015A5]">
                  {index + 1}
                </span>
                <h3 className="mt-5 text-xl font-bold text-white">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Project Categories ─────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20 border-t border-slate-100">
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
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm hover:shadow-md transition-all duration-200"
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

      <CtaBand
        title="Mulai langkah praktik nyata Anda di dalam ekosistem YYZU."
        description="Anda dapat bergabung sebagai member untuk belajar & membangun proyek, atau berkontribusi sebagai mentor dan mitra kolaborasi industri."
        primaryLabel="Join as Member"
        primaryHref="/join/"
        secondaryLabel="Lihat Build Logs"
        secondaryHref="/projects/"
      />
    </>
  );
}
