"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("prospection-active.html", "utf8");
const script = fs.readFileSync("company-targeting-page.js", "utf8");
const form = html.match(/<form\b(?=[^>]*\bid="company-targeting-form")[^>]*>([\s\S]*?)<\/form>/);
assert.ok(form, "Le formulaire principal de Prospection doit exister.");

const controls = new Set();
for (const match of form[1].matchAll(/<(?:input|select|textarea)\b[^>]*\bname="([^"]+)"/g)) {
  controls.add(match[1]);
}
for (const match of script.matchAll(/form\.elements\.([A-Za-z_$][\w$]*)/g)) {
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
assert.ok(script.includes("query: marketTitle"), "Le champ textuel doit être transmis au moteur département/région.");
assert.ok(script.includes("searchCompanies(searchCriteria)"), "Le mode département/région doit être raccordé au moteur principal.");
assert.ok(script.includes("filterCompaniesByCriteria"), "Les filtres métier doivent être appliqués aux résultats.");
const ux = fs.readFileSync("prospection-criteria-ux.js", "utf8");
for (const group of ["activity", "territory", "workforce", "age", "legal", "name", "revenue", "labels"]) {
  assert.ok(ux.includes('id: "' + group + '"'), "Groupe de critères progressifs absent : " + group);
}
assert.ok(ux.includes("prospecting-criteria-choice"), "Les critères non sélectionnés doivent être proposés sous forme de choix.");
assert.ok(ux.includes("prospecting-criteria-chip"), "Les critères sélectionnés doivent rester visibles sous forme de filtres actifs.");
assert.ok(ux.includes("available.replaceChildren()"), "La liste des critères disponibles doit être reconstruite après sélection.");
assert.ok(ux.includes("selected.append(chip)"), "Un critère sélectionné doit rejoindre le récapitulatif actif.");
assert.ok(ux.includes("edit.addEventListener(\"click\""), "Un critère actif doit rester modifiable.");
assert.ok(ux.includes("prospecting-criteria-chip-remove"), "Un critère actif doit pouvoir être retiré.");
assert.ok(ux.includes("clearGroup(group)"), "Le retrait doit réinitialiser les valeurs du critère.");
assert.ok(ux.includes('group.id === "territory"'), "Le territoire ne doit être considéré actif qu'avec une localisation réelle.");

assert.ok(ux.includes("const clearGroup = (group)"), "Un critère supprimé doit pouvoir être réinitialisé.");
assert.ok(ux.includes("label.hidden = false"), "Les champs déplacés dans le panneau progressif doivent rester visibles.");
assert.ok(ux.includes("if (control?.required) control.required = false"), "La validation native ne doit pas bloquer un champ requis masqué.");
assert.ok(html.includes('src="prospection-criteria-ux.js"'), "L'interface progressive doit être chargée sur la page Prospection.");
console.log("Contrat du formulaire et du moteur Prospection : OK");
