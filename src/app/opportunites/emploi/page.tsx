import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
  title: "Emploi et missions professionnelles — MajestiOS",
  description: "Un espace pour distinguer offres d’emploi et missions professionnelles, vérifier les informations et préparer une démarche adaptée."
};

const pathways = [
  { number: "01", title: "Offres d’emploi", text: "Examiner l’employeur, le poste, le contrat, les critères et les conditions avant de préparer une candidature.", href: "/opportunites/emploi/offres", action: "Comprendre une offre" },
  { number: "02", title: "Missions professionnelles", text: "Qualifier un besoin ponctuel par son périmètre, ses livrables, son calendrier et son cadre contractuel.", href: "/opportunites/emploi/missions", action: "Qualifier une mission" },
  { number: "03", title: "Métiers et compétences", text: "Explorer les métiers et compétences utiles pour mieux comprendre les besoins et préparer une évolution professionnelle.", href: "/opportunites/emploi/metiers", action: "Explorer les métiers" },
  { number: "04", title: "Conseils pratiques", text: "Retrouver des repères pour préparer une candidature ou structurer un recrutement sans confondre conseils et garantie de résultat.", href: "/opportunites/emploi/conseils", action: "Consulter les conseils" }
];

export default function EmploiMissionsPage() {
  return <main className="public-site concept-page"><PublicHeader />
    <section className="how-section concept-hero"><div><span className="section-label">OPPORTUNITÉS · EMPLOI ET COMPÉTENCES</span><h1>Des parcours professionnels <em>mieux qualifiés.</em></h1><p>Une offre d’emploi et une mission ne se lisent pas de la même façon. MajestiOS distingue les deux parcours et met l’accent sur la fiabilité de la source, la clarté des conditions et l’adéquation entre besoin et compétences.</p><p>Le catalogue d’annonces ne doit être alimenté que par des données disponibles et vérifiables. Aucune offre fictive n’est présentée comme une opportunité réelle.</p></div></section>
    <section className="concept-principles"><span className="section-label">CHOISIR SON PARCOURS</span><h2>Quatre entrées, des objectifs différents.</h2><div className="results-list">{pathways.map((item)=><article className="result-card" key={item.href}><div className="result-main"><span className="result-category">PARCOURS {item.number}</span><h3>{item.title}</h3><p>{item.text}</p></div><div className="result-actions"><Link className="result-action" href={item.href}>{item.action} →</Link></div></article>)}</div></section>
    <section className="concept-principles"><span className="section-label">GARDE-FOUS</span><h2>La confiance avant la candidature.</h2><div className="bodacc-principle-grid"><div><strong>Source attribuée</strong><span>Retrouver l’émetteur, la date de publication et le statut de l’annonce avant de s’engager.</span></div><div><strong>Conditions explicites</strong><span>Signaler les informations manquantes plutôt que supposer une rémunération, un contrat ou un besoin.</span></div><div><strong>Données personnelles protégées</strong><span>Ne pas demander de CV ni de coordonnées par un parcours provisoire non sécurisé.</span></div></div></section>
    <section className="concept-principles"><h2>Un catalogue honnête, pas des annonces de démonstration.</h2><p>À ce stade, ces pages structurent la méthode et les parcours. Elles ne signifient pas qu’un flux exhaustif d’offres d’emploi ou de missions est connecté. Les fonctionnalités de dépôt, de candidature et de conservation de CV ne doivent être annoncées comme opérationnelles qu’après leur mise en place et leurs contrôles.</p><p><Link href="/opportunites">Revenir à toutes les opportunités →</Link></p></section>
    <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/faq">FAQ</Link><small>Détecter · Qualifier · Identifier · Contacter · Transformer · Capitaliser</small></footer>
  </main>;
}
