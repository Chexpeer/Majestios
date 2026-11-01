"use strict";
const assert = require("node:assert/strict");
const targeting = require("../company-targeting.js");

const rows = [
  { siren: "123456789", siret: "12345678900016", nom_complet: "Entreprise Alpha", activite_principale: "43.21A", siege: { code_postal: "79000", etat_administratif: "A" } },
  { siren: "123456789", siret: "12345678900016", nom_complet: "Entreprise Alpha doublon", activite_principale: "43.21A", siege: { code_postal: "79000", etat_administratif: "A" } },
  { siren: "987654321", siret: "98765432100011", nom_complet: "Entreprise Beta", activite_principale: "43.21A", siege: { code_postal: "33000", etat_administratif: "A" } },
  { siren: "111222333", siret: "11122233300019", nom_complet: "Entreprise Fermée", activite_principale: "43.21A", siege: { code_postal: "79000", etat_administratif: "C" } }
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
assert.equal(selection.quotaFilledArtificially, false);
assert.equal(targeting.normalizeCompany({ siren: "123", siret: "12" }).siren, "");
assert.equal(targeting.normalizeCompany({ siren: "123", siret: "12" }).siret, "");
console.log("Tests company-targeting : OK");
