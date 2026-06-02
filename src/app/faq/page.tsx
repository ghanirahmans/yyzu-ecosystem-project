import type { Metadata } from "next";
import CtaBand from "../../components/CtaBand";
import PageHero from "../../components/PageHero";
import Section from "../../components/Section";
import { faqs } from "../../data/site";

export const metadata: Metadata = {
  title: "FAQ | YYZU",
  description:
    "FAQ YYZU tentang collaborative technology ecosystem, talent bridge, collaborative learning, project collaboration, aktivitas, ekspektasi, dan cara bergabung.",
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Pertanyaan umum tentang YYZU."
        description="Jawaban singkat untuk memahami posisi YYZU sebagai collaborative technology ecosystem dan talent bridge, pendekatan belajar, sistem kolaborasi, aktivitas, ekspektasi kontribusi, dan siapa yang cocok bergabung."
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Section
            eyebrow="Questions"
            title="Pahami YYZU sebelum bergabung."
            description="YYZU ingin orang yang bergabung memahami arah ecosystem, cara belajar, culture, dan ekspektasi kontribusi sebelum masuk."
            align="center"
          />
          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            {faqs.map((faq, index) => (
              <details
                key={faq.title}
                className="group rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm open:bg-white open:shadow-md open:shadow-slate-200/70"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-5 text-left">
                  <span className="flex gap-4">
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="text-base font-bold leading-7 text-slate-950">
                      {faq.title}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full border border-slate-300 text-lg leading-none text-slate-600 transition group-open:rotate-45 group-open:border-[#006A67] group-open:text-[#006A67]"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-5 pl-12 text-sm leading-7 text-slate-600">
                  {faq.description}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Siap memilih jalur yang sesuai di YYZU?"
        description="Gunakan form Join untuk member atau contributor, dan form Mentor/Partnership untuk mentor, kampus, komunitas, organisasi, atau partner industri."
        primaryLabel="Buka Halaman Join"
        primaryHref="/join/"
      />
    </>
  );
}
