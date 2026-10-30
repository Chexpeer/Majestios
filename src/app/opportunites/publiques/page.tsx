import SiteHub from "@/components/site-hub";

export const metadata = {
  title: "Marchés publics — MajestiOS",
  description: "Accéder aux marchés publics, aux appels d’offres et à la recherche par catégorie ou territoire."
};

export default function PublicOpportunitiesPage() {
  return <SiteHub
    pathname="/opportunites/publiques"
    eyebrow="OPPORTUNITÉS · PUBLIC"
    intro="Cette entrée est réservée aux opportunités provenant de la commande publique. Explorez les marchés publics, puis les appels d’offres et leurs catégories. Les avis affichés doivent toujours être contrôlés auprès de leur source."
    checklist={[
      "Distinguer les avis officiels des informations de démonstration.",
      "Vérifier la source, la date, l’échéance et les documents de consultation.",
      "Évaluer les capacités de l’entreprise avant de décider de se positionner."
    ]}
  />;
}
