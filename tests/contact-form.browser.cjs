const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..", "dist");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jfif": "image/jpeg"
};

async function main() {
  assert.ok(fs.existsSync(path.join(root, "contact.html")), "Le build doit publier la page Contact.");

  const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, "http://127.0.0.1").pathname);
    const requested = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
    const file = path.resolve(root, requested);
    if (!file.startsWith(root + path.sep)) return res.writeHead(403).end("Forbidden");
    fs.readFile(file, (error, data) => {
      if (error) return res.writeHead(404).end("Not found");
      res.writeHead(200, { "content-type": mime[path.extname(file)] || "application/octet-stream" });
      res.end(data);
    });
  });

  await new Promise(resolve => server.listen(4176, "127.0.0.1", resolve));
  let browser;
  try {
    browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const nonReadRequests = [];
    page.on("request", request => {
      if (!["GET", "HEAD"].includes(request.method())) nonReadRequests.push(request.method() + " " + request.url());
    });

    await page.goto("http://127.0.0.1:4176/index.html", { waitUntil: "domcontentloaded" });
    assert.equal(await page.locator('.homepage-footer a[href="contact.html"]').count(), 1,
      "Le lien Contact de l’accueil doit mener à la nouvelle page.");

    await page.goto("http://127.0.0.1:4176/nous-rejoindre.html", { waitUntil: "domcontentloaded" });
    const collaborationLink = page.getByRole("link", { name: /Demander un échange/ });
    assert.equal(await collaborationLink.getAttribute("href"), "contact.html?objet=collaboration",
      "La proposition de collaboration doit conduire au contact, pas à la création d’un compte client.");

    await page.goto("http://127.0.0.1:4176/contact.html?objet=collaboration", { waitUntil: "domcontentloaded" });
    await page.locator("#advanced-search-form").waitFor({ timeout: 5000 });
    assert.equal(await page.locator("#contact-subject").inputValue(), "collaboration",
      "Le motif de collaboration doit être prérempli depuis la page Nous rejoindre.");
    assert.equal(await page.locator("#lead-form").count(), 1);
    assert.equal(await page.locator("#contact-first-name").isVisible(), true);
    assert.equal(await page.locator("#contact-last-name").isVisible(), true);
    assert.equal(await page.locator("#contact-email").isVisible(), true);
    assert.equal(await page.locator("#contact-phone").isVisible(), true);
    assert.equal(await page.locator("#contact-message").isVisible(), true);

    const prevented = await page.locator("#lead-form").evaluate(form => {
      const event = new Event("submit", { bubbles: true, cancelable: true });
      form.dispatchEvent(event);
      return event.defaultPrevented;
    });
    assert.equal(prevented, true, "Le formulaire ne doit jamais envoyer ou recharger la page.");

    await page.getByRole("button", { name: /Vérifier ma demande/ }).click();
    assert.equal(await page.locator("#contact-first-name").evaluate(el => el.validity.valueMissing), true,
      "Les champs obligatoires doivent être contrôlés avant la prévisualisation.");
    assert.equal(await page.locator("#form-feedback").isVisible(), false,
      "Aucun état de confirmation ne doit apparaître si le formulaire est incomplet.");

    await page.locator("#contact-first-name").fill("Alex");
    await page.locator("#contact-last-name").fill("Martin");
    await page.locator("#contact-email").fill("alex.martin@example.test");
    await page.locator("#contact-phone").fill("0601020304");
    await page.locator("#contact-subject").selectOption("partnership");
    await page.locator("#contact-message").fill("Je souhaite échanger sur une proposition de partenariat.");
    await page.getByRole("button", { name: /Vérifier ma demande/ }).click();

    const feedback = page.locator("#form-feedback");
    await feedback.waitFor({ state: "visible" });
    assert.match(await feedback.textContent(), /Proposition de partenariat/);
    assert.match(await feedback.textContent(), /Aucune donnée n’a été envoyée ni enregistrée/);
    assert.deepEqual(nonReadRequests, [], "La prévisualisation ne doit déclencher aucune requête d’envoi.");

    console.log("TEST CONTACT RÉUSSI : destination dédiée, contexte de collaboration, moteur partagé, validation des champs et absence totale de transmission.");
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
