import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = { title: "Nous rejoindre — MajestiOS", description: "Les premières collaborations envisagées pour le développement de MajestiOS." };

export default function JoinPage() {
  return <main className="public-site concept-page">
    <PublicHeader />
    <section className="how-section concept-hero"><div><span className="section-label">NOUS REJOINDRE</span><h1>Contribuez au développement de <em>MajestiOS.</em></h1><p>Deux besoins prioritaires sont identifiés pour accompagner le suivi des appels d’offres et le développement commercial de la plateforme.</p></div></section>
    <section className="concept-grid">
      <article><span>MISSION 01</span><h2>Assistante indépendante — suivi des appels d’offres</h2><p>Contribuer à la veille, au suivi des échéances, à l’organisation des dossiers et à la préparation des informations nécessaires au suivi des opportunités.</p><p><strong>Profil recherché :</strong> organisation, rigueur, autonomie et aisance avec les outils numériques.</p><span className="join-card-status">Modalités à préciser avant publication</span></article>
      <article><span>MISSION 02</span><h2>Business Developer — rejoindre l’équipe</h2><p>Participer au développement commercial de MajestiOS, identifier des opportunités de partenariat et contribuer à l’acquisition de clients.</p><p><strong>Profil recherché :</strong> sens commercial, autonomie, aisance relationnelle et esprit d’initiative.</p><span className="join-card-status">Modalités à préciser avant publication</span></article>
    </section>
    <section className="concept-principles"><h2>Manifester votre intérêt</h2><p>Le parcours de candidature n’est pas encore connecté à un système sécurisé. Les conditions de collaboration, le statut et la rémunération devront être définis avant l’ouverture des candidatures. Aucun formulaire fictif ne prétend enregistrer une candidature à ce stade.</p><Link className="search-submit concept-cta" href="/comprendre/faq">Questions sur les collaborations ↗</Link><Link className="search-submit concept-cta" href="/">Retour à MajestiOS</Link></section>
    <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><nav aria-label="Liens de pied de page"><Link href="/comprendre/concept">Comment et pourquoi MajestiOS ?</Link><Link href="/opportunites/marches-prives">Appels d’offres privés</Link><Link href="/mentions-legales">Mentions légales</Link></nav><small>© MajestiOS · Site en construction</small></footer>
  </main>;
}
