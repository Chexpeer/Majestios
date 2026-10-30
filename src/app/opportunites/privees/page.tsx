import SiteHub from "@/components/site-hub";

export const metadata = {
  title: "Opportunités privées — MajestiOS",
  description: "Explorer les marchés privés, les besoins des entreprises et les signaux commerciaux à qualifier."
};

export default function PrivateOpportunitiesPage() {
  return <SiteHub
    pathname="/opportunites/privees"
    eyebrow="OPPORTUNITÉS · PRIVÉ"
    intro="Cette entrée rassemble les possibilités commerciales issues du secteur privé : consultations, besoins exprimés par des entreprises et pistes de sous-traitance. Un signal commercial n’est pas un besoin confirmé ; chaque piste doit être qualifiée avant d’être proposée."
    checklist={[
      "Distinguer une consultation publiée d’un signal ou d’une hypothèse commerciale.",
      "Vérifier l’émetteur, l’actualité et les conditions de diffusion.",
      "Respecter la confidentialité et ne pas présenter une annonce de démonstration comme une offre réelle."
    ]}
  />;
}
