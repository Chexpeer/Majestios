// Test navigateur : Démo publique de l'accueil (SIREN -> 3 chantiers notés, sans inscription). Réseau simulé.
const assert = require("node:assert/strict");
const fs = require("node:fs"), http = require("node:http"), path = require("node:path");
const { chromium } = require("playwright");
const root = path.resolve(__dirname, "..", "dist");
const mime = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript" };
const ORG = "7ae83b50-bbd7-4098-bb38-0cfae56492f4";
const src = fs.readFileSync(path.join(__dirname, "admin-cheexpeer.browser.cjs"), "utf8");
const fakeSdk = src.match(/const fakeSdk = `([\s\S]*?)`;/)[1];
const _unused = [["111111111", "Plomberie Lente", 9, 80], ["222222222", "Plomberie Top", 18, 5], ["333333333", "Plomberie Moyenne", 13, 30], ...Array.from({ length: 9 }, (_, i) => ["4444444" + String(10 + i), "Plomberie Extra " + i, 11, 40])];
(async () => {
  const server = http.createServer((req, res) => {
    const f = path.join(root, new URL(req.url, "http://x").pathname === "/" ? "/index.html" : new URL(req.url, "http://x").pathname);
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
    let authHeader = "none";
    await page.route("https://qxaghcifdhugfskuscoc.supabase.co/rest/v1/rpc/list_awarded_contracts", (r) => { authHeader = r.request().headers().authorization || "none"; r.fulfill({ contentType: "application/json", headers: { "access-control-allow-origin": "*" }, body: JSON.stringify([
      { contract_uid: "m-loin", object: "Plomberie piscine", awarded_on: "2026-01-10", amount: 900000, buyer_name: "Ville Lointaine", buyer_dept: "59", winners: "Gros SA" },
      { contract_uid: "m-bon", object: "Travaux de plomberie école", awarded_on: new Date().toISOString().slice(0, 10), amount: 120000, duration_months: 12, buyer_name: "Ville d Albi", buyer_dept: "81", winners: "Bat SA", subcontracting_declared: true }]) }); });
    await page.route("https://qxaghcifdhugfskuscoc.supabase.co/rest/v1/rpc/list_awarded_contracts", (r) => r.request().method() === "OPTIONS" ? r.fulfill({ status: 204, headers: { "access-control-allow-origin": "*", "access-control-allow-headers": "*", "access-control-allow-methods": "POST" } }) : r.fallback());
    await page.route("https://qxaghcifdhugfskuscoc.supabase.co/rest/v1/rpc/awarded_contracts_meta", (r) => r.request().method() === "OPTIONS" ? r.fulfill({ status: 204, headers: { "access-control-allow-origin": "*", "access-control-allow-headers": "*" } }) : r.fulfill({ contentType: "application/json", headers: { "access-control-allow-origin": "*" }, body: JSON.stringify([{ contracts: 139822, winners: 54014, buyers: 10589, oldest: "2026-05-21", newest: "2026-11-20" }]) }));
    await page.route("https://recherche-entreprises.api.gouv.fr/**", (r) => r.fulfill({ contentType: "application/json", headers: { "access-control-allow-origin": "*" }, body: JSON.stringify({ results: [{ siren: "123456789", nom_complet: "Plomberie Test", activite_principale: "43.22A", tranche_effectif_salarie: "11", siege: { departement: "81" } }] }) }));
    await page.goto(origin + "/index.html");
    await page.waitForSelector("#demo-chantiers form");
    await page.fill('#demo-chantiers input[name="siren"]', "123");
    await page.click('#demo-chantiers button[type="submit"]');
    assert.match(await page.textContent("[data-demo-status]"), /indiquez aussi votre département/);
    await page.fill('#demo-chantiers input[name="siren"]', "123 456 789");
    await page.click('#demo-chantiers button[type="submit"]');
    await page.waitForSelector(".demo-chantier");
    assert.match(await page.textContent("[data-demo-status]"), /Plomberie Test · Plomberie – sanitaire · département 81/);
    const notes = await page.$$eval(".demo-note", (n) => n.map((x) => x.textContent));
    assert.equal(notes[0], "20/20"); assert.equal(notes.length, 2);
    await page.click(".demo-chantier:first-child summary");
    assert.match(await page.textContent(".demo-chantier:first-child .demo-detail"), /Sous-traitance déjà prévue : 3\/3/);
    assert.equal(await page.getAttribute(".demo-cta a", "href"), "espace-membre.html");
    assert.equal(authHeader, "none");
    await page.waitForSelector("[data-preuves]:not([hidden])", { timeout: 5000 });
    const preuves = (await page.textContent("[data-preuves]")).replace(/[\s\u202f\u00a0]/g, " ");
    assert.match(preuves, /139 822.*marchés attribués suivis/);
    assert.match(preuves, /54 014/);
    assert.match(preuves, /du 21 mai au 20 novembre/);
    // Recherche directe par métier + département, sans SIREN.
    await page.fill('#demo-chantiers input[name="siren"]', "charpente et désamiantage");
    await page.fill('#demo-chantiers input[name="dep"]', "69");
    await page.click('#demo-chantiers form:not(.demo-metier) button[type="submit"]');
    await page.waitForFunction(() => /Votre recherche · charpente et désamiantage · département 69/.test(document.querySelector("[data-demo-status]").textContent), null, { timeout: 5000 });
    assert.ok((await page.$$(".demo-chantier")).length > 0);
    await page.fill('#demo-chantiers input[name="dep"]', "");
    // Métier non reconnu : choix manuel dans la liste.
    await page.unroute("https://recherche-entreprises.api.gouv.fr/**");
    await page.route("https://recherche-entreprises.api.gouv.fr/**", (r) => r.fulfill({ contentType: "application/json", headers: { "access-control-allow-origin": "*" }, body: JSON.stringify({ results: [{ siren: "987654321", nom_complet: "Froid Inconnu", activite_principale: "99.99Z", tranche_effectif_salarie: "11", siege: { departement: "81" } }] }) }));
    await page.fill('#demo-chantiers input[name="siren"]', "987654321");
    await page.click('#demo-chantiers form:not(.demo-metier) button[type="submit"]');
    await page.waitForSelector(".demo-metier input");
    assert.match(await page.textContent("[data-demo-status]"), /Froid Inconnu : écrivez votre métier/);
    await page.fill(".demo-metier input", "plomberie");
    await page.click(".demo-metier button");
    await page.waitForSelector(".demo-chantier");
    assert.match(await page.textContent("[data-demo-status]"), /Froid Inconnu · Plomberie – sanitaire · département 81/);
    await page.fill('#demo-chantiers input[name="siren"]', "987654321");
    await page.click('#demo-chantiers form:not(.demo-metier) button[type="submit"]');
    await page.waitForSelector(".demo-metier input");
    await page.fill(".demo-metier input", "4322a");
    await page.click(".demo-metier button");
    await page.waitForFunction(() => /Froid Inconnu · Plomberie – sanitaire/.test(document.querySelector("[data-demo-status]").textContent));
    await page.fill('#demo-chantiers input[name="siren"]', "987654321");
    await page.click('#demo-chantiers form:not(.demo-metier) button[type="submit"]');
    await page.waitForSelector(".demo-metier input");
    await page.fill(".demo-metier input", "33.20B");
    await page.click(".demo-metier button");
    await page.waitForFunction(() => /Froid Inconnu · Installation de machines – froid industriel/.test(document.querySelector("[data-demo-status]").textContent));
    assert.ok(await page.$(".demo-metier input"), "le champ reste visible pour réessayer");
    await page.fill(".demo-metier input", "charpente et désamiantage");
    await page.click(".demo-metier button");
    await page.waitForFunction(() => /Froid Inconnu · charpente et désamiantage/.test(document.querySelector("[data-demo-status]").textContent), null, { timeout: 5000 });
    assert.ok((await page.$$(".demo-chantier")).length > 0, "résultats affichés");
    await page.fill(".demo-metier input", "froid commercial");
    await page.click(".demo-metier button");
    await page.waitForFunction(() => /Froid Inconnu · froid commercial/.test(document.querySelector("[data-demo-status]").textContent));
    assert.deepEqual(errors, []);
    console.log("demo-chantiers.browser : OK");
  } finally { await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
