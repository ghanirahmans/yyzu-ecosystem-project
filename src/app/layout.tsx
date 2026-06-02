import type { Metadata } from "next";
import Footer from "../components/Footer";
import SiteHeader from "../components/SiteHeader";
import "../styles/global.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://yyzucommunity.netlify.app"),
  title: {
    default: "YYZU | Collaborative Technology Ecosystem & Talent Bridge",
    template: "%s | YYZU",
  },
  description:
    "YYZU adalah collaborative technology ecosystem dan talent bridge yang menghubungkan kampus, talenta teknologi, komunitas, mentor, dan industri melalui collaborative learning, mentoring, workflow simulation, dan real project.",
  icons: {
    icon: "/icon.svg",
  },
  keywords: [
    "YYZU",
    "YYZU Community",
    "collaborative technology ecosystem",
    "talent bridge",
    "belajar coding",
    "portofolio IT",
    "mentoring IT",
    "workflow simulasi",
    "mahasiswa IT",
    "belajar pemrograman",
    "real project IT",
    "tech community Indonesia",
    "learning coding together",
    "pemrograman kolaboratif",
    "mentoring coding",
    "kerja praktek IT",
    "future builders"
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
    canonical: "./",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "YYZU",
    title: "YYZU | Collaborative Technology Ecosystem & Talent Bridge",
    description:
      "YYZU adalah collaborative technology ecosystem dan talent bridge yang menghubungkan kampus, talenta teknologi, komunitas, mentor, dan industri melalui collaborative learning, mentoring, workflow simulation, dan real project.",
    url: "./",
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
    title: "YYZU | Collaborative Technology Ecosystem & Talent Bridge",
    description:
      "YYZU adalah collaborative technology ecosystem dan talent bridge yang menghubungkan kampus, talenta teknologi, komunitas, mentor, dan industri melalui collaborative learning, mentoring, workflow simulation, dan real project.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <div className="min-h-screen bg-[#f7f9fb] text-slate-900">
          <SiteHeader />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
