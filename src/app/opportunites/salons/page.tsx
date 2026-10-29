import SiteHub from "@/components/site-hub";

export const metadata = {
  title: "Salons professionnels — MajestiOS",
  description: "Découvrir les prochains salons depuis le flux d’annonces, puis accéder à une fiche dédiée ou au parcours d’inscription prévu."
};

export default function Page() {
  return <SiteHub
    pathname="/opportunites/salons"
    intro="Les prochains salons professionnels apparaissent dans le flux d’annonces de l’accueil. Chaque annonce vérifiée peut ouvrir une fiche dédiée dans cette rubrique ou, lorsque le parcours est disponible, un formulaire d’inscription adapté."
    checklist={[
      "Les dates, le lieu et l’organisateur sont vérifiés avant publication.",
      "Le clic sur une annonce conduit vers une fiche dédiée ou un parcours d’inscription clairement identifié.",
      "La fiche relie l’information sur le salon à la préparation de la visite et aux opportunités commerciales à explorer."
    ]}
  />;
}
