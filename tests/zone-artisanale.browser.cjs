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

    // Le deuxième niveau des marchés privés doit conduire au suivi des affaires.
    await page.locator('#map-buildings .map-building[data-id="B02"]').click();
    assert.equal((await page.locator("#panel-title").innerText()).trim(), "Marchés privés", "La sélection B02 doit afficher Marchés privés.");
    assert.match(await page.locator("#floor-list .floor-link").nth(2).getAttribute("href"), /suivi-commercial\.html$/, "Le parcours « Suivi des affaires · Relances » doit ouvrir le suivi commercial.");

    // Contrat navigateur complet : les 12 bâtiments affichent leur rubrique et leurs deux destinations secondaires.
    const routeContracts = [
      ["B01", "Marchés publics", "marches-publics.html", "accompagnement-appels-offres.html", "veille-marches.html"],
      ["B02", "Marchés privés", "marches-prives.html", "sous-traitance.html", "suivi-commercial.html"],
      ["B03", "Développement commercial", "developpement-commercial.html", "prospection-inversee.html", "suivi-commercial.html"],
      ["B04", "Prospection inversée", "prospection-inversee.html", "intelligence-economique.html", "developpement-commercial.html"],
      ["B05", "Intelligence économique", "intelligence-economique.html", "veille-marches.html", "bodacc-veille-entreprises.html"],
      ["B06", "Réseaux et synergies", "reseaux-synergies.html", "salons-seminaires.html", "sous-traitance.html"],
      ["B07", "Veille des marchés", "veille-marches.html", "marches-publics.html", "accompagnement-appels-offres.html"],
      ["B08", "Accompagnement aux appels d'offres", "accompagnement-appels-offres.html", "marches-publics.html", "marches-prives.html"],
      ["B09", "Sous-traitance et débordement de marchés", "sous-traitance.html", "marches-prives.html", "reseaux-synergies.html"],
      ["B10", "Salons et séminaires", "salons-seminaires.html", "reseaux-synergies.html", "developpement-commercial.html"],
      ["B11", "Veille des entreprises — BODACC", "bodacc-veille-entreprises.html", "prospection-inversee.html", "intelligence-economique.html"],
      ["B12", "Suivi commercial et capitalisation", "suivi-commercial.html", "developpement-commercial.html", "intelligence-economique.html"]
    ];
    for (const [id, expectedTitle, mainRoute, firstRoute, secondRoute] of routeContracts) {
      await page.locator(`#map-buildings .map-building[data-id="${id}"]`).click();
      assert.equal((await page.locator("#panel-title").innerText()).trim(), expectedTitle, `${id} doit afficher son intitulé exact.`);
      assert.ok((await page.locator("#open-building").getAttribute("href")).endsWith(mainRoute), `${id} doit ouvrir ${mainRoute}.`);
      assert.ok((await page.locator("#floor-list .floor-link").nth(1).getAttribute("href")).endsWith(firstRoute), `${id} : premier parcours secondaire attendu ${firstRoute}.`);
      assert.ok((await page.locator("#floor-list .floor-link").nth(2).getAttribute("href")).endsWith(secondRoute), `${id} : second parcours secondaire attendu ${secondRoute}.`);
    }

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

    // Le formulaire doit transmettre les critères à la page dédiée de la catégorie choisie.
    await page.locator("#feed-search").fill("rénovation énergétique");
    await page.locator("#feed-sector").selectOption("renovation");
    await page.locator("#feed-market-type").selectOption("private");
    await page.locator("#feed-region").selectOption("all");
    await Promise.all([
      page.waitForURL(/categorie-renovation\.html\?/),
      page.locator("#advanced-search-form button[type='submit']").click()
    ]);
    assert.match(page.url(), /q=r%C3%A9novation\+%C3%A9nerg%C3%A9tique|q=r%C3%A9novation%20%C3%A9nerg%C3%A9tique/, "Le mot-clé doit être conservé dans l'URL.");
    assert.match(page.url(), /categorie=renovation/, "La catégorie doit être conservée dans l'URL.");
    assert.match(page.url(), /marche=private/, "Le type de marché doit être conservé dans l'URL.");
    assert.match((await page.locator("#category-results-title").innerText()), /Rénovation/, "La page de résultats doit afficher la catégorie choisie.");
    assert.match((await page.locator(".floating-route-card").innerText()), /Aucune annonce réelle n’est actuellement chargée/, "La page doit signaler explicitement l'absence de données réelles.");

    // Sans catégorie spécifique, les critères doivent aller au récapitulatif général.
    await page.goto("http://127.0.0.1:4173/", { waitUntil: "domcontentloaded" });
    await page.locator("#feed-search").fill("maintenance préventive");
    await page.locator("#feed-sector").selectOption("all");
    await page.locator("#feed-market-type").selectOption("public");
    await page.locator("#feed-region").selectOption("ouest");
    await Promise.all([
      page.waitForURL(/resultats-recherche\.html\?/),
      page.locator("#advanced-search-form button[type='submit']").click()
    ]);
    assert.match(page.url(), /q=maintenance\+pr%C3%A9ventive|q=maintenance%20pr%C3%A9ventive/, "Le mot-clé de recherche générale doit être conservé.");
    assert.match(page.url(), /marche=public/, "Le filtre public doit être conservé.");
    assert.match(page.url(), /zone=ouest/, "La zone sélectionnée doit être conservée.");
    assert.match((await page.locator("#search-active-filters").innerText()), /maintenance préventive[\s\S]*Marchés publics[\s\S]*Ouest/i, "Le récapitulatif doit présenter les critères choisis.");
    assert.match((await page.locator("#search-results-panel").innerText()), /Aucune annonce réelle n'est actuellement chargée/, "Les résultats généraux doivent distinguer la recherche des annonces réellement disponibles.");
    assert.deepEqual(pageErrors, [], "Aucune erreur JavaScript non interceptée n'est attendue.");

    console.log("TEST NAVIGATEUR RÉUSSI : modes Apache/Tesla/GPS, 12 destinations, sélection, affichage mobile et transmission des critères de recherche.");
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
