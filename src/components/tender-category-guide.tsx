import Link from "next/link";

type Props = {
  eyebrow: string;
  title: string;
  emphasis: string;
  intro: string;
  checks: { title: string; text: string }[];
  searchHref: string;
  searchLabel: string;
};

export default function TenderCategoryGuide({ eyebrow, title, emphasis, intro, checks, searchHref, searchLabel }: Props) {
  return <main className="site-page">
    <div className="page-container">
      <nav className="breadcrumbs" aria-label="Fil d’Ariane"><Link href="/">Accueil</Link><span><b>/</b><Link href="/opportunites">Opportunités</Link></span><span><b>/</b><Link href="/opportunites/marches-publics">Marchés publics</Link></span><span><b>/</b><Link href="/opportunites/marches-publics/appels-offres">Appels d’offres</Link></span><span><b>/</b><strong>{title}</strong></span></nav>
      <section className="page-hero bodacc-hero">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title} <span>{emphasis}</span></h1>
        <p>{intro}</p>
        <div className="hero-actions"><Link className="button-primary" href={searchHref}>{searchLabel} <span aria-hidden="true">→</span></Link><Link className="button-secondary" href="/opportunites/marches-publics/appels-offres">Toutes les consultations publiques</Link></div>
      </section>
      <section className="content-panel">
        <span className="eyebrow">AVANT DE VOUS POSITIONNER</span>
        <h2>Les points à contrôler.</h2>
        <div className="bodacc-principle-grid">{checks.map((check)=><div key={check.title}><strong>{check.title}</strong><span>{check.text}</span></div>)}</div>
      </section>
      <section className="content-panel">
        <span className="eyebrow">MÉTHODE MAJESTIOS</span>
        <h2>Un avis trouvé n’est pas encore un marché gagné.</h2>
        <p>La qualification doit rapprocher les exigences officielles des capacités réelles de l’entreprise. Il faut ensuite décider si le dossier mérite une analyse approfondie, identifier les pièces manquantes et vérifier les délais avant tout engagement.</p>
        <p>Les résultats affichés dépendent des données accessibles dans le flux connecté. L’avis et son dossier officiel restent les références pour confirmer les conditions de participation.</p>
        <Link className="result-action" href="/developpement-commercial/accompagnement-appels-offres">Découvrir l’accompagnement aux appels d’offres →</Link>
      </section>
      <footer className="page-footer"><span>MAJESTIOS · DÉTECTER → QUALIFIER → IDENTIFIER → CONTACTER → TRANSFORMER → CAPITALISER</span><Link href="/faq">Besoin d’aide ?</Link></footer>
    </div>
  </main>;
}
