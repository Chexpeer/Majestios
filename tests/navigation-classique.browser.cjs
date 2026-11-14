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
  // Inventaire calculé avant les parcours desktop et mobile pour éviter toute référence anticipée.
  const publicPages = manifest.files.filter(file => file.endsWith(".html") &&
    !["crm.html","administration.html","admin-recherches.html","espace-interne.html","espace-prive.html"].includes(file));
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

    // Même inventaire de pages sur mobile : barre compacte, hamburger et tiroir utilisables.
    await page.setViewportSize({width:390,height:844});
    for (const route of publicPages) {
      await page.goto("http://127.0.0.1:4174/"+route,{waitUntil:"domcontentloaded"});
      await page.locator("#site-nav .nav-drawer-section").first().waitFor({state:"attached",timeout:15000});
      const mobileButton = page.locator(".menu-toggle");
      await mobileButton.waitFor({state:"visible",timeout:15000}).catch(error => { throw new Error("Hamburger mobile absent ou masqué sur "+route+" : "+error.message); });
      assert.equal(await page.locator(".site-header").evaluate(node=>getComputedStyle(node).height),"48px",
        "La barre mobile doit conserver sa hauteur commune sur "+route);
      await mobileButton.click();
      assert.equal(await page.locator("#site-nav").evaluate(node=>node.classList.contains("open")),true,
        "Le tiroir mobile doit s'ouvrir sur "+route);
      assert.ok(await page.locator("#site-nav").evaluate(node=>node.getBoundingClientRect().width<=360),
        "Le tiroir mobile doit rester compact sur "+route);
      await page.locator("#site-nav .nav-group-link").first().click();
      assert.equal(await page.locator("#site-nav .nav-group-items").first().isVisible(),true,
        "Le premier sous-menu doit être accessible au toucher sur "+route);
      await mobileButton.click();
    }
    await page.setViewportSize({width:1440,height:900});
    await page.goto("http://127.0.0.1:4174/",{waitUntil:"domcontentloaded"});
    await page.locator("#site-nav .nav-drawer-section").first().waitFor({state:"attached",timeout:15000});
    await page.locator(".majestios-chat-toggle").waitFor({state:"visible",timeout:15000});

    assert.equal(await page.locator("#site-nav .nav-drawer-section").count(),6,"Les six menus de navigation doivent être présents.");
    assert.equal(await page.locator("#site-nav .nav-group-items a").count(),20,"Le menu doit exposer les 20 entrées secondaires.");
    assert.equal(await page.locator("#site-nav a").count(),21,"Le menu doit exposer Accueil et les 20 entrées secondaires.");
    assert.equal(await page.locator(".site-header").evaluate(node=>getComputedStyle(node).height),"40px",
      "La barre de navigation doit rester compacte.");
    assert.equal(await page.locator(".nav-group-link").first().evaluate(node=>getComputedStyle(node).fontSize),"11px",
      "Les onglets desktop doivent conserver une typographie compacte.");
    assert.equal(await page.locator('#site-nav a[href="developpement-commercial.html"]').count(),1,
      "La page d’orientation Développement commercial doit être accessible depuis son sous-menu.");

    const navigationHrefs=await page.locator("#site-nav a").evaluateAll(links=>links.map(link=>link.getAttribute("href")));
    const referenceNavigation = await page.evaluate(() => ({
      groups: [...document.querySelectorAll("#site-nav .nav-drawer-section")].map(section => ({
        label: section.querySelector(".nav-group-link")?.textContent.trim(),
        links: [...section.querySelectorAll(".nav-group-items a")].map(link => [link.textContent.trim(), link.getAttribute("href")])
      })),
      links: [...document.querySelectorAll("#site-nav a")].map(link => link.getAttribute("href")),
      headerHeight: getComputedStyle(document.querySelector(".site-header")).height
    }));
    // Recette de parité sur toutes les pages publiques publiées, y compris l'entrée VIP.
    // Les cockpits CRM / administration / authentification gardent leurs navigations métier dédiées.
    for (const route of publicPages) {
      await page.goto("http://127.0.0.1:4174/"+route,{waitUntil:"domcontentloaded"});
      await page.locator("#site-nav .nav-drawer-section").first().waitFor({state:"attached",timeout:15000});
      await page.waitForFunction(() => document.querySelectorAll("#site-nav .nav-drawer-section").length === 6,{timeout:15000});
      const actualNavigation = await page.evaluate(() => ({
        groups: [...document.querySelectorAll("#site-nav .nav-drawer-section")].map(section => ({
          label: section.querySelector(".nav-group-link")?.textContent.trim(),
          links: [...section.querySelectorAll(".nav-group-items a")].map(link => [link.textContent.trim(), link.getAttribute("href")])
        })),
        links: [...document.querySelectorAll("#site-nav a")].map(link => link.getAttribute("href")),
        headerHeight: getComputedStyle(document.querySelector(".site-header")).height
      }));
      assert.deepEqual(actualNavigation,referenceNavigation,"La barre et les sous-menus doivent être identiques sur "+route);
      assert.equal(await page.locator(".menu-toggle").count(),1,"Le bouton de menu commun doit exister sur "+route);
    }
    await page.goto("http://127.0.0.1:4174/",{waitUntil:"domcontentloaded"});
    await page.locator("#site-nav .nav-drawer-section").first().waitFor({state:"attached",timeout:15000});
    for(const href of navigationHrefs) assert.ok(published.has(href.split("#")[0]),"Chaque destination du menu doit être publiée : "+href);
    for (const route of ["marches-publics.html","marches-prives.html","developpement-commercial.html","prospection-active.html","accompagnement-appels-offres.html","bodacc-veille-entreprises.html","qualification-entreprises.html","facturation-electronique.html","salons-seminaires.html","reputation-virtuelle.html","espace-membre.html","assistant-majestios.html"]) {
      assert.ok(published.has(route),"La route doit être publiée : "+route);
      assert.equal(await page.locator('#site-nav a[href="'+route+'"]').count(),1,"Le menu doit exposer le nombre attendu de liens vers "+route);
    }
    assert.equal(await page.locator("#floor-rows").count(),0,"L'ancien système de navigation par immeuble doit avoir disparu.");
    assert.ok(await page.locator("#home-search-mount").count(),"Le moteur de recherche transversal doit rester présent.");
    await page.locator("#feed-search").waitFor({state:"visible",timeout:15000});

    const opportunityGroup=page.locator("#site-nav .nav-drawer-section").filter({has:page.getByRole("button",{name:"Appels d’offres"})});
    const opportunityTitle=opportunityGroup.locator(".nav-group-link");
    const opportunityMenu=opportunityGroup.locator(".nav-group-items");
    const devGroup=page.locator("#site-nav .nav-drawer-section").filter({has:page.getByRole("button",{name:"Développement commercial"})});
    const servicesGroup=page.locator("#site-nav .nav-drawer-section").filter({has:page.getByRole("button",{name:"Services"})});
    assert.equal(await servicesGroup.locator('a[href="facturation-electronique.html"]').count(),1,"La facturation électronique doit être accessible depuis Services.");
    assert.equal(await devGroup.locator('.nav-group-items a[href="facturation-electronique.html"]').count(),0,"La facturation électronique ne doit apparaître qu’à une seule place (Services).");
    assert.equal(await opportunityTitle.getAttribute("aria-expanded"),"false","Les sous-menus doivent être repliés au chargement.");
    await opportunityGroup.hover();
    assert.equal(await opportunityMenu.isVisible(),true,"Le survol doit ouvrir le sous-menu sur ordinateur.");
    assert.equal(await opportunityMenu.evaluate(node=>getComputedStyle(node).backgroundColor),"rgb(8, 19, 35)",
      "Le sous-menu desktop doit conserver son fond bleu nuit opaque et contrasté.");
    await page.locator("body").hover({position:{x:5,y:5}});
    await page.waitForTimeout(800); // délai de fermeture volontaire de 600 ms
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

    await page.goto("http://127.0.0.1:4174/",{waitUntil:"domcontentloaded"});
    const assistantGroup=page.locator("#site-nav .nav-drawer-section").filter({has:page.getByRole("button",{name:"Assistant"})});
    await assistantGroup.locator(".nav-group-link").click();
    await page.waitForURL("**/assistant-majestios.html");
    assert.match(page.url(),/assistant-majestios\.html$/,"L'entrée Assistant du menu doit ouvrir son espace dédié.");

    await page.setViewportSize({width:390,height:844});
    await page.reload({waitUntil:"domcontentloaded"});
    await page.locator("#site-nav .nav-drawer-section").first().waitFor({state:"attached",timeout:15000});
    const menuButton=page.locator(".menu-toggle");
    await menuButton.waitFor({state:"visible",timeout:15000});
    await menuButton.click();
    assert.equal(await page.locator("#site-nav").evaluate(node=>node.classList.contains("open")),true,
      "Le hamburger doit ouvrir le menu mobile.");
    assert.equal(await menuButton.getAttribute("aria-expanded"),"true","L’état accessible du hamburger doit être synchronisé.");
    assert.ok(await page.locator("#site-nav").evaluate(node=>node.getBoundingClientRect().width<=360),
      "Le tiroir mobile doit rester compact.");
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
    assert.equal(await page.locator(".menu-toggle").count(),1,"Le hamburger doit être disponible sur les pages de rubrique.");
    assert.equal(await page.locator(".majestios-chat-toggle").count(),1,
      "Le chatbot doit être disponible sur les pages de rubrique.");
    await page.goto("http://127.0.0.1:4174/assistant-majestios.html",{waitUntil:"domcontentloaded"});
    await page.locator(".assistant-console").waitFor({state:"visible",timeout:15000});
    await page.locator(".majestios-chat-toggle").waitFor({state:"visible",timeout:15000});
    await page.waitForFunction(() => {
      const toggle = document.querySelector(".majestios-chat-toggle");
      return toggle && toggle.closest(".majestios-chat") && getComputedStyle(toggle.closest(".majestios-chat")).position === "fixed";
    },{timeout:15000});
    assert.ok((await page.locator(".assistant-status").textContent()).includes("IA à raccorder"),
      "L'espace dédié doit annoncer honnêtement que le moteur IA reste à raccorder.");
    await page.locator(".majestios-chat-toggle").click();
    await page.locator("#majestios-chat-input").fill("Comment suivre les annonces BODACC ?");
    await page.locator(".majestios-chat-form button").click();
    assert.ok((await page.locator(".majestios-chat-message.is-assistant").last().textContent()).includes("BODACC"),
      "Le chatbot doit rester utilisable depuis l'espace Assistant.");

    assert.deepEqual(errors,[],"Aucune erreur JavaScript ne doit apparaître pendant le parcours.");
    console.log("TEST NAVIGATION RÉUSSI : six menus, destinations publiées, survol desktop, hamburger mobile, sous-menus tactiles, navigation multipage et chatbot.");
  } finally {
    if(browser) await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
