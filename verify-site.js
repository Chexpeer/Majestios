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
    if (!value || value.startsWith("#") || /^(?:[a-z]+:|\/\/)/i.test(value) || value.startsWith("data:")) continue;

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

if (errors.length) {
  console.error(`Vérification échouée : ${errors.length} problème(s) sur ${pages.length} pages.\n- ${errors.join("\n- ")}`);
  process.exitCode = 1;
} else {
  console.log(`Vérification structurelle réussie : ${pages.length} pages HTML, ${references} références locales contrôlées, aucune ancre locale manquante détectée.`);
}
