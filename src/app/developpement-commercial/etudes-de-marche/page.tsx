import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
  title: "Études de marché — MajestiOS",
  description: "Cadrer une étude de marché, croiser les sources et distinguer les faits, les estimations et les hypothèses pour préparer une décision commerciale."
};

const workstreams = [
  {n:"01",title:"Définir la décision à préparer",text:"Préciser la question, le territoire, la période, les activités concernées et les critères qui permettront de décider. Une étude sans question de départ risque de produire beaucoup d’informations peu actionnables."},
  {n:"02",title:"Comprendre la demande",text:"Décrire les catégories de clients, les situations qui déclenchent un achat, les contraintes du secteur et les critères de choix. Séparer les besoins observés des suppositions à tester."},
  {n:"03",title:"Cartographier l’offre et la concurrence",text:"Identifier les acteurs pertinents, leurs spécialités, leur zone d’intervention et les éléments publiquement vérifiables. Éviter de déduire leur capacité ou leur performance à partir d’un seul indicateur."},
  {n:"04",title:"Évaluer le contexte territorial et économique",text:"Comparer les territoires, les évolutions d’activité, les créations, les implantations ou les marchés publiés lorsque les données pertinentes sont disponibles et datées."},
  {n:"05",title:"Formuler des scénarios et des limites",text:"Présenter les signaux favorables, les risques, les inconnues et les hypothèses qui demandent une validation terrain avant d’engager des moyens."}
];

export default function EtudesDeMarchePage() {
  return <main className="public-site concept-page"><PublicHeader />
    <section className="how-section concept-hero"><div><span className="section-label">DÉVELOPPEMENT COMMERCIAL · ANALYSE</span><h1>Comprendre le marché <em>avant d’engager ses moyens.</em></h1><p>Une étude de marché utile ne se limite pas à décrire un secteur. Elle relie des informations traçables à une décision concrète : cibler une zone, tester une offre, choisir un segment de clientèle ou préparer une démarche commerciale.</p><p>MajestiOS vise à organiser cette lecture dans la continuité de sa veille économique et de sa prospection inversée.</p></div></section>
    <section className="concept-principles"><span className="section-label">DÉMARCHE D’ÉTUDE</span><h2>Cinq étapes pour passer des sources à une décision.</h2><ol className="bodacc-steps">{workstreams.map(s=><li key={s.n}><span>{s.n}</span><div><h3>{s.title}</h3><p>{s.text}</p></div></li>)}</ol></section>
    <section className="concept-principles"><span className="section-label">QUALITÉ DE L’ANALYSE</span><h2>Ce que le rapport doit rendre visible.</h2><div className="bodacc-principle-grid"><div><strong>Sources et dates</strong><span>Permettre de retrouver l’origine de chaque information et de comprendre si elle est encore actuelle.</span></div><div><strong>Faits et hypothèses</strong><span>Identifier les faits établis, les estimations, les interprétations et les questions qui restent ouvertes.</span></div><div><strong>Comparabilité</strong><span>Préciser le périmètre, la période, les définitions et les éventuelles différences entre les données comparées.</span></div><div><strong>Décision et limites</strong><span>Expliquer ce que les informations permettent de conclure — et ce qu’elles ne permettent pas d’affirmer.</span></div></div></section>
    <section className="concept-principles"><h2>Relier l’étude aux actions commerciales.</h2><p>Une étude peut éclairer le ciblage, mais ne prouve pas à elle seule qu’une entreprise donnée a un besoin immédiat. Toute piste individuelle doit être vérifiée avant d’être transformée en prise de contact.</p><div className="route-actions"><Link className="search-submit concept-cta" href="/business/intelligence-entreprises">Comprendre l’intelligence économique ↗</Link><Link className="search-submit concept-cta" href="/business/veille-bodacc">Explorer la veille économique ↗</Link><Link className="search-submit concept-cta" href="/developpement-commercial/prospection">Passer à la qualification commerciale ↗</Link></div><p><strong>État du service :</strong> cette page décrit la méthode et le parcours visé. Elle ne prétend pas qu’un moteur complet d’étude de marché ou des données exhaustives sont déjà disponibles.</p></section>
    <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/developpement-commercial">Services commerciaux</Link><Link href="/faq">FAQ</Link></footer>
  </main>;
}
