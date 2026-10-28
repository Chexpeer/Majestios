import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://majestios.fr";
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/espace-professionnel/"] }], sitemap: new URL("/sitemap.xml", base).toString() };
}
