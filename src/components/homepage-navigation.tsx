"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteTree, type SiteNode } from "@/data/site-tree";

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
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderBranches = (nodes: SiteNode[]): React.ReactNode => nodes.map((child) => {
    const childActive = pathname === child.href || pathname.startsWith(child.href + "/");
    const descendants = child.children ?? [];
    const showDescendants = childActive && descendants.length > 0;
    return (
      <div className="home-sidebar-branch" key={child.href}>
        <Link
          href={child.href}
          onClick={() => setMobileOpen(false)}
          className={childActive ? "home-sidebar-sub is-active" : "home-sidebar-sub"}
          aria-current={pathname === child.href ? "page" : undefined}
        >
          {child.label}{child.status === "preparing" ? <span className="home-sidebar-status">En préparation</span> : null}
        </Link>
        {showDescendants ? <div className="home-sidebar-descendants" aria-label={"Sous-dossiers de " + child.label}>
          {renderBranches(descendants)}
        </div> : null}
      </div>
    );
  });

  useEffect(() => {
    if (!mobileOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileOpen]);

  return (
    <>
      <button type="button" className="home-mobile-menu-button" aria-expanded={mobileOpen} aria-controls="majestic-primary-navigation" onClick={() => setMobileOpen((open) => !open)}>
        <span aria-hidden="true">{mobileOpen ? "×" : "☰"}</span> Menu
      </button>
      {mobileOpen ? <button type="button" className="home-mobile-menu-backdrop" aria-label="Fermer le menu" onClick={() => setMobileOpen(false)} /> : null}
    <aside id="majestic-primary-navigation" className={`home-sidebar${mobileOpen ? " is-mobile-open" : ""}`}>
      <Link href="/" onClick={() => setMobileOpen(false)} className="home-sidebar-brand" aria-label="MajestiOS — accueil">
        <span className="home-sidebar-mark">M<span>✦</span></span>
        <span><strong>MajestiOS</strong><small>INTELLIGENCE COMMERCIALE</small></span>
      </Link>
      <span className="home-sidebar-caption">EXPLORER</span>
      <nav className="home-sidebar-nav" aria-label="Navigation principale">
        {visibleItems.map((item) => {
          const aliases: Record<string, string[]> = { "/comprendre": ["/faq", "/comment-et-pourquoi"] };
          const active = pathname === item.href || pathname.startsWith(item.href + "/") || (aliases[item.href] ?? []).includes(pathname);
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
                  <Link href={item.href} onClick={() => setMobileOpen(false)} className="home-sidebar-overview" aria-current={pathname === item.href ? "page" : undefined}>Vue d’ensemble</Link>
                  {renderBranches(children)}
                </div>
              </details>
            </div>
          );
        })}
      </nav>
      <div className="home-sidebar-bottom">
        <Link href="/espace-professionnel" onClick={() => setMobileOpen(false)} aria-current={pathname === "/espace-professionnel" ? "page" : undefined}>Espace professionnel <span aria-hidden="true">↗</span></Link>
        <Link href="/faq" onClick={() => setMobileOpen(false)} aria-current={pathname === "/faq" ? "page" : undefined}>Aide & FAQ</Link>
        <small>Détecter · Qualifier · Transformer</small>
      </div>
    </aside>
    </>
  );
}
