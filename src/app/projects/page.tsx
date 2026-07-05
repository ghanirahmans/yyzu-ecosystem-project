import type { Metadata } from "next";
import CtaBand from "../../components/CtaBand";
import InfoCard from "../../components/InfoCard";
import PageHero from "../../components/PageHero";
import Section from "../../components/Section";
import { buildLogs, projectPrinciples, upcomingBuildLogs } from "../../data/site";

export const metadata: Metadata = {
  title: "Proyek & Catatan Pengembangan (Build Logs)",
  description:
    "Projects dan build logs YYZU menjelaskan project sebagai media real-world experience, workflow simulation, progress updates, dan contribution stories.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Projects / Build Logs"
        title="Project YYZU adalah media untuk real-world experience, bukan hanya showcase."
        description="Halaman ini mencatat collaborative projects, workflow logs, progress updates, dan contribution stories yang menunjukkan proses kerja, keputusan, review, dan pembelajaran secara transparan."
        note="Build logs membantu member menjelaskan konteks, role, ownership, feedback, keputusan, dan dampak tiap kontribusi."
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Section
            eyebrow="Log Saat Ini"
            title="Timeline pengembangan YYZU yang sedang berjalan."
            description="Catatan ini dibuat agar proses pengembangan konsep, pembukaan member, project collaboration, workflow industri, keputusan, dan kontribusi YYZU bisa dipahami dengan jelas."
            align="center"
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {buildLogs.map((log) => (
              <article
                key={log.title}
                className="rounded-lg border border-slate-200 bg-slate-50 p-7"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200">
                    {log.date}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#006A67] ring-1 ring-slate-200">
                    {log.period}
                  </span>
                  <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-white">
                    {log.status}
                  </span>
                </div>
                <h2 className="mt-5 text-xl font-bold text-slate-950">
                  {log.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {log.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Section
            eyebrow="Segera Hadir"
            title="Next focus YYZU."
            description="Upcoming digunakan sebagai roadmap ringan. Bagian ini menunjukkan arah yang sedang disiapkan, tanpa mengklaim bahwa program sudah berjalan penuh."
            align="center"
            tone="dark"
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {upcomingBuildLogs.map((log) => (
              <article
                key={log.title}
                className="rounded-lg border border-white/12 bg-white/[0.06] p-7"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#0015A5]">
                    {log.date}
                  </span>
                  <span className="rounded-full border border-white/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-teal-100">
                    {log.period}
                  </span>
                  <span className="rounded-full bg-white/[0.08] px-3 py-1 text-xs font-bold text-white">
                    {log.status}
                  </span>
                </div>
                <h2 className="mt-5 text-xl font-bold text-white">{log.title}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  {log.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f9fb] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Section
            eyebrow="Prinsip Proyek"
            title="Project harus realistis, nyata, reviewable, dan membangun industry readiness."
            description="Yang penting project membantu member belajar workflow, ownership, komunikasi, product thinking, software quality, documentation, dan kualitas kontribusi."
            align="center"
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {projectPrinciples.map((item) => (
              <InfoCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Build logs menjadi bukti proses belajar, kolaborasi, real experience, dan growth di YYZU."
        description="Jika kamu ingin membantu menulis, membangun, mendokumentasikan, mendesain, atau mengelola project, ada ruang untuk kontribusi yang jelas."
        primaryLabel="Ikut Kontribusi"
        primaryHref="/join/"
      />
    </>
  );
}