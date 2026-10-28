import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
  title: "Réseaux professionnels — MajestiOS",
  description: "Découvrir les types de partenaires qui peuvent aider au développement d’une activité professionnelle.",
};

type Props = { searchParams: Promise<{ q?: string }> };

export default async function NetworksPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = (params.q ?? "").trim().slice(0, 160);
  return (
    <main className="public-site concept-page">
      <PublicHeader />
      <section className="how-section concept-hero">
        <div>
          <span className="section-label">RÉSEAUX PROFESSIONNELS</span>
          <h1>Les bonnes compétences.<br /><em>Les bonnes collaborations.</em></h1>
          <p>MajestiOS veut faciliter la recherche de partenaires utiles au développement d’une entreprise. Une collaboration proposée doit toujours être vérifiée et acceptée par les personnes concernées.</p>
        </div>
      </section>
      {query && <section className="concept-principles" role="status"><span className="section-label">VOTRE RECHERCHE</span><h2>Mot-clé demandé : « {query} »</h2><p>L’annuaire de partenaires n’est pas encore opérationnel. Le mot-clé a été conservé, mais aucune recherche de partenaires ni mise en relation n’a été effectuée.</p><Link className="search-submit concept-cta" href={`/business?q=${encodeURIComponent(query)}`}>Rechercher ce terme dans les annonces BODACC ↗</Link></section>}
      <section className="concept-grid">
        <article><span>01 · CONSEIL</span><h2>Experts et consultants</h2><p>Des spécialistes qui peuvent aider à comprendre un marché, résoudre un problème ou préparer un projet.</p></article>
        <article><span>02 · OUTILS</span><h2>Partenaires technologiques</h2><p>Des entreprises qui proposent des logiciels, des services numériques ou des outils complémentaires.</p></article>
        <article><span>03 · MISSIONS</span><h2>Professionnels de terrain</h2><p>Des personnes ou entreprises pouvant intervenir sur une mission, après vérification du besoin et des compétences.</p></article>
        <article><span>04 · ALLIANCES</span><h2>Entreprises partenaires</h2><p>Des entreprises qui souhaitent travailler ensemble, partager des compétences ou répondre à un besoin commun.</p></article>
      </section>
      <section className="concept-principles">
        <h2>La confiance avant tout</h2>
        <p>Avant une mise en relation, il faudra pouvoir vérifier les informations utiles, préciser le besoin et obtenir l’accord des personnes concernées. Cette page présente les collaborations recherchées : elle ne constitue pas encore un annuaire de partenaires déjà validés.</p>
        <Link className="search-submit concept-cta" href="/business">Présenter mon besoin professionnel ↗</Link>
        <Link className="search-submit concept-cta" href="/faq#reseaux">Questions fréquentes sur les réseaux ↗</Link>
      </section>
    </main>
  );
}
