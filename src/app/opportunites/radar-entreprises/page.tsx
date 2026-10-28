import Link from "next/link";
import SiteHeader from "@/components/navigation/site-header";
import SiteFooter from "@/components/navigation/site-footer";

export const metadata = {
  title: "Radar des nouvelles entreprises — MajestiOS",
  description: "La vision MajestiOS pour détecter et qualifier des entreprises récemment créées ou concernées par un événement économique.",
};

export default function CompanyRadarPage() {
  return <main className="public-site concept-page">
    <SiteHeader />
    <section className="how-section concept-hero"><div><span className="section-label">RADAR DES ENTREPRISES</span><h1>Repérer les signaux avant <em>la prise de contact.</em></h1><p>Une création d'entreprise, l'ouverture d'un établissement ou un événement publié peut aider un professionnel à identifier un besoin potentiel. MajestiOS vise à organiser ces signaux pour faciliter une prospection pertinente et vérifiable.</p></div></section>
    <section className="concept-grid">
      <article><span>01 · CIBLER</span><h2>Définir une zone et une activité</h2><p>À terme, choisir un département, une ville ou une zone, puis préciser les secteurs et les types d'entreprises recherchés.</p></article>
      <article><span>02 · DÉTECTER</span><h2>Repérer un événement</h2><p>Selon la couverture des sources, rechercher certaines créations, ouvertures, reprises ou annonces publiées dans une période donnée.</p></article>
      <article><span>03 · VÉRIFIER</span><h2>Contrôler la source</h2><p>Consulter les données officielles disponibles, vérifier leur date, leur provenance et leur actualité. Les adresses peuvent être absentes ou nécessiter une vérification.</p></article>
      <article><span>04 · QUALIFIER</span><h2>Préparer une action adaptée</h2><p>Évaluer si l'entreprise correspond au profil recherché, puis organiser une démarche conforme aux règles de prospection applicables.</p></article>
    </section>
    <section className="concept-principles"><h2>Sources envisagées</h2><p>Le BODACC peut contribuer à détecter certaines annonces de la vie des entreprises. Les données SIRENE peuvent compléter les informations sur les entreprises et établissements, selon les données accessibles et diffusibles. Les connecteurs et le parcours de recherche dédiés restent à développer et à tester.</p><p>Le radar n'est pas encore un moteur opérationnel. Cette page décrit la fonction cible ; elle ne présente aucun résultat fictif comme une entreprise réelle.</p><div className="faq-actions"><Link className="search-submit concept-cta" href="/opportunites">Retour aux opportunités</Link><Link className="faq-secondary" href="/aide/faq">Lire la FAQ</Link></div></section>
    <SiteFooter />
  </main>;
}
