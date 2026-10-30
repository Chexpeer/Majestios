import Link from "next/link";
import SiteHub from "@/components/site-hub";

export const metadata = {
  title: "Appels d’offres publics — MajestiOS",
  description: "Dossier dédié à la recherche et à la qualification des appels d’offres publics."
};

const categories = [
  { title: "Travaux", href: "/opportunites/marches-publics/appels-offres/travaux", text: "Chantiers, construction, rénovation et travaux spécialisés." },
  { title: "Services", href: "/opportunites/marches-publics/appels-offres/services", text: "Prestations, services récurrents et missions externalisées." },
  { title: "Fournitures", href: "/opportunites/marches-publics/appels-offres/fournitures", text: "Matériel, équipements, consommables et livraisons." }
];

export default function AppelsOffresPage() {
  return <main className="public-site concept-page domain-opportunites" data-dossier-symbol="§">
    <section className="how-section concept-hero"><div>
      <span className="section-label">OPPORTUNITÉS PUBLIQUES · DOSSIER</span>
      <h1>Appels d’offres <em>publics</em></h1>
      <p>Ce dossier ouvre un parcours de qualification avant toute décision de répondre. Choisissez une famille de marchés pour examiner les exigences propres à votre activité.</p>
      <div className="hero-actions"><Link className="button-secondary" href="/opportunites/marches-publics">← Retour aux marchés publics</Link></div>
    </div></section>
    <section className="concept-principles"><span className="section-label">CHOISIR UNE FAMILLE DE MARCHÉS</span>
      <div className="results-list">{categories.map((item) => <article className="result-card" key={item.href}>
        <div className="result-main"><h2>{item.title}</h2><p>{item.text}</p></div>
        <div className="result-actions"><Link className="result-action" href={item.href}>Ouvrir le dossier {item.title} →</Link></div>
      </article>)}</div>
    </section>
  </main>;
}
