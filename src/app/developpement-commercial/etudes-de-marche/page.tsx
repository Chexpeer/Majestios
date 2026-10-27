import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
  title: "Études de marché — MajestiOS",
  description: "Mieux comprendre un marché, ses clients, ses concurrents et les occasions de développement.",
};

export default function Page() {
  return (
    <main className="public-site concept-page">
      <PublicHeader />
      <section className="how-section concept-hero">
        <div>
          <span className="section-label">DÉVELOPPEMENT COMMERCIAL</span>
          <h1>Comprenez votre marché<br /><em>avant de décider.</em></h1>
          <p>Une étude de marché aide à mieux connaître les clients possibles, les concurrents et les tendances d’un secteur. Elle doit s’appuyer sur des informations que l’on peut retrouver et vérifier.</p>
        </div>
      </section>
      <section className="concept-grid">
        <article><span>01 · CADRER</span><h2>Préciser votre question</h2><p>Quel marché voulez-vous comprendre ? Dans quelle région ? Et quelle décision souhaitez-vous préparer ?</p></article>
        <article><span>02 · RECHERCHER</span><h2>Réunir les informations</h2><p>Rassembler des sources utiles, noter leur date et vérifier ce qu’elles permettent réellement de conclure.</p></article>
        <article><span>03 · COMPARER</span><h2>Comprendre les différences</h2><p>Comparer les types de clients, les concurrents, les prix ou les tendances, selon les données disponibles.</p></article>
        <article><span>04 · DÉCIDER</span><h2>Préparer les prochaines étapes</h2><p>Faire ressortir les possibilités, les risques, les questions sans réponse et les vérifications à poursuivre.</p></article>
      </section>
      <section className="concept-principles">
        <h2>Que doit contenir une étude utile ?</h2>
        <ul>
          <li>La question de départ et l’objectif recherché.</li>
          <li>La zone et la période étudiées.</li>
          <li>Les sources consultées et leurs dates.</li>
          <li>Les faits confirmés, les estimations et les hypothèses, bien séparés.</li>
          <li>Les concurrents, les possibilités et les risques à examiner.</li>
          <li>Une synthèse claire pour préparer une décision.</li>
        </ul>
        <p><strong>État actuel :</strong> cette page décrit le service envisagé. Le moteur complet d’étude de marché n’est pas encore annoncé comme opérationnel.</p>
        <Link className="search-submit concept-cta" href="/developpement-commercial">Voir les services commerciaux ↗</Link>
        <Link className="search-submit concept-cta" href="/faq#etudes-de-marche">Questions fréquentes sur les études de marché ↗</Link>
      </section>
    </main>
  );
}
