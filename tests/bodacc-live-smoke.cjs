const assert = require("node:assert/strict");

async function main() {
  const endpoint = new URL("https://bodacc-datadila.opendatasoft.com/api/explore/v2.1/catalog/datasets/annonces-commerciales/records");
  endpoint.searchParams.set("limit", "3");
  endpoint.searchParams.set("select", "id,publicationavis,dateparution,numeroannonce,typeavis_lib,familleavis_lib,departement_nom_officiel,commercant,ville,url_complete");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(endpoint, {
      headers: { Accept: "application/json", "User-Agent": "Majestios-source-smoke-test/1.0" },
      signal: controller.signal
    });
    assert.equal(response.ok, true, `L’API BODACC répond HTTP ${response.status}`);

    const payload = await response.json();
    const records = Array.isArray(payload.results)
      ? payload.results
      : Array.isArray(payload.records)
        ? payload.records.map((item) => item?.record?.fields || item?.fields || {}).filter((item) => Object.keys(item).length)
        : [];

    assert.ok(
      records.length > 0,
      "L’API BODACC doit retourner des annonces dans results[] ou records[].record.fields. Clés reçues : " +
      Object.keys(payload).join(",") + "; aperçu : " + JSON.stringify(payload).slice(-900)
    );

    const record = records[0];
    assert.ok(
      record.id || record.numeroannonce || record.publicationavis,
      "Une annonce doit exposer un identifiant ou une référence source."
    );
    assert.ok(
      record.dateparution || record.typeavis_lib || record.familleavis_lib || record.commercant,
      "Une annonce doit exposer au moins un champ descriptif exploitable."
    );
    if (record.url_complete) {
      assert.ok(
        /^https:\/\/(www\.)?bodacc\.fr\//i.test(record.url_complete),
        "L’URL complète fournie doit rester sur le domaine officiel BODACC."
      );
    }

    console.log(
      `API BODACC réelle accessible : ${records.length} annonce(s) échantillonnée(s), référence ${record.id || record.numeroannonce || record.publicationavis}.`
    );
  } finally {
    clearTimeout(timeout);
  }
}

main().catch((error) => {
  console.error("Échec du contrôle d’intégration BODACC réel :", error);
  process.exitCode = 1;
});
