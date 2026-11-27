// Test navigateur : « Mes chantiers à reprendre » (SIREN -> métier + département -> marchés notés). Réseau simulé.
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
    const f = path.join(root, new URL(req.url, "http://x").pathname);
    if (!f.startsWith(root + path.sep)) return res.writeHead(403).end();
    fs.readFile(f, (e, d) => e ? res.writeHead(404).end() : (res.writeHead(200, { "content-type": mime[path.extname(f)] || "application/octet-stream" }), res.end(d)));
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const origin = "http://127.0.0.1:" + server.address().port;
  const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
  try {
    const page = await (await browser.newContext()).newPage();
    const errors = []; page.on("pageerror", (e) => errors.push(e.message));
    const sdk = fakeSdk.replace("if(name==='cheexpeer_chat_status')", `if(name==='list_awarded_contracts') return {data:[
      {contract_uid:'m-loin',object:'Plomberie piscine',awarded_on:'2026-01-10',amount:900000,buyer_name:'Ville Lointaine',buyer_dept:'59',winners:'Gros SA',subcontracting_declared:false},
      {contract_uid:'m-bon',object:'Travaux de plomberie école',awarded_on:new Date().toISOString().slice(0,10),amount:120000,duration_months:12,buyer_name:'Ville d Albi',buyer_dept:'81',winners:'Bat SA',subcontracting_declared:true}],error:null};
      if(name==='cheexpeer_chat_status')`);
    await page.route("https://esm.sh/**", (r) => r.fulfill({ contentType: "text/javascript", body: sdk }));
    await page.route("https://recherche-entreprises.api.gouv.fr/**", (r) => r.fulfill({ contentType: "application/json", headers: { "access-control-allow-origin": "*" }, body: JSON.stringify({ results: [{ siren: "123456789", nom_complet: "Plomberie Test", activite_principale: "43.22A", tranche_effectif_salarie: "11", siege: { departement: "81" } }] }) }));
    await page.goto(origin + "/admin-cheexpeer.html");
    await page.waitForSelector("#workspace:not([hidden])");
    await page.click('.cx-tab[data-tab="chantiers"]');
    await page.fill('#cx-chantiers input[name="siren"]', "12345");
    await page.click('#cx-chantiers button[type="submit"]');
    assert.match(await page.textContent("#cx-cha-status"), /9 chiffres/);
    await page.fill('#cx-chantiers input[name="siren"]', "123 456 789");
    await page.click('#cx-chantiers button[type="submit"]');
    await page.waitForSelector("#cx-cha-list table");
    assert.match(await page.textContent("#cx-cha-list"), /Plomberie Test · Plomberie – sanitaire · département 81/);
    const rows = await page.$$eval("#cx-cha-list table tr", (trs) => trs.slice(1).map((tr) => [tr.querySelector(".cx-note")?.textContent, tr.children[1].textContent]));
    assert.deepEqual(rows[0], ["20/20", "Travaux de plomberie école"]); assert.ok(parseFloat(rows[1][0]) < 20);
    await page.click("#cx-cha-list table tr:nth-child(2) .cx-note");
    assert.match(await page.textContent("#cx-cha-list table tr:nth-child(2) .cx-note-detail"), /Sous-traitance déjà prévue : 3\/3 — confirmé/);
    assert.deepEqual(errors, []);
    console.log("admin-cheexpeer-chantiers.browser : OK");
  } finally { await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
