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
    await page.locator("#site-nav .nav-drawer-section").first().waitFor({state:"attached",timeout:15000});
    await page.locator(".majestios-chat-toggle").waitFor({state:"visible",timeout:15000});

    assert.equal(await page.locator("#site-nav .nav-drawer-section").count(),6,"Les six familles de navigation doivent être présentes.");
    assert.equal(await page.locator("#site-nav .nav-group-items a").count(),20,"Le menu doit exposer les 20 entrées secondaires.");
    assert.equal(await page.locator("#site-nav a").count(),21,"Le menu doit exposer Accueil et les 20 entrées secondaires.");
    assert.equal(await page.locator('#site-nav a[href="developpement-commercial.html"]').count(),1,
      "La page d’orientation Développement commercial doit être accessible depuis son sous-menu.");

    const navigationHrefs=await page.locator("#site-nav a").evaluateAll(links=>links.map(link=>link.getAttribute("href")));
    for(const href of navigationHrefs) assert.ok(published.has(href),"Chaque destination du menu doit être publiée : "+href);
    for (const route of ["marches-publics.html","marches-prives.html","developpement-commercial.html","prospection-active.html","accompagnement-appels-offres.html","bodacc-veille-entreprises.html","qualification-entreprises.html","facturation-electronique.html","salons-seminaires.html","reputation-virtuelle.html","espace-membre.html"]) {
      assert.ok(published.has(route),"La route doit être publiée : "+route);
      assert.equal(await page.locator('#site-nav a[href="'+route+'"]').count(),(route==="accompagnement-appels-offres.html"||route==="facturation-electronique.html")?2:1,"Le menu doit exposer le nombre attendu de liens vers "+route);
    }
    assert.equal(await page.locator("#floor-rows").count(),0,"L'ancien système de navigation par immeuble doit avoir disparu.");
    assert.ok(await page.locator("#home-search-mount").count(),"Le moteur de recherche transversal doit rester présent.");
    await page.locator("#feed-search").waitFor({state:"visible",timeout:15000});

    const opportunityGroup=page.locator("#site-nav .nav-drawer-section").filter({has:page.getByRole("button",{name:"Appels d’offres"})});
    const opportunityTitle=opportunityGroup.locator(".nav-group-link");
    const opportunityMenu=opportunityGroup.locator(".nav-group-items");
    const devGroup=page.locator("#site-nav .nav-drawer-section").filter({has:page.getByRole("button",{name:"Développement commercial"})});
    assert.equal(await opportunityMenu.locator('a[href="facturation-electronique.html"]').count(),1,"La facturation électronique doit être accessible depuis Appels d’offres.");
    assert.equal(await devGroup.locator('.nav-group-items a[href="facturation-electronique.html"]').count(),1,"La facturation électronique doit aussi être accessible depuis Développement commercial.");
    assert.equal(await opportunityTitle.getAttribute("aria-expanded"),"false","Les sous-menus doivent être repliés au chargement.");
    await opportunityGroup.hover();
    assert.equal(await opportunityMenu.isVisible(),true,"Le survol doit ouvrir le sous-menu sur ordinateur.");
    await page.locator("body").hover({position:{x:5,y:5}});
    assert.equal(await opportunityMenu.isVisible(),false,"Le retrait du pointeur doit refermer le sous-menu.");
    await opportunityGroup.locator(".nav-group-link").click();
    await page.waitForURL("**/marches-publics.html");
    assert.match(page.url(),/marches-publics\.html$/,"Le clic desktop sur l’onglet parent doit ouvrir sa rubrique.");
    await page.goto("http://127.0.0.1:4174/",{waitUntil:"domcontentloaded"});
    await page.locator("#site-nav .nav-drawer-section").first().waitFor({state:"attached",timeout:15000});

    const chatToggle=page.locator(".majestios-chat-toggle");
    await chatToggle.click();
    assert.equal(await page.locator("#majestios-chat-panel").isVisible(),true,"Le chatbot doit s'ouvrir.");
    for (const route of ["developpement-commercial.html","espace-membre.html","faq.html"]) {
      assert.ok(await page.locator('.majestios-chat-shortcuts a[href="'+route+'"]').count(),
        "Les raccourcis du guide d’accueil doivent être préservés : "+route);
    }
    await page.locator("#majestios-chat-input").fill("Comment fonctionne la Prospection ?");
    await page.locator(".majestios-chat-form button").click();
    assert.ok((await page.locator(".majestios-chat-message.is-assistant").last().textContent()).includes("Prospection"),
      "Le chatbot doit répondre à une question connue.");
    assert.equal(await page.locator('.majestios-chat-link[href="prospection-active.html"]').count(),1,
      "Le chatbot doit proposer un lien vers la rubrique concernée.");

    await page.setViewportSize({width:390,height:844});
    await page.reload({waitUntil:"domcontentloaded"});
    await page.locator("#site-nav .nav-drawer-section").first().waitFor({state:"attached",timeout:15000});
    const menuButton=page.locator("#menu-toggle");
    await menuButton.waitFor({state:"visible",timeout:15000});
    await menuButton.click();
    assert.equal(await page.locator("#site-nav").evaluate(node=>node.classList.contains("open")),true,
      "Le hamburger doit ouvrir le menu mobile.");
    assert.equal(await menuButton.getAttribute("aria-expanded"),"true","L’état accessible du hamburger doit être synchronisé.");
    assert.equal(await page.locator("#site-nav .nav-group-items:not([hidden])").count(),0,
      "Les sous-menus doivent rester repliés à l’ouverture du hamburger.");
    // Réutilise devGroup déclaré avant le parcours desktop : même groupe DOM, nouveau viewport mobile.
    await devGroup.locator(".nav-group-link").click();
    assert.equal(await devGroup.locator(".nav-group-items").isVisible(),true,
      "Le toucher doit ouvrir le sous-menu Développement commercial.");
    await devGroup.locator('a[href="developpement-commercial.html"]').click();
    await page.waitForURL("**/developpement-commercial.html");
    await page.locator("#site-nav .nav-drawer-section").first().waitFor({state:"attached",timeout:15000});
    assert.equal(await page.locator("#site-nav .nav-drawer-section").count(),6,
      "La navigation commune doit être présente après changement de page.");
    assert.equal(await page.locator("#menu-toggle").count(),1,"Le hamburger doit être disponible sur les pages de rubrique.");
    assert.equal(await page.locator(".majestios-chat-toggle").count(),1,
      "Le chatbot doit être disponible sur les pages de rubrique.");

    assert.deepEqual(errors,[],"Aucune erreur JavaScript ne doit apparaître pendant le parcours.");
    console.log("TEST NAVIGATION RÉUSSI : six familles, destinations publiées, survol desktop, hamburger mobile, sous-menus tactiles, navigation multipage et chatbot.");
  } finally {
    if(browser) await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
