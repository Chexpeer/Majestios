"use client";

import { usePathname } from "next/navigation";
import MajestiosSearch from "@/components/majestios-search";

/**
 * Les pages qui possèdent déjà un moteur métier gardent un seul champ de recherche.
 * Toutes les autres rubriques conservent la recherche transversale persistante.
 */
export default function GlobalSearchBar() {
  const pathname = usePathname();
  const hasDedicatedSearch = pathname === "/" || pathname === "/opportunites/marches-publics";
  if (hasDedicatedSearch) return null;
  return <div className="maj-global-search-wrap"><MajestiosSearch /></div>;
}
