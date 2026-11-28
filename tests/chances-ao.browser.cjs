// Test navigateur : « Mes chances sur un appel d'offres » (accompagnement). Réseau simulé (BOAMP, annuaire).
const assert = require("node:assert/strict");
const fs = require("node:fs"), http = require("node:http"), path = require("node:path");
const { chromium } = require("playwright");
const root = path.resolve(__dirname, "..", "dist");
const mime = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript" };
const CORS = { "access-control-allow-origin": "*" };
const jour = (n) => new Date(Date.now() + n * 86400000).toISOString();
(async () => {
  const server = http.createServer((req, res) => {
    const p = new URL(req.url, "http://x").pathname, f = path.join(root, p === "/" ? "/index.html" : p);
    if (!f.startsWith(root + path.sep)) return res.writeHead(403).end();
    fs.readFile(f, (e, d) => e ? res.writeHead(404).end() : (res.writeHead(200, { "content-type": mime[path.extname(f)] || "application/octet-stream" }), res.end(d)));
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const origin = "http://127.0.0.1:" + server.address().port;
  const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
  try {
    const page = await (await browser.newContext()).newPage();
    const errors = []; page.on("pageerror", (e) => errors.push(e.message));
    const sdk = "export function createClient(){ return { auth:{ getSession: async()=>({data:{session:null}}) } }; }";
    await page.route("https://esm.sh/**", (r) => r.fulfill({ contentType: "text/javascript", body: sdk }));
    let boampUrls = [];
    await page.route("https://boamp-datadila.opendatasoft.com/**", (r) => { boampUrls.push(r.request().url()); r.fulfill({ contentType: "application/json", headers: CORS, body: JSON.stringify({ results: [
      { idweb: "26-1", objet: "Travaux de plomberie école", nomacheteur: "Ville d'Albi", code_departement: ["73", "81"], datelimitereponse: jour(30), type_marche: "TRAVAUX", url_avis: "https://www.boamp.fr/avis/detail/26-1" },
      { idweb: "26-2", objet: "Fourniture de papier", nomacheteur: "Région X", code_departement: "59", datelimitereponse: jour(30), url_avis: "javascript:alert(1)" },
      { idweb: "26-3", objet: "Plomberie ancien", nomacheteur: "Vieille Ville", code_departement: "81", datelimitereponse: jour(-4) },
      { idweb: "26-1", objet: "Travaux de plomberie école", code_departement: "81", datelimitereponse: jour(30) }] }) }); });
    await page.route("https://recherche-entreprises.api.gouv.fr/**", (r) => r.fulfill({ contentType: "application/json", headers: CORS, body: JSON.stringify({ results: [{ siren: "123456789", nom_complet: "Plomberie Test", activite_principale: "43.22A", tranche_effectif_salarie: "11", siege: { departement: "81" } }] }) }));
    await page.goto(origin + "/accompagnement-appels-offres.html");
    await page.waitForSelector("#chances-ao form");
    // Métier sans département : message clair.
    await page.fill('#chances-ao input[name="siren"]', "plomberie");
    await page.click('#chances-ao button[type="submit"]');
    assert.match(await page.textContent("[data-ao-status]"), /indiquez aussi votre département/);
    // SIREN.
    await page.fill('#chances-ao input[name="siren"]', "123 456 789");
    await page.click('#chances-ao button[type="submit"]');
    await page.waitForSelector(".ao-carte");
    assert.match(await page.textContent("[data-ao-status]"), /Plomberie Test · Plomberie – sanitaire · département 81/);
    const notes = await page.$$eval(".ao-note", (n) => n.map((x) => x.textContent));
    assert.equal(notes.length, 2, "expiré et doublon écartés");
    assert.equal(notes[0], "20/20");
    assert.ok(parseFloat(notes[1]) < 20);
    assert.ok(boampUrls.some((u) => /APPEL_OFFRE/.test(decodeURIComponent(u.replace(/\+/g, " "))) && /v2\.1\//.test(u) && /search\(objet/.test(decodeURIComponent(u.replace(/\+/g, " "))) && /datelimitereponse >=/.test(decodeURIComponent(u.replace(/\+/g, " ")))));
    await page.click(".ao-carte:first-child .ao-detail:nth-of-type(1) summary");
    assert.match(await page.textContent(".ao-carte:first-child .ao-detail"), /Métier : 5\/5/);
    assert.ok((await page.$$(".ao-carte:first-child .ao-pieces input[type=checkbox]")).length >= 8);
    const hrefs = await page.$$eval(".ao-carte:first-child a", (a) => a.map((x) => x.getAttribute("href")));
    assert.ok(hrefs.includes("https://www.boamp.fr/avis/detail/26-1"));
    assert.ok(hrefs.some((h) => /^contact\.html\?/.test(h) && /reference=26-1/.test(h) && /objet=public-market/.test(h)));
    assert.ok(!(await page.$$eval(".ao-carte a", (a) => a.map((x) => x.getAttribute("href")))).some((h) => /^javascript:/.test(h)), "lien non https refusé");
    assert.match(await page.textContent(".chances-ao"), /ne prédit pas l'attribution/);
    // Métier + département.
    boampUrls = [];
    await page.fill('#chances-ao input[name="siren"]', "charpente et désamiantage");
    await page.fill('#chances-ao input[name="dep"]', "69");
    await page.click('#chances-ao button[type="submit"]');
    await page.waitForFunction(() => /Votre recherche · charpente et désamiantage · département 69/.test(document.querySelector("[data-ao-status]").textContent), null, { timeout: 5000 });
    assert.ok(boampUrls.length >= 2, "un appel par mot");
    // Source en panne.
    await page.unroute("https://boamp-datadila.opendatasoft.com/**");
    await page.route("https://boamp-datadila.opendatasoft.com/**", (r) => r.fulfill({ status: 500, headers: CORS, body: "{}" }));
    await page.click('#chances-ao button[type="submit"]');
    await page.waitForFunction(() => /BOAMP\) ne répond pas/.test(document.querySelector("[data-ao-status]").textContent), null, { timeout: 5000 });
    assert.deepEqual(errors, []);
    console.log("chances-ao.browser: OK");
  } finally { await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
