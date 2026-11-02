const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const errors = [];
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));
const assert = (condition, message) => { if (!condition) errors.push(message); };

assert(exists("index.html"), "Accueil absent");
assert(exists("build.js"), "Build absent");
assert(exists("catalogue-majestios.js"), "Catalogue partagé absent");
assert(exists("app.js"), "Moteur de recherche absent");

const buildSource = read("build.js");
const manifestMatch = buildSource.match(/const siteFiles = \[([\s\S]*?)\];/);
let siteFiles = [];
if (!manifestMatch) {
  errors.push("Build : manifeste siteFiles introuvable");
} else {
  siteFiles = [...manifestMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  assert(new Set(siteFiles).size === siteFiles.length, "Build : fichiers dupliqués dans le manifeste");
  for (const file of siteFiles) assert(exists(file), `Build : ressource déclarée absente : ${file}`);
  assert(exists("dist/index.html"), "Build : dist/index.html absent après compilation");
  assert(exists("dist/6180 (2).webp"), "Build : image de référence absente de dist");
}

const home = read("index.html");
assert(home.includes("<title>MajestiOS — Développement commercial intelligent</title>"), "Accueil : titre SEO inattendu");
assert(home.includes('id="advanced-search-form"'), "Accueil : formulaire de recherche avancée absent");
for (const id of ["feed-search", "feed-sector", "feed-market-type", "feed-region"]) {
  assert(home.includes(`id="${id}"`), `Accueil : filtre de recherche absent : #${id}`);
}
assert(home.includes('src="catalogue-majestios.js"'), "Accueil : catalogue partagé non chargé");
assert(home.includes('src="app.js"'), "Accueil : moteur de recherche non chargé");
assert(home.includes("IMMEUBLE INTERACTIF · 10 DOSSIERS THÉMATIQUES"), "Accueil : titre de l'immeuble non harmonisé");
assert(home.includes("IMMEUBLE INTERACTIF · 10 ÉTAGES"), "Accueil : nombre d’étages incorrect");

const floorBlock = home.match(/const floors = \[([\s\S]*?)\n        \];/);
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
if (!floorBlock) {
  errors.push("Accueil : liste des étages introuvable");
} else {
  const floors = [...floorBlock[1].matchAll(/\{id:"(B\d{2})",name:"([^"]+)",folder:"([^"]+)",description:"[^"]*",links:\[([\s\S]*?)\]\}/g)]
    .map((m) => ({
      id:m[1], name:m[2], folder:m[3],
      destinations:[...m[4].matchAll(/href:"([^"]+\.html)"/g)].map((link) => link[1])
    }));
  assert(floors.length === 10, `Accueil : ${floors.length} étages détectés au lieu de 10`);
  assert(floors.every((f, i) => f.name === expectedThemes[i]), "Accueil : noms ou ordre des dix thèmes incorrects");
  assert(floors.every((f, i) => f.folder === expectedFolders[i]), "Accueil : correspondance entre étages et dossiers incorrecte");
  assert(floors.some((f) => f.name === "Prospection active"), "Accueil : étage « Prospection active » absent");
  for (const floor of floors) {
    assert(floor.destinations.length >= 1, `Accueil : ${floor.name} doit proposer au moins un accès utile`);
    assert(new Set(floor.destinations).size === floor.destinations.length, `Accueil : destinations dupliquées pour ${floor.name}`);
    for (const destination of floor.destinations) {
      assert(exists(destination), `Accueil : destination absente pour ${floor.name} : ${destination}`);
      assert(siteFiles.includes(destination), `Build : destination non publiée pour ${floor.name} : ${destination}`);
    }
  }
  assert(home.includes('const primary = floor.links[0]'), "Accueil : destination principale de chaque étage absente");
  assert(home.includes('document.createElement("a")') && home.includes("link.href = primary.href"), "Accueil : les étages ne sont pas des liens directs cliquables");
  assert(!home.includes('button.className = "floor-row"'), "Accueil : les étages utilisent encore des boutons au lieu de liens directs");
  const enterpriseFloor = floors.find((floor) => floor.name === "Espace entreprises");
  assert(enterpriseFloor?.destinations.length === 1 && enterpriseFloor.destinations[0] === "espace-membre.html", "Accueil : Espace entreprises doit pointer uniquement vers son espace dédié");
}


const prospectingPage = read("prospection-active.html");
assert(prospectingPage.includes("<title>Prospection active — MajestiOS</title>"), "Prospection active : titre de page non harmonisé");
assert(prospectingPage.includes("<h1>Prospection active</h1>"), "Prospection active : titre principal non harmonisé");
assert(!prospectingPage.includes("Prospection inversée"), "Prospection active : ancienne appellation encore visible");

const catalogue = read("catalogue-majestios.js");
assert(catalogue.includes("searchCategories") && catalogue.includes("searchRegions") && catalogue.includes("marketTypes"), "Catalogue : filtres de recherche incomplets");
assert(!catalogue.includes("rubrics: Object.freeze"), "Catalogue : ancien catalogue des bâtiments encore exposé");


const dossierFiles = [
  "dossiers/01-marches-publics/README.md",
  "dossiers/02-marches-prives/README.md",
  "dossiers/03-veille-economique/README.md",
  "dossiers/04-prospection/README.md",
  "dossiers/05-developpement-commercial/README.md",
  "dossiers/06-accompagnement-appels-offres/README.md",
  "dossiers/07-salon-virtuel/README.md",
  "dossiers/08-espace-entreprises/README.md",
  "dossiers/09-crm/README.md",
  "dossiers/10-business-intelligence/README.md"
];
assert(exists("DOSSIERS-MAJESTIOS.md"), "Documentation de référence des dossiers absente");
assert(exists("ARBORESCENCE-MAJESTIOS.md"), "Arborescence historique absente");
assert(exists("dossiers/README.md"), "Point d’entrée du dossier dossiers/ absent");
for (const file of dossierFiles) assert(exists(file), `Dossier thématique absent : ${file}`);

const categoryPages = [
  "categorie-services-numeriques.html", "categorie-travaux-amenagement.html",
  "categorie-conseil-etudes.html", "categorie-batiment.html", "categorie-renovation.html",
  "categorie-electricite.html", "categorie-plomberie-chauffage.html", "categorie-maintenance.html"
];
for (const page of categoryPages) {
  assert(exists(page), `Page de catégorie absente : ${page}`);
  if (exists(page)) assert(read(page).includes('src="category-results.js"'), `${page} : module de résultats absent`);
}
assert(exists("search-results.js") && exists("opportunity-search.js"), "Modules de résultats de recherche absents");

if (errors.length) {
  console.error(`Vérification de la refonte échouée : ${errors.length} problème(s).\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
console.log(`Refonte vérifiée : 10 dossiers thématiques, 10 étages d’accueil, 10 étages interactifs, moteur de recherche et ${siteFiles.length} ressources déclarées cohérents.`);
