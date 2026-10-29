import { describe, expect, it } from "vitest";
import { readdirSync, statSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { flattenSiteTree, siteTree } from "./site-tree";

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
