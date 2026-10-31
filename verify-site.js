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
  if (surfaces.length !== 12 || surfaceSet.size !== 12) errors.push(`schema-majestios.svg : ${surfaces.length} losanges détectés, 12 uniques attendus`);
  if (destinations.length !== 12 || destinationKeys.size !== 12) errors.push(`app.js : ${destinations.length} destinations du schéma détectées, 12 uniques attendues`);
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
