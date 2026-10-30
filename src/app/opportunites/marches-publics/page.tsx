import SiteHub from "@/components/site-hub";

export const metadata = {
  title: "Marchés publics — MajestiOS",
  description: "Explorez les dossiers des marchés publics et accédez aux appels d’offres par catégorie."
};

export default function PublicMarketsPage() {
  return <SiteHub
    pathname="/opportunites/marches-publics"
    eyebrow="OPPORTUNITÉS · MARCHÉS PUBLICS"
    intro="Parcourez les dossiers des marchés publics. Ouvrez d’abord le dossier « Appels d’offres », puis choisissez une catégorie comme Travaux, Services ou Fournitures. Chaque niveau vous conduit dans un espace dédié."
    checklist={[
      "Commencer par le dossier qui correspond à votre recherche.",
      "Vérifier la source officielle, la date de publication et l’échéance de chaque avis.",
      "Ne décider de répondre qu’après avoir vérifié les exigences et les capacités de l’entreprise."
    ]}
  />;
}
