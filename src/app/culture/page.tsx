import type { Metadata } from "next";
import CtaBand from "../../components/CtaBand";
import InfoCard from "../../components/InfoCard";
import PageHero from "../../components/PageHero";
import Section from "../../components/Section";
import { fitPeople, philosophy, values } from "../../data/site";

export const metadata: Metadata = {
  title: "Culture | YYZU",
  description:
    "Kultur kerja dan mindset kolaboratif di ekosistem YYZU: Build Together, Continuous Growth, Real Experience, Industry-Oriented, Ownership, dan Collaboration Over Competition.",
};

export default function CulturePage() {
  return (
    <>
      <PageHero
        eyebrow="Culture & Engineering Mindset"
        title="Kultur YYZU membentuk cara berkolaborasi dan standar bertumbuh."
        description="Kami mendesain ekosistem yang suportif namun tetap menuntut standar tinggi: tempat Anda belajar melatih inisiatif mandiri, berani menerima ulasan kritis, serta melatih engineering & product mindset secara bertahap."
        note="Prinsip dasar kami adalah build together, collaborative problem solving, peer learning, dan pertumbuhan kolektif yang bisa dipertanggungjawabkan."
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Section
            eyebrow="Core Values"
            title="Nilai-nilai inti yang memandu cara kami bekerja."
            description="Nilai inti ini diterapkan langsung dalam menentukan format aktivitas, kriteria ulasan project, serta metode kerja tim lintas peran."
            align="center"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {values.map((item) => (
              <InfoCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f9fb] py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <Section
            eyebrow="Principles"
            title="Menghargai kualitas proses, konsistensi, dan kontribusi aktif."
            description="Di YYZU, kami lebih menghargai kemauan melakukan perbaikan dan kepemilikan tugas secara bertanggung jawab dibanding klaim sepihak tanpa bukti."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {philosophy.map((item) => (
              <article
                key={item.title}
                className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Section
            eyebrow="Ecosystem Fit"
            title="YYZU didesain untuk pertumbuhan yang terarah."
            description="Kami ingin memastikan ekspektasi Anda selaras dengan model belajar kolaboratif yang kami jalankan."
            align="center"
            tone="dark"
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {fitPeople.map((item) => (
              <article
                key={item.title}
                className="rounded-lg border border-white/12 bg-white/[0.06] p-7"
              >
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Kultur YYZU hidup melalui komitmen belajar dan kontribusi tim."
        description="Sebelum memutuskan bergabung ke dalam ekosistem, pastikan Anda telah membaca ekspektasi dan jalur keterlibatan yang tersedia."
        primaryLabel="Baca Ekspektasi Join"
        primaryHref="/join/"
      />
    </>
  );
}
