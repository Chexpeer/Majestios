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
  if (!home.includes("<title>MajestiOS — Développement commercial et prospection inversée</title>") || home.includes("<title>MajestiOS — Prospection inversée et intelligence commerciale</title>")) {
    errors.push("Accueil : titre SEO non aligné sur le positionnement développement commercial");
  }
  for (const id of ["scene", "feed-search", "feed-sector", "feed-market-type", "feed-region"]) {
    if (!home.includes(`id="${id}"`)) errors.push(`Accueil : élément attendu absent : #${id}`);
  }
  if (!home.includes('aria-label="Rechercher une opportunité commerciale"')) {
    errors.push("Accueil : libellé accessible de recherche trop restrictif ou absent");
  }
  if (!home.includes('placeholder="Mot-clé, entreprise, secteur..."')) {
    errors.push("Accueil : exemple de recherche ne couvre pas les opportunités privées");
  }
  if (!home.includes("Aucune annonce réelle n’est diffusée pour le moment.")) {
    errors.push("Accueil : avertissement sur l’absence de flux réel absent");
  }
  if (!home.includes('src="zone-artisanale.js"')) errors.push("Accueil : script de la zone 3D absent");
  if (!home.includes('name="viewport" content="width=device-width, initial-scale=1"')) errors.push("Accueil : méta viewport mobile absente");
  const sceneCssText = fs.existsSync(path.join(root, "zone-artisanale.css")) ? fs.readFileSync(path.join(root, "zone-artisanale.css"), "utf8") : "";
  if (!sceneCssText.includes("@media(max-width:650px)") || !sceneCssText.includes("touch-action:none")) errors.push("Zone 3D : règles responsive mobile ou tactile absentes");
  if (!home.includes("window.majestiosSceneFallback") || !home.includes("loading.dataset.fallbackShown")) {
    errors.push("Accueil : mécanisme de secours de la scène 3D absent ou incomplet");
  }
  const sceneScriptText = fs.existsSync(path.join(root, "zone-artisanale.js")) ? fs.readFileSync(path.join(root, "zone-artisanale.js"), "utf8") : "";
  if (!sceneScriptText.includes("webglcontextlost") || !sceneScriptText.includes('loading.dataset.fallbackShown!=="true"')) {
    errors.push("Zone 3D : gestion de la perte WebGL ou protection contre le masquage du secours absente");
  }
  if (!sceneScriptText.includes('addEventListener("touchstart"') || !sceneScriptText.includes('addEventListener("touchend"') || !sceneScriptText.includes("ResizeObserver")) {
    errors.push("Zone 3D : sélection tactile ou adaptation de taille non vérifiable dans le script");
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
  for (const restorationCheck of [
    "new URLSearchParams(window.location.search)",
    "initialSearchParams.get(\"q\")",
    "initialSearchParams.get(\"categorie\")",
    "initialSearchParams.get(\"marche\")",
    "initialSearchParams.get(\"zone\")"
  ]) {
    if (!appScript.includes(restorationCheck)) errors.push(`Recherche avancée : restauration d’un critère manquante : ${restorationCheck}`);
  }
  for (const forbidden of ['id="lead-form"', 'id="personal-space-dialog"', 'class="site-footer"', 'class="directory"']) {
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
  // Cibler la section elle-même, pas une occurrence de "related-rubrics" dans
  // une classe de titre située plus haut dans la page (ex. showroom-grid).
  const relatedSection = pageHtml.match(/<section\b(?=[^>]*\bclass=["'][^"']*\brelated-rubrics\b[^"']*["'])[^>]*>[\s\S]*?<\/section>/i);
  if (relatedSection) {
    const relatedHtml = relatedSection[0];
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

  // Les trois niveaux de navigation de chaque bâtiment doivent pointer vers des pages réelles.
  const levelRoutes = [...zoneJs.matchAll(/\{id:"(B\d+)"[^\n]*?firstRoute:"([^"]+\.html)",secondRoute:"([^"]+\.html)"/g)]
    .map((match) => ({ id: match[1], first: match[2], second: match[3] }));
  if (levelRoutes.length !== 12) errors.push(`Zone 3D : ${levelRoutes.length} bâtiments disposent de deux routes de niveaux, 12 attendus`);
  for (const building of levelRoutes) {
    for (const destination of [building.first, building.second]) {
      if (!fs.existsSync(path.join(root, destination))) {
        errors.push(`Zone 3D : destination de niveau absente pour ${building.id} : ${destination}`);
      }
    }
  }
  if (!zoneJs.includes('floorList.hidden=false') || !zoneJs.includes('className="floor-link"')) {
    errors.push("Zone 3D : les niveaux complémentaires ne sont pas rendus comme des liens accessibles");
  }
  const zoneCssPath = path.join(root, "zone-artisanale.css");
  const zoneCss = fs.existsSync(zoneCssPath) ? fs.readFileSync(zoneCssPath, "utf8") : "";
  if (zoneCss.includes('#floor-list { display: none !important; }')) {
    errors.push("Zone 3D : la navigation par niveaux est masquée de force sur l’accueil");
  }
  if (!zoneCss.includes(".floor-list .floor-link:focus-visible")) {
    errors.push("Zone 3D : état de focus clavier absent sur les liens de niveaux");
  }
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
  // Vérifier que chaque catégorie active du catalogue pointe vers une page existante.
  for (const match of catalogue.matchAll(/\{\s*value:\s*"([^"]+)",\s*label:\s*"[^"]+",\s*active:\s*true,\s*href:\s*"([^"]+)"/g)) {
    if (!fs.existsSync(path.join(root, match[2]))) errors.push(`Catalogue : destination de catégorie active absente (${match[1]}) : ${match[2]}`);
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
  for (const forbidden of ['id="lead-form"', 'id="personal-space-dialog"', 'class="site-footer"']) {
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

// Vérifier que le routage donne la priorité à une catégorie active et conserve tous les critères.
if (fs.existsSync(appPath)) {
  const app = fs.readFileSync(appPath, "utf8");
  const categoryRouteIndex = app.indexOf("const destination = selectedCategory");
  const generalResultsRouteIndex = app.indexOf('"resultats-recherche.html"', categoryRouteIndex);
  if (categoryRouteIndex < 0 || generalResultsRouteIndex < categoryRouteIndex) {
    errors.push("Recherche : une catégorie active doit primer ; sans catégorie, les critères doivent aller aux résultats généraux");
  }
  if (!app.includes('params.set("q", query)') || !app.includes('params.set("categorie", category)') || !app.includes('params.set("marche", marketType)') || !app.includes('params.set("zone", region)')) {
    errors.push("Recherche : un ou plusieurs critères ne sont plus transmis dans l’URL");
  }
}

// Vérifier que le retour depuis les résultats généraux réinjecte les critères dans l'URL d'accueil.
const searchResultsScriptPath = path.join(root, "search-results.js");
if (fs.existsSync(searchResultsScriptPath)) {
  const searchResultsScript = fs.readFileSync(searchResultsScriptPath, "utf8");
  if (!searchResultsScript.includes('new URLSearchParams(params)') ||
      !searchResultsScript.includes('returnLink.href = `index.html${returnParams.size ? `?${returnParams.toString()}` : ""}#recherche-avancee`')) {
    errors.push("Résultats de recherche : les critères ne sont pas préservés dans le lien de retour");
  }
} else {
  errors.push("Résultats de recherche : search-results.js absent");
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



// Vérifier la cohérence de la navigation principale sur les pages qui l'affichent.
const expectedMainNavigation = [
  "index.html",
  "developpement-commercial.html",
  "salons-seminaires.html",
  "nous-rejoindre.html",
  "espace-membre.html",
  "faq.html",
];
const expectedMainNavigationLabels = [
  "Accueil",
  "Développement commercial",
  "Salon virtuel",
  "Nous rejoindre",
  "Espace membre",
  "FAQ",
];
for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), "utf8");
  const navMatch = html.match(/<nav\b[^>]*class=["'][^"']*site-nav[^"']*["'][^>]*>([\s\S]*?)<\/nav>/i);
  if (!navMatch) continue;
  const navHtml = navMatch[1];
  const links = [...navHtml.matchAll(/<a\b([^>]*)href=["']([^"']+)["']([^>]*)>/gi)];
  const destinations = links.map((match) => match[2]);
  const labels = links.map((match) => match[0].replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim());
  if (labels.length !== expectedMainNavigationLabels.length ||
      labels.some((label, index) => label !== expectedMainNavigationLabels[index])) {
    errors.push(`${page} : libellés ou ordre de navigation principale incohérents`);
  }
  for (const destination of expectedMainNavigation) {
    if (!destinations.includes(destination)) {
      errors.push(`${page} : navigation principale incomplète (${destination})`);
    }
  }
  if (new Set(destinations).size !== destinations.length) {
    errors.push(`${page} : destination répétée dans la navigation principale`);
  }
  const currentLinks = links.filter((match) => /aria-current=["']page["']/i.test(match[1] + match[3]));
  if (currentLinks.length > 1) {
    errors.push(`${page} : plusieurs entrées déclarées comme page courante dans la navigation principale`);
  }
  if (links.some((match) => match[2].trim() === "#")) {
    errors.push(`${page} : lien vide href="#" dans la navigation principale`);
  }
}

// Vérifier que les parcours encore en démonstration restent explicitement non transactionnels.
const memberPagePath = path.join(root, "espace-membre.html");
if (fs.existsSync(memberPagePath)) {
  const memberHtml = fs.readFileSync(memberPagePath, "utf8");
  if (!memberHtml.includes('id="personal-space-form"') || !memberHtml.includes('id="personal-space-feedback"')) {
    errors.push("Espace membre : formulaire ou zone de retour utilisateur absents");
  }
  if (!/aucune donnée n’est envoyée ni enregistrée/i.test(memberHtml)) {
    errors.push("Espace membre : avertissement explicite sur l’absence d’envoi et d’enregistrement absent");
  }
  if (!/addEventListener\(['"]submit['"],\s*e\s*=>\s*\{\s*e\.preventDefault\(\)/s.test(memberHtml)) {
    errors.push("Espace membre : le formulaire doit intercepter sa soumission sans transmettre les données");
  }
  for (const field of ['name="firstName"', 'name="lastName"', 'name="email"', 'name="phone"']) {
    if (!memberHtml.includes(field)) errors.push(`Espace membre : champ de préparation manquant (${field})`);
  }
}

// La page de résultats généraux doit charger le catalogue avant le script qui affiche les libellés.
if (fs.existsSync(generalResultsPath)) {
  const resultsHtml = fs.readFileSync(generalResultsPath, "utf8");
  const catalogIndex = resultsHtml.indexOf('src="catalogue-majestios.js"');
  const scriptIndex = resultsHtml.indexOf('src="search-results.js"');
  if (catalogIndex < 0 || scriptIndex < 0 || catalogIndex > scriptIndex) {
    errors.push("Recherche : catalogue absent ou chargé après le script de récapitulatif des filtres");
  }
}

// Le point d’aide doit être accessible et ne pas se présenter comme un chatbot déjà connecté.
if (fs.existsSync(homeHtmlPath)) {
  const homeHtml = fs.readFileSync(homeHtmlPath, "utf8");
  if (!homeHtml.includes('id="home-help-toggle"') || !homeHtml.includes('aria-controls="home-help-panel"') || !homeHtml.includes('id="home-help-panel"')) {
    errors.push("Accueil : point d’aide guidée absent ou contrôle accessible incomplet");
  }
  if (!homeHtml.includes("L’assistant conversationnel sera connecté dans une prochaine étape")) {
    errors.push("Accueil : le guide doit préciser que l’assistant conversationnel n’est pas encore connecté");
  }
}


// La page Salon virtuel présente le showroom comme un concept, sans fausse promesse de disponibilité.
const showroomPath = path.join(root, "salons-seminaires.html");
if (fs.existsSync(showroomPath)) {
  const showroomHtml = fs.readFileSync(showroomPath, "utf8");
  for (const phrase of ["Ne présentez plus votre entreprise. Faites-la visiter.", "Showroom Essentiel", "Showroom Immersif", "Majest COYOT", "la décision appartient toujours aux personnes"]) {
    if (!showroomHtml.toLowerCase().includes(phrase.toLowerCase())) errors.push(`Showroom virtuel : contenu stratégique manquant : ${phrase}`);
  }
  if (!/ne signifie pas que ces services sont déjà disponibles/i.test(showroomHtml)) {
    errors.push("Showroom virtuel : avertissement sur les fonctionnalités en préparation absent");
  }
}

// Le bandeau supérieur doit être discret, lent et explicitement présenté comme une démonstration.
if (fs.existsSync(homeHtmlPath)) {
  const homeHtml = fs.readFileSync(homeHtmlPath, "utf8");
  if (!homeHtml.includes('class="homepage-ticker"') || !homeHtml.includes('aria-label="Flux de démonstration MajestiOS"')) {
    errors.push("Accueil : bandeau supérieur de démonstration absent ou non identifié");
  }
  if (!/Aucune annonce réelle n’est diffusée pour le moment/.test(homeHtml)) {
    errors.push("Accueil : le bandeau ne précise pas clairement l’absence d’annonces réelles");
  }
  if (homeHtml.indexOf('class="homepage-ticker"') > homeHtml.indexOf('<header class="site-header"')) {
    errors.push("Accueil : le bandeau d’annonces doit rester au-dessus de la navigation");
  }
}
if (fs.existsSync(path.join(root, "styles.css"))) {
  const homeStyles = fs.readFileSync(path.join(root, "styles.css"), "utf8");
  if (!/homepage-ticker-track[^}]*animation:[^;]*75s/.test(homeStyles) || !homeStyles.includes("@media(prefers-reduced-motion:reduce) { body.homepage .homepage-ticker-track")) {
    errors.push("Accueil : vitesse lente ou préférence de réduction des animations non prise en compte pour le bandeau");
  }
}

if (errors.length) {
  console.error(`Vérification échouée : ${errors.length} problème(s) sur ${pages.length} pages.\\n- ${errors.join("\\n- ")}`);
  process.exitCode = 1;
} else {
  console.log(`Vérification structurelle réussie : ${pages.length} pages HTML, ${references} références locales contrôlées, aucune ancre locale manquante détectée.`);
}
