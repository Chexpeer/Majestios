// Test navigateur : un seul clic enchaîne la liste d'entreprises (avec notes) puis les fiches contacts. Réseau simulé.
const assert = require("node:assert/strict");
const fs = require("node:fs"), http = require("node:http"), path = require("node:path");
const { chromium } = require("playwright");
const root = path.resolve(__dirname, "..", "dist");
const mime = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript" };
const ORG = "7ae83b50-bbd7-4098-bb38-0cfae56492f4";
const src = fs.readFileSync(path.join(__dirname, "admin-cheexpeer.browser.cjs"), "utf8");
const fakeSdk = src.match(/const fakeSdk = `([\s\S]*?)`;/)[1];
const COMP = [["111111111", "Plomberie Lente", 9, 80], ["222222222", "Plomberie Top", 18, 5], ["333333333", "Plomberie Moyenne", 13, 30], ...Array.from({ length: 9 }, (_, i) => ["4444444" + String(10 + i), "Plomberie Extra " + i, 11, 40])];
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
    const calls = []; let type = null, pendingApproval = true;
    await page.route("https://esm.sh/**", (r) => r.fulfill({ contentType: "text/javascript", body: fakeSdk }));
    await page.route("**/functions/v1/**", async (r) => {
      const name = new URL(r.request().url()).pathname.split("/").pop(); const body = JSON.parse(r.request().postData() || "{}");
      calls.push(name + (body.mission_type ? ":" + body.mission_type : ""));
      const json = (status, data) => r.fulfill({ status, contentType: "application/json", body: JSON.stringify(data) });
      if (name === "cheexpeer-mission-submit") { type = body.mission_type; pendingApproval = true; return json(201, { ok: true, mission: { mission_id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd", mission_status: "awaiting_approval", was_created: true } }); }
      if (name === "cheexpeer-approval-decision") { pendingApproval = false; return json(200, { ok: true }); }
      if (name === "cheexpeer-mission-run") return json(200, { ok: true, ran: 1, failed: [] });
      const result = type === "fiches_contacts"
        ? { type: "fiches_contacts", nombre: COMP.length, fiches: COMP.map(([siren, nom]) => ({ siren, nom, commune: "Albi", dirigeants: [{ nom: "Jean Test", qualite: "Gérant" }], emails: [], google: { statut: "probable" } })), effets_externes: false }
        : { type: "prospects_sous_traitance", criteres: { naf: "43.22A", departement: "81" }, nombre: COMP.length, sources: ["annuaire"], entreprises: COMP.map(([siren, nom, note, km]) => ({ siren, nom, commune: "Albi", naf: "43.22A", score: { note, preuve: 70, criteres: [[5, "c"], [0, "n"], [0, "n"], [2, "p"], [0, "a"], [2, "p"]] }, distance_km: km })) };
      return json(200, { ok: true, mission: { id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd", organization_id: ORG, mission_type: type, title: "Test", status: pendingApproval ? "pending_approval" : "succeeded", autonomy_level: 0, created_at: new Date().toISOString(), finished_at: pendingApproval ? null : new Date().toISOString(), result: pendingApproval ? {} : result }, approvals: pendingApproval ? [{ id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc", status: "pending", action_summary: "Accord" }] : [], events: [] });
    });
    await page.goto(origin + "/admin-cheexpeer.html");
    await page.waitForSelector("#workspace:not([hidden])");
    await page.click('.cx-tab[data-tab="prospects"]');
    await page.selectOption('#cx-prospects select[name="naf"]', "43.22A"); await page.fill('#cx-prospects input[name="departement"]', "81");
    await page.click('#cx-prospects button[type="submit"]');
    await page.waitForFunction(() => document.querySelector("#cx-detail")?.textContent.includes("Dirigeant"), null, { timeout: 15000 });
    assert.deepEqual(calls.filter((c) => c.startsWith("cheexpeer-mission-submit")), ["cheexpeer-mission-submit:prospects_sous_traitance", "cheexpeer-mission-submit:fiches_contacts"]);
    assert.equal(calls.filter((c) => c === "cheexpeer-approval-decision").length, 2);
    assert.equal(calls.filter((c) => c === "cheexpeer-mission-run").length, 2);
    const firstRows = await page.$$eval("#cx-detail table tr:nth-child(2) td", (tds) => tds.map((t) => t.querySelector(".cx-note")?.textContent ?? t.textContent));
    assert.equal(firstRows[0], "18/20");
    await page.click("#cx-detail table tr:nth-child(2) .cx-note");
    const det = await page.textContent("#cx-detail table tr:nth-child(2) .cx-note-detail");
    assert.match(det, /Métier : 5\/5 — confirmé/); assert.match(det, /Proximité : 2\/3 — en partie/); assert.match(det, /Capacité sur le chantier : 0\/2 — non évalué/); assert.match(firstRows[2], /Plomberie Top/);
    assert.match(await page.textContent("#cx-detail"), /Liste complète des entreprises/);
    assert.ok(await page.$('button:has-text("présélection (10 meilleures)")'));
    const [dlp] = await Promise.all([page.waitForEvent("download"), page.click('button:has-text("présélection (10 meilleures)")')]);
    const csv = fs.readFileSync(await dlp.path(), "utf8"); assert.equal(csv.trim().split("\n").length, 11); assert.match(csv, /Plomberie Top/);
    // Case décochée : aucun enchaînement.
    calls.length = 0; await page.evaluate(() => { const c = document.querySelector("#cx-auto"); c.checked = false; c.dispatchEvent(new Event("change", { bubbles: true })); });
    await page.click('#cx-prospects button[type="submit"]');
    await page.waitForFunction(() => document.querySelector("#cx-pro-status")?.textContent.includes("Terminé"));
    await new Promise((r) => setTimeout(r, 400));
    assert.ok(!calls.some((c) => c.includes("fiches_contacts")));
    assert.deepEqual(errors, []);
    console.log("admin-cheexpeer-chaine.browser : OK");
  } finally { await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
