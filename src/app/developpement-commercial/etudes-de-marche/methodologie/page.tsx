import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
  title: "Méthodologie d’étude de marché — MajestiOS",
  description: "Cadrer une étude de marché, construire un périmètre comparable et transformer les résultats en décision commerciale."
};

const steps = [
  { title: "1. Partir d’une décision", text: "Écrire la décision que l’étude doit éclairer : lancement d’une offre, choix d’un territoire, ciblage d’un segment ou priorité commerciale. Une question précise limite la collecte inutile." },
  { title: "2. Définir le périmètre", text: "Délimiter les activités, la clientèle, le territoire et la période. Documenter les exclusions et les définitions utilisées pour éviter les comparaisons trompeuses." },
  { title: "3. Collecter et qualifier les sources", text: "Pour chaque donnée, consigner son origine, sa date, son périmètre, sa fiabilité et les éventuelles limites de réutilisation. Une information trouvée en ligne n’est pas automatiquement exacte, actuelle ou réutilisable." },
  { title: "4. Croiser les éléments", text: "Comparer plusieurs indicateurs et rechercher les contradictions. Distinguer les données observées, les estimations, les interprétations et les hypothèses à tester." },
  { title: "5. Construire des scénarios", text: "Présenter les signaux favorables, les obstacles, les inconnues et plusieurs options réalistes. Éviter de transformer une corrélation en causalité ou un potentiel de marché en vente garantie." },
  { title: "6. Décider et actualiser", text: "Relier chaque recommandation aux éléments qui la soutiennent, préciser le niveau de confiance et indiquer quelles nouvelles informations pourraient modifier la conclusion." }
];

export default function MethodologieEtudePage() {
  return <main className="public-site concept-page">
    <PublicHeader />
    <section className="how-section concept-hero"><div>
      <span className="section-label">DÉVELOPPEMENT COMMERCIAL · MÉTHODE</span>
      <h1>Une étude de marché <em>construite pour décider.</em></h1>
      <p>Une étude solide ne consiste pas à accumuler des chiffres. Elle organise des éléments vérifiables autour d’une question, explicite les incertitudes et débouche sur une décision proportionnée au niveau de preuve.</p>
      <div className="hero-actions"><Link className="button-primary" href="/developpement-commercial/etudes-de-marche/sources">Identifier les sources utiles <span aria-hidden="true">→</span></Link><Link className="button-secondary" href="/developpement-commercial/etudes-de-marche">Retour aux études de marché</Link></div>
    </div></section>
    <section className="concept-principles"><span className="section-label">PROTOCOLE DE TRAVAIL</span><h2>Du cadrage à la décision</h2><ol className="bodacc-steps">{steps.map((step) => <li key={step.title}><span aria-hidden="true">•</span><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}</ol></section>
    <section className="concept-principles"><span className="section-label">LIVRABLE ATTENDU</span><h2>Rendre le raisonnement contrôlable</h2><div className="bodacc-principle-grid">
      <div><strong>Question et périmètre</strong><span>La décision visée, le territoire, la période et les limites de l’étude.</span></div>
      <div><strong>Éléments vérifiables</strong><span>Les sources, les dates, les définitions et les constats soutenus par les données.</span></div>
      <div><strong>Hypothèses séparées</strong><span>Les interprétations et pistes à confirmer, clairement distinguées des faits établis.</span></div>
      <div><strong>Décisions possibles</strong><span>Les options, les risques, les inconnues et les prochaines vérifications utiles.</span></div>
    </div></section>
    <section className="concept-principles"><h2>Une méthode, pas une promesse de certitude</h2><p>La méthode aide à mieux décider ; elle ne garantit ni l’exactitude absolue des sources, ni la réussite commerciale. La collecte exhaustive, l’actualisation automatisée et la génération complète d’études ne doivent être annoncées que si elles sont effectivement opérationnelles.</p><div className="route-actions"><Link className="search-submit concept-cta" href="/developpement-commercial/etudes-de-marche/sources">Voir les familles de sources ↗</Link><Link className="search-submit concept-cta" href="/developpement-commercial/prospection/ciblage">Relier l’analyse au ciblage ↗</Link></div></section>
    <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/developpement-commercial">Développement commercial</Link><Link href="/faq">FAQ</Link></footer>
  </main>;
}
