import SiteHub from "@/components/site-hub";

export const metadata = { title: "Argumentaires commerciaux — MajestiOS", description: "Préparez des messages contextualisés à partir d’un besoin plausible et d’informations vérifiables, plutôt que d’utiliser un argumentaire uniforme." };

export default function Page() {
  return <SiteHub pathname="/developpement-commercial/prospection/argumentaires" intro="Préparez des messages contextualisés à partir d’un besoin plausible et d’informations vérifiables, plutôt que d’utiliser un argumentaire uniforme." checklist={["Relier le message à un signal ou besoin documenté.","Éviter les promesses non démontrées et les informations personnelles non nécessaires.","Capitaliser sur les réponses pour améliorer les prochains messages."]} />;
}
