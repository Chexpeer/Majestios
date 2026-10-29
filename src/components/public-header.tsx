import Link from "next/link";

/**
 * En-tête de contexte des pages métier.
 * La navigation principale est portée une seule fois par la barre latérale globale.
 * Garder ici un second menu de rubriques créait deux navigations concurrentes.
 */
export default function PublicHeader() {
  return (
    <header className="site-header site-context-header">
      <Link href="/" className="brand-lockup" aria-label="MajestiOS, accueil">
        <span className="brand-mark" aria-hidden="true">M<span>✦</span></span>
        <span className="brand-wordmark">MajestiOS<small>INTELLIGENCE COMMERCIALE</small></span>
      </Link>
      <span className="site-context-note">Intelligence commerciale proactive</span>
      <Link className="header-member-link" href="/espace-professionnel">Espace pro <span aria-hidden="true">↗</span></Link>
    </header>
  );
}
