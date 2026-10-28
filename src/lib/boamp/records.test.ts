import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "../../app/api/opportunities/route";
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

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("GET /api/opportunities", () => {
  it("returns normalized BOAMP results and sends ODSQL filters", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          total_count: 1,
          results: [
            {
              idweb: "26-TEST",
              objet: "Travaux de rénovation d'une école",
              nomacheteur: "Ville de test",
              code_departement: "68",
              code_departement_prestation: "",
              dateparution: "2026-10-28",
              datelimitereponse: "2099-12-31T12:00:00+01:00",
              etat: "INITIAL",
              nature_libelle: "Avis de marché",
              nature_categorise_libelle: "Avis de marché/",
              type_marche: "TRAVAUX",
              url_avis: "https://www.boamp.fr/pages/avis/?q=idweb:26-TEST",
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const request = new NextRequest(
      "http://localhost/api/opportunities?q=renovation&location=68&type=Travaux",
    );
    const response = await GET(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.items).toHaveLength(1);
    expect(payload.items[0]).toMatchObject({
      id: "26-TEST",
      title: "Travaux de rénovation d'une école",
      type: "Travaux",
      source: "public",
      isDemo: false,
      isOpen: true,
    });

    const calledUrl = new URL(fetchMock.mock.calls[0][0] as string);
    const where = calledUrl.searchParams.get("where") ?? "";
    expect(calledUrl.searchParams.has("search")).toBe(false);
    expect(where).toContain('search(*, "renovation")');
    expect(where).toContain('code_departement in ("68")');
    expect(where).toContain('type_marche="TRAVAUX"');
  });

  it("filters out expired and cancelled notices when openOnly is enabled", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          total_count: 3,
          results: [
            {
              idweb: "26-OPEN",
              objet: "Entretien des bâtiments",
              datelimitereponse: "2099-12-31T12:00:00+01:00",
              etat: "INITIAL",
              nature_libelle: "Avis de marché",
              nature_categorise_libelle: "Avis de marché/",
              type_marche: "SERVICES",
            },
            {
              idweb: "26-EXPIRED",
              objet: "Ancien marché de nettoyage",
              datelimitereponse: "2020-01-01",
              etat: "INITIAL",
              nature_libelle: "Avis de marché",
              nature_categorise_libelle: "Avis de marché/",
              type_marche: "SERVICES",
            },
            {
              idweb: "26-CANCELLED",
              objet: "Marché annulé",
              datelimitereponse: "2099-12-31T12:00:00+01:00",
              etat: "ANNULE",
              nature_libelle: "Avis de marché",
              nature_categorise_libelle: "Avis de marché/",
              type_marche: "SERVICES",
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await GET(
      new NextRequest("http://localhost/api/opportunities?openOnly=true"),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.items.map((item: { id: string }) => item.id)).toEqual(["26-OPEN"]);
    expect(payload.items[0].isOpen).toBe(true);
    expect(payload.meta.totalAvailable).toBe(3);
  });

  it("rejects an invalid department without calling the upstream API", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const request = new NextRequest(
      "http://localhost/api/opportunities?location=not-a-department",
    );
    const response = await GET(request);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.items).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("accepts department 977 and applies it to the BOAMP query", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ total_count: 0, results: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await GET(
      new NextRequest("http://localhost/api/opportunities?location=977"),
    );
    expect(response.status).toBe(200);
    const calledUrl = new URL(fetchMock.mock.calls[0][0] as string);
    expect(calledUrl.searchParams.get("where")).toContain('code_departement in ("977")');
  });

  it("does not display demonstration data when the upstream API fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network failure")));

    const request = new NextRequest("http://localhost/api/opportunities");
    const response = await GET(request);
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload.items).toEqual([]);
    expect(payload.error).toContain("Impossible de joindre");
  });
});
