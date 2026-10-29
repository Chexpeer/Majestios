import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = { title: "Préparer un dossier d’appel d’offres — MajestiOS", description: "Organiser les pièces, les preuves, les engagements et les contrôles d’une réponse à un appel d’offres." };

const steps = [
 {title:"Construire la liste des pièces",text:"Relever les documents administratifs, attestations, formulaires et éléments techniques explicitement demandés dans le dossier."},
 {title:"Répondre point par point",text:"Relier chaque exigence à une réponse et à une preuve vérifiable. Signaler les exigences non couvertes plutôt que de les masquer."},
 {title:"Vérifier la cohérence",text:"Contrôler les montants, délais, moyens annoncés, références, sous-traitants et engagements afin d’éviter les contradictions entre documents."},
 {title:"Faire valider les engagements",text:"Obtenir les validations internes nécessaires pour les prix, les capacités, les conditions d’exécution et les engagements contractuels."},
 {title:"Contrôler le dépôt",text:"Vérifier le format, la signature si requise, le canal de transmission, les pièces jointes et l’heure limite en tenant compte des consignes officielles."}
];

export default function RedigerDossierPage() {
 return <main className="public-site concept-page"><PublicHeader />
  <section className="how-section concept-hero"><div><span className="section-label">ACCOMPAGNEMENT AUX APPELS D’OFFRES · DOSSIER</span><h1>Un dossier convaincant est d’abord <em>complet, cohérent et vérifiable.</em></h1><p>La qualité d’une réponse dépend de sa correspondance avec les exigences du marché. Un texte séduisant ne compense ni une pièce manquante, ni une affirmation impossible à démontrer, ni un dépôt hors délai.</p></div></section>
  <section className="concept-principles"><span className="section-label">CONTRÔLE DU DOSSIER</span><h2>Une progression structurée, sans promettre de résultat.</h2><ol className="bodacc-steps">{steps.map((s,i)=><li key={s.title}><span>{String(i+1).padStart(2,"0")}</span><div><h3>{s.title}</h3><p>{s.text}</p></div></li>)}</ol></section>
  <section className="concept-principles"><h2>Ne jamais inventer une capacité ou une référence.</h2><p>Chaque affirmation doit pouvoir être justifiée par un document ou une validation de l’entreprise. Les informations sensibles doivent être partagées uniquement dans un environnement adapté et avec les personnes autorisées.</p><p><strong>État du service :</strong> cette page décrit la méthode d’organisation. Elle ne signifie pas que MajestiOS rédige, signe ou dépose déjà automatiquement les candidatures.</p><div className="route-actions"><Link className="search-submit concept-cta" href="/developpement-commercial/accompagnement-appels-offres/preparer">Évaluer le marché ↗</Link><Link className="search-submit concept-cta" href="/developpement-commercial/accompagnement-appels-offres/apres-un-resultat">Suivre le résultat ↗</Link></div></section>
  <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/developpement-commercial/accompagnement-appels-offres">Vue d’ensemble</Link><Link href="/faq#appels-offres">FAQ</Link></footer>
 </main>;
}
