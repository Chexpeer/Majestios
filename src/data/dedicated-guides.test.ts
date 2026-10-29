import { describe, expect, it } from "vitest";
import { dedicatedGuides } from "./dedicated-guides";
import { flattenSiteTree } from "./site-tree";

describe("dedicated route guides", () => {
  it("only defines guides for routes present in the navigation tree", () => {
    const knownRoutes = new Set(flattenSiteTree().map((node) => node.href));
    const unknownRoutes = Object.keys(dedicatedGuides).filter((route) => !knownRoutes.has(route));
    expect(unknownRoutes).toEqual([]);
  });

  it("provides dedicated guides for the main dossier entry points", () => {
    const requiredDossiers = [
      "/opportunites",
      "/opportunites/marches-publics",
      "/opportunites/marches-prives",
      "/opportunites/salons",
      "/opportunites/emploi",
      "/business",
      "/business/achat-cession",
      "/developpement-commercial",
      "/developpement-commercial/prospection",
      "/developpement-commercial/etudes-de-marche",
      "/developpement-commercial/e-reputation",
      "/developpement-commercial/accompagnement-appels-offres",
      "/reseaux",
      "/comprendre"
    ];

    for (const route of requiredDossiers) {
      expect(dedicatedGuides[route], route).toBeDefined();
    }
  });


  it("gives each navigable dossier its own guide, except intentionally separate utility/legal pages", () => {
    const intentionallySeparate = new Set([
      "/",
      "/faq",
      "/confidentialite",
      "/mentions-legales"
    ]);
    const missingGuides = flattenSiteTree()
      .map((node) => node.href)
      .filter((route) => !intentionallySeparate.has(route) && !dedicatedGuides[route]);
    expect(missingGuides).toEqual([]);
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
