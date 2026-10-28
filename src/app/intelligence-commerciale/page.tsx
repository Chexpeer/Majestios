import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
  title: "Intelligence commerciale — MajestiOS",
  description: "Un espace dédié pour transformer les signaux du marché en opportunités commerciales qualifiées.",
};

const modules = [
  {
    number: "01",
    title: "Détecter les opportunités",
    description: "Explorer les marchés publics, les signaux d'entreprises et les opportunités privées dans leurs espaces dédiés.",
    links: [
      { label: "Marchés publics", href: "/appels-offres-publics" },
      { label: "Radar entreprises", href: "/opportunites/radar-entreprises" },
      { label: "Opportunités privées", href: "/appels-offres-prives" },
    ],
  },
  {
    number: "02",
    title: "Comprendre les entreprises",
    description: "Examiner les événements publics liés aux entreprises et accéder aux sources pour vérifier les informations.",
    links: [
      { label: "Recherche BODACC / Business", href: "/business" },
      { label: "Réseaux professionnels", href: "/reseaux" },
    ],
  },
  {
    number: "03",
    title: "Préparer l'action commerciale",
    description: "Organiser la recherche de clients, les études de marché et les prochaines étapes. Les outils avancés seront activés progressivement.",
    links: [
      { label: "Prospection commerciale", href: "/developpement-commercial/prospection" },
      { label: "Études de marché", href: "/developpement-commercial/etudes-de-marche" },
      { label: "E-réputation", href: "/developpement-commercial/e-reputation" },
    ],
  },
];

export default function CommercialIntelligencePage() {
  return (
    <main className="public-site concept-page">
      <PublicHeader />
      <section className="how-section concept-hero">
        <div>
          <span className="section-label">OPPORTUNITY INTELLIGENCE</span>
          <h1>De l'information à <em>l'action commerciale.</em></h1>
          <p>
            MajestiOS relie les signaux du marché, les entreprises, les interlocuteurs
            et les actions commerciales dans un parcours cohérent. Chaque module
            s'ouvre dans sa propre page : cet espace sert de carrefour, pas de page
            qui remplace les outils métier.
          </p>
          <Link className="search-submit concept-cta" href="/opportunites">
            Explorer toutes les opportunités ↗
          </Link>
        </div>
      </section>
      <section className="opportunity-hub-grid" aria-label="Modules d'intelligence commerciale">
        {modules.map((module) => (
          <article key={module.number}>
            <span className="opportunity-hub-number">{module.number}</span>
            <span className="section-label">MODULE MÉTIER</span>
            <h2>{module.title}</h2>
            <p>{module.description}</p>
            <nav className="concept-module-links" aria-label={module.title}>
              {module.links.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label} ↗
                </Link>
              ))}
            </nav>
          </article>
        ))}
      </section>
      <section className="concept-principles">
        <span className="section-label">UN PARCOURS COMMUN</span>
        <h2>Entreprise → Interlocuteur → Décideur</h2>
        <p>
          Une annonce ou un événement n'est qu'un point de départ. L'objectif est
          de vérifier la source, qualifier le contexte, identifier le bon interlocuteur
          lorsque les données le permettent, puis préparer une action pertinente.
        </p>
        <p><strong>État des fonctionnalités :</strong> les pages reliées à des sources actives sont signalées dans leur espace. Les modules encore en préparation restent présentés comme tels ; cette page ne prétend pas qu'ils sont déjà entièrement automatisés.</p>
        <Link className="search-submit concept-cta" href="/developpement-commercial">
          Voir les services de développement commercial ↗
        </Link>
      </section>
    </main>
  );
}
