import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = {
  title: "Proposer une opportunité privée — MajestiOS",
  description: "Comprendre les informations et contrôles nécessaires avant la publication d’une opportunité commerciale privée sur MajestiOS."
};

const checks = [
  {title:"Identifier l’annonceur",text:"Préciser l’entreprise, le rôle de la personne qui soumet l’annonce et le moyen de vérifier qu’elle est autorisée à la publier."},
  {title:"Décrire le besoin",text:"Présenter l’objet, les compétences ou prestations recherchées, le territoire concerné, les échéances et les conditions utiles à la qualification."},
  {title:"Protéger les informations",text:"Ne pas transmettre de secrets commerciaux, de coordonnées personnelles superflues ni de documents confidentiels sans base légitime et cadre approprié."},
  {title:"Vérifier la publication",text:"Prévoir une vérification de l’authenticité, de l’actualité, de la clarté et des droits de diffusion avant toute publication."}
];

export default function DeposerMarchePrivePage() {
  return <main className="public-site concept-page">
    <PublicHeader />
    <section className="how-section concept-hero"><div>
      <span className="section-label">OPPORTUNITÉS · ANNONCE PRIVÉE</span>
      <h1>Proposer une opportunité privée <em>à qualifier.</em></h1>
      <p>MajestiOS vise à faciliter la découverte d’opportunités privées, tout en protégeant la confiance des entreprises. Une annonce ne doit être diffusée qu’après vérification de son origine, de son contenu et de l’autorisation de publication.</p>
      <div className="hero-actions"><Link className="button-primary" href="/opportunites/marches-prives">Découvrir les marchés privés <span aria-hidden="true">→</span></Link><Link className="button-secondary" href="/opportunites">Retour aux opportunités</Link></div>
    </div></section>
    <section className="concept-principles"><span className="section-label">PRÉPARER UNE ANNONCE</span><h2>Les contrôles indispensables</h2><ol className="bodacc-steps">{checks.map((item) => <li key={item.title}><span aria-hidden="true">•</span><div><h3>{item.title}</h3><p>{item.text}</p></div></li>)}</ol></section>
    <section className="concept-principles"><h2>Publication contrôlée</h2><p>Les annonces privées peuvent contenir des informations sensibles. La publication doit respecter les droits de l’annonceur, les engagements de confidentialité, les règles applicables aux données personnelles et les éventuelles conditions imposées par la source d’origine.</p><p><strong>État actuel :</strong> cette page explique le processus attendu. Le formulaire de dépôt, la vérification d’identité de l’annonceur et la modération intégrée ne sont pas présentés ici comme des services déjà opérationnels. N’envoyez pas de documents confidentiels par cette page.</p><div className="route-actions"><Link className="search-submit concept-cta" href="/opportunites/marches-prives/secteur">Explorer les secteurs ↗</Link><Link className="search-submit concept-cta" href="/faq">Consulter la FAQ ↗</Link></div></section>
    <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/opportunites">Opportunités</Link><Link href="/confidentialite">Confidentialité</Link></footer>
  </main>;
}
