import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
  title: "Préparation express d’un dossier de positionnement — MajestiOS",
  description: "Structurer rapidement les éléments de candidature à un appel d’offres, identifier les pièces manquantes et décider des prochaines actions."
};

const checklist = [
  ["01", "Comprendre la consultation", "Relever l’objet du marché, le périmètre, les lots, les critères annoncés, les échéances et les modalités de remise."],
  ["02", "Vérifier l’adéquation", "Comparer les exigences avec l’activité, les moyens, les références et la capacité réelle de l’entreprise. Signaler les écarts plutôt que les masquer."],
  ["03", "Inventorier les pièces", "Établir une liste des documents demandés, des éléments déjà disponibles, des pièces à actualiser et des informations manquantes."],
  ["04", "Structurer le positionnement", "Préparer une synthèse du besoin, des points forts démontrables, des risques, des questions à clarifier et des décisions à prendre."],
  ["05", "Valider avant dépôt", "Faire vérifier les informations par l’entreprise, contrôler les délais et suivre les instructions officielles de l’acheteur."]
];

export default function PreparationExpressPage() {
  return <main className="public-site concept-page"><PublicHeader />
    <section className="how-section concept-hero"><div>
      <span className="section-label">ACCOMPAGNEMENT APPELS D’OFFRES · FORMAT EXPRESS</span>
      <h1>Préparer vite. <em>Se positionner avec méthode.</em></h1>
      <p>La préparation express vise à produire une première structure de dossier de positionnement : comprendre la consultation, confronter les exigences aux capacités réelles de l’entreprise, repérer les pièces manquantes et organiser les prochaines actions.</p>
      <p>Express ne signifie ni candidature automatique ni garantie de conformité. Les informations et les documents doivent être vérifiés et validés par l’entreprise avant tout dépôt.</p>
    </div></section>
    <section className="concept-principles"><span className="section-label">PARCOURS EXPRESS</span><h2>Un dossier structuré en cinq étapes.</h2>
      <ol className="bodacc-steps">{checklist.map(([number,title,text])=><li key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol>
    </section>
    <section className="concept-principles"><span className="section-label">ÉLÉMENTS À RASSEMBLER</span><h2>Préparer les informations utiles</h2>
      <div className="concept-grid">
        <article><span>ENTREPRISE</span><h3>Identité et capacités</h3><p>Identité légale, activité, moyens humains et matériels, zones d’intervention et références vérifiables.</p></article>
        <article><span>CONSULTATION</span><h3>Documents officiels</h3><p>Avis, règlement de consultation, cahier des clauses, pièces financières et annexes disponibles.</p></article>
        <article><span>CALENDRIER</span><h3>Échéances et questions</h3><p>Date limite, visite obligatoire éventuelle, délais de clarification et étapes internes de validation.</p></article>
        <article><span>POSITIONNEMENT</span><h3>Décision argumentée</h3><p>Adéquation, contraintes, points à confirmer, risques et recommandation de prochaine étape.</p></article>
      </div>
    </section>
    <section className="concept-principles"><h2>État de la fonctionnalité</h2><p>Cette page formalise le parcours et la liste de contrôle. La génération automatique d’un dossier à partir de documents importés, la vérification assistée des pièces et l’envoi d’une demande d’accompagnement ne sont pas encore activés ici.</p>
      <div className="route-actions"><Link className="search-submit concept-cta" href="/opportunites/marches-publics">Rechercher un appel d’offres ↗</Link><Link className="search-submit concept-cta" href="/developpement-commercial/accompagnement-appels-offres">Voir l’accompagnement complet ↗</Link></div>
    </section>
  </main>;
}
