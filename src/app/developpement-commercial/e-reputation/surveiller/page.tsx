import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
 title: "Surveiller son e-réputation — MajestiOS",
 description: "Définir un périmètre de veille de réputation traçable, pertinent et conforme aux conditions d’accès des sources."
};

const controls = [
 {title:"Identifiants à suivre",text:"Lister les noms d’entreprise, marques, établissements et variantes pertinentes afin de réduire les confusions avec des homonymes."},
 {title:"Sources et accès",text:"Préciser les plateformes et publications consultables, les conditions d’accès et les limites techniques ou contractuelles de chaque source."},
 {title:"Fréquence et priorité",text:"Définir une cadence adaptée à l’activité et distinguer les sujets nécessitant une vérification rapide des mentions ordinaires."},
 {title:"Traçabilité de chaque signal",text:"Conserver la source originale, la date de consultation, le contexte et l’état du contrôle, sans recopier plus de contenu que nécessaire."}
];

export default function SurveillerEReputationPage() {
 return <main className="public-site concept-page"><PublicHeader />
  <section className="how-section concept-hero"><div><span className="section-label">E-RÉPUTATION · VEILLE</span><h1>Surveiller le bon périmètre, <em>pas tout Internet indistinctement.</em></h1><p>Une veille exploitable commence par une question précise : quels noms, sujets et sources sont réellement utiles à l’entreprise ? Définir ce périmètre réduit le bruit, les confusions et les conclusions fondées sur des mentions mal attribuées.</p></div></section>
  <section className="concept-principles"><span className="section-label">CONFIGURER LA VEILLE</span><h2>Quatre paramètres à définir.</h2><div className="results-list">{controls.map((d,i)=><article className="result-card" key={d.title}><div className="result-main"><span className="result-category">PARAMÈTRE {String(i+1).padStart(2,"0")}</span><h3>{d.title}</h3><p>{d.text}</p></div></article>)}</div></section>
  <section className="concept-principles"><h2>Ne pas confondre absence de signal et absence de problème.</h2><p>Une source non accessible, une plateforme non surveillée ou une variation d’indexation peut expliquer l’absence de résultat. Le périmètre de veille et ses limites doivent donc être connus avant de tirer une conclusion sur la réputation globale d’une entreprise.</p><p><strong>État du service :</strong> cette page décrit les paramètres fonctionnels attendus. Une surveillance automatisée continue n’est pas annoncée comme active.</p><p><Link href="/developpement-commercial/e-reputation">Retour au parcours e-réputation →</Link></p></section>
  <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/developpement-commercial/e-reputation/repondre-aux-avis">Préparer une réponse</Link><Link href="/faq#ia-fiabilite">FAQ sur les sources et l’IA</Link></footer>
 </main>;
}
