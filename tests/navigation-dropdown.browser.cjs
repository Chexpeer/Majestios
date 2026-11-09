const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..", "dist");
const mime = {".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"text/javascript; charset=utf-8"};

async function main() {
  assert.ok(fs.existsSync(path.join(root,"developpement-commercial.html")),"Construire le site avant le test.");
  const server=http.createServer((req,res)=>{
    const pathname=decodeURIComponent(new URL(req.url,"http://127.0.0.1").pathname);
    const requested=pathname==="/"?"developpement-commercial.html":pathname.replace(/^\/+/, "");
    const file=path.resolve(root,requested);
    if(!file.startsWith(root+path.sep)) return res.writeHead(403).end("Forbidden");
    fs.readFile(file,(error,data)=>{
      if(error) return res.writeHead(404).end("Not found");
      res.writeHead(200,{"content-type":mime[path.extname(file)]||"application/octet-stream"});
      res.end(data);
    });
  });
  await new Promise(resolve=>server.listen(4175,"127.0.0.1",resolve));
  let browser;
  try {
    browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
    const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});
    await page.goto("http://127.0.0.1:4175/",{waitUntil:"domcontentloaded"});
    await page.locator(".menu-toggle").click();
    assert.equal(await page.locator("#site-nav").evaluate(node=>node.classList.contains("open")),true,
      "Le menu mobile principal doit s'ouvrir.");

    const group=page.locator("#site-nav .nav-group").filter({has:page.getByRole("button",{name:"Développement commercial"})});
    const toggle=group.locator(".nav-group-trigger");
    const submenu=group.locator(".nav-group-menu");
    assert.equal(await toggle.getAttribute("aria-controls"),await submenu.getAttribute("id"),
      "Le bouton doit référencer son sous-menu.");
    await toggle.focus();
    assert.equal(await toggle.getAttribute("aria-expanded"),"false",
      "Le simple focus ne doit pas ouvrir le sous-menu.");
    await toggle.click();
    assert.equal(await toggle.getAttribute("aria-expanded"),"true","Le clic doit ouvrir le sous-menu mobile.");
    assert.equal(await submenu.isVisible(),true,"Le sous-menu mobile ouvert doit être visible.");
    await toggle.click();
    assert.equal(await toggle.getAttribute("aria-expanded"),"false","Un second clic doit fermer le sous-menu.");
    assert.equal(await submenu.isVisible(),false,"Le sous-menu mobile fermé doit être masqué.");

    await toggle.focus();
    await page.keyboard.press("ArrowDown");
    assert.equal(await toggle.getAttribute("aria-expanded"),"true","Flèche bas doit ouvrir le sous-menu.");
    assert.equal(await page.evaluate(()=>document.activeElement.textContent.trim()),"Vue d’ensemble",
      "Flèche bas doit placer le focus sur le premier lien.");
    await page.keyboard.press("Escape");
    assert.equal(await toggle.getAttribute("aria-expanded"),"false","Échap doit fermer le sous-menu.");
    assert.equal(await page.evaluate(()=>document.activeElement.classList.contains("nav-group-trigger")),true,
      "Échap doit rendre le focus au bouton.");
    await toggle.click();
    await page.locator("footer.site-footer").click({position:{x:12,y:12}});
    assert.equal(await toggle.getAttribute("aria-expanded"),"false","Un clic extérieur doit fermer le sous-menu.");
    await page.locator(".menu-toggle").click();
    assert.equal(await page.locator("#site-nav").evaluate(node=>node.classList.contains("open")),false,
      "Le menu mobile principal doit se refermer.");

    await page.setViewportSize({width:1365,height:900});
    await page.reload({waitUntil:"domcontentloaded"});
    const desktopGroup=page.locator("#site-nav .nav-group").filter({has:page.getByRole("button",{name:"Développement commercial"})});
    const desktopToggle=desktopGroup.locator(".nav-group-trigger");
    const desktopSubmenu=desktopGroup.locator(".nav-group-menu");
    await desktopToggle.click();
    assert.equal(await desktopToggle.getAttribute("aria-expanded"),"true","Le clic doit ouvrir le sous-menu desktop.");
    assert.equal(await desktopSubmenu.isVisible(),true,"Le sous-menu desktop doit être visible.");
    await page.locator("body").click({position:{x:5,y:5}});
    assert.equal(await desktopToggle.getAttribute("aria-expanded"),"false","Un clic extérieur doit fermer le sous-menu desktop.");
    assert.equal(await desktopSubmenu.isVisible(),false,"Le sous-menu fermé doit être masqué.");
    console.log("TEST NAVIGATION RÉUSSI : ouverture tactile, clic, focus, clavier, Échap, clic extérieur et sous-menus desktop synchronisent visibilité et aria-expanded.");
  } finally {
    if(browser) await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
