import type { Metadata } from "next";
import "./globals.css";
import MajestiosAssistant from "../components/MajestiosAssistant";
import HomepageNavigation from "@/components/homepage-navigation";
import GlobalSearchBar from "@/components/global-search-bar";

export const metadata: Metadata = {
  title: "MajestiOS — Développement commercial assisté par IA",
  description: "Repérer les opportunités, identifier les bons interlocuteurs et préparer les actions de développement commercial avec l’aide de l’IA et la décision humaine.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body><div className="majestic-global-shell"><HomepageNavigation /><div className="majestic-global-main"><GlobalSearchBar />{children}</div></div><MajestiosAssistant /></body></html>;
}
