const assert = require("node:assert/strict");
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const root = path.resolve(__dirname, "..", "dist");
const mime = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json" };
(async () => {
  const server = http.createServer((req, res) => {
    const file = path.join(root, decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/^\/$/, "/index.html"));
    if (!file.startsWith(root) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { "content-type": mime[path.extname(file)] || "application/octet-stream" }); res.end(fs.readFileSync(file));
  });
  await new Promise((r) => server.listen(4175, "127.0.0.1", r));
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const sent = [];
    await page.route("**/rest/v1/rpc/submit_announcement", async (route) => {
      sent.push({ headers: route.request().headers(), body: JSON.parse(route.request().postData() || "{}") });
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify("AN-TEST0001") });
    });
    await page.goto("http://127.0.0.1:4175/sous-traitance.html", { waitUntil: "domcontentloaded" });
    await page.locator("#annonce-kind option").nth(2).waitFor({ state: "attached", timeout: 10000 });
    await page.locator('a[data-annonce-kind="subcontract_offer"]').click();
    assert.equal(await page.locator("#annonce-kind").inputValue(), "subcontract_offer", "Le bouton doit préremplir le type d’annonce.");
    await page.locator("#annonce-form button[type=submit]").click();
    assert.match(await page.locator("#annonce-feedback").textContent(), /titre/i, "Une saisie vide doit être refusée avec des messages.");
    await page.fill("#annonce-title", "Équipe carreleurs disponible");
    await page.fill("#annonce-description", "Deux carreleurs expérimentés disponibles dès avril sur le Grand Ouest, carrelage et faïence. Appelez le 06 12 34 56 78.");
    await page.fill("#annonce-trade", "Carrelage");
    await page.fill("#annonce-contact", "Luc Bernard");
    await page.fill("#annonce-email", "luc@example.fr");
    await page.check('input[name="consent"]');
    await page.locator("#annonce-form button[type=submit]").click();
    assert.match(await page.locator("#annonce-feedback").textContent(), /ni lien, ni adresse e-mail, ni numéro/, "Un numéro de téléphone dans le texte public doit être refusé.");
    await page.fill("#annonce-description", "Deux carreleurs expérimentés disponibles dès avril sur le Grand Ouest, carrelage et faïence.");
    await page.locator("#annonce-form button[type=submit]").click();
    await page.getByText(/enregistrée et sera relue/).waitFor({ timeout: 10000 });
    assert.equal(sent.length, 1, "Une seule requête de dépôt doit partir.");
    const { headers, body } = sent[0];
    assert.equal(body.p_kind, "subcontract_offer");
    assert.equal(body.p_email, "luc@example.fr");
    assert.equal(body.p_consent, true);
    assert.equal(body.p_website, null, "Le champ piège doit rester vide pour un humain.");
    assert.ok(body.p_notice_version, "La version de l’avis doit être transmise.");
    assert.ok(headers.apikey && headers.apikey.startsWith("sb_publishable_"), "Seule la clé publique doit être utilisée.");
    assert.equal(headers.authorization, undefined, "Aucun en-tête d’autorisation n’est nécessaire avec la clé publique.");
    assert.equal(await page.locator("#annonce-title").inputValue(), "", "Le formulaire doit être vidé après dépôt.");
    console.log("TEST ANNONCES RÉUSSI : préremplissage, validation, refus des coordonnées dans le texte, dépôt vers la bonne cible avec la clé publique seulement.");
  } finally { await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
