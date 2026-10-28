import Link from "next/link";
import PublicHeader from "@/components/public-header";
import { findSiteNode, flattenSiteTree } from "@/data/site-tree";

export default function SiteHub({ pathname, intro, eyebrow = "EXPLORER MAJESTIOS", checklist = [] }: { pathname: string; intro?: string; eyebrow?: string; checklist?: string[] }) {
  const found = findSiteNode(pathname);
  const node = found?.node;
  const children = node?.children ?? [];
  const siblings = found?.ancestors.at(-1)?.children?.filter((item) => item.href !== pathname) ?? [];
  const related = siblings.length ? siblings.slice(0, 4) : flattenSiteTree().filter((item) => item.href !== pathname && item.href !== "/" && !item.children?.length).slice(0, 4);
  return <main className="site-page">
    <PublicHeader />
    <div className="page-container">
      <nav className="breadcrumbs" aria-label="Fil d’Ariane"><Link href="/">Accueil</Link>{found?.ancestors.map((ancestor) => <span key={ancestor.href}><b>/</b><Link href={ancestor.href}>{ancestor.label}</Link></span>)}<span><b>/</b><strong>{node?.label ?? "Rubrique"}</strong></span></nav>
      <section className="page-hero">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{node?.label ?? "Explorer MajestiOS"}<span>.</span></h1>
        <p>{intro ?? node?.description ?? "Explorez les rubriques et les parcours de MajestiOS."}</p>
        <div className="page-hero-meta"><span className="status-chip"><i />Architecture en construction</span><span>Une rubrique dédiée, une URL dédiée.</span></div>
      </section>
      {children.length > 0 ? <section className="hub-grid" aria-label={`Sous-rubriques de ${node?.label}`}>{children.map((child, index) => <Link href={child.href} className="hub-card" key={child.href}><span className="hub-card-index">{String(index + 1).padStart(2, "0")}</span><div><h2>{child.label}<span aria-hidden="true">↗</span></h2><p>{child.description}</p></div><span className="hub-card-bottom">EXPLORER LA RUBRIQUE <b>→</b></span></Link>)}</section> : <section className="content-panel"><span className="eyebrow">EN PRÉPARATION</span><h2>Cette page sera documentée avant l’ouverture du service.</h2><p>Nous ne publions pas de chiffres, de délais, de références réglementaires ou d’annonces non vérifiés. Les informations utiles seront ajoutées à partir de sources identifiables.</p>{checklist.length ? <ul>{checklist.map((item) => <li key={item}>{item}</li>)}</ul> : null}</section>}
      {checklist.length > 0 && children.length > 0 ? <section className="content-panel"><span className="eyebrow">MÉTHODE</span><h2>Avant de passer à l’action</h2><ul>{checklist.map((item) => <li key={item}>{item}</li>)}</ul></section> : null}
      <section className="related-section"><div><span className="eyebrow">POUR ALLER PLUS LOIN</span><h2>Rubriques associées</h2></div><div className="related-links">{related.map((item) => <Link href={item.href} key={item.href}>{item.label}<span>↗</span></Link>)}</div></section>
      <footer className="page-footer"><span>MAJESTIOS · DÉTECTER → QUALIFIER → IDENTIFIER → CONTACTER → TRANSFORMER → CAPITALISER</span><Link href="/comprendre/faq">Besoin d’aide ?</Link></footer>
    </div>
  </main>;
}
