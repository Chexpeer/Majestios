// Test navigateur des invitations : SDK Supabase et fonction serveur simulés, aucun réseau réel.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");
const root = path.resolve(__dirname, "..", "dist");
const mime = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript", ".png": "image/png", ".webp": "image/webp" };
const INT = "11111111-1111-4111-8111-111111111111", C1 = "22222222-2222-4222-8222-222222222222";

const fakeSdk = `
export function createClient(){
  const chain = (rows)=>{ const q={ select:()=>q, eq:()=>q, in:()=>q, limit:()=>q, then:(r)=>r({data:rows,error:null}) }; return q; };
  const role = window.__role || 'owner';
  return { auth:{ getSession: async()=>({data:{session: window.__signedIn===false?null:{access_token:'tok',user:{id:'u1'}}},error:null}),
      signOut: async()=>({}), signInWithOtp: async()=>({error:null}) },
    from:(t)=> t==='organization_members'? chain([{organization_id:'${INT}',role}]) : chain([{id:'${INT}',kind:'internal'}]),
    rpc: async(name,args)=>{ (window.__rpc=window.__rpc||[]).push([name,args]);
      if(name==='list_invitable_organizations') return {data:[{id:'${INT}',name:'Interne',kind:'internal'},{id:'${C1}',name:'Client Un',kind:'client'}],error:null};
      if(name==='list_invitations') return {data:[{id:'i1',email:'attente@exemple.fr',kind:'client',role:'owner',organization_name:'Nouvelle Co',status:'pending',expires_at:new Date().toISOString()}],error:null};
      if(name==='list_internal_team') return {data:[{member_id:'m1',email:'moi@exemple.fr',role:'owner',is_self:true,last_sign_in_at:null},{member_id:'m2',email:'collegue@exemple.fr',role:'admin',is_self:false,last_sign_in_at:null}],error:null};
      if(name==='set_internal_member_role'||name==='remove_internal_member') return window.__teamError?{data:null,error:{message:window.__teamError}}:{data:{ok:true},error:null};
      if(name==='accept_invitation') return window.__acceptError?{data:null,error:{message:window.__acceptError}}:{data:{ok:true,kind:'internal',role:'owner'},error:null};
      return {data:{ok:true},error:null}; } };
}`;

(async () => {
  assert.ok(fs.existsSync(path.join(root, "admin-utilisateurs.html")), "Exécuter node build.js avant le test.");
  const server = http.createServer((req, res) => {
    const p = decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/^\/+/, "");
    const f = path.resolve(root, p);
    if (!f.startsWith(root + path.sep)) return res.writeHead(403).end();
    fs.readFile(f, (e, d) => e ? res.writeHead(404).end() : (res.writeHead(200, { "content-type": mime[path.extname(f)] || "application/octet-stream" }), res.end(d)));
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const origin = "http://127.0.0.1:" + server.address().port;
  const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
  const open = async (init) => {
    const page = await (await browser.newContext()).newPage();
    page.errors = []; page.on("pageerror", (e) => page.errors.push(e.message));
    await page.addInitScript(init || (() => {}));
    await page.route("https://esm.sh/**", (r) => r.fulfill({ contentType: "text/javascript", body: fakeSdk }));
    return page;
  };
  try {
    // 1. Propriétaire : peut inviter admin, membre, lecteur ; envoi via la fonction serveur avec jeton en en-tête.
    const page = await open();
    const calls = [];
    await page.route("**/functions/v1/admin-invite-user", async (r) => { calls.push({ body: JSON.parse(r.request().postData() || "{}"), auth: r.request().headers().authorization }); await r.fulfill({ status: 201, contentType: "application/json", body: '{"ok":true}' }); });
    await page.goto(origin + "/admin-utilisateurs.html");
    await page.waitForSelector("#workspace:not([hidden])");
    const roles = await page.$$eval("select[name=role] option", (o) => o.map((x) => x.value));
    assert.deepEqual(roles, ["admin", "member", "viewer"]);
    await page.fill("#iu-form input[name=email]", "nouveau@exemple.fr");
    await page.selectOption("#iu-form select[name=role]", "member");
    await page.click("#iu-form button[type=submit]");
    await page.waitForFunction(() => document.querySelector("#iu-status")?.textContent.includes("Invitation envoyée"));
    assert.equal(calls[0].auth, "Bearer tok");
    assert.deepEqual(calls[0].body, { email: "nouveau@exemple.fr", kind: "internal", role: "member", organization_id: INT, new_organization_name: null });
    assert.match(await page.textContent("#iu-list"), /attente@exemple\.fr/);
    // Client : nouvelle société => rôle responsable imposé, nom requis.
    await page.selectOption("#iu-form select[name=kind]", "client");
    assert.equal(await page.isVisible("#iu-newname-wrap"), true);
    assert.equal(await page.isDisabled("#iu-form select[name=role]"), true);
    await page.fill("#iu-form input[name=email]", "client@exemple.fr");
    await page.fill("#iu-form input[name=new_organization_name]", "Boulangerie Dupont");
    await page.click("#iu-form button[type=submit]");
    await page.waitForFunction(() => document.querySelector("#iu-status")?.textContent.includes("Invitation envoyée"));
    assert.deepEqual(calls[1].body, { email: "client@exemple.fr", kind: "client", role: "owner", organization_id: null, new_organization_name: "Boulangerie Dupont" });
    // Révocation
    await page.click("text=Révoquer");
    await page.waitForFunction(() => (window.__rpc || []).some((c) => c[0] === "revoke_invitation" && c[1].p_id === "i1"));
    assert.deepEqual(page.errors, []);

    // 2. Administrateur : pas de rôle admin proposé.
    const pageA = await open(() => { window.__role = "admin"; });
    await pageA.goto(origin + "/admin-utilisateurs.html");
    await pageA.waitForSelector("#workspace:not([hidden])");
    assert.deepEqual(await pageA.$$eval("select[name=role] option", (o) => o.map((x) => x.value)), ["member", "viewer"]);

    // 3. Refus serveur affiché sans planter.
    const pageE = await open();
    await pageE.route("**/functions/v1/admin-invite-user", (r) => r.fulfill({ status: 429, contentType: "application/json", body: '{"error":"Limite de 10 invitations par 24 h atteinte."}' }));
    await pageE.goto(origin + "/admin-utilisateurs.html");
    await pageE.waitForSelector("#workspace:not([hidden])");
    await pageE.fill("#iu-form input[name=email]", "x@exemple.fr");
    await pageE.click("#iu-form button[type=submit]");
    await pageE.waitForFunction(() => document.querySelector("#iu-status")?.textContent.includes("Limite"));

    // 4. Non connecté : fermé.
    const pageN = await open(() => { window.__signedIn = false; });
    await pageN.goto(origin + "/admin-utilisateurs.html");
    await pageN.waitForSelector("#iu-login:not([hidden])");
    assert.equal(await pageN.isHidden("#workspace"), true);

    // 5. Acceptation : interne directe ; client avec consentement.
    const acc = await open();
    await acc.goto(origin + "/accepter-invitation.html");
    await acc.waitForFunction(() => document.querySelector("#ia-message")?.textContent.includes("acceptée"));
    assert.equal(await acc.getAttribute("#ia-next", "href"), "administration.html");
    const accC = await open(() => { window.__acceptError = "NOTICE_REQUIRED"; });
    await accC.goto(origin + "/accepter-invitation.html");
    await accC.waitForSelector("#ia-consent:not([hidden])");
    assert.deepEqual(await accC.evaluate(() => window.__rpc.map((c) => c[1].p_notice_version)), [null]);
    await accC.click("#ia-consent button");
    assert.match(await accC.textContent("#ia-message"), /Cochez/);
    await accC.check("#ia-check"); await accC.click("#ia-consent button");
    await accC.waitForFunction(() => window.__rpc.length === 2);
    assert.equal(await accC.evaluate(() => window.__rpc[1][1].p_notice_version), "2026-11-05");
    // Pas de session : demande de lien.
    const accN = await open(() => { window.__signedIn = false; });
    await accN.goto(origin + "/accepter-invitation.html");
    await accN.waitForSelector("#ia-login:not([hidden])");
    for (const p of [acc, accC, accN, pageA, pageE, pageN]) assert.deepEqual(p.errors, []);

    // 6. Équipe interne : le propriétaire attribue un rôle et retire (avec confirmation) ; jamais sur lui-même ; l'admin ne voit aucun bouton.
    const pageT = await open();
    await pageT.goto(origin + "/admin-utilisateurs.html#equipe");
    await pageT.waitForSelector("#iu-team li.iu-member");
    assert.equal(await pageT.locator("#iu-team li").count(), 2);
    assert.equal(await pageT.locator("#iu-team li").first().locator("select,button").count(), 0, "Aucune action sur soi-même.");
    const second = pageT.locator("#iu-team li").nth(1);
    await second.locator("select").selectOption("member");
    await second.locator("button", { hasText: "Enregistrer le rôle" }).click();
    await pageT.waitForFunction(() => (window.__rpc || []).some((c) => c[0] === "set_internal_member_role" && c[1].p_member_id === "m2" && c[1].p_role === "member"));
    await pageT.locator("#iu-team li").nth(1).locator("button", { hasText: "Retirer" }).click();
    assert.equal(await pageT.evaluate(() => (window.__rpc || []).some((c) => c[0] === "remove_internal_member")), false, "Rien n'est retiré avant confirmation.");
    await pageT.locator("#iu-team li").nth(1).locator("button", { hasText: "Annuler" }).click();
    await pageT.locator("#iu-team li").nth(1).locator("button", { hasText: "Retirer" }).click();
    await pageT.locator("#iu-team li").nth(1).locator("button", { hasText: "Confirmer le retrait" }).click();
    await pageT.waitForFunction(() => (window.__rpc || []).some((c) => c[0] === "remove_internal_member" && c[1].p_member_id === "m2"));
    const pageTA = await open(() => { window.__role = "admin"; });
    await pageTA.goto(origin + "/admin-utilisateurs.html#equipe");
    await pageTA.waitForSelector("#iu-team li.iu-member");
    assert.equal(await pageTA.locator("#iu-team button, #iu-team select").count(), 0, "Un administrateur ne peut ni changer un rôle ni retirer.");
    const pageTE = await open(() => { window.__teamError = "LAST_OWNER"; });
    await pageTE.goto(origin + "/admin-utilisateurs.html");
    await pageTE.waitForSelector("#iu-team li.iu-member");
    await pageTE.locator("#iu-team li").nth(1).locator("button", { hasText: "Enregistrer le rôle" }).click();
    await pageTE.locator("#iu-team li").nth(1).locator("select").selectOption("viewer");
    await pageTE.locator("#iu-team li").nth(1).locator("button", { hasText: "Enregistrer le rôle" }).click();
    await pageTE.waitForFunction(() => document.querySelector("#iu-team-status")?.textContent.includes("il doit toujours rester un propriétaire"));
    for (const p of [pageT, pageTA, pageTE]) assert.deepEqual(p.errors, []);
    console.log("admin-utilisateurs.browser : OK");
  } finally { await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
