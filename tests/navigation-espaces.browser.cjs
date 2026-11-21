// Navigation allégée (5 menus) sur les espaces privés : tableau de bord admin, CRM, accueil interne, espace membre, invitation.
// Vérifie aussi que tous les liens du poste de pilotage (barre latérale) mènent à une page publiée.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..", "dist");
const mime = {".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"text/javascript; charset=utf-8",".mjs":"text/javascript; charset=utf-8"};
const pages = ["administration.html","admin-recherches.html","admin-utilisateurs.html","admin-annonces.html","admin-cheexpeer.html","crm.html","espace-interne.html","espace-membre.html","accepter-invitation.html"];
const labels = ["Marchés","Développement","Réseau","Solutions","Mon espace"];

async function main() {
  assert.ok(fs.existsSync(path.join(root,"administration.html")),"Construire le site avant le test.");
  const server=http.createServer((req,res)=>{
    const pathname=decodeURIComponent(new URL(req.url,"http://127.0.0.1").pathname);
    const file=path.resolve(root,pathname.replace(/^\/+/, ""));
    if(!file.startsWith(root+path.sep)) return res.writeHead(403).end("Forbidden");
    fs.readFile(file,(error,data)=>{
      if(error) return res.writeHead(404).end("Not found");
      res.writeHead(200,{"content-type":mime[path.extname(file)]||"application/octet-stream"});
      res.end(data);
    });
  });
  await new Promise(resolve=>server.listen(4177,"127.0.0.1",resolve));
  let browser;
  try {
    browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
    const page=await browser.newPage({viewport:{width:1365,height:900}});
    for (const name of pages) {
      await page.goto("http://127.0.0.1:4177/"+name,{waitUntil:"domcontentloaded"});
      await page.locator("#site-nav .nav-drawer-section").first().waitFor({state:"attached",timeout:15000});
      const found = await page.locator("#site-nav .nav-group-link").allTextContents();
      assert.deepEqual(found.map((t)=>t.trim()),labels,name+" : les cinq menus doivent être présents.");
      assert.equal(await page.locator("#site-nav .nav-group-items a").count(),19,name+" : 19 entrées secondaires attendues.");
      assert.equal(await page.locator('#site-nav a[href="espace-interne.html"]').count(),1,name+" : l’accès VIP doit rester dans Mon espace.");
    }
    // Tableau de bord admin : tous les liens de la barre latérale pointent vers des pages publiées.
    await page.goto("http://127.0.0.1:4177/administration.html",{waitUntil:"domcontentloaded"});
    const hrefs = await page.locator("#admin-nav a").evaluateAll((links)=>links.map((a)=>a.getAttribute("href")));
    assert.ok(hrefs.length>=6,"Le poste de pilotage doit lister ses modules internes.");
    for (const href of hrefs) assert.ok(fs.existsSync(path.join(root,href.split("#")[0])),"Module interne introuvable : "+href);
    console.log("TEST NAVIGATION ESPACES RÉUSSI : cinq menus sur "+pages.length+" pages privées, "+hrefs.length+" modules du poste de pilotage joignables.");
  } finally {
    if (browser) await browser.close();
    server.close();
  }
}
main().catch((e)=>{console.error(e);process.exit(1);});
