import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
  title: "E-réputation — MajestiOS",
  description: "Comprendre les avis et les mentions en ligne qui concernent une entreprise.",
};

export default function Page() {
  return (
    <main className="public-site concept-page">
      <PublicHeader />
      <section className="how-section concept-hero">
        <div>
          <span className="section-label">DÉVELOPPEMENT COMMERCIAL</span>
          <h1>Comprenez ce qui se dit<br /><em>sur votre entreprise.</em></h1>
          <p>L’e-réputation correspond à l’image d’une entreprise sur Internet. MajestiOS prévoit d’aider à repérer les avis et les mentions utiles, à retrouver leur source et à préparer une réponse si nécessaire.</p>
        </div>
      </section>
      <section className="concept-grid">
        <article><span>01 · CHOISIR</span><h2>Définir ce que l’on surveille</h2><p>Préciser le nom de l’entreprise, les sujets importants et les sites que l’on souhaite suivre.</p></article>
        <article><span>02 · REPÉRER</span><h2>Voir les nouvelles mentions</h2><p>Identifier les nouveaux avis ou messages, dans la limite des sources réellement accessibles.</p></article>
        <article><span>03 · VÉRIFIER</span><h2>Lire le contexte</h2><p>Retrouver le lien d’origine, la date et le contenu avant de tirer une conclusion.</p></article>
        <article><span>04 · RÉPONDRE</span><h2>Préparer une action</h2><p>Préparer une réponse ou une alerte, puis laisser une personne décider de la suite.</p></article>
      </section>
      <section className="concept-principles">
        <h2>Une information doit pouvoir être vérifiée</h2>
        <ul>
          <li>Conserver le lien vers la publication d’origine.</li>
          <li>Ne pas confondre une information et son interprétation.</li>
          <li>Respecter les règles d’accès et d’utilisation des sites consultés.</li>
          <li>Faire valider les réponses avant leur publication.</li>
        </ul>
        <p><strong>État actuel :</strong> cette page présente le service envisagé. La surveillance automatique continue n’est pas encore annoncée comme active.</p>
        <Link className="search-submit concept-cta" href="/developpement-commercial">Voir les services commerciaux ↗</Link>
        <Link className="search-submit concept-cta" href="/comprendre/faq">Questions fréquentes sur les sources et l’IA ↗</Link>
      </section>
    </main>
  );
}
