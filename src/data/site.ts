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
  { label: "Mentor & Partnership", href: "/mentor-partnership/" },
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
      "Membantu member belajar secara aktif melalui diskusi, peer learning, review, mentoring, dan proses berbagi pengetahuan yang terarah.",
  },
  {
    title: "Real-world experience",
    description:
      "Member tidak hanya mempelajari teori, tetapi ikut membangun mini project, collaborative project, dan real project development berbasis tim.",
  },
  {
    title: "Industry workflow",
    description:
      "Melatih cara kerja yang relevan dengan industri: task planning, ownership, communication, review, documentation, dan continuous improvement.",
  },
];

export const bridgeCards: BridgeCard[] = [
  {
    title: "Campus & Self Learning",
    body: "Mahasiswa dan talenta teknologi sering punya fondasi belajar yang baik, tetapi masih membutuhkan ruang untuk mengubah pemahaman menjadi pengalaman kolaboratif.",
  },
  {
    title: "YYZU Bridge",
    body: "YYZU menjadi collaborative technology ecosystem yang mempertemukan learning, mentoring, workflow simulation, project-based growth, dan kontribusi berbasis tim.",
  },
  {
    title: "Industry Readiness",
    body: "Arah akhirnya adalah talenta yang lebih siap menghadapi industri: mampu problem solving, berkomunikasi, bekerja dalam tim, membangun portfolio, dan menjaga kualitas kontribusi.",
  },
];

export const whyYYZU: CardItem[] = [
  {
    title: "Learning tidak otomatis menjadi experience",
    description:
      "Menguasai materi, tools, atau syntax belum tentu membuat seseorang siap bekerja dalam project nyata. Talenta perlu latihan problem solving, teamwork, communication, review, dan pengambilan keputusan.",
  },
  {
    title: "Portfolio butuh proses",
    description:
      "Project yang kuat bukan hanya hasil akhir. Ada proses memahami masalah, membagi scope, memilih solusi, memperbaiki feedback, dan menjelaskan kontribusi secara bertanggung jawab.",
  },
  {
    title: "Industry readiness dibangun bertahap",
    description:
      "Kesiapan industri lahir dari kebiasaan yang diulang: belajar, build, berkolaborasi, menerima feedback, menjaga ownership, dan meningkatkan standar kerja secara konsisten.",
  },
];

export const ecosystemRoles: CardItem[] = [
  {
    title: "Students & IT Learners",
    description:
      "Ruang untuk mahasiswa, learner, dan talenta teknologi yang ingin memperkuat technical skill, portfolio, teamwork, communication, dan pengalaman project nyata.",
  },
  {
    title: "Campuses",
    description:
      "Partner pengembangan talenta untuk membangun learning environment yang lebih dekat dengan kebutuhan industri, workflow modern, dan budaya kolaborasi.",
  },
  {
    title: "Industry & Partners",
    description:
      "Ruang kolaborasi untuk praktisi, mentor, organisasi, dan industri yang ingin mendukung mentoring, project collaboration, talent development, internship, atau recruitment pipeline.",
  },
];

export const visionMission: CardItem[] = [
  {
    title: "Visi",
    description:
      "Membangun ecosystem teknologi yang membantu talenta berkembang menjadi individu yang adaptif, kolaboratif, dan siap menghadapi dunia industri modern.",
  },
  {
    title: "Misi",
    description:
      "Membangun environment belajar teknologi yang aktif, menjembatani kampus, talenta, dan industri, serta membantu member tumbuh melalui pengalaman nyata dan project berbasis tim.",
  },
];

export const values: CardItem[] = [
  {
    title: "Build Together",
    description:
      "Berkembang melalui kolaborasi, kontribusi bersama, peer learning, dan kemampuan membangun solusi teknologi sebagai tim.",
  },
  {
    title: "Continuous Growth",
    description:
      "Mendorong proses belajar dan pengembangan yang berkelanjutan melalui feedback, review, refleksi, dan peningkatan standar secara bertahap.",
  },
  {
    title: "Real Experience",
    description:
      "Belajar melalui praktik langsung, collaborative project, workflow simulation, open-source contribution, dan real-world project development.",
  },
  {
    title: "Industry-Oriented",
    description:
      "Mengarahkan skill, mindset, komunikasi, dan workflow agar relevan dengan kebutuhan industri teknologi modern.",
  },
  {
    title: "Ownership & Consistency",
    description:
      "Menanamkan tanggung jawab, disiplin, komitmen, dan kebiasaan menyelesaikan kontribusi dengan kualitas yang bisa dipercaya.",
  },
  {
    title: "Product & Engineering Mindset",
    description:
      "Membiasakan member memahami masalah, user need, scope, tradeoff, kualitas teknis, dan dampak solusi yang dibangun.",
  },
];

export const philosophy: CardItem[] = [
  {
    title: "Collaboration over competition",
    description:
      "Fokus utama YYZU bukan kompetisi internal, tetapi berkembang bersama melalui kontribusi, diskusi, dan problem solving kolektif.",
  },
  {
    title: "Contribution over passive membership",
    description:
      "Menjadi bagian dari YYZU berarti ikut bergerak sesuai kapasitas: bertanya dengan serius, membantu dokumentasi, mengerjakan task, review, atau memandu diskusi.",
  },
  {
    title: "Consistency over popularity",
    description:
      "Kultur yang kuat dibangun dari ritme stabil: learning, build, collaboration, review, dokumentasi, dan refleksi yang terus diperbaiki.",
  },
  {
    title: "Growth over vanity metrics",
    description:
      "Ukuran pertumbuhan bukan sekadar angka, tetapi kualitas proses belajar, kedalaman diskusi, pengalaman project, dan kontribusi yang benar-benar tumbuh.",
  },
];

export const fitPeople: CardItem[] = [
  {
    title: "Cocok untuk",
    description:
      "Orang yang ingin belajar serius, membangun portfolio lewat project nyata, terbuka pada feedback, dan mau tumbuh melalui proses kolaboratif.",
  },
  {
    title: "Kurang cocok untuk",
    description:
      "Orang yang hanya mencari sertifikat, ingin hasil instan, pasif menunggu materi, atau tidak ingin terlibat dalam teamwork dan kontribusi.",
  },
];

export const activities: CardItem[] = [
  {
    title: "Study Groups",
    description:
      "Sesi belajar terarah untuk memperkuat fundamental, tools, workflow dasar, membaca dokumentasi, mencoba teknologi, dan saling menjelaskan konsep.",
  },
  {
    title: "Mentoring & Technical Discussions",
    description:
      "Ruang mentoring dan diskusi tentang software development, UI/UX, product thinking, debugging, tooling, architecture, dan keputusan teknis di project.",
  },
  {
    title: "Mini Projects",
    description:
      "Project terarah untuk melatih scope, task breakdown, implementation, review, demo, retrospective, dan kerja lintas peran dalam skala kecil.",
  },
  {
    title: "Team Collaboration",
    description:
      "Latihan teamwork dalam role berbeda, menggunakan issue, branch, review, dokumentasi, update progress, dan handoff antar anggota.",
  },
  {
    title: "Workflow Simulation",
    description:
      "Simulasi workflow industri seperti planning, review, QA sederhana, release note, product handoff, dan evaluasi hasil kerja.",
  },
  {
    title: "Workshops",
    description:
      "Sesi praktik untuk topik spesifik seperti Git workflow, API, frontend, backend, deployment, testing, atau technical writing.",
  },
  {
    title: "Open-source Contributions",
    description:
      "Latihan kontribusi terbuka melalui dokumentasi, issue triage, bug fix, improvement kecil, atau project internal yang dibuka untuk belajar bersama.",
  },
  {
    title: "Real-world Project Development",
    description:
      "Latihan membangun solusi nyata secara kolaboratif, dari memahami user need, menyusun scope, membangun fitur, sampai demo dan evaluasi.",
  },
  {
    title: "Learning Logs",
    description:
      "Catatan progress, keputusan, dan pembelajaran agar perjalanan membangun bisa dilihat, dievaluasi, dan diteruskan.",
  },
];

export const activityRhythm: CardItem[] = [
  {
    title: "Learn",
    description:
      "Memahami fundamental, tools, konteks masalah, role, dan workflow dasar sesuai bidang yang diminati.",
  },
  {
    title: "Build",
    description:
      "Mengerjakan task dan project secara bertahap dengan dokumentasi, diskusi, review, dan perhatian pada kualitas delivery.",
  },
  {
    title: "Collaborate",
    description:
      "Bekerja dalam tim, melakukan review, memberi update, menyelesaikan masalah bersama, dan memahami cara handoff yang jelas.",
  },
  {
    title: "Grow",
    description:
      "Mencatat pembelajaran, memperkuat portfolio, meningkatkan standar, dan berkembang menjadi contributor, mentor, atau collaborator.",
  },
];

export const buildLogs: BuildLog[] = [
  {
    period: "Foundation",
    title: "Collaborative technology ecosystem identity",
    description:
      "Menyusun positioning, nilai, bahasa komunikasi, dan arah website agar YYZU jelas sebagai collaborative technology ecosystem dan talent bridge.",
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
    title: "Learn, build, collaborate, grow rhythm",
    description:
      "Mengembangkan format study group, mentoring, workshop, technical discussion, mini project, workflow simulation, dan learning logs yang mudah dijalankan secara konsisten.",
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
      "Project harus punya scope yang jelas, bisa dipakai, bisa direview, dan meninggalkan pembelajaran yang bisa dijelaskan.",
  },
  {
    title: "Logs before claims",
    description:
      "YYZU memilih menunjukkan proses, keputusan, dan progress kerja. Build logs menjadi bukti praktik, bukan sekadar klaim.",
  },
  {
    title: "Contribution stories",
    description:
      "Setiap kontribusi penting jika bisa dijelaskan: masalahnya apa, peran yang diambil, keputusan yang dibuat, dan dampaknya bagi project atau ecosystem.",
  },
];

export const joinExpectations: CardItem[] = [
  {
    title: "Datang dengan mindset belajar dan kontribusi",
    description:
      "Tidak harus sudah senior. Yang dibutuhkan adalah keseriusan untuk belajar, mencoba, bertanya dengan jelas, menerima feedback, dan membantu sesuai kapasitas.",
  },
  {
    title: "Siap bekerja secara kolaboratif",
    description:
      "YYZU menekankan teamwork, komunikasi, dokumentasi, review, dan tanggung jawab terhadap task atau role yang diambil.",
  },
  {
    title: "Menghargai proses growth",
    description:
      "Progres tidak selalu cepat. Kita membangun technical skill, problem solving, ownership, communication, dan delivery secara bertahap.",
  },
];

export const joinPaths: CardItem[] = [
  {
    title: "Learner / Builder",
    description:
      "Untuk mahasiswa, beginner developer, self-taught learner, designer, atau aspiring technologist yang ingin tumbuh lewat belajar, project, dan kolaborasi.",
  },
  {
    title: "Core Contributor",
    description:
      "Untuk orang yang ingin membantu mengembangkan sistem, aktivitas, dokumentasi, dan kultur YYZU secara konsisten.",
  },
  {
    title: "Mentor / Partner",
    description:
      "Untuk praktisi, kampus, komunitas, atau industri yang ingin mendukung mentoring, workshop, project collaboration, talent development, atau exposure industri.",
  },
];

export const faqs: CardItem[] = [
  {
    title: "Apa itu YYZU?",
    description:
      "YYZU adalah collaborative technology ecosystem dan talent bridge yang menghubungkan kampus, talenta teknologi, dan industri melalui collaborative learning, workflow simulation, mentoring, dan project nyata berbasis tim.",
  },
  {
    title: "Apakah YYZU komunitas coding biasa?",
    description:
      "Tidak. YYZU bukan sekadar tempat berkumpul atau berbagi materi. Fokusnya adalah collaborative growth, real-world experience, ownership, teamwork, dan pembentukan engineering serta product mindset.",
  },
  {
    title: "Apa kondisi YYZU saat ini?",
    description:
      "YYZU sedang berada dalam fase ecosystem-building. Fokusnya adalah memperkuat kualitas environment, mengembangkan aktivitas kolaboratif, dan membangun pengalaman member terlebih dahulu.",
  },
  {
    title: "YYZU untuk siapa?",
    description:
      "YYZU terbuka untuk mahasiswa, IT learner, beginner developer, designer, product learner, creative technologist, dan siapa pun yang ingin belajar, berkontribusi, dan membangun solusi teknologi bersama.",
  },
  {
    title: "Apakah harus sudah jago coding?",
    description:
      "Tidak harus. Namun kamu perlu punya kemauan belajar, konsistensi, kesiapan menerima feedback, dan niat untuk ikut berkontribusi secara bertahap.",
  },
  {
    title: "Apa yang membedakan YYZU dari bootcamp?",
    description:
      "YYZU bukan program kelas instan. YYZU adalah environment pertumbuhan yang menekankan kolaborasi, project-based growth, mentoring, workflow industri, portfolio, dan kontribusi nyata.",
  },
  {
    title: "Apakah YYZU hanya untuk mahasiswa?",
    description:
      "Tidak. Mahasiswa adalah salah satu audiens utama, tetapi YYZU terbuka untuk semua talenta teknologi yang align dengan nilai belajar, membangun, dan kontribusi.",
  },
  {
    title: "Aktivitas YYZU apa saja?",
    description:
      "Aktivitas YYZU mencakup study group, mentoring, workshop, technical discussion, mini project, code review, design review, workflow simulation, open-source contribution, dan real-world project development.",
  },
  {
    title: "Apakah YYZU menyediakan sertifikat?",
    description:
      "Sertifikat bukan fokus utama. YYZU lebih menekankan bukti kontribusi, portfolio, learning logs, pengalaman kerja tim, dan kemampuan menjelaskan proses serta keputusan yang dibuat.",
  },
  {
    title: "Bagaimana cara join?",
    description:
      "Kamu bisa menghubungi YYZU melalui email atau Instagram resmi. Ceritakan background, minat belajar atau kontribusi, dan bagian ekosistem yang ingin kamu ikuti.",
  },
];
