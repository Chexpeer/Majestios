const assert = require("node:assert/strict");

async function main() {
  const endpoint = new URL("https://boamp-datadila.opendatasoft.com/api/explore/v2.0/catalog/datasets/boamp/records");
  endpoint.searchParams.set("limit", "3");
  endpoint.searchParams.set("select", "idweb,objet,nature,dateparution,datelimitereponse,nomacheteur,type_marche,url_avis");
  endpoint.searchParams.set("where", 'nature = "APPEL_OFFRE"');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(endpoint, {
      headers: { Accept: "application/json", "User-Agent": "Majestios-source-smoke-test/1.0" },
      signal: controller.signal
    });
    assert.equal(response.ok, true, `L’API BOAMP répond HTTP ${response.status}`);
    const payload = await response.json();
    assert.ok(Array.isArray(payload.results), "L’API doit retourner un tableau results. Clés reçues : " + Object.keys(payload).join(",") + "; aperçu : " + JSON.stringify(payload).slice(-900));
    assert.ok(payload.results.length > 0, "La requête BOAMP doit retourner au moins un avis d’appel d’offres.");
    const record = payload.results[0];
    assert.ok(record.idweb || record.id, "Chaque avis doit exposer une référence.");
    assert.ok(record.objet, "Chaque avis doit exposer son objet.");
    assert.equal(record.nature, "APPEL_OFFRE", "La requête doit bien filtrer les avis d’appel d’offres.");
    assert.ok(typeof record.url_avis === "string" && record.url_avis.startsWith("https://www.boamp.fr/"),
      "L’avis doit renvoyer vers la source officielle BOAMP.");
    console.log(`API BOAMP réelle accessible : ${payload.results.length} avis échantillonné(s), référence ${record.idweb || record.id}.`);
  } finally {
    clearTimeout(timeout);
  }
}
main().catch((error) => { console.error("Échec du contrôle d’intégration BOAMP réel :", error); process.exitCode = 1; });
