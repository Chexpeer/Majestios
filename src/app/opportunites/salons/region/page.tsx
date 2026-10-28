import SiteHub from "@/components/site-hub";

export const metadata = { title: "Salons professionnels par région — MajestiOS", description: "Une entrée territoriale pour préparer les déplacements et identifier les événements professionnels pertinents." };

export default function Page() {
  return <SiteHub pathname="/opportunites/salons/region" intro="Une entrée territoriale pour préparer les déplacements et identifier les événements professionnels pertinents." checklist={["Filtrer par région à partir du lieu officiel de l’événement.","Confirmer les dates et l’adresse auprès de l’organisateur.","Ne pas afficher d’événements non vérifiés."]} />;
}
