export type CardItem = {
  title: string;
  description: string;
};

export type BridgeCard = {
  title: string;
  body: string;
};

export const navigation = [
  { label: "Tentang", href: "#tentang" },
  { label: "Visi", href: "#visi" },
  { label: "Fokus", href: "#fokus" },
  { label: "Aktivitas", href: "#aktivitas" },
  { label: "Ekosistem", href: "#ekosistem" },
  { label: "FAQ", href: "#faq" },
];

export const values: CardItem[] = [
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

export const focusAreas: CardItem[] = [
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

export const activities = [
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

export const modelSteps = [
  "Learn",
  "Build",
  "Collaborate",
  "Contribute",
  "Grow",
];

export const ecosystemRoles: CardItem[] = [
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

export const missionPoints = [
  "Membangun lingkungan belajar yang kolaboratif, disiplin, dan dekat dengan budaya engineering.",
  "Membantu talenta muda memahami proses kerja industri melalui simulasi workflow dan proyek nyata.",
  "Menghubungkan mahasiswa, kampus, praktisi, dan partner industri dalam ekosistem pertumbuhan yang saling memberi nilai.",
];

export const aboutHighlights = [
  "Kolaborasi lintas peran untuk membangun kebiasaan kerja tim.",
  "Proyek nyata sebagai media belajar, evaluasi, dan portofolio.",
  "Mentoring untuk menjaga arah pertumbuhan teknis dan profesional.",
  "Budaya engineering yang menekankan kualitas, proses, dan ownership.",
];

export const bridgeCards: BridgeCard[] = [
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
];

export const faqs: CardItem[] = [
  {
    title: "Apa itu YYZU?",
    description:
      "YYZU adalah ekosistem pengembangan talenta IT yang menjadi jembatan antara kampus, mahasiswa, dan industri melalui project nyata, teamwork, mentoring, simulasi workflow industri, dan collaborative learning.",
  },
  {
    title: "Apakah YYZU hanya komunitas IT biasa?",
    description:
      "Tidak. YYZU dibangun sebagai environment untuk membangun pengalaman engineering nyata dan kesiapan industri, bukan hanya tempat berkumpul atau belajar teori.",
  },
  {
    title: "Apa tujuan utama YYZU?",
    description:
      "YYZU membantu mahasiswa dan talenta IT berkembang, membangun engineer yang siap industri, serta menjembatani dunia kampus dengan kebutuhan industri modern.",
  },
  {
    title: "Apa saja aktivitas di YYZU?",
    description:
      "Aktivitas YYZU meliputi study group, mentoring, technical discussion, mini project, collaborative project, code review, simulasi workflow industri, workshop, open-source contribution, dan real-world project.",
  },
  {
    title: "Apakah harus sudah jago coding untuk join?",
    description:
      "Tidak. YYZU terbuka untuk orang yang ingin belajar, berkembang, dan berkontribusi bersama. Yang penting adalah kemauan belajar, konsistensi, dan mindset untuk berkembang.",
  },
  {
    title: "Fokus teknologi di YYZU apa?",
    description:
      "Untuk tahap awal, fokus akan diarahkan secara bertahap sesuai kebutuhan dan perkembangan komunitas. Secara umum YYZU berfokus pada skill engineering dan workflow industri modern.",
  },
  {
    title: "Apakah nanti ada project nyata?",
    description:
      "Ya. YYZU dirancang untuk membangun project nyata sebagai media belajar, kolaborasi, dan pengembangan pengalaman industri.",
  },
  {
    title: "Apakah member bisa mendapatkan pengalaman industri?",
    description:
      "Itu salah satu tujuan utama YYZU. Melalui simulasi workflow industri, collaborative project, mentoring, dan relasi industri, member dibantu membangun pengalaman yang lebih relevan dengan dunia kerja.",
  },
  {
    title: "Apakah YYZU akan bekerja sama dengan industri?",
    description:
      "Target jangka panjangnya iya. YYZU ingin menjadi jembatan kolaborasi antara kampus, talenta IT, dan industri teknologi.",
  },
  {
    title: "Apakah nantinya industri bisa merekrut member YYZU?",
    description:
      "Kemungkinan itu sangat terbuka. Namun fokus utama YYZU adalah membangun kualitas member dan pengalaman nyata terlebih dahulu agar peluang internship, collaboration, maupun recruitment terbentuk secara natural.",
  },
  {
    title: "Apakah YYZU bersifat nonprofit?",
    description:
      "YYZU berfokus pada pengembangan talenta dan ekosistem belajar kolaboratif. Ke depannya, project nyata atau kolaborasi dapat dikembangkan untuk mendukung sustainability komunitas dan pengembangan member.",
  },
  {
    title: "Kenapa YYZU dibuat?",
    description:
      "Karena banyak mahasiswa belajar teknologi, tetapi masih kesulitan mendapatkan pengalaman nyata dan kesiapan industri. YYZU hadir untuk menjembatani gap tersebut melalui lingkungan belajar yang kolaboratif, praktikal, dan industry-oriented.",
  },
  {
    title: "Apa bedanya YYZU dengan komunitas lain?",
    description:
      "YYZU berfokus pada engineering culture, collaborative growth, real-world experience, dan simulasi workflow industri. Fokusnya bukan hanya belajar teknologi, tetapi membangun engineer yang siap berkembang di dunia profesional.",
  },
  {
    title: "Apakah YYZU hanya untuk mahasiswa?",
    description:
      "Tidak. YYZU terbuka untuk siapa saja yang ingin belajar, berkembang, dan membangun bersama di bidang teknologi.",
  },
  {
    title: "Bagaimana cara join atau berkolaborasi?",
    description:
      "Informasi terkait open member dan collaboration akan diumumkan melalui platform resmi YYZU.",
  },
];
