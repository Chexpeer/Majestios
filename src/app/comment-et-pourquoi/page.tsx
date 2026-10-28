import SiteHeader from "@/components/navigation/site-header";
import Link from "next/link";

export const metadata = {
  title: "Comment et pourquoi MajestiOS ? — MajestiOS",
  description: "Découvrez le concept MajestiOS et comment la plateforme veut aider les professionnels à détecter et transformer les opportunités commerciales.",
};

export default function ConceptPage() {
  return (
    <main className="public-site concept-page">
      <SiteHeader />

      <section className="how-section concept-hero">
        <div>
          <span className="section-label">LE CONCEPT MAJESTIOS</span>
          <h1>Comment et pourquoi <em>MajestiOS</em> ?</h1>
          <p>Une opportunité ne se limite pas à une annonce. Il faut la repérer, comprendre l’entreprise concernée, identifier les bons interlocuteurs, décider de la suite et conserver les connaissances acquises.</p>
        </div>
      </section>

      <section className="concept-grid" aria-label="Les étapes du concept MajestiOS">
        <article><span>01</span><h2>Détecter</h2><p>Rassembler les opportunités pertinentes à partir de sources identifiées, publiques ou privées lorsque leur diffusion est autorisée.</p></article>
        <article><span>02</span><h2>Comprendre</h2><p>Qualifier l’opportunité et son contexte, étudier le marché et identifier les entreprises susceptibles d’être concernées.</p></article>
        <article><span>03</span><h2>Agir</h2><p>Préparer les démarches commerciales et organiser les prochaines actions avec méthode.</p></article>
        <article><span>04</span><h2>Capitaliser</h2><p>Conserver les informations utiles et l’historique dans une mémoire d’entreprise structurée, avec des accès maîtrisés.</p></article>
      </section>

      <section className="concept-principles">
        <span className="section-label">NOTRE APPROCHE</span>
        <h2>De l’information à l’action commerciale</h2>
        <p>MajestiOS est conçu comme une plateforme professionnelle d’intelligence commerciale assistée par IA. Son ambition est de rapprocher la veille, la qualification, les études de marché et le suivi commercial dans un parcours cohérent.</p>
        <p>Le copilote IA doit aider l’utilisateur à rechercher, analyser et préparer son travail, tout en distinguant les données sourcées des hypothèses et des informations à vérifier. Les fonctionnalités sont mises en service progressivement : cette page présente le concept cible, pas une promesse que tous les modules sont déjà opérationnels.</p>
        <Link className="search-submit concept-cta" href="/">Découvrir la recherche d’appels d’offres</Link>
      </section>

      <footer className="public-footer">
        <Link className="footer-brand" href="/">MajestiOS</Link>
        <nav aria-label="Liens de pied de page">
          <Link href="/comment-et-pourquoi">Comment et pourquoi MajestiOS ?</Link>
          <Link href="/nous-rejoindre">Nous rejoindre</Link>
          <Link href="/mentions-legales">Mentions légales</Link>
        </nav>
        <small>© MajestiOS · Site en construction</small>
      </footer>
    </main>
  );
}
