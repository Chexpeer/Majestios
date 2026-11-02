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
const markdownFiles = files.filter((file) => /\.mdx?$/i.test(file));
assert(markdownFiles.length === 0, "Documentation Markdown encore présente : " + markdownFiles.join(", "));

assert(exists("index.html"), "Accueil absent");
assert(exists("build.js"), "Build absent");
assert(exists("catalogue-majestios.js"), "Catalogue partagé absent");
assert(exists("app.js"), "Moteur de recherche absent");

const buildSource = read("build.js");
const manifestMatch = buildSource.match(/const siteFiles = \[([\s\S]*?)\];/);
const siteFiles = manifestMatch ? [...manifestMatch[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]) : [];
assert(Boolean(manifestMatch), "Build : manifeste siteFiles introuvable");
assert(new Set(siteFiles).size === siteFiles.length, "Build : fichiers dupliqués dans le manifeste");
for (const file of siteFiles) assert(exists(file), "Build : ressource déclarée absente : " + file);

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
const expectedFolders = [
  "dossiers/01-marches-publics/", "dossiers/02-marches-prives/",
  "dossiers/03-veille-economique/", "dossiers/04-prospection/",
  "dossiers/05-developpement-commercial/", "dossiers/06-accompagnement-appels-offres/",
  "dossiers/07-salon-virtuel/", "dossiers/08-espace-entreprises/",
  "dossiers/09-crm/", "dossiers/10-business-intelligence/"
];
const floorBlock = home.match(/const floors = \[([\s\S]*?)\n        \];/);
if (!floorBlock) {
  errors.push("Accueil : liste des dix étages introuvable");
} else {
  const floors = [...floorBlock[1].matchAll(/\{id:"(B\d{2})",name:"([^"]+)",folder:"([^"]+)",description:"[^"]*",links:\[([\s\S]*?)\]\}/g)]
    .map((match) => ({
      id: match[1], name: match[2], folder: match[3],
      destinations: [...match[4].matchAll(/href:"([^"]+\.html)"/g)].map((link) => link[1])
    }));
  assert(floors.length === 10, "Accueil : " + floors.length + " étages détectés au lieu de 10");
  assert(floors.every((floor, index) => floor.name === expectedThemes[index]), "Accueil : noms ou ordre des dix thèmes incorrects");
  assert(floors.every((floor, index) => floor.folder === expectedFolders[index]), "Accueil : correspondance des dix thèmes incorrecte");
  for (const floor of floors) {
    assert(floor.destinations.length > 0, "Accueil : aucun accès pour " + floor.name);
    assert(new Set(floor.destinations).size === floor.destinations.length, "Accueil : destinations dupliquées pour " + floor.name);
    for (const destination of floor.destinations) {
      assert(exists(destination), "Accueil : destination absente : " + destination);
      assert(siteFiles.includes(destination), "Build : destination non publiée : " + destination);
    }
  }
  const enterprise = floors.find((floor) => floor.name === "Espace entreprises");
  assert(enterprise?.destinations.length === 1 && enterprise.destinations[0] === "espace-membre.html",
    "Accueil : Espace entreprises doit pointer uniquement vers espace-membre.html");
  assert(home.includes('document.createElement("a")') && home.includes("link.href = primary.href"),
    "Accueil : les étages doivent être des liens directs");
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
console.log("Architecture vérifiée : " + htmlPages.length + " pages HTML, 10 espaces thématiques, moteur de recherche et " + siteFiles.length + " ressources publiées. Aucune documentation Markdown.");
