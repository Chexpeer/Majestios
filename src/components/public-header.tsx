"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { siteTree } from "@/data/site-tree";

export default function PublicHeader() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navigationRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !navigationRef.current?.contains(event.target)) {
        setOpenMenu(null);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsideClick);
    };
  }, []);

  const mainItems = siteTree.filter((item) => !["/", "/espace-professionnel", "/confidentialite", "/mentions-legales"].includes(item.href));
  return <header className="site-header">
    <Link href="/" className="brand-lockup" aria-label="MajestiOS, accueil">
      <span className="brand-mark" aria-hidden="true">M<span>✦</span></span>
      <span className="brand-wordmark">MajestiOS<small>INTELLIGENCE COMMERCIALE</small></span>
    </Link>
    <nav ref={navigationRef} className="main-navigation" aria-label="Navigation principale">
      {mainItems.map((item) => <div className={`nav-group ${pathname === item.href || pathname.startsWith(item.href + "/") ? "is-active" : ""} ${openMenu === item.href ? "is-open" : ""}`} key={item.href}>
        <div className="nav-top-row"><Link href={item.href} className="nav-top-link" aria-current={pathname === item.href ? "page" : undefined} onClick={() => setOpenMenu(null)}>{item.label}</Link>{item.children?.length ? <button type="button" className="nav-top-toggle" aria-label={`${openMenu === item.href ? "Fermer" : "Ouvrir"} le sous-menu ${item.label}`} aria-expanded={openMenu === item.href} onClick={() => setOpenMenu(openMenu === item.href ? null : item.href)}><span aria-hidden="true">{openMenu === item.href ? "⌃" : "⌄"}</span></button> : null}</div>
        {item.children?.length ? <div className="nav-dropdown">
          {item.children.map((child) => <div className="nav-dropdown-group" key={child.href}>
            <Link href={child.href} className="nav-dropdown-link" onClick={() => setOpenMenu(null)}><strong>{child.label}</strong><small>{child.description}</small></Link>
            {child.children?.length ? <div className="nav-dropdown-nested">{child.children.map((leaf) => <Link href={leaf.href} key={leaf.href} onClick={() => setOpenMenu(null)}>{leaf.label}</Link>)}</div> : null}
          </div>)}
        </div> : null}
      </div>)}
    </nav>
    <Link className="header-member-link" href="/espace-professionnel">Espace pro <span aria-hidden="true">↗</span></Link>
  </header>;
}
