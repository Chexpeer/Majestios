const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..", "dist");
const mime = { ".html":"text/html; charset=utf-8", ".css":"text/css; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".mjs":"text/javascript; charset=utf-8" };

function supabaseMock(role) {
  if (!role) return `export function createClient(){return {auth:{getSession:async()=>({data:{session:null},error:null}),getUser:async()=>({data:{user:null},error:null}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}}),signOut:async()=>({error:null})},from(){throw new Error("Une session absente ne doit pas interroger les données.");}};}`;
  const user = { id:"simulated-internal-user", email:"test@example.invalid" };
  const membership = { organization_id:"simulated-internal-org", role };
  const organization = { id:"simulated-internal-org", name:"Organisation interne simulée", kind:"internal" };
  return `const user=${JSON.stringify(user)};
const membership=${JSON.stringify(membership)};
const organization=${JSON.stringify(organization)};
export function createClient(){return {
  auth:{
    getSession:async()=>({data:{session:{user}},error:null}),
    getUser:async()=>({data:{user},error:null}),
    onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}}),
    signOut:async()=>({error:null})
  },
  from(table){
    return {select(){
      if(table==="organization_members") return {eq:()=>({limit:async()=>({data:[membership],error:null})})};
      if(table==="organizations") return {in:async()=>({data:[organization],error:null})};
      throw new Error("Table inattendue: "+table);
    }};
  }
};}`;
}

async function main() {
  assert.ok(fs.existsSync(path.join(root, "administration.html")), "Le build doit publier le cockpit d’administration.");
  const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, "http://127.0.0.1").pathname);
    const requested = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
    const file = path.resolve(root, requested);
    if (!file.startsWith(root + path.sep)) return res.writeHead(403).end("Forbidden");
    fs.readFile(file, (error, data) => {
      if (error) return res.writeHead(404).end("Not found");
      res.writeHead(200, { "content-type": mime[path.extname(file)] || "application/octet-stream" });
      res.end(data);
    });
  });

  await new Promise(resolve => server.listen(4177, "127.0.0.1", resolve));
  let browser;
  try {
    browser = await chromium.launch({ headless:true, args:["--no-sandbox"] });

    const page = await browser.newPage({ viewport:{width:390,height:844} });
    await page.route("https://esm.sh/@supabase/supabase-js@2.119.0", route => route.fulfill({
      status:200,
      contentType:"application/javascript",
      body:supabaseMock(null)
    }));
    await page.goto("http://127.0.0.1:4177/administration.html", {waitUntil:"domcontentloaded"});
    await page.getByText("Identifiez-vous par l’accès VIP", {exact:false}).waitFor({timeout:5000});
    assert.equal(await page.locator("#admin-workspace").isVisible(), false, "Le cockpit doit rester masqué sans session.");
    assert.equal(await page.locator(".admin-sidebar").isVisible(), false, "La navigation interne doit rester masquée sans session.");
    assert.equal(await page.locator("#admin-gate a[href='espace-interne.html?returnTo=administration.html']").count(), 1, "Le parcours d’authentification interne doit être accessible.");
    assert.equal(await page.locator("#admin-signout").isVisible(), false, "La déconnexion ne doit pas apparaître sans session.");
    await page.goto("http://127.0.0.1:4177/espace-interne.html", {waitUntil:"domcontentloaded"});
    await page.locator("#internal-login-form").waitFor({state:"visible",timeout:5000});
    assert.equal(await page.locator("#internal-workspace").isVisible(), false, "L’accueil interne ne doit afficher aucun module sans session.");
    assert.equal(await page.locator("#internal-login-form input[name='email']").count(), 1, "La connexion interne doit être proposée.");
    assert.equal(await page.locator("#internal-login-form input[name='password']").count(), 1, "Le formulaire interne doit demander le mot de passe.");
    assert.equal(await page.locator("#internal-login-form input[name='organizationName']").count(), 0, "L’accueil interne ne doit pas proposer la création d’un espace client.");
    await page.goto("http://127.0.0.1:4177/admin-recherches.html", {waitUntil:"domcontentloaded"});
    await page.locator("#gate").waitFor({state:"visible",timeout:5000});
    assert.equal(await page.locator("#gate a[href='espace-interne.html?returnTo=admin-recherches.html']").count(), 1, "Le parcours de connexion interne doit être proposé depuis les recherches ciblées.");
    assert.equal(await page.locator("#workspace").isVisible(), false, "Les recherches doivent rester masquées sans session.");
    assert.equal(await page.locator(".admin-sidebar").isVisible(), false, "La navigation des recherches doit rester masquée sans session.");
    await page.close();

    for (const role of ["owner", "admin", "member", "viewer"]) {
      const rolePage = await browser.newPage({viewport:{width:390,height:844}});
      await rolePage.route("https://esm.sh/@supabase/supabase-js@2.119.0", route => route.fulfill({
        status:200,
        contentType:"application/javascript",
        body:supabaseMock(role)
      }));
      await rolePage.goto("http://127.0.0.1:4177/espace-interne.html", {waitUntil:"domcontentloaded"});
      await rolePage.locator("#internal-workspace").waitFor({state:"visible",timeout:5000});
      assert.equal(await rolePage.locator("#internal-role").innerText(), ({
        owner:"Propriétaire interne",
        admin:"Administrateur interne",
        member:"Collaborateur interne",
        viewer:"Collaborateur · consultation seule"
      })[role], `Le rôle ${role} doit être correctement reconnu.`);
      if (role === "viewer") {
        assert.match(await rolePage.locator("#internal-identity").innerText(), /CRM interne reste réservé aux comptes VIP/,
          "Le message du rôle viewer ne doit pas laisser croire que le CRM VIP est accessible.");
      }
      assert.equal(await rolePage.locator("#internal-admin-card").isVisible(), ["owner","admin"].includes(role), `La carte Administration doit respecter le rôle ${role}.`);
      assert.equal(await rolePage.locator("#internal-search-card").isVisible(), ["owner","admin"].includes(role), `La carte Recherches doit respecter le rôle ${role}.`);
      assert.equal(await rolePage.locator("#internal-crm-link").isVisible(), ["owner","admin"].includes(role), `Le CRM doit être réservé aux rôles VIP owner/admin ; rôle ${role}.`);
      if (["member", "viewer"].includes(role)) {
        assert.match(await rolePage.locator("#internal-crm-access").innerText(), /RÉSERVÉ AUX COMPTES VIP OWNER \/ ADMIN/);
      }
      await rolePage.close();
    }

    const memberRedirect = await browser.newPage();
    await memberRedirect.route("https://esm.sh/@supabase/supabase-js@2.119.0", route => route.fulfill({
      status:200, contentType:"application/javascript", body:supabaseMock("member")
    }));
    await memberRedirect.goto("http://127.0.0.1:4177/espace-interne.html?returnTo=administration.html", {waitUntil:"domcontentloaded"});
    await memberRedirect.locator("#internal-workspace").waitFor({state:"visible",timeout:5000});
    assert.match(memberRedirect.url(), /espace-interne\.html\?returnTo=administration\.html$/, "Un membre ne doit pas être redirigé vers l’administration.");
    await memberRedirect.close();

    for (const role of ["member", "viewer"]) {
      const directCrm = await browser.newPage({viewport:{width:390,height:844}});
      await directCrm.route("https://esm.sh/@supabase/supabase-js@2.119.0", route => route.fulfill({
        status:200, contentType:"application/javascript", body:supabaseMock(role)
      }));
      await directCrm.goto("http://127.0.0.1:4177/crm.html", {waitUntil:"domcontentloaded"});
      await directCrm.locator("#crm-status").filter({hasText:"VIP"}).waitFor({timeout:5000});
      assert.match(await directCrm.locator("#crm-status").innerText(), /réservé aux comptes disposant d’un accès VIP/i,
        "L’accès direct à crm.html doit être refusé au rôle " + role + ".");
      await directCrm.close();

      const directAdmin = await browser.newPage({viewport:{width:390,height:844}});
      await directAdmin.route("https://esm.sh/@supabase/supabase-js@2.119.0", route => route.fulfill({
        status:200, contentType:"application/javascript", body:supabaseMock(role)
      }));
      await directAdmin.goto("http://127.0.0.1:4177/administration.html", {waitUntil:"domcontentloaded"});
      await directAdmin.locator("#admin-gate").waitFor({state:"visible",timeout:5000});
      assert.equal(await directAdmin.locator("#admin-workspace").isVisible(), false,
        "L’accès direct au cockpit doit être refusé au rôle " + role + ".");
      assert.match(await directAdmin.locator("#admin-gate-message").innerText(), /rôle ne vous autorise pas/i);
      await directAdmin.close();

      const directSearch = await browser.newPage({viewport:{width:390,height:844}});
      await directSearch.route("https://esm.sh/@supabase/supabase-js@2.119.0", route => route.fulfill({
        status:200, contentType:"application/javascript", body:supabaseMock(role)
      }));
      await directSearch.goto("http://127.0.0.1:4177/admin-recherches.html", {waitUntil:"domcontentloaded"});
      await directSearch.locator("#gate").waitFor({state:"visible",timeout:5000});
      await directSearch.waitForFunction(() => /rôle attribué ne permet pas/i.test(document.querySelector("#gate-message")?.textContent || ""), null, {timeout:5000});
      assert.equal(await directSearch.locator("#workspace").isVisible(), false,
        "L’accès direct aux recherches d’administration doit être refusé au rôle " + role + ".");
      assert.match(await directSearch.locator("#gate-message").innerText(), /rôle attribué ne permet pas/i);
      await directSearch.close();
    }

    console.log("TEST ADMIN RÉUSSI : accès sans session bloqué ; matrice owner/admin/member/viewer vérifiée ; accès direct CRM, cockpit et recherches d’administration protégé.");
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}
main().catch(error => { console.error(error); process.exitCode=1; });
