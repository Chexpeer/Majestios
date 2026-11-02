const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..", "dist");
const expected = {
  "Marchés publics": "marches-publics.html",
  "Marchés privés": "marches-prives.html",
  "Veille économique": "bodacc-veille-entreprises.html",
  "Prospection active": "prospection-active.html",
  "Développement commercial": "developpement-commercial.html",
  "Accompagnement aux appels d’offres": "accompagnement-appels-offres.html",
  "Salon virtuel": "salons-seminaires.html",
  "Espace entreprises": "espace-membre.html",
  "CRM": "crm.html",
  "Business Intelligence": "intelligence-economique.html"
};
const mime = { ".html":"text/html; charset=utf-8", ".css":"text/css; charset=utf-8", ".js":"text/javascript; charset=utf-8" };

async function main() {
  assert.ok(fs.existsSync(path.join(root, "index.html")), "Exécuter node build.js avant le test.");
  const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, "http://127.0.0.1").pathname);
    const requested = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
    const file = path.resolve(root, requested);
    if (!file.startsWith(root + path.sep) && file !== path.join(root, "index.html")) return res.writeHead(403).end("Forbidden");
    fs.readFile(file, (error, data) => {
      if (error) return res.writeHead(404).end("Not found");
      res.writeHead(200, { "content-type": mime[path.extname(file)] || "application/octet-stream" });
      res.end(data);
    });
  });
  await new Promise((resolve) => server.listen(4173, "127.0.0.1", resolve));
  let browser;
  try {
    browser = await chromium.launch({ headless:true, args:["--no-sandbox"] });
    const page = await browser.newPage({ viewport:{ width:1365, height:900 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("http://127.0.0.1:4173/", { waitUntil:"domcontentloaded" });
    const rows = page.locator(".floor-row");
    await rows.first().waitFor({ state:"visible", timeout:15000 });
    assert.equal(await rows.count(), 10, "L’immeuble interactif doit présenter exactement dix étages.");
    const observed = await rows.evaluateAll(nodes => nodes.map(node => ({
      name: node.querySelector(".floor-name")?.textContent?.trim(),
      href: new URL(node.href).pathname.split("/").pop()
    })));
    assert.equal(new Set(observed.map(x => x.name)).size, 10, "Les noms d’étage doivent être uniques.");
    for (const [name, route] of Object.entries(expected)) {
      const row = page.locator(".floor-row").filter({ hasText:name });
      assert.equal(await row.count(), 1, "L’étage " + name + " doit apparaître une seule fois.");
      assert.equal(await row.getAttribute("href"), route, "Destination incorrecte pour " + name);
      await Promise.all([
        page.waitForURL((url) => url.pathname.endsWith("/" + route), { timeout:10000 }),
        row.click()
      ]);
      assert.ok(page.url().endsWith("/" + route), "Le clic sur " + name + " doit ouvrir " + route);
      await page.goto("http://127.0.0.1:4173/", { waitUntil:"domcontentloaded" });
    }
    for (const item of observed) {
      assert.ok(Object.prototype.hasOwnProperty.call(expected, item.name), "Étage inattendu : " + item.name);
      assert.equal(item.href, expected[item.name], "Destination incorrecte pour " + item.name);
    }
    assert.deepEqual(errors, [], "Aucune erreur JavaScript n’est attendue sur l’accueil.");
    console.log("TEST NAVIGATEUR RÉUSSI : immeuble interactif, dix étages et dix destinations métier vérifiés.");
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
