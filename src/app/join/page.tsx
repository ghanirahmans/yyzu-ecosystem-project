import type { Metadata } from "next";
import InfoCard from "../../components/InfoCard";
import PageHero from "../../components/PageHero";
import Section from "../../components/Section";
import { joinExpectations, joinPaths } from "../../data/site";

export const metadata: Metadata = {
  title: "Join YYZU",
  description:
    "Join YYZU sebagai member, contributor, mentor, atau partner untuk tumbuh lewat collaborative learning, project collaboration, workflow industri, dan real project experience.",
};

export default function JoinPage() {
  return (
    <>
      <PageHero
        eyebrow="Join YYZU"
        title="Join YYZU sebagai member, contributor, mentor, atau partner."
        description="YYZU terbuka untuk orang dan institusi yang align dengan kultur belajar serius, collaborative learning, ownership, teamwork, dan real contribution. Tidak harus sudah jago, tetapi harus siap tumbuh lewat proses."
        note="YYZU sedang mengembangkan aktivitas, project, dan standar ecosystem, jadi kontribusi yang konsisten dan mindset kolaboratif sangat penting."
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Section
            eyebrow="Expectations"
            title="Ekspektasi sebelum bergabung."
            description="YYZU ingin menjaga culture yang sehat. Karena itu, ekspektasi dibuat jelas agar orang yang bergabung memahami cara belajar, bekerja, berkomunikasi, dan berkontribusi di dalam ecosystem."
            align="center"
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {joinExpectations.map((item) => (
              <InfoCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f9fb] py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <Section
            eyebrow="Join Paths"
            title="Pilih jalur yang sesuai dengan kapasitas dan bentuk kontribusimu."
            description="Peran bisa berkembang seiring kontribusi, skill, portfolio, pengalaman, dan kebutuhan ecosystem. Member dapat tumbuh menjadi contributor, mentor internal, atau project lead secara bertahap."
          />
          <div className="grid gap-5">
            {joinPaths.map((item) => (
              <InfoCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-5xl px-5 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-200">
            Join Now
          </p>
          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
            Terbuka untuk yang ingin tumbuh dan berkontribusi bersama YYZU.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            Sejak 25 Mei 2026, YYZU Community terbuka bagi students, IT learners,
            member, contributors, mentor, campus, community, industry, dan partner
            yang sejalan dengan misi YYZU: membangun ecosystem pembelajaran
            kolaboratif, budaya engineering, pengalaman real project, dan jembatan
            talenta dari learning menuju collaboration, real project experience,
            dan industry readiness.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="https://forms.gle/qvXuRMPRRpkhNzZ59"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-bold text-[#0015A5] transition hover:bg-slate-100"
            >
              Join as Member
            </a>
            <a
              href="https://forms.gle/a8SbEvNR8hDFE5529"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/24 px-7 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Join as Mentor/Partnership
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
