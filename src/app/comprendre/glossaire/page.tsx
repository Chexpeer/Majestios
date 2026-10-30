import Link from "next/link";

export const metadata = {
  title: "Glossaire métier — MajestiOS",
  description: "Définir les termes clés de l’intelligence commerciale, de la veille économique, des appels d’offres et de la prospection inversée."
};

const terms = [
  {term:"Intelligence commerciale proactive",definition:"Démarche qui recherche activement des signaux pertinents, les qualifie et les relie à des décisions ou actions commerciales possibles."},
  {term:"Prospection inversée",definition:"Approche qui part d’un événement ou d’un signal — par exemple une consultation publiée ou une évolution d’entreprise — pour identifier les acteurs susceptibles d’être pertinents, puis vérifier le contexte avant de les contacter."},
  {term:"Signal économique",definition:"Information datée et attribuable à une source qui peut justifier une vérification supplémentaire. Un signal n’est pas, à lui seul, la preuve d’un besoin commercial."},
  {term:"Opportunité qualifiée",definition:"Piste dont le contexte, la pertinence, l’échéance et les principaux critères ont été examinés. La qualification réduit l’incertitude mais ne garantit ni une commande ni une réussite."},
  {term:"Appel d’offres / consultation",definition:"Procédure par laquelle un acheteur exprime un besoin et invite des opérateurs à proposer une réponse selon des règles, des documents et des échéances définis."},
  {term:"Marché public",definition:"Contrat conclu par un acheteur soumis aux règles de la commande publique. Les avis et documents applicables doivent être consultés auprès des sources officielles indiquées."},
  {term:"Marché privé",definition:"Consultation ou besoin d’achat d’un acteur privé. Les informations disponibles, les règles de publication et le niveau de confirmation varient selon la source et le contexte."},
  {term:"BODACC",definition:"Bulletin officiel qui publie notamment des annonces relatives à la vie des entreprises. Une annonce doit être interprétée dans son contexte et ne prouve pas automatiquement une intention d’achat ou un besoin de prestation."},
  {term:"Provenance",definition:"Indication de l’origine d’une information, permettant de retrouver la source, la date et le contexte nécessaires à sa vérification."},
  {term:"Fraîcheur de l’information",definition:"Degré d’actualité d’une donnée au regard de la date de publication, de la fréquence de mise à jour et de la décision envisagée."},
  {term:"Fait, interprétation, hypothèse",definition:"Le fait est soutenu par une source ; l’interprétation propose une explication ; l’hypothèse formule une piste à vérifier. Les trois niveaux ne doivent pas être confondus."},
  {term:"Réseautage intelligent",definition:"Mise en relation fondée sur une complémentarité professionnelle et un motif explicite, en respectant le choix des personnes et les règles applicables aux données."},
  {term:"Capitalisation",definition:"Conservation structurée des résultats et enseignements d’une action afin d’améliorer les décisions futures, sans généraliser abusivement à partir d’un cas isolé."},
  {term:"BrainiOS",definition:"Doctrine de mémoire économique et documentaire transversale envisagée pour MajestiOS : relier les informations, leur provenance, les entités, les signaux, les actions et les retours d’expérience. Les principes documentés ne signifient pas que toutes les fonctions sont déjà opérationnelles."}
];

export default function GlossairePage() {
  return <main className="public-site concept-page">
    <section className="how-section concept-hero"><div>
      <span className="section-label">COMPRENDRE · RÉFÉRENCE MÉTIER</span>
      <h1>Le vocabulaire de MajestiOS, <em>clairement défini.</em></h1>
      <p>Un vocabulaire commun aide à distinguer une information, une hypothèse, une opportunité et une action. Les définitions ci-dessous précisent le sens des principaux termes employés dans les parcours MajestiOS.</p>
      <div className="hero-actions"><Link className="button-primary" href="/comment-et-pourquoi">Comprendre le concept <span aria-hidden="true">→</span></Link><Link className="button-secondary" href="/faq">Consulter la FAQ</Link></div>
    </div></section>
    <section className="concept-principles"><span className="section-label">LEXIQUE</span><h2>Termes essentiels</h2><dl className="bodacc-principle-grid">{terms.map((item)=><div key={item.term}><dt><strong>{item.term}</strong></dt><dd>{item.definition}</dd></div>)}</dl></section>
    <section className="concept-principles"><h2>Une règle de lecture</h2><p>Les termes décrivent une méthode et une ambition fonctionnelle. Ils ne prouvent pas qu’une source, un connecteur, un automatisme ou un service particulier est déjà actif. L’état réel doit être vérifié dans la rubrique concernée.</p><div className="route-actions"><Link className="search-submit concept-cta" href="/business">Explorer l’intelligence économique ↗</Link><Link className="search-submit concept-cta" href="/opportunites">Explorer les opportunités ↗</Link></div></section>
    <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/comprendre">Comprendre</Link><Link href="/faq">FAQ</Link></footer>
  </main>;
}
