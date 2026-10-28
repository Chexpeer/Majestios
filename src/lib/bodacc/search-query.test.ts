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
  it("keeps a company name after removing action wording", () => {
    expect(extractBodaccSearchTerm("Rechercher reprise Dupont Industries")).toBe("Dupont Industries");
  });
  it("returns empty for generic terms only", () => {
    expect(extractBodaccSearchTerm("BODACC cession entreprise")).toBe("");
  });
});
