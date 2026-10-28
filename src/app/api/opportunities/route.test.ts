import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("GET /api/opportunities", () => {
  it("returns normalized live BOAMP results and sends ODSQL filters", async () => {
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
