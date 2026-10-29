import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
  title: "Intelligence économique et entreprises — MajestiOS",
  description: "Relier les publications économiques, les évolutions d’entreprise et les projets de transmission à des pistes commerciales vérifiables."
};

const services = [
 {number:"01",title:"Veille BODACC",text:"Comprendre les publications de créations, modifications, procédures et transmissions, puis vérifier ce que chaque signal permet réellement de conclure.",href:"/business/veille-bodacc",action:"Explorer les signaux BODACC"},
 {number:"02",title:"Intelligence entreprises",text:"Rassembler le contexte d’une entreprise, vérifier les faits, qualifier les informations manquantes et expliquer les pistes qui méritent une analyse complémentaire.",href:"/business/intelligence-entreprises",action:"Qualifier une entreprise"},
 {number:"03",title:"Créations et implantations",text:"Examiner les entreprises récemment créées ou implantées, leur activité déclarée, leur territoire et les informations qui peuvent confirmer leur pertinence.",href:"/business/intelligence-entreprises/creations-implantations",action:"Analyser une implantation"},
 {number:"04",title:"Évolutions d’activité",text:"Mettre en perspective les changements publiés et leur chronologie sans en déduire automatiquement une intention d’achat, un besoin ou une difficulté.",href:"/business/intelligence-entreprises/evolutions-activite",action:"Comprendre une évolution"},
 {number:"05",title:"Achat, cession et transmission",text:"Préparer une reprise ou une cession, structurer les vérifications et comprendre les facteurs d’évaluation d’une entreprise.",href:"/business/achat-cession",action:"Préparer une transmission"}
];

const principles = [
 {title:"Le fait",text:"Ce qu’une source identifiable indique explicitement, avec sa date et son contexte."},
 {title:"L’interprétation",text:"Une explication possible qui doit être présentée comme telle et confrontée à d’autres éléments."},
 {title:"La piste commerciale",text:"Une hypothèse à qualifier avant d’engager un contact ou une décision."}
];

export default function BusinessPage() {
 return <main className="public-site concept-page domain-business"><PublicHeader />
  <section className="how-section concept-hero"><div><span className="section-label">BUSINESS INTELLIGENCE · BRAINIOS</span><h1>Comprendre les entreprises. <em>Détecter des opportunités à vérifier.</em></h1><p>MajestiOS vise à transformer des informations économiques dispersées en contexte utile à la décision commerciale. La valeur ne réside pas dans l’accumulation de données, mais dans leur provenance, leur actualité, leur recoupement et la pertinence de l’action envisagée.</p><div className="hero-actions"><Link className="button-primary" href="/business/veille-bodacc">Explorer la veille économique <span aria-hidden="true">→</span></Link><Link className="button-secondary" href="/developpement-commercial/prospection">Voir la prospection inversée</Link></div></div></section>
  <section className="concept-principles"><span className="section-label">PARCOURS MÉTIERS</span><h2>Des pages distinctes pour approfondir chaque besoin.</h2><div className="results-list">{services.map((service)=><article className="result-card" key={service.href}><div className="result-main"><span className="result-category">PARCOURS {service.number}</span><h3>{service.title}</h3><p>{service.text}</p></div><div className="result-actions"><Link className="result-action" href={service.href}>{service.action} →</Link></div></article>)}</div></section>
  <section className="concept-principles"><span className="section-label">DISCIPLINE D’ANALYSE</span><h2>Ne pas confondre information, hypothèse et décision.</h2><div className="bodacc-principle-grid">{principles.map((item)=><div key={item.title}><strong>{item.title}</strong><span>{item.text}</span></div>)}</div><p>Une création d’entreprise ne prouve pas un besoin d’achat. Une modification administrative ne révèle pas à elle seule une intention commerciale. Une publication de cession ne constitue pas une évaluation. Chaque conclusion doit rester proportionnée aux preuves disponibles.</p></section>
  <section className="concept-principles"><h2>De l’information à l’action commerciale</h2><ol className="bodacc-steps"><li><span>01</span><div><h3>Tracer la source</h3><p>Conserver la provenance, la date et le contexte de l’information.</p></div></li><li><span>02</span><div><h3>Recouper et qualifier</h3><p>Comparer les éléments disponibles et rendre visibles les inconnues importantes.</p></div></li><li><span>03</span><div><h3>Choisir une action proportionnée</h3><p>Approfondir la recherche, différer la décision ou préparer une démarche commerciale pertinente.</p></div></li><li><span>04</span><div><h3>Capitaliser sur le résultat</h3><p>Conserver les enseignements utiles sans transformer une hypothèse ou un refus ponctuel en vérité permanente.</p></div></li></ol><p><strong>État du service :</strong> cette architecture décrit les parcours et leur méthode. Les sources et automatisations effectivement connectées restent limitées à celles annoncées comme disponibles dans chaque rubrique.</p><div className="route-actions"><Link className="search-submit concept-cta" href="/developpement-commercial/etudes-de-marche">Étudier un marché ↗</Link><Link className="search-submit concept-cta" href="/developpement-commercial/prospection/ciblage">Qualifier une cible ↗</Link></div></section>
  <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/opportunites">Explorer les opportunités</Link><Link href="/faq">FAQ</Link></footer>
 </main>;
}
