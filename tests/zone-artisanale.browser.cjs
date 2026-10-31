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

async function assertMapCardsDoNotOverlap(page, label) {
  const boxes = await page.locator("#map-buildings .map-building").evaluateAll(nodes =>
    nodes.map(node => {
      const r = node.getBoundingClientRect();
      return { id: node.dataset.id, left: r.left, top: r.top, right: r.right, bottom: r.bottom };
    })
  );
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], b = boxes[j];
      const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      assert.ok(!(overlapX > 1 && overlapY > 1), `${label}: les cartes ${a.id} et ${b.id} ne doivent pas se chevaucher.`);
    }
  }
}

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

    assert.equal(await page.locator('[data-scene-mode="map"]').getAttribute("aria-pressed"), "true", "Le mode Carte interactive doit être activé.");
    assert.equal(await page.locator("#zone-map").isVisible(), true, "La carte Carte interactive doit s'afficher.");
    assert.equal(await page.locator("#map-buildings .map-building").count(), 12, "La carte doit proposer les 12 rubriques.");
    await assertMapCardsDoNotOverlap(page, "Carte ordinateur");
    assert.equal((await page.locator('[data-scene-mode="drive"]').innerText()).trim(), "Street View", "Le mode routier doit être présenté comme Street View.");
    assert.equal((await page.locator('[data-scene-mode="map"]').innerText()).trim(), "Carte interactive", "Le mode Carte interactive doit être présenté comme Carte interactive.");
    assert.ok((await page.locator(".map-header").innerText()).includes("CARTE INTERACTIVE"), "La carte doit afficher son intitulé.");
    assert.equal(await page.locator(".map-parking").count(), 2, "La carte doit représenter deux zones de stationnement.");
    assert.equal(await page.locator(".map-green").count(), 2, "La carte doit représenter des espaces verts.");

    // Les noms et les détails doivent être visibles directement sur la Carte interactive.
    assert.ok((await page.locator('#map-buildings .map-building[data-id="B01"]').innerText()).includes("Marchés publics"), "Le bâtiment B01 doit afficher son nom sur la carte Carte interactive.");

    // Contrat navigateur complet : les 12 bâtiments ouvrent directement leur rubrique métier.
    const routeContracts = [
      ["B01", "Marchés publics", "marches-publics.html"],
      ["B02", "Marchés privés", "marches-prives.html"],
      ["B03", "Développement commercial", "developpement-commercial.html"],
      ["B04", "Prospection inversée", "prospection-inversee.html"],
      ["B05", "Intelligence économique", "intelligence-economique.html"],
      ["B06", "Réseaux et synergies", "reseaux-synergies.html"],
      ["B07", "Veille des marchés", "veille-marches.html"],
      ["B08", "Accompagnement aux appels d'offres", "accompagnement-appels-offres.html"],
      ["B09", "Sous-traitance et débordement de marchés", "sous-traitance.html"],
      ["B10", "Salons et séminaires", "salons-seminaires.html"],
      ["B11", "Veille des entreprises — BODACC", "bodacc-veille-entreprises.html"],
      ["B12", "Suivi commercial et capitalisation", "suivi-commercial.html"]
    ];
    for (const [id, expectedTitle, mainRoute] of routeContracts) {
      console.log(`[carte] Vérification ${id} — ${expectedTitle}`);
      await page.goto("http://127.0.0.1:4173/", { waitUntil: "domcontentloaded", timeout: 15000 });
      await page.locator('[data-scene-mode="map"]').click({ timeout: 10000 });
      const building = page.locator(`#map-buildings .map-building[data-id="${id}"]`);
      assert.ok((await building.innerText()).includes(expectedTitle), `${id} doit afficher son nom.`);
      await Promise.all([
        page.waitForURL(url => new URL(url).pathname.endsWith(mainRoute), { timeout: 10000 }),
        building.click({ timeout: 10000 })
      ]);
      assert.ok(new URL(page.url()).pathname.endsWith(mainRoute), `${id} doit mener directement à ${mainRoute}, sans fenêtre intermédiaire.`);
    }

    // Teste les vrais gestionnaires de clic du canvas 3D, en ciblant les enseignes de toit depuis la vue aérienne.
    // Le point de projection n'est exposé que sur l'URL de test ?e2e=1.
    for (const [id, expectedTitle, mainRoute] of routeContracts) {
      console.log(`[3D] Vérification ${id} — ${expectedTitle}`);
      await page.goto("http://127.0.0.1:4173/?e2e=1", { waitUntil: "domcontentloaded", timeout: 15000 });
      // Faire entrer la scène dans le viewport : l'animation est volontairement suspendue hors écran.
      await page.locator("#scene").scrollIntoViewIfNeeded();
      // Réactiver la navigation aérienne avant d'attendre le canvas 3D.
      await page.locator('[data-scene-mode="fly"]').click();
      await page.locator("canvas").waitFor({ state: "visible", timeout: 30000 });
      await page.waitForFunction(() => Boolean(window.__MAJESTIOS_SCENE_E2E__), null, { timeout: 30000 });
      // Attendre le recentrage caméra : une durée fixe est fragile sur CI.
      await page.waitForFunction((buildingId) => {
        const point = window.__MAJESTIOS_SCENE_E2E__.buildingPoint(buildingId);
        const canvas = document.querySelector("#scene canvas");
        const rect = canvas?.getBoundingClientRect();
        return Boolean(rect && rect.width && rect.height &&
          point.x >= rect.left && point.x <= rect.right &&
          point.y >= rect.top && point.y <= rect.bottom);
      }, id, { timeout: 10000 });
      const point = await page.evaluate((buildingId) => window.__MAJESTIOS_SCENE_E2E__.buildingPoint(buildingId), id);
      const canvasBox = await page.locator("#scene canvas").boundingBox();
      assert.ok(canvasBox && point.x >= canvasBox.x && point.x <= canvasBox.x + canvasBox.width && point.y >= canvasBox.y && point.y <= canvasBox.y + canvasBox.height, `${id} doit être visible dans la zone 3D pour être testé.`);
      await Promise.all([
        page.waitForURL(url => new URL(url).pathname.endsWith(mainRoute), { timeout: 8000 }),
        page.mouse.click(point.x, point.y)
      ]);
      assert.ok(new URL(page.url()).pathname.endsWith(mainRoute), `Le clic 3D sur ${id} (${expectedTitle}) doit ouvrir directement ${mainRoute}.`);
    }

    await page.goto("http://127.0.0.1:4173/", { waitUntil: "domcontentloaded" });
    await page.locator('[data-scene-mode="drive"]').click();
    assert.equal(await page.locator('[data-scene-mode="drive"]').getAttribute("aria-pressed"), "true", "Le mode Street View doit être activé.");
    assert.equal(await page.locator("#scene").getAttribute("data-view-mode"), "drive", "La scène doit passer en mode conduite.");
    assert.equal(await page.locator("#zone-map").isVisible(), false, "La carte Carte interactive doit se masquer en mode conduite.");

    await page.locator('[data-scene-mode="fly"]').click();
    assert.equal(await page.locator('[data-scene-mode="fly"]').getAttribute("aria-pressed"), "true", "La navigation aérienne doit être activée.");
    assert.equal(await page.locator("#scene").getAttribute("data-view-mode"), "fly", "La scène doit revenir en mode survol.");

    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('[data-scene-mode="map"]').click();
    assert.equal(await page.locator("#zone-map").isVisible(), true, "La carte doit rester accessible sur un écran mobile.");
    assert.equal(await page.locator("#map-buildings .map-building").count(), 12, "Les 12 destinations doivent rester présentes sur mobile.");
    await assertMapCardsDoNotOverlap(page, "Carte mobile");

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

    console.log("TEST NAVIGATEUR RÉUSSI : navigation aérienne/Street View/carte interactive, 12 destinations, sélection, affichage mobile et transmission des critères de recherche.");
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
