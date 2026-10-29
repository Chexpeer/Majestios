import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
 title: "Rejoindre le réseau MajestiOS",
 description: "Découvrir les principes de contribution au réseau professionnel et les informations à préparer avant une mise en relation."
};

const contributions = [
 {title:"Entreprise",text:"Présenter son activité, sa zone d’intervention, ses capacités et les types de collaboration recherchés."},
 {title:"Expert ou indépendant",text:"Décrire les compétences réellement mobilisables, les secteurs connus et les modalités d’intervention."},
 {title:"Partenaire de développement",text:"Préciser la complémentarité proposée, les publics concernés et le cadre de coopération envisagé."},
 {title:"Contributeur ou relais local",text:"Partager des informations utiles en indiquant leur source, leur date et les éventuelles limites de diffusion."}
];

export default function RejoindreReseauPage() {
 return <main className="public-site concept-page"><PublicHeader />
  <section className="how-section concept-hero"><div><span className="section-label">RÉSEAUX · CONTRIBUER</span><h1>Rejoindre un réseau utile, <em>avec une contribution claire.</em></h1><p>MajestiOS vise à faire émerger des complémentarités professionnelles autour de besoins concrets. Une présentation utile explique ce que vous faites, ce que vous pouvez apporter et dans quelles conditions une coopération aurait du sens.</p></div></section>
  <section className="concept-principles"><span className="section-label">TYPES DE CONTRIBUTION</span><h2>Quelle valeur pouvez-vous apporter au réseau ?</h2><div className="results-list">{contributions.map((item,i)=><article className="result-card" key={item.title}><div className="result-main"><span className="result-category">PROFIL {String(i+1).padStart(2,"0")}</span><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div></section>
  <section className="concept-principles"><h2>Préparer une présentation professionnelle.</h2><ul><li>Identité professionnelle et coordonnées nécessaires au contact souhaité.</li><li>Activité, compétences, territoire et types de projets pertinents.</li><li>Capacités, références ou qualifications que vous pouvez effectivement justifier.</li><li>Modalités de collaboration et préférences de communication.</li><li>Informations que vous acceptez de partager et limites de confidentialité.</li></ul><p>Ne transmettez pas de pièces sensibles ni de données de tiers sans nécessité et autorisation appropriée.</p></section>
  <section className="concept-principles"><h2>État du parcours d’inscription.</h2><p>Cette page présente les critères de contribution ; elle ne constitue pas un formulaire d’inscription actif. L’ouverture des profils doit être précédée de règles explicites sur la vérification, la visibilité, le consentement, l’accès aux coordonnées, la conservation et la suppression des données.</p><p><Link href="/reseaux">Retour à la méthode de réseautage intelligent →</Link></p></section>
  <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/confidentialite">Confidentialité</Link><Link href="/faq">FAQ</Link></footer>
 </main>;
}
