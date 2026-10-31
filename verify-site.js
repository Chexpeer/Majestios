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
  for (const asset of ["styles.css", "app.js", "schema-majestios.svg", "rubriques-immersives.css", "rubriques-immersives.js", "zone-artisanale.css", "zone-artisanale.js"]) {
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

  // Vérifier les routes réellement déclarées par les douze bâtiments 3D.
  const buildingRoutes = [...zoneJs.matchAll(/route\s*:\s*["']([^"']+\.html)["']/g)]
    .map((match) => match[1]);
  const uniqueBuildingRoutes = new Set(buildingRoutes);
  if (buildingRoutes.length !== 12) {
    errors.push(`Univers virtuel : ${buildingRoutes.length} routes de bâtiments détectées, 12 attendues`);
  }
  if (uniqueBuildingRoutes.size !== 12) {
    errors.push(`Univers virtuel : ${uniqueBuildingRoutes.size} destinations distinctes pour les bâtiments, 12 attendues`);
  }
  for (const route of uniqueBuildingRoutes) {
    if (!virtualDestinations.includes(route)) {
      errors.push(`Univers virtuel : route de bâtiment inattendue : ${route}`);
    }
    if (!fs.existsSync(path.join(root, route))) {
      errors.push(`Univers virtuel : page de bâtiment absente : ${route}`);
    }
  }

  // Protéger la composition de la zone : 12 bâtiments, six centraux et six périphériques.
  const buildings = [...zoneJs.matchAll(/\\{id:"(B\\d+)",group:"(central|peripherique)"[\\s\\S]*?route:"([^"]+\\.html)",x:([^,}]+),z:([^}]+)\\}/g)]
    .map((match) => ({ id: match[1], group: match[2], route: match[3], position: `${match[4].trim()},${match[5].trim()}` }));
  const centralCount = buildings.filter((building) => building.group === "central").length;
  const peripheralCount = buildings.filter((building) => building.group === "peripherique").length;
  const uniquePositions = new Set(buildings.map((building) => building.position));
  if (buildings.length !== 12) errors.push(`Univers virtuel : ${buildings.length} bâtiments reconnus, 12 attendus`);
  if (centralCount !== 6 || peripheralCount !== 6) errors.push(`Univers virtuel : répartition détectée ${centralCount} centraux / ${peripheralCount} périphériques, 6 / 6 attendus`);
  if (uniquePositions.size !== 12) errors.push(`Univers virtuel : ${uniquePositions.size} positions distinctes, 12 attendues`);
  if (new Set(buildings.map((building) => building.id)).size !== 12) errors.push("Univers virtuel : identifiants de bâtiments dupliqués");

  // Garder les accès commerciaux essentiels visibles depuis la zone immersive.
  for (const requiredHref of ["index.html#flux-ao", "index.html#contact", "espace-membre.html"]) {
    if (!zoneHtml.includes(`href="${requiredHref}"`)) {
      errors.push(`Univers virtuel : accès commercial manquant : ${requiredHref}`);
    }
  }
} else {
  errors.push("zone-artisanale.html ou zone-artisanale.js : fichier absent, contrôle de l'univers virtuel impossible");
}

// Vérifier la correspondance structurelle des douze losanges et destinations.
const svgPath = path.join(root, "schema-majestios.svg");
const appPath = path.join(root, "app.js");
if (fs.existsSync(svgPath) && fs.existsSync(appPath)) {
  const svg = fs.readFileSync(svgPath, "utf8");
  const app = fs.readFileSync(appPath, "utf8");
  const surfaces = [...svg.matchAll(/data-surface=["']([^"']+)["']/g)].map((match) => match[1]);
  const destinationsBlock = app.match(/const surfaceDestinations\s*=\s*\{([\s\S]*?)\n\s*\};/);
  const destinations = destinationsBlock
    ? [...destinationsBlock[1].matchAll(/["']([^"']+)["']\s*:\s*["']([^"']+\.html)["']/g)]
    : [];
  const surfaceSet = new Set(surfaces);
  const destinationKeys = new Set(destinations.map((match) => match[1]));
  const destinationPages = new Set(destinations.map((match) => match[2]));
  if (surfaces.length !== 12 || surfaceSet.size !== 12) errors.push(`schema-majestios.svg : ${surfaces.length} losanges détectés, 12 uniques attendus`);
  if (destinations.length !== 12 || destinationKeys.size !== 12) errors.push(`app.js : ${destinations.length} destinations du schéma détectées, 12 clés uniques attendues`);
  if (destinationPages.size !== 12) errors.push(`app.js : ${destinationPages.size} pages de destination distinctes détectées, 12 attendues`);
  for (const surface of surfaceSet) {
    if (!destinationKeys.has(surface)) errors.push(`Schéma interactif : aucune destination déclarée pour ${surface}`);
  }
  for (const [, , destination] of destinations) {
    if (!fs.existsSync(path.join(root, destination))) errors.push(`Schéma interactif : page de destination absente : ${destination}`);
  }
} else {
  errors.push("schema-majestios.svg ou app.js : fichier absent, contrôle du schéma impossible");
}

if (errors.length) {
  console.error(`Vérification échouée : ${errors.length} problème(s) sur ${pages.length} pages.\n- ${errors.join("\n- ")}`);
  process.exitCode = 1;
} else {
  console.log(`Vérification structurelle réussie : ${pages.length} pages HTML, ${references} références locales contrôlées, aucune ancre locale manquante détectée.`);
}
