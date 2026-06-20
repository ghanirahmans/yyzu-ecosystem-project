import type { Metadata } from "next";
import InfoCard from "../../components/InfoCard";
import PageHero from "../../components/PageHero";
import Section from "../../components/Section";
import { joinExpectations, joinPaths } from "../../data/site";

export const metadata: Metadata = {
  title: "Bergabung Ekosistem",
  description:
    "Bergabung ke dalam ekosistem YYZU sebagai member, kontributor internal, mentor praktisi, atau partner kolaborasi untuk tumbuh melalui real project.",
};

const memberFormUrl = "https://forms.gle/qvXuRMPRRpkhNzZ59";
const mentorFormUrl = "https://forms.gle/a8SbEvNR8hDFE5529";

export default function JoinPage() {
  return (
    <>
      <PageHero
        eyebrow="Join YYZU"
        title="Bergabung ke dalam ekosistem YYZU."
        description="YYZU membuka pendaftaran bagi individu maupun organisasi yang memiliki keselarasan nilai dalam kolaborasi praktis. Kami mencari talenta yang siap belajar mandiri secara aktif dan menjaga komitmen kualitas kontribusi tim."
        note="Ekosistem YYZU dikembangkan berdasarkan kontribusi nyata dan kebiasaan kerja yang konsisten."
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Section
            eyebrow="Expectations"
            title="Ekspektasi sebelum Anda bergabung."
            description="Kami berkomitmen untuk menjaga kualitas kolaborasi. Memahami ekspektasi di awal akan membantu Anda beradaptasi dengan ritme belajar di dalam ekosistem."
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
            title="Pilih jalur keterlibatan yang sesuai dengan profil Anda."
            description="Peran di YYZU dapat berkembang seiring bertambahnya skill dan kontribusi Anda. Member aktif berkesempatan mengambil peran sebagai kontributor internal atau project lead."
          />
          <div>
            <div className="grid gap-5">
              {joinPaths.map((item) => (
                <InfoCard key={item.title} {...item} />
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-slate-950 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-5xl px-5 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-teal-200">
            Registration of Interest
          </p>
          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
            Siap untuk bertumbuh bersama ekosistem YYZU?
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            Registrasi keterlibatan terbuka bagi mahasiswa, talenta teknologi, mentor praktisi, kampus, dan partner industri yang ingin bersama-sama memperkuat budaya engineering kolaboratif dan kesiapan industri lulusan teknologi.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={memberFormUrl}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-bold text-[#0015A5] transition hover:bg-slate-100"
            >
              Join as Member
            </a>
            <a
              href={mentorFormUrl}
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
