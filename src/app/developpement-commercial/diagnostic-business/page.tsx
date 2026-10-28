import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
  title: "Diagnostic Business — MajestiOS",
  description:
    "Faites le point sur votre activité, vos objectifs commerciaux et vos priorités de développement.",
};

const axes = [
  {
    number: "01",
    title: "Votre activité",
    text: "Décrivez votre offre, vos clients actuels, votre zone d’intervention et ce qui vous distingue.",
  },
  {
    number: "02",
    title: "Vos objectifs",
    text: "Précisez si votre priorité est de trouver de nouveaux clients, de nouveaux marchés, des partenaires ou des fournisseurs.",
  },
  {
    number: "03",
    title: "Vos points de blocage",
    text: "Repérez les difficultés : manque de prospects qualifiés, connaissance insuffisante du marché, visibilité ou temps disponible.",
  },
  {
    number: "04",
    title: "Vos prochaines actions",
    text: "Transformez le constat en pistes à vérifier : secteurs à explorer, entreprises à étudier et démarches commerciales à préparer.",
  },
];

export default function DiagnosticBusinessPage() {
  return (
    <main className="public-site concept-page">
      <PublicHeader />
      <section className="how-section concept-hero">
        <div>
          <span className="section-label">DÉVELOPPEMENT COMMERCIAL · DIAGNOSTIC</span>
          <h1>Faire le point sur votre activité.<br /><em>Choisir les bonnes priorités.</em></h1>
          <p>
            Un diagnostic business aide à clarifier votre situation commerciale avant
            de lancer de nouvelles actions. Cette page vous propose un cadre de réflexion ;
            elle ne prétend pas réaliser automatiquement une analyse personnalisée.
          </p>
          <Link className="search-submit concept-cta" href="/business">
            Explorer les informations publiques sur les entreprises ↗
          </Link>
        </div>
      </section>
      <section className="concept-grid" aria-label="Étapes du diagnostic business">
        {axes.map((axis) => (
          <article key={axis.number}>
            <span>{axis.number} · DIAGNOSTIC</span>
            <h2>{axis.title}</h2>
            <p>{axis.text}</p>
          </article>
        ))}
      </section>
      <section className="concept-principles">
        <h2>Du constat à une action vérifiable</h2>
        <p>
          Pour chaque priorité, notez l’hypothèse à vérifier, les informations manquantes,
          la source à consulter et l’action suivante. Les conclusions doivent s’appuyer
          sur des informations vérifiables, et non sur des suppositions.
        </p>
        <p><strong>État actuel :</strong> le diagnostic guidé et la génération automatique d’un plan d’action restent à développer. Aucun résultat n’est calculé ni enregistré sur cette page.</p>
        <div className="route-actions">
          <Link className="search-submit concept-cta" href="/developpement-commercial/prospection">Préparer la prospection ↗</Link>
          <Link className="search-submit concept-cta" href="/developpement-commercial/etudes-de-marche">Étudier votre marché ↗</Link>
          <Link className="search-submit concept-cta" href="/developpement-commercial">Retour à l’intelligence commerciale ↗</Link>
        </div>
      </section>
    </main>
  );
}
