"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const groups = [
  { title: "DÉCOUVRIR", links: [{ label: "Accueil", href: "/", icon: "⌂" }, { label: "Le concept", href: "/comment-et-pourquoi", icon: "◈" }, { label: "Toutes les opportunités", href: "/opportunites", icon: "✳" }] },
  { title: "OPPORTUNITÉS", links: [{ label: "Marchés publics", href: "/appels-offres-publics", icon: "⌑" }, { label: "Opportunités privées", href: "/appels-offres-prives", icon: "↗" }, { label: "Emploi & missions", href: "/offres-emploi", icon: "◎" }, { label: "Radar entreprises", href: "/opportunites/radar-entreprises", icon: "⌕" }, { label: "Business", href: "/business", icon: "⇄" }] },
  { title: "DÉVELOPPEMENT", links: [{ label: "Intelligence commerciale", href: "/intelligence-commerciale", icon: "✳" }, { label: "Prospection", href: "/developpement-commercial/prospection", icon: "➚" }, { label: "Études de marché", href: "/developpement-commercial/etudes-de-marche", icon: "▥" }, { label: "E-réputation", href: "/developpement-commercial/e-reputation", icon: "◉" }] },
  { title: "ÉCOSYSTÈME", links: [{ label: "Réseaux professionnels", href: "/reseaux", icon: "♧" }, { label: "Nous rejoindre", href: "/nous-rejoindre", icon: "＋" }] },
];

export default function PublicHeader() {
  const pathname = usePathname();
  return (
    <aside className="public-sidebar">
      <Link className="public-brand" href="/" aria-label="MajestiOS, accueil">
        <span className="public-brand-mark">M</span>
        <span><strong>MajestiOS</strong><small>INTELLIGENCE COMMERCIALE B2B</small></span>
      </Link>
      <nav className="public-side-nav" aria-label="Navigation principale">
        {groups.map((group) => <div className="public-side-group" key={group.title}>
          <span className="public-side-caption">{group.title}</span>
          {group.links.map((item) => <Link key={item.href} className={`public-side-link ${pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/")) ? "is-current" : ""}`} href={item.href} aria-current={pathname === item.href ? "page" : undefined}>
            <span className="public-side-icon" aria-hidden="true">{item.icon}</span>{item.label}
          </Link>)}
        </div>)}
      </nav>
      <div className="public-side-bottom">
        <Link className="public-side-faq" href="/faq"><span aria-hidden="true">?</span><span><strong>FAQ & aide</strong><small>Comprendre MajestiOS</small></span></Link>
        <Link className="header-login" href="/espace-professionnel">Espace professionnel ↗</Link>
        <small className="public-side-status">Plateforme en construction progressive</small>
      </div>
    </aside>
  );
}
