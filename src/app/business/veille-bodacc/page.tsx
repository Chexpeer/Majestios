import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
  title: "Veille BODACC et signaux économiques — MajestiOS",
  description: "Comprendre les publications BODACC, structurer une veille documentaire et qualifier des pistes commerciales avec MajestiOS."
};

const signalTypes = [
  {
    number: "01",
    title: "Cession et transmission",
    description: "Repérer les publications liées à une cession ou à une transmission, puis orienter l’information vers les parcours d’achat, de vente ou de reprise d’entreprise.",
    links: [{ label: "Préparer un projet de reprise", href: "/business/achat-cession/acheter" }, { label: "Préparer une cession", href: "/business/achat-cession/vendre" }]
  },
  {
    number: "02",
    title: "Création et évolution d’établissement",
    description: "Mettre en contexte les événements concernant une entreprise ou un établissement. Selon les éléments confirmés, ces changements peuvent justifier une vérification commerciale, logistique ou territoriale.",
    links: [{ label: "Créations et implantations", href: "/business/creations-implantations" }, { label: "Intelligence entreprises", href: "/business/intelligence-entreprises" }]
  },
  {
    number: "03",
    title: "Signaux à croiser",
    description: "Rapprocher une publication d’autres informations autorisées : activité, territoire, marchés attribués, événements ou compétences disponibles. Une corrélation suggère une piste ; elle ne prouve pas un besoin.",
    links: [{ label: "Développement commercial", href: "/developpement-commercial" }, { label: "Études de marché", href: "/developpement-commercial/etudes-de-marche" }]
  }
];

const dossierSteps = [
  ["Tracer", "Conserver la référence de la publication, la source, la date de publication et la date de collecte."],
  ["Comprendre", "Produire une synthèse originale qui sépare les faits publiés, le contexte et les limites de l’information."],
  ["Rapprocher", "Associer prudemment la publication à une entreprise ou un établissement, en signalant les homonymies et incertitudes."],
  ["Qualifier", "Formuler des hypothèses commerciales explicites, avec leur justification et les vérifications encore nécessaires."],
  ["Agir et apprendre", "Proposer une prochaine étape pertinente, puis conserver le résultat du suivi pour améliorer les futures qualifications."]
];

export default function BodaccWatchPage() {
  return <main className="site-page">
    <PublicHeader />
    <div className="page-container bodacc-page">
      <nav className="breadcrumbs" aria-label="Fil d’Ariane">
        <Link href="/">Accueil</Link><span><b>/</b><Link href="/business">Business</Link></span><span><b>/</b><strong>Veille BODACC</strong></span>
      </nav>

      <section className="page-hero bodacc-hero">
        <span className="eyebrow">BRAINIOS · INTELLIGENCE ÉCONOMIQUE</span>
        <h1>Le signal devient <span>connaissance.</span></h1>
        <p>MajestiOS ne doit pas être un simple relais vers des publications externes. Sa vocation est de transformer les informations économiques autorisées en ressources documentaires compréhensibles, traçables et utiles à la décision commerciale.</p>
        <div className="page-hero-meta">
          <span className="status-chip"><i />Méthode documentaire</span>
          <span>Source d’information · analyse MajestiOS · qualification humaine</span>
        </div>
      </section>

      <section className="content-panel bodacc-principle">
        <span className="eyebrow">NOTRE PRINCIPE</span>
        <h2>La source alimente MajestiOS ; elle ne remplace pas MajestiOS.</h2>
        <p>Le BODACC constitue un point d’entrée dans la connaissance économique. La valeur ajoutée de BrainiOS réside dans la traçabilité, la synthèse, le rapprochement des informations, l’explication du contexte et l’identification de pistes à vérifier.</p>
        <div className="bodacc-principle-grid">
          <div><strong>Faits sourcés</strong><span>Ce que la publication indique effectivement.</span></div>
          <div><strong>Analyse</strong><span>Ce que les faits peuvent signifier, avec leurs limites.</span></div>
          <div><strong>Piste commerciale</strong><span>Une hypothèse à qualifier, jamais un besoin présumé.</span></div>
        </div>
      </section>

      <section className="bodacc-section">
        <div className="section-heading"><span className="eyebrow">TYPES DE SIGNAUX</span><h2>Une information, plusieurs parcours métier.</h2><p>Une même publication peut avoir une utilité différente selon le contexte et le professionnel concerné.</p></div>
        <div className="bodacc-signal-grid">{signalTypes.map((signal) => <article className="bodacc-signal-card" key={signal.number}>
          <span className="bodacc-number">{signal.number}</span><h3>{signal.title}</h3><p>{signal.description}</p>
          <div>{signal.links.map((item) => <Link href={item.href} key={item.href}>{item.label}<span aria-hidden="true">↗</span></Link>)}</div>
        </article>)}</div>
      </section>

      <section className="content-panel">
        <span className="eyebrow">DOSSIER DOCUMENTAIRE MAJESTIOS</span>
        <h2>De la publication à une piste exploitable.</h2>
        <p>Le parcours cible de BrainiOS organise le travail documentaire en cinq étapes. Il décrit la méthode à construire ; il ne signifie pas que toutes ces opérations sont déjà automatisées dans la version actuelle.</p>
        <ol className="bodacc-steps">{dossierSteps.map(([title, description], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}</ol>
      </section>

      <section className="content-panel bodacc-integrity">
        <span className="eyebrow">FIABILITÉ ET SOUVERAINETÉ</span><h2>Maîtriser l’information, respecter son origine.</h2>
        <ul>
          <li><strong>Traçabilité :</strong> conserver la référence, la date et la provenance de chaque fait repris.</li>
          <li><strong>Réutilisation responsable :</strong> vérifier les conditions d’accès, de stockage et de diffusion avant de reproduire un document ou un article. Le caractère public d’une publication n’autorise pas automatiquement sa reproduction intégrale.</li>
          <li><strong>Neutralité :</strong> distinguer les faits des analyses et signaler les données incertaines, contradictoires ou anciennes.</li>
          <li><strong>Respect des personnes :</strong> ne pas déduire une intention d’achat, une difficulté ou un besoin commercial sans élément fiable ; encadrer les prises de contact conformément aux règles applicables.</li>
          <li><strong>Correction :</strong> permettre de corriger un rapprochement erroné et de conserver l’historique de mise à jour.</li>
        </ul>
      </section>

      <section className="bodacc-next-actions">
        <div><span className="eyebrow">POURSUIVRE L’EXPLORATION</span><h2>Relier la veille aux décisions.</h2><p>La veille n’a de valeur que si elle éclaire une décision et s’inscrit dans un parcours métier cohérent.</p></div>
        <div className="bodacc-next-links"><Link href="/business/intelligence-entreprises">Intelligence entreprises <span>→</span></Link><Link href="/business/achat-cession">Achat et cession <span>→</span></Link><Link href="/developpement-commercial/prospection">Prospection ciblée <span>→</span></Link></div>
      </section>

      <footer className="page-footer"><span>MAJESTIOS · DÉTECTER → QUALIFIER → IDENTIFIER → CONTACTER → TRANSFORMER → CAPITALISER</span><Link href="/faq">Besoin d’aide ?</Link></footer>
    </div>
  </main>;
}
