import Link from "next/link";
import SiteHeader from "@/components/navigation/site-header";
import SiteFooter from "@/components/navigation/site-footer";

export const metadata = {
  title: "Business : achat, vente et cession — MajestiOS",
  description: "La vision MajestiOS pour organiser les opportunités d'achat, de vente, de cession et de reprise d'entreprise.",
};

const modes = [
  { title: "Acheter ou reprendre", text: "Explorer à terme les entreprises, fonds de commerce et activités proposés à la reprise, avec des informations sur la source et l'état de l'annonce." },
  { title: "Vendre ou céder", text: "Préparer la présentation d'une entreprise ou d'un fonds de commerce et, si le service est développé, organiser les informations nécessaires à la recherche d'un repreneur." },
  { title: "Repérer des annonces", text: "Utiliser certaines annonces publiées, notamment celles du BODACC lorsque la catégorie s'y prête, comme des signaux à vérifier plutôt que comme une preuve qu'une cession est toujours disponible." },
  { title: "Préparer la mise en relation", text: "À terme, structurer les informations utiles et les prochaines étapes tout en respectant la confidentialité et les autorisations des parties." },
];

export default function BusinessPage() {
  return <main className="public-site concept-page">
    <SiteHeader />
    <section className="how-section concept-hero"><div><span className="section-label">BUSINESS · ACHAT, VENTE, CESSION</span><h1>Relier les projets de reprise aux <em>bonnes informations.</em></h1><p>MajestiOS vise à réunir les annonces, les signaux économiques et les outils de qualification utiles aux professionnels qui s'intéressent à la transmission d'entreprise. Une annonce légale, une offre publiée par un membre et une opportunité vérifiée doivent rester clairement différenciées.</p></div></section>
    <section className="concept-grid" aria-label="Parcours Business">
      {modes.map((item,index) => <article key={item.title}><span>{String(index+1).padStart(2,"0")}</span><h2>{item.title}</h2><p>{item.text}</p></article>)}
    </section>
    <section className="concept-principles"><h2>Un événement publié n'est pas une disponibilité garantie</h2><p>Une annonce peut être ancienne, incomplète ou ne plus correspondre à une transaction en cours. Tout résultat devra afficher sa source et ses dates, et inviter à vérifier la disponibilité avant d'engager une démarche.</p><p>Le catalogue Business, les dépôts d'annonces et les fonctions de mise en relation ne sont pas encore opérationnels. Cette page décrit la cible produit.</p><div className="faq-actions"><Link className="search-submit concept-cta" href="/opportunites">Explorer les opportunités</Link><Link className="faq-secondary" href="/aide/faq">Consulter la FAQ</Link></div></section>
    <SiteFooter />
  </main>;
}
