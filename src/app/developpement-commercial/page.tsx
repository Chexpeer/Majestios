import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
  title: "Développement commercial — MajestiOS",
  description: "Des outils pour trouver des clients, comprendre un marché et préparer les prochaines actions commerciales.",
};

type Props = { searchParams: Promise<{ q?: string }> };

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const query = (params.q ?? "").trim().slice(0, 160);
  return (
    <main className="public-site concept-page">
      <PublicHeader />
      <section className="how-section concept-hero">
        <div>
          <span className="section-label">DÉVELOPPEMENT COMMERCIAL</span>
          <h1>Trouvez de nouvelles opportunités.<br /><em>Préparez la suite.</em></h1>
          <p>MajestiOS veut aider les professionnels à repérer des occasions de développer leur activité, trouver les bons interlocuteurs et préparer leurs prochaines actions. Les services sont organisés en plusieurs rubriques complémentaires.</p>
        </div>
      </section>
      {query && <section className="concept-principles" role="status"><span className="section-label">VOTRE RECHERCHE</span><h2>Mot-clé demandé : « {query} »</h2><p>Cette rubrique présente les services de développement commercial ; elle ne lance pas encore de recherche transversale dans ces services. Votre mot-clé a été conservé, mais aucune recherche automatisée n’a été exécutée.</p><Link className="search-submit concept-cta" href={`/business?q=${encodeURIComponent(query)}`}>Rechercher ce terme dans les annonces BODACC ↗</Link><Link className="search-submit concept-cta" href={`/appels-offres-publics?q=${encodeURIComponent(query)}`}>Rechercher ce terme dans les marchés publics ↗</Link></section>}
      <section className="concept-grid">
        <article id="prospection">
          <span>01 · TROUVER</span>
          <h2>Prospection commerciale</h2>
          <p>Définir les entreprises que vous souhaitez contacter et préparer une approche adaptée.</p>
          <Link href="/developpement-commercial/prospection">Découvrir la prospection ↗</Link>
        </article>
        <article id="etudes-de-marche">
          <span>02 · COMPRENDRE</span>
          <h2>Études de marché</h2>
          <p>Mieux connaître un secteur, une région, les clients possibles et les concurrents.</p>
          <Link href="/developpement-commercial/etudes-de-marche">Découvrir les études de marché ↗</Link>
        </article>
        <article id="accompagnement-appels-offres">
          <span>03 · PRÉPARER</span>
          <h2>Réponses aux appels d’offres</h2>
          <p>Comprendre une demande et organiser les documents et les étapes d’une candidature.</p>
          <Link href="/developpement-commercial/accompagnement-appels-offres">Voir l’accompagnement prévu ↗</Link>
        </article>
        <article id="ereputation">
          <span>04 · SURVEILLER</span>
          <h2>E-réputation</h2>
          <p>Suivre les avis et les mentions en ligne pour mieux comprendre ce qui se dit d’une entreprise.</p>
          <Link href="/developpement-commercial/e-reputation">Découvrir l’e-réputation ↗</Link>
        </article>
        <article id="diagnostic-business">
          <span>05 · FAIRE LE POINT</span>
          <h2>Diagnostic Business</h2>
          <p>Présenter votre activité, préciser vos objectifs et identifier les sujets à travailler en priorité.</p>
          <Link href="/developpement-commercial/diagnostic-business">Découvrir le diagnostic business ↗</Link>
        </article>
      </section>
      <section className="concept-principles">
        <h2>Des services conçus pour fonctionner ensemble</h2>
        <p>Une opportunité peut conduire à étudier un marché, à trouver les entreprises à contacter puis à préparer une action. L’objectif est de garder les informations utiles au même endroit et de pouvoir retrouver leur origine.</p>
        <p><strong>À savoir :</strong> MajestiOS est encore en développement. Certaines rubriques présentent le fonctionnement prévu ; la recherche automatisée, le suivi commercial complet et la veille continue ne sont pas tous disponibles.</p>
        <div className="route-actions">
          <Link className="search-submit concept-cta" href="/appels-offres-publics">Appels d’offres publics ↗</Link>
          <Link className="search-submit concept-cta" href="/appels-offres-prives">Appels d’offres privés ↗</Link>
          <Link className="search-submit concept-cta" href="/reseaux">Réseaux professionnels ↗</Link>
          <Link className="search-submit concept-cta" href="/faq#decouvrir">Questions fréquentes ↗</Link>
        </div>
      </section>
    </main>
  );
}
