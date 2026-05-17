import Image from "next/image";
import { SiteHeader } from "./components/site-header";

type CardItem = {
  title: string;
  description: string;
};

const values: CardItem[] = [
  {
    title: "Build Together",
    description:
      "Belajar dan membangun bersama melalui kerja tim, diskusi teknis, dan kontribusi yang saling menguatkan.",
  },
  {
    title: "Industry-Oriented",
    description:
      "Membiasakan standar kerja, komunikasi, dan proses engineering yang dekat dengan ekspektasi industri.",
  },
  {
    title: "Continuous Growth",
    description:
      "Mendorong peningkatan bertahap melalui latihan konsisten, evaluasi, dan pembelajaran dari proyek nyata.",
  },
  {
    title: "Real Contribution",
    description:
      "Mengutamakan hasil kerja yang dapat digunakan, ditinjau, dan menjadi bagian dari portofolio yang kredibel.",
  },
  {
    title: "Discipline & Ownership",
    description:
      "Menumbuhkan tanggung jawab terhadap kualitas, waktu, dokumentasi, dan keputusan teknis yang dibuat.",
  },
];

const focusAreas: CardItem[] = [
  {
    title: "Pengembangan skill teknis",
    description:
      "Fondasi pemrograman, praktik software engineering, debugging, dan pemahaman sistem secara bertahap.",
  },
  {
    title: "Simulasi workflow industri",
    description:
      "Alur kerja issue, branch, code review, dokumentasi, demo, dan koordinasi seperti tim produk nyata.",
  },
  {
    title: "Kolaborasi proyek",
    description:
      "Membangun mini project dan team project untuk melatih komunikasi, peran, dan kualitas eksekusi.",
  },
  {
    title: "Mentoring",
    description:
      "Pendampingan dari praktisi, senior, dan rekan belajar agar progres teknis tetap terarah.",
  },
  {
    title: "Portfolio building",
    description:
      "Menghasilkan artefak kerja yang dapat dijelaskan: kode, dokumentasi, catatan keputusan, dan demo.",
  },
  {
    title: "Industry readiness",
    description:
      "Mempersiapkan cara berpikir, kebiasaan kerja, dan komunikasi profesional untuk masuk ke lingkungan industri.",
  },
];

const activities = [
  "Study groups",
  "Mentoring",
  "Workshops",
  "Mini projects",
  "Team projects",
  "Code reviews",
  "Technical discussions",
  "Hackathons",
  "Open-source contributions",
  "Engineering simulations",
  "Collaborative product development",
];

const modelSteps = ["Learn", "Build", "Collaborate", "Contribute", "Grow"];

const ecosystemRoles: CardItem[] = [
  {
    title: "Students & IT Learners",
    description:
      "Ruang untuk memperkuat skill, merasakan kerja tim, membangun proyek, dan menyiapkan diri menuju karier teknologi.",
  },
  {
    title: "Campuses",
    description:
      "Mitra pengembangan talenta yang membantu menghubungkan pembelajaran kampus dengan praktik engineering modern.",
  },
  {
    title: "Industry & Partners",
    description:
      "Jalur kolaborasi untuk mentoring, proyek, talent pipeline, dan kontribusi teknologi yang berdampak nyata.",
  },
];

const missionPoints = [
  "Membangun lingkungan belajar yang kolaboratif, disiplin, dan dekat dengan budaya engineering.",
  "Membantu talenta muda memahami proses kerja industri melalui simulasi workflow dan proyek nyata.",
  "Menghubungkan mahasiswa, kampus, praktisi, dan partner industri dalam ekosistem pertumbuhan yang saling memberi nilai.",
];

function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
}: {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
}) {
  const isDark = tone === "dark";

  return (
    <div
      className={`mx-auto max-w-3xl ${
        align === "center" ? "text-center" : "lg:mx-0"
      }`}
    >
      <p
        className={`text-sm font-bold uppercase tracking-[0.22em] ${
          isDark ? "text-teal-200" : "text-[#006A67]"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-4 text-3xl font-bold tracking-tight sm:text-4xl ${
          isDark ? "text-white" : "text-slate-950"
        }`}
      >
        {title}
      </h2>
      <p
        className={`mt-5 text-base leading-8 sm:text-lg ${
          isDark ? "text-slate-300" : "text-slate-600"
        }`}
      >
        {description}
      </p>
    </div>
  );
}

function InfoCard({ title, description }: CardItem) {
  return (
    <article className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#006A67]/30 hover:shadow-lg hover:shadow-slate-200/70">
      <div className="mb-5 h-1.5 w-12 rounded-full bg-[linear-gradient(135deg,#0015A5_0%,#006A67_100%)]" />
      <h3 className="text-lg font-bold text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
    </article>
  );
}

function RoleCard({ title, description }: CardItem) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-7 shadow-sm">
      <div className="mb-6 flex size-12 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white">
        {title
          .split(" ")
          .slice(0, 2)
          .map((word) => word[0])
          .join("")}
      </div>
      <h3 className="text-xl font-bold text-slate-950">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-slate-600">{description}</p>
    </article>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7f9fb] text-slate-900">
      <SiteHeader />

      <main>
        <section
          id="beranda"
          className="relative isolate overflow-hidden bg-slate-950 text-white"
        >
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(0,21,165,0.92)_0%,rgba(0,106,103,0.86)_54%,rgba(15,23,42,0.96)_100%)]" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.09)_1px,transparent_1px)] bg-[size:42px_42px] opacity-25" />
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
            <div className="mx-auto max-w-5xl text-center">
              <div className="mx-auto mb-8 flex size-20 items-center justify-center rounded-2xl bg-white/95 shadow-2xl shadow-slate-950/25 ring-1 ring-white/30">
                <Image
                  src="/yyz-project-logo_ft.svg"
                  alt="Logo YYZU"
                  width={58}
                  height={58}
                  priority
                />
              </div>
              <p className="text-sm font-bold uppercase tracking-[0.26em] text-teal-100">
                Engineering Ecosystem & Talent Bridge
              </p>
              <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
                YYZU
              </h1>
              <p className="mx-auto mt-6 max-w-4xl text-xl font-semibold leading-8 text-white sm:text-2xl sm:leading-10">
                Jembatan talenta antara kampus, mahasiswa, dan industri.
              </p>
              <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-100 sm:text-lg">
                YYZU membantu pelajar dan talenta IT berkembang dari tahap
                belajar menuju kesiapan industri melalui kolaborasi, mentoring,
                budaya engineering, simulasi workflow, dan proyek nyata.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="#kontak"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-[#0015A5] shadow-lg shadow-slate-950/20 transition hover:bg-slate-100 sm:w-auto"
                >
                  Bergabung dengan YYZU
                </a>
                <a
                  href="#ekosistem"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10 sm:w-auto"
                >
                  Lihat Ekosistem
                </a>
              </div>
            </div>

            <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 text-left sm:grid-cols-5">
              {modelSteps.map((step, index) => (
                <div
                  key={step}
                  className="rounded-lg border border-white/14 bg-white/8 px-4 py-3 backdrop-blur"
                >
                  <span className="text-xs font-bold text-teal-100">
                    0{index + 1}
                  </span>
                  <p className="mt-1 text-sm font-bold text-white">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="tentang" className="bg-white py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
            <SectionHeader
              eyebrow="Tentang YYZU"
              title="Bukan hanya komunitas belajar, tetapi lingkungan pertumbuhan engineering."
              description="YYZU hadir sebagai ekosistem yang membantu talenta muda belajar dengan konteks kerja nyata: memahami masalah, membangun solusi, bekerja dalam tim, menerima review, dan meningkatkan kualitas kontribusi."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Kolaborasi lintas peran untuk membangun kebiasaan kerja tim.",
                "Proyek nyata sebagai media belajar, evaluasi, dan portofolio.",
                "Mentoring untuk menjaga arah pertumbuhan teknis dan profesional.",
                "Budaya engineering yang menekankan kualitas, proses, dan ownership.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-5"
                >
                  <p className="text-sm font-semibold leading-7 text-slate-700">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-950 py-20 text-white sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Why YYZU Exists"
              title="Ada jarak antara pembelajaran akademik dan ekspektasi kerja industri."
              description="Banyak talenta memahami teori dan dasar teknis, tetapi belum cukup terbiasa dengan ritme kerja proyek, komunikasi tim, review kode, dokumentasi, prioritas produk, dan tanggung jawab terhadap hasil. YYZU dibangun untuk menjadi ruang transisi yang terstruktur."
              tone="dark"
            />
            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {[
                {
                  title: "Academic Learning",
                  body: "Fondasi teori, mata kuliah, latihan individu, dan eksplorasi konsep.",
                },
                {
                  title: "YYZU Bridge",
                  body: "Simulasi workflow, mentoring, proyek kolaboratif, review, dan budaya kontribusi.",
                },
                {
                  title: "Industry Readiness",
                  body: "Kesiapan bekerja dalam tim, menjelaskan keputusan teknis, dan mengirimkan hasil yang dapat dipercaya.",
                },
              ].map((item) => (
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

        <section id="visi" className="bg-[#f7f9fb] py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-6 lg:grid-cols-2 lg:px-8">
            <article className="rounded-lg bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:p-10">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#006A67]">
                Vision
              </p>
              <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950">
                Menjadi ekosistem pengembangan talenta engineering yang
                menghubungkan pembelajaran, kontribusi, dan kebutuhan industri.
              </h2>
            </article>
            <article className="rounded-lg bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:p-10">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#0015A5]">
                Mission
              </p>
              <ul className="mt-6 space-y-5">
                {missionPoints.map((point) => (
                  <li key={point} className="flex gap-4">
                    <span className="mt-2 size-2.5 shrink-0 rounded-full bg-[#006A67]" />
                    <span className="text-sm leading-7 text-slate-600">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Core Values"
              title="Nilai yang membentuk cara YYZU belajar dan membangun."
              description="Nilai ini menjaga YYZU tetap praktis, kolaboratif, dan berorientasi pada pertumbuhan yang bisa dibuktikan melalui karya."
              align="center"
            />
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {values.map((item) => (
                <InfoCard key={item.title} {...item} />
              ))}
            </div>
          </div>
        </section>

        <section id="fokus" className="bg-[#f7f9fb] py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Focus Areas"
              title="Area pertumbuhan yang langsung mendukung kesiapan industri."
              description="YYZU memadukan pembelajaran teknis dengan praktik kolaborasi agar peserta tidak hanya memahami konsep, tetapi juga mampu bekerja dalam proses engineering yang nyata."
            />
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {focusAreas.map((item) => (
                <InfoCard key={item.title} {...item} />
              ))}
            </div>
          </div>
        </section>

        <section id="aktivitas" className="bg-white py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
            <SectionHeader
              eyebrow="Activities"
              title="Aktivitas yang membentuk ritme belajar, membangun, dan berkontribusi."
              description="Setiap aktivitas dirancang untuk mempertemukan praktik teknis, komunikasi, review, dan kebiasaan delivery secara bertahap."
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {activities.map((activity) => (
                <div
                  key={activity}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <span className="size-2.5 shrink-0 rounded-full bg-[linear-gradient(135deg,#0015A5_0%,#006A67_100%)]" />
                  <span className="text-sm font-semibold text-slate-700">
                    {activity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-950 py-20 text-white sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Development Model"
              title="Learn -> Build -> Collaborate -> Contribute -> Grow"
              description="Model ini membantu peserta bergerak dari pemahaman dasar menuju kontribusi yang lebih matang melalui proses yang bisa dilatih dan diulang."
              align="center"
              tone="dark"
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-5">
              {modelSteps.map((step, index) => (
                <div
                  key={step}
                  className="relative rounded-lg border border-white/12 bg-white/[0.06] p-5 text-center"
                >
                  <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-white text-sm font-black text-[#0015A5]">
                    {index + 1}
                  </span>
                  <h3 className="mt-4 text-base font-bold text-white">
                    {step}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="ekosistem" className="bg-[#f7f9fb] py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Ecosystem Roles"
              title="Satu ekosistem untuk talenta, kampus, dan industri."
              description="YYZU memposisikan setiap pihak sebagai bagian dari jembatan yang sama: belajar lebih relevan, membangun lebih nyata, dan berkolaborasi lebih terarah."
              align="center"
            />
            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {ecosystemRoles.map((role) => (
                <RoleCard key={role.title} {...role} />
              ))}
            </div>
          </div>
        </section>

        <section id="kontak" className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-5 text-center sm:px-6 lg:px-8">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#006A67]">
              Join & Collaborate
            </p>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Bangun lingkungan engineering yang lebih siap untuk industri.
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
              YYZU terbuka untuk pelajar, mentor, kampus, komunitas, dan partner
              industri yang ingin berkontribusi dalam pengembangan talenta
              teknologi secara lebih praktis dan kolaboratif.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="mailto:yyzucommunity@gmail.com"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#0015A5] px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#00118a]"
              >
                Kontak YYZU
              </a>
              <a
                href="#tentang"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-300 px-7 py-3 text-sm font-bold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Pelajari Dulu
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-6 md:grid-cols-[1.1fr_0.9fr_0.9fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-white">
                <Image
                  src="/yyz-project-logo_ft.svg"
                  alt=""
                  width={26}
                  height={26}
                />
              </span>
              <span className="font-bold tracking-[0.18em]">YYZU</span>
            </div>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
              Engineering ecosystem and talent bridge antara kampus, mahasiswa,
              dan industri.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
              Navigation
            </h3>
            <div className="mt-4 grid gap-3">
              {["Tentang", "Visi", "Fokus", "Aktivitas", "Ekosistem"].map(
                (item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-sm text-slate-300 transition hover:text-white"
                  >
                    {item}
                  </a>
                ),
              )}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
              Contact
            </h3>
            <div className="mt-4 grid gap-3 text-sm text-slate-300">
              <a
                href="mailto:yyzucommunity@gmail.com"
                className="hover:text-white"
              >
                Email: yyzucommunity@gmail.com
              </a>
              <span>LinkedIn: coming soon</span>
              <span>
                Instagram:{" "}
                <a
                  href="http://instagram.com/yyzucommunity"
                  target="blank"
                  rel="noopener noreferrer"
                >
                  yyzucommunity
                </a>
              </span>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-slate-400">
          Copyright 2026 YYZU. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
