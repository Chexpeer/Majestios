const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..", "dist");
const expected = [
  {id:"08",name:"Espace privé",route:"espace-membre.html",rect:[185,160,350,100]},
  {id:"07",name:"Réseau",route:"reseaux-synergies.html",rect:[185,258,350,90]},
  {id:"06",name:"Développement commercial",route:"developpement-commercial.html",rect:[185,350,350,90]},
  {id:"05",name:"Prospection",route:"prospection-active.html",rect:[185,442,350,90]},
  {id:"04",name:"Marchés publics",route:"marches-publics.html",rect:[185,534,350,90]},
  {id:"03",name:"Marchés privés",route:"marches-prives.html",rect:[185,626,350,90]},
  {id:"02",name:"Réputation virtuelle",route:"reputation-virtuelle.html",rect:[185,718,350,90]},
  {id:"01",name:"Accueil",route:"index.html",rect:[185,810,350,80]}
];
const mime = { ".html":"text/html; charset=utf-8", ".css":"text/css; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".jpg":"image/jpeg", ".webp":"image/webp" };

async function main() {
  assert.ok(fs.existsSync(path.join(root,"index.html")), "Exécuter node build.js avant le test.");
  assert.ok(fs.existsSync(path.join(root,"Majestios.immeuble.jpg")), "Le nouveau visuel de l'immeuble est absent du build.");
  assert.ok(fs.existsSync(path.join(root,"Majestios.developpement-commercial.jpg")), "Le visuel de Développement commercial est absent du build.");
  for (const asset of ["Marché-Public-.webp","Prospection-.webp","Marcheprive.webp","Reseau.webp"]) {
    assert.ok(fs.existsSync(path.join(root,asset)), "Le fond de rubrique "+asset+" est absent du build.");
  }
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
  await new Promise(resolve => server.listen(4173,"127.0.0.1",resolve));
  let browser;
  try {
    browser = await chromium.launch({headless:true,args:["--no-sandbox"]});
    const page = await browser.newPage({viewport:{width:1365,height:900}});
    const errors = [];
    page.on("pageerror",error => errors.push(error.message));
    await page.goto("http://127.0.0.1:4173/",{waitUntil:"domcontentloaded"});
    await page.locator(".building-photo img").evaluate(image=>image.decode());
    assert.deepEqual(
      await page.locator(".building-photo img").evaluate(image=>[image.naturalWidth,image.naturalHeight]),
      [843,1264],
      "Le panorama ne doit pas être agrandi artificiellement."
    );
    assert.equal(await page.locator("#market-step").isHidden(),true,"Le type de marché doit être masqué au chargement.");
    assert.equal(await page.locator("#category-step").isHidden(),true,"La catégorie doit être masquée au chargement.");
    assert.equal(await page.locator("#department-step").isHidden(),true,"Le département doit être masqué au chargement.");
    await page.locator("#feed-search").click();
    assert.equal(await page.locator("#market-step").isVisible(),true,"Le premier clic dans la recherche doit afficher le type.");
    await page.locator("#feed-market-type").selectOption("public");
    assert.equal(await page.locator("#category-step").isVisible(),true,"Le choix du type doit afficher les catégories.");
    assert.equal(await page.locator("#department-step").isHidden(),true,"Le département doit attendre le choix d'une catégorie.");
    await page.locator("#feed-sector").selectOption("nettoyage");
    assert.equal(await page.locator("#department-step").isVisible(),true,"Le choix de la catégorie doit afficher le département.");
    await page.goto("http://127.0.0.1:4173/",{waitUntil:"domcontentloaded"});
    const rows = page.locator(".building-hotspots .floor-row");
    await rows.first().waitFor({state:"attached",timeout:15000});
    assert.equal(await rows.count(),8,"Huit destinations interactives sont attendues.");
    const observed = await rows.evaluateAll(nodes => nodes.map(node => ({
      id:node.dataset.floor,name:node.dataset.name,href:node.getAttribute("href")
    })));
    assert.deepEqual(observed,expected.map(item=>({id:item.id,name:item.name,href:item.route+(item.route==="index.html"?"#accueil":"")})),
      "Les huit libellés et routes doivent suivre exactement l'architecture V5.");
    for (const viewport of [{width:1365,height:900},{width:390,height:844}]) {
      await page.setViewportSize(viewport);
      await page.goto("http://127.0.0.1:4173/",{waitUntil:"domcontentloaded"});
      await page.locator(".building-photo").scrollIntoViewIfNeeded();
      const geometry = await page.evaluate(() => {
        const img=document.querySelector(".building-photo img").getBoundingClientRect();
        const svg=document.querySelector(".building-hotspots").getBoundingClientRect();
        return {img:[img.left,img.top,img.width,img.height],svg:[svg.left,svg.top,svg.width,svg.height]};
      });
      for (let i=0;i<4;i++) assert.ok(Math.abs(geometry.img[i]-geometry.svg[i])<0.5,"Le calque doit couvrir exactement la photo.");
      const toScreen=([x,y])=>[geometry.img[0]+x/843*geometry.img[2],geometry.img[1]+y/1264*geometry.img[3]];
      for (const item of expected) {
        const [x,y,w,h]=item.rect;
        const [px,py]=toScreen([x+w/2,y+h/2]);
        const hit=await page.evaluate(([cx,cy])=>document.elementFromPoint(cx,cy)?.closest(".floor-row")?.dataset.floor ?? null,[px,py]);
        assert.equal(hit,item.id,"La zone "+item.name+" doit être cliquable à "+viewport.width+" px.");
      }
      const elevatorStops=[210,305,397,487,577,667,757,847];
      assert.equal(await page.locator(".elevator-cabin").evaluate(element=>getComputedStyle(element).transitionDuration),"0.85s",
        "La cabine doit utiliser une transition animée sans préférence de réduction.");
      const instantStyle=await page.addStyleTag({content:".elevator-cabin,.elevator-window{transition:none!important}"});
      const up=page.locator('.elevator-controls [data-lift="up"]');
      const down=page.locator('.elevator-controls [data-lift="down"]');
      assert.equal(await up.getAttribute("aria-label"),"Monter d’un étage","La commande de montée doit être accessible.");
      assert.equal(await down.getAttribute("aria-label"),"Descendre d’un étage","La commande de descente doit être accessible.");
      assert.equal(await page.locator(".elevator-caption").getAttribute("role"),"status",
        "Le niveau actuel doit être annoncé comme statut.");
      assert.equal(await page.locator(".elevator-caption").getAttribute("aria-live"),"polite",
        "Le niveau actuel doit être annoncé sans interrompre le lecteur d’écran.");
      for (let index=expected.length-1;index>=0;index--) {
        if(index<expected.length-1) await up.click();
        const state=await page.evaluate(()=>({
          floor:document.querySelector('.floor-row[aria-current="location"]')?.dataset.floor,
          caption:document.querySelector(".elevator-caption").textContent,
          center:Number(document.querySelector(".elevator-cabin").getAttribute("y"))+
            Number(document.querySelector(".elevator-cabin").getAttribute("height"))/2+
            new DOMMatrix(getComputedStyle(document.querySelector(".elevator-cabin")).transform).m42
        }));
        assert.equal(state.floor,expected[index].id,"La cabine doit sélectionner le bon étage à "+viewport.width+" px.");
        assert.equal(state.caption,"ASCENSEUR · "+expected[index].name.toLocaleUpperCase("fr-FR"),
          "Le libellé de la cabine doit correspondre à "+expected[index].name+".");
        assert.ok(Math.abs(state.center-elevatorStops[index])<0.1,
          "La cabine doit rester dans la gaine au niveau "+expected[index].name+" à "+viewport.width+" px.");
      }
      await down.focus();
      await page.keyboard.press("Enter");
      assert.equal(await page.locator('.floor-row[aria-current="location"]').getAttribute("data-floor"),"07",
        "La commande de descente doit être utilisable au clavier.");
      await up.focus();
      await page.keyboard.press("Space");
      assert.equal(await page.locator('.floor-row[aria-current="location"]').getAttribute("data-floor"),"08",
        "La commande de montée doit être utilisable au clavier.");
      await instantStyle.evaluate(element=>element.remove());
      await page.emulateMedia({reducedMotion:"reduce"});
      assert.equal(await page.locator(".elevator-cabin").evaluate(element=>getComputedStyle(element).transitionDuration),"0s",
        "La cabine doit respecter la préférence de réduction des animations.");
      await page.emulateMedia({reducedMotion:"no-preference"});
    }
    for (const item of expected) {
      await page.setViewportSize({width:1365,height:900});
      await page.goto("http://127.0.0.1:4173/",{waitUntil:"domcontentloaded"});
      const box=await page.locator(".building-photo img").boundingBox();
      const [x,y,w,h]=item.rect;
      await Promise.all([
        page.waitForURL(url=>url.pathname.endsWith("/"+item.route),{timeout:10000}),
        page.mouse.click(box.x+(x+w/2)/843*box.width,box.y+(y+h/2)/1264*box.height)
      ]);
      assert.ok(new URL(page.url()).pathname.endsWith("/"+item.route),"Le clic sur "+item.name+" doit ouvrir "+item.route);
    }
    await page.goto("http://127.0.0.1:4173/",{waitUntil:"domcontentloaded"});
    await Promise.all([
      page.waitForURL(url=>url.pathname.endsWith("/developpement-commercial.html"),{timeout:10000}),
      page.locator('.building-hotspots .floor-row[data-floor="06"]').press("Enter")
    ]);
    assert.ok(new URL(page.url()).pathname.endsWith("/developpement-commercial.html"),
      "La destination sélectionnée doit aussi être accessible au clavier.");
    assert.deepEqual(errors,[],"Aucune erreur JavaScript n’est attendue sur l’accueil.");
    console.log("TEST NAVIGATEUR RÉUSSI : huit destinations, zones, cabine, commandes et lien clavier, réduction des animations et liens testés en desktop et mobile.");
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
