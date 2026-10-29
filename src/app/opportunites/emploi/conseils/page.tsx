import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
 title: "Conseils emploi et recrutement — MajestiOS",
 description: "Repères pratiques pour préparer une candidature ou cadrer un recrutement avec des critères explicites."
};

const tracks = [
 {title:"Préparer une candidature",text:"Relier les expériences aux critères annoncés, illustrer les compétences par des réalisations et vérifier les pièces réellement demandées."},
 {title:"Évaluer une opportunité",text:"Contrôler l’identité de l’émetteur, le contenu du poste, les conditions, le lieu, les échéances et la cohérence des échanges."},
 {title:"Cadrer un recrutement",text:"Définir les missions, les critères indispensables, les compétences qui peuvent s’acquérir et les étapes de décision."},
 {title:"Conduire un échange utile",text:"Préparer des questions liées au travail réel, aux responsabilités, à l’accompagnement et aux conditions d’exercice."}
];

export default function ConseilsPage() {
 return <main className="public-site concept-page"><PublicHeader />
  <section className="how-section concept-hero"><div><span className="section-label">EMPLOI · CONSEILS PRATIQUES</span><h1>Des démarches plus claires, <em>des critères plus justes.</em></h1><p>Une candidature ou un recrutement gagne en qualité lorsque les attentes sont explicites, les informations vérifiées et les décisions fondées sur les exigences réelles du poste.</p></div></section>
  <section className="concept-principles"><span className="section-label">REPÈRES OPÉRATIONNELS</span><h2>Quatre situations à préparer.</h2><div className="results-list">{tracks.map((d,i)=><article className="result-card" key={d.title}><div className="result-main"><span className="result-category">REPÈRE {String(i+1).padStart(2,"0")}</span><h3>{d.title}</h3><p>{d.text}</p></div></article>)}</div></section>
  <section className="concept-principles"><h2>La prudence fait partie de la méthode.</h2><p>Ne transmettez pas de données personnelles à un interlocuteur non vérifié. Une offre urgente, des frais demandés pour accéder à un emploi ou des demandes disproportionnées de documents doivent conduire à vérifier l’émetteur par un canal indépendant.</p><p>Ces repères sont généraux : ils ne remplacent pas les règles applicables à chaque contrat ni un conseil juridique adapté. Les fonctionnalités de dépôt d’offres, de candidature et de stockage de CV ne sont pas annoncées comme actives sans parcours sécurisé opérationnel.</p><p><Link href="/opportunites/emploi/offres">Lire la grille de qualification des offres →</Link></p></section>
  <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/opportunites/emploi">Emploi et missions</Link><Link href="/faq">FAQ</Link></footer>
 </main>;
}
