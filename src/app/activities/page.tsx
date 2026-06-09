import type { Metadata } from "next";
import CtaBand from "../../components/CtaBand";
import InfoCard from "../../components/InfoCard";
import PageHero from "../../components/PageHero";
import Section from "../../components/Section";
import { activities, activityRhythm } from "../../data/site";

export const metadata: Metadata = {
  title: "Activities | YYZU",
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
