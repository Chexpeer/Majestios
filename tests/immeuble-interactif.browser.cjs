const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..", "dist");
const expected = {
  "01": { name:"Marchés publics", route:"marches-publics.html", center:[314,785] },
  "02": { name:"Marchés privés", route:"marches-prives.html", center:[314,715] },
  "03": { name:"Veille économique", route:"bodacc-veille-entreprises.html", center:[314,637] },
  "04": { name:"Prospection active", route:"prospection-active.html", center:[314,557] },
  "05": { name:"Développement commercial", route:"developpement-commercial.html", center:[314,477] },
  "06": { name:"Accompagnement aux appels d’offres", route:"accompagnement-appels-offres.html", center:[314,397] },
  "07": { name:"Réputation virtuelle", route:"reputation-virtuelle.html", center:[314,320] },
  "08": { name:"Espace entreprises", route:"espace-membre.html", center:[314,242] },
  "09": { name:"IA & Business Intelligence", route:"intelligence-economique.html", center:[314,164] }
};
const rdcPoint = [314,860];
const mime = { ".html":"text/html; charset=utf-8", ".css":"text/css; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".webp":"image/webp" };

async function main() {
  assert.ok(fs.existsSync(path.join(root,"index.html")), "Exécuter node build.js avant le test.");
  assert.ok(fs.existsSync(path.join(root,"IMMEUBLE MajestiOS .webp")), "Photo de l’immeuble absente du build.");
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
    const rows = page.locator(".floor-row");
    await rows.first().waitFor({state:"attached",timeout:15000});
    assert.equal(await rows.count(),9,"Neuf étages cliquables sont attendus (RDC exclu).");
    const observed = await rows.evaluateAll(nodes => nodes.map(node => ({
      floor:node.dataset.floor,name:node.dataset.name,href:node.getAttribute("href")
    })));
    assert.equal(new Set(observed.map(x=>x.name)).size,9,"Les noms d’étage doivent être uniques.");
    for (const [floor,item] of Object.entries(expected)) {
      const found = observed.filter(x=>x.floor===floor);
      assert.equal(found.length,1,"L’étage "+floor+" doit apparaître une seule fois.");
      assert.equal(found[0].name,item.name,"Nom incorrect pour l’étage "+floor);
      assert.equal(found[0].href,item.route,"Destination incorrecte pour l’étage "+floor);
    }
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
      const toScreen=([x,y])=>[geometry.img[0]+x/704*geometry.img[2],geometry.img[1]+y/1114*geometry.img[3]];
      for (const [floor,item] of Object.entries(expected)) {
        const [x,y]=toScreen(item.center);
        const hit=await page.evaluate(([px,py])=>document.elementFromPoint(px,py)?.closest(".floor-row")?.dataset.floor ?? null,[x,y]);
        assert.equal(hit,floor,"Le centre du bandeau "+floor+" doit être cliquable ("+viewport.width+" px).");
      }
      const [rx,ry]=toScreen(rdcPoint);
      const rdcHit=await page.evaluate(([px,py])=>document.elementFromPoint(px,py)?.closest(".floor-row")?.dataset.floor ?? null,[rx,ry]);
      assert.equal(rdcHit,null,"Le RDC ne doit pas être cliquable.");
    }
    await page.setViewportSize({width:1365,height:900});
    for (const [floor,item] of Object.entries(expected)) {
      await page.goto("http://127.0.0.1:4173/",{waitUntil:"domcontentloaded"});
      await page.locator(".building-photo").scrollIntoViewIfNeeded();
      const box=await page.locator(".building-photo img").boundingBox();
      await Promise.all([
        page.waitForURL(url=>url.pathname.endsWith("/"+item.route),{timeout:10000}),
        page.mouse.click(box.x+item.center[0]/704*box.width,box.y+item.center[1]/1114*box.height)
      ]);
      assert.ok(page.url().endsWith("/"+item.route),"Le clic sur l’étage "+floor+" doit ouvrir "+item.route);
    }
    assert.deepEqual(errors,[],"Aucune erreur JavaScript n’est attendue sur l’accueil.");
    console.log("TEST NAVIGATEUR RÉUSSI : neuf zones polygonales, calées sur la photo, testées en desktop et mobile.");
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
