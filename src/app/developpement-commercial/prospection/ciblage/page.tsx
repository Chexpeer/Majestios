import SiteHub from "@/components/site-hub";

export const metadata = { title: "Ciblage commercial — MajestiOS", description: "Le ciblage transforme une intention commerciale en critères de recherche explicites : activité, taille, territoire, signaux de besoin et adéquation avec l’offre." };

export default function Page() {
  return <SiteHub pathname="/developpement-commercial/prospection/ciblage" intro="Le ciblage transforme une intention commerciale en critères de recherche explicites : activité, taille, territoire, signaux de besoin et adéquation avec l’offre." checklist={["Définir le profil d’entreprise et la zone recherchée.","Distinguer les faits observés des hypothèses de besoin.","Documenter les sources et la date de vérification."]} />;
}
