import TenderCategoryGuide from "@/components/tender-category-guide";

export default function PublicSuppliesPage() {
  return <TenderCategoryGuide
    eyebrow="MAJESTIOS · APPELS D’OFFRES PUBLICS · FOURNITURES"
    title="Fournitures"
    emphasis="vérifier la conformité et la livraison."
    intro="Analysez les caractéristiques techniques, quantités, exigences de conformité et conditions logistiques avant de décider de répondre."
    searchHref="/opportunites/marches-publics/appels-offres?type=Fournitures"
    searchLabel="Rechercher les appels d’offres de fournitures"
    checks={[
      { title: "Spécifications techniques", text: "Comparer les caractéristiques demandées avec les produits réellement disponibles." },
      { title: "Quantités et prix", text: "Examiner volumes, durée, éventuelles reconductions et structure de prix." },
      { title: "Logistique et conformité", text: "Vérifier lieux, délais, garanties, certificats et contraintes de livraison." }
    ]}
  />;
}
