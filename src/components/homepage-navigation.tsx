"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteTree } from "@/data/site-tree";

const visibleItems = siteTree.filter((item) =>
  ["/opportunites", "/business", "/developpement-commercial", "/reseaux", "/comprendre"].includes(item.href)
);

const icons: Record<string, string> = {
  "/opportunites": "⌕",
  "/business": "↗",
  "/developpement-commercial": "◎",
  "/reseaux": "♧",
  "/comprendre": "◇",
};

export default function HomepageNavigation() {
  const pathname = usePathname();

  return (
    <aside className="home-sidebar">
      <Link href="/" className="home-sidebar-brand" aria-label="MajestiOS — accueil">
        <span className="home-sidebar-mark">M<span>✦</span></span>
        <span><strong>MajestiOS</strong><small>INTELLIGENCE COMMERCIALE</small></span>
      </Link>
      <span className="home-sidebar-caption">EXPLORER</span>
      <nav className="home-sidebar-nav" aria-label="Navigation principale">
        {visibleItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const children = item.children ?? [];

          return (
            <div key={item.href} className="home-sidebar-group">
              <details className="home-sidebar-dropdown" open={active && children.length > 0}>
                <summary className={active ? "is-active" : ""}>
                  <span className="home-sidebar-icon" aria-hidden="true">{icons[item.href] ?? "◇"}</span>
                  <span className="home-sidebar-label">{item.label}</span>
                  <span className="home-sidebar-chevron" aria-hidden="true">⌄</span>
                </summary>
                <div className="home-sidebar-dropdown-content">
                  <Link href={item.href} className="home-sidebar-overview">Vue d’ensemble</Link>
                  {children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={pathname === child.href || pathname.startsWith(child.href + "/") ? "home-sidebar-sub is-active" : "home-sidebar-sub"}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </details>
            </div>
          );
        })}
      </nav>
      <div className="home-sidebar-bottom">
        <Link href="/espace-professionnel">Espace professionnel <span aria-hidden="true">↗</span></Link>
        <Link href="/faq">Aide & FAQ</Link>
        <small>Détecter · Qualifier · Transformer</small>
      </div>
    </aside>
  );
}
