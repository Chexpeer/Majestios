import SiteHub from "@/components/site-hub";

export const metadata = { title: "Salons professionnels par secteur — MajestiOS", description: "Explorez les salons selon les secteurs professionnels pour préparer une veille ciblée et des rencontres utiles." };

export default function Page() {
  return <SiteHub pathname="/opportunites/salons/secteur" intro="Explorez les salons selon les secteurs professionnels pour préparer une veille ciblée et des rencontres utiles." checklist={["Choisir le secteur correspondant à l’activité recherchée.","Vérifier l’événement auprès de son organisateur officiel.","Relier chaque visite à des objectifs commerciaux concrets."]} />;
}
