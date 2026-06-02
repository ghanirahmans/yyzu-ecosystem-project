import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YYZU | Collaborative Technology Ecosystem & Talent Bridge",
  description: "YYZU is a collaborative technology ecosystem and talent bridge.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        {children}
      </body>
    </html>
  );
}
