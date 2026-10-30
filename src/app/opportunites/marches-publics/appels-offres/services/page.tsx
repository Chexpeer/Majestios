import TenderCategoryGuide from "@/components/tender-category-guide";

export default function PublicServicesPage() {
  return <TenderCategoryGuide
    eyebrow="MAJESTIOS · APPELS D’OFFRES PUBLICS · SERVICES"
    title="Services"
    emphasis="comprendre la prestation attendue."
    intro="Les marchés de services exigent une lecture précise des prestations, des niveaux de service, des livrables et des critères d’attribution."
    searchHref="/opportunites/marches-publics/appels-offres?type=Services"
    searchLabel="Rechercher les appels d’offres de services"
    checks={[
      { title: "Périmètre et livrables", text: "Identifier les prestations, volumes, résultats attendus et exclusions." },
      { title: "Critères de sélection", text: "Repérer les critères d’attribution, leur pondération et les preuves demandées." },
      { title: "Organisation opérationnelle", text: "Vérifier les délais, ressources nécessaires, continuité de service et modalités de suivi." }
    ]}
  />;
}
