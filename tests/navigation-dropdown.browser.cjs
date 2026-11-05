const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..", "dist");
const mime = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8" };

async function main() {
  assert.ok(fs.existsSync(path.join(root, "developpement-commercial.html")), "Construire le site avant le test.");
  const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, "http://127.0.0.1").pathname);
    const requested = pathname === "/" ? "developpement-commercial.html" : pathname.replace(/^\\/+/, "");
    const file = path.resolve(root, requested);
    if (!file.startsWith(root + path.sep)) return res.writeHead(403).end("Forbidden");
    fs.readFile(file, (error, data) => {
      if (error) return res.writeHead(404).end("Not found");
      res.writeHead(200, { "content-type": mime[path.extname(file)] || "application/octet-stream" });
      res.end(data);
    });
  });
  await new Promise(resolve => server.listen(4175, "127.0.0.1", resolve));
  let browser;
  try {
    browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
    await page.goto("http://127.0.0.1:4175/", { waitUntil: "domcontentloaded" });
    const menuToggle = page.locator(".menu-toggle");
    await menuToggle.click();
    assert.equal(await page.locator("#site-nav").evaluate(node => node.classList.contains("open")), true, "Le menu mobile principal doit s'ouvrir.");
    const dropdown = page.locator(".nav-item-dropdown").filter({ has: page.getByRole("link", { name: "Développement commercial" }) });
    const toggle = dropdown.locator(".nav-dropdown-toggle");
    const submenu = dropdown.locator(".nav-submenu");
    assert.equal(await toggle.getAttribute("aria-controls"), await submenu.getAttribute("id"), "Le bouton doit référencer son sous-menu.");
    await toggle.focus();
    assert.equal(await toggle.getAttribute("aria-expanded"), "false", "Le simple focus tactile/clavier ne doit pas déclencher une ouverture qui serait inversée au clic.");
    await toggle.click();
    assert.equal(await toggle.getAttribute("aria-expanded"), "true", "Le clic doit ouvrir le sous-menu mobile.");
    assert.equal(await submenu.isVisible(), true, "Le sous-menu mobile ouvert doit être visible.");
    await toggle.click();
    assert.equal(await toggle.getAttribute("aria-expanded"), "false", "Un second clic doit fermer le sous-menu.");
    assert.equal(await submenu.isVisible(), false, "Le sous-menu mobile fermé doit être masqué.");
    await page.keyboard.press("ArrowDown");
    assert.equal(await toggle.getAttribute("aria-expanded"), "true", "Flèche bas doit ouvrir le sous-menu.");
    assert.equal(await page.evaluate(() => document.activeElement.textContent.trim()), "Prosp'active", "Flèche bas doit placer le focus sur le premier lien.");
    await page.keyboard.press("Escape");
    assert.equal(await toggle.getAttribute("aria-expanded"), "false", "Échap doit fermer le sous-menu.");
    assert.equal(await page.evaluate(() => document.activeElement.classList.contains("nav-dropdown-toggle")), true, "Échap doit rendre le focus au bouton.");
    await toggle.click();
    await page.locator("h1").click();
    assert.equal(await toggle.getAttribute("aria-expanded"), "false", "Un clic extérieur doit fermer le sous-menu.");
    await menuToggle.click();
    assert.equal(await page.locator("#site-nav").evaluate(node => node.classList.contains("open")), false, "Le menu mobile principal doit se refermer.");

    await page.setViewportSize({ width: 1365, height: 900 });
    await page.reload({ waitUntil: "domcontentloaded" });
    const desktopDropdown = page.locator(".nav-item-dropdown").filter({ has: page.getByRole("link", { name: "Développement commercial" }) });
    const desktopButton = desktopDropdown.locator(".nav-dropdown-toggle");
    const desktopSubmenu = desktopDropdown.locator(".nav-submenu");
    await page.mouse.move(5, 5);
    assert.equal(await desktopButton.getAttribute("aria-expanded"), "false", "Le sous-menu doit être fermé au repos.");
    await desktopDropdown.hover();
    assert.equal(await desktopButton.getAttribute("aria-expanded"), "true", "Le survol doit ouvrir le sous-menu sur ordinateur.");
    assert.equal(await desktopSubmenu.isVisible(), true, "Le sous-menu survolé doit être visible.");
    await page.mouse.move(5, 5);
    assert.equal(await desktopButton.getAttribute("aria-expanded"), "false", "La sortie du survol doit fermer le sous-menu.");
    assert.equal(await desktopSubmenu.isVisible(), false, "Un sous-menu fermé ne doit pas rester affiché via CSS focus-within.");
    console.log("TEST NAVIGATION RÉUSSI : ouverture tactile, clic, focus, clavier, Échap, clic extérieur et survol desktop synchronisent visibilité et aria-expanded.");
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
