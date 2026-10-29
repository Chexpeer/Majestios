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

  it("makes every interactive map pole a direct link to an implemented canonical dossier", () => {
    const map = readFileSync(join(process.cwd(), "src", "components", "majestic-opportunity-map.tsx"), "utf8");
    const poleHrefs = [...map.matchAll(/\{ id: "[^"]+", label: "[^"]+", href: "([^"]+)"/g)].map((match) => match[1]);
    const pageRoutes = collectPageRoutes();
    const unresolved = poleHrefs.filter((href) => {
      const node = findSiteNode(href);
      const target = href === "/" ? [] : href.split("/").filter(Boolean);
      return !node || !pageRoutes.some((pattern) => routeMatches(pattern, target));
    });

    expect(poleHrefs).toHaveLength(6);
    expect(unresolved, `Interactive map poles without a canonical page: ${unresolved.join(", ")}`).toEqual([]);
    expect(map).toContain('<Link key={stage.id} href={stage.href}');
    expect(map).toContain('Appels d’offres publics et privés');
    expect(map).toContain('Confirmer les informations par croisement de sources');
    expect(map).toContain('ressources humaines, les outils de communication');
    expect(map).not.toContain('id: "prospection", href: "/developpement-commercial/prospection"');
    expect(map).not.toContain('id: "development", href: "/developpement-commercial"');
    expect(map).toContain('majestic-crown-triangle');
  });

  it("keeps the homepage tender search visually compact", () => {
    const styles = readFileSync(join(appDirectory, "globals.css"), "utf8");
    expect(styles).toContain(".home-tender-search { max-width: 820px; margin-top: 14px;");
    expect(styles).toContain(".home-tender-search .search-field { min-height: 46px;");
    expect(styles).toContain(".home-tender-search .search-submit { min-height: 40px;");
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

  it("does not imply that the department filter is preselected when it is empty", () => {
    const departmentGuide = readFileSync(join(appDirectory, "opportunites", "marches-publics", "departement", "page.tsx"), "utf8");
    expect(departmentGuide).toContain('searchHref="/opportunites/marches-publics"');
    expect(departmentGuide).toContain('searchLabel="Ouvrir la recherche et saisir un département"');
    expect(departmentGuide).not.toContain('searchHref="/opportunites/marches-publics?location="');
  });

  it("connects BODACC creation signals to the canonical nested Business page", () => {
    const bodaccPage = readFileSync(join(appDirectory, "business", "veille-bodacc", "page.tsx"), "utf8");
    expect(bodaccPage).toContain('/business/intelligence-entreprises/creations-implantations');
    expect(bodaccPage).not.toContain('href: "/business/creations-implantations"');
  });

  it("preserves public-tender search criteria in the URL for refresh and return navigation", () => {
    const publicSearch = readFileSync(join(appDirectory, "opportunites", "marches-publics", "page.tsx"), "utf8");
    expect(publicSearch).toContain("window.history.replaceState(null,\"\",window.location.pathname+(urlParams.size?`?${urlParams.toString()}`:\"\"))");
    expect(publicSearch).toContain("if(nextQuery)urlParams.set(\"q\",nextQuery)");
    expect(publicSearch).toContain("if(nextLocation)urlParams.set(\"location\",nextLocation)");
    expect(publicSearch).toContain("if(nextType!==\"all\")urlParams.set(\"type\",nextType)");
  });

  it("preserves search context from results, through the tender detail and preparation form", () => {
    const publicSearch = readFileSync(join(appDirectory, "opportunites", "marches-publics", "page.tsx"), "utf8");
    const detailPage = readFileSync(join(appDirectory, "opportunites", "marches-publics", "[id]", "page.tsx"), "utf8");
    const preparationForm = readFileSync(join(appDirectory, "opportunites", "marches-publics", "[id]", "repondre", "page.tsx"), "utf8");
    expect(publicSearch).toContain('new URLSearchParams({q,location,type,title:item.title,buyer:item.buyer||"",deadline:item.deadline||""})');
    expect(detailPage).toContain("q:filters.q||\"\",location:filters.location||\"\",type:filters.type||\"all\"");
    expect(preparationForm).toContain("setQ((v.q||\"\").slice(0,160));setLocation((v.location||\"\").slice(0,100));setType((v.type||\"all\").slice(0,40))");
    expect(preparationForm).toContain("new URLSearchParams({q,location,type,title,buyer,deadline})");
  });

  it("labels the public-tender result action as an accompaniment request, not a bid submission", () => {
    const publicSearch = readFileSync(join(appDirectory, "opportunites", "marches-publics", "page.tsx"), "utf8");
    expect(publicSearch).toContain("Préparer une demande d’accompagnement ↗");
    expect(publicSearch).not.toContain("Demander un accompagnement ↗");
  });

  it("connects private-sector qualification to public tenders, BODACC signals and commercial targeting", () => {
    const privateSectorGuide = readFileSync(join(appDirectory, "opportunites", "marches-prives", "secteur", "page.tsx"), "utf8");
    expect(privateSectorGuide).toContain('href="/opportunites/marches-publics"');
    expect(privateSectorGuide).toContain('href="/business/veille-bodacc"');
    expect(privateSectorGuide).toContain('href="/developpement-commercial/prospection/ciblage"');
  });

  it("uses the current navigation labels in the public-tender FAQ", () => {
    const faqPage = readFileSync(join(appDirectory, "faq", "page.tsx"), "utf8");
    expect(faqPage).toContain('« Opportunités », puis « Marchés publics »');
    expect(faqPage).not.toContain('« Appels d’offres publics »');
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

  it("limits the public dossier tree to three levels: dossier, sub-dossier, page", () => {
    const tooDeep: string[] = [];
    const visit = (nodes: typeof siteTree, depth = 1) => {
      for (const node of nodes) {
        if (node.href !== "/" && depth > 3) tooDeep.push(node.href);
        visit(node.children ?? [], depth + 1);
      }
    };

    visit(siteTree.filter((node) => node.href !== "/"));
    expect(tooDeep, `Public navigation exceeds three levels: ${tooDeep.join(", ")}`).toEqual([]);
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

  it("keeps every assistant knowledge link on an implemented internal route", () => {
    const assistant = readFileSync(join(process.cwd(), "src", "components", "MajestiosAssistant.tsx"), "utf8");
    const pageRoutes = collectPageRoutes();
    const internalHrefs = [...assistant.matchAll(/href:\s*"([^"]+)"/g)]
      .map((match) => match[1])
      .filter((href) => href.startsWith("/"));
    const missing = [...new Set(internalHrefs)].filter((href) => {
      const target = href === "/" ? [] : href.split("/").filter(Boolean);
      return !pageRoutes.some((pattern) => routeMatches(pattern, target));
    });

    expect(missing, `Assistant links without an implemented page: ${missing.join(", ")}`).toEqual([]);
    expect(assistant).not.toContain('href:"/developpement-commercial/diagnostic-business"');
  });

  it("keeps global navigation menus flat and compact", () => {
    const navigation = readFileSync(join(process.cwd(), "src", "components", "homepage-navigation.tsx"), "utf8");
    expect(navigation).toContain("const renderSubfolders");
    expect(navigation).not.toContain("renderBranches(descendants)");
    expect(navigation).not.toContain("home-sidebar-descendants");
    expect(navigation).toContain("setExpandedGroup");
  });

  it("mounts only one global MajestiOS assistant", () => {
    const layout = readFileSync(join(appDirectory, "layout.tsx"), "utf8");
    const mounts = layout.match(/<MajestiosAssistant\\s*\\/>/g) ?? [];
    expect(mounts).toHaveLength(1);
  });

  it("registers the three new service modules with canonical, implemented destinations", () => {
    const nodes = flattenSiteTree();
    const filePurchase = findSiteNode("/developpement-commercial/achat-de-fichiers");
    const expressPreparation = findSiteNode("/developpement-commercial/accompagnement-appels-offres/preparation-express");
    const assistant = readFileSync(join(process.cwd(), "src", "components", "MajestiosAssistant.tsx"), "utf8");
    const commercialLanding = readFileSync(join(appDirectory, "developpement-commercial", "page.tsx"), "utf8");
    const pageRoutes = collectPageRoutes();
    const targets = [
      "/developpement-commercial/achat-de-fichiers",
      "/developpement-commercial/accompagnement-appels-offres/preparation-express"
    ];
    const missing = targets.filter((href) => {
      const target = href.split("/").filter(Boolean);
      return !pageRoutes.some((pattern) => routeMatches(pattern, target));
    });

    expect(filePurchase?.node.label).toBe("Achat de fichiers");
    expect(expressPreparation?.node.label).toBe("Préparation express du dossier");
    expect(missing).toEqual([]);
    expect(commercialLanding).toContain('href="/developpement-commercial/achat-de-fichiers"');
    expect(commercialLanding).toContain('href="/developpement-commercial/accompagnement-appels-offres/preparation-express"');
    expect(assistant).toContain("chat-launcher-emblem");
    expect(assistant).toContain("chat-emblem-crown");
    expect(assistant).toContain("chat-emblem-head");
    expect(assistant).toContain("le module de rappel n’est pas encore relié");
    expect(nodes.some((node) => node.href === "/developpement-commercial/achat-de-fichiers")).toBe(true);
  });

});