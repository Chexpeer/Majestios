import SiteHub from "@/components/site-hub";

export const metadata = { title: "Missions professionnelles — MajestiOS", description: "Une rubrique pour les missions ponctuelles et prestations indépendantes, avec des informations clairement attribuées à leur émetteur." };

export default function Page() {
  return <SiteHub pathname="/opportunites/emploi/missions" intro="Une rubrique pour les missions ponctuelles et prestations indépendantes, avec des informations clairement attribuées à leur émetteur." checklist={["Préciser le périmètre et les livrables de la mission.","Vérifier les échéances et les modalités contractuelles.","Confirmer les informations auprès de l’émetteur de l’annonce."]} />;
}
