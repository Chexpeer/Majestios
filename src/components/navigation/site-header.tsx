import Link from "next/link";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/#recherche", label: "Marchés publics" },
  { href: "/appels-offres-prives", label: "Opportunités privées" },
  { href: "/comment-et-pourquoi", label: "Intelligence commerciale" },
  { href: "/reseaux", label: "Réseaux" },
  { href: "/nous-rejoindre", label: "Nous rejoindre" },
  { href: "/aide/faq", label: "FAQ" },
];

export default function SiteHeader() {
  return (
    <header className="public-header">
      <Link className="public-brand" href="/" aria-label="MajestiOS, accueil">
        <span className="public-brand-mark">M</span>
        <span><strong>MajestiOS</strong><small>INTELLIGENCE COMMERCIALE</small></span>
      </Link>
      <nav className="public-nav" aria-label="Navigation principale">
        {links.map((link) => <Link href={link.href} key={link.href + link.label}>{link.label}</Link>)}
      </nav>
      <Link className="header-login" href="/espace-membre">Espace membre</Link>
    </header>
  );
}
