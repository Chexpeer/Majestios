import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = { title: "Suivi de prospection — MajestiOS", description: "Organiser les réponses, les prochaines étapes et les apprentissages commerciaux dans un suivi traçable et respectueux." };

const states = [
 {title:"À vérifier",text:"Le signal est intéressant mais il manque une vérification sur la fraîcheur, l’adéquation ou la source. Ne pas traiter cette piste comme un besoin confirmé."},
 {title:"À contacter",text:"Les critères de pertinence sont suffisamment documentés et une prise de contact proportionnée est justifiée."},
 {title:"Échange en cours",text:"Tracer les informations utiles fournies par l’interlocuteur, les actions convenues et les prochaines échéances, sans conserver des détails superflus."},
 {title:"À réexaminer plus tard",text:"Un calendrier futur, une évolution d’activité ou une autre offre peut justifier une réévaluation, dans le respect des préférences de contact."},
 {title:"Clôturé ou à ne plus solliciter",text:"Enregistrer la décision nécessaire pour éviter les relances inadaptées et respecter les demandes explicites de non-contact."}
];

export default function SuiviProspectionPage() {
 return <main className="public-site concept-page"><PublicHeader />
  <section className="how-section concept-hero"><div><span className="section-label">PROSPECTION INVERSÉE · SUIVI</span><h1>Chaque contact doit produire <em>un apprentissage utile.</em></h1><p>Le suivi ne consiste pas à accumuler des relances. Il doit clarifier la situation, éviter les répétitions inutiles, respecter le destinataire et permettre à l’entreprise d’apprendre de ses résultats.</p></div></section>
  <section className="concept-principles"><span className="section-label">ÉTATS DE SUIVI</span><h2>Un parcours lisible, du signal à la décision.</h2><div className="results-list">{states.map((s,i)=><article className="result-card" key={s.title}><div className="result-main"><span className="result-category">ÉTAPE {String(i+1).padStart(2,"0")}</span><h3>{s.title}</h3><p>{s.text}</p></div></article>)}</div></section>
  <section className="concept-principles"><h2>Apprendre sans enfermer une entreprise dans son historique.</h2><p>Un refus peut concerner une prestation, un moment ou un budget précis. Il ne doit pas être interprété comme un refus universel et permanent. À l’inverse, une demande de ne plus être contacté doit être respectée et ne pas être contournée par une autre campagne.</p><p>Les indicateurs utiles peuvent inclure la fraîcheur des données, les réponses obtenues, les prochaines étapes acceptées et les raisons de clôture lorsqu’elles sont communiquées volontairement.</p><p><strong>État du service :</strong> cette page décrit la méthode de suivi prévue. Elle ne signifie pas qu’un CRM complet ou une synchronisation automatique de tous les échanges est déjà opérationnel.</p><div className="route-actions"><Link className="search-submit concept-cta" href="/developpement-commercial/prospection/ciblage">Ciblage commercial ↗</Link><Link className="search-submit concept-cta" href="/developpement-commercial/prospection/argumentaires">Argumentaires ↗</Link></div></section>
  <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/developpement-commercial/prospection">Vue d’ensemble de la prospection</Link><Link href="/faq#prospection">FAQ</Link></footer>
 </main>;
}
