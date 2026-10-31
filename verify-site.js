const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const pages = fs.readdirSync(root).filter((name) => name.endsWith(".html"));
const errors = [];
let references = 0;

for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), "utf8");
  const ids = new Set([...html.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map((match) => match[1]));
  const seenIds = new Set();

  for (const match of html.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)) {
    if (seenIds.has(match[1])) errors.push(`${page}: identifiant dupliqué #${match[1]}`);
    seenIds.add(match[1]);
  }

  for (const match of html.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi)) {
    const value = match[1].trim();
    if (!value || /^(?:[a-z]+:|\/\/)/i.test(value) || value.startsWith("data:")) continue;

    const [pathname, fragment = ""] = value.split("#", 2);
    const cleanPath = pathname.split("?")[0];
    const target = cleanPath ? path.resolve(root, decodeURIComponent(cleanPath)) : path.join(root, page);
    references++;

    if (!target.startsWith(root + path.sep) && target !== root) {
      errors.push(`${page}: chemin hors du projet : ${value}`);
      continue;
    }
    if (!fs.existsSync(target)) {
      errors.push(`${page}: ressource locale absente : ${value}`);
      continue;
    }

    if (fragment && target.endsWith(".html")) {
      const targetHtml = target === path.join(root, page) ? html : fs.readFileSync(target, "utf8");
      const targetIds = new Set([...targetHtml.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map((item) => item[1]));
      if (!targetIds.has(decodeURIComponent(fragment))) errors.push(`${page}: ancre absente : ${value}`);
    }
  }
}

// Contrôler aussi les fichiers livrés par le script de build.
const buildPath = path.join(root, "build.js");
if (fs.existsSync(buildPath)) {
  const build = fs.readFileSync(buildPath, "utf8");
  for (const page of pages) {
    if (!build.includes(`"${page}"`)) errors.push(`build.js: page absente de la liste de publication : ${page}`);
  }
  for (const asset of ["styles.css", "app.js", "catalogue-majestios.js", "rubriques-immersives.css", "rubriques-immersives.js", "zone-artisanale.css", "zone-artisanale.js", "category-results.js", "search-results.js"]) {
    if (!build.includes(`"${asset}"`)) errors.push(`build.js: ressource absente de la liste de publication : ${asset}`);
  }
} else {
  errors.push("build.js : fichier absent");
}

// Vérifier les éléments réellement attendus sur l'accueil : navigation, zone 3D et recherche.
const homePath = path.join(root, "index.html");
const appScriptPath = path.join(root, "app.js");
if (fs.existsSync(homePath) && fs.existsSync(appScriptPath)) {
  const home = fs.readFileSync(homePath, "utf8");
  const appScript = fs.readFileSync(appScriptPath, "utf8");
  for (const id of ["scene", "feed-search", "feed-sector", "feed-market-type", "feed-region"]) {
    if (!home.includes(`id="${id}"`)) errors.push(`Accueil : élément attendu absent : #${id}`);
  }
  if (!home.includes('src="zone-artisanale.js"')) errors.push("Accueil : script de la zone 3D absent");
  if (!home.includes("window.majestiosSceneFallback") || !home.includes("loading.dataset.fallbackShown")) {
    errors.push("Accueil : mécanisme de secours de la scène 3D absent ou incomplet");
  }
  const sceneScriptText = fs.existsSync(path.join(root, "zone-artisanale.js")) ? fs.readFileSync(path.join(root, "zone-artisanale.js"), "utf8") : "";
  if (!sceneScriptText.includes("webglcontextlost") || !sceneScriptText.includes('loading.dataset.fallbackShown!=="true"')) {
    errors.push("Zone 3D : gestion de la perte WebGL ou protection contre le masquage du secours absente");
  }
  if (!home.includes('href="nous-rejoindre.html"') || !home.includes('href="espace-membre.html"') || !home.includes('href="faq.html"')) {
    errors.push("Accueil : navigation principale incomplète");
  }
  if (!appScript.includes('if (advancedSearchForm) {\n  advancedSearchForm.addEventListener("submit"')) {
    errors.push("Recherche avancée : écouteur submit non protégé sur les pages sans formulaire");
  }
  if (!appScript.includes("advancedSearchForm.addEventListener(\"submit\"") || !appScript.includes("populateSearchFilters();")) {
    errors.push("Recherche avancée : initialisation ou rendu des résultats absent");
  }
  for (const forbidden of ['id="lead-form"', 'id="personal-space-dialog"', 'class="homepage-ticker"', 'class="site-footer"', 'class="directory"']) {
    if (home.includes(forbidden)) errors.push(`Accueil : bloc hors périmètre encore présent : ${forbidden}`);
  }
} else {
  errors.push("index.html ou app.js absent : contrôle de l'accueil impossible");
}

// Vérifier que chaque rubrique métier conserve sa couche immersive et la navigation commune.
const immersivePages = [
  "marches-publics.html", "marches-prives.html", "developpement-commercial.html",
  "prospection-inversee.html", "intelligence-economique.html", "reseaux-synergies.html",
  "veille-marches.html", "accompagnement-appels-offres.html", "sous-traitance.html",
  "salons-seminaires.html", "bodacc-veille-entreprises.html", "suivi-commercial.html",
];
for (const page of immersivePages) {
  const pagePath = path.join(root, page);
  if (!fs.existsSync(pagePath)) continue;
  const pageHtml = fs.readFileSync(pagePath, "utf8");
  for (const asset of ["rubriques-immersives.css", "rubriques-immersives.js"]) {
    if (!pageHtml.includes(asset)) errors.push(`${page} : couche immersive manquante (${asset})`);
  }
  for (const href of ["index.html", "zone-artisanale.html", "nous-rejoindre.html", "espace-membre.html", "faq.html"]) {
    if (!pageHtml.includes(`href="${href}"`)) errors.push(`${page} : lien de navigation commun manquant (${href})`);
  }
  for (const component of [
    ['<section class="virtual-space"', "espace visuel dédié"],
    ['class="virtual-space-scene"', "scène interactive"],
    ['class="virtual-space-note"', "indication d'interaction"],
    ['class="floating-route-card"', "parcours fonctionnel"],
    ['related-rubrics', "rubriques associées"],
    ['class="interior-links"', "liens de sortie de rubrique"],
  ]) {
    if (!pageHtml.includes(component[0])) errors.push(`${page} : composant manquant (${component[1]})`);
  }
  const relatedStart = pageHtml.indexOf("related-rubrics");
  const relatedEnd = relatedStart >= 0 ? pageHtml.indexOf("</section>", relatedStart) : -1;
  if (relatedStart >= 0 && relatedEnd > relatedStart) {
    const relatedHtml = pageHtml.slice(relatedStart, relatedEnd);
    const relatedLinks = [...relatedHtml.matchAll(/href="([^"]+\.html)(?:#[^"]*)?"/g)];
    if (relatedLinks.length < 3) errors.push(`${page} : moins de trois parcours associés détectés`);
    for (const [, destination] of relatedLinks) {
      if (!fs.existsSync(path.join(root, destination))) errors.push(`${page} : destination associée absente (${destination})`);
    }
  } else {
    errors.push(`${page} : section des rubriques associées mal formée`);
  }
}

// Vérifier que les douze rubriques restent accessibles depuis l'univers virtuel.
const zoneHtmlPath = path.join(root, "zone-artisanale.html");
const zoneJsPath = path.join(root, "zone-artisanale.js");
const zoneJsText = fs.existsSync(zoneJsPath) ? fs.readFileSync(zoneJsPath, "utf8") : "";
const virtualDestinations = [
  "marches-publics.html", "marches-prives.html", "developpement-commercial.html",
  "prospection-inversee.html", "intelligence-economique.html", "reseaux-synergies.html",
  "veille-marches.html", "accompagnement-appels-offres.html", "sous-traitance.html",
  "salons-seminaires.html", "bodacc-veille-entreprises.html", "suivi-commercial.html",
];
if (fs.existsSync(zoneHtmlPath) && fs.existsSync(zoneJsPath)) {
  const zoneHtml = fs.readFileSync(zoneHtmlPath, "utf8");
  const zoneJs = fs.readFileSync(zoneJsPath, "utf8");
  for (const destination of virtualDestinations) {
    if (!zoneHtml.includes(destination) && !zoneJs.includes(destination)) {
      errors.push(`Univers virtuel : rubrique inaccessible depuis la zone artisanale : ${destination}`);
    }
  }

  // Vérifier les routes et positions depuis le catalogue commun utilisé par le panorama et la scène.
  const sharedCatalogPath = path.join(root, "catalogue-majestios.js");
  const sharedCatalogText = fs.existsSync(sharedCatalogPath) ? fs.readFileSync(sharedCatalogPath, "utf8") : "";
  const sharedRubrics = [...sharedCatalogText.matchAll(/\{ id: "(B\d+)", key: "([^"]+)", surface: "([^"]+)", label: "([^"]+)", href: "([^"]+\.html)", group: "(central|peripherique)", x: ([^,]+), z: ([^ }]+) \}/g)]
    .map((match) => ({ id: match[1], key: match[2], surface: match[3], route: match[5], group: match[6], position: `${match[7].trim()},${match[8].trim()}` }));
  const buildingRoutes = sharedRubrics.map((rubric) => rubric.route);
  const uniqueBuildingRoutes = new Set(buildingRoutes);
  if (buildingRoutes.length !== 12) {
    errors.push(`Univers virtuel : ${buildingRoutes.length} routes de bâtiments dans le catalogue, 12 attendues`);
  }
  if (uniqueBuildingRoutes.size !== 12) {
    errors.push(`Univers virtuel : ${uniqueBuildingRoutes.size} destinations distinctes pour les bâtiments, 12 attendues`);
  }
  for (const route of uniqueBuildingRoutes) {
    if (!virtualDestinations.includes(route)) errors.push(`Univers virtuel : route de bâtiment inattendue : ${route}`);
    if (!fs.existsSync(path.join(root, route))) errors.push(`Univers virtuel : page de bâtiment absente : ${route}`);
  }

  const centralCount = sharedRubrics.filter((building) => building.group === "central").length;
  const peripheralCount = sharedRubrics.filter((building) => building.group === "peripherique").length;
  const uniquePositions = new Set(sharedRubrics.map((building) => building.position));
  if (sharedRubrics.length !== 12) errors.push(`Univers virtuel : ${sharedRubrics.length} bâtiments reconnus dans le catalogue, 12 attendus`);
  if (centralCount !== 6 || peripheralCount !== 6) errors.push(`Univers virtuel : répartition détectée ${centralCount} centraux / ${peripheralCount} périphériques, 6 / 6 attendus`);
  if (uniquePositions.size !== 12) errors.push(`Univers virtuel : ${uniquePositions.size} positions distinctes, 12 attendues`);
  if (new Set(sharedRubrics.map((building) => building.id)).size !== 12) errors.push("Univers virtuel : identifiants de bâtiments dupliqués");
  // Garder les accès commerciaux essentiels visibles depuis la zone immersive.
  for (const requiredHref of ["index.html#recherche-avancee", "espace-membre.html"]) {
    if (!zoneHtml.includes(`href="${requiredHref}"`)) {
      errors.push(`Univers virtuel : accès commercial manquant : ${requiredHref}`);
    }
  }
} else {
  errors.push("zone-artisanale.html ou zone-artisanale.js : fichier absent, contrôle de l'univers virtuel impossible");
}

// Vérifier le catalogue partagé, les douze destinations et les filtres de recherche.
const appPath = path.join(root, "app.js");
const zoneScenePath = path.join(root, "zone-artisanale.js");
const cataloguePath = path.join(root, "catalogue-majestios.js");
if (fs.existsSync(appPath) && fs.existsSync(zoneScenePath) && fs.existsSync(cataloguePath)) {
  const app = fs.readFileSync(appPath, "utf8");
  const zoneJs = fs.readFileSync(zoneScenePath, "utf8");
  const catalogue = fs.readFileSync(cataloguePath, "utf8");
  const rubrics = [...catalogue.matchAll(/\{ id: "(B\d+)", key: "([^"]+)", surface: "([^"]+)", label: "([^"]+)", href: "([^"]+\.html)"/g)]
    .map((match) => ({ id: match[1], key: match[2], surface: match[3], href: match[5] }));
  if (rubrics.length !== 12 || new Set(rubrics.map((item) => item.id)).size !== 12) errors.push(`Catalogue : ${rubrics.length} rubriques reconnues, 12 attendues`);
  if (new Set(rubrics.map((item) => item.href)).size !== 12) errors.push("Catalogue : les douze destinations doivent être distinctes");
  for (const rubric of rubrics) {
    if (!fs.existsSync(path.join(root, rubric.href))) errors.push(`Catalogue : page de destination absente : ${rubric.href}`);
    if (!zoneJs.includes(`rubricRoute("${rubric.key}")`)) errors.push(`Zone 3D : destination non reliée au catalogue pour ${rubric.key}`);
  }
  if (!app.includes('document.querySelector("#feed-market-type")')) errors.push("Recherche : filtre par type de marché absent du script");
  if (!app.includes("populateSearchFilters();")) errors.push("Recherche : filtres non initialisés depuis le catalogue");
  const regionBlockMatch = catalogue.match(/const searchRegions = \[([\s\S]*?)\n  \];/);
  if (!regionBlockMatch) {
    errors.push("Recherche : catalogue des zones géographiques absent ou illisible");
  } else {
    const selectableRegions = [...regionBlockMatch[1].matchAll(/\{\s*value:\s*"([^"]+)"[^}]*\}/g)]
      .filter((match) => match[1] !== "all" && !/planned:\s*true/.test(match[0]))
      .map((match) => match[1]);
    if (selectableRegions.length) {
      errors.push(`Recherche : zones géographiques non raccordées encore sélectionnables : ${selectableRegions.join(", ")}`);
    }
  }

} else {
  errors.push("app.js, zone-artisanale.js ou catalogue-majestios.js absent : contrôle des destinations impossible");
}

// Contrôle explicite de cohérence entre l'arborescence, l'accueil et la navigation.
const homeHtmlPath = path.join(root, "index.html");
if (fs.existsSync(homeHtmlPath)) {
  const homeHtml = fs.readFileSync(homeHtmlPath, "utf8");
  const homeMapStart = homeHtml.indexOf('<section class="industrial-zone-home" id="accueil"');
  const homeMapEnd = homeMapStart >= 0 ? homeHtml.indexOf("</section>", homeMapStart) : -1;
  const homeMapSection = homeMapStart >= 0 && homeMapEnd > homeMapStart ? homeHtml.slice(homeMapStart, homeMapEnd) : "";
  if (!homeMapSection) {
    errors.push("Accueil : section d'accueil avec panorama (#accueil) absente");
  } else {
    if (!homeMapSection.includes('id="scene"') || !homeHtml.includes('src="zone-artisanale.js"')) {
      errors.push("Accueil : la scène 3D interactive n'est pas intégrée ou son script est absent");
    }
    if (!homeMapSection.includes('id="industrial-zone-title"')) {
      errors.push("Accueil : titre accessible de la zone industrielle absent");
    }
  }
  const navMatch = homeHtml.match(/<nav class="site-nav"[^>]*>([\s\S]*?)<\/nav>/i);
  const navHrefs = navMatch ? [...navMatch[1].matchAll(/href="([^"]+)"/g)].map((match) => match[1]) : [];
  const expectedNavHrefs = ["index.html", "developpement-commercial.html", "salons-seminaires.html", "nous-rejoindre.html", "espace-membre.html", "faq.html"];
  if (navHrefs.length !== expectedNavHrefs.length || navHrefs.some((href, index) => href !== expectedNavHrefs[index])) {
    errors.push("Accueil : la navigation principale doit contenir exactement les six liens attendus, dans l’ordre défini");
  }
  if (!homeHtml.includes("majestiosSceneFallback") || !homeHtml.includes('onerror="window.majestiosSceneFallback()"')) {
    errors.push("Accueil : mécanisme de secours de la scène 3D absent");
  }
  for (const controlId of ["feed-search", "feed-sector", "feed-market-type", "feed-region"]) {
    if (!homeHtml.includes(`id="${controlId}"`)) {
      errors.push(`Accueil : contrôle de recherche avancée absent : ${controlId}`);
    }
  }
  for (const forbidden of ['id="lead-form"', 'id="personal-space-dialog"', 'class="homepage-ticker"', 'class="site-footer"']) {
    if (homeHtml.includes(forbidden)) {
      errors.push(`Accueil : bloc hors périmètre encore présent : ${forbidden}`);
    }
  }
}

// Les douze rubriques sont la source de vérité commune du panorama et de l'univers 3D.
const expectedCategoryWorlds = {
  "categorie-services-numeriques.html": "services",
  "categorie-travaux-amenagement.html": "travaux",
  "categorie-conseil-etudes.html": "conseil",
  "categorie-batiment.html": "batiment",
  "categorie-renovation.html": "renovation",
  "categorie-electricite.html": "electricite",
  "categorie-plomberie-chauffage.html": "plomberie",
  "categorie-maintenance.html": "maintenance",
};
for (const [page, expectedWorld] of Object.entries(expectedCategoryWorlds)) {
  if (!fs.existsSync(path.join(root, page))) {
    errors.push(`Catégories d’opportunités : page référencée mais absente : ${page}`);
    continue;
  }
  const html = fs.readFileSync(path.join(root, page), "utf8");
  if (!html.includes('src="category-results.js"')) errors.push(`${page} : script des résultats par catégorie absent`);
  if (!html.includes("category-page") || !html.includes('<section class="virtual-space"')) errors.push(`${page} : structure de page de catégorie absente`);
  const worldMatch = html.match(/<section class="virtual-space"[^>]*data-world="([^"]+)"/);
  if (!worldMatch || worldMatch[1] !== expectedWorld) {
    errors.push(`${page} : catégorie déclarée incorrecte (attendu : ${expectedWorld})`);
  }
}
if (!fs.existsSync(path.join(root, "category-results.js"))) errors.push("Catégories d’opportunités : category-results.js absent");
if (fs.existsSync(path.join(root, "category-results.js"))) {
  const resultsScript = fs.readFileSync(path.join(root, "category-results.js"), "utf8");
  for (const world of Object.values(expectedCategoryWorlds)) {
    if (!resultsScript.includes(`${world}: { value: "${world}"`)) errors.push(`Résultats de catégorie : correspondance manquante ou incohérente pour ${world}`);
  }
}

// Vérifier que le code et la documentation expriment la même priorité de routage.
if (fs.existsSync(appPath)) {
  const app = fs.readFileSync(appPath, "utf8");
  const categoryRouteIndex = app.indexOf("const destination = selectedCategory");
  const privateRouteIndex = app.indexOf('marketType === "private"', categoryRouteIndex);
  if (categoryRouteIndex < 0 || privateRouteIndex < 0 || privateRouteIndex < categoryRouteIndex) {
    errors.push("Recherche : priorité de destination incohérente ; une catégorie active doit primer sur le type de marché");
  }
  if (!app.includes('params.set("q", query)') || !app.includes('params.set("categorie", category)') || !app.includes('params.set("marche", marketType)') || !app.includes('params.set("zone", region)')) {
    errors.push("Recherche : un ou plusieurs critères ne sont plus transmis dans l’URL");
  }
}

// Le schéma normalisé doit rester un JSON lisible et couvrir les huit catégories actives.
const opportunitySchemaPath = path.join(root, "schemas", "opportunite.schema.json");
if (!fs.existsSync(opportunitySchemaPath)) {
  errors.push("Modèle de données : schemas/opportunite.schema.json absent");
} else {
  try {
    const opportunitySchema = JSON.parse(fs.readFileSync(opportunitySchemaPath, "utf8"));
    const categoryProperty = opportunitySchema.properties?.category;
    const expectedCategories = ["services", "travaux", "conseil", "batiment", "renovation", "electricite", "plomberie", "maintenance"];
    if (!categoryProperty || expectedCategories.some((category) => !categoryProperty.enum?.includes(category))) {
      errors.push("Modèle de données : le schéma ne couvre pas les huit catégories actives");
    }
    for (const requiredField of ["id", "title", "category", "marketType", "source", "sourceUrl", "publishedAt", "status"]) {
      if (!opportunitySchema.required?.includes(requiredField)) {
        errors.push(`Modèle de données : champ obligatoire absent du schéma : ${requiredField}`);
      }
    }
  } catch {
    errors.push("Modèle de données : schemas/opportunite.schema.json n’est pas un JSON valide");
  }
}


// La recherche sans catégorie doit aboutir à une page générale dédiée.
const generalResultsPath = path.join(root, "resultats-recherche.html");
const generalResultsScriptPath = path.join(root, "search-results.js");
if (!fs.existsSync(generalResultsPath)) errors.push("Recherche : page générale de résultats absente");
if (!fs.existsSync(generalResultsScriptPath)) errors.push("Recherche : script des critères de résultats absent");
if (fs.existsSync(generalResultsPath)) {
  const generalResultsHtml = fs.readFileSync(generalResultsPath, "utf8");
  if (!generalResultsHtml.includes('id="search-active-filters"') || !generalResultsHtml.includes('src="search-results.js"')) {
    errors.push("Recherche : page générale sans récapitulatif des critères ou sans script associé");
  }
}

const expectedRubricPages = [
  "marches-publics.html", "veille-marches.html", "marches-prives.html",
  "prospection-inversee.html", "developpement-commercial.html", "intelligence-economique.html",
  "reseaux-synergies.html", "sous-traitance.html", "accompagnement-appels-offres.html",
  "bodacc-veille-entreprises.html", "salons-seminaires.html", "suivi-commercial.html"
];
const rubricSet = new Set(expectedRubricPages);
if (rubricSet.size !== 12) errors.push("Arborescence : la liste de référence ne contient pas douze destinations uniques");
for (const page of expectedRubricPages) {
  if (!fs.existsSync(path.join(root, page))) errors.push(`Arborescence : page métier référencée mais absente : ${page}`);
}

// Vérifier le contenu réellement préparé dans dist/, pas seulement la liste de build.
const distPath = path.join(root, "dist");
if (fs.existsSync(distPath)) {
  for (const page of ["index.html", "zone-artisanale.html", "resultats-recherche.html", ...expectedRubricPages, ...Object.keys(expectedCategoryWorlds)]) {
    if (!fs.existsSync(path.join(distPath, page))) errors.push(`Build : page attendue absente de dist/ : ${page}`);
  }
  for (const asset of ["styles.css", "app.js", "catalogue-majestios.js", "rubriques-immersives.css", "rubriques-immersives.js", "zone-artisanale.css", "zone-artisanale.js", "category-results.js"]) {
    if (!fs.existsSync(path.join(distPath, asset))) errors.push(`Build : ressource attendue absente de dist/ : ${asset}`);
  }
  const builtHome = path.join(distPath, "index.html");
  if (fs.existsSync(builtHome)) {
    const builtHtml = fs.readFileSync(builtHome, "utf8");
    if (!builtHtml.includes('id="scene"') || !builtHtml.includes('src="zone-artisanale.js"')) {
      errors.push("Build : la scène 3D interactive n'est pas présente dans l'accueil compilé");
    }
  }
}

if (errors.length) {
  console.error(`Vérification échouée : ${errors.length} problème(s) sur ${pages.length} pages.\n- ${errors.join("\n- ")}`);
  process.exitCode = 1;
} else {
  console.log(`Vérification structurelle réussie : ${pages.length} pages HTML, ${references} références locales contrôlées, aucune ancre locale manquante détectée.`);
}
