const assert = require("node:assert/strict");

async function main() {
  const endpoint = new URL("https://bodacc-datadila.opendatasoft.com/api/explore/v2.1/catalog/datasets/annonces-commerciales/records");
  endpoint.searchParams.set("where", 'search(commercant, "LECLERC")');
  endpoint.searchParams.set("limit", "2");
  endpoint.searchParams.set("select", "id,dateparution,commercant,typeavis_lib,familleavis_lib,url_complete");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(endpoint, {
      headers: { Accept: "application/json", "User-Agent": "MajestiOS-source-smoke-test/1.0" },
      signal: controller.signal
    });
    assert.equal(response.ok, true, `La recherche BODACC par entreprise répond HTTP ${response.status}`);
    const payload = await response.json();
    assert.ok(Array.isArray(payload.results), "La recherche filtrée doit retourner results[].");
    if (payload.results.length) {
      const record = payload.results[0];
      assert.ok(record.id || record.commercant, "Une annonce doit exposer une référence ou une raison sociale.");
    }
    console.log(`Recherche BODACC filtrée accessible : ${payload.results.length} annonce(s) échantillonnée(s).`);
  } finally {
    clearTimeout(timeout);
  }
}

main().catch(error => {
  console.error("Échec du contrôle de recherche BODACC filtrée :", error);
  process.exitCode = 1;
});
