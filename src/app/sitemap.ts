import type { MetadataRoute } from "next";
import { flattenSiteTree } from "@/data/site-tree";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://majestios.fr";
  return flattenSiteTree().map((node) => ({ url: new URL(node.href, base).toString(), changeFrequency: "weekly", priority: node.href === "/" ? 1 : node.children?.length ? 0.8 : 0.6 }));
}
