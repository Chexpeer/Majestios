const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
const pages = fs.readdirSync(root).filter((name) => name.endsWith(".html"));
const buildSource = fs.readFileSync(path.join(root, "build.js"), "utf8");
const manifestMatch = buildSource.match(/const siteFiles = \[([\s\S]*?)\];/);
const siteFiles = manifestMatch ? [...manifestMatch[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]) : [];
const exists = (file) => fs.existsSync(path.join(root, file));

assert(Boolean(manifestMatch), "Build : manifeste siteFiles introuvable");
assert(new Set(siteFiles).size === siteFiles.length, "Build : fichiers dupliqués dans le manifeste");
for (const file of siteFiles) assert(exists(file), "Build : ressource déclarée absente : " + file);
for (const page of pages) assert(siteFiles.includes(page), "Build : page HTML absente du manifeste : " + page);

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
for (const id of ["feed-search", "feed-sector", "feed-market-type", "feed-region"]) {
  assert(home.includes('id="' + id + '"'), "Accueil : filtre absent : #" + id);
}
assert(home.includes('id="floor-rows"'), "Accueil : immeuble interactif absent");

if (errors.length) {
  console.error("Vérification du site échouée : " + errors.length + " problème(s).\n- " + errors.join("\n- "));
  process.exit(1);
}
console.log("Site vérifié : " + pages.length + " pages HTML, " + siteFiles.length + " ressources publiées, liens locaux et identifiants contrôlés.");
