import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
  title: "E-réputation — MajestiOS",
  description: "Organiser la veille de réputation, vérifier les mentions à leur source et préparer des réponses professionnelles."
};

const stages = [
 {n:"01",title:"Définir le périmètre",text:"Identifier les noms de marque, établissements et sujets pertinents, puis choisir les plateformes publiques autorisées à être surveillées. Préciser ce qui est hors périmètre."},
 {n:"02",title:"Retrouver la publication originale",text:"Conserver l’URL, la date, la plateforme et le contexte. Distinguer un avis client, une actualité, une discussion et une simple mention."},
 {n:"03",title:"Évaluer sans surinterpréter",text:"Vérifier si la publication concerne bien l’entreprise, repérer les faits précis et séparer les propos de leur interprétation. Un avis isolé ne représente pas nécessairement l’ensemble des clients."},
 {n:"04",title:"Choisir la réponse adaptée",text:"Décider si une réponse publique, une vérification interne ou aucune action est appropriée. Ne pas divulguer de données personnelles ni d’informations confidentielles dans une réponse."},
 {n:"05",title:"Suivre l’évolution",text:"Documenter les suites et les thèmes récurrents de manière proportionnée, en tenant compte des règles des plateformes et des durées de conservation."}
];

export default function EReputationPage() {
 return <main className="public-site concept-page"><PublicHeader />
  <section className="how-section concept-hero"><div><span className="section-label">DÉVELOPPEMENT COMMERCIAL · RÉPUTATION</span><h1>Écouter, vérifier, <em>répondre avec discernement.</em></h1><p>L’e-réputation ne consiste pas à collecter toutes les mentions disponibles. Elle demande de repérer les publications pertinentes, de les replacer dans leur contexte et de choisir une réponse proportionnée, sans confondre opinion, fait établi et incident à vérifier.</p></div></section>
  <section className="concept-principles"><span className="section-label">PARCOURS DE TRAITEMENT</span><h2>Cinq étapes, de la mention à la décision.</h2><ol className="bodacc-steps">{stages.map(s=><li key={s.n}><span>{s.n}</span><div><h3>{s.title}</h3><p>{s.text}</p></div></li>)}</ol></section>
  <section className="concept-principles"><span className="section-label">RÈGLES DE QUALITÉ</span><h2>Une veille responsable et exploitable.</h2><div className="bodacc-principle-grid"><div><strong>Traçabilité</strong><span>Conserver la source originale, la date et les limites de l’observation.</span></div><div><strong>Validation humaine</strong><span>Faire relire les réponses sensibles avant publication ; ne pas automatiser une réaction sans contrôle.</span></div><div><strong>Confidentialité</strong><span>Ne pas révéler d’informations client, de données personnelles ou d’éléments internes dans une réponse publique.</span></div><div><strong>Accès légitime</strong><span>Respecter les conditions d’accès et d’utilisation des plateformes, ainsi que les règles applicables aux données traitées.</span></div></div></section>
  <section className="concept-principles"><h2>La réputation doit conduire à une action utile, pas à une réaction automatique.</h2><p>Un avis négatif peut nécessiter une vérification interne, une réponse factuelle ou un échange privé approprié. Une mention ambiguë peut ne demander aucune action. Le système doit rendre visibles les incertitudes et laisser une personne décider de la suite.</p><p><strong>État du service :</strong> cette page décrit la méthode prévue. La surveillance automatique continue, l’agrégation exhaustive des plateformes et la publication automatique de réponses ne sont pas annoncées comme opérationnelles.</p><div className="route-actions"><Link className="search-submit concept-cta" href="/developpement-commercial">Voir les parcours commerciaux ↗</Link><Link className="search-submit concept-cta" href="/business/intelligence-entreprises">Relier les signaux au contexte économique ↗</Link></div></section>
  <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/reseaux">Réseautage intelligent</Link><Link href="/faq">FAQ</Link></footer>
 </main>;
}
