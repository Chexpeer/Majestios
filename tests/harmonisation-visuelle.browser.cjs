const assert = require("node:assert/strict");
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const root = path.resolve(__dirname, "..", "dist");
const mime = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml" };
(async () => {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname); if (p === "/") p = "/index.html";
    const file = path.join(root, p);
    if (!file.startsWith(root) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { "content-type": mime[path.extname(file)] || "application/octet-stream" }); res.end(fs.readFileSync(file));
  });
  await new Promise((r) => server.listen(4184, "127.0.0.1", r));
  const browser = await chromium.launch();
  try {
    // Cube : quatre faces cliquables, chacune avec son titre et une courte phrase.
    for (const [w, h] of [[1366, 900], [390, 844]]) {
      const page = await browser.newPage({ viewport: { width: w, height: h } });
      await page.goto("http://127.0.0.1:4184/index.html", { waitUntil: "load" });
      const faces = await page.$$eval("a.mj-cube-face", (els) => els.map((e) => ({ href: e.getAttribute("href"), title: e.querySelector("strong")?.textContent.trim(), text: e.querySelector(".mj-face-text")?.textContent.trim() })));
      assert.equal(faces.length, 4, "Le cube doit avoir quatre faces cliquables.");
      for (const f of faces) {
        assert.ok(f.title && f.text, "Chaque face porte un titre et une phrase d'introduction : " + f.href);
        assert.ok(f.text.length >= 25 && f.text.length <= 90, "La phrase doit rester courte : " + f.text);
        assert.doesNotMatch(f.text, /Cheexpeer|IA |intelligence artificielle|plateforme agréée/i, "Aucune promesse de capacité non déployée sur les faces.");
      }
      assert.equal(await page.locator(".mj-core i").count(), 6, "Le noyau de verre a six faces.");
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      assert.ok(overflow <= 1, "Aucun défilement horizontal à " + w + " px (écart " + overflow + ").");
      const stage = await page.locator("#mj-cube-stage").boundingBox();
      assert.ok(stage.x >= -1 && stage.x + stage.width <= w + 1, "Le cube reste dans l'écran à " + w + " px.");
      const h1 = await page.$eval("main h1", (e) => parseFloat(getComputedStyle(e).fontSize));
      assert.ok(h1 <= 50, "Titre d'accueil trop grand : " + h1 + " px.");
      await page.close();
    }
    // Échelle typographique des pages intérieures.
    const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
    for (const file of ["sous-traitance.html", "marches-publics.html", "categorie-batiment.html", "prospection-active.html", "reputation-virtuelle.html", "contact.html"]) {
      await page.goto("http://127.0.0.1:4184/" + file, { waitUntil: "load" });
      const sizes = await page.evaluate(() => ({
        h1: parseFloat(getComputedStyle(document.querySelector("main h1")).fontSize),
        h2: [...document.querySelectorAll("main h2")].filter((e) => e.offsetParent).map((e) => parseFloat(getComputedStyle(e).fontSize))
      }));
      assert.ok(sizes.h1 <= 44, file + " : titre principal trop grand (" + sizes.h1 + " px).");
      for (const s of sizes.h2) assert.ok(s <= 32, file + " : sous-titre trop grand (" + s + " px).");
    }
    // Libellés de formulaire lisibles : plus de rose #c26e70, case à cocher alignée avec son texte.
    await page.goto("http://127.0.0.1:4184/sous-traitance.html", { waitUntil: "load" });
    const label = await page.$eval(".form-field>span", (e) => getComputedStyle(e).color);
    assert.notEqual(label, "rgb(194, 110, 112)", "Libellé de formulaire encore rose.");
    const box = await page.locator('[name="consent"]').evaluate((e) => ({ display: getComputedStyle(e).display, width: e.getBoundingClientRect().width }));
    assert.ok(box.width < 40, "La case à cocher ne doit pas occuper toute la largeur.");
    // Effet « vitre » : calques décoratifs, jamais cliquables, absents des pages d'administration.
    await page.goto("http://127.0.0.1:4184/index.html", { waitUntil: "load" });
    const glass = await page.evaluate(() => ({
      html: getComputedStyle(document.documentElement, "::after").pointerEvents,
      body: getComputedStyle(document.body, "::after").pointerEvents,
      content: getComputedStyle(document.documentElement, "::after").content
    }));
    assert.equal(glass.html, "none", "La vitre ne doit jamais capter le clic.");
    assert.equal(glass.body, "none", "L'éclat ne doit jamais capter le clic.");
    assert.notEqual(glass.content, "none", "Le calque de vitre doit exister sur l'accueil.");
    await page.goto("http://127.0.0.1:4184/administration.html", { waitUntil: "load" });
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement, "::after").content), "none", "Pas de vitre sur l'administration.");
    console.log("Harmonisation visuelle : cube cristal, échelle typographique et formulaires vérifiés.");
  } finally { await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
