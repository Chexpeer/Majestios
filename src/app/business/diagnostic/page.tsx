import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
  title: "Diagnostic commercial d’entreprise — MajestiOS",
  description: "Structurer un premier diagnostic commercial, identifier les informations manquantes et hiérarchiser les prochaines vérifications."
};

const axes = [
  { title: "1. Clarifier l’objectif", text: "Définir la décision à préparer : développer une clientèle, lancer une offre, renforcer un territoire, répondre à des marchés ou mieux exploiter le réseau professionnel." },
  { title: "2. Décrire la situation", text: "Rassembler les informations disponibles sur l’activité, les clients, les offres, les moyens commerciaux et les contraintes. Signaler explicitement les données absentes ou anciennes." },
  { title: "3. Examiner le marché", text: "Délimiter les segments, les zones, les concurrents et les événements économiques pertinents. Distinguer les faits documentés des hypothèses à vérifier." },
  { title: "4. Qualifier les pistes", text: "Relier les opportunités possibles aux compétences, à la capacité de réalisation et aux critères de choix de l’entreprise. Une piste détectée n’est pas encore une vente probable." },
  { title: "5. Prioriser les actions", text: "Choisir quelques actions réalistes, avec un responsable, une échéance et un résultat observable. Prévoir une date de réexamen si les informations restent insuffisantes." }
];

export default function DiagnosticBusinessPage() {
  return <main className="public-site concept-page">
    <PublicHeader />
    <section className="how-section concept-hero"><div>
      <span className="section-label">BUSINESS · DIAGNOSTIC</span>
      <h1>Comprendre sa situation avant de <em>choisir sa prochaine action.</em></h1>
      <p>Un diagnostic commercial utile n’est ni une note automatique ni une promesse de performance. C’est une démarche structurée pour clarifier l’objectif, examiner les informations disponibles et décider quelles vérifications ou actions méritent d’être engagées.</p>
      <div className="hero-actions"><Link className="button-primary" href="/developpement-commercial/etudes-de-marche">Étudier son marché <span aria-hidden="true">→</span></Link><Link className="button-secondary" href="/developpement-commercial/prospection">Structurer sa prospection</Link></div>
    </div></section>
    <section className="concept-principles"><span className="section-label">PARCOURS DE DIAGNOSTIC</span><h2>Cinq axes pour organiser l’analyse</h2><ol className="bodacc-steps">{axes.map((axis) => <li key={axis.title}><span aria-hidden="true">•</span><div><h3>{axis.title}</h3><p>{axis.text}</p></div></li>)}</ol></section>
    <section className="concept-principles"><span className="section-label">ÉLÉMENTS À RENDRE EXPLICITES</span><h2>Un diagnostic doit faire apparaître les limites</h2><div className="bodacc-principle-grid">
      <div><strong>Faits établis</strong><span>Informations vérifiées, datées et reliées à une source ou à un document identifiable.</span></div>
      <div><strong>Informations manquantes</strong><span>Éléments à demander ou à vérifier avant de prendre une décision importante.</span></div>
      <div><strong>Hypothèses</strong><span>Explications possibles qui ne doivent pas être présentées comme des certitudes.</span></div>
      <div><strong>Priorités</strong><span>Actions proportionnées aux moyens, aux objectifs et au niveau de preuve disponible.</span></div>
    </div></section>
    <section className="concept-principles"><h2>Relier le diagnostic aux parcours MajestiOS</h2><div className="results-list">
      <article className="result-card"><div className="result-main"><h3>Intelligence économique</h3><p>Examiner les informations d’entreprise et les signaux qui peuvent éclairer une décision.</p></div><div className="result-actions"><Link className="result-action" href="/business/intelligence-entreprises">Explorer le parcours →</Link></div></article>
      <article className="result-card"><div className="result-main"><h3>Étude de marché</h3><p>Structurer les sources, le périmètre et les scénarios avant d’engager des moyens.</p></div><div className="result-actions"><Link className="result-action" href="/developpement-commercial/etudes-de-marche">Explorer le parcours →</Link></div></article>
      <article className="result-card"><div className="result-main"><h3>Prospection ciblée</h3><p>Qualifier les pistes et préparer une action commerciale contextualisée.</p></div><div className="result-actions"><Link className="result-action" href="/developpement-commercial/prospection/ciblage">Explorer le parcours →</Link></div></article>
    </div><p><strong>État du service :</strong> cette page présente une méthode de diagnostic. Elle ne prétend pas qu’un audit automatique, un score complet ou une collecte exhaustive sont déjà opérationnels.</p></section>
    <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/business">Business Intelligence</Link><Link href="/faq">FAQ</Link></footer>
  </main>;
}
