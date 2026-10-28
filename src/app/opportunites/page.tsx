import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = { title: "Explorer les opportunités — MajestiOS", description: "Un point d’entrée pour explorer les opportunités professionnelles, les marchés et les entreprises." };

const categories = [
  { number: "01", title: "Marchés publics", text: "Repérer les avis publiés, examiner les critères et vérifier les échéances auprès de la source officielle.", href: "/appels-offres-publics", status: "Recherche publique disponible" },
  { number: "02", title: "Opportunités privées", text: "Découvrir le cadre prévu pour les consultations privées, missions et partenariats diffusés avec autorisation.", href: "/appels-offres-prives", status: "Catalogue en préparation" },
  { number: "03", title: "Radar entreprises", text: "Comprendre comment les signaux de création, développement, reprise et cession pourront aider à détecter des besoins commerciaux.", href: "/opportunites/radar-entreprises", status: "Sources à raccorder" },
  { number: "04", title: "Business : achat et transmission", text: "Explorer le parcours cible pour les projets de cession, reprise ou transmission d'entreprise.", href: "/business", status: "Parcours de cadrage" },
  { number: "05", title: "Emploi et missions", text: "Consulter le cadre de publication prévu pour les offres d'emploi, missions indépendantes et collaborations.", href: "/offres-emploi", status: "Rubrique en préparation" },
];

export default function OpportunitiesHubPage() {
  return <main className="public-site concept-page"><PublicHeader />
    <section className="how-section concept-hero"><div><span className="section-label">EXPLORER · QUALIFIER · AGIR</span><h1>Les opportunités ne se limitent pas aux <em>annonces.</em></h1><p>MajestiOS vise à réunir plusieurs types de signaux professionnels dans un même parcours : repérer une occasion, comprendre son contexte, identifier les acteurs concernés et préparer la prochaine action commerciale.</p></div></section>
    <section className="opportunity-hub-grid">{categories.map((item)=><article key={item.number}><span className="opportunity-hub-number">{item.number}</span><span className="section-label">{item.status}</span><h2>{item.title}</h2><p>{item.text}</p><Link href={item.href}>Explorer cette rubrique ↗</Link></article>)}</section>
    <section className="concept-principles"><h2>Un même fil conducteur</h2><p>Entreprise → Interlocuteur → Décideur. Une annonce n'est qu'une source possible : la valeur recherchée vient de la qualification de l'information et de la préparation d'une action pertinente.</p><Link className="search-submit concept-cta" href="/intelligence-commerciale">Découvrir l’intelligence commerciale ↗</Link><Link className="search-submit concept-cta" href="/faq">Consulter la FAQ ↗</Link></section>
    <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><nav aria-label="Liens de pied de page"><Link href="/comment-et-pourquoi">Le concept</Link><Link href="/reseaux">Réseaux professionnels</Link><Link href="/faq">FAQ</Link></nav><small>© MajestiOS · Site en construction</small></footer>
  </main>;
}
