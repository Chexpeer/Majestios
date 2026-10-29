import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
  title: "Intelligence entreprises — MajestiOS",
  description: "Relier les événements économiques, les informations d'entreprise et les signaux de marché pour qualifier des pistes commerciales."
};

const principles = [
  { title: "Un fait vérifiable", text: "Chaque observation doit être associée à une provenance, une date et un niveau de confiance. Une donnée manquante ou contradictoire reste visible." },
  { title: "Un rapprochement prudent", text: "Les publications, établissements et entreprises sont rapprochés sur la base d’identifiants et d’indices concordants. Les homonymies ne doivent pas être transformées en certitudes." },
  { title: "Une hypothèse explicite", text: "L’analyse explique pourquoi un signal peut intéresser un métier ou un territoire, sans attribuer à l’entreprise un besoin qu’elle n’a pas exprimé." },
  { title: "Une action pertinente", text: "La suite proposée doit être proportionnée au niveau de preuve : vérifier, approfondir, demander une introduction ou contacter lorsque les règles applicables le permettent." }
];

export default function BusinessIntelligencePage() {
  return <main className="site-page">
    <PublicHeader />
    <div className="page-container">
      <nav className="breadcrumbs" aria-label="Fil d’Ariane"><Link href="/">Accueil</Link><span><b>/</b><Link href="/business">Business</Link></span><span><b>/</b><strong>Intelligence entreprises</strong></span></nav>
      <section className="page-hero">
        <span className="eyebrow">BRAINIOS · CONNAISSANCE DES ENTREPRISES</span>
        <h1>Comprendre l’entreprise dans son <span>contexte.</span></h1>
        <p>L’intelligence entreprises de MajestiOS vise à relier des informations économiques dispersées pour mieux comprendre les évolutions d’une organisation et déterminer quelles vérifications ou actions commerciales méritent d’être envisagées.</p>
        <div className="page-hero-meta"><span className="status-chip"><i />Qualification progressive</span><span>Faits documentés · rapprochements prudents · pistes à confirmer</span></div>
      </section>

      <section className="content-panel">
        <span className="eyebrow">LA MÉTHODE</span><h2>Ne pas accumuler des données : construire une compréhension.</h2>
        <p>BrainiOS doit relier les informations à des entités et à des événements, conserver leur origine, comparer les signaux dans le temps et expliquer la pertinence éventuelle d’une piste. Une fiche entreprise ne doit pas devenir une juxtaposition de données ni un portrait artificiellement certain.</p>
        <div className="bodacc-principle-grid">{principles.map((principle) => <div key={principle.title}><strong>{principle.title}</strong><span>{principle.text}</span></div>)}</div>
      </section>

      <section className="bodacc-section">
        <div className="section-heading"><span className="eyebrow">PARCOURS D’EXPLORATION</span><h2>Quatre portes d’entrée complémentaires.</h2><p>Chaque parcours approfondit une famille de signaux, tout en restant relié à la connaissance commune de BrainiOS.</p></div>
        <div className="bodacc-signal-grid">
          <article className="bodacc-signal-card"><span className="bodacc-number">01</span><h3>Veille BODACC</h3><p>Comprendre les publications de cession, transmission et autres événements publiés, avec une synthèse traçable et des hypothèses commerciales clairement séparées des faits.</p><div><Link href="/business/veille-bodacc">Explorer la veille BODACC <span>↗</span></Link></div></article>
          <article className="bodacc-signal-card"><span className="bodacc-number">02</span><h3>Créations et implantations</h3><p>Examiner les signaux liés à la création d’activité et à l’implantation d’établissements, puis vérifier leur portée locale et sectorielle.</p><div><Link href="/business/creations-implantations">Explorer les implantations <span>↗</span></Link></div></article>
          <article className="bodacc-signal-card"><span className="bodacc-number">03</span><h3>Évolutions d’activité</h3><p>Mettre en perspective les changements documentés et rechercher les informations complémentaires nécessaires avant toute interprétation.</p><div><Link href="/business/evolutions-activite">Explorer les évolutions <span>↗</span></Link></div></article>
        </div>
      </section>

      <section className="content-panel">
        <span className="eyebrow">DU SIGNAL À L’ACTION</span><h2>Une qualification qui reste explicable.</h2>
        <ol className="bodacc-steps">
          <li><span>01</span><div><h3>Observer</h3><p>Identifier l’événement et conserver la référence ainsi que les dates utiles.</p></div></li>
          <li><span>02</span><div><h3>Recouper</h3><p>Comparer les informations disponibles et signaler les contradictions ou les incertitudes.</p></div></li>
          <li><span>03</span><div><h3>Relier à un métier</h3><p>Expliquer en quoi le signal pourrait être pertinent pour un service, un fournisseur ou un professionnel donné.</p></div></li>
          <li><span>04</span><div><h3>Confirmer avant de solliciter</h3><p>Vérifier que la piste est actuelle et légitime avant d’engager une prise de contact ou une mise en relation.</p></div></li>
          <li><span>05</span><div><h3>Capitaliser</h3><p>Documenter le retour obtenu afin d’améliorer les qualifications futures, sans transformer un refus ponctuel en exclusion définitive injustifiée.</p></div></li>
        </ol>
      </section>

      <section className="bodacc-next-actions"><div><span className="eyebrow">ÉTAPE SUIVANTE</span><h2>Faire de la connaissance un levier commercial.</h2><p>Les informations n’ont de valeur que si elles conduisent à une décision plus pertinente, une vérification utile ou une relation professionnelle mieux préparée.</p></div><div className="bodacc-next-links"><Link href="/developpement-commercial/prospection">Structurer la prospection <span>→</span></Link><Link href="/business/diagnostic">Explorer le diagnostic <span>→</span></Link><Link href="/business/veille-bodacc">Revenir à la veille BODACC <span>→</span></Link></div></section>
      <footer className="page-footer"><span>MAJESTIOS · DÉTECTER → QUALIFIER → IDENTIFIER → CONTACTER → TRANSFORMER → CAPITALISER</span><Link href="/faq">Besoin d’aide ?</Link></footer>
    </div>
  </main>;
}
