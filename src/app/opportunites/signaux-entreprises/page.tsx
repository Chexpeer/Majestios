import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
  title: "Signaux économiques — MajestiOS",
  description: "Comprendre les événements d’entreprise et distinguer les faits documentés des hypothèses commerciales."
};

const signalSteps = [
  ["Observer", "Identifier le fait publié, la source et les dates pertinentes."],
  ["Vérifier", "Contrôler l’identité de l’entreprise et rapprocher les informations concordantes."],
  ["Interpréter avec prudence", "Expliquer pourquoi l’événement peut être pertinent pour une activité, sans en déduire un besoin certain."],
  ["Décider de la suite", "Choisir une vérification, une veille complémentaire ou une prise de contact proportionnée aux éléments disponibles."]
];

export default function SignauxEntreprisesPage() {
  return <main className="site-page">
    <PublicHeader />
    <div className="page-container">
      <nav className="breadcrumbs" aria-label="Fil d’Ariane"><Link href="/">Accueil</Link><span><b>/</b><Link href="/opportunites">Opportunités</Link></span><span><b>/</b><Link href="/opportunites/privees">Opportunités privées</Link></span><span><b>/</b><strong>Signaux économiques</strong></span></nav>
      <section className="page-hero">
        <span className="eyebrow">OPPORTUNITY INTELLIGENCE · VEILLE</span>
        <h1>Un signal n’est pas encore <span>une opportunité.</span></h1>
        <p>MajestiOS vise à transformer des informations économiques traçables en pistes à qualifier. Cette rubrique explique comment examiner un événement, comprendre ses limites et décider s’il mérite un approfondissement commercial.</p>
        <div className="page-hero-meta"><span className="status-chip"><i />Méthode de qualification</span><span>Faits documentés · hypothèses explicites · vérification humaine</span></div>
      </section>
      <section className="content-panel">
        <span className="eyebrow">RÈGLE DE LECTURE</span><h2>Trois niveaux d’information.</h2>
        <div className="bodacc-principle-grid">
          <div><strong>Fait</strong><span>Un élément attribué à une source identifiable, daté et vérifiable.</span></div>
          <div><strong>Interprétation</strong><span>Une lecture possible du fait, qui doit rester proportionnée aux preuves.</span></div>
          <div><strong>Hypothèse commerciale</strong><span>Une piste qui demande des vérifications ; elle ne prouve pas que l’entreprise cherche un prestataire.</span></div>
        </div>
      </section>
      <section className="content-panel">
        <span className="eyebrow">PARCOURS DE QUALIFICATION</span><h2>Du signal à une prochaine étape justifiée.</h2>
        <ol className="bodacc-steps">{signalSteps.map(([title, description], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}</ol>
        <p>Dans cette version, cette page présente la méthode. Elle ne prétend pas fournir un flux privé complet ni automatiser l’ensemble de ces étapes.</p>
      </section>
      <section className="bodacc-section">
        <div className="section-heading"><span className="eyebrow">DOSSIERS ASSOCIÉS</span><h2>Approfondir la source ou l’analyse.</h2></div>
        <div className="bodacc-signal-grid">
          <article className="bodacc-signal-card"><span className="bodacc-number">01</span><h3>Veille BODACC</h3><p>Consulter la méthode de lecture des publications de cession, transmission et autres événements économiques.</p><div><Link href="/business/veille-bodacc">Ouvrir le dossier BODACC <span>↗</span></Link></div></article>
          <article className="bodacc-signal-card"><span className="bodacc-number">02</span><h3>Radar des entreprises</h3><p>Relier les faits vérifiés à une activité et un territoire pour construire des pistes à examiner.</p><div><Link href="/opportunites/radar-entreprises">Ouvrir le radar <span>↗</span></Link></div></article>
          <article className="bodacc-signal-card"><span className="bodacc-number">03</span><h3>Marchés privés</h3><p>Distinguer une consultation privée publiée d’une hypothèse de sous-traitance ou d’un signal indirect.</p><div><Link href="/opportunites/marches-prives">Explorer les marchés privés <span>↗</span></Link></div></article>
        </div>
      </section>
      <footer className="page-footer"><span>MAJESTIOS · DÉTECTER → QUALIFIER → IDENTIFIER → CONTACTER → TRANSFORMER → CAPITALISER</span><Link href="/faq">Besoin d’aide ?</Link></footer>
    </div>
  </main>;
}
