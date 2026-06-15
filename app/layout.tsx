import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Contactio — Kontaktverwaltung",
  description: "Moderne Kontaktverwaltung im Fintech-Design.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
