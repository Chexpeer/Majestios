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
  for (const asset of ["styles.css", "app.js", "schema-majestios.svg", "catalogue-majestios.js", "rubriques-immersives.css", "rubriques-immersives.js", "zone-artisanale.css", "zone-artisanale.js"]) {
    if (!build.includes(`"${asset}"`)) errors.push(`build.js: ressource absente de la liste de publication : ${asset}`);
  }
} else {
  errors.push("build.js : fichier absent");
}

// Protéger les fonctions métier essentielles de la page d'accueil contre les régressions.
const homePath = path.join(root, "index.html");
const appScriptPath = path.join(root, "app.js");
if (fs.existsSync(homePath) && fs.existsSync(appScriptPath)) {
  const home = fs.readFileSync(homePath, "utf8");
  const appScript = fs.readFileSync(appScriptPath, "utf8");
  for (const id of ["flux-ao", "feed-search", "feed-sector", "feed-region", "feed-result-count", "feed-stream", "lead-form", "form-feedback", "preview-request", "contact"]) {
    if (!home.includes(`id="${id}"`)) {
      errors.push(`Accueil : fonction commerciale essentielle absente ou identifiant modifié : #${id}`);
    }
  }
  if (!appScript.includes("demoTenders") || !appScript.includes("function renderTenderFeed")) {
    errors.push("Accueil : moteur de recherche des opportunités de démonstration introuvable ou incomplet dans app.js");
  }
  if (!appScript.includes("Cette demande de démonstration n’a pas été transmise.")) {
    errors.push("Accueil : le formulaire doit indiquer clairement qu'une demande de démonstration n'est pas transmise");
  }
  if (!appScript.includes('document.querySelector("#preview-request").addEventListener("click"')) {
    errors.push("Accueil : bouton de prévisualisation du formulaire non relié dans app.js");
  }

  // Vérifier que les raccourcis de formulaire pointent vers une intention réellement disponible.
  const intentValues = new Set([...home.matchAll(/name="intent"[^>]*value="([^"]+)"/g)].map((match) => match[1]));
  const intentLinks = [...home.matchAll(/data-intent-link="([^"]+)"/g)].map((match) => match[1]);
  for (const intent of intentLinks) {
    if (!intentValues.has(intent)) errors.push(`Accueil : raccourci de formulaire sans intention correspondante : ${intent}`);
  }
  if (!appScript.includes('event.key === "Enter" || event.key === " "')) {
    errors.push("Schéma interactif : activation clavier par Entrée et Espace non détectée dans app.js");
  }
} else {
  errors.push("index.html ou app.js absent : contrôle des fonctions commerciales essentielles impossible");
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
  for (const requiredHref of ["index.html#flux-ao", "index.html#contact", "espace-membre.html"]) {
    if (!zoneHtml.includes(`href="${requiredHref}"`)) {
      errors.push(`Univers virtuel : accès commercial manquant : ${requiredHref}`);
    }
  }
} else {
  errors.push("zone-artisanale.html ou zone-artisanale.js : fichier absent, contrôle de l'univers virtuel impossible");
}

// Vérifier que le panorama et la zone 3D consomment le même catalogue de routes.
const svgPath = path.join(root, "schema-majestios.svg");
const appPath = path.join(root, "app.js");
const zoneScenePath = path.join(root, "zone-artisanale.js");
const cataloguePath = path.join(root, "catalogue-majestios.js");
if (fs.existsSync(svgPath) && fs.existsSync(appPath) && fs.existsSync(zoneScenePath) && fs.existsSync(cataloguePath)) {
  const svg = fs.readFileSync(svgPath, "utf8");
  const app = fs.readFileSync(appPath, "utf8");
  const zoneJs = fs.readFileSync(zoneScenePath, "utf8");
  const catalogue = fs.readFileSync(cataloguePath, "utf8");
  const surfaces = [...svg.matchAll(/data-surface=["']([^"']+)["']/g)].map((match) => match[1]);
  const rubrics = [...catalogue.matchAll(/\{ id: "(B\d+)", key: "([^"]+)", surface: "([^"]+)", label: "([^"]+)", href: "([^"]+\.html)"/g)]
    .map((match) => ({ id: match[1], key: match[2], surface: match[3], href: match[5] }));
  const surfaceSet = new Set(surfaces);
  const catalogSurfaceSet = new Set(rubrics.map((item) => item.surface));
  const destinationPages = new Set(rubrics.map((item) => item.href));
  if (surfaces.length !== 12 || surfaceSet.size !== 12) errors.push(`schema-majestios.svg : ${surfaces.length} surfaces détectées, 12 uniques attendues`);
  if (rubrics.length !== 12 || new Set(rubrics.map((item) => item.id)).size !== 12) errors.push(`catalogue-majestios.js : ${rubrics.length} rubriques uniques détectées, 12 attendues`);
  for (const surface of surfaceSet) if (!catalogSurfaceSet.has(surface)) errors.push(`Catalogue : surface du schéma non référencée : ${surface}`);
  for (const surface of catalogSurfaceSet) if (!surfaceSet.has(surface)) errors.push(`Catalogue : surface sans losange SVG : ${surface}`);
  if (destinationPages.size !== 12) errors.push(`Catalogue : ${destinationPages.size} destinations distinctes détectées, 12 attendues`);
  for (const rubric of rubrics) {
    if (!fs.existsSync(path.join(root, rubric.href))) errors.push(`Catalogue : page de destination absente : ${rubric.href}`);
    if (!app.includes('Object.fromEntries(majCatalog.rubrics.map')) errors.push("app.js : les destinations du panorama ne sont pas générées depuis le catalogue partagé");
    if (!zoneJs.includes(`rubricRoute("${rubric.key}")`)) errors.push(`Zone 3D : destination non reliée au catalogue pour ${rubric.key}`);
  }
  if (!app.includes('document.querySelector("#feed-market-type")')) errors.push("Moteur de recherche : filtre par type de marché absent du script");
  if (!app.includes("populateSearchFilters();")) errors.push("Moteur de recherche : menus déroulants non initialisés depuis le catalogue");
  const home = fs.readFileSync(homePath, "utf8");
  if (!home.includes('id="feed-market-type"')) errors.push("Accueil : filtre de type de marché absent");
  if (!home.includes('catalogue-majestios.js')) errors.push("Accueil : catalogue partagé non chargé avant app.js");
  const zoneHtmlPath = path.join(root, "zone-artisanale.html");
  const zoneHtml = fs.existsSync(zoneHtmlPath) ? fs.readFileSync(zoneHtmlPath, "utf8") : "";
  if (!zoneHtml.includes('catalogue-majestios.js')) errors.push("Zone 3D : catalogue partagé non chargé avant le module de scène");
  const categoryValues = new Set([...catalogue.matchAll(/\{ value: "([^"]+)", label: "[^"]+", active: true(?:, href: "[^"]+")? \}/g)].map((match) => match[1]));
  const activeTenderCategories = new Set([...app.matchAll(/sector: "([^"]+)"/g)].map((match) => match[1]));
  for (const category of activeTenderCategories) if (!categoryValues.has(category)) errors.push(`Moteur de recherche : catégorie des exemples absente du catalogue : ${category}`);

  const categoryRouteMatches = [...catalogue.matchAll(/\{ value: "([^"]+)", label: "[^"]+", active: true, href: "([^"]+\\.html)" \}/g)];
  for (const [, category, route] of categoryRouteMatches) {
    if (!fs.existsSync(path.join(root, route))) errors.push(`Arborescence : page de catégorie absente pour ${category} : ${route}`);
  }
  const requiredSearchHooks = [
    ['id="feed-sector"', "filtre catégorie"],
    ['id="feed-market-type"', "filtre public/privé"],
    ['id="feed-region"', "filtre géographique"],
    ['id="feed-search"', "recherche par mot-clé"],
    ['id="feed-stream"', "zone de résultats"],
  ];
  for (const [hook, label] of requiredSearchHooks) {
    if (!home.includes(hook)) errors.push(`Recherche : ${label} absent de la page d’accueil`);
  }
  for (const handler of [
    'addEventListener("input", renderTenderFeed)',
    'addEventListener("change", renderTenderFeed)',
    'categoryLink.href = category.href',
    'initialSearchParams.get("categorie")',
  ]) {
    if (!app.includes(handler)) errors.push(`Recherche et orientation : interaction manquante (${handler})`);
  }
} else {
  errors.push("schema-majestios.svg, app.js, zone-artisanale.js ou catalogue-majestios.js absent : contrôle des destinations impossible");
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
  if (!homeHtml.includes('href="index.html#accueil"') && !homeHtml.includes('href="zone-artisanale.html"')) {
    errors.push("Accueil : accès à la zone industrielle absent de la navigation");
  }
  for (const controlId of ["feed-search", "feed-sector", "feed-market-type", "feed-region", "feed-stream"]) {
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
const expectedCategoryPages = ["categorie-services-numeriques.html", "categorie-travaux-amenagement.html", "categorie-conseil-etudes.html", "categorie-batiment.html", "categorie-renovation.html", "categorie-electricite.html", "categorie-plomberie-chauffage.html", "categorie-maintenance.html"];
for (const page of expectedCategoryPages) {
  if (!fs.existsSync(path.join(root, page))) errors.push(`Catégories d’opportunités : page référencée mais absente : ${page}`);
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
  for (const page of ["index.html", "zone-artisanale.html", ...expectedRubricPages, ...expectedCategoryPages]) {
    if (!fs.existsSync(path.join(distPath, page))) errors.push(`Build : page attendue absente de dist/ : ${page}`);
  }
  for (const asset of ["styles.css", "app.js", "schema-majestios.svg", "catalogue-majestios.js", "rubriques-immersives.css", "rubriques-immersives.js", "zone-artisanale.css", "zone-artisanale.js"]) {
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
