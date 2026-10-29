import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = { title: "Évaluer un appel d’offres — MajestiOS", description: "Vérifier l’éligibilité, les exigences, les délais et les risques avant de décider de répondre à un appel d’offres." };

const checks = [
 {title:"Comprendre l’objet et le périmètre",text:"Identifier ce qui est acheté, les lots, le lieu d’exécution, les résultats attendus et les éventuelles contraintes de calendrier."},
 {title:"Contrôler les conditions de participation",text:"Lire les critères d’éligibilité, capacités attendues, références, attestations et éventuelles conditions particulières. Ne rien supposer à partir du seul titre de l’annonce."},
 {title:"Mesurer la capacité réelle à exécuter",text:"Comparer le besoin avec les compétences, les équipes, les moyens, la trésorerie et les autres engagements de l’entreprise."},
 {title:"Calculer le temps et les risques",text:"Relever la date limite, les visites obligatoires, les questions à poser, les pièces à réunir et les risques d’exécution."},
 {title:"Prendre une décision argumentée",text:"Consigner les raisons de répondre ou de renoncer, les inconnues restantes et les validations nécessaires avant d’engager des ressources."}
];

export default function PreparerReponsePage() {
 return <main className="public-site concept-page"><PublicHeader />
  <section className="how-section concept-hero"><div><span className="section-label">ACCOMPAGNEMENT AUX APPELS D’OFFRES · ÉVALUATION</span><h1>Avant de répondre, <em>vérifier que le marché vous convient.</em></h1><p>Une annonce pertinente n’est pas nécessairement un marché que l’entreprise peut ou doit remporter. La décision doit tenir compte des exigences réelles, de la capacité d’exécution et du coût de préparation de la candidature.</p></div></section>
  <section className="concept-principles"><span className="section-label">GRILLE GO / NO GO</span><h2>Cinq contrôles avant d’engager du temps.</h2><ol className="bodacc-steps">{checks.map((c,i)=><li key={c.title}><span>{String(i+1).padStart(2,"0")}</span><div><h3>{c.title}</h3><p>{c.text}</p></div></li>)}</ol></section>
  <section className="concept-principles"><h2>La source officielle reste la référence.</h2><p>Vérifiez la version la plus récente du dossier, les modifications, les réponses aux questions et les éventuelles prolongations. En cas de divergence, ne vous fiez pas uniquement à une synthèse ou à une fiche de veille.</p><p><strong>État du service :</strong> cette page présente une méthode d’aide à la décision. MajestiOS ne certifie pas automatiquement l’éligibilité d’une entreprise et ne prend pas la décision à sa place.</p><div className="route-actions"><Link className="search-submit concept-cta" href="/opportunites/marches-publics">Consulter les marchés publics ↗</Link><Link className="search-submit concept-cta" href="/developpement-commercial/accompagnement-appels-offres/rediger">Préparer le dossier ↗</Link><Link className="search-submit concept-cta" href="/developpement-commercial/accompagnement-appels-offres/apres-un-resultat">Organiser le suivi du résultat ↗</Link></div></section>
  <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/developpement-commercial/accompagnement-appels-offres">Vue d’ensemble de l’accompagnement</Link><Link href="/faq#appels-offres">FAQ</Link></footer>
 </main>;
}
