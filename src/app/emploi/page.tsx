import SiteHub from "@/components/site-hub";
import { findSiteNode } from "@/data/site-tree";

export const metadata = {
  title: "Emploi et recrutement — MajestiOS",
  description: "Un espace autonome pour explorer les offres d’emploi, les missions, les compétences et les parcours de recrutement."
};

export default function EmploymentPage() {
  const found = findSiteNode("/emploi");
  return <SiteHub
    pathname="/emploi"
    intro={found?.node.description ?? "Explorer les offres d’emploi, les missions et les parcours de recrutement."}
    eyebrow="MAJESTIOS · EMPLOI ET RECRUTEMENT"
    checklist={[
      "Distinguer une offre d’emploi d’une mission professionnelle.",
      "Vérifier la source, la date et les conditions avant toute démarche.",
      "Les fonctions de dépôt de CV et de publication restent signalées comme en préparation tant que leur parcours sécurisé n’est pas activé."
    ]}
  />;
}
