const assert = require("node:assert/strict");
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const root = path.resolve(__dirname, "..", "dist");
const mime = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json" };
const contract = (n) => ({ contract_uid: "U" + n, object: "Marché de test " + n + " <b>gras</b>", awarded_on: "2026-11-1" + (n % 9), kind: "travaux", procedure: "Procédure adaptée", cpv: "45214200", amount: 100000 + n,
  amount_flag: n === 1 ? "suspect" : "normal", offers_received: 3, duration_months: 12, subcontracting_declared: n % 2 === 0, buyer_name: "Mairie " + n, buyer_commune: "Alençon", buyer_dept: "61",
  winners: "Alpha " + n + " · Beta", winner_count: 2, email: "fuite@example.fr" });
const winner = (n) => ({ winner_id: "W" + n, winner_name: "Entreprise " + n, winner_category: "PME", winner_commune: "Caen", winner_dept: "14", contracts: 5 - (n % 3), median_amount: 70000 });
(async () => {
  const server = http.createServer((req, res) => {
    const file = path.join(root, decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/^\/$/, "/index.html"));
    if (!file.startsWith(root) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { "content-type": mime[path.extname(file)] || "application/octet-stream" }); res.end(fs.readFileSync(file));
  });
  await new Promise((r) => server.listen(4177, "127.0.0.1", r));
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const calls = []; const winnerCalls = []; let mode = "full"; let metaMode = "full";
    const json = (route, body, status = 200) => route.fulfill({ status, contentType: "application/json", body: typeof body === "string" ? body : JSON.stringify(body) });
    await page.route("**/rest/v1/rpc/awarded_contracts_meta", (route) => metaMode === "empty"
      ? json(route, [{ contracts: 0, winners: 0, buyers: 0, oldest: null, newest: null, loaded_at: null }])
      : json(route, [{ contracts: 1234, winners: 800, buyers: 300, oldest: "2026-05-21", newest: "2026-11-20", loaded_at: "2026-11-21T04:00:00Z" }]));
    await page.route("**/rest/v1/rpc/list_awarded_contracts", async (route) => {
      const body = JSON.parse(route.request().postData() || "{}"); calls.push({ body, headers: route.request().headers() });
      if (mode === "error") return json(route, "boom", 500);
      if (mode === "empty") return json(route, []);
      if (mode === "twenty") return json(route, Array.from({ length: body.p_offset === 0 ? 11 : 10 }, (_, i) => contract(body.p_offset + i)));
      return json(route, Array.from({ length: body.p_offset === 0 ? 11 : 3 }, (_, i) => contract(body.p_offset + i)));
    });
    await page.route("**/rest/v1/rpc/top_awarded_winners", async (route) => {
      const body = JSON.parse(route.request().postData() || "{}"); winnerCalls.push(body);
      return json(route, Array.from({ length: 4 }, (_, i) => winner(i)));
    });
    await page.goto("http://127.0.0.1:4177/marches-attribues.html", { waitUntil: "domcontentloaded" });
    await page.locator(".marche-card").first().waitFor({ timeout: 10000 });
    assert.equal(await page.locator(".marche-card").count(), 10, "Dix marchés par page.");
    assert.equal(await page.locator("#marches-plus").isVisible(), true);
    assert.equal(await page.locator(".marche-card b").count(), 0, "Le texte des marchés ne doit jamais être interprété comme du HTML.");
    assert.doesNotMatch(await page.locator("#marches-liste").innerHTML(), /fuite@example/, "Aucune coordonnée affichée.");
    assert.match(await page.locator("#marches-meta").textContent(), /1\s?234 marchés attribués.*du 21\/05\/2026 au 20\/11\/2026.*Dernier chargement le 21\/11\/2026/, "Transparence : période et date de chargement.");
    assert.match(await page.locator(".marche-card").nth(1).textContent(), /montant à vérifier/, "Un montant suspect doit être signalé.");
    assert.ok((await page.locator(".marche-badge").count()) > 0, "La sous-traitance déclarée doit être signalée.");
    assert.equal(calls[0].body.p_limit, 11);
    assert.equal(calls[0].body.p_months, 6);
    assert.ok(calls[0].headers.apikey.startsWith("sb_publishable_"), "Clé publique seulement.");
    assert.equal(calls[0].headers.authorization, undefined);
    await page.locator("#marches-plus").click();
    await page.waitForFunction(() => document.querySelectorAll(".marche-card").length === 13);
    assert.equal(calls.at(-1).body.p_offset, 10);
    assert.equal(await page.locator("#marches-plus").isVisible(), false);
    await page.selectOption("#marches-secteur", "45");
    await page.waitForFunction(() => document.querySelectorAll(".marche-card").length === 10);
    assert.equal(calls.at(-1).body.p_cpv, "45");
    assert.equal(calls.at(-1).body.p_offset, 0, "Un changement de filtre repart de la première page.");
    await page.fill("#marches-department", "2a");
    await page.fill("#marches-montant", "50 000");
    await page.fill("#marches-query", "alençon");
    await page.locator("#marches-query").press("Tab");
    await page.waitForTimeout(400);
    const last = calls.at(-1).body;
    assert.equal(last.p_department, "2A"); assert.equal(last.p_min_amount, 50000); assert.equal(last.p_query, "alençon");
    // Gagnants
    await page.locator(".gagnant-card").first().waitFor({ timeout: 10000 });
    assert.equal(await page.locator(".gagnant-card").count(), 4);
    assert.equal(winnerCalls[0].p_min_contracts, 2);
    await page.fill("#gagnants-department", "14");
    await page.locator("#gagnants-department").press("Tab");
    await page.waitForTimeout(400);
    assert.equal(winnerCalls.at(-1).p_department, "14");
    // États vide et erreur : jamais de marché inventé
    mode = "empty";
    await page.selectOption("#marches-secteur", "71");
    await page.getByText(/Aucun marché attribué pour ces critères/).waitFor({ timeout: 10000 });
    assert.equal(await page.locator(".marche-card").count(), 0);
    mode = "error";
    await page.selectOption("#marches-secteur", "");
    await page.getByText(/momentanément inaccessibles/).first().waitFor({ timeout: 10000 });
    assert.equal(await page.locator(".marche-card").count(), 0);
    // Visiteur sans espace : 20 marchés au plus, puis message et bouton « Créer mon espace » à la place de « Voir plus »
    mode = "twenty";
    await page.selectOption("#marches-secteur", "45");
    await page.waitForFunction(() => document.querySelectorAll(".marche-card").length === 10);
    assert.equal(await page.locator("#marches-plus").isVisible(), true);
    await page.locator("#marches-plus").click();
    await page.waitForFunction(() => document.querySelectorAll(".marche-card").length === 20);
    assert.equal(await page.locator("#marches-plus").isVisible(), false, "Plus de « Voir plus » à 20 résultats.");
    assert.equal(await page.locator(".limite-visiteur").count(), 1);
    assert.match(await page.locator(".limite-visiteur").first().textContent(), /20 premiers résultats.*créez votre espace personnel/);
    assert.match(await page.locator(".limite-visiteur a").first().getAttribute("href"), /^espace-membre\.html#creation$/);
    // Données pas encore chargées : message honnête
    metaMode = "empty";
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByText(/ne sont pas encore chargés/).waitFor({ timeout: 10000 });
    console.log("TEST MARCHÉS ATTRIBUÉS RÉUSSI : pagination, limite de 20 pour les visiteurs, filtres, texte non interprété, aucune coordonnée, transparence (période et date), montant à vérifier, sous-traitance, gagnants, états vide et erreur.");
  } finally { await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
