// Test navigateur : création d'espace par code e-mail (SDK Supabase et fonction serveur simulés, aucun réseau réel).
const assert = require("node:assert/strict");
const fs = require("node:fs"), http = require("node:http"), path = require("node:path");
const { chromium } = require("playwright");
const root = path.resolve(__dirname, "..", "dist");
const mime = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript", ".png": "image/png", ".webp": "image/webp" };
const fakeSdk = `
export function createClient(){
  const chain=(rows)=>{const q={select:()=>q,eq:()=>q,limit:()=>q,then:(r)=>r({data:rows,error:null})};return q;};
  return { auth:{
    getSession: async()=>({data:{session:window.__session||null},error:null}),
    onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}}),
    signOut: async()=>({}),
    signInWithOtp: async(a)=>{(window.__otp=window.__otp||[]).push(a);return {error:null};},
    verifyOtp: async(a)=>{(window.__verify=window.__verify||[]).push(a);window.__session={access_token:'tok',user:{id:'u1'}};return {data:{session:window.__session,user:{id:'u1'}},error:null};},
    updateUser: async(a)=>{(window.__updates=window.__updates||[]).push(a);window.__hasPassword=true;return {error:null};}
  }, from:()=>chain(window.__members||[]),
  rpc: async(name)=>{(window.__rpc=window.__rpc||[]).push(name);
    if(name==='start_member_activation') return {data:{state:'pending',deadline:'2026-11-25T18:00:00Z'},error:null};
    if(name==='member_activation_status') return {data:window.__activation||{state:'none'},error:null};
    return {data:null,error:null}; } };
}`;
(async () => {
  assert.ok(fs.existsSync(path.join(root, "espace-membre.html")), "Exécuter node build.js avant le test.");
  const server = http.createServer((req, res) => {
    const p = decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/^\/+/, "");
    const f = path.resolve(root, p);
    if (!f.startsWith(root + path.sep)) return res.writeHead(403).end();
    fs.readFile(f, (e, d) => e ? res.writeHead(404).end() : (res.writeHead(200, { "content-type": mime[path.extname(f)] || "application/octet-stream" }), res.end(d)));
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const origin = "http://127.0.0.1:" + server.address().port;
  const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
  const open = async (members) => {
    const page = await (await browser.newContext()).newPage();
    page.errors = []; page.on("pageerror", (e) => page.errors.push(e.message));
    await page.addInitScript((m) => { window.__members = m; }, members);
    await page.route("https://esm.sh/**", (r) => r.fulfill({ contentType: "text/javascript", body: fakeSdk }));
    return page;
  };
  try {
    // 1. Connexion : jamais de création.
    let page = await open([{ organization_id: "o1" }]);
    await page.goto(origin + "/espace-membre.html");
    await page.click("#open-personal-space");
    await page.fill("#personal-space-form input[name=email]", "ancien@exemple.fr");
    await page.click("#personal-space-form button[type=submit]");
    await page.waitForFunction(() => window.__otp && window.__otp.length === 1);
    assert.deepEqual(await page.evaluate(() => window.__otp[0]), { email: "ancien@exemple.fr", options: { shouldCreateUser: false } });
    // 2. Création depuis le petit lien : consentement obligatoire.
    page = await open([{ organization_id: "o2" }]);
    const provisioned = [];
    await page.route("**/functions/v1/provision-client-workspace", async (r) => { provisioned.push({ auth: r.request().headers().authorization, body: JSON.parse(r.request().postData() || "{}"), verifiedBefore: await page.evaluate(() => (window.__verify || []).length) }); await r.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ ok: true, organization: { id: "o2" } }) }); });
    await page.goto(origin + "/espace-membre.html");
    await page.click("[data-open-create]");
    assert.equal(await page.isVisible("#personal-space-form [data-create-only]"), true);
    assert.match(await page.textContent("#personal-space-title"), /Créer mon espace personnel/);
    await page.fill("#personal-space-form input[name=email]", "nouveau@exemple.fr");
    await page.fill("#personal-space-form input[name=organization_name]", "Ma Société");
    await page.click("#personal-space-form button[type=submit]");
    await page.waitForTimeout(300);
    assert.equal(await page.evaluate(() => (window.__otp || []).length), 0, "aucun code demandé sans consentement");
    await page.check("#personal-space-form input[name=privacy_ack]");
    await page.click("#personal-space-form button[type=submit]");
    await page.waitForFunction(() => window.__otp && window.__otp.length === 1);
    const sent = await page.evaluate(() => window.__otp[0]);
    assert.equal(sent.options.shouldCreateUser, true);
    assert.equal(sent.options.data.privacy_notice_acknowledged, true);
    assert.equal(sent.options.data.privacy_notice_version, "2026-11-05");
    assert.equal(sent.options.data.organization_name, "Ma Société");
    assert.equal(provisioned.length, 0, "aucune création avant la vérification du code");
    await page.fill("#personal-space-form input[name=otp]", "123456");
    await page.click("#personal-space-form button[type=submit]");
    await page.waitForSelector("#personal-space-form [data-password-step]:not([hidden])");
    assert.equal(provisioned.length, 0, "aucun espace avant la création du mot de passe");
    assert.ok((await page.evaluate(() => window.__rpc)).includes("start_member_activation"));
    // Mot de passe trop faible, puis différent, puis valide.
    await page.fill("#personal-space-form input[name=new_password]", "court1");
    await page.fill("#personal-space-form input[name=new_password_confirm]", "court1");
    await page.click("#personal-space-form button[type=submit]");
    await page.waitForFunction(() => /au moins 12 caractères/.test(document.querySelector("#personal-space-feedback")?.textContent || ""));
    assert.equal(await page.evaluate(() => (window.__updates || []).length), 0);
    await page.fill("#personal-space-form input[name=new_password]", "Cheval-Bleu-Lune-77");
    await page.fill("#personal-space-form input[name=new_password_confirm]", "Cheval-Bleu-Lune-78");
    await page.click("#personal-space-form button[type=submit]");
    await page.waitForFunction(() => /pas identiques/.test(document.querySelector("#personal-space-feedback")?.textContent || ""));
    assert.equal(provisioned.length, 0);
    await page.fill("#personal-space-form input[name=new_password_confirm]", "Cheval-Bleu-Lune-77");
    await page.click("#personal-space-form button[type=submit]");
    await page.waitForFunction(() => /Votre espace est activé/.test(document.querySelector("#personal-space-feedback")?.textContent || ""));
    assert.equal((await page.evaluate(() => window.__updates))[0].password, "Cheval-Bleu-Lune-77");
    assert.equal(provisioned.length, 1);
    assert.equal(provisioned[0].auth, "Bearer tok");
    assert.equal(provisioned[0].verifiedBefore, 1);
    assert.deepEqual(provisioned[0].body, { flow: "signup", privacy_acknowledged: true, organization_name: "Ma Société", display_name: "" });
    // 3. Compte vérifié mais non activé : l'alerte est visible, avec la date limite, et ramène à l'étape du mot de passe.
    const late = await open([]);
    await late.addInitScript(() => { window.__session = { access_token: "tok", user: { id: "u9" } }; window.__activation = { state: "pending", deadline: "2026-11-25T18:00:00Z", has_password: false }; });
    await late.goto(origin + "/espace-membre.html");
    await late.waitForSelector("#member-activation-alert:not([hidden])");
    assert.match(await late.textContent("#member-activation-alert"), /25 novembre 2026/);
    await late.click("#member-activation-action");
    await late.waitForSelector("#personal-space-form [data-password-step]:not([hidden])");
    assert.deepEqual(late.errors, []);
    // 4. Espace actif : aucune alerte.
    const ok = await open([{ organization_id: "o1" }]);
    await ok.addInitScript(() => { window.__session = { access_token: "tok", user: { id: "u1" } }; });
    await ok.goto(origin + "/espace-membre.html");
    await ok.waitForFunction(() => /connecté à votre espace/.test(document.querySelector("#member-auth-status")?.textContent || ""));
    assert.equal(await ok.isVisible("#member-activation-alert"), false);
    assert.deepEqual(page.errors, []);
    console.log("TEST CRÉATION D'ESPACE PAR CODE RÉUSSI : connexion sans création, consentement exigé, mot de passe sécurisé obligatoire avant l'espace, alerte d'activation avec date limite.");
  } finally { await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
