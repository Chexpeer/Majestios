import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
  title: "Missions professionnelles — MajestiOS",
  description: "Qualifier les missions ponctuelles et prestations indépendantes selon le périmètre, les livrables, le calendrier et les conditions contractuelles."
};

const checks = [
  { title: "Périmètre explicite", text: "Définir le problème à résoudre, les tâches incluses et exclues, les livrables attendus et les critères d’acceptation." },
  { title: "Faisabilité et calendrier", text: "Vérifier la date de démarrage, la durée, la disponibilité requise, le lieu et les moyens nécessaires pour mener la mission." },
  { title: "Cadre contractuel", text: "Clarifier le statut attendu, le budget ou mode de rémunération lorsqu’il est communiqué, les responsabilités et les conditions de paiement." },
  { title: "Interlocuteur et décision", text: "Identifier l’émetteur, la personne qui valide les livrables et la prochaine étape pour confirmer l’intérêt mutuel." }
];

export default function MissionsProfessionnellesPage() {
  return <main className="site-page"><PublicHeader /><div className="page-container">
    <nav className="breadcrumbs" aria-label="Fil d’Ariane"><Link href="/">Accueil</Link><span><b>/</b><Link href="/opportunites">Opportunités</Link></span><span><b>/</b><Link href="/opportunites/emploi">Emploi et missions</Link></span><span><b>/</b><strong>Missions professionnelles</strong></span></nav>
    <section className="page-hero bodacc-hero"><span className="eyebrow">MAJESTIOS · MISSIONS ET PRESTATIONS</span><h1>Une mission utile commence par <span>un besoin bien cadré.</span></h1><p>Les missions ponctuelles et prestations indépendantes nécessitent une qualification différente d’une offre d’emploi : résultat attendu, périmètre, échéance, moyens et cadre contractuel doivent être suffisamment clairs avant de se positionner.</p><div className="page-hero-meta"><span className="status-chip status-chip-preparing"><i />Flux de missions en préparation</span><span>Les conditions doivent être confirmées avec l’émetteur.</span></div></section>
    <section className="content-panel"><span className="eyebrow">QUALIFIER UNE MISSION</span><h2>Quatre dimensions à éclaircir.</h2><ol className="bodacc-steps">{checks.map((item,index)=><li key={item.title}><span>{String(index+1).padStart(2,"0")}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></li>)}</ol></section>
    <section className="content-panel"><span className="eyebrow">FIABILITÉ</span><h2>Ne pas confondre une piste et un engagement.</h2><p>Une mission doit être attribuée à un émetteur identifiable et reliée à une source datée. Si le budget, les modalités ou l’identité du donneur d’ordre ne sont pas précisés, ces points doivent être signalés comme manquants et clarifiés avant tout engagement.</p><p>MajestiOS ne doit pas présenter de mission de démonstration comme une demande réelle. La publication d’offres, les candidatures et le partage de coordonnées nécessitent des règles d’accès et un parcours sécurisé.</p></section>
    <section className="bodacc-next-actions"><div><span className="eyebrow">POURSUIVRE</span><h2>Relier les missions aux compétences.</h2><p>La bonne mise en relation repose sur un besoin explicite et des capacités vérifiables.</p></div><div className="bodacc-next-links"><Link href="/opportunites/emploi/offres">Offres d’emploi <span>→</span></Link><Link href="/opportunites/marches-prives/secteur">Marchés privés par secteur <span>→</span></Link><Link href="/developpement-commercial/prospection">Prospection commerciale <span>→</span></Link></div></section>
    <footer className="page-footer"><span>MAJESTIOS · DÉTECTER → QUALIFIER → IDENTIFIER → CONTACTER → TRANSFORMER → CAPITALISER</span><Link href="/faq">Besoin d’aide ?</Link></footer>
  </div></main>;
}
