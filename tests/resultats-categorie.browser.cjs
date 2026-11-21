// Les résultats d'appels d'offres publics (BOAMP) des pages de catégorie doivent être VISIBLES et LISIBLES.
// Régression constatée : le bloc des résultats était masqué par une règle de mise en page, puis le texte était blanc sur fond clair.
const assert = require("node:assert/strict");
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const root = path.resolve(__dirname, "..", "dist");
const mime = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".png": "image/png", ".json": "application/json" };
const rec = (i) => ({ idweb: "26-" + i, id: "26-" + i, objet: "Travaux, conseil, étude, audit, informatique, bâtiment, rénovation, électricité, plomberie, maintenance, nettoyage de la salle des fêtes " + i, famille_libelle: "MAPA", dateparution: "2026-11-17", datelimitereponse: "2026-12-20T12:00:00+00:00", nomacheteur: "Commune de Test " + i, code_departement: ["72"], type_marche: ["TRAVAUX","SERVICES"], type_avis: ["APPEL_OFFRE"], descripteur_libelle: ["Bâtiment"], etat: "INITIAL", url_avis: "https://www.boamp.fr/avis/detail/26-" + i });
const luminance = (css) => { const [r, g, b] = css.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number); return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; };
(async () => {
  const server = http.createServer((req, res) => {
    const file = path.join(root, decodeURIComponent(new URL(req.url, "http://x").pathname));
    if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { "content-type": mime[path.extname(file)] || "application/octet-stream" }); res.end(fs.readFileSync(file));
  }).listen(0);
  const origin = "http://127.0.0.1:" + server.address().port;
  const browser = await chromium.launch();
  try {
    const pages = fs.readdirSync(root).filter((f) => /^categorie-.*\.html$/.test(f));
    assert.ok(pages.length >= 8, "Les pages de catégorie doivent exister.");
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.route("**/*opendatasoft*/**", (r) => r.fulfill({ status: 200, contentType: "application/json", headers: { "access-control-allow-origin": "*" }, body: JSON.stringify({ total_count: 2, results: [rec(1), rec(2)] }) }));
    for (const file of pages) {
      await page.goto(origin + "/" + file);
      await page.waitForFunction(() => document.querySelectorAll(".opportunity-result-card").length > 0, null, { timeout: 8000 }).catch(() => {});
      const info = await page.evaluate(() => [...document.querySelectorAll(".opportunity-result-card")].map((c) => {
        const r = c.getBoundingClientRect(), h = c.querySelector("h3");
        return { height: r.height, display: getComputedStyle(c).display, color: getComputedStyle(h).color, bg: getComputedStyle(c.closest(".category-results-panel")).backgroundColor };
      }));
      assert.ok(info.length > 0, file + " : aucun résultat affiché dans la page.");
      for (const c of info) {
        assert.ok(c.height > 40 && c.display !== "none", file + " : un résultat est masqué.");
        assert.ok(luminance(c.bg) < 0.5 || luminance(c.color) < 0.5, file + " : texte clair sur fond clair (illisible) " + c.color + " / " + c.bg);
      }
    }
    console.log("Résultats d’appels d’offres publics : visibles et lisibles sur " + pages.length + " pages de catégorie.");
  } finally { await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
