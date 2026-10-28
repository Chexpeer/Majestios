import { describe, expect, it } from "vitest";
import { buildBoampApiParams } from "./query";

describe("buildBoampApiParams", () => {
  it("limits and clamps the number of results requested", () => {
    expect(buildBoampApiParams({ query: "", department: "", type: "all", limit: 8 }).get("limit")).toBe("8");
    expect(buildBoampApiParams({ query: "", department: "", type: "all", limit: 500 }).get("limit")).toBe("50");
    expect(buildBoampApiParams({ query: "", department: "", type: "all", limit: 0 }).get("limit")).toBe("1");
    expect(buildBoampApiParams({ query: "", department: "", type: "all", limit: 1.5 }).get("limit")).toBe("50");
  });

  it("puts full-text search in the ODSQL where clause", () => {
    const params = buildBoampApiParams({
      query: "nettoyage écoles",
      department: "",
      type: "all",
    });

    expect(params.get("where")).toBe('(search(*, "nettoyage écoles"))');
    expect(params.has("search")).toBe(false);
    expect(params.has("q")).toBe(false);
  });

  it("combines keyword, department and type filters", () => {
    const params = buildBoampApiParams({
      query: "maintenance",
      department: "68",
      type: "Travaux",
    });
    const where = params.get("where") ?? "";

    expect(where).toContain('search(*, "maintenance")');
    expect(where).toContain('code_departement in ("68")');
    expect(where).toContain('code_departement_prestation in ("68")');
    expect(where).toContain('type_marche="TRAVAUX"');
    expect(where).toContain(" AND ");
  });

  it("removes quotes and backslashes from the user search text", () => {
    const params = buildBoampApiParams({
      query: 'nettoyage") OR etat="ANNULE\\',
      department: "",
      type: "all",
    });

    expect(params.get("where")).not.toContain('OR etat="ANNULE"');
    expect(params.get("where")).toContain("search(*,");
  });

  it("omits the where clause when no filters are supplied", () => {
    const params = buildBoampApiParams({
      query: "",
      department: "",
      type: "all",
    });

    expect(params.has("where")).toBe(false);
  });
});
