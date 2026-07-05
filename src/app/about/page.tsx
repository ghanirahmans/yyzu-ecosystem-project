import type { Metadata } from "next";
import CtaBand from "../../components/CtaBand";
import InfoCard from "../../components/InfoCard";
import PageHero from "../../components/PageHero";
import Section from "../../components/Section";
import { bridgeCards, visionMission, whyYYZU } from "../../data/site";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Pelajari misi YYZU sebagai jembatan talenta digital dan ekosistem kolaboratif yang menghubungkan mahasiswa, mentor praktisi, dan mitra industri.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About YYZU"
        title="YYZU dibangun sebagai collaborative technology ecosystem dan talent bridge."
        description="Kami memfasilitasi talenta teknologi untuk bertransformasi dari tahap belajar mandiri menuju pengalaman dunia kerja dan kesiapan industri melalui pengerjaan project brief, simulasi workflow, bimbingan mentor, serta kolaborasi lintas peran."
        note="Fokus kami adalah membentuk habits kerja yang profesional: technical skill, pemecahan masalah secara terstruktur, kolaborasi aktif, komunikasi tim, dan kepemilikan (ownership) tugas."
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <Section
            eyebrow="Celah yang Ada"
            title="Masalahnya bukan kurang materi belajar, tetapi kurang ruang untuk praktik kolaboratif."
            description="Pendidikan akademis dan belajar mandiri memberikan fondasi teori yang krusial. Namun untuk siap masuk ke industri, talenta wajib berlatih mengelola tugas tim, menerima masukan teknis (review), beradaptasi dengan kebutuhan produk, dan menjaga komitmen kualitas hasil kerja."
          />
          <div className="grid gap-5">
            {whyYYZU.map((item) => (
              <InfoCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Section
            eyebrow="Arah Jembatan"
            title="Talent bridge dari pemahaman teori menuju kesiapan industri."
            description="YYZU bukan sekadar tempat mengobrol santai atau talent pool biasa. Yang kami bangun adalah lingkungan tumbuh yang membiasakan talenta bekerja secara terstruktur sesuai standar kebutuhan kerja profesional."
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

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 sm:px-6 lg:grid-cols-2 lg:px-8">
          {visionMission.map((item) => (
            <article
              key={item.title}
              className="rounded-lg border border-slate-200 bg-slate-50 p-8"
            >
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#006A67]">
                {item.title}
              </p>
              <p className="mt-5 text-xl font-bold leading-8 text-slate-950">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#f7f9fb] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Section
            eyebrow="Arah Jangka Panjang"
            title="Membangun ekosistem teknologi kolaboratif yang terarah dan berkelanjutan."
            description="Arah pengembangan YYZU mencakup standarisasi learning path praktis, sistem pengelolaan project brief terintegrasi, jaringan mentor profesional, hub portofolio proses, hingga kolaborasi riset & pengembangan bersama mitra industri."
            align="center"
          />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              "Latihan workflow industri nyata",
              "Project-based growth environment",
              "Jembatan kampus, talenta, dan industri",
            ].map((item) => (
              <div
                key={item}
                className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm"
              >
                <p className="text-base font-bold text-slate-950">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Tumbuh nyata melalui kolaborasi tim dan pengerjaan project brief."
        description="Langkah berikutnya adalah memahami culture, nilai inti, dan prinsip engineering yang membentuk cara kerja di dalam ekosistem YYZU."
        primaryLabel="Lihat Culture"
        primaryHref="/culture/"
        secondaryLabel="Join YYZU"
        secondaryHref="/join/"
      />
    </>
  );
}