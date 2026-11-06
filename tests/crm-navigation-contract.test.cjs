const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "..", "crm.html"), "utf8");
const adminHtml = fs.readFileSync(path.join(__dirname, "..", "administration.html"), "utf8");
const memberHtml = fs.readFileSync(path.join(__dirname, "..", "espace-membre.html"), "utf8");
const returnLinkCount = html.split('href="espace-interne.html"').length - 1;

assert.ok(
  html.includes('<meta name="robots" content="noindex,nofollow">'),
  "Le CRM interne doit être exclu de l’indexation des moteurs de recherche."
);

assert.equal(returnLinkCount, 1, "Le CRM doit proposer un seul retour vers l’accueil interne.");
assert.ok(
  html.includes('<nav class="admin-crm-header" aria-label="Navigation interne">') &&
  html.includes('<a class="admin-crm-return" href="espace-interne.html">') &&
  html.includes('<span class="admin-crm-current" aria-current="page">'),
  "Le CRM doit conserver son en-tête contextuel et un retour unique vers l’accueil interne."
);
assert.ok(html.includes('id="crm-admin-nav-link" href="administration.html" hidden') && html.includes('id="crm-search-nav-link" href="admin-recherches.html" hidden'), "Les liens de pilotage du CRM doivent être masqués par défaut.");
const crmScript = fs.readFileSync(path.join(__dirname, "..", "crm-page.js"), "utf8");
assert.ok(crmScript.includes('const canAdminister = ["owner", "admin"].includes(membership.role)') && crmScript.includes('document.querySelector("#crm-admin-nav-link").hidden = !canAdminister') && crmScript.includes('document.querySelector("#crm-search-nav-link").hidden = !canAdminister'), "Les liens Administration et Recherches du CRM doivent dépendre du rôle owner/admin.");
const adminNavStart = adminHtml.indexOf('<nav id="admin-nav" class="admin-nav">');
const adminNavEnd = adminHtml.indexOf("</nav>", adminNavStart);
const adminNav = adminHtml.slice(adminNavStart, adminNavEnd);
assert.ok(adminNav.includes('href="crm.html"') && adminNav.includes('href="admin-recherches.html"'), "Le cockpit doit donner accès au CRM et aux recherches dans sa navigation principale.");
const searchHtml = fs.readFileSync(path.join(__dirname, "..", "admin-recherches.html"), "utf8");
const searchNavStart = searchHtml.indexOf('<nav class="admin-nav">');
const searchNavEnd = searchHtml.indexOf("</nav>", searchNavStart);
const searchNav = searchHtml.slice(searchNavStart, searchNavEnd);
assert.ok(searchNav.includes('href="espace-interne.html"') && searchNav.includes('href="administration.html"') && searchNav.includes('href="crm.html"'), "Les recherches doivent proposer des repères cohérents vers l’accueil interne, l’administration et le CRM.");
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

const internalHtml = fs.readFileSync(path.join(__dirname, "..", "espace-interne.html"), "utf8");
assert.ok(internalHtml.includes('<meta name="robots" content="noindex,nofollow">'), "L’accueil interne doit être exclu de l’indexation.");
assert.ok(internalHtml.includes('src="espace-interne.js"') && internalHtml.includes('href="espace-interne.css"'), "L’accueil interne doit charger ses ressources dédiées.");
assert.ok(!internalHtml.includes("signUp(") && !internalHtml.includes("provision-client-workspace"), "L’accueil interne ne doit pas inscrire ni provisionner les espaces clients.");

assert.ok(html.includes('id="crm-targeting-form"') && html.includes('name="nafCodes"') && html.includes('name="departments"'), "Le poste Entreprises doit intégrer le ciblage marché au CRM.");
assert.ok(crmScript.includes("initMarketTargeting(!isReadOnly)") && crmScript.includes("MajestiosCRM.createBusiness") && crmScript.includes('qualification_status: "to_review"'), "Le ciblage doit réutiliser le client CRM et ses droits existants.");
assert.ok(crmScript.includes("targetingCandidates") && crmScript.includes("SIREN:"), "Le ciblage doit proposer la sélection et un contrôle des doublons déjà chargés.");
assert.ok(crmScript.includes("alreadyKnown.length") && crmScript.includes("contrainte d’unicité SIREN"), "Le ciblage doit signaler les doublons visibles et rappeler la limite du contrôle local.");
assert.ok(crmScript.includes("tranche_effectif_salarie") && crmScript.includes("nombre_etablissements"), "Les résultats doivent exploiter les indicateurs d’effectif et d’établissements lorsqu’ils sont fournis par la source.");
assert.ok(crmScript.includes("Identifiant source") && crmScript.includes("Collecte :") && crmScript.includes("Critères : APE/NAF"), "La fiche intégrée doit conserver les éléments de provenance et les critères de ciblage.");
assert.ok(crmScript.includes("failures.push") && crmScript.includes("Aucun dossier existant n’a été écrasé"), "Les erreurs d’intégration doivent être explicites et aucune fusion automatique ne doit être réalisée.");
const crmClient = fs.readFileSync(path.join(__dirname, "..", "crm-client.js"), "utf8");
assert.ok(crmClient.includes('async function listBusinessesPage') && crmClient.includes('.select("*", { count: "exact" })') && crmClient.includes(".range(from, to)"), "La recherche entreprises doit compter et paginer les résultats côté serveur.");
assert.ok(crmClient.includes('.eq("organization_id", membership.organization_id)') && crmClient.includes('query = query.or('), "La pagination et la recherche doivent rester limitées au tenant authentifié.");
assert.ok(crmClient.includes('"legal_name", "trade_name", "siren", "siret", "ape_naf", "city"'), "La recherche serveur doit couvrir identité, identifiants, APE/NAF et ville.");
assert.ok(html.includes('id="crm-business-server-search"') && html.includes('id="crm-business-previous"') && html.includes('id="crm-business-next"'), "Le poste Entreprises doit exposer recherche globale et pagination.");
assert.ok(crmScript.includes("MajestiosCRM.listBusinessesPage") && crmScript.includes("businessPageSize = 25"), "L’interface doit charger les entreprises par pages de 25 via le client CRM.");


console.log("CONTRAT NAVIGATION ET CIBLAGE CRM RÉUSSI.");

const workspaceNav = fs.readFileSync(path.join(__dirname, "..", "crm-workspace-nav.js"), "utf8");
const workspaceCss = fs.readFileSync(path.join(__dirname, "..", "crm-workspace.css"), "utf8");
assert.ok(html.includes('href="crm-workspace.css"') && html.includes('src="crm-workspace-nav.js"'), "Le CRM doit charger sa navigation métier dédiée.");
assert.ok(workspaceNav.includes('label: "Vue générale"') && workspaceNav.includes('label: "Entreprises"') && workspaceNav.includes('label: "Contacts"') && workspaceNav.includes('label: "Opportunités"') && workspaceNav.includes('label: "Activités & historique"'), "La navigation doit exposer les cinq espaces de travail CRM.");
assert.ok(workspaceNav.includes('nav.setAttribute("aria-label", "Navigation des modules CRM")') && workspaceNav.includes('button.setAttribute("aria-current"'), "La navigation CRM doit exposer l’état du module actif aux technologies d’assistance.");
assert.ok(workspaceNav.includes('event.key === "ArrowRight"') && workspaceNav.includes('event.key === "Home"') && workspaceNav.includes('event.key === "End"'), "La navigation CRM doit prendre en charge le clavier.");
assert.ok(workspaceCss.includes(".crm-workspace-nav-button.is-active") && workspaceCss.includes("@media(max-width:600px)"), "La navigation CRM doit distinguer le module actif et rester utilisable sur mobile.");

const businessFilterScript = fs.readFileSync(path.join(__dirname, "..", "crm-business-filters.js"), "utf8");
assert.ok(html.includes('id="crm-business-search"') && html.includes('id="crm-business-qualification"') && html.includes('id="crm-business-department"'), "Le poste Entreprises doit proposer recherche, qualification et filtre département.");
assert.ok(html.includes('src="crm-business-filters.js"'), "Le module de filtres entreprises doit être raccordé à la page CRM.");
assert.ok(crmScript.includes("item.dataset.searchText") && crmScript.includes("item.dataset.qualificationStatus") && crmScript.includes("item.dataset.departmentCode"), "Les fiches entreprises doivent exposer les champs utiles au filtrage local.");
assert.ok(businessFilterScript.includes("new MutationObserver(applyFilters)") && businessFilterScript.includes("item.hidden = !show"), "Les filtres doivent se réappliquer après actualisation de la liste sans recharger la page.");
assert.ok(businessFilterScript.includes("qualification.addEventListener") && businessFilterScript.includes("department.addEventListener"), "Les filtres de qualification et de département doivent être interactifs.");

assert.ok(crmScript.includes('className = "crm-business-dossier"'), "Chaque entreprise doit disposer d’un dossier détaillé consultable.");
assert.ok(crmScript.includes("related.contacts") && crmScript.includes("related.opportunities") && crmScript.includes("related.activities"), "Le dossier entreprise doit rapprocher contacts, opportunités et historique.");
assert.ok(crmScript.includes("identityFields") && crmScript.includes("source_url") && crmScript.includes("qualification_notes"), "Le dossier doit exposer identité, provenance et qualification disponibles.");
assert.ok(crmScript.includes("Une absence ici ne prouve pas l’absence"), "Le dossier doit expliciter la limite de couverture des relations chargées.");
