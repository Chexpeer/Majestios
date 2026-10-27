import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MajestiOS — Intelligence commerciale",
  description: "Détectez les opportunités professionnelles, qualifiez vos marchés et structurez votre prospection avec MajestiOS.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
