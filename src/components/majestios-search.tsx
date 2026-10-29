"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { flattenSiteTree, type SiteNode } from "@/data/site-tree";

type SearchScope = "site" | "public-tenders";

function sectionForPath(pathname: string) {
  if (pathname.startsWith("/opportunites")) return { label: "Opportunités", root: "/opportunites", placeholder: "Marchés, salons, emploi…" };
  if (pathname.startsWith("/business")) return { label: "Intelligence économique", root: "/business", placeholder: "Entreprises, créations, cessions…" };
  if (pathname.startsWith("/developpement-commercial")) return { label: "Développement commercial", root: "/developpement-commercial", placeholder: "Prospection, ciblage, accompagnement…" };
  if (pathname.startsWith("/reseaux")) return { label: "Réseaux professionnels", root: "/reseaux", placeholder: "Réseaux, annuaires, interlocuteurs…" };
  if (pathname.startsWith("/comprendre") || pathname === "/faq") return { label: "Ressources", root: "/comprendre", placeholder: "Concepts, guides, questions…" };
  return { label: "Toutes les rubriques", root: "", placeholder: "Une rubrique, une ressource, une fonctionnalité…" };
}

function matchesContext(node: SiteNode, root: string) {
  return !root || node.href === root || node.href.startsWith(root + "/");
}

export default function MajestiosSearch() {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<SearchScope>("site");
  const [submitted, setSubmitted] = useState(false);
  const context = sectionForPath(pathname);
  const allNodes = useMemo(() => flattenSiteTree().filter((node) => node.href !== "/"), []);
  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("fr-FR");
    if (!normalized) return [];
    return allNodes
      .filter((node) => matchesContext(node, context.root))
      .filter((node) => `${node.label} ${node.description}`.toLocaleLowerCase("fr-FR").includes(normalized))
      .slice(0, 6);
  }, [allNodes, context.root, query]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    if (!value) {
      setSubmitted(true);
      return;
    }
    if (scope === "public-tenders") {
      router.push(`/opportunites/marches-publics?${new URLSearchParams({ q: value }).toString()}`);
      setSubmitted(false);
      return;
    }
    setSubmitted(true);
  }

  return (
    <section className="maj-search" aria-label="Recherche MajestiOS">
      <form className="maj-search-form" onSubmit={handleSubmit} role="search">
        <span className="maj-search-icon" aria-hidden="true">⌕</span>
        <label className="maj-search-input-label">
          <span className="sr-only">Rechercher dans MajestiOS</span>
          <input
            type="search"
            value={query}
            onChange={(event) => { setQuery(event.target.value); setSubmitted(false); }}
            onFocus={() => setSubmitted(false)}
            placeholder={context.placeholder}
            maxLength={160}
            aria-label={`Recherche dans ${context.label}`}
          />
        </label>
        <label className="maj-search-scope">
          <span className="sr-only">Type de recherche</span>
          <select value={scope} onChange={(event) => { setScope(event.target.value as SearchScope); setSubmitted(false); }} aria-label="Type de recherche">
            <option value="site">Rubriques MajestiOS</option>
            <option value="public-tenders">Appels d’offres publics</option>
          </select>
        </label>
        <button type="submit" className="maj-search-submit">Rechercher <span aria-hidden="true">↗</span></button>
      </form>
      {submitted && scope === "site" ? (
        <div className="maj-search-results" role="status">
          {query.trim() ? results.length ? (
            <>
              <div className="maj-search-results-heading">Résultats dans {context.label.toLocaleLowerCase("fr-FR")}</div>
              {results.map((node) => (
                <Link href={node.href} key={node.href} className="maj-search-result" onClick={() => setSubmitted(false)}>
                  <span><strong>{node.label}</strong><small>{node.description}</small></span><span aria-hidden="true">↗</span>
                </Link>
              ))}
            </>
          ) : <p className="maj-search-empty">Aucune rubrique correspondante. Essayez un terme plus général ou choisissez « Appels d’offres publics » pour interroger le flux de recherche dédié.</p>
          : <p className="maj-search-empty">Saisissez un mot-clé pour rechercher une rubrique ou une ressource.</p>}
        </div>
      ) : null}
    </section>
  );
}
