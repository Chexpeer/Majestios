import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "MajestiOS — Intelligence commerciale", template: "%s | MajestiOS" },
  description: "Plateforme professionnelle d'intelligence commerciale proactive assistée par IA.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
