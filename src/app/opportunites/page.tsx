import Link from "next/link";

export const metadata = {
  title: "Opportunités professionnelles — MajestiOS",
  description: "Explorer les marchés publics et privés, les salons professionnels, l’emploi et les missions à travers des parcours distincts de qualification."
};

const sections = [
  { title: "Marchés publics", tag: "CONSULTATIONS PUBLIQUES", text: "Rechercher des avis, filtrer les consultations et examiner les informations officielles avant de décider si l’entreprise peut se positionner.", href: "/opportunites/marches-publics", action: "Rechercher des marchés" },
  { title: "Marchés privés", tag: "BESOINS ET CONSULTATIONS PRIVÉS", text: "Distinguer une consultation publiée, une piste de sous-traitance et une hypothèse commerciale. La source et le degré de confirmation restent essentiels.", href: "/opportunites/marches-prives", action: "Explorer les marchés privés" },
  { title: "Salons professionnels", tag: "RENCONTRES ET RÉSEAUTAGE", text: "Préparer les prochains rendez-vous, cibler les secteurs pertinents et transformer les échanges en actions de suivi commercial.", href: "/opportunites/salons", action: "Préparer un salon" },
  { title: "Emploi et missions", tag: "COMPÉTENCES ET PRESTATIONS", text: "Distinguer les offres d’emploi des missions ponctuelles, puis vérifier les conditions et l’émetteur avant toute démarche.", href: "/opportunites/emploi", action: "Explorer emploi et missions" }
];

export default function OpportunitesPage() {
  return <main className="public-site concept-page domain-opportunites">
    <section className="how-section concept-hero"><div><span className="section-label">MAJESTIOS · DÉVELOPPEMENT COMMERCIAL</span><h1>Une opportunité n’a de valeur que <em>si elle est qualifiée.</em></h1><p>MajestiOS rassemble des parcours pour détecter des occasions de développement commercial : consultations publiques et privées, salons professionnels, emplois et missions. L’objectif n’est pas d’empiler des annonces, mais d’aider à comprendre la source, le contexte, la pertinence et la prochaine action.</p><p>Chaque famille possède ses propres critères. Une publication officielle, une information à confirmer et une hypothèse issue d’un signal économique ne doivent jamais être présentées comme équivalentes.</p></div></section>
    <section className="concept-principles"><span className="section-label">CHOISIR UN PARCOURS</span><h2>Quatre familles d’opportunités.</h2><div className="results-list">{sections.map((item)=><article className="result-card" key={item.href}><div className="result-main"><span className="result-category">{item.tag}</span><h3>{item.title}</h3><p>{item.text}</p></div><div className="result-actions"><Link className="result-action" href={item.href}>{item.action} →</Link></div></article>)}</div></section>
    <section className="concept-principles"><span className="section-label">MÉTHODE MAJESTIOS</span><h2>De la détection à l’action.</h2><div className="bodacc-principle-grid"><div><strong>01 · Détecter</strong><span>Repérer une publication, un rendez-vous ou un changement économique pertinent.</span></div><div><strong>02 · Qualifier</strong><span>Contrôler la source, la date, les critères, les conditions et les informations manquantes.</span></div><div><strong>03 · Identifier</strong><span>Déterminer les acteurs concernés et vérifier que le rapprochement est justifié.</span></div><div><strong>04 · Contacter</strong><span>Choisir une démarche proportionnée, professionnelle et respectueuse des règles applicables.</span></div><div><strong>05 · Transformer</strong><span>Passer de la piste à une action commerciale suivie, sans promettre un résultat.</span></div><div><strong>06 · Capitaliser</strong><span>Conserver les résultats utiles, documenter les erreurs et améliorer les qualifications futures.</span></div></div></section>
    <section className="concept-principles"><h2>Ce qui est disponible doit rester explicite.</h2><p>Les parcours de recherche et les pages méthodologiques ne signifient pas que toutes les sources publiques et privées sont déjà connectées. Les annonces, inscriptions, candidatures ou transmissions de données ne sont présentées comme actives que lorsque le flux technique correspondant existe et a été vérifié.</p><p><Link href="/business/intelligence-entreprises">Découvrir l’intelligence économique des entreprises →</Link></p></section>
    <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/faq">FAQ</Link><small>La qualification précède l’action.</small></footer>
  </main>;
}
