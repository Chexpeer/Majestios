import Link from "next/link";
import AnnouncementTicker from "@/components/announcement-ticker";
import HomeSideNav from "@/components/home-side-nav";
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
    <main className="home-redesign home-with-sidebar">
      <HomeSideNav />
      <div className="home-main-column">
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
              plateforme associe l&apos;intelligence numérique et l&apos;expertise de
              business developers pour qualifier les besoins, identifier les bons
              interlocuteurs et faciliter les connexions commerciales.
            </p>

            <form
              className="tender-search central-opportunity-search"
              action="/opportunites/marches-publics"
              method="get"
              aria-label="Rechercher un appel d'offres public"
            >
              <label className="search-field search-keyword">
                <span>Mots-clés</span>
                <input
                  type="search"
                  name="q"
                  maxLength={160}
                  placeholder="Ex. : bâtiment, nettoyage, informatique"
                />
              </label>
              <label className="search-field search-domain">
                <span>Département</span>
                <input
                  type="text"
                  name="location"
                  maxLength={3}
                  placeholder="Ex. : 68, 2A, 971"
                  aria-label="Code du département"
                />
              </label>
              <input type="hidden" name="type" value="all" />
              <button className="search-submit" type="submit">
                Rechercher <span aria-hidden="true">↗</span>
              </button>
            </form>

            <div className="hero-actions">
              <Link className="button-primary" href="/opportunites">
                Explorer toutes les opportunités <span aria-hidden="true">↗</span>
              </Link>
              <Link className="button-secondary" href="/comprendre/concept">
                Comprendre la démarche
              </Link>
            </div>
            <div className="hero-trust">
              <span className="trust-mark" aria-hidden="true">✓</span>
              <span>
                <strong>La source avant l&apos;affirmation.</strong>
                <small>
                  Les annonces et fonctions indisponibles ne sont pas présentées
                  comme opérationnelles.
                </small>
              </span>
            </div>
          </div>
        </section>

        <section className="home-map-section" aria-label="Explorer les rubriques MajestiOS">
          <div className="section-heading">
            <span className="eyebrow">LE CARREFOUR MAJESTIOS</span>
            <h2>
              Un écosystème. <em>Des opportunités connectées.</em>
            </h2>
            <p>
              Sélectionnez un pôle pour accéder à sa rubrique dédiée et poursuivre
              votre parcours.
            </p>
          </div>
          <MajestiOSOpportunityMap />
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

        <footer className="redesign-footer">
          <Link href="/" className="footer-brand">MajestiOS</Link>
          <span>Intelligence commerciale proactive · Réseautage intelligent</span>
          <nav aria-label="Liens de pied de page">
            <Link href="/comprendre/faq">FAQ</Link>
            <Link href="/confidentialite">Confidentialité</Link>
            <Link href="/mentions-legales">Mentions légales</Link>
          </nav>
        </footer>
      </div>
    </main>
  );
}
