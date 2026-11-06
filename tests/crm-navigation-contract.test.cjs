const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "..", "crm.html"), "utf8");
const adminHtml = fs.readFileSync(path.join(__dirname, "..", "administration.html"), "utf8");
const memberHtml = fs.readFileSync(path.join(__dirname, "..", "espace-membre.html"), "utf8");
const returnLinkCount = html.split('href="administration.html"').length - 1;

assert.equal(returnLinkCount, 1, "Le CRM doit proposer un seul retour vers l’administration générale.");
assert.ok(
  html.includes('<header class="admin-crm-header">') &&
  html.includes('<a class="admin-crm-return" href="administration.html">'),
  "Le retour unique vers l’administration doit rester dans l’en-tête."
);
assert.ok(
  !html.includes('<footer class="admin-crm-footer"><a'),
  "Le pied de page ne doit pas dupliquer le lien de retour."
);
assert.ok(
  !html.includes('\\n<div class="interior-grid"'),
  "Le HTML ne doit pas contenir de séquence \\n littérale entre les sections."
);
assert.ok(
  html.includes('<script type="module" src="crm-page.js"></script>'),
  "Le raccordement du CRM existant doit être conservé."
);


assert.ok(
  adminHtml.includes('href="crm.html"'),
  "L’administration doit conserver son accès direct au CRM interne."
);
assert.ok(
  !memberHtml.includes('href="crm.html"'),
  "L’espace membre ne doit jamais proposer de lien direct vers le CRM interne."
);
assert.ok(
  memberHtml.includes("Votre espace personnel reste distinct") &&
  memberHtml.includes("seules les informations et les documents qui vous sont destinés"),
  "L’espace membre doit expliquer clairement la séparation avec le CRM interne."
);

console.log("CONTRAT NAVIGATION RÉUSSI : Administration → CRM interne, retour unique et espace membre séparé.");
