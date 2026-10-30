import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { flattenSiteTree } from "./site-tree";
import { dedicatedGuides } from "./dedicated-guides";

const appDirectory = resolve(process.cwd(), "src/app");

function collectPageRoutes(directory = appDirectory): string[][] {
  return readdirSync(directory).flatMap((entry) => {
    const absolute = join(directory, entry);
    if (statSync(absolute).isDirectory()) return collectPageRoutes(absolute);
    if (!/^page\.(tsx|ts|jsx|js)$/.test(entry)) return [];

    const relativePath = relative(appDirectory, absolute);
    const segments = relativePath.split(sep).slice(0, -1);
    return [segments.filter((segment) => !/^\(.+\)$/.test(segment))];
  });
}

function routeMatches(pattern: string[], target: string[]): boolean {
  let p = 0;
  let t = 0;

  while (p < pattern.length) {
    const segment = pattern[p];
    if (/^\[\[\.\.\..+\]\]$/.test(segment)) return true;
    if (/^\[\.\.\..+\]$/.test(segment)) return target.length - t >= 1;
    if (t >= target.length) return false;
    if (!/^\[.+\]$/.test(segment) && segment !== target[t]) return false;
    p += 1;
    t += 1;
  }

  return t === target.length;
}

describe("site navigation tree", () => {
  it("does not contain duplicate internal destinations", () => {
    const destinations = flattenSiteTree().map((node) => node.href);
    expect(new Set(destinations).size).toBe(destinations.length);
  });

  it("keeps navigation on canonical routes instead of legacy redirect aliases", () => {
    const legacyAliases = new Set([
      "/appels-offres-publics",
      "/appels-offres-prives",
      "/offres-emploi",
      "/opportunites/business",
      "/developpement-commercial/diagnostic-business",
      "/intelligence-commerciale",
      "/partenaires",
      "/e-reputation",
      "/etudes-de-marche",
      "/comprendre/faq",
      "/comprendre/concept"
    ]);
    const legacyDestinations = flattenSiteTree()
      .map((node) => node.href)
      .filter((href) =>
        legacyAliases.has(href) ||
        href.startsWith("/appels-offres-publics/") ||
        href.startsWith("/appels-offres-prives/") ||
        href.startsWith("/offres-emploi/")
      );

    expect(legacyDestinations, `Navigation still points to legacy aliases: ${legacyDestinations.join(", ")}`).toEqual([]);
  });

  it("marks sensitive and not-yet-published general routes as preparing", () => {
    const preparingRoutes = new Set(["/espace-professionnel", "/confidentialite", "/mentions-legales"]);
    const nodes = flattenSiteTree().filter((node) => preparingRoutes.has(node.href));
    expect(nodes.map((node) => node.href).sort()).toEqual([...preparingRoutes].sort());
    expect(nodes.every((node) => node.status === "preparing")).toBe(true);
  });

  it("keeps the employment feed clearly marked as preparing", () => {
    const nodes = flattenSiteTree().filter((node) => ["/opportunites/emploi", "/opportunites/emploi/offres", "/opportunites/emploi/missions"].includes(node.href));
    expect(nodes).toHaveLength(3);
    expect(nodes.every((node) => node.status === "preparing")).toBe(true);
  });

  it("provides dedicated guides for key parent-level business journeys", () => {
    const required = ["/business/intelligence-entreprises", "/business/achat-cession", "/developpement-commercial/prospection", "/developpement-commercial/etudes-de-marche", "/developpement-commercial/e-reputation", "/developpement-commercial/accompagnement-appels-offres"];
    expect(required.every((pathname) => Boolean(dedicatedGuides[pathname]))).toBe(true);
  });

  it("keeps the company radar and economic signals as distinct dedicated dossiers", () => {
    const radarPath = join(appDirectory, "opportunites", "radar-entreprises", "page.tsx");
    const signalsPath = join(appDirectory, "opportunites", "signaux-entreprises", "page.tsx");
    const radar = readFileSync(radarPath, "utf8");
    const signals = readFileSync(signalsPath, "utf8");

    expect(radar).toContain("Radar des entreprises");
    expect(radar).toContain("Qualifier avant de contacter");
    expect(signals).toContain("Signaux économiques");
    expect(signals).toContain("Un signal n’est pas encore");

    expect(radar).not.toEqual(signals);
  });


  it("gives key dossiers distinct visual symbols and forbids links back to their own route", () => {
    const dossiers = [
      { route: "/opportunites/radar-entreprises", file: join(appDirectory, "opportunites", "radar-entreprises", "page.tsx"), symbol: "▥" },
      { route: "/opportunites/signaux-entreprises", file: join(appDirectory, "opportunites", "signaux-entreprises", "page.tsx"), symbol: "⌕" },
      { route: "/opportunites/marches-prives", file: join(appDirectory, "opportunites", "marches-prives", "page.tsx"), symbol: "↗" }
    ];

    for (const dossier of dossiers) {
      const source = readFileSync(dossier.file, "utf8");
      expect(source).toContain(`data-dossier-symbol="${dossier.symbol}"`);
      const literalInternalLinks = [...source.matchAll(/<Link\b[^>]*?href="(\/[^"]*)"/gs)].map((match) => match[1]);
      expect(literalInternalLinks.filter((href) => href === dossier.route), `Self-links found on ${dossier.route}`).toEqual([]);
    }
  });

  it("points every navigation item to an implemented Next.js page or dynamic route", () => {
    const pageRoutes = collectPageRoutes();
    const missing = flattenSiteTree()
      .map((node) => node.href)
      .filter((href) => {
        const target = href === "/" ? [] : href.split("/").filter(Boolean);
        return !pageRoutes.some((pattern) => routeMatches(pattern, target));
      });

    expect(missing, `Navigation destinations without a matching page: ${missing.join(", ")}`).toEqual([]);
  });
});
