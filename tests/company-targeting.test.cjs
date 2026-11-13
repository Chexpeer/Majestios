"use strict";
const assert = require("node:assert/strict");
const targeting = require("../company-targeting.js");

async function main() {
  const rows = [
    { siren: "123456789", siret: "12345678900016", nom_complet: "Entreprise Alpha", activite_principale: "43.21A", siege: { code_postal: "79000", departement: "79", etat_administratif: "A" } },
    { siren: "123456789", siret: "12345678900016", nom_complet: "Entreprise Alpha doublon", activite_principale: "43.21A", siege: { code_postal: "79000", departement: "79", etat_administratif: "A" } },
    { siren: "123456789", siret: "12345678900024", nom_complet: "Entreprise Alpha établissement secondaire", activite_principale: "43.21A", siege: { code_postal: "79000", departement: "79", etat_administratif: "A" } },
    { siren: "987654321", siret: "98765432100011", nom_complet: "Entreprise Beta", activite_principale: "43.21A", siege: { code_postal: "33000", departement: "33", etat_administratif: "A" } },
    { siren: "111222333", siret: "11122233300019", nom_complet: "Entreprise Fermée", activite_principale: "43.21A", siege: { code_postal: "79000", departement: "79", etat_administratif: "C" } }
  ];

  const normalized = targeting.normalizeCompany(rows[0]);
  assert.equal(normalized.siren, "123456789");
  assert.equal(normalized.siret, "12345678900016");
  assert.equal(normalized.department, "79");
  assert.equal(targeting.normalizeCompany({ siege: { code_postal: "97100" } }).department, "971",
    "Un code postal ultramarin doit conserver le département à trois chiffres.");
  assert.equal(targeting.normalizeCompany({ siege: { code_postal: "97620" } }).department, "976",
    "Le département 976 ne doit pas être ramené au préfixe 97.");
  assert.equal(normalized.naf, "43.21A");
  assert.equal(targeting.deduplicateCompanies(rows).length, 3, "Dédoublonnage prioritaire sur le SIREN pour ne conserver qu’une fiche par personne morale.");
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

  const workforceExamples = [
    targeting.normalizeCompany({ siren: "100000001", nom_complet: "Petite entreprise", tranche_effectif_salarie: "02", date_creation: "2022-01-01", nature_juridique: "5499" }),
    targeting.normalizeCompany({ siren: "100000002", nom_complet: "Entreprise moyenne", tranche_effectif_salarie: "12", date_creation: "2018-01-01", nature_juridique: "5710" }),
    targeting.normalizeCompany({ siren: "100000003", nom_complet: "Donnée inconnue", date_creation: "", nature_juridique: "" })
  ];
  assert.equal(targeting.filterCompaniesByCriteria(workforceExamples, { workforce: "3-5", includeUnknown: false }).length, 1,
    "Le filtre d'effectif doit interpréter les codes de tranche INSEE.");
  assert.equal(targeting.filterCompaniesByCriteria(workforceExamples, { workforce: "unknown" }).length, 1,
    "Le filtre effectif inconnu doit isoler les fiches sans donnée.");
  assert.equal(targeting.filterCompaniesByCriteria(workforceExamples, { workforce: "3-5" }).length, 2,
    "Les fiches sans effectif restent incluses lorsque l'option de conservation est activée.");
  assert.equal(targeting.filterCompaniesByCriteria(workforceExamples, { companyAge: "3-5", includeUnknown: false }).length, 1,
    "Le filtre d'ancienneté doit calculer l'âge à partir de la date de création.");
  assert.equal(targeting.filterCompaniesByCriteria(workforceExamples, { legalCategory: "5710" })[0].name, "Entreprise moyenne");
  assert.equal(targeting.filterCompaniesByCriteria(workforceExamples, { nameContains: "petite" })[0].name, "Petite entreprise");
  const manyCompanies = Array.from({ length: 14 }, (_, index) => ({
    siren: String(100000000 + index),
    siret: String(10000000000000 + index),
    nom_complet: `Entreprise ${index}`,
    activite_principale: "43.21A",
    siege: { code_postal: "79000", departement: "79", etat_administratif: "A" }
  }));
  const capped = targeting.selectCandidates(manyCompanies, { nafCodes: ["43.21A"], departments: ["79"], limit: 100, minimumScore: 0 });
  assert.ok(capped.candidates.length <= 10, "Le ciblage d'entreprises est plafonné à dix résultats au total.");
  assert.equal(capped.requestedLimit, 10);
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
    assert.match(requestedUrls[0], /minimal=true/);
    assert.match(requestedUrls[0], /include=siege%2Cfinances|include=siege,finances/);
    const departmentOnly = await targeting.searchCompanies({ departments: ["79"] });
    assert.equal(departmentOnly.uniqueCount, 1, "Un territoire seul doit suffire à lancer une recherche.");
    assert.match(requestedUrls.at(-1), /departement=79/);
    const keywordOnly = await targeting.searchCompanies({ query: "atelier Martin" });
    assert.equal(keywordOnly.uniqueCount, 1, "Un mot-clé seul doit suffire à lancer une recherche.");
    assert.match(requestedUrls.at(-1), /q=atelier\+Martin/);
    await assert.rejects(targeting.searchCompanies({}), /mot-clé|critère/);
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

  const originalFetchForAdvanced = global.fetch;
  let advancedUrl = "";
  global.fetch = async (url) => {
    advancedUrl = String(url);
    return { ok: true, status: 200, json: async () => ({ results: [], total_pages: 1, total_results: 0 }) };
  };
  try {
    await targeting.searchCompanies({ nafCodes: ["43.21A"], departments: [], region: "52", query: "atelier Martin", workforce: "3-5", includeUnknown: true, caMin: 100000, caMax: 2000000, estRge: true, estQualiopi: true });
    assert.match(advancedUrl, /region=52/);
    assert.match(advancedUrl, /q=atelier\+Martin/);
    assert.match(advancedUrl, /tranche_effectif_salarie=02%2CNN/);
    assert.match(advancedUrl, /ca_min=100000/);
    assert.match(advancedUrl, /ca_max=2000000/);
    assert.match(advancedUrl, /est_rge=true/);
    assert.match(advancedUrl, /est_qualiopi=true/);
    await assert.rejects(targeting.searchCompanies({ nafCodes: ["43.21A"], departments: ["72"], caMin: 500, caMax: 100 }), /minimum ne peut pas dépasser/);
  } finally { global.fetch = originalFetchForAdvanced; }


  const originalGeoFetch = global.fetch;
  const geoCalls = [];
  global.fetch = async url => {
    geoCalls.push(String(url));
    if (String(url).includes("geo.api.gouv.fr")) return { ok: true, status: 200, json: async () => [{ nom: "Le Mans", code: "72181", codeDepartement: "72", centre: { type: "Point", coordinates: [0.1996, 48.0061] } }] };
    return { ok: true, status: 200, json: async () => ({ results: [{ siren: "123456789", nom_complet: "Entreprise proche", activite_principale: "43.21A", siege: { siret: "12345678900016" } }], total_pages: 1, total_results: 1 }) };
  };
  try {
    const near = await targeting.searchCompaniesNearPoint({
      nafCodes: ["43.21A"], location: "72000", radiusKm: 15
    });
    assert.equal(near.center.name, "Le Mans");
    assert.match(geoCalls[0], /codePostal=72000/, "Un code postal de cinq chiffres doit utiliser le paramètre officiel codePostal.");
    assert.equal(near.radiusKm, 15);
    assert.match(geoCalls[1], /near_point/);
    assert.match(geoCalls[1], /radius=15/);
    assert.doesNotMatch(geoCalls[1], /ca_min|ca_max|est_rge/,
      "La recherche géographique ne doit pas transmettre des filtres non pris en charge par son endpoint.");
    await assert.rejects(targeting.searchCompaniesNearPoint({ nafCodes: ["43.21A"], location: "Le Mans", radiusKm: 75 }), /1 et 50/);
  } finally { global.fetch = originalGeoFetch; }

  console.log("Tests company-targeting : OK");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
