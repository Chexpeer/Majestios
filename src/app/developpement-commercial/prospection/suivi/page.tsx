import SiteHub from "@/components/site-hub";

export const metadata = { title: "Suivi de prospection — MajestiOS", description: "Le suivi organise les contacts, les réponses, les prochaines actions et les enseignements réutilisables dans le temps." };

export default function Page() {
  return <SiteHub pathname="/developpement-commercial/prospection/suivi" intro="Le suivi organise les contacts, les réponses, les prochaines actions et les enseignements réutilisables dans le temps." checklist={["Tracer les échanges et les prochaines étapes utiles.","Distinguer un refus ponctuel d’une absence de besoin durable.","Respecter les préférences de contact et les règles applicables."]} />;
}
