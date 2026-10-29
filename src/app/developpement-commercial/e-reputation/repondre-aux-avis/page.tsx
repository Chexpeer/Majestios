import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
 title: "Répondre aux avis en ligne — MajestiOS",
 description: "Préparer des réponses aux avis en ligne qui soient factuelles, professionnelles, proportionnées et respectueuses de la confidentialité."
};

const principles = [
 {title:"Vérifier les faits",text:"Comparer l’avis aux éléments accessibles en interne et identifier ce qui reste inconnu. Ne pas accuser une personne ni contester un fait sans vérification."},
 {title:"Reconnaître le retour",text:"Répondre au sujet exprimé avec un ton calme, sans promesse irréaliste, sarcasme ou formulation agressive."},
 {title:"Protéger les personnes",text:"Ne pas révéler de données client, d’historique privé, d’informations de paiement ou de détails confidentiels pour se justifier publiquement."},
 {title:"Choisir le bon canal",text:"Proposer un échange privé si une investigation est nécessaire, sans publier de coordonnées ou d’informations personnelles dans la réponse."},
 {title:"Valider avant publication",text:"Faire relire les réponses sensibles et conserver une trace de la décision, de la validation et de l’éventuelle suite donnée."}
];

export default function RepondreAvisPage() {
 return <main className="public-site concept-page"><PublicHeader />
  <section className="how-section concept-hero"><div><span className="section-label">E-RÉPUTATION · RÉPONSE AUX AVIS</span><h1>Répondre avec professionnalisme, <em>sans aggraver la situation.</em></h1><p>Une réponse publique engage l’entreprise. Elle doit rester factuelle, utile et respectueuse, même lorsqu’un avis paraît injuste. L’objectif n’est pas de gagner une dispute en ligne, mais de montrer une démarche sérieuse et de proposer une suite appropriée.</p></div></section>
  <section className="concept-principles"><span className="section-label">GRILLE DE PRÉPARATION</span><h2>Cinq contrôles avant publication.</h2><ol className="bodacc-steps">{principles.map((d,i)=><li key={d.title}><span>{String(i+1).padStart(2,"0")}</span><div><h3>{d.title}</h3><p>{d.text}</p></div></li>)}</ol></section>
  <section className="concept-principles"><h2>Un projet de réponse n’est pas une publication automatique.</h2><p>Une proposition générée ou préparée doit être vérifiée par une personne qui connaît le contexte. Les faits incertains doivent être formulés avec prudence ; les demandes complexes, les accusations ou les données sensibles peuvent nécessiter un traitement interne adapté avant toute réponse publique.</p><p><strong>État du service :</strong> cette page décrit la méthode. La génération, la validation et la publication intégrées ne sont pas annoncées comme opérationnelles.</p><div className="route-actions"><Link className="search-submit concept-cta" href="/developpement-commercial/e-reputation">Vue d’ensemble e-réputation ↗</Link><Link className="search-submit concept-cta" href="/developpement-commercial/e-reputation/surveiller">Définir la veille ↗</Link></div></section>
  <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/faq#ia-fiabilite">FAQ sur les sources et l’IA</Link><Link href="/developpement-commercial">Services commerciaux</Link></footer>
 </main>;
}
