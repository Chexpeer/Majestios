"use strict";
const assert = require("node:assert/strict");
const signals = require("../prospecting-signals.js");

async function main() {
  const payload = { records: [
    { record: { fields: { id: "BODACC-CREATION-1", commercant: "Entreprise créée", familleavis: "creation", familleavis_lib: "Créations d’entreprises", dateparution: "2026-11-01", departement_nom_officiel: "Sarthe", ville: "Le Mans", url_complete: "https://www.bodacc.fr/pages/annonces-commerciales-detail/?id=1" } } },
    { record: { fields: { id: "BODACC-PROC-1", commercant: "Entreprise en procédure", familleavis: "procedure", familleavis_lib: "Procédures collectives", dateparution: "2026-11-02", departement_nom_officiel: "Sarthe", jugement: { nature: "Redressement judiciaire" } } } },
    { record: { fields: { id: "BODACC-CREATION-1", commercant: "Doublon", familleavis: "creation", familleavis_lib: "Créations d’entreprises" } } }
  ] };
  assert.equal(signals.unwrap(payload).length, 3);
  assert.equal(signals.matchesFamily(payload.records[0].record.fields, "creations"), true);
  assert.equal(signals.matchesFamily(payload.records[1].record.fields, "creations"), false);
  assert.equal(signals.normalizeSignal(payload.records[1].record.fields).isVigilance, true);

  const originalFetch = global.fetch;
  let requested;
  global.fetch = async (url) => {
    requested = new URL(url);
    return { ok: true, status: 200, json: async () => payload };
  };
  try {
    const result = await signals.searchSignals({ department: "Sarthe", family: "creations", limit: 10 });
    assert.equal(result.signals.length, 1, "La recherche doit filtrer la famille et dédoublonner les avis.");
    assert.equal(result.signals[0].company, "Entreprise créée");
    assert.equal(requested.searchParams.get("where"), 'departement_nom_officiel = "Sarthe"');
    assert.equal(requested.searchParams.get("order_by"), "dateparution desc");
    await assert.rejects(signals.searchSignals({}), /mot-clé ou choisissez un département/);
    await assert.rejects(signals.searchSignals({ department: "Sarthe", family: "unknown" }), /Famille/);
  } finally {
    global.fetch = originalFetch;
  }

  const previousFetch = global.fetch;
  global.fetch = async () => ({ ok: false, status: 503 });
  try {
    await assert.rejects(signals.searchSignals({ department: "Sarthe" }), /statut 503/);
  } finally {
    global.fetch = previousFetch;
  }
  console.log("Tests prospecting-signals : OK");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
