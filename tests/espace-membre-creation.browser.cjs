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
    onAuthStateChange:(cb)=>{ if(window.__session) setTimeout(()=>cb('INITIAL_SESSION',window.__session),0); return {data:{subscription:{unsubscribe(){}}}}; },
    signOut: async()=>({}),
    signInWithPassword: async(a)=>{(window.__pw=window.__pw||[]).push(a); if(a.password==='Bon-Mot-De-Passe-77'){window.__session={access_token:'tok',user:{id:'u1',email:a.email}};return {data:{session:window.__session,user:window.__session.user},error:null};} return {data:{},error:{message:'Invalid login credentials'}};},
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
    await page.click("#personal-space-form [data-send-link]");
    await page.waitForFunction(() => window.__otp && window.__otp.length === 1);
    const first = await page.evaluate(() => window.__otp[0]);
    assert.equal(first.email, "ancien@exemple.fr");
    assert.equal(first.options.shouldCreateUser, false);
    assert.match(first.options.emailRedirectTo, /\/espace-membre\.html$/);
    await page.waitForSelector("#personal-space-form [data-otp-step]:not([hidden])");
    assert.equal(await page.locator("#personal-space-form input[name=otp]").count(), 0, "Plus de saisie de code.");
    assert.match(await page.textContent("#personal-space-form [data-otp-step]"), /cliquez sur le lien/i);
    // 1 bis. Connexion par mot de passe (après activation) : mauvais mot de passe refusé, bon mot de passe accepté, aucun e-mail demandé.
    const pwl = await open([{ organization_id: "o1" }]);
    await pwl.goto(origin + "/espace-membre.html");
    await pwl.click("#open-personal-space");
    await pwl.fill("#personal-space-form input[name=email]", "ancien@exemple.fr");
    await pwl.click("#personal-space-form button[type=submit]");
    await pwl.waitForFunction(() => /Saisissez votre mot de passe/.test(document.querySelector("#personal-space-feedback")?.textContent || ""));
    await pwl.fill("#personal-space-form input[name=login_password]", "mauvais-mot-de-passe-1");
    await pwl.click("#personal-space-form button[type=submit]");
    await pwl.waitForFunction(() => /incorrect/.test(document.querySelector("#personal-space-feedback")?.textContent || ""));
    await pwl.fill("#personal-space-form input[name=login_password]", "Bon-Mot-De-Passe-77");
    await pwl.click("#personal-space-form button[type=submit]");
    await pwl.waitForFunction(() => /Connexion réussie/.test(document.querySelector("#personal-space-feedback")?.textContent || ""));
    assert.equal(await pwl.evaluate(() => (window.__otp || []).length), 0, "Aucun e-mail pour une connexion par mot de passe.");
    assert.deepEqual(pwl.errors, []);
    // 1 ter. Mot de passe correct mais espace encore à activer : on reprend l'activation.
    const pwa = await open([]);
    await pwa.addInitScript(() => { window.__activation = { state: "pending", deadline: "2026-11-25T18:00:00Z", has_password: true }; });
    await pwa.goto(origin + "/espace-membre.html");
    await pwa.click("#open-personal-space");
    await pwa.fill("#personal-space-form input[name=email]", "attente@exemple.fr");
    await pwa.fill("#personal-space-form input[name=login_password]", "Bon-Mot-De-Passe-77");
    await pwa.click("#personal-space-form button[type=submit]");
    await pwa.route("**/functions/v1/provision-client-workspace", (r) => r.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ ok: true, organization: { id: "o9" } }) }));
    await pwa.waitForSelector("#personal-space-form [data-password-step]:not([hidden])");
    // Mot de passe déjà créé : aucun champ à remplir, un clic active l'espace, sans changer le mot de passe.
    assert.equal(await pwa.locator("#personal-space-form input[name=new_password]").isVisible(), false);
    await pwa.click("#personal-space-form button[type=submit]");
    await pwa.waitForFunction(() => /Votre espace est activé/.test(document.querySelector("#personal-space-feedback")?.textContent || ""), null, { timeout: 8000 });
    const upd = await pwa.evaluate(() => window.__updates);
    assert.equal(upd[0].password, undefined, "Le mot de passe existant n'est pas redemandé.");
    assert.equal(upd[0].data.privacy_notice_acknowledged, true);
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
    // Clic sur le lien du courrier : on revient sur la page avec la session ; le nom de l'entreprise saisi voyage dans les données du compte.
    await page.addInitScript(() => { window.__members = []; window.__session = { access_token: "tok", user: { id: "u2", email: "nouveau@exemple.fr", user_metadata: { privacy_notice_acknowledged: true, organization_name: "Ma Société" } } }; });
    await page.goto("about:blank");
    await page.goto(origin + "/espace-membre.html#access_token=abc&type=magiclink");
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
    // 3 ter. Compte connecté sans espace ni activation (connexion directe) : jamais bloqué — l'activation s'ouvre, un seul bouton de déconnexion.
    const stuck = await open([]);
    await stuck.addInitScript(() => { window.__session = { access_token: "tok", user: { id: "u5" } }; });
    await stuck.goto(origin + "/espace-membre.html");
    await stuck.waitForSelector("#member-activation-alert:not([hidden])");
    await stuck.waitForTimeout(500);
    assert.ok((await stuck.evaluate(() => window.__rpc)).includes("start_member_activation"));
    assert.equal(await stuck.locator("#member-signout").count(), 1, "Un seul bouton Se déconnecter.");
    await stuck.click("#member-activation-action");
    await stuck.waitForSelector("#personal-space-form [data-password-step]:not([hidden])");
    assert.deepEqual(stuck.errors, []);
    // Déjà connecté, espace à activer : ouvrir le formulaire (« Se connecter ») mène au mot de passe, pas à une nouvelle demande de code.
    const again = await open([]);
    await again.addInitScript(() => { window.__session = { access_token: "tok", user: { id: "u4" } }; window.__activation = { state: "pending", deadline: "2026-11-25T18:00:00Z", has_password: false }; });
    await again.goto(origin + "/espace-membre.html");
    await again.waitForSelector("#member-activation-alert:not([hidden])");
    await again.click("#open-personal-space");
    await again.waitForSelector("#personal-space-form [data-password-step]:not([hidden])");
    assert.equal((await again.evaluate(() => window.__otp || [])).length, 0, "Aucun nouveau code ne doit être demandé.");
    // 3 bis. Arrivée par le lien du courrier (sans saisir de code) : l'activation reprend à l'étape du mot de passe.
    const link = await open([]);
    await link.addInitScript(() => { window.__session = { access_token: "tok", user: { id: "u7", email: "nouveau@exemple.fr", user_metadata: { privacy_notice_acknowledged: true } } }; });
    await link.goto(origin + "/espace-membre.html#access_token=abc&type=magiclink");
    await link.waitForSelector("#personal-space-form [data-password-step]:not([hidden])");
    assert.ok((await link.evaluate(() => window.__rpc)).includes("start_member_activation"));
    assert.equal(await link.evaluate(() => (window.__provision || []).length), 0);
    assert.deepEqual(link.errors, []);
    const link2 = await open([]);
    await link2.addInitScript(() => { window.__session = { access_token: "tok", user: { id: "u8", email: "direct@exemple.fr", user_metadata: {} } }; });
    await link2.goto(origin + "/espace-membre.html#access_token=abc&type=magiclink");
    await link2.waitForSelector("#personal-space-form [data-password-step]:not([hidden])");
    await link2.route("**/functions/v1/provision-client-workspace", (r) => r.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ ok: true, organization: { id: "o3" } }) }));
    // Arrivée par le lien : l'adresse (masquée, vide) ne doit pas bloquer l'envoi du mot de passe.
    await link2.fill("#personal-space-form input[name=new_password]", "Cheval-Bleu-Lune-77");
    await link2.fill("#personal-space-form input[name=new_password_confirm]", "Cheval-Bleu-Lune-77");
    await link2.click("#personal-space-form button[type=submit]");
    await link2.waitForFunction(() => /Votre espace est activé/.test(document.querySelector("#personal-space-feedback")?.textContent || ""), null, { timeout: 8000 });
    assert.equal((await link2.evaluate(() => window.__updates))[0].password, "Cheval-Bleu-Lune-77");
    assert.equal((await link2.evaluate(() => window.__updates))[0].data.privacy_notice_acknowledged, true, "L'activation enregistre l'acceptation de la politique.");
    assert.deepEqual(link2.errors, []);
    // Lien du courrier renvoyé vers une autre page (adresse de retour non autorisée côté Supabase) : reprise sur l'espace membre.
    const wrong = await open([]);
    await wrong.addInitScript(() => { window.__session = { access_token: "tok", user: { id: "u6", email: "autre@exemple.fr", user_metadata: {} } }; });
    await wrong.goto(origin + "/index.html#access_token=abc&type=magiclink");
    await wrong.waitForURL(/\/espace-membre\.html/, { timeout: 8000 });
    await wrong.waitForSelector("#personal-space-form [data-password-step]:not([hidden])");
    // 4. Espace actif : aucune alerte.
    const ok = await open([{ organization_id: "o1" }]);
    await ok.addInitScript(() => { window.__session = { access_token: "tok", user: { id: "u1" } }; });
    await ok.goto(origin + "/espace-membre.html");
    await ok.waitForFunction(() => /connecté à votre espace/.test(document.querySelector("#member-auth-status")?.textContent || ""));
    assert.equal(await ok.isVisible("#member-activation-alert"), false);
    // 5. Retour vers le service d'origine : ?retour=annonces puis clic sur le lien du courrier ramène au formulaire de dépôt ; une clé inconnue est ignorée.
    const back = await open([{ organization_id: "o1" }]);
    await back.goto(origin + "/espace-membre.html?retour=annonces");
    await back.addInitScript(() => { window.__session = { access_token: "tok", user: { id: "u1", email: "ancien@exemple.fr" } }; });
    await back.goto(origin + "/espace-membre.html#access_token=abc&type=magiclink");
    await back.waitForURL(/\/sous-traitance\.html#deposer$/, { timeout: 8000 });
    const nobody = await open([{ organization_id: "o1" }]);
    await nobody.goto(origin + "/espace-membre.html?retour=https://exemple.fr");
    await nobody.addInitScript(() => { window.__session = { access_token: "tok", user: { id: "u1", email: "ancien@exemple.fr" } }; });
    await nobody.goto(origin + "/espace-membre.html#access_token=abc&type=magiclink");
    await nobody.waitForFunction(() => /Connexion réussie/.test(document.querySelector("#personal-space-feedback")?.textContent || ""));
    await nobody.waitForTimeout(1600);
    assert.match(nobody.url(), /\/espace-membre\.html/, "Une destination inconnue ne doit jamais provoquer de redirection.");
    // Connecté et activé : plus de « Se connecter » ni de « Créer mon espace », mais « Se déconnecter ».
    const actif = await open([{ organization_id: "o1" }]);
    await actif.addInitScript(() => { window.__session = { access_token: "tok", user: { id: "u1", email: "ancien@exemple.fr" } }; });
    await actif.goto(origin + "/espace-membre.html");
    await actif.waitForSelector("#member-signout");
    assert.equal(await actif.locator("#open-personal-space").isVisible(), false, "Connecté : « Se connecter » ne doit plus apparaître.");
    assert.equal(await actif.locator(".member-preview .member-create-hint").isVisible(), false, "Connecté : « Créer mon espace » ne doit plus apparaître.");
    assert.equal(await actif.locator("#member-signout").isVisible(), true);
    assert.equal(await actif.locator(".member-preview h2").isVisible(), false, "Connecté et activé : la grande carte ne doit plus s’afficher.");
    for (const sel of ["#mes-services", ".mj-service", "main .platform-card"]) {
      assert.ok((await actif.locator(sel).count()) > 0 && await actif.locator(sel).first().isVisible(), "Connecté : la zone « " + sel + " » (services, CRM…) doit rester visible.");
    }
    assert.equal(await actif.locator("#member-led").isVisible(), true, "Connecté : l’ampoule verte doit s’afficher.");
    assert.ok((await actif.locator(".member-preview").boundingBox()).height < 120, "La zone connectée doit rester discrète.");
    assert.deepEqual(page.errors, []);
    console.log("TEST CRÉATION D'ESPACE PAR LIEN RÉUSSI : connexion sans création, consentement exigé, mot de passe sécurisé obligatoire avant l'espace, alerte d'activation avec date limite.");
  } finally { await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
