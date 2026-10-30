"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteTree } from "@/data/site-tree";

const primaryItems = siteTree.filter((item) =>
  ["/opportunites", "/business", "/developpement-commercial", "/reseaux", "/comprendre"].includes(item.href)
);

const statusLabels: Record<string, string> = {
  pending_data: "En attente de données",
  preparing: "En préparation",
};

const statusBadge = (status?: string) =>
  status && status !== "ready" ? (
    <span className={`home-sidebar-status${status === "pending_data" ? " is-pending-data" : ""}`}>
      {statusLabels[status] ?? status}
    </span>
  ) : null;

const icons: Record<string, string> = {
  "/": "⌂",
  "/opportunites": "⌕",
  "/business": "↗",
  "/developpement-commercial": "◎",
  "/reseaux": "♧",
  "/comprendre": "◇",
};

const domainClasses: Record<string, string> = {
  "/opportunites": "domain-opportunities",
  "/business": "domain-business",
  "/developpement-commercial": "domain-commercial",
  "/reseaux": "domain-networks",
  "/comprendre": "domain-understanding",
};

export default function HomepageNavigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <button
        type="button"
        className="home-mobile-menu-button"
        aria-expanded={mobileOpen}
        aria-controls="majestic-primary-navigation"
        onClick={() => setMobileOpen((open) => !open)}
      >
        <span aria-hidden="true">{mobileOpen ? "×" : "☰"}</span>
        {mobileOpen ? "Fermer" : "Menu"}
      </button>
      {mobileOpen ? (
        <button
          type="button"
          className="home-mobile-menu-backdrop"
          aria-label="Fermer le menu"
          onClick={closeMobile}
        />
      ) : null}

      <aside
        id="majestic-primary-navigation"
        className={`home-sidebar${mobileOpen ? " is-mobile-open" : ""}`}
      >
        <Link href="/" onClick={closeMobile} className="home-sidebar-brand" aria-label="MajestiOS — accueil">
          <span className="home-sidebar-mark" aria-hidden="true">
            <svg className="brand-crown" viewBox="0 0 32 22" focusable="false">
              <path d="M3 18 1 5l8 5 7-9 7 9 8-5-2 13Z" fill="currentColor" />
              <path d="M4 20h24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <svg className="brand-triangle" viewBox="0 0 36 30" focusable="false">
              <path d="M18 2.5 33.5 27H2.5Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
            </svg>
          </span>
          <span><strong>MajestiOS</strong><small>INTELLIGENCE COMMERCIALE</small></span>
        </Link>

        <span className="home-sidebar-caption">NAVIGATION</span>
        <nav className="home-sidebar-nav" aria-label="Navigation principale">
          <Link
            href="/"
            onClick={closeMobile}
            className={`home-sidebar-home${pathname === "/" ? " is-active" : ""}`}
            aria-current={pathname === "/" ? "page" : undefined}
          >
            <span aria-hidden="true">{icons["/"]}</span>
            <span>Accueil</span>
          </Link>

          {primaryItems.map((item) => {
            const aliases: Record<string, string[]> = {
              "/comprendre": ["/faq", "/comment-et-pourquoi"],
            };
            const active =
              pathname === item.href ||
              pathname.startsWith(item.href + "/") ||
              (aliases[item.href] ?? []).includes(pathname);
            const children = item.children ?? [];
            const isExpanded = expanded === item.href || (expanded === null && active && children.length > 0);
            const domainClass = domainClasses[item.href] ?? "";

            return (
              <div key={item.href} className={`home-sidebar-group ${domainClass}`}>
                <div className="home-sidebar-top-row">
                  <Link
                    href={item.href}
                    onClick={closeMobile}
                    className={`home-sidebar-top-link${active ? " is-active" : ""}`}
                    aria-current={pathname === item.href ? "page" : undefined}
                  >
                    <span className="home-sidebar-icon" aria-hidden="true">{icons[item.href] ?? "◇"}</span>
                    <span className="home-sidebar-label">{item.label}</span>
                  </Link>
                  {children.length > 0 ? (
                    <button
                      type="button"
                      className="home-sidebar-expand"
                      aria-label={`${isExpanded ? "Masquer" : "Afficher"} les dossiers de ${item.label}`}
                      aria-expanded={isExpanded}
                      onClick={() => setExpanded(isExpanded ? null : item.href)}
                    >
                      <span aria-hidden="true">{isExpanded ? "−" : "+"}</span>
                    </button>
                  ) : null}
                </div>

                {children.length > 0 && isExpanded ? (
                  <div className="home-sidebar-dropdown-content">
                    {children.map((child) => {
                      const childActive = pathname === child.href || pathname.startsWith(child.href + "/");
                      return (
                        <div className="home-sidebar-branch" key={child.href}>
                          <Link
                            href={child.href}
                            onClick={closeMobile}
                            className={childActive ? "home-sidebar-sub is-active" : "home-sidebar-sub"}
                            aria-current={pathname === child.href ? "page" : undefined}
                          >
                            <span>{child.label}</span>{statusBadge(child.status)}
                          </Link>
                          {childActive && child.children?.length ? (
                            <div className="home-sidebar-leaves" aria-label={`Sous-rubriques : ${child.label}`}>
                              {child.children.map((leaf) => (
                                <Link
                                  key={leaf.href}
                                  href={leaf.href}
                                  onClick={closeMobile}
                                  className={pathname === leaf.href || pathname.startsWith(leaf.href + "/") ? "home-sidebar-leaf is-active" : "home-sidebar-leaf"}
                                  aria-current={pathname === leaf.href ? "page" : undefined}
                                >
                                  <span>{leaf.label}</span>{statusBadge(leaf.status)}
                                </Link>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="home-sidebar-bottom">
          <Link href="/espace-professionnel" onClick={closeMobile}>Espace professionnel <span aria-hidden="true">↗</span></Link>
          <Link href="/faq" onClick={closeMobile}>Aide & FAQ</Link>
          <small>Détecter · Qualifier · Transformer</small>
        </div>
      </aside>
    </>
  );
}
