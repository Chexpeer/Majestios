import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Accueil", href: "/", icon: "⌂" },
  { label: "Opportunités", href: "/opportunites", icon: "↗" },
  { label: "Marchés publics", href: "/opportunites/marches-publics", icon: "▤" },
  { label: "Marchés privés", href: "/opportunites/marches-prives", icon: "◇" },
  { label: "Développement commercial", href: "/developpement-commercial", icon: "◎" },
  { label: "Réseaux professionnels", href: "/reseaux", icon: "♧" },
  { label: "Nous rejoindre", href: "/nous-rejoindre", icon: "＋" },
  { label: "Business", href: "/business", icon: "⌁" },
  { label: "Emploi & missions", href: "/opportunites/emploi", icon: "＋" },
];

export default function HomeSideNav() {
  const pathname = usePathname();
  return (
    <aside className="home-side-nav" aria-label="Navigation MajestiOS">
      <Link href="/" className="home-side-brand" aria-label="MajestiOS, accueil">
        <span className="home-side-mark" aria-hidden="true">
          <svg viewBox="0 0 32 22" focusable="false" aria-hidden="true"><path d="M3 18 1 5l8 5 7-9 7 9 8-5-2 13Z" fill="currentColor"/><path d="M4 20h24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          <b>M</b>
        </span>
        <span><strong>MajestiOS</strong><small>INTELLIGENCE COMMERCIALE</small></span>
      </Link>
      <span className="home-side-caption">NAVIGATION</span>
      <nav className="home-side-links">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className={pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href + "/")) ? "is-current" : ""} aria-current={pathname === link.href ? "page" : undefined}>
            <span className="home-side-icon" aria-hidden="true">{link.icon}</span>{link.label}
          </Link>
        ))}
      </nav>
      <div className="home-side-bottom">
        <Link href="/espace-professionnel" className="home-side-member">Espace professionnel <span aria-hidden="true">↗</span></Link>
        <Link href="/comprendre/concept">Comprendre MajestiOS</Link>
        <Link href="/comprendre/faq">FAQ & aide</Link>
        <p><i aria-hidden="true" /> Détecter · Qualifier · Transformer</p>
      </div>
    </aside>
  );
}
