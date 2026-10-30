import Link from "next/link";
import TenderSearchResults from "@/components/tender-search-results";

type Props = {
  searchParams: Promise<{ q?: string; location?: string; type?: string }>;
};

export const metadata = {
  title: "Appels d’offres publics — MajestiOS",
  description: "Rechercher les consultations publiques ouvertes et accéder à des dossiers de qualification par famille de marché."
};

const categories = [
  { title: "Travaux", href: "/opportunites/marches-publics/appels-offres/travaux", text: "Chantiers, construction, rénovation et travaux spécialisés." },
  { title: "Services", href: "/opportunites/marches-publics/appels-offres/services", text: "Prestations, services récurrents et missions externalisées." },
  { title: "Fournitures", href: "/opportunites/marches-publics/appels-offres/fournitures", text: "Matériel, équipements, consommables et livraisons." }
];

export default async function AppelsOffresPage({ searchParams }: Props) {
  const filters = await searchParams;
  return <main className="public-site concept-page domain-opportunites" data-dossier-symbol="§">
    <section className="how-section concept-hero"><div>
      <span className="section-label">OPPORTUNITÉS PUBLIQUES · DOSSIER</span>
      <h1>Appels d’offres <em>publics</em></h1>
      <p>Recherchez les consultations ouvertes, puis approfondissez le dossier correspondant à votre activité. Les résultats proviennent du flux BOAMP lorsqu’il est accessible ; aucune annonce fictive ne remplace une source indisponible.</p>
      <form className="tender-search home-tender-search" action="/opportunites/marches-publics/appels-offres" method="get" aria-label="Recherche d’appels d’offres publics">
        <label className="search-field"><span>Mots-clés</span><input name="q" placeholder="Nettoyage, travaux, informatique…" maxLength={160} defaultValue={filters.q ?? ""} /></label>
        <label className="search-field"><span>Département</span><input name="location" placeholder="Ex. : 68" maxLength={3} defaultValue={filters.location ?? ""} /></label>
        <label className="search-field"><span>Catégorie</span><select name="type" defaultValue={filters.type ?? "all"}><option value="all">Toutes</option><option value="Travaux">Travaux</option><option value="Services">Services</option><option value="Fournitures">Fournitures</option></select></label>
        <button className="search-submit" type="submit">Rechercher <span aria-hidden="true">↗</span></button>
      </form>
      <div className="hero-actions"><Link className="button-secondary" href="/opportunites/marches-publics">← Retour aux marchés publics</Link></div>
    </div></section>
    <TenderSearchResults />
    <section className="concept-principles"><span className="section-label">APPROFONDIR PAR FAMILLE</span>
      <div className="results-list">{categories.map((item) => <article className="result-card" key={item.href}>
        <div className="result-main"><h2>{item.title}</h2><p>{item.text}</p></div>
        <div className="result-actions"><Link className="result-action" href={item.href}>Ouvrir le dossier {item.title} →</Link></div>
      </article>)}</div>
    </section>
  </main>;
}
