import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
  title: "Sources d’étude de marché — MajestiOS",
  description: "Choisir, croiser et documenter les sources économiques utiles à une étude de marché sans confondre signal et preuve."
};

const sourceFamilies = [
  { title: "Publications et données officielles", text: "Statistiques publiques, publications administratives, registres et annonces officielles. Vérifier le champ couvert, la date de publication et la définition de chaque indicateur." },
  { title: "Informations sur les entreprises", text: "Identité, activité déclarée, implantation et événements juridiques accessibles. Une création, une cession ou un changement administratif ne prouve pas à lui seul l’existence d’un besoin d’achat." },
  { title: "Marchés et consultations", text: "Avis de marchés publics, consultations privées publiées et documents de consultation autorisés. Distinguer la date de publication, la date limite, l’objet, le lot et le statut de la consultation." },
  { title: "Sites professionnels et organisateurs", text: "Catalogues sectoriels, fédérations, salons et pages officielles. Vérifier la représentativité, les conditions d’accès et la date de mise à jour." },
  { title: "Signaux de terrain", text: "Entretiens, retours commerciaux et observations documentées. Préciser qui a été interrogé, dans quel contexte et avec quelles limites avant de généraliser un constat." }
];

export default function SourcesEtudePage() {
  return <main className="public-site concept-page">
    <PublicHeader />
    <section className="how-section concept-hero"><div>
      <span className="section-label">DÉVELOPPEMENT COMMERCIAL · SOURCES</span>
      <h1>La qualité d’une étude dépend aussi de <em>la qualité de ses sources.</em></h1>
      <p>MajestiOS vise à rapprocher des informations économiques et commerciales utiles. Pour rester exploitable, chaque élément doit garder sa provenance, sa date, son périmètre et son niveau de fiabilité.</p>
      <div className="hero-actions"><Link className="button-primary" href="/developpement-commercial/etudes-de-marche/methodologie">Consulter la méthodologie <span aria-hidden="true">→</span></Link><Link className="button-secondary" href="/business/veille-bodacc">Comprendre la veille BODACC</Link></div>
    </div></section>
    <section className="concept-principles"><span className="section-label">FAMILLES DE SOURCES</span><h2>Des sources complémentaires, à qualifier séparément</h2><div className="bodacc-signal-grid">{sourceFamilies.map((item) => <article className="bodacc-signal-card" key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section>
    <section className="concept-principles"><span className="section-label">GRILLE DE QUALIFICATION</span><h2>Avant de réutiliser une information</h2><div className="bodacc-principle-grid">
      <div><strong>Provenance</strong><span>Quelle source originale permet de retrouver et contrôler l’information ?</span></div>
      <div><strong>Fraîcheur</strong><span>Quand l’information a-t-elle été publiée, observée et vérifiée ?</span></div>
      <div><strong>Périmètre</strong><span>À quelle entreprise, zone, période, activité ou catégorie se rapporte-t-elle réellement ?</span></div>
      <div><strong>Usage autorisé</strong><span>Les conditions d’accès, les droits, la confidentialité et les règles de réutilisation sont-ils respectés ?</span></div>
      <div><strong>Corroboration</strong><span>Un autre élément indépendant confirme-t-il le constat, ou s’agit-il d’un signal isolé ?</span></div>
      <div><strong>Limites</strong><span>Qu’est-ce que cette information ne permet pas de conclure ?</span></div>
    </div></section>
    <section className="concept-principles"><h2>Du signal à l’action, sans raccourci</h2><p>Une donnée administrative peut ouvrir une piste de recherche, mais elle ne doit pas être présentée comme un besoin commercial confirmé. Avant une prise de contact, le contexte doit être vérifié et la démarche doit respecter les règles applicables à la source et au destinataire.</p><p><strong>État du service :</strong> cette page décrit une méthode de qualification. Elle ne prétend pas que toutes les sources sont déjà connectées ni que la collecte est exhaustive ou automatisée.</p><div className="route-actions"><Link className="search-submit concept-cta" href="/business/intelligence-entreprises">Lire les signaux économiques ↗</Link><Link className="search-submit concept-cta" href="/developpement-commercial/prospection">Passer à la prospection ↗</Link></div></section>
    <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/developpement-commercial/etudes-de-marche">Études de marché</Link><Link href="/faq">FAQ</Link></footer>
  </main>;
}
