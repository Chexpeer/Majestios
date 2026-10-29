import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = { title: "Achat, cession et transmission d’entreprise — MajestiOS", description: "Structurer un projet de reprise ou de cession en vérifiant le contexte, les informations disponibles, les risques et les étapes de décision." };

const stages = [
 {title:"Clarifier le projet",text:"Définir l’objectif, le calendrier, le périmètre géographique, le secteur et les critères qui rendent une opération pertinente."},
 {title:"Rassembler les informations",text:"Réunir les éléments disponibles sur l’activité, la clientèle, les moyens, les contrats, les équipes et les obligations, en vérifiant leur origine et leur date."},
 {title:"Examiner les risques et les inconnues",text:"Distinguer les faits documentés, les déclarations à confirmer et les questions nécessitant une analyse comptable, juridique, fiscale ou sociale spécialisée."},
 {title:"Préparer une décision éclairée",text:"Comparer plusieurs scénarios, identifier les conditions préalables et planifier les vérifications avant tout engagement."}
];

export default function AchatCessionPage() {
 return <main className="public-site concept-page"><PublicHeader />
  <section className="how-section concept-hero"><div><span className="section-label">INTELLIGENCE ÉCONOMIQUE · TRANSMISSION</span><h1>Préparer une reprise ou une cession <em>sans confondre signal et certitude.</em></h1><p>Un changement de dirigeant, une annonce de cession ou une évolution d’activité peut signaler un événement économique. Cela ne suffit pas à établir la valeur d’une entreprise ni l’existence d’une volonté de vendre. MajestiOS vise à structurer les informations et les étapes de réflexion.</p></div></section>
  <section className="concept-principles"><span className="section-label">PARCOURS COMMUN</span><h2>Quatre étapes avant une décision engageante.</h2><ol className="bodacc-steps">{stages.map((s,i)=><li key={s.title}><span>{String(i+1).padStart(2,"0")}</span><div><h3>{s.title}</h3><p>{s.text}</p></div></li>)}</ol></section>
  <section className="concept-principles"><span className="section-label">VOTRE SITUATION</span><h2>Choisir le parcours adapté.</h2><div className="results-list">
   <article className="result-card"><div className="result-main"><h3>Vous envisagez de reprendre une entreprise</h3><p>Définir la cible, examiner la cohérence stratégique et préparer une liste de vérifications avant les négociations.</p></div><div className="result-actions"><Link className="result-action" href="/business/achat-cession/acheter">Préparer une reprise →</Link></div></article>
   <article className="result-card"><div className="result-main"><h3>Vous envisagez de céder votre entreprise</h3><p>Organiser les informations, anticiper les questions et préparer une transmission sans divulgation prématurée d’éléments sensibles.</p></div><div className="result-actions"><Link className="result-action" href="/business/achat-cession/vendre">Préparer une cession →</Link></div></article>
   <article className="result-card"><div className="result-main"><h3>Vous devez estimer une valeur</h3><p>Comprendre les facteurs d’évaluation et les limites d’une estimation qui ne remplace pas une expertise professionnelle.</p></div><div className="result-actions"><Link className="result-action" href="/business/achat-cession/evaluer-une-entreprise">Comprendre l’évaluation →</Link></div></article>
  </div></section>
  <section className="concept-principles"><h2>Confidentialité et vérifications spécialisées</h2><p>Une opération de reprise ou de cession peut exposer des informations stratégiques et personnelles. Le partage doit être contrôlé. Les informations publiques, notamment celles issues des publications officielles, doivent être interprétées avec prudence et recoupées avant toute décision.</p><p><strong>État du service :</strong> cette rubrique fournit une méthode de préparation. Elle ne constitue ni une place de marché de cession active, ni une valorisation automatisée, ni un conseil juridique ou financier personnalisé.</p><div className="route-actions"><Link className="search-submit concept-cta" href="/business/veille-bodacc">Comprendre la veille BODACC ↗</Link><Link className="search-submit concept-cta" href="/business/intelligence-entreprises">Intelligence entreprises ↗</Link></div></section>
  <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/business">Vue d’ensemble Business</Link><Link href="/faq">FAQ</Link></footer>
 </main>;
}
