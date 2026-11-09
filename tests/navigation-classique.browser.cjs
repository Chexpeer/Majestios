const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..", "dist");
const mime = {".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"text/javascript; charset=utf-8",".png":"image/png",".webp":"image/webp",".jfif":"image/jpeg",".jpg":"image/jpeg"};

async function main() {
  assert.ok(fs.existsSync(path.join(root,"index.html")), "Exécuter node build.js avant le test.");
  const manifest = JSON.parse(fs.readFileSync(path.join(__dirname,"..","site-files.json"),"utf8"));
  const published = new Set(manifest.files);
  const server = http.createServer((req,res) => {
    const pathname = decodeURIComponent(new URL(req.url,"http://127.0.0.1").pathname);
    const requested = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
    const file = path.resolve(root,requested);
    if (!file.startsWith(root + path.sep) && file !== path.join(root,"index.html")) return res.writeHead(403).end("Forbidden");
    fs.readFile(file,(error,data) => {
      if (error) return res.writeHead(404).end("Not found");
      res.writeHead(200,{"content-type":mime[path.extname(file)] || "application/octet-stream"});
      res.end(data);
    });
  });
  await new Promise(resolve=>server.listen(4174,"127.0.0.1",resolve));
  let browser;
  try {
    browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
    const page=await browser.newPage({viewport:{width:1440,height:900}});
    const errors=[];
    page.on("pageerror",error=>errors.push(error.message));

    await page.goto("http://127.0.0.1:4174/",{waitUntil:"domcontentloaded"});
    await page.locator("#site-nav .nav-group").first().waitFor({state:"attached",timeout:15000});
    await page.locator(".majestios-chat-toggle").waitFor({state:"visible",timeout:15000});
    assert.equal(await page.locator("#site-nav .nav-group").count(),5,"Cinq familles de navigation doivent être visibles.");
    assert.ok(await page.locator("#site-nav a").count()>=25,"Le menu doit exposer les rubriques et sous-rubriques.");
    for (const route of ["marches-publics.html","marches-prives.html","prospection-active.html","bodacc-veille-entreprises.html","qualification-entreprises.html","salons-seminaires.html","reputation-virtuelle.html","crm.html"]) {
      assert.ok(published.has(route),"La route de navigation doit être publiée : "+route);
      assert.equal(await page.locator('#site-nav a[href="'+route+'"]').count(),1,"Le menu doit exposer "+route);
    }
    assert.equal(await page.locator("#floor-rows").count(),0,"L'ancien système de navigation par immeuble doit avoir disparu.");
    assert.ok(await page.locator("#home-search-mount").count(),"Le moteur de recherche transversal doit rester présent.");
    await page.locator("#feed-search").waitFor({state:"visible",timeout:15000});

    const opportunityGroup=page.locator("#site-nav .nav-group").filter({has:page.getByRole("button",{name:"Opportunités"})});
    await opportunityGroup.locator(".nav-group-trigger").click();
    assert.equal(await opportunityGroup.locator('a[href="bodacc-veille-entreprises.html"]').isVisible(),true,
      "La sous-rubrique BODACC doit s'ouvrir depuis la navigation.");
    await page.locator("body").click({position:{x:5,y:5}});

    const chatToggle=page.locator(".majestios-chat-toggle");
    await chatToggle.click();
    assert.equal(await page.locator("#majestios-chat-panel").isVisible(),true,"Le chatbot doit s'ouvrir.");
    for (const route of ["developpement-commercial.html","espace-membre.html","faq.html"]) {
      assert.equal(await page.locator('.majestios-chat-shortcuts a[href="'+route+'"]').count(),route==="developpement-commercial.html"?2:1,
        "Les raccourcis du guide d’accueil doivent être préservés : "+route);
    }
    await page.locator("#majestios-chat-input").fill("Comment fonctionne la Prospection ?");
    await page.locator(".majestios-chat-form button").click();
    assert.ok((await page.locator(".majestios-chat-message.is-assistant").last().textContent()).includes("Prospection"),
      "Le chatbot doit répondre à une question connue.");
    assert.equal(await page.locator('.majestios-chat-link[href="prospection-active.html"]').count(),1,
      "Le chatbot doit proposer un lien vers la rubrique concernée.");
    await page.locator("#majestios-chat-input").fill("Où trouver les annonces BODACC ?");
    await page.locator(".majestios-chat-form button").click();
    assert.ok((await page.locator(".majestios-chat-message.is-assistant").last().textContent()).includes("BODACC"),
      "Le chatbot doit orienter vers la veille BODACC.");
    assert.equal(await page.locator('.majestios-chat-link[href="bodacc-veille-entreprises.html"]').count(),1,
      "Le chatbot doit proposer la page BODACC dédiée.");

    await page.setViewportSize({width:390,height:844});
    await page.reload({waitUntil:"domcontentloaded"});
    await page.locator(".menu-toggle").click();
    assert.equal(await page.locator("#site-nav").isVisible(),true,"Le menu mobile doit s'ouvrir.");
    const devGroup=page.locator("#site-nav .nav-group").filter({has:page.getByRole("button",{name:"Développement commercial"})});
    await devGroup.locator(".nav-group-trigger").click();
    assert.equal(await devGroup.locator('a[href="accompagnement-appels-offres.html"]').isVisible(),true,
      "Les sous-rubriques doivent rester accessibles sur mobile.");
    await devGroup.locator('a[href="accompagnement-appels-offres.html"]').click();
    await page.waitForURL("**/accompagnement-appels-offres.html");
    assert.equal(await page.locator("#site-nav .nav-group").count(),5,
      "La navigation commune doit être présente après changement de page.");
    assert.equal(await page.locator(".majestios-chat-toggle").count(),1,
      "Le chatbot doit être disponible sur les pages de rubrique.");

    assert.deepEqual(errors,[],"Aucune erreur JavaScript ne doit apparaître pendant le parcours.");
    console.log("TEST NAVIGATION CLASSIQUE RÉUSSI : rubriques, sous-rubriques, liens publiés, accueil, recherche, chatbot et navigation mobile.");
  } finally {
    if(browser) await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
