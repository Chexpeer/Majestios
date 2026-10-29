import { describe, expect, it } from "vitest";
import { dedicatedGuides } from "./dedicated-guides";
import { flattenSiteTree } from "./site-tree";

describe("dedicated route guides", () => {
  it("only defines guides for routes present in the navigation tree", () => {
    const knownRoutes = new Set(flattenSiteTree().map((node) => node.href));
    const unknownRoutes = Object.keys(dedicatedGuides).filter((route) => !knownRoutes.has(route));
    expect(unknownRoutes).toEqual([]);
  });

  it("gives every detailed route a distinct, actionable guide", () => {
    const guides = Object.entries(dedicatedGuides);
    const titles = guides.map(([, guide]) => guide.title);
    expect(new Set(titles).size).toBe(titles.length);

    for (const [route, guide] of guides) {
      expect(guide.title, route).not.toMatch(/utiliser la rubrique/i);
      expect(guide.purpose.length, route).toBeGreaterThan(45);
      expect(guide.checks.length, route).toBeGreaterThanOrEqual(3);
      expect(guide.next.length, route).toBeGreaterThan(45);
    }
  });
});
