"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const html = fs.readFileSync("qualification-entreprises.html", "utf8");
const script = fs.readFileSync("company-targeting-page.js", "utf8");
const form = html.match(/<form id="company-targeting-form">([\\s\\S]*?)<\\/form>/);
assert.ok(form, "Le formulaire de qualification doit exister.");
const controls = new Set();
for (const match of form[1].matchAll(/<(?:input|select|textarea)\\b[^>]*\\bname="([^"]+)"/g)) controls.add(match[1]);
for (const match of script.matchAll(/form\\.elements\\.([A-Za-z_$][\\w$]*)/g)) {
  assert.ok(controls.has(match[1]), "Le script lit un champ absent du formulaire : " + match[1]);
}
for (const required of ["marketTitle", "nafCodes", "departments", "limit", "activeOnly"]) {
  assert.ok(controls.has(required), "Champ attendu absent du formulaire : " + required);
}
for (const obsolete of ["region", "radiusLocation", "radiusKm", "workforce", "companyAge", "legalCategory", "nameContains", "includeUnknown", "caMin", "caMax", "estRge", "estQualiopi", "estEpV", "estEss"]) {
  assert.ok(!new RegExp("form\\.elements\\." + obsolete + "\\b").test(script), "Référence obsolète encore présente : " + obsolete);
}
console.log("Contrat HTML/JS de qualification : OK");
