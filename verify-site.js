const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
const pages = fs.readdirSync(root).filter((name) => name.endsWith(".html"));
const manifestPath = path.join(root, "site-files.json");
const exists = (file) => fs.existsSync(path.join(root, file));
let siteFiles = [];

try {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
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
  const normalized = file.replace(/\\\\/g, "/");
  assert(!path.posix.isAbsolute(normalized) && !normalized.split("/").includes(".."), "Build : chemin interdit dans le manifeste : " + file);
  assert(!/\.mdx?$/i.test(file), "Build : la documentation ne doit pas être publiée : " + file);
  assert(exists(file) && fs.statSync(path.join(root, file)).isFile(), "Build : ressource déclarée absente ou non-fichier : " + file);
}
for (const page of pages) assert(siteFiles.includes(page), "Build : page HTML absente du manifeste : " + page);

const rubricSearchPages = [
  "marches-publics.html", "developpement-commercial.html", "prospection-active.html",
  "veille-marches.html", "accompagnement-appels-offres.html", "sous-traitance.html",
  "intelligence-economique.html", "reseaux-synergies.html",
  "bodacc-veille-entreprises.html", "suivi-commercial.html", "marches-prives.html",
  "reputation-virtuelle.html", "espace-membre.html", "salons-seminaires.html",
  "crm.html", "majestios-v5.html"
];
for (const page of rubricSearchPages) {
  assert(exists(page), "Recherche par rubrique : page absente : " + page);
  if (exists(page)) {
    const html = fs.readFileSync(path.join(root, page), "utf8");
    assert(html.includes('src="rubric-search.js"'), page + " : module de recherche par rubrique non chargé");
    assert(html.indexOf('src="rubric-search.js"') < html.indexOf('src="app.js"'), page + " : le moteur commun doit être injecté avant l’initialisation de ses interactions");
  }
}

const sharedSearchScript = fs.readFileSync(path.join(root, "rubric-search.js"), "utf8");
for (const id of ["feed-search", "feed-market-type", "feed-sector", "feed-department", "market-step", "category-step", "department-step"]) {
  assert(sharedSearchScript.includes('id="' + id + '"'), "Moteur partagé : structure commune incomplète, #" + id);
}
assert(sharedSearchScript.includes('class="feed-toolbar"'), "Moteur partagé : le formulaire doit réutiliser le composant de l’accueil");
assert(sharedSearchScript.includes('class="feed-search-submit"'), "Moteur partagé : le bouton doit réutiliser le composant de l’accueil");

for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), "utf8");
  const ids = new Set();
  for (const match of html.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)) {
    if (ids.has(match[1])) errors.push(page + " : identifiant dupliqué #" + match[1]);
    ids.add(match[1]);
  }
  for (const match of html.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi)) {
    const value = match[1].trim();
    if (!value || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value) || value.startsWith("data:") || value.startsWith("#")) continue;
    const [pathname, fragment] = value.split("#", 2);
    const cleanPath = (pathname || "").split("?")[0];
    let decoded;
    try { decoded = decodeURIComponent(cleanPath); }
    catch { errors.push(page + " : URL locale mal encodée : " + value); continue; }
    const target = decoded ? path.resolve(root, decoded) : path.join(root, page);
    if (target !== root && !target.startsWith(root + path.sep)) {
      errors.push(page + " : chemin hors du projet : " + value);
      continue;
    }
    if (!fs.existsSync(target)) {
      errors.push(page + " : ressource locale absente : " + value);
      continue;
    }
    if (fragment && target.endsWith(".html")) {
      let targetHtml;
      try { targetHtml = target === path.join(root, page) ? html : fs.readFileSync(target, "utf8"); }
      catch { continue; }
      const targetIds = new Set([...targetHtml.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map((item) => item[1]));
      if (!targetIds.has(decodeURIComponent(fragment))) errors.push(page + " : ancre absente : " + value);
    }
  }
}

const home = fs.readFileSync(path.join(root, "index.html"), "utf8");
assert(home.includes("<title>MajestiOS — Développement commercial intelligent</title>"), "Accueil : titre SEO inattendu");
assert(home.includes('id="advanced-search-form"'), "Accueil : moteur de recherche absent");
for (const id of ["feed-search", "feed-sector", "feed-market-type", "feed-department"]) {
  assert(home.includes('id="' + id + '"'), "Accueil : filtre absent : #" + id);
}
for (const page of rubricSearchPages) {
  if (!exists(page)) continue;
  const html = fs.readFileSync(path.join(root, page), "utf8");
  for (const id of ["feed-search", "feed-market-type", "feed-sector", "feed-department", "market-step", "category-step", "department-step"]) {
    assert(fs.readFileSync(path.join(root, "rubric-search.js"), "utf8").includes('id="' + id + '"'),
      "Moteur partagé : structure commune incomplète, #" + id);
  }
}
assert(home.includes('id="floor-rows"'), "Accueil : immeuble interactif absent");

if (errors.length) {
  console.error("Vérification du site échouée : " + errors.length + " problème(s).\n- " + errors.join("\n- "));
  process.exit(1);
}
console.log("Site vérifié : " + pages.length + " pages HTML, " + siteFiles.length + " ressources publiées, liens locaux et identifiants contrôlés.");
