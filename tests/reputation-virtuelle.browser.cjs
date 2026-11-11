const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..", "dist");
const DOSSIER_KEY = "majestios.reputation.auditDossier.v1";
const LOG_KEY = "majestios.reputation.searchLog.v1";
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".webp": "image/webp"
};

async function main() {
  assert.ok(fs.existsSync(path.join(root, "reputation-virtuelle.html")),
    "Exécuter node build.js avant le test.");
  assert.ok(fs.existsSync(path.join(root, "reputation-virtuelle.js")),
    "Le script Réputation virtuelle doit être inclus dans le build.");

  const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, "http://127.0.0.1").pathname);
    const requested = pathname === "/" ? "reputation-virtuelle.html" : pathname.replace(/^\/+/, "");
    const file = path.resolve(root, requested);
    if (!file.startsWith(root + path.sep)) return res.writeHead(403).end("Forbidden");
    fs.readFile(file, (error, data) => {
      if (error) return res.writeHead(404).end("Not found");
      res.writeHead(200, { "content-type": mime[path.extname(file)] || "application/octet-stream" });
      res.end(data);
    });
  });

  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  const origin = "http://127.0.0.1:" + address.port;
  let browser;

  try {
    browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
    const context = await browser.newContext();
    const page = await context.newPage();
    const pageErrors = [];
    page.on("pageerror", error => pageErrors.push(error.message));
    await page.route("https://www.google.com/**", route => route.abort());
    await page.route("https://esm.sh/@supabase/supabase-js@2.119.0", route => route.fulfill({
      status: 200,
      contentType: "application/javascript",
      headers: { "access-control-allow-origin": "*" },
      body: "export function createClient(){return {auth:{getSession:async()=>({data:{session:{access_token:'test-token'}}})},functions:{invoke:async()=>({data:{status:'collection_only',analysis_unavailable:true,analysis_notice:'La collecte a abouti, mais l’analyse IA est temporairement indisponible.',notice:'Contexte administratif collecté.',evidence_count:1,evidence:[{title:'Atelier Exemple',excerpt:'SIREN 123456789',subject_match:'confirmed',reference:'https://recherche-entreprises.api.gouv.fr/search?q=Atelier'}]},error:null})}}}"
    }));

    await page.goto(origin + "/", { waitUntil: "domcontentloaded" });
    assert.equal(await page.locator(".audit-dossier").isVisible(), false,
      "Le formulaire principal de préparation d’audit ne doit pas être visible dans la rubrique publique.");
    assert.equal(await page.locator(".reputation-searches").isVisible(), true,
      "Google Web et Google Maps doivent rester accessibles dans la rubrique publique.");
    // Les contrôles masqués sont temporairement révélés dans le test uniquement pour préserver la recette de leur logique interne.
    await page.evaluate(() => {
      document.querySelector(".audit-dossier").hidden = false;
    });
    const dossierForm = page.locator("[data-audit-dossier-form]");
    await dossierForm.locator('[name="company"]').fill('<img src=x onerror="alert(1)"> Atelier Exemple');
    await dossierForm.locator('[name="siren"]').fill("123456789");
    await dossierForm.locator('[name="activity"]').fill("Menuiserie");
    await dossierForm.locator('[name="website"]').fill("https://example.com");
    await dossierForm.locator('[name="territory"]').fill("Le Mans et Sarthe");
    await dossierForm.locator('[name="audience"]').selectOption({ label: "Professionnels (B2B)" });
    await dossierForm.locator('[name="objective"]').selectOption({ label: "Obtenir des demandes de devis" });
    await dossierForm.locator('button[type="submit"]').click();

    assert.equal(await page.locator("[data-audit-dossier-state]").textContent(),
      "Dossier préparé · session en cours", "Le dossier valide doit être préparé.");
    assert.equal(await page.locator("[data-audit-run]").isEnabled(), true, "Le lancement Cheexpeer doit être activé après préparation du dossier.");
    assert.equal(await page.evaluate(key => JSON.parse(sessionStorage.getItem(key)).company, DOSSIER_KEY),
      '<img src=x onerror="alert(1)"> Atelier Exemple',
      "Le dossier doit être enregistré sans altération dans sessionStorage.");
    assert.equal(await page.locator("[data-audit-dossier-summary] img").count(), 0,
      "Les données saisies ne doivent jamais être interprétées comme du HTML.");
    assert.ok((await page.locator("[data-audit-dossier-summary]").innerText()).includes('<img src=x onerror="alert(1)">'),
      "La valeur contenant du balisage doit être affichée comme du texte.");

    await page.locator("[data-audit-run]").click();
    await page.getByText("La collecte a abouti, mais l’analyse IA est temporairement indisponible.").waitFor();
    assert.equal(await page.locator("[data-consultation-status]").textContent(),
      "Collecte seule · analyse IA indisponible",
      "Une panne IA doit être distinguée de l’absence de configuration.");

    await page.reload({ waitUntil: "domcontentloaded" });
    assert.equal(await page.locator(".audit-dossier").isVisible(), false,
      "Les formulaires doivent rester masqués après rechargement.");
    assert.equal(await page.locator(".reputation-searches").isVisible(), true,
      "Les recherches Google Web et Maps doivent rester visibles après rechargement.");
    await page.evaluate(() => {
      document.querySelector(".audit-dossier").hidden = false;
    });
    assert.equal(await page.locator('[name="company"]').inputValue(),
      '<img src=x onerror="alert(1)"> Atelier Exemple',
      "Les champs doivent être restaurés après rechargement de la page dans la même session.");
    assert.equal(await page.locator("[data-audit-dossier-state]").textContent(),
      "Dossier préparé · session en cours", "Le dossier doit être restauré depuis sessionStorage.");

    const webForm = page.locator('form[data-reputation-search="web"]');
    const webQuery = webForm.locator('input[type="search"]');
    for (let i = 0; i < 55; i++) {
      await webQuery.fill("requete-" + String(i).padStart(2, "0"));
      await webForm.locator('button[type="submit"]').click();
    }

    const storedLog = await page.evaluate(key => JSON.parse(sessionStorage.getItem(key)), LOG_KEY);
    assert.equal(storedLog.length, 50, "Le journal doit être limité à 50 entrées.");
    assert.equal(storedLog[0].query, "requete-05", "Le journal doit supprimer les cinq entrées les plus anciennes.");
    assert.equal(storedLog[49].query, "requete-54", "Le journal doit conserver la recherche la plus récente.");
    assert.ok(storedLog.every(entry => entry.type === "Google Web" && Number.isFinite(Date.parse(entry.at))),
      "Chaque entrée doit conserver le type de recherche et un horodatage valide.");
    assert.equal(await page.locator("[data-audit-dossier-summary] li").count(), 50,
      "L’interface doit présenter au maximum les 50 entrées conservées.");

    const mapsForm = page.locator('form[data-reputation-search="maps"]');
    await mapsForm.locator('input[type="search"]').fill("Le Mans centre");
    await mapsForm.locator('button[type="submit"]').click();
    const mapsFrame = page.locator("[data-consultation-content] iframe");
    assert.equal(await mapsFrame.getAttribute("src"),
      "https://www.google.com/maps?q=Le%20Mans%20centre&output=embed",
      "La recherche cartographique doit utiliser l’URL Google Maps encodée.");
    const mapsFallback = page.locator("[data-consultation-content] a");
    assert.equal(await mapsFallback.getAttribute("href"),
      "https://www.google.com/maps/search/?api=1&query=Le%20Mans%20centre",
      "Un lien de secours Google Maps doit être proposé.");
    assert.equal(await mapsFallback.getAttribute("rel"), "noopener noreferrer",
      "Le lien externe doit être isolé de la fenêtre ouvrante.");

    await page.locator("[data-audit-dossier-reset]").click();
    assert.equal(await page.evaluate(key => sessionStorage.getItem(key), DOSSIER_KEY), null,
      "La réinitialisation doit supprimer le dossier de session.");
    assert.equal(await page.evaluate(key => sessionStorage.getItem(key), LOG_KEY), null,
      "La réinitialisation doit supprimer le journal de session.");
    assert.equal(await page.locator("[data-audit-dossier-state]").textContent(),
      "Dossier non renseigné", "L’interface doit revenir à l’état initial.");
    assert.equal(await page.locator("[data-audit-run]").isDisabled(), true, "Le lancement Cheexpeer doit être désactivé après réinitialisation.");
    assert.equal(await page.locator('[name="company"]').inputValue(), "",
      "La réinitialisation doit vider les champs du formulaire.");
    assert.equal(await page.locator("[data-audit-dossier-summary] li").count(), 0,
      "Le journal ne doit plus être affiché après réinitialisation.");

    assert.deepEqual(pageErrors, [], "Aucune erreur JavaScript ne doit apparaître dans le navigateur.");
    console.log("Réputation virtuelle : dossier, restauration, journal (50), Google Maps, échappement DOM et réinitialisation — OK");
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
