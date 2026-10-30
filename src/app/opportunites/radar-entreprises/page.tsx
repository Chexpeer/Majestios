import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
  title: "Radar des entreprises — MajestiOS",
  description: "Explorer des entreprises à qualifier selon votre activité, votre territoire et des faits vérifiables."
};

export default function RadarEntreprisesPage() {
  return <main className="site-page">
    <PublicHeader />
    <div className="page-container">
      <nav className="breadcrumbs" aria-label="Fil d’Ariane"><Link href="/">Accueil</Link><span><b>/</b><Link href="/opportunites">Opportunités</Link></span><span><b>/</b><Link href="/opportunites/privees">Opportunités privées</Link></span><span><b>/</b><strong>Radar des entreprises</strong></span></nav>
      <section data-dossier-symbol="▥" className="page-hero">
        <span className="eyebrow">OPPORTUNITY INTELLIGENCE · ENTREPRISES</span>
        <h1>Repérer les entreprises pertinentes. <span>Qualifier avant de contacter.</span></h1>
        <p>Le radar des entreprises est conçu pour rapprocher votre activité, votre territoire et des informations vérifiables afin de faire émerger des pistes commerciales à examiner. Une entreprise repérée n’est pas nécessairement en recherche d’un fournisseur.</p>
        <div className="page-hero-meta"><span className="status-chip"><i />Parcours de qualification</span><span>Entreprise identifiée · pertinence à vérifier · besoin non présumé</span></div>
      </section>
      <section className="content-panel">
        <span className="eyebrow">CONSTRUIRE UNE PISTE SÉRIEUSE</span><h2>Trois niveaux à ne pas confondre.</h2>
        <div className="bodacc-principle-grid">
          <div><strong>1. L’entreprise</strong><span>Une organisation identifiée avec ses éléments de référence et son activité connue.</span></div>
          <div><strong>2. Les faits</strong><span>Des informations datées et attribuées à une source, avec les incertitudes visibles.</span></div>
          <div><strong>3. La piste commerciale</strong><span>Une hypothèse argumentée, à confirmer avant toute prise de contact.</span></div>
        </div>
      </section>
      <section className="bodacc-section">
        <div className="section-heading"><span className="eyebrow">POURSUIVRE L’EXPLORATION</span><h2>Ouvrir le bon dossier métier.</h2><p>Ces dossiers documentent les signaux et les méthodes d’analyse. Ils ne constituent pas, à eux seuls, une base de prospection personnalisée ni un CRM opérationnel.</p></div>
        <div className="bodacc-signal-grid">
          <article className="bodacc-signal-card"><span className="bodacc-number">01</span><h3>Intelligence entreprises</h3><p>Comprendre comment relier les informations économiques, les faits vérifiés et les hypothèses de développement commercial.</p><div><Link href="/business/intelligence-entreprises">Ouvrir le dossier <span>↗</span></Link></div></article>
          <article className="bodacc-signal-card"><span className="bodacc-number">02</span><h3>Signaux économiques</h3><p>Examiner les événements qui peuvent justifier une vérification complémentaire, sans leur attribuer une signification automatique.</p><div><Link href="/opportunites/signaux-entreprises">Explorer les signaux <span>↗</span></Link></div></article>
          <article className="bodacc-signal-card"><span className="bodacc-number">03</span><h3>Présenter votre entreprise</h3><p>Décrire votre activité, votre territoire et le type d’opportunités que vous souhaitez identifier.</p><div><Link href="/espace-professionnel">Préciser mon besoin <span>↗</span></Link></div></article>
        </div>
      </section>
      <footer className="page-footer"><span>MAJESTIOS · DÉTECTER → QUALIFIER → IDENTIFIER → CONTACTER → TRANSFORMER → CAPITALISER</span><Link href="/faq">Besoin d’aide ?</Link></footer>
    </div>
  </main>;
}
