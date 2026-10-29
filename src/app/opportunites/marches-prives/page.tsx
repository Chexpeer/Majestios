import SiteHub from "@/components/site-hub";

export const metadata = {
  title: "Opportunités privées — MajestiOS",
  description: "Explorer les consultations privées, cessions et reprises d’entreprises comme opportunités commerciales."
};

export default function Page() {
  return <SiteHub
    pathname="/opportunites/marches-prives"
    intro="Les opportunités privées constituent un axe stratégique de MajestiOS. Cette famille regroupera les consultations privées ainsi que les entreprises à vendre, à céder ou à reprendre : chaque annonce sera traitée comme une occasion privée à qualifier, sous réserve de vérifier sa source, son actualité et l’autorisation de diffusion."
    checklist={[
      "Regrouper les consultations privées et les annonces de cession, vente ou reprise d’entreprise dans une même famille d’opportunités.",
      "Vérifier l’identité du diffuseur, la source, l’actualité et le droit de publier l’annonce.",
      "Mettre en évidence les opportunités réellement urgentes dans le flux, sans afficher comme disponible une annonce non vérifiée."
    ]}
  />;
}
