import Link from "next/link";
import SiteHeader from "@/components/navigation/site-header";

export const metadata = {
  title: "FAQ — Comprendre MajestiOS",
  description: "Réponses aux questions fréquentes sur MajestiOS, les opportunités professionnelles, les sources et l'état des fonctionnalités.",
};

const groups = [
  { title: "Comprendre MajestiOS", items: [
    ["Qu'est-ce que MajestiOS ?", "MajestiOS est un projet de plateforme professionnelle d'intelligence commerciale. Son objectif est d'aider les professionnels à détecter des signaux, qualifier des opportunités, mieux comprendre les entreprises et organiser leurs actions commerciales."],
    ["MajestiOS est-il un annuaire ou un CRM ?", "Non. La vision dépasse un annuaire ou un CRM traditionnel : elle relie la recherche d'opportunités, la connaissance des entreprises, les interlocuteurs, les activités et la mémoire commerciale. Certaines de ces fonctions restent à développer."],
    ["À qui la plateforme s'adresse-t-elle ?", "Elle vise notamment les entreprises, artisans, indépendants, commerciaux, prospecteurs et organisations qui cherchent à détecter ou exploiter des opportunités professionnelles. Les parcours et fonctions disponibles seront précisés au fur et à mesure du développement."],
  ]},
  { title: "Opportunités et sources", items: [
    ["D'où viennent les opportunités ?", "Les sources prévues comprennent notamment BOAMP pour les marchés publics, ainsi que BODACC et les données du répertoire SIRENE pour certains événements et informations sur les entreprises. Chaque source doit être intégrée, vérifiée et documentée séparément."],
    ["Le BODACC permet-il de repérer les créations et les cessions ?", "Certaines annonces publiées peuvent signaler des événements liés à la vie des entreprises, dont des ventes ou cessions. La couverture dépend des catégories publiées. Une annonce ne garantit pas qu'une opération est encore disponible ni qu'elle représente une opportunité commerciale."],
    ["Les résultats sont-ils tous vérifiés ?", "Les résultats doivent conserver leur source et leurs dates. Les informations externes peuvent être incomplètes ou évoluer : il faut consulter la publication d'origine et vérifier les éléments importants avant d'agir."],
    ["Puis-je chercher des entreprises près de chez moi ?", "Le radar des nouvelles entreprises et la recherche géographique font partie de la vision cible. Leur disponibilité dépendra des sources intégrées, des filtres réellement opérationnels et des règles applicables à la prospection."],
  ]},
  { title: "Compte, données et fonctionnalités", items: [
    ["Puis-je déjà créer un espace membre ?", "L'espace membre est prévu dans l'architecture cible. Il ne doit être considéré comme opérationnel que lorsque l'inscription, l'authentification, les autorisations et les parcours de données auront été implémentés et testés."],
    ["Les alertes et les opportunités enregistrées fonctionnent-elles ?", "Ces fonctions font partie des parcours envisagés. Leur disponibilité doit être confirmée dans l'application avant de les considérer comme actives."],
    ["L'intelligence artificielle décide-t-elle à ma place ?", "La vision est de fournir une assistance à la recherche, à la qualification et à la préparation d'actions. Les résultats générés par l'IA doivent être distingués des faits sourcés et rester vérifiables par l'utilisateur."],
    ["Comment sont traitées les données professionnelles ?", "Le projet doit conserver la provenance des données, limiter les accès et respecter les conditions de réutilisation des sources ainsi que les règles applicables à la prospection et aux données personnelles. Les mécanismes précis doivent être vérifiés dans la version utilisée."],
  ]},
  { title: "Participer au projet", items: [
    ["Comment rejoindre MajestiOS ?", "La page Nous rejoindre présente les publics et collaborations envisagés. Les conditions précises et les parcours de candidature devront être confirmés avant qu'une candidature puisse être considérée comme enregistrée."],
    ["Comment signaler une question ou une idée ?", "Vous pouvez consulter la page Nous rejoindre pour comprendre les possibilités de contribution. Un canal de contact ne doit être considéré comme actif que s'il est réellement connecté et surveillé."],
  ]},
];

export default function FaqPage() {
  return <main className="public-site concept-page">
    <SiteHeader />
    <section className="how-section concept-hero"><div>
      <span className="section-label">AIDE ET PÉDAGOGIE</span>
      <h1>Comprendre MajestiOS, <em>simplement.</em></h1>
      <p>Cette FAQ explique la vision de la plateforme, les sources envisagées et les précautions à connaître. Elle distingue volontairement les objectifs du projet des fonctions déjà disponibles.</p>
    </div></section>
    <section className="faq-content" aria-label="Questions fréquentes">
      {groups.map(group => <section className="faq-group" key={group.title}>
        <h2>{group.title}</h2>
        {group.items.map(([question, answer]) => <details className="faq-item" key={question}>
          <summary>{question}</summary><p>{answer}</p>
        </details>)}
      </section>)}
    </section>
    <section className="concept-principles"><h2>Vous découvrez MajestiOS ?</h2><p>Commencez par la présentation du concept, puis explorez les opportunités publiques ou privées. Les fonctions en préparation sont indiquées comme telles.</p><div className="faq-actions"><Link className="search-submit concept-cta" href="/comment-et-pourquoi">Comprendre le concept</Link><Link className="faq-secondary" href="/nous-rejoindre">Nous rejoindre</Link></div></section>
    <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><nav aria-label="Liens de pied de page"><Link href="/comment-et-pourquoi">Le concept</Link><Link href="/reseaux">Réseaux</Link><Link href="/espace-membre">Espace membre</Link><Link href="/nous-rejoindre">Nous rejoindre</Link><Link href="/mentions-legales">Mentions légales</Link></nav><small>© MajestiOS · Plateforme en développement</small></footer>
  </main>;
}
