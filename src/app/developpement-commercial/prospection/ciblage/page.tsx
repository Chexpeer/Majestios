import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = { title: "Ciblage commercial — MajestiOS", description: "Définir une cible commerciale à partir de critères explicites, de signaux datés et d’une adéquation vérifiable avec son offre." };

const criteria = [
 {title:"Adéquation métier",text:"Définir les activités et compétences réellement servies par l’offre, en utilisant les classifications comme repères et non comme preuve d’un besoin."},
 {title:"Taille et capacité",text:"Préciser les seuils pertinents selon la prestation, la capacité de livraison et le modèle économique. Une taille d’entreprise n’établit pas à elle seule son intérêt."},
 {title:"Territoire et couverture",text:"Déterminer les zones d’intervention réalistes et les contraintes de déplacement, de livraison ou de réglementation."},
 {title:"Signal commercial",text:"Identifier l’événement observable qui justifie l’examen : consultation, implantation, changement d’activité ou autre signal public vérifiable."},
 {title:"Priorité et prochaine étape",text:"Noter l’adéquation, la fraîcheur, la fiabilité et le coût de vérification, puis choisir une action proportionnée."}
];

export default function CiblagePage() {
 return <main className="public-site concept-page"><PublicHeader />
  <section className="how-section concept-hero"><div><span className="section-label">PROSPECTION INVERSÉE · CIBLAGE</span><h1>Ne pas chercher tout le monde. <em>Identifier les entreprises pertinentes.</em></h1><p>Le ciblage commercial commence par une offre précise et des critères explicites. Les signaux économiques peuvent aider à prioriser les recherches, mais ils ne démontrent pas automatiquement qu’une entreprise a un besoin ni qu’elle souhaite être contactée.</p></div></section>
  <section className="concept-principles"><span className="section-label">GRILLE DE CIBLAGE</span><h2>Cinq dimensions à documenter.</h2><ol className="bodacc-steps">{criteria.map((c,i)=><li key={c.title}><span>{String(i+1).padStart(2,"0")}</span><div><h3>{c.title}</h3><p>{c.text}</p></div></li>)}</ol></section>
  <section className="concept-principles"><h2>Une cible doit rester révisable.</h2><p>Un refus lié à une prestation précise ne signifie pas nécessairement qu’aucune collaboration future ne sera pertinente. Respecter les préférences de contact, éviter les sollicitations répétées sans motif et mettre à jour les informations au fil du temps.</p><div className="route-actions"><Link className="search-submit concept-cta" href="/business/veille-bodacc">Explorer les signaux économiques ↗</Link><Link className="search-submit concept-cta" href="/developpement-commercial/prospection/argumentaires">Préparer un message pertinent ↗</Link><Link className="search-submit concept-cta" href="/developpement-commercial/prospection/suivi">Organiser le suivi ↗</Link></div><p><strong>État du service :</strong> cette page expose la méthode de ciblage. Elle ne garantit pas qu’un fichier exhaustif de prospects qualifiés soit déjà disponible.</p></section>
  <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/developpement-commercial/prospection">Vue d’ensemble de la prospection</Link><Link href="/faq#prospection">FAQ</Link></footer>
 </main>;
}
