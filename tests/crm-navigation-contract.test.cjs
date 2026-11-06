const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "..", "crm.html"), "utf8");
const adminReturns = [...html.matchAll(/<a\\b[^>]*href=["']administration\\.html["'][^>]*>/gi)];
assert.equal(adminReturns.length, 1, "Le CRM doit proposer un seul retour vers l’administration générale.");
assert.match(html, /<header class="admin-crm-header">[\\s\\S]*?admin-crm-return[\\s\\S]*?href="administration\\.html"/,
  "Le retour unique vers l’administration doit rester dans l’en-tête.");
assert.doesNotMatch(html, /<footer[^>]*>[\\s\\S]*?<a[^>]*administration\\.html/i,
  "Le pied de page ne doit pas dupliquer le lien de retour.");
assert.doesNotMatch(html, /\\\\n<div class="interior-grid"/,
  "Le HTML ne doit pas contenir de séquence \\n littérale entre les sections.");
assert.match(html, /<script type="module" src="crm-page\\.js"><\\/script>/,
  "Le raccordement du CRM existant doit être conservé.");
console.log("CONTRAT NAVIGATION CRM RÉUSSI : un seul retour Administration, pied de page sans doublon et balisage propre.");
