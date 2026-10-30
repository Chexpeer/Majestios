"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteTree } from "@/data/site-tree";

const visibleItems = siteTree.filter((item) =>
  ["/opportunites", "/business", "/developpement-commercial", "/reseaux", "/comprendre"].includes(item.href)
);

const statusLabels: Record<string, string> = { pending_data: "En attente de données", preparing: "En préparation" };

const statusBadge = (status?: string) => status && status !== "ready" ? <span className={`home-sidebar-status${status === "pending_data" ? " is-pending-data" : ""}`}>{statusLabels[status] ?? status}</span> : null;

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

  return (
    <>
      <button type="button" className="home-mobile-menu-button" aria-expanded={mobileOpen} aria-controls="majestic-primary-navigation" onClick={() => setMobileOpen((open) => !open)}>
        <span aria-hidden="true">{mobileOpen ? "×" : "☰"}</span> Menu
      </button>
      {mobileOpen ? <button type="button" className="home-mobile-menu-backdrop" aria-label="Fermer le menu" onClick={() => setMobileOpen(false)} /> : null}
    <aside id="majestic-primary-navigation" className={`home-sidebar${mobileOpen ? " is-mobile-open" : ""}`}>
      <Link href="/" onClick={() => setMobileOpen(false)} className="home-sidebar-brand" aria-label="MajestiOS — accueil">
        <span className="home-sidebar-mark" aria-hidden="true"><svg className="brand-crown" viewBox="0 0 32 22" focusable="false"><path d="M3 18 1 5l8 5 7-9 7 9 8-5-2 13Z" fill="currentColor"/><path d="M4 20h24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg><svg className="brand-triangle" viewBox="0 0 36 30" focusable="false"><path d="M18 2.5 33.5 27H2.5Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/></svg></span>
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
                  <Link href={item.href} onClick={() => setMobileOpen(false)} className="home-sidebar-overview">Vue d’ensemble</Link>
                  {children.map((child) => {
                    const childActive = pathname === child.href || pathname.startsWith(child.href + "/");
                    return (
                      <div className="home-sidebar-branch" key={child.href}>
                        <Link
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className={childActive ? "home-sidebar-sub is-active" : "home-sidebar-sub"}
                          aria-current={pathname === child.href ? "page" : undefined}
                        >
                          {child.label}{statusBadge(child.status)}
                        </Link>
                        {childActive && child.children?.length ? (
                          <div className="home-sidebar-leaves" aria-label={`Sous-rubriques : ${child.label}`}>
                            {child.children.map((leaf) => (
                              <Link
                                key={leaf.href}
                                href={leaf.href}
                                onClick={() => setMobileOpen(false)}
                                className={pathname === leaf.href || pathname.startsWith(leaf.href + "/") ? "home-sidebar-leaf is-active" : "home-sidebar-leaf"}
                                aria-current={pathname === leaf.href ? "page" : undefined}
                              >
                                {leaf.label}{statusBadge(leaf.status)}
                              </Link>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </details>
            </div>
          );
        })}
      </nav>
      <div className="home-sidebar-bottom">
        <Link href="/espace-professionnel" onClick={() => setMobileOpen(false)}>Espace professionnel <span aria-hidden="true">↗</span></Link>
        <Link href="/faq" onClick={() => setMobileOpen(false)}>Aide & FAQ</Link>
        <small>Détecter · Qualifier · Transformer</small>
      </div>
    </aside>
    </>
  );
}
