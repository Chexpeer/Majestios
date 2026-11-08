const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const read = (name) => fs.readFileSync(path.join(__dirname, "..", name), "utf8");

const admin = read("administration.html");
const crm = read("crm.html");
const crmPage = read("crm-page.js");
const internal = read("espace-interne.js");
const crmClient = read("crm-client.js");
const member = read("espace-membre.html");
const internalHtml = read("espace-interne.html");
const adminJs = read("administration.js");

const moduleNavStart = admin.indexOf('<nav id="admin-nav" class="admin-nav"');
const moduleNavEnd = admin.indexOf("</nav>", moduleNavStart);
assert.ok(moduleNavStart >= 0 && moduleNavEnd > moduleNavStart, "Le cockpit doit exposer une navigation intermodules.");
const moduleNav = admin.slice(moduleNavStart, moduleNavEnd);
assert.ok(moduleNav.includes('aria-label="Navigation des modules internes"'), "La navigation du cockpit doit être identifiée comme navigation des modules.");
assert.ok(moduleNav.includes('href="administration.html"') && moduleNav.includes('aria-current="page"'), "Le module Administration doit être identifié comme actif.");
assert.ok(moduleNav.includes('href="crm.html"') && moduleNav.includes('href="admin-recherches.html"'), "Le cockpit doit donner accès au CRM et aux recherches ciblées.");

const sectionNavStart = admin.indexOf('<nav class="admin-nav admin-section-nav"');
const sectionNavEnd = admin.indexOf("</nav>", sectionNavStart);
assert.ok(sectionNavStart >= 0 && sectionNavEnd > sectionNavStart, "Le cockpit doit conserver une navigation locale distincte.");
const sectionNav = admin.slice(sectionNavStart, sectionNavEnd);
for (const id of ["cockpit", "sources", "team", "clients"]) {
  assert.ok(sectionNav.includes('href="#' + id + '"'), "Ancre interne du cockpit absente : " + id);
}

assert.ok(crm.includes('<nav class="admin-crm-header" aria-label="Navigation des modules internes et accueil">'), "Le CRM doit annoncer sa navigation intermodules.");
assert.ok(crm.includes('href="espace-interne.html"'), "Le CRM doit conserver le retour à l'accueil interne.");
assert.ok(crm.includes('id="crm-admin-nav-link" href="administration.html" hidden'), "L'accès Administration doit être masqué par défaut dans le CRM.");
assert.ok(crm.includes('id="crm-search-nav-link" href="admin-recherches.html" hidden'), "L'accès Recherches doit être masqué par défaut dans le CRM.");
assert.match(crmPage, /const canAdminister = \["owner", "admin"\]\.includes\(membership\.role\)/);
assert.ok(crmPage.includes('document.querySelector("#crm-admin-nav-link").hidden = !canAdminister') &&
  crmPage.includes('document.querySelector("#crm-search-nav-link").hidden = !canAdminister'),
  "Les liens d'administration du CRM doivent dépendre du rôle owner/admin.");

assert.ok(internal.includes('["owner", "admin", "member", "viewer"]'), "Les quatre rôles internes doivent être reconnus.");
assert.ok(internal.includes('["owner", "admin"].includes(membership.role)'), "L'administration doit rester réservée à owner/admin.");
assert.ok(internal.includes('membership.role === "viewer"') && /consultation seule/i.test(internal), "Le rôle viewer doit rester explicitement en lecture seule.");
assert.ok(internalHtml.includes('id="internal-crm-link"') && internalHtml.includes('href="crm.html"'), "Le CRM doit rester proposé depuis l'accueil interne.");

assert.ok(!member.includes('href="crm.html"'), "L'espace client ne doit jamais proposer de lien direct vers le CRM interne.");
assert.ok(crmClient.includes('.eq("organization_id", membership.organization_id)'), "Les requêtes CRM doivent rester limitées à l'organisation authentifiée.");
assert.ok(crmClient.includes('membership.role === "viewer"'), "Le client CRM doit conserver le verrouillage en lecture seule du rôle viewer.");

for (const [id,table] of [
  ["metric-crm-businesses","businesses"],
  ["metric-crm-contacts","contacts"],
  ["metric-crm-opportunities","opportunities"]
]) {
  assert.ok(admin.includes('id="' + id + '"'), "Indicateur CRM absent du cockpit : " + id);
  assert.ok(adminJs.includes('from("' + table + '").select("id",{count:"exact",head:true}).eq("organization_id",orgId)'),
    "Le compteur " + table + " doit être limité à l'organisation interne authentifiée.");
}
console.log("CONTRAT NAVIGATION ADMINISTRATION / CRM RÉUSSI.");
