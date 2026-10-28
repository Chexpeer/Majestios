import SiteHub from "@/components/site-hub";

export const metadata = { title: "Offres d’emploi — MajestiOS", description: "Cette rubrique accueillera des offres dont la source, la date et les principales conditions auront été vérifiées." };

export default function Page() {
  return <SiteHub pathname="/opportunites/emploi/offres" intro="Cette rubrique accueillera des offres dont la source, la date et les principales conditions auront été vérifiées." checklist={["Contrôler l’employeur, la source et la date de publication.","Lire les conditions du poste et le lieu de travail.","Aucun CV n’est collecté avant la mise en place d’un parcours de dépôt sécurisé."]} />;
}
