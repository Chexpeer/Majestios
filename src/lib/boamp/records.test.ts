import { describe, expect, it } from "vitest";
import { extractBoampFields } from "./records";

describe("extractBoampFields", () => {
  it("supports the nested record.fields shape", () => {
    expect(extractBoampFields({
      record: { id: "nested-1", fields: { objet: "Marché de travaux" } },
    })).toEqual({ objet: "Marché de travaux" });
  });

  it("supports the top-level fields shape", () => {
    expect(extractBoampFields({
      id: "fields-1",
      fields: { objet: "Marché de services" },
    })).toEqual({ objet: "Marché de services" });
  });

  it("supports OpenDataSoft results with fields directly on the result", () => {
    expect(extractBoampFields({
      idweb: "flat-1",
      objet: "Rénovation d'une école",
      nomacheteur: "Ville de démonstration",
      datelimitereponse: "2099-12-31",
    })).toEqual({
      idweb: "flat-1",
      objet: "Rénovation d'une école",
      nomacheteur: "Ville de démonstration",
      datelimitereponse: "2099-12-31",
    });
  });

  it("returns an empty object for invalid input", () => {
    expect(extractBoampFields(null)).toEqual({});
    expect(extractBoampFields("invalid")).toEqual({});
    expect(extractBoampFields([])).toEqual({});
  });
});
