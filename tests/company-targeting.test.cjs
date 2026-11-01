"use strict";
const assert = require("node:assert/strict");
const targeting = require("../company-targeting.js");

async function main() {
  const rows = [
    { siren: "123456789", siret: "12345678900016", nom_complet: "Entreprise Alpha", activite_principale: "43.21A", siege: { code_postal: "79000", departement: "79", etat_administratif: "A" } },
    { siren: "123456789", siret: "12345678900016", nom_complet: "Entreprise Alpha doublon", activite_principale: "43.21A", siege: { code_postal: "79000", departement: "79", etat_administratif: "A" } },
    { siren: "987654321", siret: "98765432100011", nom_complet: "Entreprise Beta", activite_principale: "43.21A", siege: { code_postal: "33000", departement: "33", etat_administratif: "A" } },
    { siren: "111222333", siret: "11122233300019", nom_complet: "Entreprise Fermée", activite_principale: "43.21A", siege: { code_postal: "79000", departement: "79", etat_administratif: "C" } }
  ];

  const normalized = targeting.normalizeCompany(rows[0]);
  assert.equal(normalized.siren, "123456789");
  assert.equal(normalized.siret, "12345678900016");
  assert.equal(normalized.department, "79");
  assert.equal(normalized.naf, "43.21A");
  assert.equal(targeting.deduplicateCompanies(rows).length, 3, "Dédoublonnage sur SIRET");
  const ranked = targeting.rankCompanies(rows, { nafCodes: ["43.21A"], departments: ["79"] });
  assert.equal(ranked[0].name, "Entreprise Alpha");
  assert.equal(ranked[0].score, 100);
  assert.match(ranked[0].warning, /ne prouve/);
  const selection = targeting.selectCandidates(rows, { nafCodes: ["43.21A"], departments: ["79"], limit: 10 });
  assert.equal(selection.candidates.length, 3);
  assert.equal(selection.countsByDepartment["79"], 2);
  assert.equal(selection.candidates.find((company) => company.siren === "123456789").score, 100, "Le scoring doit préserver département et statut après normalisation");
  assert.equal(selection.candidates.find((company) => company.siren === "111222333").active, false, "Le statut inactif doit rester disponible pour filtrage");
  assert.equal(selection.quotaFilledArtificially, false);
  assert.equal(targeting.normalizeCompany({ siren: "123", siret: "12" }).siren, "");
  assert.equal(targeting.normalizeCompany({ siren: "123", siret: "12" }).siret, "");

  const originalFetch = global.fetch;
  const requestedUrls = [];
  global.fetch = async (url) => {
    requestedUrls.push(String(url));
    return {
      ok: true,
      status: 200,
      json: async () => ({
        results: [{ siren: "123456789", nom_complet: "Entreprise Alpha", activite_principale: "43.21A", etat_administratif: "A", siege: { siret: "12345678900016", departement: "79", code_postal: "79000" } }],
        total_pages: 1,
        total_results: 1
      })
    };
  };
  try {
    const found = await targeting.searchCompanies({ nafCodes: ["43.21A"], departments: ["79"], perPage: 25 });
    assert.equal(found.uniqueCount, 1);
    assert.equal(found.candidates[0].siren, "123456789");
    assert.equal(found.source, "API Recherche d’Entreprises — DINUM");
    assert.match(requestedUrls[0], /activite_principale=43%2E21A|activite_principale=43.21A/);
    assert.match(requestedUrls[0], /departement=79/);
    await assert.rejects(targeting.searchCompanies({ departments: ["79"] }), /code APE\/NAF/);
  } finally {
    global.fetch = originalFetch;
  }

  const originalFetchForError = global.fetch;
  global.fetch = async () => ({ ok: false, status: 503 });
  try {
    await assert.rejects(
      targeting.searchCompanies({ nafCodes: ["43.21A"], departments: ["79"] }),
      /statut 503/
    );
  } finally {
    global.fetch = originalFetchForError;
  }
  console.log("Tests company-targeting : OK");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
