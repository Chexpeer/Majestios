import Link from "next/link";

export const metadata = { title: "Mentions légales — MajestiOS", description: "Page d’information juridique de MajestiOS en préparation." };

export default function LegalPlaceholderPage() {
  return <main className="public-site concept-page">
    <header className="public-header"><Link className="public-brand" href="/"><span className="public-brand-mark">M</span><span><strong>MajestiOS</strong><small>LES OPPORTUNITÉS PROFESSIONNELLES</small></span></Link><nav className="public-nav" aria-label="Navigation principale"><Link href="/">Accueil</Link><Link href="/comment-et-pourquoi">Comment et pourquoi MajestiOS ?</Link><Link href="/nous-rejoindre">Nous rejoindre</Link></nav></header>
    <section className="concept-principles"><span className="section-label">INFORMATIONS</span><h1>Mentions légales</h1><p>Cette page est réservée aux informations légales de MajestiOS. Son contenu sera rédigé et vérifié avant publication. Les informations obligatoires ne doivent pas être inventées ni considérées comme complètes à ce stade.</p><Link className="search-submit concept-cta" href="/">Retour à l’accueil</Link></section>
    <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/comment-et-pourquoi">Comment et pourquoi MajestiOS ?</Link><small>© MajestiOS · Contenu juridique en préparation</small></footer>
  </main>;
}
