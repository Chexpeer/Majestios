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
    const records = Array.isArray(payload.results)
      ? payload.results
      : Array.isArray(payload.records)
        ? payload.records.map((item) => item?.record?.fields || item?.fields || {}).filter((item) => Object.keys(item).length)
        : [];
    assert.ok(records.length > 0, "L’API doit retourner des avis dans results[] ou records[].record.fields. Clés reçues : " + Object.keys(payload).join(",") + "; aperçu : " + JSON.stringify(payload).slice(-900));
    const record = records[0];
    assert.ok(record.idweb || record.id, "Chaque avis doit exposer une référence.");
    assert.ok(record.objet, "Chaque avis doit exposer son objet.");
    assert.equal(record.nature, "APPEL_OFFRE", "La requête doit bien filtrer les avis d’appel d’offres.");
    assert.ok(
      (typeof record.url_avis === "string" && record.url_avis.startsWith("https://www.boamp.fr/")) || record.idweb,
      "L’avis doit fournir une URL officielle ou un identifiant permettant de construire le lien BOAMP."
    );
    console.log(`API BOAMP réelle accessible : ${records.length} avis échantillonné(s), référence ${record.idweb || record.id}.`);
  } finally {
    clearTimeout(timeout);
  }
}
main().catch((error) => { console.error("Échec du contrôle d’intégration BOAMP réel :", error); process.exitCode = 1; });
