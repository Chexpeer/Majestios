import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
  title: "Évolutions d’activité des entreprises — MajestiOS",
  description: "Analyser avec méthode les changements documentés d’une entreprise et déterminer les vérifications commerciales utiles."
};

const evolutionTypes = [
  { title: "Évolution juridique ou structurelle", text: "Repérer les changements publiés et vérifier leur portée réelle pour l’entité concernée avant de les interpréter." },
  { title: "Évolution géographique", text: "Examiner un transfert, un nouvel établissement ou une modification d’adresse en tenant compte des dates et des identifiants." },
  { title: "Évolution d’activité", text: "Comparer les activités documentées sans supposer qu’un changement déclaré entraîne automatiquement un nouveau besoin commercial." },
  { title: "Évolution de l’environnement", text: "Mettre en regard les signaux d’entreprise avec des événements, des marchés ou des changements sectoriels pertinents et vérifiables." }
];

export default function EvolutionsActivitePage() {
  return <main className="site-page">
    <PublicHeader />
    <div className="page-container">
      <nav className="breadcrumbs" aria-label="Fil d’Ariane"><Link href="/">Accueil</Link><span><b>/</b><Link href="/business">Business</Link></span><span><b>/</b><Link href="/business/intelligence-entreprises">Intelligence entreprises</Link></span><span><b>/</b><strong>Évolutions d’activité</strong></span></nav>
      <section className="page-hero bodacc-hero">
        <span className="eyebrow">BRAINIOS · COMPRÉHENSION DYNAMIQUE</span>
        <h1>Lire les changements, <span>pas seulement les données.</span></h1>
        <p>Une entreprise évolue dans le temps. MajestiOS doit mettre en perspective les changements documentés, expliquer ce qu’ils permettent réellement de conclure et distinguer les faits des hypothèses commerciales.</p>
        <div className="page-hero-meta"><span className="status-chip"><i />Analyse dans le temps</span><span>Événement · comparaison · qualification</span></div>
      </section>
      <section className="content-panel">
        <span className="eyebrow">FAMILLES DE SIGNAUX</span><h2>Un changement n’a pas toujours la même signification.</h2>
        <p>La qualification dépend de la nature du changement, de sa date, de la fiabilité de la source et de l’activité réelle de l’entreprise. BrainiOS doit conserver ces distinctions au lieu de produire un score opaque ou une interprétation unique.</p>
        <div className="bodacc-signal-grid">{evolutionTypes.map((item,index)=><article className="bodacc-signal-card" key={item.title}><span className="bodacc-number">{String(index+1).padStart(2,"0")}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
      </section>
      <section className="content-panel">
        <span className="eyebrow">MÉTHODE D’ANALYSE</span><h2>Comparer avant de conclure.</h2>
        <ol className="bodacc-steps">
          <li><span>01</span><div><h3>Établir le point de départ</h3><p>Conserver l’information antérieure pertinente, sa date et sa source, sans écraser l’historique.</p></div></li>
          <li><span>02</span><div><h3>Documenter le changement</h3><p>Décrire ce qui a effectivement changé, à quelle date et pour quelle entité.</p></div></li>
          <li><span>03</span><div><h3>Vérifier les explications concurrentes</h3><p>Rechercher les homonymies, les retards de mise à jour et les informations contradictoires.</p></div></li>
          <li><span>04</span><div><h3>Énoncer une hypothèse mesurée</h3><p>Préciser pourquoi le changement pourrait être pertinent pour une offre ou un secteur, ainsi que les éléments qui manquent encore.</p></div></li>
          <li><span>05</span><div><h3>Suivre le résultat</h3><p>Enregistrer la vérification et son résultat pour éviter de répéter les mêmes erreurs et améliorer les qualifications futures.</p></div></li>
        </ol>
      </section>
      <section className="content-panel bodacc-integrity"><span className="eyebrow">GARDE-FOUS</span><h2>Une intelligence commerciale explicable.</h2><ul><li>Chaque conclusion doit pouvoir être reliée aux faits qui la soutiennent.</li><li>Une information ancienne ne doit pas être présentée comme un événement actuel.</li><li>Un signal ne permet pas à lui seul de déduire un besoin, une difficulté ou une intention d’achat.</li><li>Les données personnelles et les prises de contact doivent être traitées selon les règles applicables.</li></ul></section>
      <section className="bodacc-next-actions"><div><span className="eyebrow">POUR ALLER PLUS LOIN</span><h2>Du changement observé à la bonne décision.</h2><p>La suite dépend du contexte, du niveau de preuve et de l’objectif commercial poursuivi.</p></div><div className="bodacc-next-links"><Link href="/business/intelligence-entreprises">Intelligence entreprises <span>→</span></Link><Link href="/business/veille-bodacc">Veille BODACC <span>→</span></Link><Link href="/developpement-commercial/prospection">Prospection structurée <span>→</span></Link></div></section>
      <footer className="page-footer"><span>MAJESTIOS · DÉTECTER → QUALIFIER → IDENTIFIER → CONTACTER → TRANSFORMER → CAPITALISER</span><Link href="/faq">Besoin d’aide ?</Link></footer>
    </div>
  </main>;
}
