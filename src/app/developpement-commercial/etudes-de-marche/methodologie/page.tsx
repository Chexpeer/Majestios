import SiteHub from "@/components/site-hub";

export const metadata = { title: "Méthodologie d’étude de marché — MajestiOS", description: "Une page consacrée à la construction d’une étude de marché reproductible, depuis la question de départ jusqu’à la formulation des conclusions." };

export default function Page() {
  return <SiteHub pathname="/developpement-commercial/etudes-de-marche/methodologie" intro="Une page consacrée à la construction d’une étude de marché reproductible, depuis la question de départ jusqu’à la formulation des conclusions." checklist={["Définir le périmètre, les hypothèses et les indicateurs.","Distinguer les données observées des interprétations.","Documenter les limites et les biais éventuels."]} />;
}
