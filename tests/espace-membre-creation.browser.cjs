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
    signInWithOAuth: async(a)=>{(window.__oauth=window.__oauth||[]).push(a);return {data:{},error:window.__oauthError?{message:'Unsupported provider'}:null};},
    signInWithOtp: async(a)=>{(window.__otp=window.__otp||[]).push(a);return {error:null};},
    verifyOtp: async(a)=>{(window.__verify=window.__verify||[]).push(a);window.__session={access_token:'tok',user:{id:'u1'}};return {data:{session:window.__session,user:{id:'u1'}},error:null};},
    updateUser: async(a)=>{(window.__updates=window.__updates||[]).push(a);window.__hasPassword=true;return {error:null};}
  }, from:(t)=>chain((window.__tables&&window.__tables[t])||(window.__tables?[]:(window.__members||[]))),
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
    // 1 quater. Connexion avec Google : bouton présent, appel OAuth, consentement exigé en création, erreur claire si Google n'est pas activé.
    const gg = await open([]);
    await gg.goto(origin + "/espace-membre.html");
    await gg.click("#open-personal-space");
    assert.equal(await gg.locator("[data-google-signin]").isVisible(), true, "Le bouton « Continuer avec Google » est proposé.");
    await gg.click("[data-google-signin]");
    const oa = await gg.evaluate(() => window.__oauth);
    assert.equal(oa[0].provider, "google");
    assert.match(oa[0].options.redirectTo, /\/espace-membre\.html$/, "Retour sur l'espace membre après Google.");
    await gg.click("[data-toggle-create]");
    await gg.click("[data-google-signin]");
    assert.equal(await gg.evaluate(() => window.__oauth.length), 1, "En création, Google n'est pas lancé sans consentement.");
    assert.match(await gg.locator("#personal-space-feedback").textContent(), /politique de confidentialité/);
    await gg.check("#personal-space-form input[name=privacy_ack]");
    await gg.evaluate(() => { window.__oauthError = true; });
    await gg.click("[data-google-signin]");
    await gg.waitForFunction(() => /pas disponible pour le moment/.test(document.querySelector("#personal-space-feedback")?.textContent || ""));
    assert.deepEqual(gg.errors, []);
    // LinkedIn : même parcours, fournisseur linkedin_oidc.
    await gg.evaluate(() => { window.__oauthError = false; });
    const before = await gg.evaluate(() => window.__oauth.length);
    await gg.click('[data-oauth-signin="linkedin_oidc"]');
    assert.equal(await gg.evaluate(() => window.__oauth[window.__oauth.length - 1].provider), "linkedin_oidc");
    assert.equal(await gg.evaluate(() => window.__oauth.length), before + 1);
    const li = await open([]);
    await li.addInitScript(() => { window.__session = { access_token: "tok", user: { id: "ul", email: "li@exemple.fr", app_metadata: { providers: ["linkedin_oidc"] } } }; window.__activation = { state: "pending", deadline: "2026-11-25T18:00:00Z", has_password: false }; });
    await li.goto(origin + "/espace-membre.html");
    await li.waitForSelector("#member-activation-alert:not([hidden])");
    assert.match(await li.locator("#member-activation-text").textContent(), /LinkedIn/);
    // Retour de Google (espace à activer) : aucun mot de passe demandé, un clic active l'espace.
    const gs = await open([]);
    await gs.addInitScript(() => { window.__session = { access_token: "tok", user: { id: "ug", email: "google@exemple.fr", app_metadata: { providers: ["google"] } } }; window.__activation = { state: "pending", deadline: "2026-11-25T18:00:00Z", has_password: false }; });
    await gs.route("**/functions/v1/provision-client-workspace", (r) => r.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ ok: true, organization: { id: "og" } }) }));
    await gs.goto(origin + "/espace-membre.html");
    await gs.waitForSelector("#member-activation-alert:not([hidden])");
    assert.match(await gs.locator("#member-activation-text").textContent(), /Google/);
    assert.doesNotMatch(await gs.locator("#member-activation-text").textContent(), /mot de passe/);
    await gs.click("#open-personal-space");
    await gs.waitForSelector("#personal-space-form [data-password-step]:not([hidden])");
    assert.equal(await gs.locator("#personal-space-form input[name=new_password]").isVisible(), false, "Google : aucun mot de passe à saisir.");
    await gs.click("#personal-space-form button[type=submit]");
    await gs.waitForFunction(() => /Votre espace est activé/.test(document.querySelector("#personal-space-feedback")?.textContent || ""), null, { timeout: 8000 });
    const gu = await gs.evaluate(() => window.__updates);
    assert.equal(gu[0].password, undefined, "Aucun mot de passe créé pour une connexion Google.");
    assert.equal(gu[0].data.privacy_notice_acknowledged, true);
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
    // Tableau de bord : bienvenue, chiffres justes, dernières demandes ; vide honnête sans demande.
    const dash = await open([{ organization_id: "o1" }]);
    await dash.addInitScript(() => {
      window.__session = { access_token: "tok", user: { id: "u1", email: "zine@exemple.fr" } };
      localStorage.setItem("sb-test-auth-token", JSON.stringify({ access_token: "tok" }));
      window.__tables = {
        organization_members: [{ organization_id: "o1" }],
        profiles: [{ display_name: "Zine Eddine" }],
        organizations: [{ name: "Société Test" }],
        opportunities: [
          { id: "o1", title: "Mairie de Lyon", status: "to_qualify", next_action: "Appeler le service achats", next_action_at: "2026-11-25T09:00:00Z" },
          { id: "o2", title: "Groupe Alpha", status: "proposal", next_action: "Relancer le devis", next_action_at: "2026-11-22T09:00:00Z" },
          { id: "o3", title: "Client gagné", status: "won", next_action: "Facturer" },
          { id: "o4", title: "Piste archivée", status: "archived" }
        ],
        client_requests: [
          { id: "1", request_type: "tender_support", status: "in_review", subject: "Appel d’offres mairie", created_at: "2026-11-10T10:00:00Z" },
          { id: "2", request_type: "other", status: "waiting_for_user", subject: "Audit image", created_at: "2026-11-12T10:00:00Z" },
          { id: "3", request_type: "contact", status: "closed", subject: "Question", created_at: "2026-11-01T10:00:00Z" }
        ]
      };
    });
    await dash.goto(origin + "/espace-membre.html");
    await dash.waitForSelector("#tableau-de-bord:not([hidden]) .mj-kpi");
    assert.match(await dash.textContent("#tableau-de-bord h2"), /Bonjour Zine/);
    assert.match(await dash.textContent("#tableau-de-bord .mj-board-sub"), /Société Test/);
    const chiffres = await dash.locator("#tableau-de-bord > .mj-board-kpis .mj-kpi-value").allTextContents();
    assert.deepEqual(chiffres, ["3", "1", "1", "1"], "Chiffres : 3 demandes, 1 en cours, 1 à compléter, 1 terminée.");
    assert.equal(await dash.locator("#tableau-de-bord .mj-board-panel:not(.mj-board-suivi) .mj-board-list li").count(), 3);
    const etapes = await dash.locator("#suivi-commercial .mj-kpi-value").allTextContents();
    assert.deepEqual(etapes, ["1", "0", "1", "1", "0"], "Suivi : 1 à qualifier, 0 qualifiée, 1 en contact, 1 gagnée, 0 perdue (archivée exclue).");
    assert.match(await dash.textContent("#suivi-commercial .mj-board-list li:first-child"), /Groupe Alpha/, "Prochaine action la plus proche en premier.");
    assert.equal(await dash.locator("#suivi-commercial .mj-board-list li").count(), 2, "Les pistes gagnées ou perdues n’ont plus d’action à venir.");
    assert.ok(await dash.locator(".mj-service.is-soon", { hasText: "Mes factures" }).count() === 1, "« Mes factures » est présent et grisé en attendant le partenaire.");
    assert.match(await dash.textContent("#tableau-de-bord .mj-board-list li:first-child"), /Audit image/, "La plus récente en premier.");
    assert.equal(await dash.locator("main .interior-lede").textContent().then((x) => /Connectez-vous/.test(x)), false, "Connecté : plus de « Connectez-vous » en introduction.");
    const vide = await open([{ organization_id: "o1" }]);
    await vide.addInitScript(() => { window.__session = { access_token: "tok", user: { id: "u1", email: "x@exemple.fr" } }; window.__tables = { organization_members: [{ organization_id: "o1" }], profiles: [], organizations: [], client_requests: [] }; });
    await vide.goto(origin + "/espace-membre.html");
    await vide.waitForSelector("#tableau-de-bord:not([hidden]) .mj-board-empty");
    assert.match(await vide.textContent("#suivi-commercial .mj-board-empty"), /Aucune piste suivie/);
    assert.match(await vide.textContent("#tableau-de-bord h2"), /Bonjour x/);
    const anonDash = await open([]);
    await anonDash.goto(origin + "/espace-membre.html");
    await anonDash.waitForTimeout(500);
    assert.equal(await anonDash.locator("#tableau-de-bord").isVisible(), false, "Non connecté : pas de tableau de bord.");
    // Identité des espaces : pastille « MON ESPACE » (client connecté) et fond fixe ; « ESPACE ADMIN » sur les pages d'administration.
    assert.equal(await dash.locator("#mj-space-badge").textContent(), "MON ESPACE", "Client connecté : pastille « MON ESPACE ».");
    const fond1 = await dash.evaluate(() => getComputedStyle(document.body).getPropertyValue("--mj-fond-image"));
    assert.match(fond1, /montagnes-aurore/, "L’espace personnel garde un fond fixe.");
    await dash.goto("about:blank"); await dash.goto(origin + "/espace-membre.html");
    await dash.waitForSelector("#mj-space-badge");
    assert.match(await dash.evaluate(() => getComputedStyle(document.body).getPropertyValue("--mj-fond-image")), /montagnes-aurore/, "Fond identique à chaque visite.");
    assert.equal(await anonDash.locator("#mj-space-badge").count(), 0, "Non connecté : pas de pastille « MON ESPACE ».");
    for (const adminPage of ["administration.html", "admin-annonces.html", "admin-utilisateurs.html", "admin-recherches.html", "admin-cheexpeer.html", "espace-interne.html"]) {
      const ap = await open([]);
      await ap.goto(origin + "/" + adminPage);
      await ap.waitForSelector("#mj-space-badge");
      assert.equal(await ap.locator("#mj-space-badge").textContent(), "ESPACE ADMIN", adminPage + " : pastille « ESPACE ADMIN ».");
    }
    // Bandeau de bas de page et menu : pas de « Accéder » quand on est connecté, pas de « Créer » dans le menu.
    const anon = await open([]);
    await anon.goto(origin + "/marches-publics.html");
    assert.ok(await anon.locator(".page-cta").count() > 0, "Non connecté : le bandeau d’accès à l’espace personnel reste proposé.");
    assert.equal(await anon.locator('nav a[href="espace-membre.html#creation"]').count(), 0, "Le menu ne propose plus « Créer mon espace personnel ».");
    const cnx = await open([]);
    await cnx.addInitScript(() => { localStorage.setItem("sb-test-auth-token", JSON.stringify({ access_token: "tok" })); });
    await cnx.goto(origin + "/marches-publics.html");
    assert.equal(await cnx.locator("#mj-connected-led").isVisible(), true, "Connecté : l’ampoule verte apparaît sur les autres pages.");
    assert.equal(await anon.locator("#mj-connected-led").count(), 0, "Non connecté : pas d’ampoule verte.");
    assert.equal(await cnx.locator(".page-cta").count(), 0, "Connecté : le bandeau « Accéder à mon espace personnel » ne doit plus apparaître.");
    assert.deepEqual(page.errors, []);
    console.log("TEST CRÉATION D'ESPACE PAR LIEN RÉUSSI : connexion sans création, consentement exigé, mot de passe sécurisé obligatoire avant l'espace, alerte d'activation avec date limite.");
  } finally { await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
