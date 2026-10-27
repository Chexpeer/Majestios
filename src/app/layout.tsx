import type { Metadata } from "next";
import "./globals.css";
import MajestiosAssistant from "../components/MajestiosAssistant";

export const metadata: Metadata = {
  title: "MajestiOS — Développement commercial assisté par l’intelligence",
  description: "Détecter les opportunités. Créer les opportunités. Développement commercial assisté par l’intelligence et la décision humaine.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}<MajestiosAssistant /></body></html>;
}
