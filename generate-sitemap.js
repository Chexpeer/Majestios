// Génère sitemap.xml à partir des pages publiques (hors espaces privés et pages noindex).
// Domaine : variable SITE_URL ; valeur provisoire = domaine de production Vercel actuel, à remplacer dès qu'un domaine canonique est arrêté.
const fs = require("node:fs"), path = require("node:path");
const { resolveFile, listPages } = require("./chemins-site.cjs");
const site = (process.env.SITE_URL || "https://majestios.vercel.app").replace(/\/$/, "");
const priv = new Set(["admin-recherches.html", "administration.html", "crm.html", "espace-interne.html", "espace-membre.html", "espace-prive.html", "resultats-recherche.html"]);
const pages = listPages(__dirname).filter(p => !priv.has(p.name) && !/noindex/.test(fs.readFileSync(path.join(__dirname, p.source), "utf8"))).map(p => p.name).sort();
const urls = pages.map(f => `  <url><loc>${site}/${f === "index.html" ? "" : f}</loc></url>`).join("\n");
fs.writeFileSync(path.join(__dirname, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
console.log("sitemap.xml généré : " + pages.length + " pages, domaine " + site);
