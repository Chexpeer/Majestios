import { describe, expect, it } from "vitest";
import { extractBodaccSearchTerm } from "./search-query";

describe("extractBodaccSearchTerm", () => {
  it("rejects a generic BODACC shortcut without a search criterion", () => {
    expect(extractBodaccSearchTerm("Rechercher une cession BODACC")).toBe("");
  });
  it("keeps activity and city from a natural-language request", () => {
    expect(extractBodaccSearchTerm("Rechercher une cession boulangerie Mulhouse BODACC")).toBe("boulangerie Mulhouse");
  });
  it("handles French typographic apostrophes and keeps the city", () => {
    expect(extractBodaccSearchTerm("Cession d’entreprise à Paris")).toBe("Paris");
  });
  it("removes accented French prepositions without damaging the place name", () => {
    expect(extractBodaccSearchTerm("Rechercher une reprise au Havre")).toBe("Havre");
  });
  it("keeps a company name after removing action wording", () => {
    expect(extractBodaccSearchTerm("Rechercher reprise Dupont Industries")).toBe("Dupont Industries");
  });
  it("returns empty for generic terms only", () => {
    expect(extractBodaccSearchTerm("BODACC cession entreprise")).toBe("");
  });
  it("normalizes whitespace and removes unsupported query characters", () => {
    expect(extractBodaccSearchTerm('  Mulhouse   OR * "test"  ')).toBe("Mulhouse OR test");
  });
  it("preserves accented company and activity names", () => {
    expect(extractBodaccSearchTerm("Électricité Générale d’Alsace")).toBe("Électricité Générale Alsace");
  });
});
