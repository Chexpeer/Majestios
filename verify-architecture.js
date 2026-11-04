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
  assert(!/const\s+menuToggle\s*=/.test(pageHtml) || !pageHtml.includes('src="app.js"'),
    page + " : éviter une déclaration globale de menu en conflit avec app.js");
}
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
    "Accueil : les huit destinations ou leurs routes ne respectent pas la nomenclature Ambitios");
  for (const destination of destinations) {
    assert(destination.width>0 && destination.height>0 && destination.x>=0 && destination.y>=0 &&
      destination.x+destination.width<=943 && destination.y+destination.height<=1387,
      "Accueil : zone interactive hors image pour "+destination.name);
    const route = destination.href.split("#")[0];
    assert(exists(route),"Accueil : destination absente : "+route);
    assert(siteFiles.includes(route),"Build : destination non publiée : "+route);
  }
  assert(home.includes('document.createElementNS(namespace, "a")'),"Accueil : les destinations doivent être des liens SVG natifs");
  assert(home.includes('viewBox="0 0 943 1387"'),"Accueil : le repère SVG doit correspondre à Ambitios.webp (943 × 1387)");
  assert(home.includes('src="Ambitios.webp"'),"Accueil : le panorama Ambitios est absent");
  assert(home.includes("destination.href"),"Accueil : les zones doivent ouvrir directement leur route");
  assert(home.includes("let current = destinations.length - 1;"),"Accueil : l'ascenseur doit démarrer au rez-de-chaussée (Accueil)");
  assert(home.includes("selectFloor(destinations.length - 1);"),"Accueil : la cabine doit être initialisée à Accueil");
  assert(home.includes('cabin.setAttribute("x", "518")') && home.includes('cabin.setAttribute("width", "48")'),
    "Accueil : la cabine doit être positionnée et dimensionnée dans la gaine vitrée");
  assert(home.includes("const elevatorStops = [314, 424, 534, 644, 754, 864, 974, 1084];") &&
    home.includes("const offset = elevatorStops[current] - cabinCenterY;"),
    "Accueil : les huit arrêts de cabine doivent suivre la gaine vitrée");
  assert(home.includes('caption.setAttribute("role", "status")') &&
    home.includes('caption.setAttribute("aria-live", "polite")'),
    "Accueil : le niveau de la cabine doit être annoncé aux technologies d'assistance");
  assert(home.includes('window.setTimeout(() => { window.location.href = row.getAttribute("href"); }, delay);'),
    "Accueil : la cabine doit atteindre l'étage avant la navigation directe");
  assert(home.includes('window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 900'),
    "Accueil : la navigation par ascenseur doit respecter la réduction des animations");

}
for (const asset of ["Ambitios.webp","Développement-.webp","Marché-Public-.webp","Prospection-.webp","Marcheprive.webp","Reseau.webp"]) {
  assert(exists(asset),"Image de référence absente : "+asset);
  assert(siteFiles.includes(asset),"Build : image non publiée : "+asset);
}
const immersiveCss = read("rubriques-immersives.css");
for (const [selector,asset] of [
  ["body.page-development-commercial","Développement-.webp"],
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
  assert(/href="rubriques-immersives\\.css"/.test(html),
    "Recherche : feuille de style commune absente sur " + page);
}

const prospecting = read("prospection-active.html");
assert(prospecting.includes("<title>Prospection active — MajestiOS</title>"), "Prospection active : titre incorrect");
assert(prospecting.includes("<h1>Prospection active</h1>"), "Prospection active : titre principal incorrect");
assert(!/prospection invers[ée]/i.test(prospecting), "Prospection active : ancienne appellation encore visible");

if (errors.length) {
  console.error("Vérification de l’architecture échouée : " + errors.length + " problème(s).\n- " + errors.join("\n- "));
  process.exit(1);
}
console.log("Architecture vérifiée : " + htmlPages.length + " pages HTML, huit destinations Ambitios, six images WebP publiées (panorama et cinq fonds), moteur de recherche et " + siteFiles.length + " ressources. README.md présent, documentation Markdown limitée à docs/ et AGENTS.md.");
