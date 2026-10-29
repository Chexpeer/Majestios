import type { Metadata } from "next";
import "./globals.css";
import MajestiosAssistant from "../components/MajestiosAssistant";
import SiteShell from "@/components/site-shell";

export const metadata: Metadata = {
  title: "MajestiOS — Développement commercial assisté par IA",
  description: "Repérer les opportunités, identifier les bons interlocuteurs et préparer les actions de développement commercial avec l’aide de l’IA et la décision humaine.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body><SiteShell>{children}</SiteShell><MajestiosAssistant /></body></html>;
}
