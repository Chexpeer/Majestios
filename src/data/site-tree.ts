import type { SiteNode } from "@/data/navigation/types";
import { homeNode } from "@/data/navigation/home";
import { opportunitiesNode } from "@/data/navigation/opportunities";
import { businessNode } from "@/data/navigation/business";
import { commercialDevelopmentNode } from "@/data/navigation/commercial-development";
import { networksNode } from "@/data/navigation/networks";
import { understandingNode } from "@/data/navigation/understanding";
import { generalNodes } from "@/data/navigation/general";

export type { SiteNode } from "@/data/navigation/types";

/**
 * Arbre public assemblé depuis des modules par domaine métier.
 * Chaque domaine peut évoluer indépendamment sans transformer ce fichier en catalogue monolithique.
 */
export const siteTree: SiteNode[] = [
  homeNode,
  opportunitiesNode,
  businessNode,
  commercialDevelopmentNode,
  networksNode,
  understandingNode,
  ...generalNodes
];

export function flattenSiteTree(nodes: SiteNode[] = siteTree): SiteNode[] {
  return nodes.flatMap((node) => [node, ...flattenSiteTree(node.children ?? [])]);
}

export function findSiteNode(pathname: string): { node: SiteNode; ancestors: SiteNode[] } | null {
  const walk = (nodes: SiteNode[], ancestors: SiteNode[]): { node: SiteNode; ancestors: SiteNode[] } | null => {
    for (const node of nodes) {
      if (node.href === pathname) return { node, ancestors };
      const found = walk(node.children ?? [], [...ancestors, node]);
      if (found) return found;
    }
    return null;
  };
  return walk(siteTree, []);
}
