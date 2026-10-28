import Link from "next/link";
import PublicHeader from "@/components/public-header";
import AnnouncementTicker from "@/components/announcement-ticker";
import MajestiOSOpportunityMap from "@/components/majestic-opportunity-map";

export const metadata = {
  title: "MajestiOS — Intelligence commerciale proactive",
  description:
    "Détecter, qualifier et transformer les opportunités commerciales grâce à l'intelligence numérique et au réseautage intelligent.",
};

const mission = [
  "Détecter",
  "Qualifier",
  "Identifier",
  "Contacter",
  "Transformer",
  "Capitaliser",
];

export default function HomePage() {
  return (
    <main className="home-redesign">
      <PublicHeader />
      <AnnouncementTicker />

      <section className="home-hero-redesign">
        <div className="hero-copy">
          <span className="eyebrow">
            <i /> INTELLIGENCE COMMERCIALE PROACTIVE
          </span>
          <h1>
            Le réseautage intelligent au service de votre développement
            commercial<span>.</span>
          </h1>
          <p>
            MajestiOS ne se contente pas de signaler des opportunités. La
            plateforme associe l'intelligence numérique et l'expertise de
            business developers pour qualifier les besoins, identifier les bons
            interlocuteurs et faciliter les connexions commerciales.
          </p>
          <div className="hero-actions">
            <Link className="button-primary" href="/opportunites">
              Explorer les opportunités <span aria-hidden="true">↗</span>
            </Link>
            <Link className="button-secondary" href="/comprendre/concept">
              Comprendre la démarche
            </Link>
          </div>
          <div className="hero-trust">
            <span className="trust-mark" aria-hidden="true">✓</span>
            <span>
              <strong>La source avant l'affirmation.</strong>
              <small>
                Les annonces et fonctions indisponibles ne sont pas présentées
                comme opérationnelles.
              </small>
            </span>
          </div>
        </div>
      </section>

      <section className="mission-strip" aria-label="Les six étapes MajestiOS">
        <span className="eyebrow">LA MÉTHODE MAJESTIOS</span>
        <div>
          {mission.map((step, index) => (
            <span key={step}>
              <b>{String(index + 1).padStart(2, "0")}</b>
              {step}
              {index < mission.length - 1 ? <i aria-hidden="true">→</i> : null}
            </span>
          ))}
        </div>
      </section>

      <section className="home-map-section" aria-label="Explorer les rubriques MajestiOS">
        <div className="section-heading">
          <span className="eyebrow">EXPLORER PAR BESOIN</span>
          <h2>
            Un point d'entrée. <em>Des opportunités connectées.</em>
          </h2>
          <p>
            Choisissez un pôle pour accéder à sa rubrique dédiée et poursuivre
            votre parcours.
          </p>
        </div>
        <MajestiOSOpportunityMap />
      </section>

      <footer className="redesign-footer">
        <Link href="/" className="footer-brand">MajestiOS</Link>
        <span>Intelligence commerciale proactive · Réseautage intelligent</span>
        <nav aria-label="Liens de pied de page">
          <Link href="/comprendre/faq">FAQ</Link>
          <Link href="/confidentialite">Confidentialité</Link>
          <Link href="/mentions-legales">Mentions légales</Link>
        </nav>
      </footer>
    </main>
  );
}
