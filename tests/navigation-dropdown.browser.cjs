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
    await page.locator("#site-nav .nav-drawer-section").first().waitFor({state:"attached",timeout:15000});
    const menuButton=page.locator("#menu-toggle");
    await menuButton.waitFor({state:"visible",timeout:15000});
    assert.equal(await menuButton.evaluate(el=>getComputedStyle(el).opacity),"1",
      "Le hamburger doit rester visible sur mobile.");
    await menuButton.click();
    assert.equal(await page.locator("#site-nav").evaluate(node=>node.classList.contains("open")),true,
      "Le menu mobile principal doit s'ouvrir.");
    assert.equal(await menuButton.getAttribute("aria-expanded"),"true",
      "L’état aria-expanded du hamburger doit passer à true.");

    const vipLink=page.locator('#site-nav a[href="espace-interne.html"]');
    assert.equal(await vipLink.count(),1,"Le lien VIP doit conduire au parcours d’authentification interne.");
    assert.equal(await vipLink.innerText(),"Accès VIP · Administration","Le libellé doit identifier clairement l’accès administrateur.");
    assert.equal(await vipLink.evaluate(el=>el.classList.contains("nav-vip-link")),true,
      "Le lien VIP doit porter sa classe graphique dédiée bleu nuit, or et chrome.");
    const vipStyle = await vipLink.evaluate(el => {
      const style = getComputedStyle(el);
      return { color: style.color, background: style.backgroundColor, border: style.borderBottomColor };
    });
    assert.equal(vipStyle.color, "rgb(242, 213, 141)",
      "Le texte VIP doit rester or clair pour conserver un contraste lisible sur le tiroir bleu nuit.");
    assert.equal(vipStyle.background, "rgba(0, 0, 0, 0)",
      "Le lien VIP conserve le fond transparent de la navigation.");
    assert.equal(vipStyle.border, "rgba(213, 181, 108, 0.7)",
      "La signature or et chrome doit être portée par un filet discret.");
    assert.equal(await vipLink.evaluate(el=>el.closest(".nav-drawer-section")?.querySelector(".nav-group-link")?.textContent),"Accéder à mon espace personnel",
      "L’accès VIP doit être regroupé dans le menu Accéder à mon espace personnel.");
    const exploreGroup=page.locator("#site-nav .nav-drawer-section").filter({has:page.getByRole("button",{name:"Appels d’offres"})});
    assert.equal(await exploreGroup.locator(".nav-group-items a").count(),5,
      "Appels d’offres doit rester limité à cinq entrées utiles.");

    const group=page.locator("#site-nav .nav-drawer-section").filter({has:page.getByRole("button",{name:"Développement commercial"})});
    const toggle=group.locator(".nav-group-link");
    const submenu=group.locator(".nav-group-items");
    assert.equal(await toggle.getAttribute("aria-controls"),await submenu.getAttribute("id"),
      "Le bouton doit référencer son sous-menu.");
    assert.equal(await toggle.getAttribute("aria-expanded"),"false",
      "Le sous-menu doit être fermé initialement.");
    await toggle.focus();
    assert.equal(await toggle.getAttribute("aria-expanded"),"false",
      "Le focus seul ne doit pas ouvrir le sous-menu tactile.");
    await toggle.click();
    assert.equal(await toggle.getAttribute("aria-expanded"),"true","Le toucher doit ouvrir le sous-menu mobile.");
    assert.equal(await submenu.isVisible(),true,"Le sous-menu mobile ouvert doit être visible.");
    await toggle.click();
    assert.equal(await toggle.getAttribute("aria-expanded"),"false","Un second toucher doit fermer le sous-menu.");
    assert.equal(await submenu.isVisible(),false,"Le sous-menu mobile fermé doit être masqué.");

    await toggle.click();
    assert.equal(await submenu.isVisible(),true,"Le sous-menu doit pouvoir être rouvert.");
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#site-nav").evaluate(node=>node.classList.contains("open")),false,
      "Échap doit fermer le tiroir mobile.");
    assert.equal(await menuButton.getAttribute("aria-expanded"),"false",
      "Échap doit synchroniser l’état accessible du hamburger.");
    await menuButton.click();
    assert.equal(await page.locator("#site-nav").evaluate(node=>node.classList.contains("open")),true,
      "Le hamburger doit pouvoir rouvrir le tiroir après Échap.");
    assert.equal(await page.locator("#site-nav .nav-group-items:not([hidden])").count(),0,
      "La réouverture du tiroir doit retrouver tous les sous-menus repliés.");

    await page.setViewportSize({width:1365,height:900});
    await page.reload({waitUntil:"domcontentloaded"});
    const desktopGroup=page.locator("#site-nav .nav-drawer-section").filter({has:page.getByRole("button",{name:"Développement commercial"})});
    const desktopToggle=desktopGroup.locator(".nav-group-link");
    const desktopSubmenu=desktopGroup.locator(".nav-group-items");
    assert.equal(await desktopToggle.getAttribute("aria-expanded"),"false",
      "Les sous-menus desktop doivent être fermés au chargement.");
    await desktopGroup.hover();
    assert.equal(await desktopToggle.getAttribute("aria-expanded"),"true",
      "Le survol doit ouvrir le sous-menu desktop.");
    assert.equal(await desktopSubmenu.isVisible(),true,
      "Le sous-menu desktop ouvert au survol doit être visible.");
    await desktopSubmenu.locator("a").first().hover();
    assert.equal(await desktopToggle.getAttribute("aria-expanded"),"true",
      "Le sous-menu doit rester ouvert lorsque le pointeur quitte le titre pour rejoindre un lien.");
    assert.equal(await desktopSubmenu.isVisible(),true,
      "Le déplacement du pointeur vers un lien ne doit pas fermer le sous-menu.");
    await page.locator("body").hover({position:{x:5,y:5}});
    await page.waitForTimeout(800); // délai de fermeture volontaire de 600 ms
    assert.equal(await desktopToggle.getAttribute("aria-expanded"),"false",
      "La sortie du pointeur doit refermer le sous-menu desktop.");
    assert.equal(await desktopSubmenu.isVisible(),false,
      "Le sous-menu desktop refermé doit être masqué.");

    await desktopToggle.focus();
    assert.equal(await desktopToggle.getAttribute("aria-expanded"),"true",
      "Le focus clavier doit ouvrir le sous-menu desktop.");
    assert.equal(await desktopSubmenu.isVisible(),true,
      "Le sous-menu doit être visible au focus clavier.");
    await page.locator(".brand").focus();
    assert.equal(await desktopToggle.getAttribute("aria-expanded"),"false",
      "La sortie du focus doit refermer le sous-menu desktop.");
    await desktopGroup.hover();
    await desktopToggle.click();
    await page.waitForURL("**/developpement-commercial.html");
    assert.match(page.url(),/developpement-commercial\.html$/,
      "Le clic desktop sur l’onglet parent doit ouvrir la page de la rubrique.");
    console.log("TEST TIROIRS RÉUSSI : hamburger mobile, aria-expanded, toucher, Échap, survol et focus clavier desktop.");
  } finally {
    if(browser) await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
