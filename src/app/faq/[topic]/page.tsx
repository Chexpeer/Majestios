import Link from "next/link";
import { notFound } from "next/navigation";
import { faqSections, faqSectionById } from "@/data/faq-sections";

export function generateStaticParams() {
  return faqSections.map((section) => ({ topic: section.id }));
}

export async function generateMetadata({ params }: { params: { topic: string } }) {
  const section = faqSectionById[params.topic];
  return {
    title: section ? `${section.title} — Centre d’aide MajestiOS` : "Dossier d’aide — MajestiOS",
    description: section?.intro ?? "Consulter les réponses du centre d’aide MajestiOS."
  };
}

export default function FAQTopicPage({ params }: { params: { topic: string } }) {
  const section = faqSectionById[params.topic];
  if (!section) notFound();

  return <main className="public-site concept-page faq-page">
    <nav className="breadcrumbs" aria-label="Fil d’Ariane">
      <Link href="/">Accueil</Link><span><b>/</b><Link href="/faq">Centre d’aide</Link></span><span><b>/</b><strong>{section.title}</strong></span>
    </nav>
    <header className="how-section concept-hero faq-hero">
      <div>
        <span className="section-label">DOSSIER D’AIDE · THÈME {section.number}</span>
        <h1>{section.title}<em>.</em></h1>
        <p>{section.intro}</p>
        <p><Link href="/faq">← Retour à tous les dossiers d’aide</Link></p>
      </div>
    </header>
    <section className="concept-principles faq-section" aria-labelledby="faq-answers-title">
      <div className="faq-section-heading">
        <span className="section-label">{section.items.length} QUESTIONS ET RÉPONSES</span>
        <h2 id="faq-answers-title">Les réponses sur ce sujet</h2>
        <p>Ouvrez une question pour lire sa réponse.</p>
      </div>
      <div className="faq-questions">
        {section.items.map((item, index) => <details className="faq-item" key={item.q}>
          <summary><span className="faq-question-number">{String(index + 1).padStart(2, "0")}</span><span>{item.q}</span><span className="faq-toggle" aria-hidden="true">+</span></summary>
          <div className="faq-answer"><p>{item.a}</p></div>
        </details>)}
      </div>
    </section>
    <section className="concept-principles faq-index">
      <div className="faq-section-heading"><span className="section-label">DOSSIERS VOISINS</span><h2>Approfondir un autre sujet</h2></div>
      <nav className="faq-topic-grid" aria-label="Autres dossiers d’aide">
        {faqSections.filter((item) => item.id !== section.id).map((item) => <Link className="faq-topic-card" key={item.id} href={`/faq/${item.id}`}>
          <span className="faq-topic-number">{item.number}</span><span className="faq-topic-copy"><strong>{item.title}</strong><small>{item.intro}</small></span><span className="faq-topic-arrow" aria-hidden="true">↗</span>
        </Link>)}
      </nav>
    </section>
    <footer className="page-footer"><span>MAJESTIOS · DÉTECTER → QUALIFIER → IDENTIFIER → CONTACTER → TRANSFORMER → CAPITALISER</span><Link href="/faq">Centre d’aide</Link></footer>
  </main>;
}
