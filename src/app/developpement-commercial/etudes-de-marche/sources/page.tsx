import SiteHub from "@/components/site-hub";

export const metadata = { title: "Sources d’étude de marché — MajestiOS", description: "Cette rubrique aide à organiser les sources utiles à une étude et à vérifier leur origine, leur date et leur champ de couverture." };

export default function Page() {
  return <SiteHub pathname="/developpement-commercial/etudes-de-marche/sources" intro="Cette rubrique aide à organiser les sources utiles à une étude et à vérifier leur origine, leur date et leur champ de couverture." checklist={["Privilégier les sources officielles ou clairement identifiées.","Vérifier la date, le périmètre et la méthode de collecte.","Signaler les données manquantes et les limites d’interprétation."]} />;
}
