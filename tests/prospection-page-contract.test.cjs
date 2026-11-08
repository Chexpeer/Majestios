"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("prospection-active.html", "utf8");
const script = fs.readFileSync("company-targeting-page.js", "utf8");
const form = html.match(/<form id="company-targeting-form">([\\s\\S]*?)<\\/form>/);
assert.ok(form, "Le formulaire principal de Prospection doit exister.");

const controls = new Set();
for (const match of form[1].matchAll(/<(?:input|select|textarea)\\b[^>]*\\bname="([^"]+)"/g)) {
  controls.add(match[1]);
}
for (const match of script.matchAll(/form\\.elements\\.([A-Za-z_$][\\w$]*)/g)) {
  assert.ok(controls.has(match[1]), "Le script lit un champ absent du formulaire Prospection : " + match[1]);
}
for (const required of [
  "nafCodes", "departments", "region", "radiusLocation", "radiusKm", "limit",
  "workforce", "companyAge", "legalCategory", "nameContains", "includeUnknown",
  "caMin", "caMax", "estRge", "estQualiopi", "estEpV", "estEss", "activeOnly"
]) {
  assert.ok(controls.has(required), "Critère de prospection absent du formulaire : " + required);
}
assert.ok(script.includes("searchCompaniesNearPoint"), "Le mode rayon doit être raccordé au moteur géographique.");
assert.ok(script.includes("searchCompanies(searchCriteria)"), "Le mode département/région doit être raccordé au moteur principal.");
assert.ok(script.includes("filterCompaniesByCriteria"), "Les filtres métier doivent être appliqués aux résultats.");
console.log("Contrat du formulaire et du moteur Prospection : OK");
