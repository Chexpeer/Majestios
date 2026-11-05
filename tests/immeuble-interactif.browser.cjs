const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..", "dist");
const imageWidth = 842;
const imageHeight = 1264;
const expected = [
  {id:"08",name:"Espace privé",route:"espace-membre.html",rect:[185,182,350,82],lines:"ESPACE|PRIVÉ"},
  {id:"07",name:"Réseau",route:"reseaux-synergies.html",rect:[185,266,350,80],lines:"RÉSEAU"},
  {id:"06",name:"Développement commercial",route:"developpement-commercial.html",rect:[185,350,350,92],lines:"DÉVELOPPEMENT|COMMERCIAL"},
  {id:"05",name:"Prospection",route:"prospection-active.html",rect:[185,444,350,81],lines:"PROSPECTION"},
  {id:"04",name:"Accompagnement appels d'offres",route:"accompagnement-appels-offres.html",rect:[185,528,350,87],lines:"ACCOMPAGNEMENT|APPELS D'OFFRES"},
  {id:"03",name:"Marchés publics",route:"marches-publics.html",rect:[185,618,350,83],lines:"MARCHÉS|PUBLICS"},
  {id:"02",name:"Marchés privés",route:"marches-prives.html",rect:[185,704,350,87],lines:"MARCHÉS|PRIVÉS"},
  {id:"01",name:"Réputation virtuelle",route:"reputation-virtuelle.html",rect:[185,794,350,85],lines:"RÉPUTATION|VIRTUELLE"},
  {id:"RDC",name:"Accueil",route:"index.html",rect:[185,883,350,89],lines:"ACCUEIL|MAJESTIOS"}
];
const mime = { ".html":"text/html; charset=utf-8", ".css":"text/css; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".jpg":"image/jpeg", ".jfif":"image/jpeg", ".png":"image/png", ".webp":"image/webp" };

async function main() {
  assert.ok(fs.existsSync(path.join(root,"index.html")), "Exécuter node build.js avant le test.");
  for (const asset of ["IMMEUBLE.jfif","immeuble-masque.png","Designer (2).png"]) {
    assert.ok(fs.existsSync(path.join(root,asset)), "La ressource "+asset+" est absente du build.");
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
    const captureSearchContract = async () => {
      const fields = await page.locator("#advanced-search-form").evaluate(form =>
        [...form.querySelectorAll("input, select, button")].map(field => ({
          id: field.id, type: field.type, required: field.required, disabled: field.disabled
        }))
      );
      await page.locator("#feed-search").click();
      await page.locator("#feed-market-type").selectOption("public");
      const publicCategories = await page.locator("#feed-sector option").evaluateAll(options =>
        options.map(option => ({value:option.value,label:option.textContent.trim(),disabled:option.disabled}))
      );
      await page.locator("#feed-market-type").selectOption("private");
      const privateCategories = await page.locator("#feed-sector option").evaluateAll(options =>
        options.map(option => ({value:option.value,label:option.textContent.trim(),disabled:option.disabled}))
      );
      await page.locator("#feed-sector").selectOption("bodacc-creations");
      const departments = await page.locator("#feed-department option").evaluateAll(options =>
        options.map(option => ({value:option.value,label:option.textContent.trim(),disabled:option.disabled}))
      );
      return {fields,publicCategories,privateCategories,departments};
    };
    const homeSearchContract = await captureSearchContract();
    await page.goto("http://127.0.0.1:4173/contact.html",{waitUntil:"domcontentloaded"});
    const rubricSearchContract = await captureSearchContract();
    assert.deepEqual(rubricSearchContract,homeSearchContract,
      "L’accueil et les rubriques doivent partager exactement les champs, catégories publiques/privées et départements.");
    await page.goto("http://127.0.0.1:4173/",{waitUntil:"domcontentloaded"});
    await page.locator(".building-photo img").evaluate(image=>image.decode());
    assert.deepEqual(
      await page.locator(".building-photo img").evaluate(image=>[image.naturalWidth,image.naturalHeight]),
      [imageWidth,imageHeight],
      "La photographie IMMEUBLE.jfif doit conserver sa définition native."
    );
    assert.deepEqual(
      await page.evaluate(async () => {
        const mask = new Image();
        mask.src = "immeuble-masque.png";
        await mask.decode();
        return [mask.naturalWidth,mask.naturalHeight];
      }),
      [imageWidth,imageHeight],
      "Le masque doit conserver les dimensions natives de la photographie."
    );
    assert.equal(await page.locator("#market-step").isHidden(),true,"Le type de marché doit être masqué au chargement.");
    assert.equal(await page.locator("#category-step").isHidden(),true,"La catégorie doit être masquée au chargement.");
    assert.equal(await page.locator("#department-step").isHidden(),true,"Le département doit être masqué au chargement.");
    await page.locator("#feed-search").click();
    assert.equal(await page.locator("#market-step").isVisible(),true,"Le premier clic dans la recherche doit afficher le type.");
    await page.locator("#feed-market-type").selectOption("public");
    assert.equal(await page.locator("#category-step").isVisible(),true,"Le choix du type doit afficher les catégories.");
    assert.equal(await page.locator("#department-step").isHidden(),true,"Le département doit attendre le choix d'une catégorie.");
    const firstCategory = await page.locator("#feed-sector option").evaluateAll(options => options.find(option => option.value && !option.disabled)?.value);
    assert.ok(firstCategory,"Au moins une catégorie doit être proposée après le choix du type.");
    await page.locator("#feed-sector").selectOption(firstCategory);
    assert.equal(await page.locator("#department-step").isVisible(),true,"Le choix de la catégorie doit afficher le département.");

    for (const viewport of [{width:1365,height:900},{width:390,height:844}]) {
      await page.setViewportSize(viewport);
      await page.goto("http://127.0.0.1:4173/",{waitUntil:"domcontentloaded"});
      const rows = page.locator(".building-hotspots .floor-row");
      await rows.first().waitFor({state:"attached",timeout:15000});
      assert.equal(await rows.count(),9,"Neuf destinations interactives sont attendues.");
      const observed = await rows.evaluateAll(nodes => nodes.map(node => ({
        id:node.dataset.floor,name:node.dataset.name,href:node.getAttribute("href")
      })));
      assert.deepEqual(observed,expected.map(item=>({id:item.id,name:item.name,href:item.route+(item.route==="index.html"?"#accueil":"")})),
        "Les neuf libellés et routes doivent suivre l'architecture V5.");

      for (const item of expected) {
        const canvas=page.locator('.led-sign[data-floor="'+item.id+'"]');
        assert.equal(await canvas.getAttribute("data-label"),item.name,
          "Le panneau LED doit porter le titre de "+item.name+".");
        assert.equal(await canvas.getAttribute("data-title-lines"),item.lines,
          "Le titre LED de "+item.name+" doit être composé sur une ou deux lignes complètes.");
      }

      const screenPointFor = async (item) => {
        const row = page.locator('.building-hotspots .floor-row[data-floor="'+item.id+'"]');
        await row.evaluate(element => element.scrollIntoView({block:"center",inline:"center"}));
        const [rowBox,geometry] = await Promise.all([
          row.evaluate(element => {
            const rect=element.getBoundingClientRect();
            return {x:rect.x,y:rect.y,width:rect.width,height:rect.height};
          }),
          page.evaluate(() => {
            const img=document.querySelector(".building-photo img").getBoundingClientRect();
            const svg=document.querySelector(".building-hotspots").getBoundingClientRect();
            return {img:[img.left,img.top,img.width,img.height],svg:[svg.left,svg.top,svg.width,svg.height]};
          })
        ]);
        assert.ok(rowBox,"La zone SVG "+item.name+" doit rester mesurable après défilement.");
        for (let i=0;i<4;i++) assert.ok(Math.abs(geometry.img[i]-geometry.svg[i])<0.5,"Le calque SVG doit couvrir exactement la photo.");
        const [x,y,w,h]=item.rect;
        const expectedPoint=[geometry.img[0]+(x+w/2)/imageWidth*geometry.img[2],geometry.img[1]+(y+h/2)/imageHeight*geometry.img[3]];
        const actualPoint=[rowBox.x+rowBox.width/2,rowBox.y+rowBox.height/2];
        assert.ok(Math.abs(actualPoint[0]-expectedPoint[0])<1 && Math.abs(actualPoint[1]-expectedPoint[1])<1,
          "La zone "+item.name+" doit rester alignée sur la photographie : "+JSON.stringify({actualPoint,expectedPoint,scrollY:await page.evaluate(()=>window.scrollY)}));
        return actualPoint;
      };
      for (const item of expected) {
        const [px,py]=await screenPointFor(item);
        const hit=await page.evaluate(([cx,cy])=>document.elementFromPoint(cx,cy)?.closest(".floor-row")?.dataset.floor ?? null,[px,py]);
        assert.equal(hit,item.id,"La zone "+item.name+" doit être cliquable à "+viewport.width+" px (point "+px+","+py+").");
      }

      const animationOverride = await page.addStyleTag({content:".elevator-cabin,.elevator-window,.elevator-detail,.elevator-reflection,.elevator-cylinder-side,.elevator-cylinder-rim,.elevator-cylinder-highlight{transition:none!important}"});
      assert.equal(await page.locator(".elevator-controls").count(),0,"Les anciennes commandes d'ascenseur ne doivent plus être présentes.");
      assert.ok((await page.locator(".elevator-cabin").getAttribute("d")).startsWith("M558 157"),
        "La cabine doit être un cylindre SVG vitré, et non un ancien rectangle.");
      assert.equal(await page.locator(".elevator-window").evaluate(element=>getComputedStyle(element).fillOpacity),"0.48",
        "Le vitrage panoramique doit conserver sa transparence.");

      for (const item of expected) {
        const [x,y,w,h]=item.rect;
        const [px,py]=await screenPointFor(item);
        await page.mouse.move(px,py);
        const state=await page.evaluate(() => {
          const active=document.querySelector('.floor-row[aria-current="location"]');
          const cabin=document.querySelector(".elevator-cabin");
          return {
            floor:active?.dataset.floor,
            caption:document.querySelector(".elevator-caption").textContent,
            cabinTransform:new DOMMatrix(getComputedStyle(cabin).transform).m42,
            ledState:document.querySelector('.led-sign[data-floor="'+active?.dataset.floor+'"]')?.dataset.state
          };
        });
        const stop=y+h/2;
        assert.equal(state.floor,item.id,"Le survol doit sélectionner "+item.name+".");
        assert.equal(state.caption,"ASCENSEUR · "+item.name.toLocaleUpperCase("fr-FR"),
          "Le bandeau de l'ascenseur doit annoncer "+item.name+".");
        assert.ok(Math.abs(185+state.cabinTransform-stop)<0.1,
          "La cabine cylindrique doit s'arrêter exactement au centre de l'étage "+item.name+".");
        assert.equal(state.ledState,"paused","Le titre LED complet doit se stabiliser au survol de "+item.name+".");
      }
      await page.mouse.move(2,2);
      assert.equal(await page.locator('.led-sign[data-floor="03"]').getAttribute("data-state"),"scrolling",
        "Le défilement LED doit reprendre après le survol.");

      await page.emulateMedia({reducedMotion:"reduce"});
      await animationOverride.evaluate(style => style.remove());
      assert.equal(await page.locator(".elevator-cabin").evaluate(element=>getComputedStyle(element).transitionDuration),"0s",
        "Le mouvement de l'ascenseur doit respecter la préférence de réduction des animations.");
      await page.emulateMedia({reducedMotion:"no-preference"});
    }

    for (const item of expected) {
      await page.setViewportSize({width:1365,height:900});
      await page.goto("http://127.0.0.1:4173/",{waitUntil:"domcontentloaded"});
      const box=await page.locator(".building-photo img").boundingBox();
      const [x,y,w,h]=item.rect;
      await Promise.all([
        page.waitForURL(url=>url.pathname.endsWith("/"+item.route),{timeout:10000}),
        page.mouse.click(box.x+(x+w/2)/imageWidth*box.width,box.y+(y+h/2)/imageHeight*box.height)
      ]);
      assert.ok(new URL(page.url()).pathname.endsWith("/"+item.route),
        "Un seul clic doit ouvrir directement "+item.name+".");
    }

    await page.goto("http://127.0.0.1:4173/",{waitUntil:"domcontentloaded"});
    await page.locator('.building-hotspots .floor-row[data-floor="06"]').focus();
    assert.equal(await page.locator(".elevator-caption").textContent(),"ASCENSEUR · DÉVELOPPEMENT COMMERCIAL",
      "Le focus clavier doit aussi appeler l'ascenseur au bon étage.");
    await Promise.all([
      page.waitForURL(url=>url.pathname.endsWith("/developpement-commercial.html"),{timeout:10000}),
      page.keyboard.press("Enter")
    ]);
    assert.deepEqual(errors,[],"Aucune erreur JavaScript n'est attendue sur l'accueil.");
    console.log("TEST NAVIGATEUR RÉUSSI : neuf destinations, titres LED complets, survol, cabine cylindrique, clic direct, clavier, mobile et réduction des animations.");
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
