import type { Metadata } from "next";
import { RootProvider } from "fumadocs-ui/provider/next";
import { Geist, Geist_Mono } from "next/font/google";
import LayoutWrapper from "./LayoutWrapper";
import "../styles/global.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yyzu.tech"),
  title: {
    default: "YYZU Ecosystem — Bridging Campus, Talent, and Industry",
    template: "%s | YYZU",
  },
  description:
    "Mencari tahu apa itu YYZU? YYZU (yang sering dilafalkan sebagai Yeyzu) adalah collaborative technology ecosystem dan talent bridge yang menghubungkan kampus, talenta teknologi, mentor praktisi, dan industri melalui kolaborasi aktif, mentoring, simulasi alur kerja, dan project-based growth.",
  applicationName: "YYZU Ecosystem",
  authors: [{ name: "Ghaniyyir Rahman Sudarsono", url: "https://github.com/ghanirahmans" }],
  creator: "Ghaniyyir Rahman Sudarsono",
  publisher: "YYZU Ecosystem",
  category: "Education & Technology",
  icons: {
    icon: "/icon.svg",
  },
  keywords: [
    // Brand & phonetic variation keywords
    "YYZU",
    "YYZU Ecosystem",
    "YYZU Community",
    "Yeyzu",
    "Yeyzu Ecosystem",
    "yyzu.tech",
    "yeyzu.tech",
    "apa itu YYZU",
    "apa itu Yeyzu",
    "apa itu YYZU Ecosystem",
    "apa itu Yeyzu Ecosystem",
    "pengertian YYZU",
    "pengertian Yeyzu",
    "komunitas YYZU",
    "komunitas Yeyzu",
    "YYZU Tech",
    "Yeyzu Tech",
    // Core keywords
    "collaborative technology ecosystem",
    "talent bridge indonesia",
    "jembatan talenta digital",
    "komunitas belajar IT",
    "ekosistem teknologi kolaboratif",
    "future builders",
    // Student/Learner keywords
    "belajar software engineering kolaboratif",
    "belajar UI/UX design kelompok",
    "portfolio project IT nyata",
    "simulasi workflow industri digital",
    "belajar product management pemula",
    "belajar coding bersama",
    "real project IT",
    "portofolio developer",
    // Mentor keywords
    "mentor IT volunteer",
    "berbagi pengalaman industri teknologi",
    "bimbingan portfolio IT",
    "komunitas praktisi software engineer",
    "reviewer coding",
    "mentoring coding",
    // Partnership keywords
    "mbkm partner teknologi",
    "penyaluran talenta digital siap kerja",
    "studi kasus industri proyek mahasiswa",
    "sponsorship program edukasi IT",
    // Regional keywords
    "komunitas IT Medan",
    "ekosistem digital Medan",
    "talent bridge Medan",
    "komunitas developer Medan"
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://yyzu.tech",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "YYZU Ecosystem",
    title: "YYZU Ecosystem — Bridging Campus, Talent, and Industry",
    description:
      "Kembangkan skill teknologi Anda melalui kolaborasi proyek nyata, mentoring langsung dari praktisi industri, dan simulasi alur kerja tim modern.",
    url: "https://yyzu.tech",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "YYZU collaborative technology ecosystem and talent bridge",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YYZU Ecosystem — Bridging Campus, Talent, and Industry",
    description:
      "Ekosistem teknologi kolaboratif dan jembatan talenta digital untuk mempersiapkan karir industri masa depan.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const saved = localStorage.getItem('theme');
                  if (saved === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch (_) {}
              })();
            `,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <RootProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </RootProvider>
      </body>
    </html>
  );
}
