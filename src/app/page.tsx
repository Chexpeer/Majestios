import Link from "next/link";
import AnnouncementTicker from "@/components/announcement-ticker";
import HomepageNavigation from "@/components/homepage-navigation";
import MajestiOSOpportunityMap from "@/components/majestic-opportunity-map";

export const metadata = {
  title: "MajestiOS — Intelligence commerciale proactive",
  description: "Détecter, qualifier et transformer les opportunités commerciales grâce à une navigation structurée et des sources vérifiables."
};

export default function HomePage() {
  return <main className="home-redesign home-layout">
    <HomepageNavigation />
    <div className="home-main">
      <AnnouncementTicker />
      <section className="home-intro">
        <div className="home-intro-copy">
          <span className="eyebrow"><i /> INTELLIGENCE COMMERCIALE PROACTIVE</span>
          <h1>Les opportunités ne se trouvent pas toutes au même endroit<span>.</span></h1>
          <p>MajestiOS organise la veille, la qualification et la prospection dans un parcours lisible. Choisissez un pôle, approfondissez votre recherche, puis préparez une action commerciale pertinente.</p>
          <div className="hero-actions">
            <Link className="button-primary" href="/opportunites">Explorer les opportunités <span>↗</span></Link>
            <Link className="button-secondary" href="/comment-et-pourquoi">Comprendre la démarche</Link>
          </div>
          <p className="home-trust-note"><strong>La source avant l’affirmation.</strong> Les annonces et services non vérifiés ne sont pas présentés comme disponibles.</p>
        </div>
      </section>
      <section className="home-map-section">
        <div className="section-heading">
          <span className="eyebrow">LE CARREFOUR MAJESTIOS</span>
          <h2>Un point d’entrée. <em>Plusieurs chemins.</em></h2>
          <p>Sélectionnez un pôle pour accéder à sa rubrique, puis progressez vers ses pages de détail.</p>
        </div>
        <MajestiOSOpportunityMap />
      </section>
      <section className="home-process-strip" aria-label="Le parcours MajestiOS">
        <span className="eyebrow">LE PARCOURS</span>
        <div>{["Détecter", "Qualifier", "Identifier", "Contacter", "Transformer", "Capitaliser"].map((step, index) => <span key={step}><b>{String(index + 1).padStart(2, "0")}</b>{step}{index < 5 ? <i aria-hidden="true">→</i> : null}</span>)}</div>
      </section>
      <footer className="redesign-footer">
        <Link href="/" className="footer-brand">MajestiOS</Link>
        <span>Intelligence commerciale proactive</span>
        <nav><Link href="/faq">FAQ</Link><Link href="/confidentialite">Confidentialité</Link><Link href="/mentions-legales">Mentions légales</Link></nav>
      </footer>
    </div>
  </main>;
}
