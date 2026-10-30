"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { siteTree } from "@/data/site-tree";
import { generalNodes } from "@/data/navigation/general";
import type { SiteNode } from "@/data/navigation/types";

const primaryItems = siteTree.filter((item) =>
  ["/opportunites", "/emploi", "/business", "/developpement-commercial", "/reseaux", "/comprendre"].includes(item.href)
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
  "/emploi": "◎",
  "/business": "↗",
  "/developpement-commercial": "◎",
  "/reseaux": "♧",
  "/comprendre": "◇",
};

const domainClasses: Record<string, string> = {
  "/opportunites": "domain-opportunities",
  "/emploi": "domain-employment",
  "/business": "domain-business",
  "/developpement-commercial": "domain-commercial",
  "/reseaux": "domain-networks",
  "/comprendre": "domain-understanding",
};

const aliases: Record<string, string[]> = {
  "/comprendre": ["/faq", "/comment-et-pourquoi"],
};

export default function HomepageNavigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  const closeMobile = () => setMobileOpen(false);
  const isActive = (href: string) =>
    pathname === href ||
    pathname.startsWith(href + "/") ||
    (aliases[href] ?? []).includes(pathname);

  const isExpanded = (node: SiteNode) =>
    expandedNodes[node.href] ?? isActive(node.href);

  const toggleNode = (href: string) =>
    setExpandedNodes((current) => ({ ...current, [href]: !(current[href] ?? isActive(href)) }));

  function renderNode(node: SiteNode, depth: number): ReactNode {
    const active = isActive(node.href);
    const children = node.children ?? [];
    const open = children.length > 0 && isExpanded(node);
    const linkClass =
      depth === 0
        ? `home-sidebar-top-link${active ? " is-active" : ""}`
        : depth === 1
          ? `home-sidebar-sub${active ? " is-active" : ""}`
          : `home-sidebar-leaf${active ? " is-active" : ""}`;
    const containerClass = depth === 0 ? `home-sidebar-group ${domainClasses[node.href] ?? ""}` : "home-sidebar-branch";
    const childrenClass = depth === 0 ? "home-sidebar-dropdown-content" : "home-sidebar-leaves";

    return (
      <div key={node.href} className={containerClass}>
        <div className="home-sidebar-top-row">
          {children.length > 0 ? (
            <>
              <button
                type="button"
                className={`${linkClass} home-sidebar-menu-toggle`}
                aria-expanded={open}
                aria-controls={`submenu-${node.href.replace(/[^a-zA-Z0-9_-]/g, "-")}`}
                onClick={() => toggleNode(node.href)}
              >
                {depth === 0 ? <span className="home-sidebar-icon" aria-hidden="true">{icons[node.href] ?? "◇"}</span> : null}
                <span className={depth === 0 ? "home-sidebar-label" : undefined}>{node.label}</span>
                {depth > 0 ? statusBadge(node.status) : null}
                <span className="home-sidebar-inline-chevron" aria-hidden="true">{open ? "−" : "+"}</span>
              </button>
              <Link href={node.href} onClick={closeMobile} className="home-sidebar-direct-link" aria-label={`Ouvrir le dossier ${node.label}`} aria-current={pathname === node.href ? "page" : undefined}>↗</Link>
            </>
          ) : (
            <Link href={node.href} onClick={closeMobile} className={linkClass} aria-current={pathname === node.href ? "page" : undefined}>
              {depth === 0 ? <span className="home-sidebar-icon" aria-hidden="true">{icons[node.href] ?? "◇"}</span> : null}
              <span className={depth === 0 ? "home-sidebar-label" : undefined}>{node.label}</span>
              {depth > 0 ? statusBadge(node.status) : null}
            </Link>
          )}
        </div>
        {open ? (
          <div id={`submenu-${node.href.replace(/[^a-zA-Z0-9_-]/g, "-")}`} className={childrenClass} aria-label={`Sous-rubriques de ${node.label}`}>
            {children.map((child) => renderNode(child, depth + 1))}
          </div>
        ) : null}
      </div>
    );
  }

  const generalGroupOpen = expandedNodes["/entrees-generales"] ?? generalNodes.some((node) => isActive(node.href));

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

          {primaryItems.map((item) => renderNode(item, 0))}

          <div className="home-sidebar-group domain-general">
            <div className="home-sidebar-top-row">
              <div className="home-sidebar-top-link" aria-label="Entrées générales">
                <span className="home-sidebar-icon" aria-hidden="true">⋯</span>
                <span className="home-sidebar-label">Entrées générales</span>
              </div>
              <button
                type="button"
                className="home-sidebar-expand"
                aria-label={`${generalGroupOpen ? "Masquer" : "Afficher"} les entrées générales`}
                aria-expanded={generalGroupOpen}
                onClick={() => setExpandedNodes((current) => ({
                  ...current,
                  "/entrees-generales": !(current["/entrees-generales"] ?? generalNodes.some((node) => isActive(node.href))),
                }))}
              >
                <span aria-hidden="true">{generalGroupOpen ? "−" : "+"}</span>
              </button>
            </div>
            {generalGroupOpen ? (
              <div className="home-sidebar-dropdown-content" aria-label="Entrées générales">
                {generalNodes.map((node) => renderNode(node, 1))}
              </div>
            ) : null}
          </div>
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
