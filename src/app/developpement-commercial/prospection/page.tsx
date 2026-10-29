import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
  title: "Prospection commerciale — MajestiOS",
  description: "Préparer sa recherche de clients et organiser les prochaines actions commerciales.",
};

export default function Page() {
  return (
    <main className="public-site concept-page">
      <PublicHeader />
      <section className="how-section concept-hero">
        <div>
          <span className="section-label">DÉVELOPPEMENT COMMERCIAL</span>
          <h1>Recherchez les bons clients.<br /><em>Préparez le bon contact.</em></h1>
          <p>La prospection consiste à trouver les entreprises qui pourraient avoir besoin de vos services, puis à préparer une prise de contact utile. MajestiOS prévoit de vous aider à organiser ce travail, étape par étape.</p>
        </div>
      </section>
      <section className="concept-grid">
        <article><span>01 · DÉFINIR</span><h2>Choisir sa cible</h2><p>Précisez votre activité, les entreprises recherchées, leur secteur, leur taille et la zone géographique visée.</p></article>
        <article><span>02 · RECHERCHER</span><h2>Trouver des entreprises</h2><p>Rechercher des entreprises à partir de sources accessibles et garder un lien pour vérifier les informations.</p></article>
        <article><span>03 · COMPRENDRE</span><h2>Identifier le bon contact</h2><p>Repérer, lorsque l’information est disponible, la personne ou le service à contacter. Les noms et coordonnées doivent être vérifiés.</p></article>
        <article><span>04 · AGIR</span><h2>Préparer la prise de contact</h2><p>Définir pourquoi vous contactez l’entreprise, ce que vous souhaitez lui demander et quelle sera la prochaine étape.</p></article>
      </section>
      <section className="concept-principles">
        <h2>Ce qui est prévu, et ce qui reste à faire</h2>
        <p>À terme, MajestiOS doit aider à rechercher des entreprises, à mieux comprendre leurs besoins possibles et à organiser les relances.</p>
        <p><strong>État actuel :</strong> cette page présente le service envisagé. La recherche automatique de prospects, la vérification enrichie des contacts et le suivi complet ne sont pas encore annoncés comme opérationnels.</p>
        <Link className="search-submit concept-cta" href="/developpement-commercial">Retour aux services commerciaux ↗</Link>
        <Link className="search-submit concept-cta" href="/comprendre/faq">Questions fréquentes ↗</Link>
        <Link className="search-submit concept-cta" href="/opportunites/radar-entreprises">Explorer les signaux d’entreprise ↗</Link>
        <Link className="search-submit concept-cta" href="/developpement-commercial/etudes-de-marche">Mieux comprendre son marché ↗</Link>
        <Link className="search-submit concept-cta" href="/reseaux">Développer son réseau professionnel ↗</Link>
      </section>
    </main>
  );
}
