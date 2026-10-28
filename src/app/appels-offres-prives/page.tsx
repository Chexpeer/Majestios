import SiteHeader from "@/components/navigation/site-header";
import SiteFooter from "@/components/navigation/site-footer";
import Link from "next/link";

export const metadata = { title: "Appels d’offres privés — MajestiOS", description: "Découvrez le fonctionnement des opportunités privées sur MajestiOS." };

export default function PrivateTendersPage() {
  return <main className="public-site concept-page">
    <SiteHeader />
    <section className="how-section concept-hero"><div><span className="section-label">OPPORTUNITÉS PRIVÉES</span><h1>Des opportunités au-delà des <em>marchés publics.</em></h1><p>Cette rubrique est destinée à accueillir les consultations et opportunités privées diffusées avec autorisation. Elles seront séparées des avis publics et clairement identifiées.</p></div></section>
    <section className="concept-principles"><span className="private-label">PRIVÉ</span><h2>Un espace en préparation</h2><p>Le catalogue réel des opportunités privées n’est pas encore raccordé. Aucun exemple de démonstration n’est présenté comme une annonce réelle. Les futures fiches pourront préciser le secteur, la localisation, les conditions d’accès et le lien ou formulaire de contact autorisé.</p><p>Le détail des opportunités et les éventuelles informations réservées seront accessibles selon les règles de diffusion et les droits de l’utilisateur.</p><Link className="search-submit concept-cta" href="/">Retour à la recherche publique</Link></section>
    <SiteFooter />
  </main>;
}
