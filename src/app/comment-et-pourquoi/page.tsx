import Link from "next/link";

export const metadata = {
  title: "Comment et pourquoi MajestiOS ? — MajestiOS",
  description: "Découvrez le concept MajestiOS et comment la plateforme veut aider les professionnels à détecter et transformer les opportunités commerciales.",
};

export default function ConceptPage() {
  return (
    <main className="public-site concept-page">
      

      <section className="how-section concept-hero">
        <div>
          <span className="section-label">LE CONCEPT MAJESTIOS</span>
          <h1>Comment et pourquoi <em>MajestiOS</em> ?</h1>
          <p>Une opportunité ne se limite pas à une annonce. MajestiOS organise un parcours progressif : détecter le signal, qualifier sa pertinence, identifier les acteurs concernés, préparer le contact, transformer l’échange en action utile et capitaliser sur les enseignements.</p>
        </div>
      </section>

      <section className="concept-grid" aria-label="Les six étapes du parcours MajestiOS">
        <article><span>01</span><h2>Détecter</h2><p>Repérer les appels d’offres, événements, signaux économiques et autres occasions issues de sources identifiées.</p></article>
        <article><span>02</span><h2>Qualifier</h2><p>Vérifier la source, l’actualité, les conditions et l’adéquation de l’opportunité avec le profil de l’entreprise.</p></article>
        <article><span>03</span><h2>Identifier</h2><p>Déterminer les entreprises, décideurs ou compétences pertinentes à partir d’informations recoupées.</p></article>
        <article><span>04</span><h2>Contacter</h2><p>Préparer une prise de contact contextualisée, utile et respectueuse des règles applicables.</p></article>
        <article><span>05</span><h2>Transformer</h2><p>Faire progresser l’opportunité vers un échange, une proposition, une candidature ou une coopération concrète.</p></article>
        <article><span>06</span><h2>Capitaliser</h2><p>Conserver les résultats, les décisions et les enseignements afin d’améliorer les démarches suivantes.</p></article>
      </section>

      <section className="concept-principles">
        <span className="section-label">NOTRE APPROCHE</span>
        <h2>De l’information à l’action commerciale</h2>
        <p>MajestiOS est conçu comme une plateforme professionnelle de développement commercial assisté par IA. Son ambition est de rapprocher la recherche d’opportunités, leur qualification, les études de marché et le suivi commercial dans un parcours cohérent.</p>
        <p>Le copilote IA doit aider l’utilisateur à rechercher, analyser et préparer son travail, tout en distinguant les données sourcées des hypothèses et des informations à vérifier. Les fonctionnalités sont mises en service progressivement : cette page présente le concept cible, pas une promesse que tous les modules sont déjà opérationnels.</p>
        <Link className="search-submit concept-cta" href="/">Découvrir la recherche d’appels d’offres</Link>
      </section>

      <footer className="public-footer">
        <Link className="footer-brand" href="/">MajestiOS</Link>
        <nav aria-label="Liens de pied de page">
          <span aria-current="page">Comment et pourquoi MajestiOS ?</span>
          <Link href="/nous-rejoindre">Nous rejoindre</Link>
          <Link href="/mentions-legales">Mentions légales</Link>
        </nav>
        <small>© MajestiOS · Site en construction</small>
      </footer>
    </main>
  );
}
