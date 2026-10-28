import Link from "next/link";
import SiteHeader from "@/components/navigation/site-header";
import SiteFooter from "@/components/navigation/site-footer";

export const metadata = {
  title: "Explorer les opportunités — MajestiOS",
  description: "Explorez les marchés publics, les opportunités privées, les événements concernant les entreprises et les pistes de reprise ou de cession.",
};

const categories = [
  { title: "Marchés publics", status: "Recherche prototype disponible", text: "Consultez la recherche BOAMP proposée sur la page d'accueil. Vérifiez toujours les critères, les échéances et l'avis sur sa source officielle.", href: "/#recherche", action: "Accéder à la recherche" },
  { title: "Opportunités privées", status: "Rubrique en préparation", text: "La rubrique est destinée aux consultations, besoins et opportunités privées dont la diffusion est autorisée. Le catalogue réel n'est pas encore raccordé.", href: "/appels-offres-prives", action: "Comprendre la rubrique" },
  { title: "Radar des entreprises", status: "Fonction cible", text: "Préparer une recherche d'entreprises récemment créées ou concernées par certains événements économiques, par secteur et zone géographique.", href: "/opportunites/radar-entreprises", action: "Découvrir le radar" },
  { title: "Business : achat et cession", status: "Fonction cible", text: "Explorer la vision de MajestiOS pour les entreprises à reprendre, les fonds de commerce, les cessions et la recherche de repreneurs.", href: "/opportunites/business", action: "Découvrir Business" },
];

export default function OpportunitiesPage() {
  return <main className="public-site concept-page">
    <SiteHeader />
    <section className="how-section concept-hero"><div><span className="section-label">EXPLORER</span><h1>Les opportunités, <em>au même endroit.</em></h1><p>MajestiOS vise à rapprocher plusieurs familles d'informations professionnelles. Chaque rubrique indique son périmètre et son niveau de disponibilité : un avis public, un signal d'entreprise et une annonce privée ne sont pas la même chose.</p></div></section>
    <section className="feature-sections opportunity-hub" aria-label="Familles d'opportunités">
      {categories.map(item => <article key={item.title}><span className="feature-status">{item.status}</span><h2>{item.title}</h2><p>{item.text}</p><Link className="faq-secondary" href={item.href}>{item.action} →</Link></article>)}
    </section>
    <section className="concept-principles"><h2>Comment exploiter une opportunité ?</h2><p>Une information n'est qu'un point de départ. Il faut vérifier sa source et sa date, comprendre le contexte, déterminer si elle correspond à son activité, puis décider d'une action adaptée. La cible de MajestiOS est de faciliter cette chaîne sans confondre une donnée publiée avec une opportunité garantie.</p><Link className="search-submit concept-cta" href="/comment-et-pourquoi">Comprendre la méthode MajestiOS</Link></section>
    <SiteFooter />
  </main>;
}
