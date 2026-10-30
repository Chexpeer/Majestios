import Link from "next/link";

export const metadata = {
  title: "Choisir une opportunité — MajestiOS",
  description: "Accéder aux marchés publics, aux opportunités privées et aux événements professionnels, avec des dossiers distincts."
};

const sections = [
  { title: "Marchés publics", tag: "COMMANDE PUBLIQUE", text: "Accéder aux marchés publics, rechercher les appels d’offres et parcourir les catégories Travaux, Services et Fournitures.", href: "/opportunites/marches-publics", action: "Explorer les marchés publics", tone: "public" },
  { title: "Opportunités privées", tag: "ENTREPRISES ET BESOINS PRIVÉS", text: "Explorer les consultations privées, les besoins d’entreprises et les pistes de sous-traitance, en distinguant les annonces confirmées des signaux à qualifier.", href: "/opportunites/privees", action: "Explorer les opportunités privées", tone: "private" },
  { title: "Salons professionnels", tag: "RENCONTRES ET RÉSEAUTAGE", text: "Repérer les rendez-vous professionnels, préparer les rencontres et organiser le suivi commercial.", href: "/opportunites/salons", action: "Préparer un salon", tone: "events" }
];

export default function OpportunitesPage() {
  return <main className="public-site concept-page domain-opportunites">
    <section className="how-section concept-hero"><div>
      <span className="section-label">MAJESTIOS · CHOISIR SON OBJECTIF</span>
      <h1>Qu’est-ce que vous recherchez <em>aujourd’hui ?</em></h1>
      <p>Choisissez votre porte d’entrée. Les marchés publics, les opportunités privées et les salons professionnels suivent des parcours distincts. L’emploi et le recrutement disposent de leur propre rubrique dans la navigation principale.</p>
      <div className="hero-actions">
        <Link className="button-primary" href="/espace-professionnel">Présenter mon entreprise <span aria-hidden="true">↗</span></Link>
        <Link className="button-secondary" href="/comprendre">Comprendre MajestiOS</Link>
      </div>
    </div></section>
    <section className="concept-principles"><span className="section-label">CHOISIR UNE RUBRIQUE</span><h2>À vous de choisir.</h2><div className="results-list">{sections.map((item)=><article className={`result-card opportunity-choice opportunity-choice-${item.tone}`} key={item.href}><div className="result-main"><span className="result-category">{item.tag}</span><h3>{item.title}</h3><p>{item.text}</p></div><div className="result-actions"><Link className="result-action" href={item.href}>{item.action} →</Link></div></article>)}</div></section>
    <section className="concept-principles"><span className="section-label">MÉTHODE MAJESTIOS</span><h2>Une piste doit être qualifiée avant l’action.</h2><div className="bodacc-principle-grid"><div><strong>01 · Détecter</strong><span>Repérer une publication, un besoin exprimé ou un signal économique pertinent.</span></div><div><strong>02 · Qualifier</strong><span>Contrôler la source, la date, les critères et les informations manquantes.</span></div><div><strong>03 · Identifier</strong><span>Déterminer les acteurs concernés et vérifier que le rapprochement est justifié.</span></div><div><strong>04 · Contacter</strong><span>Choisir une démarche professionnelle et respectueuse des règles applicables.</span></div><div><strong>05 · Transformer</strong><span>Passer de la piste à une action commerciale suivie, sans promettre un résultat.</span></div><div><strong>06 · Capitaliser</strong><span>Conserver les résultats utiles et améliorer les qualifications futures.</span></div></div></section>
    <section className="concept-principles"><h2>La transparence fait partie du service.</h2><p>Les parcours, les annonces de démonstration et les fonctions en préparation doivent être identifiés clairement. Une page de méthode ne signifie pas que toutes les sources sont connectées ni que toutes les actions sont déjà disponibles.</p><p><Link href="/comprendre">Découvrir le concept et la méthode MajestiOS →</Link></p></section>
    <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/faq">FAQ</Link><small>La qualification précède l’action.</small></footer>
  </main>;
}
