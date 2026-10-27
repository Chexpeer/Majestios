import Link from "next/link";

export const metadata = {
  title: "Merci pour votre demande — MajestiOS",
  description: "Confirmation de réception de votre demande par MajestiOS.",
};

export default function MerciPage() {
  return <main className="public-site concept-page">
    <header className="public-header">
      <Link className="public-brand" href="/"><span className="public-brand-mark">M</span><span><strong>MajestiOS</strong><small>MERCI POUR VOTRE DEMANDE</small></span></Link>
      <nav className="public-nav"><Link href="/">Accueil</Link><Link href="/developpement-commercial">Développement commercial</Link><Link href="/partenaires">Partenaires</Link></nav>
    </header>
    <section className="how-section concept-hero">
      <div>
        <span className="section-label">DEMANDE TRANSMISE</span>
        <h1>Merci pour votre <em>confiance.</em></h1>
        <p>Votre formulaire a été transmis. L’équipe MajestiOS pourra prendre connaissance des informations envoyées et revenir vers vous si un suivi est possible.</p>
        <p>Cette confirmation ne signifie pas qu’une analyse automatique de votre entreprise a déjà été réalisée.</p>
        <Link className="search-submit concept-cta" href="/">Retour à l’accueil ↗</Link>
        <p><Link href="/business">Envoyer une autre demande</Link></p>
      </div>
    </section>
    <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><nav><Link href="/developpement-commercial">Développement commercial</Link><Link href="/mentions-legales">Mentions légales</Link></nav><small>© MajestiOS · Prototype en développement</small></footer>
  </main>;
}
