import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
  title: "Préparer une réponse à un appel d’offres — MajestiOS",
  description: "Comprendre un appel d’offres et organiser les étapes d’une réponse.",
};

export default function Page() {
  return (
    <main className="public-site concept-page">
      <PublicHeader />
      <section className="how-section concept-hero">
        <div>
          <span className="section-label">DÉVELOPPEMENT COMMERCIAL</span>
          <h1>Comprenez la demande.<br /><em>Préparez votre réponse.</em></h1>
          <p>Répondre à un appel d’offres demande du temps et de l’organisation. MajestiOS prévoit un parcours pour vous aider à comprendre ce qui est demandé, vérifier si le marché vous convient et préparer les documents nécessaires.</p>
        </div>
      </section>
      <section className="concept-grid">
        <article><span>01 · LIRE</span><h2>Comprendre l’offre</h2><p>Repérer le besoin de l’acheteur, les conditions à respecter et les documents demandés.</p></article>
        <article><span>02 · ÉVALUER</span><h2>Vérifier si vous pouvez répondre</h2><p>Comparer les attentes avec les compétences, les moyens, les références et le temps dont dispose votre entreprise.</p></article>
        <article><span>03 · PRÉPARER</span><h2>Rassembler les pièces</h2><p>Établir la liste des documents à fournir, des questions à poser et des dates à respecter.</p></article>
        <article><span>04 · SUIVRE</span><h2>Ne pas oublier une étape</h2><p>Noter les décisions prises, les pièces manquantes et les prochaines actions à effectuer.</p></article>
      </section>
      <section className="concept-principles">
        <h2>Où consulter les offres ?</h2>
        <p>Les appels d’offres publics affichés sur le site proviennent actuellement d’une source reliée au BOAMP. Les offres privées dépendent encore des sources qui pourront être reliées. Vérifiez toujours les informations sur le site officiel de l’acheteur.</p>
        <div className="route-actions">
          <Link className="search-submit concept-cta" href="/opportunites/marches-publics">Voir les appels d’offres publics ↗</Link>
          <Link className="search-submit concept-cta" href="/opportunites/marches-prives">Voir les appels d’offres privés ↗</Link>
        </div>
        <p><strong>État actuel :</strong> cette page présente le parcours prévu. MajestiOS ne dépose pas de candidature à votre place et ne remplace pas la lecture du dossier officiel.</p>
        <Link className="search-submit concept-cta" href="/faq#accompagnement-appels-offres">Questions fréquentes sur les appels d’offres ↗</Link>
      </section>
    </main>
  );
}
