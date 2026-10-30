import Link from "next/link";
import { faqSections } from "@/data/faq-sections";

export const metadata = {
  title: "Centre d’aide — MajestiOS",
  description: "Choisissez un dossier d’aide dédié pour comprendre MajestiOS, les appels d’offres, la qualification, la prospection et les données."
};

export default function FAQPage() {
  return <main className="public-site concept-page faq-page">
    <header className="how-section concept-hero faq-hero">
      <div>
        <span className="section-label">CENTRE D’AIDE MAJESTIOS</span>
        <h1>Comprendre. Décider. <em>Agir.</em></h1>
        <p>Le centre d’aide est organisé en dossiers thématiques. Choisissez votre sujet pour ouvrir un espace dédié et consulter les réponses correspondantes, sans parcourir une longue page unique.</p>
        <div className="route-actions faq-hero-actions">
          <Link className="search-submit concept-cta" href="/opportunites">Explorer les opportunités</Link>
          <Link className="search-submit concept-cta" href="/developpement-commercial">Développement commercial</Link>
        </div>
      </div>
    </header>
    <section className="concept-principles faq-index" aria-labelledby="faq-index-title">
      <div className="faq-section-heading">
        <span className="section-label">DOSSIERS D’AIDE</span>
        <h2 id="faq-index-title">Que souhaitez-vous comprendre ?</h2>
        <p>Chaque thème possède sa propre adresse et son propre espace de consultation.</p>
      </div>
      <nav className="faq-topic-grid" aria-label="Dossiers du centre d’aide">
        {faqSections.map((section) => (
          <Link className="faq-topic-card" key={section.id} href={`/faq/${section.id}`}>
            <span className="faq-topic-number">{section.number}</span>
            <span className="faq-topic-copy"><strong>{section.title}</strong><small>{section.intro}</small></span>
            <span className="faq-topic-arrow" aria-hidden="true">↗</span>
          </Link>
        ))}
      </nav>
    </section>
    <section className="concept-principles faq-last-call">
      <span className="section-label">POUR ALLER PLUS LOIN</span>
      <h2>Partir de votre besoin concret.</h2>
      <p>Pour chercher une consultation, commencez par les marchés publics. Pour structurer une démarche de prospection, explorez le développement commercial.</p>
      <div className="route-actions">
        <Link className="search-submit concept-cta" href="/opportunites/marches-publics">Marchés publics</Link>
        <Link className="search-submit concept-cta" href="/developpement-commercial">Développement commercial</Link>
        <Link className="search-submit concept-cta" href="/nous-rejoindre">Nous rejoindre</Link>
      </div>
    </section>
  </main>;
}
