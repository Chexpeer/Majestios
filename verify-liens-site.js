// Contrôle de cohérence des liens du site : fichiers, ancres, menu de repli et chargeur de navigation.
const fs = require("node:fs"), path = require("node:path");
const root = __dirname;
const pages = fs.readdirSync(root).filter(f => f.endsWith(".html"));
const ids = Object.fromEntries(pages.map(p => [p, new Set([...fs.readFileSync(path.join(root,p),"utf8").matchAll(/\bid="([^"]+)"/g)].map(m => m[1]))]));
const errors = [];
for (const p of pages) {
  const html = fs.readFileSync(path.join(root,p),"utf8");
  if (!html.includes("navigation-tiroirs.js")) errors.push(p + " : chargeur de navigation absent");
  for (const m of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const href = m[1].replace(/&amp;/g,"&");
    if (/^(https?:|mailto:|tel:|javascript:)/.test(href)) continue;
    const [target, anchor = ""] = href.split("#"); const file = (target.split("?")[0]) || p;
    if (!fs.existsSync(path.join(root,file))) { errors.push(p + " : fichier absent " + href); continue; }
    if (anchor && file.endsWith(".html") && !ids[file]?.has(anchor)) errors.push(p + " : ancre absente " + href);
  }
}
// Menu de repli (sans JavaScript) identique sur toutes les pages qui en portent un, hors accueil.
const fallbacks = new Map();
for (const p of pages.filter(p => p !== "index.html")) {
  const m = fs.readFileSync(path.join(root,p),"utf8").match(/<nav class="site-nav"[^>]*>([\s\S]*?)<\/nav>/);
  if (m) fallbacks.set(p, [...m[1].matchAll(/<a [^>]*href="([^"]+)"[^>]*>([^<]*)<\/a>/g)].map(x => x[1] + "|" + x[2]).join(","));
}
if (new Set(fallbacks.values()).size > 1) errors.push("Menu de repli non identique : " + new Set(fallbacks.values()).size + " variantes");
if (errors.length) { console.error("Cohérence des liens échouée :\n- " + errors.join("\n- ")); process.exit(1); }
console.log("Liens du site vérifiés : " + pages.length + " pages, fichiers et ancres présents, menu de repli identique.");
