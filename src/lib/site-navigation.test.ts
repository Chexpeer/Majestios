import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { flattenSiteTree, siteTree } from "@/data/site-tree";

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
  if (!/\/(?:page|route)\.(?:tsx?|jsx?)$/.test("/" + normalized)) return null;
  const routePath = normalized.replace(/\/(?:page|route)\.(?:tsx?|jsx?)$/, "");
  if (routePath === "page" || routePath === "route") return "/";
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

  it("keeps literal internal links resolvable", () => {
    const broken = localHrefLiterals().filter(({ href }) => !resolvesToRoute(href));
    expect(broken, "Chaque lien interne littéral doit mener à une page ou une route API existante").toEqual([]);
  });
});
