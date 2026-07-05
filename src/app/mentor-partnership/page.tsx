import type { Metadata } from "next";
import CtaBand from "../../components/CtaBand";
import Section from "../../components/Section";

export const metadata: Metadata = {
  title: "Mentor & Kemitraan",
  description:
    "YYZU membuka kolaborasi bagi mentor praktisi, kampus, startup, dan industri untuk bersama-sama mengakselerasi kesiapan kerja talenta melalui mentoring, penyusunan project brief, R&D, dan talent pipeline.",
};

const mentorFormUrl = "https://forms.gle/a8SbEvNR8hDFE5529";

const mentorContributions = [
  "Sesi arahan awal",
  "Sesi validasi learning path",
  "Sesi review rencana project",
  "Sesi checkpoint project",
  "Sesi review hasil project",
  "Sesi sharing pengalaman industri",
  "Sesi portfolio atau career review",
  "Sesi Q&A teknis atau karier",
];

const mentorFocusAreas = [
  "Software Development",
  "Product Management",
  "UI/UX Design",
  "Data Analytics",
  "Digital Marketing",
  "Founder / Startup",
];

const mentorLevels = [
  {
    level: "Level 1 - Light Involvement",
    description: "Sesi tunggal (sharing, Q&A, review portofolio). Durasi 45-90 menit per sesi.",
  },
  {
    level: "Level 2 - Cycle Mentor",
    description: "Pendamping Mini Project selama 6 minggu. Total 4-5 sesi pada checkpoint terjadwal.",
  },
  {
    level: "Level 3 - Project Advisor",
    description: "Penasihat Collaborative/Internal Project selama 2-3 bulan. Total 3-5 sesi pada milestone.",
  },
];

const projectPartnerProvides = [
  "Project brief / study case",
  "Problem statement non-kritis",
  "Product challenge eksploratif",
  "Kebutuhan internal tooling sederhana",
  "Feedback & ulasan hasil kerja",
];

const projectOutputs = [
  "UI/UX Interactive Prototype",
  "Minimum Viable Product (MVP)",
  "Landing Page & Web App",
  "Dashboard Internal",
  "Laporan Riset & Dokumen Teknis",
];

const collaborationOpportunities = [
  "Workshop & Sharing Session",
  "Penyusunan Project Brief Kolaboratif",
  "Ecosystem Mentoring Program",
  "Program Talent Development / R&D",
  "Akses Rekrutmen & Internship",
];

const notAcceptable = [
  "Meminta member mengerjakan proyek komersial penuh (untuk kebutuhan profit bisnis langsung Anda) secara gratis tanpa kejelasan scope, legalitas hak cipta, benefit, kompensasi adil, dan kesepakatan tertulis.",
  "Project brief tidak memiliki nilai pembelajaran (hanya memindahkan pekerjaan rutin operasional ke member).",
  "Scope proyek yang tidak realistis untuk jangka waktu belajar atau tidak terukur.",
  "Partner tidak bersedia meluangkan waktu untuk memberikan feedback atau evaluasi hasil kerja.",
  "Aktivitas atau proyek bertentangan dengan hukum, etika profesional, dan nilai kolaborasi sehat.",
  "Menggunakan nama ekosistem hanya untuk promosi sepihak tanpa kontribusi timbal balik yang nyata.",
];

const collaborationSteps = [
  {
    step: "01",
    title: "Submit Interest",
    description: "Mentor atau partner mengisi formulir registrasi awal untuk menyatakan minat kolaborasi.",
  },
  {
    step: "02",
    title: "Discussion",
    description: "Tim YYZU berdiskusi dengan Anda untuk memetakan tujuan kolaborasi, kapasitas kontribusi, dan target.",
  },
  {
    step: "03",
    title: "Program Mapping",
    description: "Menyelaraskan program kolaborasi dengan kebutuhan pengembangan talenta di ekosistem.",
  },
  {
    step: "04",
    title: "Execution",
    description: "Program dijalankan secara terarah, baik berupa review berkelompok maupun tantangan proyek.",
  },
  {
    step: "05",
    title: "Evaluation",
    description: "Evaluasi pasca-kegiatan untuk menilai dampak pembelajaran dan peluang jangka panjang.",
  },
];

const collaborationModels = [
  {
    title: "One-Time Sharing Session",
    description: "Mentor atau partner mengisi satu sesi sharing mengenai best practice industri, tren teknologi, atau tips karier.",
  },
  {
    title: "Mentoring & Review Session",
    description: "Mentor membimbing kelompok member secara berkala melalui sesi review progress dan debugging.",
  },
  {
    title: "Project Brief & Real Case",
    description: "Partner memberikan problem statement non-kritis sebagai proyek eksploratif yang diulas langsung oleh partner.",
  },
  {
    title: "Workshop Collaboration",
    description: "Kolaborasi menyelenggarakan kelas praktik spesifik, seperti Git workflow, API Integration, atau design system.",
  },
  {
    title: "Institution Partnership",
    description: "Kemitraan formal dengan kampus atau organisasi untuk penyelarasan program belajar atau talent pipeline.",
  },
];

const partnerBenefits = [
  "Ruang memberikan kontribusi sosial yang nyata bagi pengembangan talenta digital.",
  "Akses langsung ke pipeline talenta (future builders) yang terlatih dengan workflow industri.",
  "Membangun personal brand (mentor) atau reputasi perusahaan (partner) di bidang tech.",
  "Peluang eksplorasi R&D non-kritis melalui kolaborasi tim.",
];

const yyzuSupport = [
  "Memfasilitasi alur komunikasi awal antara mentor/partner dengan member.",
  "Membantu menyusun penyesuaian scope project brief agar sesuai standar edukasi.",
  "Menyediakan audiens pembelajar yang aktif dan terkonsolidasi.",
  "Mengelola dokumentasi dasar dan administrasi operasional kegiatan.",
];

const faqs = [
  {
    question: "Apakah mentor harus mengajar secara rutin?",
    answer:
      "Tidak wajib. Peran mentor di YYZU didesain sangat fleksibel. Anda dapat berkontribusi melalui sesi sharing satu kali, mentoring periodik, atau sekadar memberikan ulasan (review) hasil kerja sesuai dengan ketersediaan waktu Anda.",
  },
  {
    question: "Apakah partner bisa memberikan proyek untuk dikerjakan member?",
    answer:
      "Bisa. Partner dapat memberikan project brief atau problem statement nyata. Namun, proyek tersebut harus dikurasi bersama tim YYZU agar scope-nya realistis, memiliki nilai pembelajaran yang jelas, dan tidak bersifat komersial penuh yang mengeksploitasi member.",
  },
  {
    question: "Bagaimana pembagian hak cipta pada proyek kolaborasi?",
    answer:
      "Untuk proyek berbasis project brief edukatif, hak cipta produk dasar tetap berada pada tim pembelajar sebagai portofolio mereka. Jika partner ingin menggunakan solusi tersebut untuk tujuan komersial bisnis langsung, perlu disepakati kompensasi, lisensi, atau skema kerja sama tertulis yang adil di awal program.",
  },
  {
    question: "Apakah kolaborasi ini memerlukan biaya?",
    answer:
      "Kerja sama dasar (magang, sharing, mentoring volunteer) bersifat tidak berbayar demi kontribusi komunitas bersama. Untuk kolaborasi skala institusi yang membutuhkan penyesuaian program khusus, R&D intensif, atau rekrutmen massal, skema kemitraan dapat didiskusikan secara khusus.",
  },
  {
    question: "Apa yang terjadi setelah saya mengisi formulir minat?",
    answer:
      "Tim YYZU akan meninjau data profil Anda, lalu menghubungi Anda melalui email atau WhatsApp untuk berdiskusi santai mengenai bentuk kerja sama, ketersediaan jadwal, dan pemetaan program yang paling sesuai.",
  },
];

export default function MentorPartnershipPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-[#f7f9fb] text-slate-950 border-b border-slate-200 flex flex-col justify-center min-h-[calc(100vh-4rem)]">
        <div className="absolute inset-0 -z-10" style={{ backgroundImage: "radial-gradient(circle, rgba(0,21,165,0.05) 1px, transparent 1px)", backgroundSize: "24px 24px" }}></div>
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#006A67]">
              Mentor & Partner
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl text-slate-950">
              Akselerasikan Kesiapan Talenta Teknologi
            </h1>
            <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">
              YYZU mengundang para praktisi industri, kampus, startup, dan perusahaan untuk ikut membangun ekosistem teknologi kolaboratif. Salurkan insight Anda, berikan tantangan proyek nyata, dan temukan talenta terbaik berikutnya.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">
              Kami percaya kesiapan industri terbentuk saat talenta berinteraksi langsung dengan kebutuhan nyata, menerima kritik konstruktif, dan memahami standar kerja profesional secara kolaboratif.
            </p>
            
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={mentorFormUrl}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#0015A5] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#00118a] shadow-lg shadow-blue-900/10"
              >
                Register as Mentor
              </a>
              <a
                href={mentorFormUrl}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-3 text-sm font-bold text-slate-950 transition hover:border-[#006A67] hover:bg-slate-50"
              >
                Start Partnership
              </a>
            </div>

            <div className="mt-8">
              <p className="inline-flex rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold leading-6 text-slate-700">
                * Anda dapat berkontribusi secara fleksibel sesuai dengan keahlian, waktu luang, atau tujuan strategis institusi Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: DUA JALUR KOLABORASI (MENTOR vs PARTNER) */}
      <section className="bg-white py-16 sm:py-20 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Section
            eyebrow="Jalur Kolaborasi"
            title="Dua cara utama berpartisipasi dalam ekosistem."
            description="Pilih untuk terlibat secara personal sebagai mentor praktisi, atau jalin kemitraan formal sebagai partner institusi."
            align="center"
          />

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {/* COLUMN 1: MENTOR */}
            <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
              <div className="flex-1">
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  Perorangan / Praktisi
                </span>
                <h3 className="mt-4 text-2xl font-bold text-slate-950">Sebagai Mentor Praktisi</h3>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Bimbing future builders secara fleksibel untuk memahami proses belajar, engineering mindset, dan workflow kerja nyata di industri.
                </p>

                <div className="mt-8 border-t border-slate-200/60 pt-6">
                  <h4 className="text-sm font-bold text-slate-950 uppercase tracking-wider">Bentuk Kontribusi</h4>
                  <ul className="mt-4 space-y-3">
                    {mentorContributions.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                        <span className="text-[#006A67] font-bold">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 border-t border-slate-200/60 pt-6">
                  <h4 className="text-sm font-bold text-slate-950 uppercase tracking-wider">Area Fokus Utama</h4>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {mentorFocusAreas.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 2: PARTNER */}
            <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
              <div className="flex-1">
                <span className="inline-flex items-center rounded-md bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700 ring-1 ring-inset ring-teal-700/10">
                  Institusi / Startup / Kampus
                </span>
                <h3 className="mt-4 text-2xl font-bold text-slate-950">Sebagai Mitra Partner</h3>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Sediakan studi kasus nyata (project brief), jalankan proyek R&D edukatif bersama, atau bangun jembatan talent rekrutmen.
                </p>

                <div className="mt-8 border-t border-slate-200/60 pt-6">
                  <h4 className="text-sm font-bold text-slate-950 uppercase tracking-wider">Kemungkinan Project Brief</h4>
                  <ul className="mt-4 space-y-3">
                    {projectPartnerProvides.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                        <span className="text-[#006A67] font-bold">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 border-t border-slate-200/60 pt-6">
                  <h4 className="text-sm font-bold text-slate-950 uppercase tracking-wider">Aktivitas Kolaborasi</h4>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {collaborationOpportunities.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1.5: LEVEL KETERLIBATAN */}
      <section className="bg-white py-16 sm:py-20 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Section
            eyebrow="Level Keterlibatan"
            title="Tiga level kontribusi yang fleksibel."
            description="YYZU membagi tingkat keterlibatan mentor agar bisa disesuaikan dengan kesibukan profesional masing-masing."
            align="center"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {mentorLevels.map((item) => (
              <article
                key={item.level}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="h-1 w-8 rounded-sm bg-[#006A67] mb-4" />
                <h3 className="text-lg font-bold text-slate-950">{item.level}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: BATASAN & SAFETY (DARK) */}
      <section className="bg-slate-950 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Section
            eyebrow="Batasan"
            title="Prinsip Batasan Kerja Sama (Collaboration Boundaries)"
            description="Demi menjaga ekosistem yang sehat, etis, dan bebas eksploitasi, kami menetapkan rambu-rambu kolaborasi yang jelas."
            align="center"
            tone="dark"
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
              <h4 className="text-lg font-bold text-white">Mentor Praktisi</h4>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Mentor berperan sebagai penasihat, reviewer, dan pemberi feedback. Mentor tidak dituntut mengajar secara rutin selayaknya instruktur kelas formal.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
              <h4 className="text-lg font-bold text-white">Project Partner</h4>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Setiap project brief wajib dikurasi bersama agar memiliki bobot edukatif yang seimbang, tidak melanggar etika kerja, serta memiliki target scope yang realistis.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
              <h4 className="text-lg font-bold text-white">Partner Institusi</h4>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Setiap bentuk kerja sama wajib didasarkan pada prinsip timbal balik yang adil. Program kolaborasi ditujukan untuk menyokong proses belajar talenta.
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-rose-900/30 bg-rose-950/20 p-6 md:p-8">
            <h4 className="text-xl font-bold text-rose-200">Kriteria yang Tidak Ditoleransi (Not Acceptable):</h4>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {notAcceptable.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <span className="text-rose-400 font-bold leading-none mt-1">✕</span>
                  <p className="text-sm leading-6 text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: ALUR & MODEL KERJA SAMA */}
      <section className="bg-white py-16 sm:py-20 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            {/* Left Column: Flow */}
            <div className="lg:col-span-5 lg:sticky lg:top-8">
              <span className="text-sm font-bold uppercase tracking-[0.22em] text-[#006A67]">Cara Kerja</span>
              <h3 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">Tahapan Proses Kolaborasi</h3>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Dari penyerahan minat awal hingga pelaksanaan dan evaluasi hasil kerja sama.
              </p>

              <div className="mt-8 space-y-6">
                {collaborationSteps.map((step) => (
                  <div key={step.step} className="flex gap-4 items-start">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-700">
                      {step.step}
                    </span>
                    <div>
                      <h4 className="text-base font-bold text-slate-950">{step.title}</h4>
                      <p className="mt-1 text-xs leading-5 text-slate-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Models */}
            <div className="lg:col-span-7">
              <span className="text-sm font-bold uppercase tracking-[0.22em] text-[#006A67]">Model Kolaborasi</span>
              <h3 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">Pilihan Model Kerja Sama</h3>
              
              <div className="mt-8 space-y-4">
                {collaborationModels.map((model) => (
                  <div key={model.title} className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                    <h4 className="text-lg font-bold text-slate-950">{model.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{model.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: MUTUAL VALUES */}
      <section className="bg-[#f7f9fb] py-16 sm:py-20 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-slate-950">Nilai Tambah untuk Mentor & Partner</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">Bukan sekadar program satu arah, kemitraan memberikan dampak timbal balik yang nyata.</p>
              <div className="mt-6 space-y-3">
                {partnerBenefits.map((item) => (
                  <div key={item} className="rounded-lg border border-slate-200 bg-white p-4 text-sm font-medium text-slate-800 shadow-sm flex items-center gap-3">
                    <span className="text-[#006A67] font-bold">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-slate-950">Dukungan Operasional YYZU</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">Kami mengelola proses operasional agar program berjalan lancar dan terstruktur.</p>
              <div className="mt-6 space-y-3">
                {yyzuSupport.map((item) => (
                  <div key={item} className="rounded-lg border border-slate-200 bg-white p-4 text-sm font-medium text-slate-800 shadow-sm flex items-center gap-3">
                    <span className="text-[#0015A5] font-bold">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: FAQ ACCORDION */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-5 sm:px-6 lg:px-8">
          <Section
            eyebrow="FAQ"
            title="Pertanyaan Umum Kemitraan"
            description="Jawaban ringkas seputar bimbingan mentor, batasan proyek, dan kepemilikan karya."
            align="center"
          />

          <div className="mt-12 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-slate-50">
            {faqs.map((item) => (
              <details
                key={item.question}
                className="group p-6 open:bg-white"
              >
                <summary className="flex cursor-pointer items-start justify-between gap-5 text-left text-slate-950 font-bold text-base">
                  <span>{item.question}</span>
                  <span className="text-lg leading-none transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 text-sm leading-7 text-slate-600 pl-4 border-l-2 border-slate-300">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Mentor & Partner"
        title="Bergabung bersama YYZU untuk mendidik talenta digital masa depan."
        description="Pilih peran Anda sebagai mentor praktisi secara individual atau daftarkan institusi/perusahaan Anda untuk memulai kerja sama ekosistem."
        primaryLabel="Start Partnership / Join as Mentor"
        primaryHref={mentorFormUrl}
      />
    </>
  );
}