"use client";

import Link from "next/link";

export default function PublicHeader() {
  return (
    <header className="public-header">
      <Link className="public-brand" href="/" aria-label="MajestiOS, accueil">
        <span className="public-brand-mark">M</span>
        <span><strong>MajestiOS</strong><small>INTELLIGENCE COMMERCIALE B2B</small></span>
      </Link>
      <nav className="public-nav" aria-label="Navigation principale">
        <Link href="/">Accueil</Link>
        <Link href="/appels-offres-publics">Appels d’offres publics</Link>
        <Link href="/appels-offres-prives">Appels d’offres privés</Link>
        <details className="nav-dropdown">
          <summary>Développement commercial <span aria-hidden="true">⌄</span></summary>
          <div className="nav-dropdown-menu">
            <Link href="/developpement-commercial">Vue d’ensemble</Link>
            <Link href="/developpement-commercial/prospection">Prospection commerciale</Link>
            <Link href="/developpement-commercial/etudes-de-marche">Études de marché</Link>
            <Link href="/developpement-commercial/accompagnement-appels-offres">Accompagnement aux appels d’offres</Link>
            <Link href="/developpement-commercial/e-reputation">E-réputation</Link>
            <Link href="/business">Diagnostic Business</Link>
          </div>
        </details>
        <Link href="/reseaux">Réseaux</Link>
        <Link href="/nous-rejoindre">Nous rejoindre</Link>
      </nav>
      <Link className="header-login" href="/espace-professionnel">Espace professionnel</Link>
    </header>
  );
}
