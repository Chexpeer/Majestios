const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..", "dist");
const mime = { ".html":"text/html; charset=utf-8", ".css":"text/css; charset=utf-8", ".js":"text/javascript; charset=utf-8" };

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
      body:`export function createClient(){return {auth:{getSession:async()=>({data:{session:null},error:null}),getUser:async()=>({data:{user:null},error:null}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}}),signOut:async()=>({error:null})},from(){throw new Error("Une session absente ne doit pas interroger les données.");}};}`
    }));
    await page.goto("http://127.0.0.1:4177/administration.html", {waitUntil:"domcontentloaded"});
    await page.getByText("Connectez-vous avec le compte interne", {exact:false}).waitFor({timeout:5000});
    assert.equal(await page.locator("#admin-workspace").isVisible(), false, "Le cockpit doit rester masqué sans session.");
    assert.equal(await page.locator(".admin-sidebar").isVisible(), false, "La navigation interne doit rester masquée sans session.");
    assert.equal(await page.locator("#admin-gate a[href='espace-membre.html']").count(), 1, "Le parcours d’authentification doit être accessible.");
    assert.equal(await page.locator("#admin-signout").isVisible(), false, "La déconnexion ne doit pas apparaître sans session.");
    await page.goto("http://127.0.0.1:4177/admin-recherches.html", {waitUntil:"domcontentloaded"});
    await page.getByText("Connectez-vous avec le compte interne", {exact:false}).waitFor({timeout:5000});
    assert.equal(await page.locator("#workspace").isVisible(), false, "Les recherches doivent rester masquées sans session.");
    assert.equal(await page.locator(".admin-sidebar").isVisible(), false, "La navigation des recherches doit rester masquée sans session.");
    console.log("TEST ADMIN RÉUSSI : accès non authentifié bloqué, cockpit et navigation internes masqués.");
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}
main().catch(error => { console.error(error); process.exitCode=1; });
