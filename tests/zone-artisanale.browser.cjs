const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..", "dist");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

async function main() {
  assert.ok(fs.existsSync(path.join(root, "index.html")), "dist/index.html doit exister : exécuter node build.js avant le test.");

  const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, "http://127.0.0.1").pathname);
    const requested = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
    const file = path.resolve(root, requested);
    if (!file.startsWith(root + path.sep) && file !== path.join(root, "index.html")) {
      res.writeHead(403).end("Forbidden");
      return;
    }
    fs.readFile(file, (error, data) => {
      if (error) {
        res.writeHead(404).end("Not found");
        return;
      }
      res.writeHead(200, { "content-type": mime[path.extname(file)] || "application/octet-stream" });
      res.end(data);
    });
  });

  await new Promise((resolve) => server.listen(4173, "127.0.0.1", resolve));
  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--enable-webgl", "--use-gl=angle", "--use-angle=swiftshader"]
    });
    const page = await browser.newPage({ viewport: { width: 1365, height: 900 } });
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto("http://127.0.0.1:4173/", { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.locator('[data-scene-mode="map"]').click();
    await page.locator("#map-buildings .map-building").first().waitFor({ state: "visible", timeout: 30000 });

    assert.equal(await page.locator('[data-scene-mode="map"]').getAttribute("aria-pressed"), "true", "Le mode GPS doit être activé.");
    assert.equal(await page.locator("#zone-map").isVisible(), true, "La carte GPS doit s'afficher.");
    assert.equal(await page.locator("#map-buildings .map-building").count(), 12, "La carte doit proposer les 12 rubriques.");

    await page.locator('#map-buildings .map-building[data-id="B01"]').click();
    assert.equal((await page.locator("#panel-title").innerText()).trim(), "Marchés publics", "Le choix sur la carte doit sélectionner la bonne rubrique.");
    assert.match(await page.locator("#open-building").getAttribute("href"), /marches-publics\.html$/, "Le bouton de destination doit mener à la page de la rubrique.");

    await page.locator('[data-scene-mode="drive"]').click();
    assert.equal(await page.locator('[data-scene-mode="drive"]').getAttribute("aria-pressed"), "true", "Le mode Tesla doit être activé.");
    assert.equal(await page.locator("#scene").getAttribute("data-view-mode"), "drive", "La scène doit passer en mode conduite.");
    assert.equal(await page.locator("#zone-map").isVisible(), false, "La carte GPS doit se masquer en mode conduite.");

    await page.locator('[data-scene-mode="fly"]').click();
    assert.equal(await page.locator('[data-scene-mode="fly"]').getAttribute("aria-pressed"), "true", "Le mode Apache doit être activé.");
    assert.equal(await page.locator("#scene").getAttribute("data-view-mode"), "fly", "La scène doit revenir en mode survol.");

    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('[data-scene-mode="map"]').click();
    assert.equal(await page.locator("#zone-map").isVisible(), true, "La carte doit rester accessible sur un écran mobile.");
    assert.equal(await page.locator("#map-buildings .map-building").count(), 12, "Les 12 destinations doivent rester présentes sur mobile.");
    assert.deepEqual(pageErrors, [], "Aucune erreur JavaScript non interceptée n'est attendue.");

    console.log("TEST NAVIGATEUR RÉUSSI : modes Apache/Tesla/GPS, 12 destinations, sélection et lien de rubrique, affichage mobile.");
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
