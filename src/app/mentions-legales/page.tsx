import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = { title: "Mentions légales — MajestiOS", description: "Page d’information juridique de MajestiOS en préparation." };

export default function LegalPlaceholderPage() {
  return <main className="public-site concept-page">
    <PublicHeader />
    <section className="concept-principles"><span className="section-label">INFORMATIONS</span><h1>Mentions légales</h1><p>Cette page est réservée aux informations légales de MajestiOS. Son contenu sera rédigé et vérifié avant publication. Les informations obligatoires ne doivent pas être inventées ni considérées comme complètes à ce stade.</p><Link className="search-submit concept-cta" href="/">Retour à l’accueil</Link></section>
    <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><Link href="/comment-et-pourquoi">Comment et pourquoi MajestiOS ?</Link><small>© MajestiOS · Contenu juridique en préparation</small></footer>
  </main>;
}
