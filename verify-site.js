const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
const pages = fs.readdirSync(root).filter((name) => name.endsWith(".html"));
const manifestPath = path.join(root, "site-files.json");
const exists = (file) => fs.existsSync(path.join(root, file));
let siteFiles = [];

try {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  assert(manifest.version === 1, "Build : version de manifeste non prise en charge");
  siteFiles = Array.isArray(manifest.files) ? manifest.files : [];
} catch (error) {
  errors.push("Build : site-files.json absent ou invalide : " + error.message);
}

assert(siteFiles.length > 0, "Build : manifeste des ressources vide");
assert(new Set(siteFiles).size === siteFiles.length, "Build : fichiers dupliqués dans site-files.json");
for (const file of siteFiles) {
  assert(typeof file === "string" && file.trim().length > 0, "Build : chemin vide ou invalide dans le manifeste");
  if (typeof file !== "string" || !file.trim()) continue;
  const normalized = file.replace(/\\/g, "/");
  assert(!path.posix.isAbsolute(normalized) && !normalized.split("/").includes(".."), "Build : chemin interdit dans le manifeste : " + file);
  assert(!/\.mdx?$/i.test(file), "Build : la documentation ne doit pas être publiée : " + file);
  assert(exists(file) && fs.statSync(path.join(root, file)).isFile(), "Build : ressource déclarée absente ou non-fichier : " + file);
}
for (const page of pages) assert(siteFiles.includes(page), "Build : page HTML absente du manifeste : " + page);
for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), "utf8");
  assert(html.includes('src="navigation-tiroirs.js"'), page + " : navigation commune et accès VIP non chargés");
}
assert(siteFiles.includes("navigation-tiroirs.js") && siteFiles.includes("navigation-tiroirs.css"),
  "Navigation commune : script ou feuille de style absent du manifeste");
const sharedNavigationBootstrap = fs.readFileSync(path.join(root, "navigation-tiroirs.js"), "utf8");
assert(sharedNavigationBootstrap.includes("ensureNavigationShell") && sharedNavigationBootstrap.includes("ensureSharedAssets"),
  "Navigation commune : création de la barre ou chargement de ses styles de secours absent");

const legacyVisibleTerms = [
  "prospection inversée",
  "zone artisanale",
  "zone industrielle",
  "quartier d'affaires",
  "quartier d’affaires",
  "intelligence commerciale",
  "e-réputation",
  "prospection active"
];
for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), "utf8");
  const normalized = html.toLocaleLowerCase("fr");
  for (const term of legacyVisibleTerms) {
    assert(!normalized.includes(term), page + " : terminologie MajestiOS obsolète détectée (« " + term + " »)");
  }
  assert(!html.includes('href="index.html#accueil"'), page + " : le retour d'accueil doit ouvrir la route, sans fragment local");
}


const eInvoicePage = fs.readFileSync(path.join(root, "facturation-electronique.html"), "utf8");
assert(eInvoicePage.includes("MISE EN CONFORMITÉ") && eInvoicePage.includes("La réforme change vos habitudes de facturation.") && eInvoicePage.includes("Vérifiez vos obligations et préparez vos outils."), "Facturation électronique : message de mise en conformité absent");
assert(eInvoicePage.includes("1er septembre 2026") && eInvoicePage.includes("1er septembre 2027"), "Facturation électronique : calendrier réglementaire incomplet");
assert(eInvoicePage.includes("facturation-electronique-qu-est-ce-que-ca-change-pour-moi"), "Facturation électronique : simulateur officiel absent");
assert(eInvoicePage.includes("je-consulte-la-liste-des-plateformes-agreees"), "Facturation électronique : liste officielle des plateformes agréées absente");
assert(eInvoicePage.includes("MajestiOS n'est pas une plateforme agréée"), "Facturation électronique : statut de MajestiOS à clarifier");

const assistantPage = fs.readFileSync(path.join(root, "assistant-majestios.html"), "utf8");
assert(assistantPage.includes('id="assistant-open-guide"'), "Assistant : la page dédiée doit proposer un accès fonctionnel au guide local");
assert(!/textarea[^>]*\bdisabled\b/i.test(assistantPage) && !/<button[^>]*\bdisabled\b[^>]*>Envoyer/i.test(assistantPage), "Assistant : aucun formulaire de conversation inactif ne doit être présenté");
assert(fs.readFileSync(path.join(root, "app.js"), "utf8").includes('document.querySelector("#assistant-open-guide")?.addEventListener("click", () => setOpen(true))'), "Assistant : le bouton de la page dédiée doit ouvrir le guide conversationnel partagé");
const reputationPage = fs.readFileSync(path.join(root, "reputation-virtuelle.html"), "utf8");
assert(/<section class="audit-dossier"[^>]*\bhidden\b/.test(reputationPage), "Réputation virtuelle : le formulaire principal de préparation doit rester masqué dans l’interface publique");
assert(/<div class="reputation-searches"[^>]*\bhidden\b/.test(reputationPage), "Réputation virtuelle : les formulaires Google Web et Maps doivent rester masqués dans l’interface publique sans être supprimés");
assert((reputationPage.match(/<form\b/g) || []).length === 3, "Réputation virtuelle : les trois formulaires métier doivent être conservés dans le document pour leurs traitements internes");

const memberPage = fs.readFileSync(path.join(root, "espace-membre.html"), "utf8");
assert(memberPage.includes('meta name="robots" content="noindex,nofollow"'), "Espace membre : la page de compte doit être exclue de l’indexation");
const searchResultsPage = fs.readFileSync(path.join(root, "resultats-recherche.html"), "utf8");
assert(searchResultsPage.includes('meta name="robots" content="noindex,nofollow"'), "Résultats de recherche : les pages de résultats dynamiques ne doivent pas être indexées");
const privateAccessPage = fs.readFileSync(path.join(root, "espace-prive.html"), "utf8");
assert(privateAccessPage.includes('href="charte-majestios.css"'), "Espace privé / Accès VIP : la charte graphique commune MajestiOS doit être chargée");
const internalEntryPage = fs.readFileSync(path.join(root, "espace-interne.html"), "utf8");
assert(internalEntryPage.includes('id="internal-login-form"') && internalEntryPage.includes('id="internal-login-submit"'), "Accès VIP : la page d’entrée doit afficher le formulaire d’authentification de secours même si le module ne se charge pas");
assert(internalEntryPage.includes('src="espace-interne.js"') && internalEntryPage.includes('href="espace-interne.css"'), "Accès VIP : les ressources de l’entrée interne doivent être chargées");
assert(internalEntryPage.includes('id="internal-feedback"') && internalEntryPage.includes('Aucun accès n’a été ouvert'), "Accès VIP : un échec de chargement du module doit produire un message explicite, pas une page vide");
const sharedNavigation = fs.readFileSync(path.join(root, "navigation-tiroirs.js"), "utf8");
assert(sharedNavigation.includes('["Accès VIP · Administration","espace-interne.html"]'), "Navigation : le lien Accès VIP doit pointer vers le sas d’authentification interne");
const adminPage = fs.readFileSync(path.join(root, "administration.html"), "utf8");
assert(siteFiles.includes("administration.html"), "Administration : page absente du manifeste");
const searchPagePath = path.join(root, "admin-recherches.html");
assert(fs.existsSync(searchPagePath), "Recherches : page d’administration absente");
assert(siteFiles.includes("admin-recherches.html") && siteFiles.includes("admin-recherches.js"), "Recherches : page ou script absent du manifeste");
const searchPage = fs.readFileSync(searchPagePath, "utf8");
assert(searchPage.includes('meta name="robots" content="noindex,nofollow"'), "Recherches : la page doit être exclue de l’indexation");
assert(searchPage.includes('src="admin-recherches.js"'), "Recherches : script métier non chargé");
const searchScript = fs.readFileSync(path.join(root, "admin-recherches.js"), "utf8");
assert(searchScript.includes("annonces-commerciales/records") && searchScript.includes("boamp/records"), "Recherches : les deux sources officielles doivent être raccordées");
assert(searchPage.includes('id="date-from"') && searchPage.includes('id="date-to"'), "Recherches : filtres de période absents");
assert(searchPage.includes('id="market-type"'), "Recherches : filtre du type de marché BOAMP absent");
const targetingPage = fs.readFileSync(path.join(root, "qualification-entreprises.html"), "utf8");
const targetingPageScript = fs.readFileSync(path.join(root, "company-targeting-page.js"), "utf8");
assert(targetingPage.includes('id="target-market-description"') && targetingPage.includes('name="marketDescription"'), "Ciblage : champ de description du marché et des lots absent");
assert(targetingPageScript.includes("form.elements.marketDescription.value") && targetingPageScript.includes("suggestNafCodes({ title, description }"), "Ciblage : les suggestions APE/NAF doivent exploiter le descriptif fourni");
assert(searchScript.includes("code_departement_prestation") && searchScript.includes("dateparution >= date") && searchScript.includes("type_marche ="), "Recherches : filtres territoriaux, temporels ou métier incomplets");
assert(searchScript.includes("AbortController") && searchScript.includes("source.dispatchEvent(new Event(\"change\"))"), "Recherches : délai réseau ou état initial des filtres non maîtrisé");
assert(searchPage.includes('href="administration.html"') && searchPage.includes('href="crm.html"'), "Recherches : navigation interne incomplète");
assert(searchPage.includes('href="admin-recherches.html" aria-current="page"'), "Recherches : la page active doit être annoncée aux technologies d’assistance");
assert(searchScript.includes("organization_members") && searchScript.includes("owner") && searchScript.includes("admin"), "Recherches : contrôle d’accès interne absent");
assert(siteFiles.includes("administration.css") && siteFiles.includes("administration.js"), "Administration : ressources du cockpit absentes du manifeste");
assert(adminPage.includes('meta name="robots" content="noindex,nofollow"'), "Administration : la page doit être exclue de l’indexation");
assert(adminPage.includes('src="administration.js"') && adminPage.includes('href="administration.css"'), "Administration : ressources du cockpit non chargées");
assert(adminPage.includes('href="crm.html"'), "Administration : accès au CRM interne absent");
const crmPage = fs.readFileSync(path.join(root, "crm.html"), "utf8");
assert(crmPage.includes('<nav class="admin-crm-header" aria-label="Navigation des modules internes et accueil">') && crmPage.includes('aria-current="page"') && crmPage.includes('id="crm-admin-nav-link"') && crmPage.includes('id="crm-search-nav-link"'), "CRM : navigation interne ou repère de page actuelle absent");
const crmPageScript = fs.readFileSync(path.join(root, "crm-page.js"), "utf8");
const crmClientScript = fs.readFileSync(path.join(root, "crm-client.js"), "utf8");
assert(crmPageScript.includes(String.raw`nafCodes.some(value => !/^\d{2}\.\d{2}[A-Z]$/.test(value))`),
  "CRM : la validation APE/NAF doit accepter le format 43.21A");
assert(crmPageScript.includes(String.raw`departments.some(value => !/^(\d{2}|2A|2B|97[1-6]|978|977|986|987|988)$/.test(value))`),
  "CRM : la validation des départements doit accepter les codes numériques et territoriaux");

const adminScript = fs.readFileSync(path.join(root, "administration.js"), "utf8");
assert(adminScript.includes("organization_members"), "Administration : contrôle d’accès aux appartenances internes absent");
assert(/\.kind\s*===\s*"internal"/.test(adminScript), "Administration : filtrage de l’organisation interne absent");
assert(/\[\s*"owner"\s*,\s*"admin"\s*\]\.includes\(\s*membership\.role\s*\)/.test(adminScript),
  "Administration : seuls owner/admin doivent pouvoir accéder au cockpit");

assert(crmPage.includes('href="espace-interne.html"') && crmPage.includes("admin-crm-header"), "CRM : retour contextuel vers l’accueil interne absent");
assert(crmPage.includes('meta name="robots" content="noindex,nofollow"'), "CRM : la page interne doit être exclue de l’indexation");
assert(crmClientScript.includes("async function countWorkspaceRecords(table)") && crmClientScript.includes('select("id", { count: "exact", head: true })'), "CRM : les compteurs doivent utiliser un total exact tenant-scoped sans télécharger les fiches");
assert(crmClientScript.includes("async function countPendingReminders()") && crmPageScript.includes("countPendingReminders()"), "CRM : la liste des relances persistantes doit signaler un plafond de 100 éléments");
assert(crmPage.includes('id="crm-followup-data-notice"') && crmPageScript.includes("countWorkspaceRecords(\"opportunities\")"), "CRM : l'aperçu des relances doit signaler toute couverture partielle");
for (const asset of ["crm-workspace.css", "crm-page.js", "crm-client.js", "crm-workspace-nav.js", "crm-business-filters.js"]) {
  assert(siteFiles.includes(asset), "CRM : ressource du poste de travail absente du manifeste : " + asset);
  assert(exists(asset), "CRM : ressource du poste de travail absente du dépôt : " + asset);
}
assert(crmPage.includes('href="crm-workspace.css"') && crmPage.includes('src="crm-page.js"') &&
  crmPage.includes('src="crm-business-filters.js"') && crmPage.includes('src="crm-workspace-nav.js"'),
  "CRM : styles et modules du poste de travail doivent être chargés.");


const rubricSearchPages = [
  "marches-publics.html", "developpement-commercial.html", "prospection-active.html",
  "veille-marches.html", "accompagnement-appels-offres.html", "sous-traitance.html",
  "intelligence-economique.html", "reseaux-synergies.html",
  "bodacc-veille-entreprises.html", "suivi-commercial.html", "marches-prives.html",
  "reputation-virtuelle.html", "espace-membre.html", "salons-seminaires.html",
  "crm.html", "majestios-v5.html",
  "categorie-services-numeriques.html", "categorie-travaux-amenagement.html",
  "categorie-conseil-etudes.html", "categorie-batiment.html", "categorie-renovation.html",
  "categorie-electricite.html", "categorie-plomberie-chauffage.html", "categorie-maintenance.html",
  "faq.html", "nous-rejoindre.html", "vision-majestios.html", "qualification-entreprises.html", "resultats-recherche.html"
];
for (const page of rubricSearchPages) {
  assert(exists(page), "Recherche par rubrique : page absente : " + page);
  if (exists(page)) {
    const html = fs.readFileSync(path.join(root, page), "utf8");
    if (page === "reputation-virtuelle.html") {
      assert(!html.includes('src="rubric-search.js"'), page + " : le moteur de recherche partagé ne doit pas être chargé sur cette page");
    } else {
      assert(html.includes('src="rubric-search.js"'), page + " : module de recherche par rubrique non chargé");
      assert(html.indexOf('src="rubric-search.js"') < html.indexOf('src="app.js"'), page + " : le moteur commun doit être injecté avant l’initialisation de ses interactions");
    }
    assert(html.includes('href="rubriques-immersives.css"'), page + " : feuille de style commune du moteur non chargée");
  }
}

const sharedSearchScript = fs.readFileSync(path.join(root, "rubric-search.js"), "utf8");
for (const id of ["feed-search", "feed-market-type", "feed-sector", "feed-department", "market-step", "category-step", "department-step"]) {
  assert(sharedSearchScript.includes('id="' + id + '"'), "Moteur partagé : structure commune incomplète, #" + id);
}
assert(sharedSearchScript.includes('class="feed-toolbar"'), "Moteur partagé : le formulaire doit réutiliser le composant de l’accueil");
assert(sharedSearchScript.includes('class="feed-search-submit"'), "Moteur partagé : le bouton doit réutiliser le composant de l’accueil");

for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), "utf8");
  const ids = new Set();
  for (const match of html.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)) {
    if (ids.has(match[1])) errors.push(page + " : identifiant dupliqué #" + match[1]);
    ids.add(match[1]);
  }
  for (const match of html.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi)) {
    const value = match[1].trim();
    if (!value || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value) || value.startsWith("data:") || value.startsWith("#")) continue;
    const [pathname, fragment] = value.split("#", 2);
    const cleanPath = (pathname || "").split("?")[0];
    let decoded;
    try { decoded = decodeURIComponent(cleanPath); }
    catch { errors.push(page + " : URL locale mal encodée : " + value); continue; }
    const target = decoded ? path.resolve(root, decoded) : path.join(root, page);
    if (target !== root && !target.startsWith(root + path.sep)) {
      errors.push(page + " : chemin hors du projet : " + value);
      continue;
    }
    if (!fs.existsSync(target)) {
      errors.push(page + " : ressource locale absente : " + value);
      continue;
    }
    if (fragment && target.endsWith(".html")) {
      let targetHtml;
      try { targetHtml = target === path.join(root, page) ? html : fs.readFileSync(target, "utf8"); }
      catch { continue; }
      const targetIds = new Set([...targetHtml.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map((item) => item[1]));
      if (!targetIds.has(decodeURIComponent(fragment))) errors.push(page + " : ancre absente : " + value);
    }
  }
}

const home = fs.readFileSync(path.join(root, "index.html"), "utf8");
assert(home.includes("<title>MajestiOS — Développement commercial intelligent</title>"), "Accueil : titre SEO inattendu");
assert(home.includes('id="home-search-mount"'), "Accueil : emplacement du moteur de recherche partagé absent");
assert(home.includes('src="rubric-search.js"'), "Accueil : composant commun de recherche non chargé");
assert(home.indexOf('src="catalogue-majestios.js"') < home.indexOf('src="rubric-search.js"') &&
  home.indexOf('src="rubric-search.js"') < home.indexOf('src="app.js"'),
  "Accueil : le catalogue, le composant de recherche et son contrôleur doivent être chargés dans cet ordre");
const sharedSearchCss = fs.readFileSync(path.join(root, "rubriques-immersives.css"), "utf8");
for (const selector of ["#advanced-search-form", ".feed-search", ".feed-filter-label", ".feed-search-submit"]) {
  assert(sharedSearchCss.includes(selector), "Moteur partagé : style commun absent, " + selector);
}
assert(!home.includes('id="floor-rows"') && !home.includes('class="building-home"'), "Accueil : ancienne navigation par immeuble encore présente");
assert(home.includes('id="site-nav"') && home.includes('id="menu-toggle"'), "Accueil : navigation principale ou commande hamburger absente");
assert(fs.readFileSync(path.join(root, "app.js"), "utf8").includes("Assistant conversationnel de première génération"), "Assistant conversationnel partagé absent");
assert(siteFiles.includes("assistant-majestios.html") && siteFiles.includes("assistant-majestios.css") && siteFiles.includes("majestios-chat.css"),
  "Assistant : page dédiée et feuilles de style absentes du manifeste.");
assert(assistantPage.includes("Assistant MajestiOS") && assistantPage.includes("IA à raccorder") && assistantPage.includes("guide conversationnel de première génération") &&
  assistantPage.includes('src="app.js"') && assistantPage.includes('href="assistant-majestios.css"'),
  "Assistant : espace dédié, statut de connexion ou ressources manquants.");
assert(fs.readFileSync(path.join(root, "majestios-chat.css"), "utf8").includes(".majestios-chat-toggle"),
  "Assistant : styles du chatbot flottant absents.");
 
const invoicingPage = fs.readFileSync(path.join(root, "facturation-electronique.html"), "utf8");
assert(siteFiles.includes("facturation-electronique.html"), "Facturation électronique : page absente du manifeste");
assert(invoicingPage.includes("1er septembre 2027") && invoicingPage.includes("MajestiOS n'est pas une plateforme agréée"), "Facturation électronique : calendrier ou statut MajestiOS absent");
const tenderAccompaniment = fs.readFileSync(path.join(root, "accompagnement-appels-offres.html"), "utf8");
assert(tenderAccompaniment.includes('href="facturation-electronique.html"'), "Accompagnement appels d'offres : lien vers la thématique facturation absent");
assert(home.includes("Un CRM en évolution pour repérer les opportunités et organiser votre développement commercial.") && home.includes("Certaines fonctions restent en préparation."), "Accueil : le positionnement CRM et le statut des fonctions en préparation doivent être explicites");


const internalEntryHtml = fs.readFileSync(path.join(root, "espace-interne.html"), "utf8");
const internalEntryCss = fs.readFileSync(path.join(root, "espace-interne.css"), "utf8");
const internalEntryScript = fs.readFileSync(path.join(root, "espace-interne.js"), "utf8");
assert(siteFiles.includes("espace-interne.html") && siteFiles.includes("espace-interne.css") && siteFiles.includes("espace-interne.js"),
  "Accueil interne : page, styles ou script absents du manifeste");
assert(internalEntryHtml.includes('meta name="robots" content="noindex,nofollow"'),
  "Accueil interne : la page doit être exclue de l’indexation");
assert(internalEntryHtml.includes('src="espace-interne.js"') && internalEntryHtml.includes('href="espace-interne.css"'),
  "Accueil interne : ressources dédiées non chargées");
assert(internalEntryScript.includes("signInWithPassword(") && !internalEntryScript.includes("signUp(") &&
  !internalEntryScript.includes("provision-client-workspace"),
  "Accueil interne : connexion existante attendue, sans inscription ni provisionnement client");
assert(internalEntryScript.includes('["owner", "admin"].includes(membership.role)') &&
  internalEntryScript.includes('membership.role === "viewer"'),
  "Accueil interne : filtrage des modules par rôle incomplet");
assert(internalEntryCss.includes(".internal-module-grid") && internalEntryCss.includes("@media(max-width:760px)"),
  "Accueil interne : grille des modules ou adaptation mobile absente");
assert(adminPage.includes('href="espace-interne.html?returnTo=administration.html"'),
  "Administration : le parcours d’authentification interne doit être utilisé");
assert(searchPage.includes('href="espace-interne.html?returnTo=admin-recherches.html"'),
  "Recherches : le parcours d’authentification interne doit être utilisé");

if (errors.length) {
  console.error("Vérification du site échouée : " + errors.length + " problème(s).\n- " + errors.join("\n- "));
  process.exit(1);
}
console.log("Site vérifié : " + pages.length + " pages HTML, " + siteFiles.length + " ressources publiées, liens locaux et identifiants contrôlés.");
