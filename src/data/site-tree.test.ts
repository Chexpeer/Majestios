import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { findSiteNode, flattenSiteTree, siteTree } from "./site-tree";

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
  it("resolves every canonical navigation URL back to its own node", () => {
    const nodes = flattenSiteTree();
    const unresolved = nodes.filter((node) => {
      const found = findSiteNode(node.href);
      return !found || found.node.href !== node.href || found.node.label !== node.label;
    }).map((node) => node.href);

    expect(unresolved, `Navigation URLs that do not resolve to their own dossier: ${unresolved.join(", ")}`).toEqual([]);
  });

  it("does not treat unknown catch-all URLs as valid dossiers", () => {
    const invalidExamples = [
      "/opportunites/marches-publics/annonce-inexistante",
      "/business/dossier-inexistant",
      "/developpement-commercial/parcours-inexistant",
      "/reseaux/profil-inexistant"
    ];

    const unexpectedlyResolved = invalidExamples.filter((pathname) => findSiteNode(pathname) !== null);
    expect(unexpectedlyResolved).toEqual([]);
  });


  it("uses canonical nested Business routes in the Business landing-page cards", () => {
    const businessLanding = readFileSync(join(appDirectory, "business", "page.tsx"), "utf8");
    expect(businessLanding).toContain('/business/intelligence-entreprises/creations-implantations');
    expect(businessLanding).toContain('/business/intelligence-entreprises/evolutions-activite');
    expect(businessLanding).not.toContain('href:"/business/creations-implantations"');
    expect(businessLanding).not.toContain('href:"/business/evolutions-activite"');
  });


  it("routes public-tender guide actions back to the live search instead of the current guide", () => {
    const siteHub = readFileSync(join(process.cwd(), "src", "components", "site-hub.tsx"), "utf8");
    expect(siteHub).toContain('const isPublicMarketsGuide = pathname.startsWith("/opportunites/marches-publics/")');
    expect(siteHub).toContain('const actionHref = isPublicMarketsGuide ? "/opportunites/marches-publics"');
    expect(siteHub).toContain('Revenir à la recherche de marchés publics');
  });

  it("does not contain duplicate internal destinations", () => {
    const destinations = flattenSiteTree().map((node) => node.href);
    expect(new Set(destinations).size).toBe(destinations.length);
  });

  it("keeps the recruitment footer on the canonical private-opportunities route", () => {
    const joinPage = readFileSync(join(appDirectory, "nous-rejoindre", "page.tsx"), "utf8");
    expect(joinPage).toContain('href="/opportunites/marches-prives"');
    expect(joinPage).not.toContain('href="/appels-offres-prives"');
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
      "/comprendre/concept",
      "/business/creations-implantations",
      "/business/evolutions-activite"
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

  it("keeps child dossiers nested under their actual parent route", () => {
    const invalidHierarchy: string[] = [];
    const visit = (nodes: typeof siteTree, parentHref?: string) => {
      for (const node of nodes) {
        // The home node is a landing page, not the parent of every domain.
        const intentionalCanonicalCrossRoutes = new Set(["/comment-et-pourquoi", "/faq"]);
        if (parentHref && parentHref !== "/" && !intentionalCanonicalCrossRoutes.has(node.href) && !node.href.startsWith(parentHref + "/")) {
          invalidHierarchy.push(`${parentHref} -> ${node.href}`);
        }
        visit(node.children ?? [], node.href);
      }
    };

    visit(siteTree);
    expect(invalidHierarchy, `Child routes outside their parent dossier: ${invalidHierarchy.join(", ")}`).toEqual([]);
  });

  it("keeps every depth of nested dossier URLs beneath its parent", () => {
    const invalidNestedRoutes: string[] = [];
    const visit = (nodes: typeof siteTree) => {
      for (const node of nodes) {
        for (const child of node.children ?? []) {
          const canonicalCrossRoutes = new Set(["/comment-et-pourquoi", "/faq"]);
          if (!canonicalCrossRoutes.has(child.href) && !child.href.startsWith(node.href + "/")) {
            invalidNestedRoutes.push(`${node.href} -> ${child.href}`);
          }
        }
        visit(node.children ?? []);
      }
    };

    visit(siteTree.filter((node) => node.href !== "/"));
    expect(invalidNestedRoutes, `Nested dossier URLs must remain beneath their parent at every depth: ${invalidNestedRoutes.join(", ")}`).toEqual([]);
  });

});