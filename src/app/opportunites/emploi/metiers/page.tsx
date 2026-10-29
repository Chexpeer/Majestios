import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
  title: "Métiers et compétences — MajestiOS",
  description: "Structurer une lecture des métiers par activités, compétences, contraintes et environnements professionnels."
};

const dimensions = [
  { title: "Activités réelles", text: "Décrire ce que la personne réalise concrètement, les tâches récurrentes, les décisions prises et les résultats attendus." },
  { title: "Compétences mobilisées", text: "Séparer les savoir-faire indispensables, les connaissances utiles, les habilitations et les compétences qui peuvent s’acquérir." },
  { title: "Conditions d’exercice", text: "Préciser le contexte, les outils, les horaires, les déplacements, le travail en équipe et les contraintes du poste." },
  { title: "Évolution et transférabilité", text: "Repérer les compétences communes à plusieurs métiers sans supposer qu’un intitulé équivalent implique les mêmes exigences." }
];

export default function MetiersPage() {
 return <main className="public-site concept-page"><PublicHeader />
  <section className="how-section concept-hero"><div><span className="section-label">EMPLOI · MÉTIERS ET COMPÉTENCES</span><h1>Décrire les compétences, <em>pas seulement l’intitulé du métier.</em></h1><p>Un intitulé de poste varie selon les entreprises et les secteurs. Pour rapprocher une personne d’une opportunité, il faut regarder les activités réellement exercées, les compétences démontrées et les conditions de travail.</p></div></section>
  <section className="concept-principles"><span className="section-label">GRILLE DE LECTURE</span><h2>Quatre dimensions à examiner.</h2><div className="results-list">{dimensions.map((d,i)=><article className="result-card" key={d.title}><div className="result-main"><span className="result-category">DIMENSION {String(i+1).padStart(2,"0")}</span><h3>{d.title}</h3><p>{d.text}</p></div></article>)}</div></section>
  <section className="concept-principles"><h2>Rapprocher sans tirer de conclusion hâtive.</h2><p>Un profil, un diplôme ou un intitulé seul ne prouve pas l’adéquation à un poste. Les compétences et habilitations doivent être vérifiées au regard des critères réels. Les informations sensibles ou non nécessaires ne doivent pas servir de raccourci dans la qualification.</p><p>Cette page expose une méthode de lecture ; elle ne constitue pas encore un référentiel exhaustif de métiers ni un moteur automatisé de correspondance.</p><p><Link href="/opportunites/emploi/offres">Consulter la méthode de lecture des offres →</Link></p></section>
  <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/opportunites/emploi">Emploi et missions</Link><Link href="/faq">FAQ</Link></footer>
 </main>;
}
