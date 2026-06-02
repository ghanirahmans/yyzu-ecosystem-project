import type { Metadata } from "next";
import CtaBand from "../../components/CtaBand";
import InfoCard from "../../components/InfoCard";
import PageHero from "../../components/PageHero";
import Section from "../../components/Section";
import { activities, activityRhythm } from "../../data/site";

export const metadata: Metadata = {
  title: "Activities | YYZU",
  description:
    "Aktivitas YYZU: study group, mentoring, workshop, technical discussion, mini project, code review, design review, workflow simulation, dan real-world project development.",
};

export default function ActivitiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Activities"
        title="Aktivitas YYZU menghubungkan belajar teknologi dengan real project experience."
        description="Setiap aktivitas diarahkan agar member tidak hanya menerima materi, tetapi ikut membaca konteks, mencoba, berdiskusi, membangun, menerima feedback, melakukan review, dan mencatat pembelajaran."
        note="Ritme aktivitas mencakup collaborative learning, mentoring, workshop, technical discussion, mini project, code review, design review, workflow simulation, open contribution, dan career preparation."
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Section
            eyebrow="Activity Types"
            title="Ruang belajar yang dekat dengan teamwork, workflow industri, dan real project."
            description="Aktivitas dibuat agar member terbiasa dengan collaborative learning, project collaboration, dokumentasi, review, delivery, dan refleksi yang relevan dengan industri modern."
            align="center"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
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
            title="Learn, build, collaborate, grow."
            description="YYZU menggunakan ritme yang mudah diikuti, tetapi cukup serius untuk membentuk technical skill, teamwork, communication, ownership, dan kesiapan industri."
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
        title="Aktivitas YYZU adalah ruang latihan untuk tumbuh lewat praktik nyata."
        description="Kamu bisa mulai sebagai member, builder, designer, dokumentator, fasilitator diskusi, mentor, atau contributor di project internal."
        primaryLabel="Join as Member"
        primaryHref="/join/"
        secondaryLabel="Lihat Build Logs"
        secondaryHref="/projects/"
      />
    </>
  );
}
