const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const errors = [];
const pages = fs.readdirSync(root).filter((name) => name.endsWith(".html"));
const buildSource = fs.readFileSync(path.join(root, "build.js"), "utf8");
const manifestMatch = buildSource.match(/const siteFiles = \[([\s\S]*?)\];/);
const siteFiles = manifestMatch ? [...manifestMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]) : [];
const exists = (file) => fs.existsSync(path.join(root, file));
const assert = (condition, message) => { if (!condition) errors.push(message); };

assert(Boolean(manifestMatch), "Build : manifeste siteFiles introuvable");
assert(new Set(siteFiles).size === siteFiles.length, "Build : fichiers dupliqués dans le manifeste");
for (const file of siteFiles) assert(exists(file), \`Build : ressource déclarée absente : \${file}\`);
for (const page of pages) assert(siteFiles.includes(page), \`Build : page HTML absente du manifeste : \${page}\`);

const requiredAssets = [
  "styles.css", "app.js", "catalogue-majestios.js", "rubriques-immersives.css",
  "rubriques-immersives.js", "category-results.js", "search-results.js",
  "opportunity-search.js", "rubric-search.js", "naf-suggestions.js",
  "company-targeting.js", "company-targeting-page.js", "company-fit.js"
];
for (const asset of requiredAssets) assert(siteFiles.includes(asset), \`Build : ressource requise absente du manifeste : \${asset}\`);

for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), "utf8");
  const ids = new Set([...html.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1]));
  const seen = new Set();
  for (const match of html.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)) {
    if (seen.has(match[1])) errors.push(\`\${page} : identifiant dupliqué #\${match[1]}\`);
    seen.add(match[1]);
  }
  for (const match of html.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi)) {
    const value = match[1].trim();
    if (!value || /^(?:[a-z]+:|\/\/)/i.test(value) || value.startsWith("data:")) continue;
    const [pathname, fragment = ""] = value.split("#", 2);
    const cleanPath = pathname.split("?")[0];
    const target = cleanPath ? path.resolve(root, decodeURIComponent(cleanPath)) : path.join(root, page);
    if (!target.startsWith(root + path.sep) && target !== root) {
      errors.push(\`\${page} : chemin hors du projet : \${value}\`);
      continue;
    }
    if (!fs.existsSync(target)) {
      errors.push(\`\${page} : ressource locale absente : \${value}\`);
      continue;
    }
    if (fragment && target.endsWith(".html")) {
      const targetHtml = target === path.join(root, page) ? html : fs.readFileSync(target, "utf8");
      const targetIds = new Set([...targetHtml.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1]));
      if (!targetIds.has(decodeURIComponent(fragment))) errors.push(\`\${page} : ancre absente : \${value}\`);
    }
  }
}

const home = fs.readFileSync(path.join(root, "index.html"), "utf8");
assert(home.includes("<title>MajestiOS — Développement commercial intelligent</title>"), "Accueil : titre SEO inattendu");
assert(home.includes('aria-label="Immeuble interactif MajestiOS"'), "Accueil : immeuble interactif absent");
assert(home.includes("IMMEUBLE INTERACTIF · 10 DOSSIERS THÉMATIQUES"), "Accueil : intitulé de l’immeuble non harmonisé");
assert(home.includes("IMMEUBLE INTERACTIF · 10 ÉTAGES"), "Accueil : légende des dix étages absente");
assert(home.includes('id="floor-rows"'), "Accueil : conteneur des étages absent");
assert(home.includes('id="advanced-search-form"'), "Accueil : recherche avancée absente");
for (const id of ["feed-search", "feed-sector", "feed-market-type", "feed-region"]) {
  assert(home.includes(\`id="\${id}"\`), \`Accueil : filtre absent : #\${id}\`);
}
assert(!/zone[\s_-]*artisanale|zone[\s_-]*interactive/i.test(home), "Accueil : ancienne appellation encore présente");
assert(!/zone-artisanale\.(?:html|css|js)/i.test(home), "Accueil : ancienne ressource encore référencée");

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
  errors.push("Accueil : liste des dix étages introuvable");
} else {
  const floors = [...floorBlock[1].matchAll(/\{id:"(B\d{2})",name:"([^"]+)",folder:"([^"]+)",description:"[^"]*",links:\[([\s\S]*?)\]\}/g)]
    .map((m) => ({ id:m[1], name:m[2], folder:m[3], destinations:[...m[4].matchAll(/href:"([^"]+\.html)"/g)].map((link) => link[1]) }));
  assert(floors.length === 10, \`Accueil : \${floors.length} étages détectés au lieu de 10\`);
  assert(floors.every((f, i) => f.name === expectedThemes[i]), "Accueil : noms ou ordre des dix thèmes incorrects");
  assert(floors.every((f, i) => f.folder === expectedFolders[i]), "Accueil : correspondance entre étages et dossiers incorrecte");
  for (const floor of floors) {
    assert(floor.destinations.length >= 1, \`Accueil : aucun accès pour \${floor.name}\`);
    assert(new Set(floor.destinations).size === floor.destinations.length, \`Accueil : destinations dupliquées pour \${floor.name}\`);
    for (const destination of floor.destinations) {
      assert(exists(destination), \`Accueil : destination absente pour \${floor.name} : \${destination}\`);
      assert(siteFiles.includes(destination), \`Build : destination non publiée pour \${floor.name} : \${destination}\`);
    }
  }
  assert(home.includes('link.className = "floor-row"') && home.includes("link.href = primary.href"), "Accueil : les étages ne sont pas rendus comme des liens cliquables directs");
}

const catalogue = fs.readFileSync(path.join(root, "catalogue-majestios.js"), "utf8");
assert(catalogue.includes("searchCategories") && catalogue.includes("searchRegions") && catalogue.includes("marketTypes"), "Catalogue : filtres de recherche incomplets");
assert(!catalogue.includes("rubrics: Object.freeze"), "Catalogue : ancienne liste des bâtiments encore exposée");
const rubricSearch = fs.readFileSync(path.join(root, "rubric-search.js"), "utf8");
assert(rubricSearch.includes("catalogue.searchCategories") && rubricSearch.includes("catalogue.searchRegions"), "Recherche : catégories et régions non reliées au catalogue partagé");

const prospecting = fs.readFileSync(path.join(root, "prospection-active.html"), "utf8");
assert(prospecting.includes("<title>Prospection active — MajestiOS</title>"), "Prospection active : titre de page incorrect");
assert(prospecting.includes("<h1>Prospection active</h1>"), "Prospection active : titre principal incorrect");
assert(!/prospection invers[ée]/i.test(prospecting), "Prospection active : ancienne appellation encore visible");

const legacyFiles = ["zone-artisanale.html", "zone-artisanale.css", "zone-artisanale.js", "zone-artisanale-config.js"];
for (const file of legacyFiles) assert(!exists(file), \`Ancienne expérience 3D : fichier encore présent : \${file}\`);
assert(!siteFiles.some((file) => /zone-artisanale/i.test(file)), "Build : ancienne expérience 3D encore publiée");

if (errors.length) {
  console.error(\`Vérification du site échouée : \${errors.length} problème(s).\\n- \${errors.join("\\n- ")}\`);
  process.exit(1);
}
console.log(\`Site vérifié : \${pages.length} pages HTML, immeuble interactif à dix étages, moteur de recherche et \${siteFiles.length} ressources publiées cohérents.\`);
