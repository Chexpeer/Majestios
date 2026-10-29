import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
  title: "Business : achat, vente et cession — MajestiOS",
  description: "Comprendre le parcours MajestiOS pour la veille sur les entreprises, les cessions et les reprises.",
};

const modes = [
  { title: "Acheter ou reprendre", text: "Repérer les signaux publics susceptibles d’indiquer une activité à reprendre, puis vérifier la source, la date et la situation réelle." },
  { title: "Vendre ou céder", text: "Préparer, à terme, les informations utiles à la présentation d’une entreprise ou d’un fonds de commerce, dans le respect de la confidentialité." },
  { title: "Qualifier un signal", text: "Distinguer une annonce légale, une annonce commerciale et une transaction réellement disponible. Une publication BODACC ne garantit pas qu’une cession soit encore en cours." },
  { title: "Préparer la mise en relation", text: "Structurer les informations utiles et les prochaines étapes. La mise en relation automatisée n’est pas activée dans cette version." },
];

export default function BusinessOpportunityPage() {
  return <main className="public-site concept-page">
    <PublicHeader />
    <section className="how-section concept-hero"><div>
      <span className="section-label">BUSINESS · ACHAT, VENTE, CESSION</span>
      <h1>Relier les projets de reprise aux <em>bonnes informations.</em></h1>
      <p>MajestiOS vise à rapprocher les annonces, les signaux économiques et les outils de qualification utiles aux professionnels qui s’intéressent à la transmission d’entreprise. Chaque résultat doit rester rattaché à sa source et à sa date.</p>
    </div></section>
    <section className="concept-grid" aria-label="Parcours Business">
      {modes.map((item,index) => <article key={item.title}><span>{String(index+1).padStart(2,"0")}</span><h2>{item.title}</h2><p>{item.text}</p></article>)}
    </section>
    <section className="concept-principles">
      <h2>Commencer par les annonces officielles</h2>
      <p>Le BODACC (Bulletin officiel des annonces civiles et commerciales) publie des informations juridiques et économiques pouvant aider à repérer certains événements concernant une entreprise. Elle ne confirme pas, à elle seule, qu’une entreprise est disponible à la vente ou qu’une transaction est toujours en cours.</p>
      <p>Le catalogue Business, les dépôts d’annonces et les fonctions de mise en relation ne sont pas encore opérationnels. Cette page présente le périmètre fonctionnel visé.</p>
      <div className="faq-actions"><Link className="search-submit concept-cta" href="/business/radar-bodacc">Découvrir le radar BODACC ↗</Link><Link className="faq-secondary" href="/business/achat-cession">Préparer une reprise ou une cession ↗</Link><Link className="faq-secondary" href="/opportunites/radar-entreprises">Explorer les signaux d’entreprise ↗</Link><Link className="faq-secondary" href="/developpement-commercial/etudes-de-marche">Étudier son marché ↗</Link><Link className="faq-secondary" href="/developpement-commercial/prospection">Préparer sa prospection ↗</Link><Link className="faq-secondary" href="/reseaux">Développer son réseau ↗</Link></div>
    </section>
    <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><nav><Link href="/comprendre/faq">FAQ</Link><Link href="/confidentialite">Confidentialité</Link><Link href="/mentions-legales">Mentions légales</Link></nav><small>© MajestiOS · Fonctionnalités de cession en préparation</small></footer>
  </main>;
}
