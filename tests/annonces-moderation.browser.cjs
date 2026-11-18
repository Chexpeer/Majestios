const assert = require("node:assert/strict");
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const root = path.resolve(__dirname, "..", "dist");
const mime = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json" };
// Faux client Supabase injecté à la place du CDN : session, RPC et déconnexion pilotées par le test.
const STUB = `
export function createClient() {
  const s = window.__stub;
  return {
    auth: {
      getSession: async () => ({ data: { session: s.session }, error: null }),
      signInWithOtp: async (a) => { s.calls.push(["otp", a]); return { error: null }; },
      verifyOtp: async (a) => { s.calls.push(["verify", a]); s.session = { user: {} }; return { error: null }; },
      signOut: async () => { s.session = null; return { error: null }; },
      onAuthStateChange: () => ({ data: { subscription: {} } })
    },
    rpc: async (name, args) => { s.calls.push([name, args]); return s.rpc(name, args); }
  };
}`;
const item = (n, status = "pending") => ({ id: "id-" + n, reference: "AN-2000000" + n, kind: "subcontract_need", status, title: "Recherche plaquiste " + n, description: "Nous cherchons un plaquiste pour un chantier de logements, début mars. <i>x</i>", trade: "Plâtrerie", department: "35", area_note: "Rennes", valid_until: "2026-12-31", contact_name: "Sophie", email: "sophie@example.fr", phone: "0600000000", created_at: "2026-11-14T10:00:00Z" });
(async () => {
  const server = http.createServer((req, res) => {
    const file = path.join(root, decodeURIComponent(new URL(req.url, "http://x").pathname));
    if (!file.startsWith(root) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { "content-type": mime[path.extname(file)] || "application/octet-stream" }); res.end(fs.readFileSync(file));
  });
  await new Promise((r) => server.listen(4177, "127.0.0.1", r));
  const browser = await chromium.launch();
  try {
    const run = async (setup) => {
      const page = await browser.newPage();
      await page.route("https://esm.sh/**", (route) => route.fulfill({ status: 200, contentType: "text/javascript", body: STUB }));
      await page.addInitScript(setup);
      await page.goto("http://127.0.0.1:4177/admin-annonces.html", { waitUntil: "domcontentloaded" });
      return page;
    };
    // 1. Non connecté : formulaire de connexion, aucune annonce.
    let page = await run(() => { window.__stub = { session: null, calls: [], rpc: async () => ({ data: [], error: null }) }; });
    await page.locator("#mod-login").waitFor({ state: "visible" });
    assert.equal(await page.locator("#workspace").isHidden(), true);
    assert.equal(await page.evaluate(() => window.__stub.calls.length), 0, "Aucune requête de données sans session.");
    await page.close();
    // 2. Connecté mais refusé : verrouillé.
    page = await run(() => { window.__stub = { session: { user: {} }, calls: [], rpc: async () => ({ data: null, error: { message: "forbidden", code: "42501" } }) }; });
    await page.waitForFunction(() => /autorisé/.test(document.querySelector("#gate-message").textContent));
    assert.equal(await page.locator("#workspace").isHidden(), true);
    await page.close();
    // 3. Modérateur : liste, publication corrigée, refus sans motif bloqué, refus avec motif.
    page = await browser.newPage();
    await page.route("https://esm.sh/**", (route) => route.fulfill({ status: 200, contentType: "text/javascript", body: STUB }));
    await page.addInitScript(`window.__mk = ${item.toString()};
      const state = { pending: [1,2,3].map((n) => window.__mk(n)), session: { user: {} }, calls: [] };
      window.__stub = state;
      state.rpc = async (name, args) => {
        if (name === "moderation_queue") return { data: args.p_status === "pending" ? state.pending.slice() : [], error: null };
        if (name === "moderate_announcement") { state.pending = state.pending.filter((x) => x.id !== args.p_id); return { data: "ok", error: null }; }
        return { data: null, error: { message: "unknown" } };
      };`);
    await page.goto("http://127.0.0.1:4177/admin-annonces.html", { waitUntil: "domcontentloaded" });
    await page.locator(".mod-card").first().waitFor({ timeout: 10000 });
    assert.equal(await page.locator(".mod-card").count(), 3);
    assert.equal(await page.locator(".mod-card i").count(), 0, "Le texte ne doit jamais être interprété comme du HTML.");
    assert.match(await page.locator(".mod-contact").first().textContent(), /sophie@example\.fr/, "Les coordonnées sont visibles en relecture interne.");
    const first = page.locator(".mod-card").first();
    await first.locator("button", { hasText: "Refuser" }).click();
    assert.match(await first.locator(".mod-status").textContent(), /motif/i, "Un refus sans motif doit être bloqué avant tout envoi.");
    assert.equal(await page.evaluate(() => window.__stub.calls.filter((c) => c[0] === "moderate_announcement").length), 0);
    await first.locator('input[type="text"]').fill("Hors sujet");
    await first.locator("button", { hasText: "Refuser" }).click();
    await page.waitForFunction(() => document.querySelectorAll(".mod-card").length === 2);
    const second = page.locator(".mod-card").first();
    await second.locator("input").first().fill("Recherche plaquiste à Rennes (corrigé)");
    await second.locator("button", { hasText: "Publier" }).click();
    await page.waitForFunction(() => document.querySelectorAll(".mod-card").length === 1);
    const calls = await page.evaluate(() => window.__stub.calls.filter((c) => c[0] === "moderate_announcement").map((c) => c[1]));
    assert.equal(calls[0].p_decision, "reject");
    assert.equal(calls[0].p_note, "Hors sujet");
    assert.equal(calls[1].p_decision, "publish");
    assert.equal(calls[1].p_title, "Recherche plaquiste à Rennes (corrigé)");
    assert.equal(calls[1].p_description, null, "Une description inchangée n’est pas renvoyée.");
    // Publication directe : formulaire invalide refusé côté page, puis publication transmise avec entreprise et lien d'origine.
    await page.locator("#mod-publish > summary").click();
    await page.locator("#mod-publish-form button[type=submit]").click();
    await page.waitForFunction(() => document.querySelector("#mod-publish-status")?.classList.contains("error"));
    assert.equal(await page.evaluate(() => window.__stub.calls.some((c) => c[0] === "publish_announcement_admin")), false);
    const f = page.locator("#mod-publish-form");
    await f.locator("[name=kind]").selectOption("job_offer");
    await f.locator("[name=title]").fill("Recherche maçon qualifié CDI");
    await f.locator("[name=description]").fill("Entreprise du bâtiment recherche un maçon qualifié en CDI sur le secteur.");
    await f.locator("[name=trade]").fill("Maçonnerie");
    await f.locator("[name=department]").fill("72");
    await f.locator("[name=company]").fill("Dupont SA");
    await f.locator("[name=source_url]").fill("https://exemple.fr/offre/1");
    await f.locator("button[type=submit]").click();
    await page.waitForFunction(() => window.__stub.calls.some((c) => c[0] === "publish_announcement_admin"));
    const pub = await page.evaluate(() => window.__stub.calls.find((c) => c[0] === "publish_announcement_admin")[1]);
    assert.equal(pub.p_company, "Dupont SA");
    assert.equal(pub.p_source_url, "https://exemple.fr/offre/1");
    assert.equal(pub.p_kind, "job_offer");
    console.log("Relecture des annonces : accès, liste, refus motivé et publication corrigée vérifiés.");
  } finally { await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
