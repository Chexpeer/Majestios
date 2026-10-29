import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = { title: "Comprendre l’évaluation d’une entreprise — MajestiOS", description: "Identifier les facteurs qui influencent la valeur d’une entreprise et préparer les données nécessaires à une évaluation professionnelle." };

const factors = [
 {title:"Résultats et qualité des revenus",text:"Examiner les comptes disponibles, la récurrence des revenus, les marges, les éléments exceptionnels et les écarts entre exercices."},
 {title:"Trésorerie, dettes et besoins",text:"Étudier la trésorerie, l’endettement, les besoins en fonds de roulement, les investissements nécessaires et les engagements hors bilan lorsqu’ils sont pertinents."},
 {title:"Clients et concentration du chiffre d’affaires",text:"Comprendre la dépendance à certains clients, la stabilité des contrats, la visibilité commerciale et la transférabilité des relations."},
 {title:"Équipe, actifs et savoir-faire",text:"Identifier les personnes clés, les équipements, les actifs immatériels, les droits et les compétences nécessaires à la continuité de l’activité."},
 {title:"Contexte et risques futurs",text:"Évaluer le marché, la concurrence, les obligations réglementaires, les risques opérationnels et les perspectives sans confondre prévisions et faits acquis."}
];

export default function EvaluerEntreprisePage() {
 return <main className="public-site concept-page"><PublicHeader />
  <section className="how-section concept-hero"><div><span className="section-label">ACHAT ET CESSION · ÉVALUATION</span><h1>Une valeur se justifie. <em>Elle ne se devine pas.</em></h1><p>L’évaluation d’une entreprise dépend de ses résultats, de ses actifs, de ses risques, de ses perspectives et du contexte de la transaction. Un multiple isolé ou une information publique ne suffit pas à produire une valorisation fiable.</p></div></section>
  <section className="concept-principles"><span className="section-label">FACTEURS À EXAMINER</span><h2>Cinq dimensions pour préparer une évaluation.</h2><ol className="bodacc-steps">{factors.map((f,i)=><li key={f.title}><span>{String(i+1).padStart(2,"0")}</span><div><h3>{f.title}</h3><p>{f.text}</p></div></li>)}</ol></section>
  <section className="concept-principles"><h2>Une méthode adaptée au contexte est indispensable.</h2><p>Les méthodes fondées sur les revenus, les actifs ou des transactions comparables ne répondent pas toutes à la même question. Le périmètre de l’opération, les dettes, la trésorerie, les conditions de marché et les hypothèses retenues doivent être explicités.</p><p><strong>État du service :</strong> cette page est un guide de préparation, pas un outil de valorisation automatique ni un avis financier. Une transaction réelle nécessite des vérifications et, selon le cas, l’intervention de professionnels qualifiés.</p><div className="route-actions"><Link className="search-submit concept-cta" href="/business/achat-cession/acheter">Préparer une reprise ↗</Link><Link className="search-submit concept-cta" href="/business/achat-cession/vendre">Préparer une cession ↗</Link></div></section>
  <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/business/achat-cession">Vue d’ensemble reprise / cession</Link><Link href="/faq">FAQ</Link></footer>
 </main>;
}
