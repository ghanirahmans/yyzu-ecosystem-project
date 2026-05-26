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
      "Membantu member belajar secara aktif melalui study group, diskusi, peer learning, mentoring, review, dan proses berbagi pengetahuan yang terarah.",
  },
  {
    title: "Project-based growth",
    description:
      "Member berkembang lewat mini project, internal project, collaborative product, open contribution, dan real project berbasis tim.",
  },
  {
    title: "Industry-oriented development",
    description:
      "Melatih workflow industri, ownership, communication, documentation, review, quality control, dan product/engineering mindset.",
  },
];

export const bridgeCards: BridgeCard[] = [
  {
    title: "Campus & Self Learning",
    body: "Mahasiswa dan talenta teknologi sering punya fondasi belajar yang baik, tetapi masih membutuhkan ruang untuk mengubah pemahaman menjadi pengalaman kolaboratif.",
  },
  {
    title: "YYZU Bridge",
    body: "YYZU menjadi collaborative technology ecosystem yang mempertemukan kampus, talenta teknologi, komunitas, mentor, dan partner melalui learning, mentoring, workflow simulation, project-based growth, dan kontribusi berbasis tim.",
  },
  {
    title: "Industry Readiness",
    body: "Arah akhirnya adalah talenta yang lebih siap menghadapi industri: mampu problem solving, berkomunikasi, bekerja dalam tim, membangun portfolio, dan menjaga kualitas kontribusi secara profesional.",
  },
];

export const whyYYZU: CardItem[] = [
  {
    title: "Learning tidak otomatis menjadi experience",
    description:
      "Menguasai materi, tools, atau syntax belum tentu membuat seseorang siap bekerja dalam real project. Talenta perlu latihan problem solving, teamwork, communication, review, dan pengambilan keputusan.",
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
    title: "Member & Talenta Teknologi",
    description:
      "Ruang untuk mahasiswa, IT learner, developer, designer, product learner, dan talenta teknologi yang ingin memperkuat skill, portfolio, teamwork, communication, dan pengalaman real project.",
  },
  {
    title: "Kampus & Komunitas",
    description:
      "Partner pengembangan talenta untuk membangun learning environment yang lebih dekat dengan kebutuhan industri, workflow modern, dan budaya kolaborasi.",
  },
  {
    title: "Mentor, Industry & Partners",
    description:
      "Ruang kolaborasi untuk praktisi, mentor, organisasi, startup, company, dan industri yang ingin mendukung mentoring, project collaboration, talent development, internship, atau recruitment opportunity.",
  },
];

export const visionMission: CardItem[] = [
  {
    title: "Visi",
    description:
      "Membangun ecosystem teknologi kolaboratif yang membantu talenta berkembang menjadi individu yang adaptif, produktif, kolaboratif, dan siap menghadapi kebutuhan industri digital modern.",
  },
  {
    title: "Misi",
    description:
      "Membangun environment belajar teknologi yang aktif, menjembatani kampus, talenta teknologi, komunitas, mentor, dan industri, serta membantu member tumbuh melalui real project dan pengalaman berbasis tim.",
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
    title: "Ownership",
    description:
      "Menanamkan tanggung jawab terhadap proses belajar, task, project, komunikasi, dan kualitas kontribusi yang bisa dipercaya.",
  },
  {
    title: "Collaboration Over Competition",
    description:
      "Mengutamakan pertumbuhan bersama melalui kontribusi nyata, peer learning, feedback culture, dan mutual support.",
  },
  {
    title: "Sustainable Impact",
    description:
      "Mengarahkan aktivitas, project, dan kontribusi agar memberi manfaat jangka panjang bagi member, partner, dan ecosystem.",
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
      "Orang yang ingin belajar serius, membangun portfolio lewat real project, terbuka pada feedback, dan mau tumbuh melalui proses kolaboratif.",
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
      "Project kecil untuk melatih fundamental, scope, task breakdown, implementation, review, demo, retrospective, dan kerja lintas peran.",
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
      "Latihan membangun solusi nyata secara kolaboratif, dari memahami user need, menyusun scope, membangun fitur, sampai demo, evaluasi, dan portfolio building.",
  },
  {
    title: "Career Preparation",
    description:
      "Persiapan karier melalui portfolio review, communication practice, learning logs, contribution story, dan pemahaman industry readiness.",
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
    date: "17 Mei 2026 - Sekarang",
    period: "Concept Development",
    title: "Pengembangan konsep YYZU",
    description:
      "YYZU berada dalam fase pengembangan konsep, positioning, nilai, bahasa komunikasi, dan arah ecosystem agar jelas sebagai collaborative technology ecosystem dan talent bridge antara kampus, talenta teknologi, komunitas, mentor, dan industri.",
    status: "Active",
  },
  {
    date: "25 Mei 2026 - Sekarang",
    period: "Community Opening",
    title: "YYZU open member",
    description:
      "YYZU Community mulai dibuka untuk member, contributor, mentor, dan partner yang align dengan kultur collaborative learning, ownership, real project experience, dan industry readiness.",
    status: "Open Member",
  },
  {
    date: "Mei 2026 - Sekarang",
    period: "Activities",
    title: "Learn, build, collaborate, grow rhythm",
    description:
      "Mengembangkan format study group, mentoring, workshop, technical discussion, mini project, workflow simulation, dan learning logs yang mudah dijalankan secara konsisten.",
    status: "Active",
  },
  {
    date: "Mei 2026 - Sekarang",
    period: "Projects",
    title: "Real project as growth medium",
    description:
      "Menggunakan kebutuhan internal, real case, open contribution, dan collaborative product sebagai media untuk melatih workflow industri, teamwork, documentation, review, dan delivery.",
    status: "Open",
  },
];

export const upcomingBuildLogs: BuildLog[] = [
  {
    date: "Target: Juni 2026",
    period: "Onboarding",
    title: "Member onboarding & contribution flow",
    description:
      "Menyusun alur awal untuk member baru agar lebih mudah memahami culture, ekspektasi, cara kontribusi, learning rhythm, dan jalur berkembang di YYZU.",
    status: "Planned",
  },
  {
    date: "Target: Juni 2026",
    period: "Activities",
    title: "Activity format pilot",
    description:
      "Menyiapkan format awal study group, mentoring session, technical discussion, mini project, review, dan workflow simulation yang bisa dijalankan secara konsisten.",
    status: "Planned",
  },
  {
    date: "Exploring",
    period: "Build Logs",
    title: "Contribution stories & learning logs",
    description:
      "Mengembangkan format catatan kontribusi agar member bisa menjelaskan proses, role, feedback, keputusan, dan pembelajaran dari real project secara lebih rapi.",
    status: "Next Focus",
  },
];

export const projectPrinciples: CardItem[] = [
  {
    title: "Small, real, reviewable",
    description:
      "Project harus punya scope yang jelas, realistis, bisa dipakai atau diuji, bisa direview, dan meninggalkan pembelajaran yang bisa dijelaskan.",
  },
  {
    title: "Logs before claims",
    description:
      "YYZU memilih menunjukkan proses, keputusan, dan progress kerja. Build logs menjadi bukti praktik, bukan sekadar klaim.",
  },
  {
    title: "Real experience before showcase",
    description:
      "Project bukan hanya showcase. Setiap kontribusi perlu menjelaskan masalah, peran, keputusan, feedback, dan dampaknya bagi project atau ecosystem.",
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
    title: "Member",
    description:
      "Untuk mahasiswa, IT learner, developer, designer, product learner, atau talenta teknologi yang ingin tumbuh lewat collaborative learning, project, dan mentoring.",
  },
  {
    title: "Contributor",
    description:
      "Untuk orang yang ingin membantu mengembangkan sistem, aktivitas, dokumentasi, dan kultur YYZU secara konsisten.",
  },
  {
    title: "Mentor",
    description:
      "Untuk praktisi atau individu berpengalaman yang ingin memberi arahan, review, insight, mentoring, atau feedback pada proses belajar dan project member.",
  },
  {
    title: "Partner",
    description:
      "Untuk kampus, komunitas, organisasi, startup, company, atau institusi yang ingin berkolaborasi melalui workshop, mentoring program, real case, project collaboration, internship, atau career opportunity.",
  },
];

export const faqs: CardItem[] = [
  {
    title: "Apa itu YYZU?",
    description:
      "YYZU adalah collaborative technology ecosystem dan talent bridge yang menghubungkan kampus, talenta teknologi, komunitas, mentor, dan industri melalui collaborative learning, workflow simulation, mentoring, dan real project berbasis tim.",
  },
  {
    title: "Apakah YYZU komunitas coding biasa?",
    description:
      "Tidak. YYZU bukan sekadar komunitas belajar, bukan sekadar tempat mengerjakan project, dan bukan sekadar talent pool. Fokusnya adalah collaborative growth, real-world experience, ownership, teamwork, dan pembentukan product/engineering mindset.",
  },
  {
    title: "Apa kondisi YYZU saat ini?",
    description:
      "YYZU sedang berada dalam fase ecosystem-building. Fokusnya adalah memperkuat kualitas environment, mengembangkan aktivitas kolaboratif, dan membangun pengalaman member terlebih dahulu.",
  },
  {
    title: "YYZU untuk siapa?",
    description:
      "YYZU terbuka untuk mahasiswa, IT learner, developer, UI/UX designer, product learner, QA learner, data/AI learner, creative technologist, dan siapa pun yang ingin belajar, berkontribusi, dan membangun solusi teknologi bersama.",
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
      "Tidak. Mahasiswa adalah salah satu audiens utama, tetapi YYZU terbuka untuk talenta teknologi, mentor, komunitas, kampus, organisasi, dan partner yang align dengan nilai belajar, membangun, dan kontribusi.",
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
      "Buka halaman Join, lalu pilih form yang sesuai: Join as Member untuk member atau contributor, dan Join as Mentor/Partnership untuk mentor atau partner. Ceritakan background, minat, dan bentuk kontribusi yang ingin kamu ikuti.",
  },
];
