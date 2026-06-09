import type { Metadata } from "next";
import { RootProvider } from "fumadocs-ui/provider/next";
import LayoutWrapper from "./LayoutWrapper";
import "../styles/global.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://yyzu.tech"),
  title: {
    default: "YYZU | Collaborative Technology Ecosystem & Talent Bridge",
    template: "%s | YYZU",
  },
  description:
    "YYZU adalah collaborative technology ecosystem dan talent bridge yang menghubungkan kampus, talenta teknologi, mentor praktisi, dan industri melalui collaborative learning, mentoring, workflow simulation, dan pengerjaan project brief terarah.",
  icons: {
    icon: "/icon.svg",
  },
  keywords: [
    "YYZU",
    "collaborative technology ecosystem",
    "talent bridge",
    "belajar coding",
    "portofolio IT",
    "mentoring IT",
    "workflow simulasi",
    "mahasiswa IT",
    "belajar pemrograman",
    "real project IT",
    "learning coding together",
    "pemrograman kolaboratif",
    "mentoring coding",
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
      "YYZU adalah collaborative technology ecosystem dan talent bridge yang menghubungkan kampus, talenta teknologi, mentor praktisi, dan industri melalui collaborative learning, mentoring, workflow simulation, dan pengerjaan project brief terarah.",
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
      "YYZU adalah collaborative technology ecosystem dan talent bridge yang menghubungkan kampus, talenta teknologi, mentor praktisi, dan industri melalui collaborative learning, mentoring, workflow simulation, dan pengerjaan project brief terarah.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <RootProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </RootProvider>
      </body>
    </html>
  );
}
