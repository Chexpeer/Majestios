"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PublicHeader from "@/components/public-header";
import AnnouncementTicker from "@/components/announcement-ticker";

export default function PrivateTendersSearch() {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchTerm((params.get("q")?.trim() ?? "").slice(0, 120));
  }, []);

  return <main className="public-site concept-page">
    <PublicHeader />
    <AnnouncementTicker flow="private" />
    <section className="how-section concept-hero"><div><span className="section-label">OPPORTUNITÉS PRIVÉES</span><h1>Des opportunités au-delà des <em>marchés publics.</em></h1><p>Cette rubrique est destinée à accueillir les consultations et opportunités privées diffusées avec autorisation. Elles seront séparées des avis publics et clairement identifiées.</p></div></section>
    <section className="private-ticker-page">
      {searchTerm && <div className="empty-results no-results-opportunity" role="status"><span className="no-results-kicker">VOTRE RECHERCHE</span><h3>Vous recherchez : « {searchTerm} »</h3><p>Le catalogue d’opportunités privées n’est pas encore connecté. Vous pouvez consulter les autres rubriques ou préparer la publication gratuite de votre propre besoin.</p><div className="no-results-actions"><Link className="no-results-action" href="/opportunites/marches-publics">Marchés publics</Link><Link className="no-results-action" href="/opportunites/emploi">Emploi & missions</Link><Link className="no-results-action no-results-action-create" href={`/espace-professionnel?intention=opportunite&source=recherche-privee&titre=${encodeURIComponent(searchTerm)}`}>Préparer une publication gratuite ↗</Link></div></div>}
      <div className="private-heading"><div><span className="section-label">RECHERCHE MULTICRITÈRE</span><h2>Rechercher une opportunité privée</h2><p>Indiquez votre besoin pour préparer une recherche. Le catalogue réel n’est pas encore connecté : aucun résultat fictif ne sera affiché.</p></div><span className="private-label">PRIVÉ</span></div>
      <form className="private-search-form" action="/appels-offres-prives" method="get">
        <label htmlFor="private-search-term">Mot-clé ou type de besoin</label>
        <div className="private-search-controls"><input id="private-search-term" name="q" type="search" maxLength={120} defaultValue={searchTerm} placeholder="Ex. maintenance, fournitures, sous-traitance" /><button className="search-submit" type="submit">Rechercher ↗</button></div>
        <p className="ticker-disclaimer">Les critères de secteur et de localisation seront ajoutés avec la connexion du catalogue autorisé.</p>
      </form>
    </section>
    <section className="concept-principles"><h2>Un espace en préparation</h2><p>Les futures fiches pourront préciser le secteur, la localisation, les conditions d’accès et le lien ou formulaire de contact autorisé. Le détail des opportunités et les éventuelles informations réservées seront accessibles selon les règles de diffusion et les droits de l’utilisateur.</p><Link className="search-submit concept-cta" href="/espace-professionnel?intention=opportunite&source=opportunites-privees">Préparer une publication privée gratuite ↗</Link><p className="ticker-disclaimer">La publication gratuite est prévue dans le parcours cible, mais le formulaire connecté et l’enregistrement des annonces ne sont pas encore activés.</p><Link className="search-submit concept-cta" href="/comprendre/faq">Questions fréquentes sur les appels d’offres ↗</Link><Link className="search-submit concept-cta" href="/opportunites/marches-publics">Explorer les appels d’offres publics ↗</Link></section>
    <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><nav aria-label="Liens de pied de page"><Link href="/opportunites/emploi">Emploi et missions</Link><Link href="/nous-rejoindre">Nous rejoindre</Link><Link href="/comprendre/faq">FAQ</Link><Link href="/mentions-legales">Mentions légales</Link></nav><small>© MajestiOS · Site en construction</small></footer>
  </main>;
}
