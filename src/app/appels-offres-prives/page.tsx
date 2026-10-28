"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PublicHeader from "@/components/public-header";

const examples = [
  { type: "Prestations de services", area: "Grand Est", label: "Exemple de présentation" },
  { type: "Travaux professionnels", area: "Île-de-France", label: "Exemple de présentation" },
  { type: "Fournitures et équipements", area: "Auvergne-Rhône-Alpes", label: "Exemple de présentation" },
  { type: "Maintenance et conseil", area: "France entière", label: "Exemple de présentation" },
];

export default function PrivateTendersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchTerm(params.get("q")?.trim() ?? "");
  }, []);

  return <main className="public-site concept-page">
    <PublicHeader />
    <section className="how-section concept-hero"><div><span className="section-label">OPPORTUNITÉS PRIVÉES</span><h1>Des opportunités au-delà des <em>marchés publics.</em></h1><p>Cette rubrique est destinée à accueillir les consultations et opportunités privées diffusées avec autorisation. Elles seront séparées des avis publics et clairement identifiées.</p></div></section>
    <section className="private-ticker-page">\n      {searchTerm && <div className="empty-results no-results-opportunity" role="status"><span className="no-results-kicker">VOTRE RECHERCHE</span><h3>Vous recherchez : « {searchTerm} »</h3><p>Le catalogue d’opportunités privées n’est pas encore connecté. Vous pouvez consulter les autres rubriques ou préparer la publication gratuite de votre propre besoin.</p><div className="no-results-actions"><Link className="no-results-action" href="/appels-offres-publics">Marchés publics</Link><Link className="no-results-action" href="/offres-emploi">Emploi & missions</Link><Link className="no-results-action no-results-action-create" href={`/espace-professionnel?intention=opportunite&source=recherche-privee&titre=${encodeURIComponent(searchTerm)}`}>Préparer une publication gratuite ↗</Link></div></div>}
      <div className="private-heading"><div><span className="section-label">FIL D’OPPORTUNITÉS</span><h2>Un aperçu des consultations privées</h2><p>Le bandeau défile de droite à gauche et restera compact pour laisser la priorité aux informations utiles.</p></div><span className="private-label">PRIVÉ</span></div>
      <div className="ticker-window private-page-ticker"><div className="ticker-track">{[...examples,...examples].map((item,index)=><article className="private-teaser private-page-teaser" key={item.type+index}><span className="private-label">PRIVÉ · EXEMPLE</span><strong>{item.type}</strong><span className="teaser-location">⌖ {item.area}</span><small>{item.label} — annonce non réelle</small></article>)}</div></div>
      <p className="ticker-disclaimer">Les cartes présentées sont des exemples de mise en page et ne sont pas des consultations réelles. Le catalogue sera activé uniquement lorsque des sources autorisées et des règles de diffusion seront établies.</p>
    </section>
    <section className="concept-principles"><h2>Un espace en préparation</h2><p>Les futures fiches pourront préciser le secteur, la localisation, les conditions d’accès et le lien ou formulaire de contact autorisé. Le détail des opportunités et les éventuelles informations réservées seront accessibles selon les règles de diffusion et les droits de l’utilisateur.</p><Link className="search-submit concept-cta" href="/espace-professionnel?intention=opportunite&source=opportunites-privees">Préparer une publication privée gratuite ↗</Link><p className="ticker-disclaimer">La publication gratuite est prévue dans le parcours cible, mais le formulaire connecté et l’enregistrement des annonces ne sont pas encore activés.</p><Link className="search-submit concept-cta" href="/faq#appels-offres">Questions fréquentes sur les appels d’offres ↗</Link><Link className="search-submit concept-cta" href="/appels-offres-publics">Explorer les appels d’offres publics ↗</Link></section>
    <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><nav aria-label="Liens de pied de page"><Link href="/offres-emploi">Emploi et missions</Link><Link href="/nous-rejoindre">Nous rejoindre</Link><Link href="/faq">FAQ</Link><Link href="/mentions-legales">Mentions légales</Link></nav><small>© MajestiOS · Site en construction</small></footer>
  </main>;
}
