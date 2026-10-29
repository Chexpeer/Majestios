"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteTree } from "@/data/site-tree";

const visibleItems = siteTree.filter((item) =>
  ["/opportunites", "/business", "/developpement-commercial", "/reseaux", "/comprendre"].includes(item.href)
);

export default function HomepageNavigation() {
  const pathname = usePathname();
  return <aside className="home-sidebar">
    <Link href="/" className="home-sidebar-brand" aria-label="MajestiOS — accueil">
      <span className="home-sidebar-mark">M<span>✦</span></span>
      <span><strong>MajestiOS</strong><small>INTELLIGENCE COMMERCIALE</small></span>
    </Link>
    <span className="home-sidebar-caption">EXPLORER</span>
    <nav className="home-sidebar-nav" aria-label="Navigation principale">
      {visibleItems.map((item) => <div key={item.href} className="home-sidebar-group">
        <Link href={item.href} className={pathname === item.href || pathname.startsWith(item.href + "/") ? "is-active" : ""}>
          <span aria-hidden="true">{item.href === "/opportunites" ? "⌕" : item.href === "/business" ? "↗" : item.href === "/developpement-commercial" ? "◎" : item.href === "/reseaux" ? "♧" : "◇"}</span>
          {item.label}
        </Link>
        {item.children?.slice(0, 4).map((child) => <Link key={child.href} href={child.href} className="home-sidebar-sub">{child.label}</Link>)}
      </div>)}
    </nav>
    <div className="home-sidebar-bottom">
      <Link href="/espace-professionnel">Espace professionnel <span aria-hidden="true">↗</span></Link>
      <Link href="/faq">Aide & FAQ</Link>
      <small>Détecter · Qualifier · Transformer</small>
    </div>
  </aside>;
}
