import type { Metadata } from "next";
import CtaBand from "../../components/CtaBand";
import PageHero from "../../components/PageHero";
import Section from "../../components/Section";
import { faqs } from "../../data/site";

export const metadata: Metadata = {
  title: "Pertanyaan Umum (FAQ)",
  description:
    "FAQ YYZU tentang collaborative technology ecosystem, talent bridge, model belajar kolaboratif, aktivitas, ekspektasi, dan cara bergabung.",
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Pertanyaan umum tentang YYZU."
        description="Temukan jawaban singkat mengenai positioning YYZU sebagai collaborative technology ecosystem dan talent bridge, model belajar praktis, ritme kolaborasi, aktivitas, ekspektasi kontribusi, serta kriteria pendaftaran."
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-5 sm:px-6 lg:px-8">
          <Section
            eyebrow="Questions"
            title="Pahami YYZU sebelum mendaftarkan diri."
            description="Kami ingin memastikan setiap pembelajar, mentor, dan partner memahami arah ekosistem, kultur kolaboratif, dan ekspektasi peran sebelum memutuskan bergabung."
            align="center"
          />
          <div className="mt-12 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-slate-50">
            {faqs.map((faq, index) => (
              <details
                key={faq.title}
                className="group p-6 open:bg-white first:rounded-t-xl last:rounded-b-xl transition-colors"
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
                <p className="mt-5 pl-4 sm:pl-12 text-sm leading-7 text-slate-600">
                  {faq.description}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Siap menentukan jalur kontribusi Anda di ekosistem YYZU?"
        description="Gunakan formulir pendaftaran Join untuk bergabung sebagai member/kontributor internal, atau ajukan registrasi minat untuk menjadi mentor praktisi dan mitra partner."
        primaryLabel="Buka Halaman Join"
        primaryHref="/join/"
      />
    </>
  );
}
