const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));

function walk(directory, relative = "") {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === ".git" || entry.name === "node_modules" || entry.name === "dist") return [];
    const rel = path.join(relative, entry.name);
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute, rel) : [rel];
  });
}

const files = walk(root);
const markdownAllowed = (file) => {
  const normalized = file.split(path.sep).join("/");
  return normalized === "README.md" || normalized === "AGENTS.md" || normalized.startsWith("docs/");
};
const markdownFiles = files.filter((file) => /\.mdx?$/i.test(file) && !markdownAllowed(file));
assert(markdownFiles.length === 0, "Documentation Markdown hors README.md, AGENTS.md et docs/ : " + markdownFiles.join(", "));
assert(exists("README.md"), "README.md absent : guide de démarrage attendu");

assert(exists("index.html"), "Accueil absent");
assert(exists("build.js"), "Build absent");
assert(exists("site-files.json"), "Manifeste centralisé absent");
assert(exists("catalogue-majestios.js"), "Catalogue partagé absent");
assert(exists("app.js"), "Moteur de recherche absent");

let siteFiles = [];
try {
  const manifest = JSON.parse(read("site-files.json"));
  siteFiles = Array.isArray(manifest.files) ? manifest.files : [];
} catch (error) {
  errors.push("Manifeste site-files.json invalide : " + error.message);
}
assert(siteFiles.length > 0, "Build : manifeste des ressources vide");
assert(new Set(siteFiles).size === siteFiles.length, "Build : fichiers dupliqués dans le manifeste");
for (const file of siteFiles) {
  assert(typeof file === "string" && file.length > 0, "Build : chemin vide ou invalide dans le manifeste");
  if (typeof file !== "string" || !file) continue;
  assert(!path.posix.isAbsolute(file) && !file.split(/[\\/]/).includes(".."), "Build : chemin interdit : " + file);
  assert(exists(file), "Build : ressource déclarée absente : " + file);
}
assert(!siteFiles.some((file) => /\.mdx?$/i.test(file)), "Build : la documentation Markdown ne doit pas être publiée avec le site");

const htmlPages = files.filter((file) => file.endsWith(".html") && !file.includes(path.sep));
for (const page of htmlPages) assert(siteFiles.includes(page), "Build : page HTML absente du manifeste : " + page);
for (const asset of [
  "styles.css", "app.js", "catalogue-majestios.js", "rubriques-immersives.css",
  "rubriques-immersives.js", "category-results.js", "search-results.js",
  "opportunity-search.js", "rubric-search.js", "naf-suggestions.js",
  "company-targeting.js", "company-targeting-page.js", "company-fit.js"
]) assert(siteFiles.includes(asset), "Build : ressource requise absente du manifeste : " + asset);

const home = read("index.html");
assert(home.includes("<title>MajestiOS — Développement commercial intelligent</title>"), "Accueil : titre SEO inattendu");
assert(home.includes('aria-label="Immeuble interactif MajestiOS"'), "Accueil : immeuble interactif absent");
assert(home.includes('id="floor-rows"'), "Accueil : conteneur des étages absent");
assert(home.includes('id="advanced-search-form"'), "Accueil : recherche avancée absente");
for (const id of ["feed-search", "feed-sector", "feed-market-type", "feed-region"]) {
  assert(home.includes('id="' + id + '"'), "Accueil : filtre absent : #" + id);
}

const expectedThemes = [
  "Marchés publics", "Marchés privés", "Veille économique", "Prospection active",
  "Développement commercial", "Accompagnement aux appels d’offres", "Salon virtuel",
  "Espace entreprises", "CRM", "Business Intelligence"
];
const vm = require("node:vm");
let floors = [];
try {
  const buildingCatalogue = { MAJESTIOS_BUILDING_CATALOGUE: null };
  vm.runInNewContext(read("building-catalogue.js"), { window: buildingCatalogue });
  floors = buildingCatalogue.MAJESTIOS_BUILDING_CATALOGUE;
  assert(Array.isArray(floors), "Immeuble : catalogue modulaire absent ou invalide");
} catch (error) {
  errors.push("Immeuble : impossible de charger building-catalogue.js : " + error.message);
}
if (Array.isArray(floors)) {
  assert(floors.length === 10, "Immeuble : les dix espaces du catalogue doivent être conservés");
  assert(floors.every((floor, index) => floor.name === expectedThemes[index]),
    "Immeuble : noms ou ordre du catalogue des espaces incorrects");
  assert(floors.every((floor, index) => floor.id === "B" + String(index + 1).padStart(2, "0")),
    "Immeuble : identifiants B01 à B10 attendus");
  for (const floor of floors) {
    assert(typeof floor.folder === "string" && floor.folder.startsWith("dossiers/"),
      "Immeuble : dossier absent pour " + floor.name);
    assert(Array.isArray(floor.links) && floor.links.length > 0,
      "Immeuble : aucun accès déclaré pour " + floor.name);
    for (const destination of floor.links || []) {
      assert(exists(destination.href), "Immeuble : destination absente : " + destination.href);
      assert(siteFiles.includes(destination.href), "Build : destination non publiée : " + destination.href);
    }
  }
  assert(home.includes("const floors = window.MAJESTIOS_BUILDING_CATALOGUE"),
    "Accueil : catalogue modulaire non consommé");
  assert(home.includes('document.createElementNS(SVG_NS, "a")'),
    "Accueil : les zones doivent être des liens SVG natifs");
  assert(home.includes('viewBox="0 0 704 1114"'), "Accueil : repère SVG attendu 704 × 1114");
  assert(home.includes('class="building-photo"') && home.includes('class="building-hotspots"'),
    "Accueil : photo ou calque de zones absent");
  assert(home.includes("for (let number = 9; number >= 1; number -= 1)"),
    "Accueil : neuf étages doivent être générés");
  assert(home.includes("const leftEdge = 72, rightEdge = 556, halfHeight = 34"),
    "Accueil : géométrie des zones polygonales absente");
  assert(home.includes('link.setAttribute("href", floor.links[0].href)'),
    "Accueil : destinations directes des zones absentes");
  assert(home.includes('number === 9 ? "IA & Business Intelligence"'),
    "Accueil : intitulé du neuvième étage incorrect");
  const enterprise = floors.find(floor => floor.name === "Espace entreprises");
  assert(enterprise?.links?.[0]?.href === "espace-membre.html",
    "Accueil : accès Espace entreprises incorrect");
}

const catalogue = read("catalogue-majestios.js");
assert(catalogue.includes("searchCategories") && catalogue.includes("searchRegions") && catalogue.includes("marketTypes"),
  "Catalogue : filtres de recherche incomplets");
const rubricSearch = read("rubric-search.js");
assert(rubricSearch.includes("catalogue.searchCategories") && rubricSearch.includes("catalogue.searchRegions"),
  "Recherche : filtres non reliés au catalogue partagé");

const prospecting = read("prospection-active.html");
assert(prospecting.includes("<title>Prospection active — MajestiOS</title>"), "Prospection active : titre incorrect");
assert(prospecting.includes("<h1>Prospection active</h1>"), "Prospection active : titre principal incorrect");
assert(!/prospection invers[ée]/i.test(prospecting), "Prospection active : ancienne appellation encore visible");

if (errors.length) {
  console.error("Vérification de l’architecture échouée : " + errors.length + " problème(s).\n- " + errors.join("\n- "));
  process.exit(1);
}
console.log("Architecture vérifiée : " + htmlPages.length + " pages HTML, 10 espaces thématiques, moteur de recherche et " + siteFiles.length + " ressources publiées. README.md présent, documentation Markdown limitée à docs/ et AGENTS.md.");
