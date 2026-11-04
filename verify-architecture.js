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
// La documentation Markdown est autorisée uniquement dans docs/, avec README.md et AGENTS.md à la racine.
// Elle ne doit jamais être publiée avec le site : le build ne copie que les fichiers de son manifeste.
const markdownAllowed = (file) => {
  const normalized = file.split(path.sep).join("/");
  return normalized === "README.md" || normalized === "AGENTS.md" || normalized.startsWith("docs/");
};
const markdownFiles = files.filter((file) => /\.mdx?$/i.test(file) && !markdownAllowed(file));
assert(markdownFiles.length === 0, "Documentation Markdown hors README.md, AGENTS.md et docs/ : " + markdownFiles.join(", "));
assert(exists("README.md"), "README.md absent : guide de démarrage attendu");

assert(exists("index.html"), "Accueil absent");
assert(exists("build.js"), "Build absent");
assert(exists("catalogue-majestios.js"), "Catalogue partagé absent");
assert(exists("app.js"), "Moteur de recherche absent");

let siteFiles = [];
try {
  const manifest = JSON.parse(read("site-files.json"));
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
  assert(!path.posix.isAbsolute(file) && !file.replace(/\\\\/g, "/").split("/").includes(".."), "Build : chemin interdit : " + file);
  assert(exists(file) && fs.statSync(path.join(root, file)).isFile(), "Build : ressource déclarée absente ou non-fichier : " + file);
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
for (const id of ["feed-search", "feed-sector", "feed-market-type", "feed-department"]) {
  assert(home.includes('id="' + id + '"'), "Accueil : filtre absent : #" + id);
}

const expectedDestinations = [
  ["Espace privé","espace-membre.html"],
  ["Réseau","reseaux-synergies.html"],
  ["Développement commercial","developpement-commercial.html"],
  ["Prospection","prospection-active.html"],
  ["Marchés publics","marches-publics.html"],
  ["Marchés privés","marches-prives.html"],
  ["Réputation virtuelle","reputation-virtuelle.html"],
  ["Accueil","index.html#accueil"]
];
const destinationBlock = home.match(/const destinations = \[([\s\S]*?)\n        \];/);
if (!destinationBlock) {
  errors.push("Accueil : catalogue des huit destinations introuvable");
} else {
  const destinations = [...destinationBlock[1].matchAll(/\{id:"(\d{2})",name:"([^"]+)",href:"([^"]+)",x:(\d+),y:(\d+),width:(\d+),height:(\d+)\}/g)]
    .map(match => ({id:match[1],name:match[2],href:match[3],x:Number(match[4]),y:Number(match[5]),width:Number(match[6]),height:Number(match[7])}));
  assert(destinations.length===8,"Accueil : exactement huit destinations doivent être définies");
  assert(destinations.every((item,index)=>item.name===expectedDestinations[index][0] && item.href===expectedDestinations[index][1]),
    "Accueil : les huit destinations ou leurs routes ne respectent pas la nomenclature Ambisios");
  for (const destination of destinations) {
    assert(destination.width>0 && destination.height>0 && destination.x>=0 && destination.y>=0 &&
      destination.x+destination.width<=943 && destination.y+destination.height<=1387,
      "Accueil : zone interactive hors image pour "+destination.name);
    const route = destination.href.split("#")[0];
    assert(exists(route),"Accueil : destination absente : "+route);
    assert(siteFiles.includes(route),"Build : destination non publiée : "+route);
  }
  assert(home.includes('document.createElementNS(namespace, "a")'),"Accueil : les destinations doivent être des liens SVG natifs");
  assert(home.includes('viewBox="0 0 943 1387"'),"Accueil : le repère SVG doit correspondre à Ambisios.webp (943 × 1387)");
  assert(home.includes('src="Ambisios.webp"'),"Accueil : le panorama Ambisios est absent");
  assert(home.includes("destination.href"),"Accueil : les zones doivent ouvrir directement leur route");
}
for (const asset of ["Ambisios.webp","Développement-.webp","Marché-Public-.webp","Prospection-.webp","Marcheprive.webp"]) {
  assert(exists(asset),"Image de référence absente : "+asset);
  assert(siteFiles.includes(asset),"Build : image non publiée : "+asset);
}
const immersiveCss = read("rubriques-immersives.css");
for (const [selector,asset] of [
  ["body.page-development-commercial","Développement-.webp"],
  ["body.page-marches-publics","Marché-Public-.webp"],
  ["body.page-prospection","Prospection-.webp"],
  ["body.page-marches-prives","Marcheprive.webp"]
]) {
  assert(immersiveCss.includes(selector) && immersiveCss.includes('url("'+asset+'")'),
    "Fond de rubrique absent ou mal associé : "+asset);
}
assert(exists("reputation-virtuelle.html"),"Page Réputation virtuelle absente");
assert(siteFiles.includes("reputation-virtuelle.html"),"Build : page Réputation virtuelle non publiée");

const catalogue = read("catalogue-majestios.js");
assert(catalogue.includes("searchCategories") && catalogue.includes("searchDepartments") && catalogue.includes("marketTypes"),
  "Catalogue : filtres de recherche incomplets");
const rubricSearch = read("rubric-search.js");
assert(rubricSearch.includes("catalogue.searchCategories") && rubricSearch.includes("catalogue.searchDepartments"),
  "Recherche : filtres non reliés au catalogue partagé");

const prospecting = read("prospection-active.html");
assert(prospecting.includes("<title>Prospection active — MajestiOS</title>"), "Prospection active : titre incorrect");
assert(prospecting.includes("<h1>Prospection active</h1>"), "Prospection active : titre principal incorrect");
assert(!/prospection invers[ée]/i.test(prospecting), "Prospection active : ancienne appellation encore visible");

if (errors.length) {
  console.error("Vérification de l’architecture échouée : " + errors.length + " problème(s).\n- " + errors.join("\n- "));
  process.exit(1);
}
console.log("Architecture vérifiée : " + htmlPages.length + " pages HTML, huit destinations Ambisios, quatre images WebP publiées, moteur de recherche et " + siteFiles.length + " ressources. README.md présent, documentation Markdown limitée à docs/ et AGENTS.md.");
