export type CardItem = {
  title: string;
  description: string;
};

export type BridgeCard = {
  title: string;
  body: string;
};

export type BuildLog = {
  date: string;
  period: string;
  title: string;
  description: string;
  status: string;
};

export const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about/" },
  { label: "Culture", href: "/culture/" },
  { label: "Activities", href: "/activities/" },
  { label: "Build Logs", href: "/projects/" },
  { label: "Mentor & Partner", href: "/mentor-partnership/" },
  { label: "Wiki Docs", href: "/docs/" },
  { label: "Join", href: "/join/" },
  { label: "FAQ", href: "/faq/" },
];

export const modelSteps = [
  "Learn",
  "Build",
  "Collaborate",
  "Grow",
];

export const currentFocus: CardItem[] = [
  {
    title: "Collaborative learning",
    description:
      "Mengaktifkan proses belajar mandiri melalui study group terarah, peer discussion, mentoring, dan culture saling berbagi pengetahuan secara kolektif.",
  },
  {
    title: "Project-based growth",
    description:
      "Mengakselerasi pemahaman melalui pengerjaan mini project, open contribution, internal product development, dan simulasi project berbasis tim.",
  },
  {
    title: "Industry-oriented development",
    description:
      "Membiasakan workflow standar industri seperti task breakdown, review, documentation, quality control, dan pembentukan engineering mindset.",
  },
];

export const bridgeCards: BridgeCard[] = [
  {
    title: "Campus & Self Learning",
    body: "Mahasiswa dan talenta teknologi sering memiliki fondasi teori yang baik, namun masih membutuhkan ruang praktik nyata untuk mentransformasi pemahaman menjadi portofolio kolaboratif.",
  },
  {
    title: "YYZU Ecosystem",
    body: "YYZU bertindak sebagai collaborative technology ecosystem yang mempertemukan talenta, kampus, mentor, dan partner industri melalui mentoring, workflow simulation, dan pengerjaan project brief terarah.",
  },
  {
    title: "Industry Readiness",
    body: "Arah akhirnya adalah melahirkan future builders yang siap menghadapi industri: mampu memecahkan masalah, berkomunikasi dalam tim, memegang ownership, dan menjaga kualitas delivery.",
  },
];

export const whyYYZU: CardItem[] = [
  {
    title: "Learning Tidak Otomatis Menjadi Experience",
    description:
      "Memahami syntax atau tools belum tentu membuat seseorang siap bekerja dalam project nyata. Talenta butuh latihan langsung dalam hal kolaborasi, komunikasi, dan problem solving.",
  },
  {
    title: "Portofolio Berkualitas Butuh Proses",
    description:
      "Portofolio yang kredibel bukan sekadar hasil akhir kode. Di dalamnya ada proses memahami problem statement, membagi scope, iterasi feedback, dan pertanggungjawaban solusi.",
  },
  {
    title: "Industry Readiness Dibangun Bertahap",
    description:
      "Kesiapan kerja lahir dari habit yang dilatih secara konsisten: menulis dokumentasi yang jelas, melakukan review kode, menerima masukan, dan menjaga ownership kontribusi.",
  },
];

export const ecosystemRoles: CardItem[] = [
  {
    title: "Member & Future Builders",
    description:
      "Untuk mahasiswa, IT learner, developer, designer, dan product enthusiast yang ingin memperkuat portofolio proses, kerja tim, dan kesiapan industri.",
  },
  {
    title: "Kampus & Komunitas Pendukung",
    description:
      "Sebagai mitra strategis untuk mempersempit gap akademis dengan industri melalui penyelarasan program belajar praktis dan workflow kolaboratif.",
  },
  {
    title: "Mentor & Partner Industri",
    description:
      "Ruang kontribusi praktisi dan organisasi untuk membimbing talenta melalui sharing session, review, penyediaan project brief, hingga akses rekrutmen.",
  },
];

export const visionMission: CardItem[] = [
  {
    title: "Visi",
    description:
      "Membangun ekosistem teknologi kolaboratif yang menjembatani talenta berkembang menjadi individu yang adaptif, ber-mindset produk, dan siap menghadapi kebutuhan industri digital modern.",
  },
  {
    title: "Misi",
    description:
      "Menciptakan environment pertumbuhan teknologi yang aktif, mempertemukan kampus, talenta, mentor, dan partner, serta mendidik member melalui real-world project dan workflow kolaboratif.",
  },
];

export const values: CardItem[] = [
  {
    title: "Build Together",
    description:
      "Berkembang melalui kolaborasi aktif, peer learning, dan kemampuan memecahkan masalah sebagai satu tim perangkat lunak.",
  },
  {
    title: "Continuous Growth",
    description:
      "Mendorong peningkatan standar kompetensi secara bertahap melalui siklus feedback, review berkala, dan refleksi pembelajaran.",
  },
  {
    title: "Real Experience",
    description:
      "Belajar langsung dari praktik, simulasi workflow industri, open contribution, dan pengerjaan project brief.",
  },
  {
    title: "Industry-Oriented",
    description:
      "Mengarahkan skill teknis, metode komunikasi, dokumentasi, dan kualitas delivery agar relevan dengan kebutuhan industri digital.",
  },
  {
    title: "Ownership",
    description:
      "Menumbuhkan tanggung jawab penuh terhadap proses belajar pribadi, tugas yang diambil, serta kualitas kontribusi yang dikirimkan.",
  },
  {
    title: "Collaboration Over Competition",
    description:
      "Memprioritaskan kesuksesan bersama melalui kultur feedback yang sehat, peer review, dan dukungan tim yang mutual.",
  },
];

export const philosophy: CardItem[] = [
  {
    title: "Kolaborasi di Atas Kompetisi",
    description:
      "Fokus utama YYZU adalah tumbuh bersama melalui kontribusi aktif dan pemecahan masalah secara kolektif, bukan persaingan nilai.",
  },
  {
    title: "Kontribusi Aktif, Bukan Keanggotaan Pasif",
    description:
      "Menjadi bagian dari YYZU berarti ikut bergerak sesuai kapasitas: berdiskusi secara serius, membantu dokumentasi, atau mengulas hasil kerja rekan.",
  },
  {
    title: "Konsistensi di Atas Popularitas",
    description:
      "Kultur ekosistem yang kuat dibangun dari ritme stabil: belajar, membangun, mengulas, mendokumentasikan, dan melakukan refleksi berkala.",
  },
  {
    title: "Kualitas Proses di Atas Metrik Semu",
    description:
      "Ukuran kesuksesan diukur dari kedalaman pemahaman masalah, kualitas kolaborasi tim, dan ketajaman portofolio proses yang dibangun.",
  },
];

export const fitPeople: CardItem[] = [
  {
    title: "Sangat cocok untuk:",
    description:
      "Talenta yang ingin belajar serius, membangun portofolio berbasis proyek nyata, terbuka terhadap kritik/feedback konstruktif, serta berkomitmen dalam kerja tim.",
  },
  {
    title: "Kurang cocok untuk:",
    description:
      "Individu yang hanya mengejar sertifikat kelulusan, mengharapkan materi/instruksi pasif satu arah, menginginkan hasil instan, atau enggan terlibat dalam kolaborasi tim.",
  },
];

export const activities: CardItem[] = [
  {
    title: "Study Groups",
    description:
      "Sesi belajar terarah untuk memperkuat fundamental teknologi, mempelajari dokumentasi alat, dan mendiskusikan konsep secara mendalam bersama rekan sejawat.",
  },
  {
    title: "Mentoring & Technical Review",
    description:
      "Sesi bimbingan interaktif bersama praktisi mengenai software development, UI/UX design, product management, architectural decisions, dan debugging.",
  },
  {
    title: "Mini Projects",
    description:
      "Pengerjaan proyek berskala kecil untuk melatih koordinasi tim, breakdown tugas, implementasi fitur dasar, dan proses demonstrasi produk.",
  },
  {
    title: "Workflow Simulation",
    description:
      "Simulasi langsung workflow kerja industri seperti sprint planning, code/design review, version control management, QA, dan pembuatan release notes.",
  },
  {
    title: "Real Case Collaboration",
    description:
      "Penyelesaian problem statement dan project brief nyata dari partner ekosistem, memberikan pengalaman kolaborasi yang edukatif dan menantang.",
  },
  {
    title: "Career & Portfolio Prep",
    description:
      "Persiapan karier melalui portfolio review, simulasi komunikasi profesional, pencatatan learning logs, dan penyelarasan standar industry readiness.",
  },
];

export const activityRhythm: CardItem[] = [
  {
    title: "Learn",
    description:
      "Memahami fundamental, alat bantu pengembangan, konteks masalah, serta dasar-dasar workflow sesuai bidang fokus.",
  },
  {
    title: "Build",
    description:
      "Mengeksekusi tugas dan project brief secara iteratif dengan penekanan pada dokumentasi dan kualitas hasil kerja.",
  },
  {
    title: "Collaborate",
    description:
      "Bekerja dalam tim lintas peran, melakukan ulasan (review) silang, memberikan pembaruan berkala, dan melatih handoff kerja yang rapi.",
  },
  {
    title: "Grow",
    description:
      "Mendokumentasikan proses belajar (learning logs), memperkuat portofolio proses, dan naik kelas menjadi kontributor aktif ekosistem.",
  },
];

export const buildLogs: BuildLog[] = [
  {
    date: "17 Mei 2026 - Sekarang",
    period: "Concept Development",
    title: "Penyusunan Konsep Ekosistem",
    description:
      "Merumuskan konsep positioning YYZU sebagai collaborative technology ecosystem dan talent bridge untuk menyelaraskan arah gerak antara kampus, talenta, mentor, dan industri.",
    status: "Aktif",
  },
  {
    date: "25 Mei 2026 - 8 Juni 2026",
    period: "Ecosystem Onboarding",
    title: "Pendaftaran Partisipan Ekosistem Batch 1",
    description:
      "Membuka registrasi bagi future builders, kontributor internal, mentor praktisi, dan partner industri yang memiliki keselarasan nilai dalam kolaborasi praktis.",
    status: "Pendaftaran Ditutup",
  },
  {
    date: "Mei 2026 - Sekarang",
    period: "Activities Pilot",
    title: "Implementasi Ritme Belajar & Build",
    description:
      "Menjalankan format study group, simulasi review, serta technical discussion untuk membiasakan ritme kolaboratif yang stabil.",
    status: "Aktif",
  },
  {
    date: "Mei 2026 - Sekarang",
    period: "Internal Projects",
    title: "Pengerjaan Project Internal & Brief",
    description:
      "Menggunakan kebutuhan infrastruktur ekosistem sebagai media belajar awal untuk mempraktikkan standarisasi git workflow, issue tracking, dan dokumentasi.",
    status: "Berjalan",
  },

  {
    date: "10 Juni 2026",
    period: "Onboarding YYZU Batch 1",
    title: "Pengumuman Onboarding YYZU Batch 1",
    description:
      "Pengumuman pelaksanaan onboarding bagi peserta terpilih yang akan bergabung dalam ekosistem YYZU Batch 1.",
    status: "Berhasil",
  }

];

export const upcomingBuildLogs: BuildLog[] = [
  {
    date: "Target: Juni 2026",
    period: "Onboarding Flow",
    title: "Standardisasi Onboarding Partisipan",
    description:
      "Menyusun alur awal bagi member baru agar lebih cepat memahami culture ekosistem, ekspektasi kolaborasi, dan cara berkontribusi secara efektif.",
    status: "Direncanakan",
  },
  {
    date: "Target: Juni 2026",
    period: "Project Brief System",
    title: "Integrasi Project Brief & Partner",
    description:
      "Menyusun standarisasi kurasi project brief dari partner ekosistem agar memenuhi kriteria pembelajaran yang sehat dan bebas eksploitasi.",
    status: "Direncanakan",
  },
  {
    date: "Dalam Eksplorasi",
    period: "Learning Logs",
    title: "Sistem Dokumentasi Portfolio Proses",
    description:
      "Mengembangkan platform pencatatan learning logs dan contribution stories agar member dapat menunjukkan proses pemecahan masalah secara terstruktur kepada industri.",
    status: "Fokus Berikutnya",
  },
];

export const projectPrinciples: CardItem[] = [
  {
    title: "Scope Realistis & Tepat Guna",
    description:
      "Setiap proyek dirancang dengan scope yang jelas, disesuaikan dengan kapasitas belajar, serta berorientasi pada penyelesaian masalah konkret.",
  },
  {
    title: "Proses Terbuka & Terdokumentasi",
    description:
      "Kami percaya proses pengerjaan, dokumentasi keputusan teknis, dan catatan perbaikan (logs) jauh lebih berharga dibanding klaim sepihak.",
  },
  {
    title: "Ulasan Kritis & Edukatif",
    description:
      "Setiap kontribusi harus melalui proses review (desain atau kode) untuk membiasakan talenta menerima masukan profesional.",
  },
];

export const joinExpectations: CardItem[] = [
  {
    title: "Mindset Belajar Aktif & Berkontribusi",
    description:
      "Anda tidak harus menjadi pakar sejak awal. Yang dicari adalah kemauan untuk mencoba, berani bertanya secara runut, dan berkontribusi aktif dalam tim.",
  },
  {
    title: "Komitmen Bekerja secara Kolaboratif",
    description:
      "Ekosistem YYZU sangat mengedepankan teamwork, kebiasaan menulis dokumentasi, melakukan ulasan silang, dan menjaga ownership tugas.",
  },
  {
    title: "Menghargai Kecepatan Proses Tumbuh",
    description:
      "Kami fokus pada pembentukan habits kerja yang baik secara bertahap. Pertumbuhan keterampilan teknis dan soft skills memerlukan konsistensi proses.",
  },
];

export const joinPaths: CardItem[] = [
  {
    title: "Member & Future Builders",
    description:
      "Untuk mahasiswa, IT learner, developer, designer, atau product learner yang ingin bertumbuh melalui collaborative learning, pengerjaan project brief, dan mentoring.",
  },
  {
    title: "Ecosystem Contributor",
    description:
      "Untuk individu yang ingin berkontribusi dalam membangun infrastruktur, sistem belajar, konten, dokumentasi, atau operasional internal YYZU secara berkelanjutan.",
  },
  {
    title: "Industry Mentor",
    description:
      "Untuk praktisi teknologi, UI/UX, product, dan bisnis yang bersedia membagikan insight, melakukan review hasil kerja, atau memberikan bimbingan berkala.",
  },
  {
    title: "Collaboration Partner",
    description:
      "Untuk kampus, startup, perusahaan, organisasi, atau institusi yang ingin berkolaborasi melalui program R&D edukatif, penyusunan project brief, atau talent pipeline.",
  },
];

export const faqs: CardItem[] = [
  {
    title: "Apa itu YYZU?",
    description:
      "YYZU adalah collaborative technology ecosystem dan talent bridge yang menghubungkan talenta teknologi (future builders), kampus, mentor praktisi, dan industri melalui program belajar berbasis praktik, workflow simulation, mentoring, dan penyusunan project brief kolaboratif.",
  },
  {
    title: "Apakah YYZU komunitas belajar biasa?",
    description:
      "Bukan. YYZU bukan sekadar tempat kumpul atau diskusi santai. YYZU adalah ekosistem terstruktur yang berfokus pada collaborative growth, pembentukan engineering/product mindset, simulasi workflow industri nyata, dan pembangunan portofolio berbasis proses.",
  },
  {
    title: "Apa status YYZU saat ini?",
    description:
      "YYZU sedang berada dalam fase pembangunan ekosistem awal (ecosystem-building). Kami fokus memperkuat kualitas lingkungan belajar kolaboratif, membakukan alur onboarding, dan menjalankan proyek internal ekosistem sebagai medium praktik awal.",
  },
  {
    title: "Siapa saja yang bisa bergabung?",
    description:
      "YYZU terbuka untuk mahasiswa, pembelajar IT mandiri, developer, designer, calon product manager, praktisi industri yang ingin mementor, serta institusi (kampus, startup, perusahaan) yang ingin menjalin kolaborasi pengembangan talenta.",
  },
  {
    title: "Apakah saya harus sudah mahir pemrograman?",
    description:
      "Tidak harus. Namun, Anda wajib memiliki fondasi pengetahuan dasar di bidang pilihan Anda, kemauan kuat untuk belajar mandiri secara aktif, kesiapan menerima feedback, dan niat untuk ikut berkontribusi dalam kerja kelompok.",
  },
  {
    title: "Apa perbedaan YYZU dengan program Bootcamp?",
    description:
      "YYZU bukan program kursus kilat berbayar atau kelas satu arah. YYZU adalah ekosistem berkelanjutan di mana Anda belajar dengan cara melakukan praktik langsung, berkolaborasi dalam tim nyata, disimulasikan dengan workflow industri, serta dibimbing oleh mentor praktisi.",
  },
  {
    title: "Apakah YYZU menjamin sertifikat atau kelulusan kerja?",
    description:
      "Kami tidak menyediakan jalan pintas berupa jaminan kerja atau sertifikat formal kelulusan. Kami fokus membantu Anda membangun portofolio proses yang kredibel, meningkatkan kompetensi pemecahan masalah, dan melatih cara kerja tim yang diakui oleh industri.",
  },
  {
    title: "Bagaimana cara mendaftar ke YYZU?",
    description:
      "Buka halaman Join di yyzu.tech/join, lalu pilih formulir pendaftaran yang sesuai dengan peran Anda: Join as Member (untuk member & kontributor) atau Join as Mentor/Partner. Setelah mengirimkan ketertarikan, tim kami akan meninjau dan menghubungi Anda untuk onboarding atau diskusi lanjutan.",
  },
];
