import SiteHub from "@/components/site-hub";

export default function Page() {
  return <SiteHub pathname="/opportunites/marches-publics/departement" eyebrow="MAJESTIOS · MARCHÉS PUBLICS PAR DÉPARTEMENT" intro="Marchés publics par département. Cette rubrique possède sa propre adresse et s’inscrit dans l’arborescence de MajestiOS." checklist={["Choisir un territoire à partir d’un code département normalisé.","Vérifier le lieu d’exécution sur l’avis original.","Le filtre ne doit afficher que des données géographiques vérifiées."]} />;
}
