import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = { title: "Préparer la reprise d’une entreprise — MajestiOS", description: "Structurer un projet de reprise, définir les critères de recherche et organiser les vérifications avant négociation." };

const checks = [
 {title:"Définir une cible réaliste",text:"Préciser le secteur, la zone, la taille, les compétences recherchées, le rôle du repreneur et les moyens financiers mobilisables."},
 {title:"Comprendre l’activité réelle",text:"Examiner les produits et services, les types de clients, la dépendance à quelques donneurs d’ordre, la saisonnalité et les facteurs qui soutiennent les revenus."},
 {title:"Examiner les moyens et les engagements",text:"Vérifier les actifs utiles, les contrats, les équipes, les locaux, les équipements, les dettes et les engagements à reprendre selon les documents accessibles."},
 {title:"Préparer les vérifications",text:"Lister les éléments manquants et organiser les analyses comptables, juridiques, fiscales, sociales et opérationnelles avec des professionnels compétents."},
 {title:"Décider par étapes",text:"Définir les conditions qui permettraient de poursuivre, les risques qui imposeraient de renoncer et les validations nécessaires avant tout engagement ferme."}
];

export default function AcheterEntreprisePage() {
 return <main className="public-site concept-page"><PublicHeader />
  <section className="how-section concept-hero"><div><span className="section-label">ACHAT ET CESSION · REPRISE</span><h1>Reprendre une entreprise commence par <em>un projet clairement défini.</em></h1><p>Une annonce ou un signal de transmission peut ouvrir une piste, mais ne remplace pas l’étude de l’entreprise. La préparation consiste à préciser les critères de recherche, puis à vérifier progressivement l’activité, les moyens, les engagements et les risques.</p></div></section>
  <section className="concept-principles"><span className="section-label">GRILLE DE PRÉPARATION</span><h2>Cinq contrôles pour organiser la reprise.</h2><ol className="bodacc-steps">{checks.map((c,i)=><li key={c.title}><span>{String(i+1).padStart(2,"0")}</span><div><h3>{c.title}</h3><p>{c.text}</p></div></li>)}</ol></section>
  <section className="concept-principles"><h2>Ne pas décider sur la base d’un signal isolé.</h2><p>Une évolution publiée dans une source officielle ne révèle pas nécessairement l’intention d’un dirigeant, la qualité d’une entreprise ou son prix. Les informations doivent être datées, recoupées et complétées par des vérifications adaptées.</p><p><strong>État du service :</strong> cette page présente une méthode de préparation. MajestiOS ne fournit pas ici un catalogue exhaustif d’entreprises à reprendre ni une diligence automatisée.</p><div className="route-actions"><Link className="search-submit concept-cta" href="/business/achat-cession/evaluer-une-entreprise">Comprendre l’évaluation ↗</Link><Link className="search-submit concept-cta" href="/business/achat-cession">Retour au parcours reprise / cession ↗</Link></div></section>
  <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/business/veille-bodacc">Veille économique</Link><Link href="/faq">FAQ</Link></footer>
 </main>;
}
