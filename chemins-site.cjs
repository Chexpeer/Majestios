// Rangement des pages : les sources HTML peuvent être rangées dans pages/<famille>/ ;
// le site publié garde exactement les mêmes adresses (à plat). Ce module est la seule règle de correspondance,
// partagée par le build, les gardes de vérification et les tests.
const fs = require("node:fs");
const path = require("node:path");

const PAGES_DIR = "pages";

// Adresse publiée d'un fichier source (« pages/rubriques/x.html » → « x.html » ; tout autre chemin reste identique).
function publishedPath(file) {
  const m = /^pages\/[^/]+\/([^/]+\.html)$/.exec(String(file).replace(/\\/g, "/"));
  return m ? m[1] : String(file).replace(/\\/g, "/");
}

// Pages HTML du site : à la racine et dans pages/<famille>/. Retourne [{ name, source }] (name = adresse publiée).
function listPages(root) {
  const list = fs.readdirSync(root).filter((f) => f.endsWith(".html")).map((f) => ({ name: f, source: f }));
  const dir = path.join(root, PAGES_DIR);
  if (fs.existsSync(dir)) {
    for (const family of fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory())) {
      for (const f of fs.readdirSync(path.join(dir, family.name)).filter((n) => n.endsWith(".html"))) {
        list.push({ name: f, source: PAGES_DIR + "/" + family.name + "/" + f });
      }
    }
  }
  const seen = new Set();
  for (const p of list) {
    if (seen.has(p.name)) throw new Error("Page publiée en double : " + p.name);
    seen.add(p.name);
  }
  return list.sort((a, b) => a.name.localeCompare(b.name));
}

// Chemin réel d'un fichier désigné par son adresse publiée (« /x.html », « x.html », « visuels/y.webp »).
// Si une page n'est pas à la racine, on la cherche dans pages/<famille>/. Sans correspondance : chemin racine (inexistant).
function resolveFile(root, relative) {
  const rel = String(relative).replace(/^\/+/, "");
  const direct = path.join(root, rel);
  if (fs.existsSync(direct) || !/^[^/]+\.html$/.test(rel)) return direct;
  const found = listPages(root).find((p) => p.name === rel);
  return found ? path.join(root, found.source) : direct;
}

module.exports = { PAGES_DIR, publishedPath, listPages, resolveFile };
