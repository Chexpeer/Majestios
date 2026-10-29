import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
 title: "Développement commercial — MajestiOS",
 description: "Relier veille économique, prospection, études de marché, réputation et accompagnement des appels d’offres à une démarche commerciale cohérente."
};

const services = [
 {number:"01",title:"Prospection inversée",text:"Partir d’un signal documenté — consultation, évolution d’entreprise ou rencontre professionnelle — puis vérifier s’il justifie une démarche de contact.",href:"/developpement-commercial/prospection",action:"Qualifier une piste"},
 {number:"02",title:"Études de marché",text:"Comprendre un secteur, une zone, les profils de clients, la concurrence et les limites des informations disponibles avant de décider.",href:"/developpement-commercial/etudes-de-marche",action:"Structurer une étude"},
 {number:"03",title:"Accompagnement aux appels d’offres",text:"Lire les exigences, évaluer la capacité à répondre, lister les pièces et les échéances. Le dépôt officiel reste réalisé selon les instructions de l’acheteur.",href:"/developpement-commercial/accompagnement-appels-offres",action:"Préparer une réponse"},
 {number:"04",title:"E-réputation",text:"Surveiller les retours accessibles, comprendre les signaux de réputation et répondre avec mesure, sans exposer de données personnelles.",href:"/developpement-commercial/e-reputation",action:"Explorer l’e-réputation"},
 {number:"05",title:"Réseautage intelligent",text:"Relier des acteurs autour d’une complémentarité et d’un motif professionnel clair, plutôt que d’accumuler des contacts non qualifiés.",href:"/reseaux",action:"Découvrir le réseau"}
];

export default function DeveloppementCommercialPage() {
 return <main className="public-site concept-page"><PublicHeader />
  <section className="how-section concept-hero"><div><span className="section-label">MAJESTIOS · DÉVELOPPEMENT COMMERCIAL</span><h1>Passer de l’information <em>à une action commerciale pertinente.</em></h1><p>Le développement commercial ne commence pas forcément par une liste de prospects. Il peut commencer par un appel d’offres, un changement économique, une étude de marché ou une rencontre. MajestiOS vise à relier ces signaux à une qualification et à une action proportionnée.</p><p>La logique centrale reste la même : détecter, qualifier, identifier, contacter, transformer et capitaliser. Chaque service conserve cependant son propre parcours et ses critères.</p></div></section>
  <section className="concept-principles"><span className="section-label">PARCOURS COMMERCIAUX</span><h2>Choisir la démarche adaptée.</h2><div className="results-list">{services.map(s=><article className="result-card" key={s.href}><div className="result-main"><span className="result-category">{s.number} · SERVICE</span><h3>{s.title}</h3><p>{s.text}</p></div><div className="result-actions"><Link className="result-action" href={s.href}>{s.action} →</Link></div></article>)}</div></section>
  <section className="concept-principles"><span className="section-label">UNE MÉTHODE, PAS UNE PROMESSE DE RÉSULTAT</span><h2>La qualité du signal conditionne la qualité de l’action.</h2><div className="bodacc-principle-grid"><div><strong>Tracer</strong><span>Conserver la source, la date, le contexte et les limites de chaque information.</span></div><div><strong>Qualifier</strong><span>Faire la différence entre faits confirmés, données manquantes et hypothèses commerciales.</span></div><div><strong>Agir avec mesure</strong><span>Choisir une action adaptée, respecter les règles de contact et documenter le résultat.</span></div><div><strong>Apprendre</strong><span>Réutiliser les retours pour améliorer le ciblage sans transformer un refus ponctuel en exclusion définitive.</span></div></div></section>
  <section className="concept-principles"><h2>Transparence sur l’état des fonctionnalités.</h2><p>Ces pages détaillent les parcours et la méthode attendue. Elles ne signifient pas que chaque source, outil d’analyse ou service automatisé est déjà connecté. Les fonctions disponibles doivent être distinguées des fonctionnalités prévues, et aucune hypothèse ne doit être présentée comme un besoin client confirmé.</p><p><Link href="/opportunites">Explorer les opportunités →</Link></p></section>
  <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/business/intelligence-entreprises">Intelligence entreprises</Link><Link href="/faq">FAQ</Link></footer>
 </main>;
}
