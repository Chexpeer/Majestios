import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { findSiteNode, flattenSiteTree, siteTree } from "../data/site-tree";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const appRoot = join(projectRoot, "src", "app");
const sourceRoot = join(projectRoot, "src");

function walk(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function routePatternFromFile(filePath: string): string | null {
  const normalized = relative(appRoot, filePath).split(sep).join("/");
  if (!/(?:^|\/)(?:page|route)\.(?:tsx?|jsx?)$/.test(normalized)) return null;
  const routePath = normalized.replace(/(?:^|\/)(?:page|route)\.(?:tsx?|jsx?)$/, "");
  const segments = routePath.split("/").filter(Boolean).filter((segment) => !(segment.startsWith("(") && segment.endsWith(")")));
  return segments.length ? "/" + segments.join("/") : "/";
}

const routePatterns = walk(appRoot)
  .map(routePatternFromFile)
  .filter((value): value is string => value !== null);

function resolvesToRoute(pathname: string): boolean {
  const requested = (pathname.split(/[?#]/, 1)[0] || "/").replace(/\/$/, "") || "/";
  const requestedSegments = requested.split("/").filter(Boolean);
  return routePatterns.some((pattern) => {
    const patternSegments = pattern.split("/").filter(Boolean);
    let index = 0;
    for (; index < patternSegments.length; index += 1) {
      const segment = patternSegments[index];
      if (segment.startsWith("[[...") && segment.endsWith("]]")) return true;
      if (segment.startsWith("[...") && segment.endsWith("]")) return requestedSegments.length > index;
      if (index >= requestedSegments.length) return false;
      if (segment.startsWith("[") && segment.endsWith("]")) continue;
      if (segment !== requestedSegments[index]) return false;
    }
    return index === requestedSegments.length;
  });
}

function localHrefLiterals(): Array<{ source: string; href: string }> {
  return walk(sourceRoot)
    .filter((filePath) => /\.(?:tsx?|jsx?)$/.test(filePath))
    .flatMap((filePath) => {
      const source = readFileSync(filePath, "utf8");
      const matches = [
        ...source.matchAll(/\bhref\s*=\s*\{?\s*["'`]([^"'`]+)["'`]/g),
        ...source.matchAll(/\bhref\s*:\s*["'`]([^"'`]+)["'`]/g),
        ...source.matchAll(/\bdestination\s*:\s*["'`]([^"'`]+)["'`]/g),
      ];
      return matches
        .map((match) => match[1])
        .filter((href) => href.startsWith("/") && !href.startsWith("//"))
        .map((href) => ({ source: relative(projectRoot, filePath), href }));
    });
}

describe("architecture de navigation MajestiOS", () => {
  it("keeps every route in the central site tree resolvable", () => {
    const nodes = flattenSiteTree();
    const duplicates = nodes.map((node) => node.href).filter((href, index, all) => all.indexOf(href) !== index);
    expect(duplicates, "Les URL du siteTree doivent être uniques").toEqual([]);

    const unresolved = nodes.filter((node) => !resolvesToRoute(node.href)).map((node) => ({ label: node.label, href: node.href }));
    expect(unresolved, "Chaque entrée du menu doit avoir une page ou une route dynamique").toEqual([]);
  });


  it("keeps every configured redirect destination resolvable", () => {
    const config = readFileSync(join(projectRoot, "next.config.ts"), "utf8");
    const destinations = [...config.matchAll(/destination:\s*["'`]([^"'`]+)["'`]/g)].map((match) => match[1]);
    const unresolved = destinations.filter((destination) => !resolvesToRoute(destination));
    expect(unresolved, "Chaque redirection doit pointer vers une route existante").toEqual([]);
  });

  it("keeps literal internal links resolvable", () => {
    const broken = localHrefLiterals().filter(({ href }) => !resolvesToRoute(href));
    expect(broken, "Chaque lien interne littéral doit mener à une page ou une route API existante").toEqual([]);
  });

  it("relie les parcours de recherche et de demande aux informations de confidentialité et aux mentions légales", () => {
    const relevantFiles = [
      join(sourceRoot, "components", "public-tenders-search.tsx"),
      join(sourceRoot, "components", "private-tenders-search.tsx"),
      join(sourceRoot, "components", "employment-opportunities.tsx"),
      join(appRoot, "creer-espace", "page.tsx"),
      join(appRoot, "appels-offres-publics", "[id]", "page.tsx"),
      join(appRoot, "appels-offres-publics", "[id]", "repondre", "page.tsx"),
      join(appRoot, "espace-professionnel", "page.tsx"),
      join(appRoot, "nous-rejoindre", "page.tsx"),
    ];

    const missingLinks = relevantFiles.flatMap((filePath) => {
      const source = readFileSync(filePath, "utf8");
      return [
        ...(!source.includes('href="/confidentialite"') ? [{ filePath, missing: "/confidentialite" }] : []),
        ...(!source.includes('href="/mentions-legales"') ? [{ filePath, missing: "/mentions-legales" }] : []),
      ];
    });

    expect(missingLinks, "Les parcours de recherche et de demande doivent offrir un accès aux informations légales").toEqual([]);
  });

  it("utilise les routes canoniques dans les parcours d’accompagnement et d’e-réputation", () => {
    const tenderSupport = readFileSync(join(appRoot, "developpement-commercial", "accompagnement-appels-offres", "page.tsx"), "utf8");
    const reputation = readFileSync(join(appRoot, "developpement-commercial", "e-reputation", "page.tsx"), "utf8");

    expect(tenderSupport).toContain('href="/opportunites/marches-publics"');
    expect(tenderSupport).toContain('href="/opportunites/marches-prives"');
    expect(reputation).toContain('href="/comprendre/faq"');
    expect(tenderSupport).toContain('href="/comprendre/faq"');
    expect(tenderSupport).not.toContain('href="/faq#');
    expect(reputation).not.toContain('href="/faq#');
  });

  it("sélectionne des ressources propres aux opportunités et aux salons", () => {
    const hubSource = readFileSync(join(sourceRoot, "components", "site-hub.tsx"), "utf8");
    expect(hubSource).toContain('pathname === "/opportunites" ? "opportunites"');
    expect(hubSource).toContain('pathname.startsWith("/opportunites/salons") ? "salons"');
    expect(hubSource).toContain('pathname.startsWith("/reseaux") ? "reseaux"');
  });

  it("relie les pages de prospection et d’étude de marché sans utiliser les anciennes ancres FAQ", () => {
    const marketStudy = readFileSync(join(appRoot, "developpement-commercial", "etudes-de-marche", "page.tsx"), "utf8");
    const prospecting = readFileSync(join(appRoot, "developpement-commercial", "prospection", "page.tsx"), "utf8");

    expect(marketStudy).toContain('href="/comprendre/faq"');
    expect(marketStudy).toContain('href="/opportunites/radar-entreprises"');
    expect(marketStudy).toContain('href="/developpement-commercial/prospection"');
    expect(prospecting).toContain('href="/comprendre/faq"');
    expect(prospecting).toContain('href="/opportunites/radar-entreprises"');
    expect(prospecting).toContain('href="/developpement-commercial/etudes-de-marche"');
    expect(marketStudy).not.toContain('href="/faq#');
    expect(prospecting).not.toContain('href="/faq#');
  });

  it("préserve les filtres lors du passage des résultats à la fiche d’un marché public", () => {
    const searchSource = readFileSync(join(sourceRoot, "components", "public-tenders-search.tsx"), "utf8");
    const detailSource = readFileSync(join(appRoot, "appels-offres-publics", "[id]", "page.tsx"), "utf8");
    const requestSource = readFileSync(join(appRoot, "appels-offres-publics", "[id]", "repondre", "page.tsx"), "utf8");

    expect(searchSource).toContain("openOnly:String(openOnly)");
    expect(detailSource).toContain('"q","location","type","openOnly"');
    expect(detailSource).toContain('openOnly:filters.openOnly??"false"');
    expect(requestSource).toContain('["q","location","type","openOnly"]');
  });

  it("donne un contenu éditorial dédié à chaque rubrique gérée par SiteHub", () => {
    const hubSource = readFileSync(join(sourceRoot, "components", "site-hub.tsx"), "utf8");
    const editorialHrefs = new Set(
      [...hubSource.matchAll(/^\s*"([^"]+)": \{$/gm)]
        .map((match) => match[1])
        .filter((href) => href.startsWith("/"))
    );
    const bespokePages = new Set(["/", "/nous-rejoindre", "/mentions-legales"]);
    const missing = flattenSiteTree()
      .map((node) => node.href)
      .filter((href) => !bespokePages.has(href) && !editorialHrefs.has(href));

    expect(missing, "Chaque rubrique SiteHub doit disposer d’un contenu éditorial dédié").toEqual([]);
  });

  it("vérifie les connexions dans les deux sens pour chaque rubrique", () => {
    const nodes = flattenSiteTree();
    const broken: Array<{ href: string; problem: string }> = [];

    for (const node of nodes) {
      const found = findSiteNode(node.href);
      if (!found || found.node.href !== node.href) {
        broken.push({ href: node.href, problem: "la rubrique n’est pas retrouvée par son URL" });
        continue;
      }

      const parent = found.ancestors.at(-1);
      if (parent && !parent.children?.some((child) => child.href === node.href)) {
        broken.push({ href: node.href, problem: `le parent ${parent.href} ne référence pas cette rubrique` });
      }

      const visibleNodes = node.children?.length
        ? node.children
        : parent
          ? parent.children?.filter((sibling) => sibling.href !== node.href) ?? []
          : siteTree.filter((sibling) => sibling.href !== node.href && sibling.href !== "/");

      if (!visibleNodes.length) {
        broken.push({ href: node.href, problem: "aucun lien de navigation contextuel disponible" });
      }
      for (const visible of visibleNodes) {
        if (!findSiteNode(visible.href)) {
          broken.push({ href: node.href, problem: `destination contextuelle introuvable : ${visible.href}` });
        }
      }
      for (const ancestor of found.ancestors) {
        if (!findSiteNode(ancestor.href)) {
          broken.push({ href: node.href, problem: `retour de fil d’Ariane introuvable : ${ancestor.href}` });
        }
      }
    }

    expect(broken, "Chaque rubrique doit être reliée à ses parents, à ses voisines et à des destinations existantes").toEqual([]);
  });

  it("keeps common ticker announcements clickable while the ticker container stays visually unobtrusive", () => {
    const css = readFileSync(join(appRoot, "globals.css"), "utf8");
    const ticker = readFileSync(join(sourceRoot, "components", "announcement-ticker.tsx"), "utf8");
    expect(css).toContain(".global-ticker-host .announcement-job-chip");
    expect(css).toContain("pointer-events:auto");
    expect(ticker).toContain('aria-label="Flux commun des annonces MajestiOS"');
    expect(ticker).toContain('href={item.href}');
  });

  it("mounts the shared navigation and ticker globally without duplicate page headers", () => {
    const layout = readFileSync(join(appRoot, "layout.tsx"), "utf8");
    const shell = readFileSync(join(sourceRoot, "components", "site-shell.tsx"), "utf8");
    const header = readFileSync(join(sourceRoot, "components", "public-header.tsx"), "utf8");
    const context = readFileSync(join(sourceRoot, "components", "public-layout-context.tsx"), "utf8");
    expect(layout).toContain("<SiteShell>{children}</SiteShell>");
    expect(shell).toContain("<HomeSideNav />");
    expect(shell).toContain("<AnnouncementTicker />");
    expect(header).toContain("if (isInsideGlobalShell) return null");
    expect(context).toContain("createContext(false)");
  });

  it("connects Business, BODACC, company radar and commercial development without stale FAQ paths", () => {
    const businessPage = readFileSync(join(appRoot, "opportunites", "business", "page.tsx"), "utf8");
    expect(businessPage).toContain('href="/business/radar-bodacc"');
    expect(businessPage).toContain('href="/business/achat-cession"');
    expect(businessPage).toContain('href="/opportunites/radar-entreprises"');
    expect(businessPage).toContain('href="/developpement-commercial/etudes-de-marche"');
    expect(businessPage).toContain('href="/developpement-commercial/prospection"');
    expect(businessPage).toContain('href="/reseaux"');
    expect(businessPage).toContain('href="/comprendre/faq"');
    expect(businessPage).not.toContain('href="/faq"');
  });

  it("keeps each nested section connected to its parent and siblings", () => {
    const nodes = flattenSiteTree();
    const byHref = new Map(nodes.map((node) => [node.href, node]));
    const brokenRelationships: Array<{ href: string; problem: string }> = [];

    const visit = (parents: typeof nodes, parentHref?: string) => {
      for (const node of parents) {
        if (parentHref && !byHref.has(parentHref)) {
          brokenRelationships.push({ href: node.href, problem: `parent missing: ${parentHref}` });
        }
        for (const child of node.children ?? []) {
          if (node.href !== "/" && !child.href.startsWith(node.href + "/")) {
            brokenRelationships.push({ href: child.href, problem: `not nested under parent: ${node.href}` });
          }
        }
        visit(node.children ?? [], node.href);
      }
    };

    visit(siteTree);
    expect(brokenRelationships, "Chaque sous-rubrique doit rester reliée à son parent dans l’arborescence").toEqual([]);
    expect(nodes.every((node) => node.label.trim() && node.description.trim()), "Chaque rubrique doit avoir un libellé et une description").toBe(true);
  });

});
