"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteTree } from "@/data/site-tree";

export default function PublicHeader() {
  const pathname = usePathname();
  const mainSectionHrefs = ["/opportunites", "/business", "/developpement-commercial", "/reseaux", "/comprendre"];
  const mainItems = siteTree.filter((item) => mainSectionHrefs.includes(item.href));
  return <header className="site-header">
    <Link href="/" className="brand-lockup" aria-label="MajestiOS, accueil">
      <span className="brand-mark" aria-hidden="true"><svg className="brand-crown" viewBox="0 0 32 22" focusable="false"><path d="M3 18 1 5l8 5 7-9 7 9 8-5-2 13Z" fill="currentColor"/><path d="M4 20h24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg><svg className="brand-triangle" viewBox="0 0 36 30" focusable="false"><path d="M18 2.5 33.5 27H2.5Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/></svg></span>
      <span className="brand-wordmark">MajestiOS<small>INTELLIGENCE COMMERCIALE</small></span>
    </Link>
    <nav className="main-navigation" aria-label="Navigation principale">
      {mainItems.map((item) => <div className={`nav-group ${pathname === item.href || pathname.startsWith(item.href + "/") ? "is-active" : ""}`} key={item.href}>
        <Link href={item.href} className="nav-top-link" aria-current={pathname === item.href ? "page" : undefined}>{item.label}<span aria-hidden="true">⌄</span></Link>
        {item.children?.length ? <div className="nav-dropdown">
          {item.children.map((child) => <Link href={child.href} className={`nav-dropdown-link ${pathname === child.href ? "is-active" : ""}`} key={child.href} aria-current={pathname === child.href ? "page" : undefined}>
            <strong>{child.label}</strong><small>{child.description}</small>
          </Link>)}
        </div> : null}
      </div>)}
    </nav>
    <Link className="header-member-link" href="/espace-professionnel">Espace pro <span aria-hidden="true">↗</span></Link>
  </header>;
}
