import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = { title: "Radar entreprises — MajestiOS", description: "Comprendre le futur radar de signaux d’entreprises pour le développement commercial." };

export default function CompanyRadarPage() {
  return <main className="public-site concept-page"><PublicHeader />
    <section className="how-section concept-hero"><div><span className="section-label">OPPORTUNITÉS ENTREPRISES · RADAR</span><h1>Détecter les signaux d’entreprise pour <em>agir au bon moment.</em></h1><p>Le radar entreprises a vocation à aider les professionnels à repérer des événements pouvant signaler un besoin, un changement de fournisseur, un projet de développement ou une occasion de partenariat.</p></div></section>
    <section className="employment-principles">
      <article><span>01 · DÉTECTER</span><h2>Repérer un signal</h2><p>Création, changement d’activité, évolution publiée, reprise ou cession peuvent constituer des indices à examiner. Un signal n’est pas une preuve de besoin commercial.</p></article>
      <article><span>02 · VÉRIFIER</span><h2>Revenir à la source</h2><p>Les sources publiques pertinentes, dont les données d’entreprise et publications officielles, devront être raccordées et contrôlées avant de présenter des résultats comme actuels.</p></article>
      <article><span>03 · QUALIFIER</span><h2>Préparer une action</h2><p>Le professionnel devra pouvoir comprendre le contexte, identifier les interlocuteurs légitimes et décider lui-même de la suite à donner.</p></article>
    </section>
    <section className="concept-principles"><h2>État actuel et limites</h2><p>Le radar n’est pas encore connecté à un flux opérationnel de données SIRENE ou BODACC. Cette page décrit la cible fonctionnelle ; elle ne présente aucune entreprise réelle ni aucune alerte en temps réel. Les règles d’usage, de fraîcheur, de traçabilité et de protection des données devront être validées avant l’activation.</p><Link className="search-submit concept-cta" href="/opportunites">Retour à toutes les opportunités ↗</Link><Link className="search-submit concept-cta" href="/faq">Comprendre les sources et les limites ↗</Link></section>
    <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><nav aria-label="Liens de pied de page"><Link href="/developpement-commercial">Développement commercial</Link><Link href="/business">Business</Link><Link href="/faq">FAQ</Link></nav><small>© MajestiOS · Site en construction</small></footer>
  </main>;
}
