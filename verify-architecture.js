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
const expectedSiteNavigation = [
  ["index.html", "Accueil"],
  ["developpement-commercial.html", "Développement commercial"],
  ["reseaux-synergies.html", "Réseau"],
  ["reputation-virtuelle.html", "Réputation virtuelle"],
  ["nous-rejoindre.html", "Nous rejoindre"],
  ["espace-membre.html", "Espace privé"],
  ["faq.html", "FAQ"]
];
for (const page of htmlPages) {
  const pageHtml = read(page);
  const nav = pageHtml.match(/<nav\b(?=[^>]*\bid="site-nav")[^>]*>([\s\S]*?)<\/nav>/);
  assert(Boolean(nav), page + " : navigation principale absente");
  if (!nav) continue;
  const links = [...nav[1].matchAll(/<a\b([^>]*)href="([^"]+)"([^>]*)>([\s\S]*?)<\/a>/g)];
  const navigation = links.map((match) => [
    match[2],
    match[4].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
  ]);
  assert(JSON.stringify(navigation) === JSON.stringify(expectedSiteNavigation),
    page + " : la navigation principale doit rester identique aux autres pages");
  const currentLinks = links.filter((match) => /aria-current="page"/.test(match[1] + match[3]));
  assert(currentLinks.length <= 1, page + " : une seule destination au maximum peut être marquée comme courante");
  if (currentLinks.length === 1) {
    const currentPage = currentLinks[0][2].split(/[?#]/, 1)[0];
    assert(currentPage === page, page + " : aria-current doit désigner la page réellement affichée");
  }
  assert(pageHtml.includes('src="app.js"'),
    page + " : le menu principal doit utiliser le contrôleur partagé app.js");
  assert(!pageHtml.includes('querySelector(".menu-toggle")'),
    page + " : le menu ne doit pas avoir de contrôleur inline concurrent");
}
for (const asset of [
  "styles.css", "charte-majestios.css", "app.js", "catalogue-majestios.js", "rubriques-immersives.css",
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
  {id:"08",name:"Espace privé",href:"espace-membre.html",x:185,y:182,width:350,height:82},
  {id:"07",name:"Réseau",href:"reseaux-synergies.html",x:185,y:266,width:350,height:80},
  {id:"06",name:"Développement commercial",href:"developpement-commercial.html",x:185,y:350,width:350,height:92},
  {id:"05",name:"Prospection",href:"prospection-active.html",x:185,y:444,width:350,height:81},
  {id:"04",name:"Accompagnement appels d'offres",href:"accompagnement-appels-offres.html",x:185,y:528,width:350,height:87},
  {id:"03",name:"Marchés publics",href:"marches-publics.html",x:185,y:618,width:350,height:83},
  {id:"02",name:"Marchés privés",href:"marches-prives.html",x:185,y:704,width:350,height:87},
  {id:"01",name:"Réputation virtuelle",href:"reputation-virtuelle.html",x:185,y:794,width:350,height:85},
  {id:"RDC",name:"Accueil",href:"index.html#accueil",x:185,y:883,width:350,height:89}
];
const destinationBlock = home.match(/const destinations = \[([\s\S]*?)\n        \];/);
if (!destinationBlock) {
  errors.push("Accueil : catalogue des neuf destinations introuvable");
} else {
  const destinations = [...destinationBlock[1].matchAll(/\{id:"(\d{2}|RDC)",name:"([^"]+)",href:"([^"]+)",x:(\d+),y:(\d+),width:(\d+),height:(\d+)\}/g)]
    .map(match => ({id:match[1],name:match[2],href:match[3],x:Number(match[4]),y:Number(match[5]),width:Number(match[6]),height:Number(match[7])}));
  assert(destinations.length===9,"Accueil : exactement neuf destinations doivent être définies");
  assert(JSON.stringify(destinations)===JSON.stringify(expectedDestinations),
    "Accueil : les neuf destinations, leurs identifiants, coordonnées ou routes ne respectent pas l'architecture V5");
  for (const destination of destinations) {
    assert(destination.width>0 && destination.height>0 && destination.x>=0 && destination.y>=0 &&
      destination.x+destination.width<=843 && destination.y+destination.height<=1264,
      "Accueil : zone interactive hors image pour "+destination.name);
    const route = destination.href.split("#")[0];
    assert(exists(route),"Accueil : destination absente : "+route);
    assert(siteFiles.includes(route),"Build : destination non publiée : "+route);
  }
  assert(home.includes('document.createElementNS(namespace, "a")'),"Accueil : les destinations doivent être des liens SVG natifs");
  assert(home.includes('viewBox="0 0 843 1264"'),"Accueil : le repère SVG doit correspondre à la photo (843 × 1264)");
  assert(home.includes('src="IMMEUBLE.jfif"'),"Accueil : la photographie de l'immeuble est absente");
  assert(home.includes('url("Designer%20(2).png")'),"Accueil : le décor général Designer (2).png est absent");
  assert(home.includes('url("immeuble-masque.png")'),"Accueil : le masque de détourage de l'immeuble est absent");
  assert(home.includes("destination.href"),"Accueil : les zones doivent ouvrir directement leur route");
  assert(home.includes("const elevatorStops = destinations.map((item) => item.y + item.height / 2);") &&
    home.includes("const cabinCenterY = 185;") &&
    home.includes("const offset = elevatorStops[current] - cabinCenterY;"),
    "Accueil : les arrêts de cabine doivent être calculés depuis le centre réel des zones de chaque étage");
  assert(home.includes('makeShape("path", "elevator-cabin"') &&
    home.includes('d:"M558 157 C558 148 572 144 590 144'),
    "Accueil : la cabine doit rester un cylindre panoramique en verre");
  assert(home.includes('svg.addEventListener("pointerover"') &&
    home.includes('if (row) selectFloor(destinations.findIndex((item) => item.id === row.dataset.floor));'),
    "Accueil : le survol doit appeler l'ascenseur au bon étage");
  assert(home.includes('window.location.href = row.getAttribute("href");'),
    "Accueil : un clic doit ouvrir directement la destination");
  assert(home.includes('caption.setAttribute("role", "status")') &&
    home.includes('caption.setAttribute("aria-live", "polite")'),
    "Accueil : le niveau de la cabine doit être annoncé aux technologies d'assistance");
  assert(home.includes('canvas.setAttribute("data-title-lines", titleLines.join("|"))') &&
    home.includes('sign.canvas.dataset.state = "paused"') &&
    home.includes('sign.canvas.dataset.state = "scrolling"'),
    "Accueil : les titres LED doivent exposer leurs lignes et leurs états de survol pour les tests");
}

for (const asset of ["IMMEUBLE.jfif","immeuble-masque.png","Designer (2).png","Majestios.developpement-commercial.jpg","Marché-Public-.webp","Prospection-.webp","Marcheprive.webp","Reseau.webp"]) {
  assert(exists(asset),"Image de référence absente : "+asset);
  assert(siteFiles.includes(asset),"Build : image non publiée : "+asset);
}
assert(!exists("Ambitios.webp") && !exists("Développement-.webp") && !exists("Majestios.immeuble.jpg"),
  "Les deux anciens visuels remplacés doivent être retirés après vérification de leurs références");
const immersiveCss = read("rubriques-immersives.css");
for (const [selector,asset] of [
  ["body.page-development-commercial","Majestios.developpement-commercial.jpg"],
  ["body.page-marches-publics","Marché-Public-.webp"],
  ["body.page-prospection","Prospection-.webp"],
  ["body.page-marches-prives","Marcheprive.webp"],
  ["body.page-reseaux","Reseau.webp"]
]) {
  assert(immersiveCss.includes(selector) && immersiveCss.includes('url("'+asset+'")'),
    "Fond de rubrique absent ou mal associé : "+asset);
}
assert(exists("reputation-virtuelle.html"),"Page Réputation virtuelle absente");
assert(siteFiles.includes("reputation-virtuelle.html"),"Build : page Réputation virtuelle non publiée");

const catalogue = read("catalogue-majestios.js");
assert(catalogue.includes("searchCategories") && catalogue.includes("searchDepartments") && catalogue.includes("marketTypes"),
  "Catalogue : filtres de recherche incomplets");
const categoryResults = read("category-results.js");
assert(categoryResults.includes('params.set("marche", "public")'),
  "Catégories publiques : la recherche et le retour doivent conserver le type de marché public");
const searchResults = read("search-results.js");
assert(searchResults.includes('department === "all"\n    ? "Tous les départements"'),
  "Résultats : le filtre département par défaut doit être libellé clairement");
for (const [page, category] of [
  ["categorie-services-numeriques.html", "services"],
  ["categorie-travaux-amenagement.html", "travaux"],
  ["categorie-conseil-etudes.html", "conseil"],
  ["categorie-batiment.html", "batiment"],
  ["categorie-renovation.html", "renovation"],
  ["categorie-electricite.html", "electricite"],
  ["categorie-plomberie-chauffage.html", "plomberie"],
  ["categorie-maintenance.html", "maintenance"]
]) {
  assert(read(page).includes(`href="index.html?marche=public&amp;categorie=${category}#recherche-avancee"`),
    "Catégories publiques : le retour doit restaurer le type et la catégorie sur " + page);
}
const rubricSearch = read("rubric-search.js");
const appSearch = read("app.js");
assert(rubricSearch.includes('id="advanced-search-form"') && rubricSearch.includes('id="feed-market-type"') &&
  rubricSearch.includes('id="feed-sector"') && rubricSearch.includes('id="feed-department"'),
  "Recherche : les rubriques ne réutilisent pas le formulaire commun de l’accueil");
assert(appSearch.includes("MAJESTIOS_CATALOG") && appSearch.includes("populateSearchFilters"),
  "Recherche : les interactions ne consomment pas le catalogue partagé");
assert(appSearch.includes('#open-personal-space, #open-personal-space-shortcut'),
  "Espace privé : les deux boutons doivent ouvrir le même formulaire de préparation");
for (const page of ["marches-publics.html","developpement-commercial.html","prospection-active.html","veille-marches.html",
  "accompagnement-appels-offres.html","sous-traitance.html","intelligence-economique.html","reseaux-synergies.html",
  "bodacc-veille-entreprises.html","suivi-commercial.html","marches-prives.html","reputation-virtuelle.html",
  "espace-membre.html","salons-seminaires.html","crm.html","majestios-v5.html",
  "categorie-services-numeriques.html","categorie-travaux-amenagement.html","categorie-conseil-etudes.html",
  "categorie-batiment.html","categorie-renovation.html","categorie-electricite.html",
  "categorie-plomberie-chauffage.html","categorie-maintenance.html","faq.html","nous-rejoindre.html",
  "vision-majestios.html","qualification-entreprises.html","resultats-recherche.html"]) {
  const html = read(page);
  assert(html.indexOf('src="catalogue-majestios.js"') >= 0 &&
    html.indexOf('src="catalogue-majestios.js"') < html.indexOf('src="rubric-search.js"') &&
    html.indexOf('src="rubric-search.js"') < html.indexOf('src="app.js"'),
    "Recherche : ordre de chargement du catalogue et du moteur commun incorrect sur " + page);
  assert(/href="rubriques-immersives\.css"/.test(html),
    "Recherche : feuille de style commune absente sur " + page);
  assert(/href="charte-majestios\.css"/.test(html),
    "Charte : feuille de style commune absente sur " + page);
  const stylesheetLinks = [...html.matchAll(/<link[^>]+href="([^"]+\.css)"[^>]*>/g)].map(match => match[1]);
  assert(stylesheetLinks[stylesheetLinks.length - 1] === "charte-majestios.css",
    "Charte : charte-majestios.css doit être chargée en dernier sur " + page);
  assert(stylesheetLinks.indexOf("rubriques-immersives.css") < stylesheetLinks.indexOf("charte-majestios.css"),
    "Charte : les styles de rubrique doivent précéder la charte commune sur " + page);
}

const prospecting = read("prospection-active.html");
assert(prospecting.includes("<title>Prospection active — MajestiOS</title>"), "Prospection active : titre incorrect");
assert(prospecting.includes("<h1>Prospection active</h1>"), "Prospection active : titre principal incorrect");
assert(!/prospection invers[ée]/i.test(prospecting), "Prospection active : ancienne appellation encore visible");

if (errors.length) {
  console.error("Vérification de l’architecture échouée : " + errors.length + " problème(s).\n- " + errors.join("\n- "));
  process.exit(1);
}
console.log("Architecture vérifiée : " + htmlPages.length + " pages HTML, neuf destinations MajestiOS, huit visuels publiés (décor, immeuble, masque et cinq fonds), moteur de recherche et " + siteFiles.length + " ressources. README.md présent, documentation Markdown limitée à docs/ et AGENTS.md.");
