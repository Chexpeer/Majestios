import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = { title: "Argumentaires commerciaux — MajestiOS", description: "Préparer une prise de contact contextualisée, vérifiable et respectueuse, liée à un signal commercial pertinent." };

const elements = [
 {title:"Le contexte vérifié",text:"Mentionner uniquement un signal public réellement observé, avec une date et une source que l’on peut retrouver. Ne pas laisser entendre qu’un besoin a été exprimé si ce n’est pas le cas."},
 {title:"La pertinence de l’offre",text:"Expliquer simplement le lien entre l’activité du prospect et le service proposé. Éviter les formules génériques et les promesses de résultats garantis."},
 {title:"La proposition de valeur",text:"Formuler un bénéfice concret et raisonnable, puis préciser ce qui pourrait être vérifié ensemble lors d’un échange."},
 {title:"Un appel à l’action léger",text:"Proposer une prochaine étape claire et proportionnée, sans pression artificielle ni urgence inventée."},
 {title:"Le respect du destinataire",text:"Identifier clairement l’expéditeur, utiliser des coordonnées professionnelles pertinentes, respecter les règles applicables et tenir compte des demandes de ne plus être sollicité."}
];

export default function ArgumentairesPage() {
 return <main className="public-site concept-page"><PublicHeader />
  <section className="how-section concept-hero"><div><span className="section-label">PROSPECTION INVERSÉE · MESSAGE</span><h1>Un bon message explique <em>pourquoi cette prise de contact a du sens.</em></h1><p>Un argumentaire utile relie un contexte vérifié à une proposition adaptée. Il ne doit ni inventer un besoin, ni suggérer une relation préalable inexistante, ni prétendre connaître la situation interne du destinataire.</p></div></section>
  <section className="concept-principles"><span className="section-label">STRUCTURE DU MESSAGE</span><h2>Cinq éléments à préparer.</h2><ol className="bodacc-steps">{elements.map((e,i)=><li key={e.title}><span>{String(i+1).padStart(2,"0")}</span><div><h3>{e.title}</h3><p>{e.text}</p></div></li>)}</ol></section>
  <section className="concept-principles"><h2>Adapter le message sans manipuler.</h2><p>La personnalisation doit améliorer la pertinence, pas donner l’impression d’une surveillance intrusive. Ne collecter ni n’exposer d’informations personnelles non nécessaires. Faire relire les messages sensibles et conserver une possibilité simple de refus.</p><div className="route-actions"><Link className="search-submit concept-cta" href="/developpement-commercial/prospection/ciblage">Revoir les critères de ciblage ↗</Link><Link className="search-submit concept-cta" href="/developpement-commercial/prospection/suivi">Préparer le suivi ↗</Link></div><p><strong>État du service :</strong> cette page décrit une méthode. La génération automatique et l’envoi à grande échelle de messages ne sont pas annoncés comme opérationnels.</p></section>
  <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/developpement-commercial/prospection">Vue d’ensemble</Link><Link href="/faq#prospection">FAQ</Link></footer>
 </main>;
}
