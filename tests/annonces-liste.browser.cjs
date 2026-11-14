const assert = require("node:assert/strict");
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const root = path.resolve(__dirname, "..", "dist");
const mime = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json" };
const row = (n, extra = {}) => ({ reference: "AN-" + String(10000000 + n), kind: n % 2 ? "subcontract_offer" : "subcontract_need", title: "Annonce de test " + n, description: "Description de l’annonce " + n + " <b>non interprétée</b>", trade: "Plâtrerie", department: "35", area_note: "Rennes", valid_until: "2026-12-31", published_at: "2026-11-14T10:00:00Z", ...extra });
(async () => {
  const server = http.createServer((req, res) => {
    const file = path.join(root, decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/^\/$/, "/index.html"));
    if (!file.startsWith(root) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { "content-type": mime[path.extname(file)] || "application/octet-stream" }); res.end(fs.readFileSync(file));
  });
  await new Promise((r) => server.listen(4176, "127.0.0.1", r));
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const listCalls = []; const intros = []; let mode = "full";
    await page.route("**/rest/v1/rpc/list_published_announcements", async (route) => {
      const body = JSON.parse(route.request().postData() || "{}"); listCalls.push(body);
      if (mode === "error") { await route.fulfill({ status: 500, body: "boom" }); return; }
      if (mode === "empty") { await route.fulfill({ status: 200, contentType: "application/json", body: "[]" }); return; }
      const rows = Array.from({ length: body.p_offset === 0 ? 11 : 3 }, (_, i) => row(body.p_offset + i, { email: "fuite@example.fr", phone: "0600000000" }));
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(rows) });
    });
    await page.route("**/rest/v1/rpc/request_announcement_introduction", async (route) => {
      intros.push({ headers: route.request().headers(), body: JSON.parse(route.request().postData() || "{}") });
      await route.fulfill({ status: 200, contentType: "application/json", body: "true" });
    });
    await page.goto("http://127.0.0.1:4176/marches-prives.html", { waitUntil: "domcontentloaded" });
    await page.locator(".annonce-card").first().waitFor({ timeout: 10000 });
    assert.equal(await page.locator(".annonce-card").count(), 10, "Dix annonces par page.");
    assert.equal(await page.locator("#annonces-plus").isVisible(), true, "Le bouton « Voir plus » doit apparaître quand il reste des annonces.");
    assert.equal(await page.locator(".annonce-card b").count(), 0, "Le texte des annonces ne doit jamais être interprété comme du HTML.");
    const html = await page.locator("#annonces-liste").innerHTML();
    assert.doesNotMatch(html, /fuite@example|0600000000/, "Aucune coordonnée ne doit être affichée.");
    assert.equal(listCalls[0].p_limit, 11);
    await page.locator("#annonces-plus").click();
    await page.waitForFunction(() => document.querySelectorAll(".annonce-card").length === 13);
    assert.equal(listCalls[1].p_offset, 10, "La page suivante doit demander le bon décalage.");
    assert.equal(await page.locator("#annonces-plus").isVisible(), false);
    await page.selectOption("#annonces-kind", "subcontract_offer");
    await page.waitForFunction(() => document.querySelectorAll(".annonce-card").length === 10);
    assert.equal(listCalls.at(-1).p_kind, "subcontract_offer", "Le filtre de type doit être transmis au serveur.");
    assert.equal(listCalls.at(-1).p_offset, 0, "Un changement de filtre repart de la première page.");
    await page.fill("#annonces-department", "2a");
    await page.locator("#annonces-department").press("Tab");
    await page.waitForFunction(() => /annonce\(s\) affichée\(s\)/.test(document.querySelector("#annonces-statut").textContent));
    await page.waitForTimeout(200);
    assert.equal(listCalls.at(-1).p_department, "2A", "Un changement de filtre pendant un chargement ne doit pas être perdu.");

    // Mise en relation : validée côté navigateur, envoyée avec la clé publique seulement.
    const first = page.locator(".annonce-card").first();
    await first.locator("summary").click();
    await first.locator('button[type="submit"]').click();
    assert.match(await first.locator(".annonce-feedback").textContent(), /nom|e-mail|message|accepter/i, "Une demande vide doit être refusée.");
    await first.locator('input[name="name"]').fill("Sophie Durand");
    await first.locator('input[name="email"]').fill("sophie@example.fr");
    await first.locator('textarea[name="message"]').fill("Bonjour, nous sommes plaquistes sur Rennes et disponibles en mars.");
    await first.locator('input[name="consent"]').check();
    await first.locator('button[type="submit"]').click();
    await page.getByText(/Votre demande est transmise/).waitFor({ timeout: 10000 });
    assert.equal(intros.length, 1);
    assert.match(intros[0].body.p_reference, /^AN-\d{8}$/);
    assert.equal(intros[0].body.p_consent, true);
    assert.equal(intros[0].body.p_website, null);
    assert.ok(intros[0].headers.apikey.startsWith("sb_publishable_"));
    assert.equal(intros[0].headers.authorization, undefined);

    // États vides et erreurs : jamais d'annonce inventée.
    mode = "empty";
    await page.selectOption("#annonces-kind", "subcontract_need");
    await page.getByText(/Aucune annonce publiée pour ces critères/).waitFor({ timeout: 10000 });
    assert.equal(await page.locator(".annonce-card").count(), 0);
    mode = "error";
    await page.selectOption("#annonces-kind", "");
    await page.getByText(/momentanément inaccessibles/).waitFor({ timeout: 10000 });
    assert.equal(await page.locator(".annonce-card").count(), 0);
    console.log("TEST LISTE ANNONCES RÉUSSI : pagination, filtres, texte non interprété, aucune coordonnée, mise en relation avec clé publique, états vide et erreur.");
  } catch (e) { throw e; } finally { await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
