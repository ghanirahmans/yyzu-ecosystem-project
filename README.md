# YYZU Ecosystem Platform

Platform ini adalah portal resmi dan sistem manajemen internal untuk ekosistem YYZU.

YYZU adalah *collaborative technology ecosystem* dan *talent bridge* yang menghubungkan kampus, talenta teknologi (*future builders*), mentor praktisi, dan industri melalui kolaborasi aktif, mentoring, simulasi alur kerja, dan *project-based growth*.

Aplikasi ini mencakup website publik pengenalan ekosistem serta **Admin Dashboard** internal untuk pengelolaan program, kemitraan, pembagian divisi, dan keanggotaan.

---

## Positioning

YYZU diposisikan sebagai:
> **Collaborative technology ecosystem and talent bridge for future-ready digital talent.**

Secara sederhana, YYZU membantu talenta teknologi berkembang dari:
> **learning -> collaboration -> real project experience -> industry readiness.**

YYZU bukan sekadar komunitas belajar atau talent pool biasa. Kami menggabungkan lingkungan belajar aktif, ekosistem berbasis proyek, pengembangan bakat, ruang kerja kolaboratif, dan jembatan menuju dunia industri.

---

## Visi & Misi

### Visi
Membangun ekosistem teknologi kolaboratif yang membantu talenta berkembang menjadi individu yang adaptif, produktif, kolaboratif, dan siap menghadapi kebutuhan industri digital modern.

### Misi
Menciptakan environment belajar teknologi yang aktif, kolaboratif, dan berkelanjutan; membantu talenta berkembang melalui project nyata dan pengalaman berbasis tim; menjembatani kampus, talenta, mentor, komunitas, dan industri; mendorong terbentuknya skill teknis, problem solving, communication, dan ownership; serta membangun portfolio, pengalaman kolaboratif, dan kesiapan kerja.

---

## Nilai Inti (Core Values)

- **Build Together**: Berkembang melalui kolaborasi aktif, peer learning, dan kemampuan memecahkan masalah sebagai satu tim perangkat lunak.
- **Continuous Growth**: Mendorong peningkatan standar kompetensi secara bertahap melalui siklus feedback, review berkala, dan refleksi pembelajaran.
- **Real Experience**: Belajar langsung dari praktik, simulasi workflow industri, open contribution, dan pengerjaan project brief.
- **Industry-Oriented**: Mengarahkan skill teknis, metode komunikasi, dokumentasi, dan kualitas delivery agar relevan dengan kebutuhan industri digital.
- **Ownership**: Menumbuhkan tanggung jawab penuh terhadap proses belajar pribadi, tugas yang diambil, serta kualitas kontribusi yang dikirimkan.
- **Stronger Together**: Memprioritaskan kesuksesan bersama melalui kultur feedback yang sehat, peer review, dan dukungan tim yang mutual.
- **Sustainable Impact**: Setiap aktivitas, project, dan kontribusi diarahkan agar memiliki manfaat jangka panjang bagi member dan ekosistem.

---

## Fokus Utama

- **Collaborative Learning**: Mengaktifkan proses belajar mandiri melalui study group terarah, peer discussion, mentoring, dan culture saling berbagi pengetahuan secara kolektif.
- **Project-Based Growth**: Mengakselerasi pemahaman melalui pengerjaan mini project, open contribution, internal product development, dan simulasi project berbasis tim.
- **Industry-Oriented Development**: Membiasakan workflow standar industri seperti task breakdown, review, documentation, quality control, dan pembentukan engineering mindset.

---

## Aktivitas & Program

Aktivitas yang dijalankan di dalam YYZU meliputi:

- **Study Groups**: Sesi belajar terarah untuk memperkuat fundamental teknologi, mempelajari dokumentasi alat, dan mendiskusikan konsep secara mendalam bersama rekan sejawat.
- **Mentoring & Technical Review**: Sesi bimbingan interaktif bersama praktisi mengenai software development, UI/UX design, product management, architectural decisions, dan debugging.
- **Mini Projects**: Pengerjaan proyek berskala kecil untuk melatih koordinasi tim, breakdown tugas, implementasi fitur dasar, dan proses demonstrasi produk.
- **Workflow Simulation**: Simulasi langsung workflow kerja industri seperti sprint planning, code/design review, version control management, QA, dan pembuatan release notes.
- **Real Case Collaboration**: Penyelesaian problem statement dan project brief nyata dari partner ekosistem, memberikan pengalaman kolaborasi yang edukatif dan menantang.
- **Career & Portfolio Prep**: Persiapan karier melalui portfolio review, simulasi komunikasi profesional, pencatatan learning logs, dan penyelarasan standar industry readiness.

---

## Model Pengembangan

YYZU menggunakan pendekatan:

```txt
Learn -> Build -> Collaborate -> Grow
```

Member tidak hanya belajar teknologi, tetapi juga dilatih untuk bekerja dalam tim, menghadapi masalah nyata, membangun solusi, memahami workflow engineering, dan berkembang sebagai individu profesional.

---

## Struktur Aplikasi & Halaman

### Website Publik
- **Home** (`/`) — Halaman utama perkenalan YYZU Ecosystem (dilengkapi visualisasi 4 pilar belajar, 11 bidang keahlian, dan 3 kategori proyek).
- **About YYZU** (`/about/`) — Penjelasan visi, misi, pilar, dan detail tentang ekosistem.
- **Culture & Mindset** (`/culture/`) — Filosofi kerja, core values, dan 8 prinsip belajar YYZU.
- **Activities** (`/activities/`) — Sesi belajar, 3 kategori proyek, dan ritme aktivitas.
- **Build Logs / Projects** (`/projects/`) — Log perkembangan proyek internal dan ekosistem.
- **Mentor & Partner** (`/mentor-partnership/`) — Informasi kolaborasi kampus, mentor, dan industri.
- **Wiki Docs** (`/docs/`) — Dokumentasi detail operasional dan panduan ekosistem menggunakan engine **Fumadocs**.
- **Join YYZU** (`/join/`) — Akses pendaftaran sebagai member, mentor, atau partner.
- **FAQ** (`/faq/`) — Pertanyaan umum seputar YYZU.

### Internal Dashboard (`/dashboard`)
- **Login / Register** (`/dashboard/login`, `/dashboard/register`) — Autentikasi berbasis session menggunakan Argon2 & Jose JWT.
- **Divisions Management** (`/dashboard/divisions`) — Manajemen dan detail divisi internal ekosistem.
- **Programs Administration** (`/dashboard/programs`) — Pembuatan dan pelacakan program berjalan.
- **Partnerships Tracking** (`/dashboard/partnerships`) — Pengelolaan kemitraan dengan industri dan kampus.
- **Members Directory** (`/dashboard/members`) — Direktori profil anggota ekosistem.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database ORM**: Prisma
- **Database**: PostgreSQL
- **Documentation Engine**: Fumadocs (dengan 44+ halaman dokumentasi wiki dinamis)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Argon2 & Jose (JWT)

---

## Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Konfigurasi Environment
Salin berkas `.env.example` ke `.env` dan sesuaikan nilainya (terutama URL database PostgreSQL dan secret JWT):

```bash
cp .env.example .env
```

### 3. Sinkronisasi Database (Prisma)
Jalankan migrasi database:

```bash
npx prisma migrate dev
```

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

### 5. Linting

```bash
npm run lint
```

---

## Production & Deployment

Untuk membuat production build:

```bash
npm run build
```

Aplikasi Next.js ini dirancang untuk di-deploy ke server Node.js dinamis atau platform cloud modern seperti **Vercel** atau **Railway** yang mendukung Next.js App Router dan database PostgreSQL.
