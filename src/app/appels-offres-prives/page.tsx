import Link from "next/link";
import PublicHeader from "@/components/public-header";

export const metadata = { title: "Appels d’offres privés — MajestiOS", description: "Découvrez le fonctionnement des opportunités privées sur MajestiOS." };

export default function PrivateTendersPage() {
  return <main className="public-site concept-page">
    <PublicHeader />
    <section className="how-section concept-hero"><div><span className="section-label">OPPORTUNITÉS PRIVÉES</span><h1>Des opportunités au-delà des <em>marchés publics.</em></h1><p>Cette rubrique est destinée à accueillir les consultations et opportunités privées diffusées avec autorisation. Elles seront séparées des avis publics et clairement identifiées.</p></div></section>
    <section className="concept-principles"><span className="private-label">PRIVÉ</span><h2>Un espace en préparation</h2><p>Le catalogue réel des opportunités privées n’est pas encore raccordé. Aucun exemple de démonstration n’est présenté comme une annonce réelle. Les futures fiches pourront préciser le secteur, la localisation, les conditions d’accès et le lien ou formulaire de contact autorisé.</p><p>Le détail des opportunités et les éventuelles informations réservées seront accessibles selon les règles de diffusion et les droits de l’utilisateur.</p><Link className="search-submit concept-cta" href="/">Retour à la recherche publique</Link></section>
    <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><nav aria-label="Liens de pied de page"><Link href="/comment-et-pourquoi">Comment et pourquoi MajestiOS ?</Link><Link href="/nous-rejoindre">Nous rejoindre</Link><Link href="/mentions-legales">Mentions légales</Link></nav><small>© MajestiOS · Site en construction</small></footer>
  </main>;
}
