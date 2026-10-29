import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = { title: "Après le résultat d’un appel d’offres — MajestiOS", description: "Capitaliser sur les résultats d’appels d’offres, qu’ils soient favorables ou non, sans tirer de conclusions hâtives." };

const outcomes = [
 {title:"Si le marché est remporté",text:"Organiser le passage à l’exécution, vérifier les engagements pris, identifier les interlocuteurs et suivre les échéances contractuelles."},
 {title:"Si la candidature n’est pas retenue",text:"Consulter les informations de résultat disponibles, demander un retour lorsque c’est possible et distinguer les motifs confirmés des interprétations."},
 {title:"Si l’offre est déclarée infructueuse ou annulée",text:"Vérifier l’avis officiel, ne pas présumer qu’une nouvelle consultation aura lieu et surveiller les publications ultérieures sans les présenter comme certaines."},
 {title:"Dans tous les cas",text:"Mettre à jour les coûts de réponse, les capacités mobilisées, les documents réutilisables et les enseignements qui pourront servir aux prochains dossiers."}
];

export default function ApresResultatPage() {
 return <main className="public-site concept-page"><PublicHeader />
  <section className="how-section concept-hero"><div><span className="section-label">ACCOMPAGNEMENT AUX APPELS D’OFFRES · CAPITALISATION</span><h1>Le résultat n’est pas la fin du parcours. <em>C’est une information à exploiter.</em></h1><p>Chaque consultation peut améliorer la connaissance des marchés et la discipline commerciale. La capitalisation doit rester factuelle : une décision ne révèle pas toujours à elle seule la raison du résultat, ni les chances de succès sur un autre marché.</p></div></section>
  <section className="concept-principles"><span className="section-label">APRÈS LA DÉCISION</span><h2>Adapter la suite au résultat réellement publié.</h2><div className="results-list">{outcomes.map((o,i)=><article className="result-card" key={o.title}><div className="result-main"><span className="result-category">CAS {String(i+1).padStart(2,"0")}</span><h3>{o.title}</h3><p>{o.text}</p></div></article>)}</div></section>
  <section className="concept-principles"><h2>Transformer l’expérience en meilleure décision.</h2><p>Le suivi peut aider à repérer les types de marchés adaptés, les pièces à préparer à l’avance et les coûts récurrents de candidature. Il ne doit pas transformer une perte en étiquette permanente : les capacités, le contexte et la nature du besoin peuvent changer.</p><p><strong>État du service :</strong> cette page présente le parcours de capitalisation prévu. Elle ne prétend pas disposer d’un historique exhaustif de toutes les candidatures ou décisions.</p><div className="route-actions"><Link className="search-submit concept-cta" href="/developpement-commercial/accompagnement-appels-offres">Retour à l’accompagnement ↗</Link><Link className="search-submit concept-cta" href="/developpement-commercial/prospection/suivi">Voir le suivi de prospection ↗</Link></div></section>
  <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/opportunites/marches-publics">Appels d’offres publics</Link><Link href="/faq">FAQ</Link></footer>
 </main>;
}
