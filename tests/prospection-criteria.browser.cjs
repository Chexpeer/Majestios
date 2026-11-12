const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..", "dist");
const mime = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8" };

async function main() {
  assert.ok(fs.existsSync(path.join(root, "prospection-active.html")), "Construire le site avant le test.");
  const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, "http://127.0.0.1").pathname);
    const requested = pathname === "/" ? "prospection-active.html" : pathname.replace(/^\/+/, "");
    const file = path.resolve(root, requested);
    if (!file.startsWith(root + path.sep)) return res.writeHead(403).end("Forbidden");
    fs.readFile(file, (error, data) => {
      if (error) return res.writeHead(404).end("Not found");
      res.writeHead(200, { "content-type": mime[path.extname(file)] || "application/octet-stream" });
      res.end(data);
    });
  });
  await new Promise((resolve) => server.listen(4176, "127.0.0.1", resolve));
  let browser;
  try {
    browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await page.goto("http://127.0.0.1:4176/", { waitUntil: "domcontentloaded" });
    const form = page.locator("#company-targeting-form");
    await form.waitFor({ state: "visible" });
    const available = page.locator(".prospecting-criteria-available");
    const selected = page.locator(".prospecting-criteria-selected");
    const editor = page.locator(".prospecting-criteria-editor");
    const criteriaToggle = page.locator("#prospecting-criteria-toggle");
    assert.equal(await criteriaToggle.isVisible(), true, "Le bouton unique de critères doit rester visible.");
    assert.equal(await available.isVisible(), false, "Les choix de critères doivent rester masqués avant activation.");
    await criteriaToggle.click();
    await available.waitFor({ state: "visible" });

    // Add activity, then another group: the first control must remain associated with the form.
    await available.getByRole("button", { name: /Activité APE\/NAF/ }).click();
    await page.locator("#target-naf-codes").fill("43.21A");
    await editor.getByRole("button", { name: "Valider ce critère" }).click();
    assert.equal(await selected.locator(".prospecting-criteria-chip").count(), 1, "L’activité validée doit devenir un critère actif.");
    assert.equal(await available.isVisible(), false, "La liste doit se refermer après validation du premier critère.");
    assert.equal(await available.getByRole("button", { name: /Activité APE\/NAF/ }).count(), 0, "Un critère actif doit disparaître des choix disponibles.");

    await criteriaToggle.click();
    await available.getByRole("button", { name: /Effectif salarié/ }).click();
    await page.locator("#target-workforce").selectOption("10-19");
    await editor.getByRole("button", { name: "Valider ce critère" }).click();
    assert.equal(await selected.locator(".prospecting-criteria-chip").count(), 2, "Les deux critères doivent rester actifs simultanément.");
    assert.equal(await available.isVisible(), false, "La liste doit se refermer après chaque validation.");
    assert.equal(await form.evaluate((node) => Boolean(node.elements.namedItem("nafCodes"))), true, "Le champ APE/NAF doit rester associé au formulaire après changement de critère.");

    // Edit both chips and ensure their values survive each editor transition.
    await selected.getByRole("button", { name: "Modifier le critère Activité APE/NAF" }).click();
    assert.equal(await page.locator("#target-naf-codes").inputValue(), "43.21A", "La valeur APE/NAF doit être conservée à la réouverture.");
    await editor.getByRole("button", { name: "Valider ce critère" }).click();
    await selected.getByRole("button", { name: "Modifier le critère Effectif salarié" }).click();
    assert.equal(await page.locator("#target-workforce").inputValue(), "10-19", "La valeur d’effectif doit être conservée à la réouverture.");
    await editor.getByRole("button", { name: "Valider ce critère" }).click();

    // Remove one filter, reintroduce it, and make sure the other active filter is untouched.
    await selected.getByRole("button", { name: "Retirer le critère Activité APE/NAF" }).click();
    assert.equal(await available.isVisible(), false, "La liste reste repliée après suppression.");
    assert.equal(await selected.locator(".prospecting-criteria-chip").count(), 1, "La suppression ne doit pas effacer les autres critères.");
    await criteriaToggle.click();
    assert.equal(await available.getByRole("button", { name: /Activité APE\/NAF/ }).count(), 1, "Un critère supprimé doit revenir dans la liste disponible.");
    await available.getByRole("button", { name: /Activité APE\/NAF/ }).click();
    assert.equal(await page.locator("#target-naf-codes").inputValue(), "", "Un critère réintroduit doit repartir de valeurs réinitialisées.");
    assert.equal(await form.evaluate((node) => Boolean(node.elements.namedItem("nafCodes"))), true, "Le champ réintroduit doit rester dans le formulaire.");
    await page.locator("#target-naf-codes").fill("43.21A");
    await editor.getByRole("button", { name: "Valider ce critère" }).click();
    assert.equal(await selected.locator(".prospecting-criteria-chip").count(), 2, "Le critère doit pouvoir être ajouté de nouveau.");

    // The mobile layout must not create horizontal overflow.
    const layout = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
      chips: [...document.querySelectorAll(".prospecting-criteria-chip")].map((node) => node.getBoundingClientRect().width),
      offenders: [...document.querySelectorAll("body *")].map(node => ({tag:node.tagName, id:node.id, cls:typeof node.className==="string"?node.className:"", left:Math.round(node.getBoundingClientRect().left), right:Math.round(node.getBoundingClientRect().right), width:Math.round(node.getBoundingClientRect().width), scroll:node.scrollWidth})).filter(x=>x.right>390||x.left<0&&x.width>0).sort((a,b)=>b.right-a.right).slice(0,18)
    }));
    assert.ok(layout.scroll <= layout.viewport, `Le moteur ne doit pas déborder horizontalement sur mobile : ${JSON.stringify(layout)}`);
    assert.ok(layout.chips.every((width) => width > 0 && width <= layout.viewport), `Les filtres actifs doivent rester dans la largeur mobile : ${JSON.stringify(layout)}`);
    assert.deepEqual(pageErrors, [], "La page Prospection ne doit produire aucune erreur JavaScript.");

    console.log("TEST NAVIGATEUR PROSPECTION RÉUSSI : ajout, disparition, modification, suppression, réintroduction, conservation des champs et affichage mobile.");
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
