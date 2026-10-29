import Link from "next/link";
import { findSiteNode } from "@/data/site-tree";
import { dedicatedGuides, type DetailGuide } from "@/data/dedicated-guides";


function getDetailGuide(pathname: string, label: string): DetailGuide {
  const guide = dedicatedGuides[pathname];
  if (guide) return guide;

  // Garde-fou uniquement : le test dedicated-guides.test.ts impose un guide
  // métier explicite pour chaque route navigable. Ce texte ne doit donc pas
  // servir de contenu normal à une rubrique publiée.
  return {
    title: `Guide à compléter : ${label}`,
    purpose: "Le contenu métier de cette rubrique doit être défini dans dedicated-guides.ts avant sa mise à disposition.",
    checks: ["Préciser l’objectif propre à cette rubrique", "Définir les critères de qualification utiles", "Décrire les limites et les informations à vérifier"],
    next: "Compléter le guide spécialisé puis ajouter ou maintenir le test de couverture des routes avant de considérer cette rubrique comme prête."
  };
}

export default function SiteHub({ pathname, intro, eyebrow = "EXPLORER MAJESTIOS", checklist = [] }: { pathname: string; intro?: string; eyebrow?: string; checklist?: string[] }) {
  const found = findSiteNode(pathname);
  const node = found?.node;
  const children = node?.children ?? [];
  const siblings = found?.ancestors.at(-1)?.children?.filter((item) => item.href !== pathname) ?? [];
  const related = siblings.slice(0, 4);
  const guide = getDetailGuide(pathname, node?.label ?? "cette rubrique");
  const parent = found?.ancestors.at(-1);
  const isPreparing = node?.status === "preparing";
  const pageNature = isPreparing ? "Fonctionnalité en préparation" : children.length ? "Dossier de navigation et de méthode" : "Guide méthodologique — outil non intégré à cette page";
  const actionHref = pathname.startsWith("/opportunites/marches-publics") ? "/opportunites/marches-publics" : parent?.href ?? "/opportunites";
  const actionLabel = pathname.startsWith("/opportunites/marches-publics") ? "Ouvrir la recherche de marchés publics" : parent ? `Revenir au dossier « ${parent.label} »` : "Explorer les opportunités";
  const domainClass = pathname.startsWith("/opportunites") ? "domain-opportunites" : pathname.startsWith("/business") ? "domain-business" : pathname.startsWith("/developpement-commercial") ? "domain-commercial" : pathname.startsWith("/reseaux") ? "domain-reseaux" : pathname.startsWith("/comprendre") || pathname === "/faq" || pathname === "/comment-et-pourquoi" ? "domain-comprendre" : "domain-general";
  return <main className={`site-page site-page-with-sidebar ${domainClass}`}>
    <div className="page-container">
      <nav className="breadcrumbs" aria-label="Fil d’Ariane"><Link href="/">Accueil</Link>{found?.ancestors.map((ancestor) => <span key={ancestor.href}><b>/</b><Link href={ancestor.href}>{ancestor.label}</Link></span>)}<span><b>/</b><strong>{node?.label ?? "Rubrique"}</strong></span></nav>
      <section className="page-hero">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{node?.label ?? "Explorer MajestiOS"}<span>.</span></h1>
        <p>{intro ?? node?.description ?? "Explorez les rubriques et les parcours de MajestiOS."}</p>
        <div className="page-hero-meta"><span className={`status-chip ${isPreparing ? "status-chip-preparing" : ""}`}><i />{pageNature}</span><span>Rubrique dédiée · {parent ? `Parcours : ${parent.label}` : "Navigation MajestiOS"}</span></div><div className="route-actions"><Link className="search-submit concept-cta" href={actionHref}>{actionLabel} →</Link></div>{isPreparing ? <p className="capability-notice" role="note"><strong>Transparence :</strong> le parcours est décrit, mais la fonctionnalité de dépôt ou de traitement n’est pas encore activée. Cette page ne permet pas de soumettre une annonce ni de déclencher un traitement.</p> : !children.length ? <p className="capability-notice" role="note"><strong>Nature de cette page :</strong> elle fournit une méthode de qualification. Elle ne confirme pas qu’un outil automatisé, un annuaire ou une connexion de source est actif.</p> : null}
      </section>
      {children.length > 0 ? <><section className="content-panel dossier-overview"><span className="eyebrow">COMPRENDRE CE DOSSIER</span><h2>{guide.title}</h2><p>{guide.purpose}</p><h3>Les points à examiner</h3><ul>{guide.checks.map((item) => <li key={item}>{item}</li>)}</ul><h3>Logique de progression</h3><p>{guide.next}</p></section><section className="hub-grid" aria-label={`Dossiers et sous-rubriques de ${node?.label}`}><div className="hub-grid-heading"><span className="eyebrow">ARBORESCENCE DU DOSSIER</span><h2>Approfondir par sous-dossier</h2><p>Chaque entrée ouvre une rubrique dédiée, avec son propre contexte et ses prochaines étapes.</p></div>{children.map((child, index) => <Link href={child.href} className="hub-card" key={child.href}><span className="hub-card-index">{String(index + 1).padStart(2, "0")}</span>{child.status === "preparing" ? <span className="hub-card-status">EN PRÉPARATION</span> : null}<div><h2>{child.label}<span aria-hidden="true">↗</span></h2><p>{child.description}</p></div><span className="hub-card-bottom">OUVRIR LE SOUS-DOSSIER <b>→</b></span></Link>)}</section></> : <section className="content-panel">
        <span className="eyebrow">MODE D’EMPLOI</span><h2>{guide.title}</h2><p>{guide.purpose}</p>
        <h3>Les points à examiner</h3><ul>{guide.checks.map((item) => <li key={item}>{item}</li>)}</ul>
        <h3>Avant de passer à l’action</h3><p>{guide.next}</p>
        {checklist.length ? <><h3>Repères complémentaires</h3><ul>{checklist.map((item) => <li key={item}>{item}</li>)}</ul></> : null}
      </section>}
      {related.length > 0 ? <section className="related-section"><div><span className="eyebrow">POUR ALLER PLUS LOIN</span><h2>Rubriques associées</h2></div><div className="related-links">{related.map((item) => <Link href={item.href} key={item.href}>{item.label}<span>↗</span></Link>)}</div></section> : null}
      <footer className="page-footer"><span>MAJESTIOS · DÉTECTER → QUALIFIER → IDENTIFIER → CONTACTER → TRANSFORMER → CAPITALISER</span><Link href="/faq">Besoin d’aide ?</Link></footer>
    </div>
  </main>;
}
