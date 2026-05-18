export type CardItem = {
  title: string;
  description: string;
};

export type BridgeCard = {
  title: string;
  body: string;
};

export type BuildLog = {
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
  { label: "Join", href: "/join/" },
  { label: "FAQ", href: "/faq/" },
];

export const modelSteps = [
  "Learn",
  "Build",
  "Collaborate",
  "Contribute",
  "Grow",
];

export const currentFocus: CardItem[] = [
  {
    title: "Engineering culture",
    description:
      "Membangun kebiasaan kerja yang sehat: problem solving, ownership, code review, dokumentasi, komunikasi, dan kualitas delivery.",
  },
  {
    title: "Collaborative activities",
    description:
      "Mengembangkan study group, mentoring teknologi, technical discussion, mini project, dan project collaboration yang relevan dengan praktik industri.",
  },
  {
    title: "Aligned members",
    description:
      "Mengajak mahasiswa, self-taught learner, beginner developer, dan aspiring engineer yang ingin belajar programming sambil membangun pengalaman engineering.",
  },
];

export const bridgeCards: BridgeCard[] = [
  {
    title: "Academic & Self Learning",
    body: "Banyak talenta sudah belajar konsep, tools, dan dasar coding, tetapi masih sering belajar sendirian tanpa konteks kerja tim.",
  },
  {
    title: "YYZU Bridge",
    body: "YYZU menjadi talent bridge untuk latihan collaborative learning, project ownership, mentoring, code review, system design, deployment, dan engineering workflow.",
  },
  {
    title: "Real Engineering Readiness",
    body: "Targetnya bukan sekadar terlihat aktif, tetapi siap menjelaskan keputusan teknis, bekerja dalam teamwork engineering, dan mengirimkan kontribusi yang bisa dipercaya.",
  },
];

export const whyYYZU: CardItem[] = [
  {
    title: "Learning tidak otomatis menjadi experience",
    description:
      "Menguasai materi belajar coding atau software engineering belum tentu membuat seseorang siap bekerja dalam project nyata. Perlu latihan komunikasi, koordinasi, review, dan pengambilan keputusan.",
  },
  {
    title: "Portfolio butuh konteks",
    description:
      "Project yang baik bukan hanya tampilan akhir. Ada proses, issue, tradeoff, dokumentasi, perbaikan, dan cerita kontribusi yang bisa dipertanggungjawabkan.",
  },
  {
    title: "Industry readiness perlu dibangun bertahap",
    description:
      "Kesiapan industri lahir dari kebiasaan yang diulang: memahami masalah, mengerjakan task, menerima feedback, dan meningkatkan kualitas hasil dalam engineering workflow.",
  },
];

export const ecosystemRoles: CardItem[] = [
  {
    title: "Students & IT Learners",
    description:
      "Ruang untuk memperkuat pengembangan skill teknologi, membangun project nyata, terbiasa kerja tim, dan menyiapkan diri menuju lingkungan engineering profesional.",
  },
  {
    title: "Campuses & Communities",
    description:
      "Partner untuk memperkuat komunitas teknologi Indonesia, pengembangan talenta IT, mentoring, dan kegiatan belajar coding bersama yang lebih dekat dengan praktik industri.",
  },
  {
    title: "Mentors & Partners",
    description:
      "Praktisi dan industri yang ingin mendukung talent growth lewat mentoring teknologi, collaborative project, exposure industri, dan talent pipeline yang lebih siap.",
  },
];

export const visionMission: CardItem[] = [
  {
    title: "Vision",
    description:
      "Menjadi engineering ecosystem dan talent bridge yang membantu talenta teknologi tumbuh dari fase belajar menuju pengalaman engineering nyata, kontribusi, dan kesiapan industri.",
  },
  {
    title: "Mission",
    description:
      "Membangun kultur engineering, menyediakan ruang belajar berbasis project, melatih simulasi workflow industri, dan membuka jembatan antara talenta, kampus, mentor, komunitas, serta industri.",
  },
];

export const values: CardItem[] = [
  {
    title: "Engineering Mindset",
    description:
      "Membiasakan cara berpikir yang jelas: memahami masalah sebelum solusi, menimbang tradeoff, dan menjaga kualitas hasil kerja software engineering.",
  },
  {
    title: "Collaboration",
    description:
      "Belajar bekerja bersama melalui diskusi teknis, pembagian peran, review, dan komunikasi yang bisa diikuti orang lain.",
  },
  {
    title: "Ownership",
    description:
      "Mengambil tanggung jawab atas task, keputusan, dokumentasi, dan kualitas kontribusi, bukan sekadar menunggu instruksi.",
  },
  {
    title: "Discipline",
    description:
      "Menjaga ritme kerja yang bisa dipercaya: membaca konteks, menyelesaikan komitmen, memberi update, dan memperbaiki hal yang belum rapi.",
  },
  {
    title: "Contribution",
    description:
      "Mengutamakan real contribution dibanding status member pasif. Progres dilihat dari hal yang dikerjakan, dipelajari, direview, dan dibagikan.",
  },
  {
    title: "Continuous Growth",
    description:
      "Terbuka pada feedback, belajar dari kegagalan project, dan meningkatkan standar diri secara bertahap.",
  },
];

export const philosophy: CardItem[] = [
  {
    title: "Culture over hype",
    description:
      "YYZU tidak mengejar kesan ramai. Yang lebih penting adalah kebiasaan belajar, membangun, dan saling menguatkan dalam komunitas IT yang sehat.",
  },
  {
    title: "Contribution over passive membership",
    description:
      "Menjadi bagian dari YYZU berarti ikut bergerak sesuai kapasitas: bertanya dengan serius, membantu dokumentasi, mengerjakan task, atau memandu diskusi.",
  },
  {
    title: "Consistency over popularity",
    description:
      "Kultur yang kuat dibangun dari ritme stabil: belajar, build, review, dokumentasi, dan refleksi, bukan acara besar yang tidak meninggalkan kebiasaan.",
  },
  {
    title: "Growth over vanity metrics",
    description:
      "Ukuran pertumbuhan bukan sekadar angka, tetapi kualitas proses belajar, kedalaman diskusi, pengalaman engineering, dan kontribusi yang benar-benar tumbuh.",
  },
];

export const fitPeople: CardItem[] = [
  {
    title: "Cocok untuk",
    description:
      "Orang yang ingin belajar serius, membangun portfolio dengan project nyata, terbuka pada feedback, dan mau kontribusi lewat proses collaborative learning.",
  },
  {
    title: "Kurang cocok untuk",
    description:
      "Orang yang hanya mencari sertifikat, ingin hasil instan, pasif menunggu materi, atau tidak ingin terlibat dalam proses kolaborasi.",
  },
];

export const activities: CardItem[] = [
  {
    title: "Study Groups",
    description:
      "Sesi belajar programming dan software engineering secara terarah untuk memperkuat pemahaman teknis, membaca dokumentasi, mencoba tools, dan saling menjelaskan konsep.",
  },
  {
    title: "Technical Discussions",
    description:
      "Diskusi ringan tetapi serius tentang architecture, debugging, product thinking, tooling, dan keputusan teknis di project.",
  },
  {
    title: "Mini Projects",
    description:
      "Project terarah untuk melatih end-to-end delivery: scope, task breakdown, implementation, code review, deployment, demo, dan retrospective.",
  },
  {
    title: "Team Collaboration",
    description:
      "Latihan teamwork engineering dalam role berbeda, menggunakan issue, branch, pull request, dokumentasi, dan komunikasi progress.",
  },
  {
    title: "Engineering Simulation",
    description:
      "Simulasi workflow industri seperti task planning, code review, QA sederhana, release note, dan handoff antar anggota.",
  },
  {
    title: "Workshops",
    description:
      "Sesi praktik untuk topik spesifik seperti Git workflow, API, frontend, backend, deployment, testing, atau technical writing.",
  },
  {
    title: "Open-source Contributions",
    description:
      "Latihan kontribusi terbuka melalui dokumentasi, issue triage, bug fix, atau project internal yang dibuka untuk belajar bersama.",
  },
  {
    title: "Collaborative Product Development",
    description:
      "Latihan membangun produk secara kolaboratif, dari memahami user need, menyusun scope, membangun fitur, sampai demo dan evaluasi.",
  },
  {
    title: "Learning Logs",
    description:
      "Catatan progress, keputusan, dan pembelajaran agar perjalanan membangun bisa dilihat, dievaluasi, dan diteruskan.",
  },
];

export const activityRhythm: CardItem[] = [
  {
    title: "Plan",
    description:
      "Menentukan topik, scope, role, dan ekspektasi kontribusi yang realistis untuk project atau aktivitas yang sedang berjalan.",
  },
  {
    title: "Build",
    description:
      "Mengerjakan task secara terbuka dengan dokumentasi, diskusi, review, dan perhatian pada kualitas delivery.",
  },
  {
    title: "Reflect",
    description:
      "Mencatat apa yang berhasil, apa yang perlu diperbaiki, dan langkah berikutnya.",
  },
];

export const buildLogs: BuildLog[] = [
  {
    period: "Foundation",
    title: "Engineering ecosystem identity",
    description:
      "Menyusun positioning, nilai, bahasa komunikasi, dan arah website agar YYZU jelas sebagai engineering ecosystem, talent bridge, dan ruang collaborative engineering growth.",
    status: "Active",
  },
  {
    period: "Community",
    title: "Aligned contributor growth",
    description:
      "Mengundang orang yang align dengan kultur ownership, konsistensi, dan kontribusi untuk ikut mengembangkan aktivitas dan standar komunitas.",
    status: "Open",
  },
  {
    period: "Activities",
    title: "Learning and build rhythm",
    description:
      "Mengembangkan format study group, technical discussion, mentoring teknologi, mini project, dan learning logs yang mudah dijalankan secara konsisten.",
    status: "Active",
  },
  {
    period: "Projects",
    title: "Internal projects for engineering practice",
    description:
      "Menggunakan kebutuhan YYZU sendiri sebagai media belajar: website, dokumentasi, workflow, tooling komunitas, dan simulasi kolaborasi.",
    status: "Open",
  },
];

export const projectPrinciples: CardItem[] = [
  {
    title: "Small, real, reviewable",
    description:
      "Project harus punya scope yang jelas, bisa dipakai, bisa direview, dan meninggalkan pembelajaran engineering yang bisa dijelaskan.",
  },
  {
    title: "Logs before claims",
    description:
      "YYZU memilih menunjukkan proses, keputusan, dan progress kerja. Build logs menjadi bukti praktik, bukan sekadar klaim.",
  },
  {
    title: "Contribution stories",
    description:
      "Setiap kontribusi penting jika bisa dijelaskan: masalahnya apa, keputusan apa yang diambil, dan apa dampaknya.",
  },
];

export const joinExpectations: CardItem[] = [
  {
    title: "Datang dengan mindset belajar dan kontribusi",
    description:
      "Tidak harus sudah senior. Yang dibutuhkan adalah keseriusan untuk belajar, mencoba, bertanya dengan jelas, dan membantu sesuai kapasitas.",
  },
  {
    title: "Siap bekerja secara kolaboratif",
    description:
      "YYZU menekankan teamwork, komunikasi, dokumentasi, review, dan tanggung jawab terhadap task yang diambil.",
  },
  {
    title: "Menghargai proses engineering",
    description:
      "Progres tidak selalu cepat. Kita membangun kebiasaan problem solving, review, komunikasi, dan delivery secara bertahap.",
  },
];

export const joinPaths: CardItem[] = [
  {
    title: "Learner / Builder",
    description:
      "Untuk mahasiswa, beginner developer, self-taught learner, atau aspiring engineer yang ingin tumbuh lewat belajar coding bersama, project, dan kolaborasi.",
  },
  {
    title: "Core Contributor",
    description:
      "Untuk orang yang ingin membantu mengembangkan sistem, aktivitas, dokumentasi, dan kultur YYZU secara konsisten.",
  },
  {
    title: "Mentor / Partner",
    description:
      "Untuk praktisi, kampus, komunitas, atau industri yang ingin mendukung mentoring, exposure, dan kolaborasi engineering.",
  },
];

export const faqs: CardItem[] = [
  {
    title: "Apa itu YYZU?",
    description:
      "YYZU adalah engineering ecosystem dan talent bridge yang membantu talenta teknologi tumbuh dari fase belajar menuju pengalaman engineering nyata, project collaboration, dan kesiapan industri.",
  },
  {
    title: "Apakah YYZU komunitas coding biasa?",
    description:
      "Tidak. YYZU bukan sekadar tempat berkumpul atau berbagi materi. Fokusnya adalah membangun kultur engineering, kolaborasi, ownership, project-based growth, dan kontribusi nyata.",
  },
  {
    title: "Apa kondisi YYZU saat ini?",
    description:
      "YYZU sedang berada dalam fase ecosystem-building. Fokusnya adalah memperkuat engineering culture, mengembangkan aktivitas kolaboratif, dan menumbuhkan member yang align dengan arah jangka panjang.",
  },
  {
    title: "YYZU untuk siapa?",
    description:
      "YYZU terbuka untuk mahasiswa, beginner developer, self-taught learner, aspiring engineer, dan siapa pun yang ingin belajar, berkontribusi, dan membangun bersama di teknologi.",
  },
  {
    title: "Apakah harus sudah jago coding?",
    description:
      "Tidak harus. Namun kamu perlu punya kemauan belajar, konsistensi, kesiapan menerima feedback, dan niat untuk ikut berkontribusi secara bertahap.",
  },
  {
    title: "Apa yang membedakan YYZU dari bootcamp?",
    description:
      "YYZU bukan program kelas berbayar dengan kurikulum instan. YYZU adalah lingkungan pertumbuhan yang menekankan kultur, kolaborasi, project, mentoring, dan kontribusi.",
  },
  {
    title: "Apakah YYZU hanya untuk mahasiswa?",
    description:
      "Tidak. Mahasiswa adalah salah satu audiens utama, tetapi YYZU terbuka untuk semua talenta teknologi yang align dengan nilai belajar, membangun, dan kontribusi.",
  },
  {
    title: "Aktivitas YYZU apa saja?",
    description:
      "Aktivitas YYZU mencakup study group, technical discussion, mentoring teknologi, mini project, team project, engineering simulation, workshop, learning logs, collaborative product development, dan open-source contribution.",
  },
  {
    title: "Apakah YYZU menyediakan sertifikat?",
    description:
      "Sertifikat bukan fokus utama. YYZU lebih menekankan bukti kontribusi, portfolio, learning logs, pengalaman kerja tim, dan kemampuan menjelaskan proses engineering.",
  },
  {
    title: "Bagaimana cara join?",
    description:
      "Kamu bisa menghubungi YYZU melalui email atau Instagram resmi. Ceritakan background, minat belajar atau kontribusi, dan bagian ekosistem yang ingin kamu ikuti.",
  },
];
