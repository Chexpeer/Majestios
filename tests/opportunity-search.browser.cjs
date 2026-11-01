const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..", "dist");
const mime = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8" };

async function main() {
  assert.ok(fs.existsSync(path.join(root, "resultats-recherche.html")), "Le build doit inclure la page générale de résultats.");
  const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, "http://127.0.0.1").pathname);
    const requested = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
    const file = path.resolve(root, requested);
    if (!file.startsWith(root + path.sep) && file !== path.join(root, "index.html")) return res.writeHead(403).end("Forbidden");
    fs.readFile(file, (error, data) => {
      if (error) return res.writeHead(404).end("Not found");
      res.writeHead(200, { "content-type": mime[path.extname(file)] || "application/octet-stream" });
      res.end(data);
    });
  });
  await new Promise((resolve) => server.listen(4174, "127.0.0.1", resolve));
  let browser;
  try {
    browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
    const page = await browser.newPage();
    let apiCalls = 0;
    let bodaccCalls = 0;
    let regionalFilterSeen = false;
    await page.route("https://bodacc-datadila.opendatasoft.com/api/explore/v2.1/**", async (route) => {
      bodaccCalls++;
      const requestUrl = new URL(route.request().url());
      assert.equal(requestUrl.pathname.endsWith("/catalog/datasets/annonces-commerciales/records"), true, "La recherche privée doit utiliser le jeu officiel BODACC.");
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ total_count: 1, records: [{ record: { fields: {
          id: "A202610310001", publicationavis: "A", dateparution: "2026-10-30", numeroannonce: "1001",
          typeavis_lib: "Avis initial", familleavis: "vente", familleavis_lib: "Ventes et cessions",
          departement_nom_officiel: "Deux-Sèvres", commercant: "Entreprise BODACC de test",
          ville: "Niort", registre: "RCS test", listepersonnes: JSON.stringify({ personne: { activite: "Rénovation de bâtiments" } }),
          acte: { nature: "Cession de fonds de commerce" },
          url_complete: "https://www.bodacc.fr/pages/annonces-commerciales-detail/?q.id=id:A202610310001"
        } } }] })
      });
    });
    await page.route("https://boamp-datadila.opendatasoft.com/**", async (route) => {
      apiCalls++;
      const requestUrl = new URL(route.request().url());
      assert.equal(requestUrl.searchParams.get("where")?.includes('nature = "APPEL_OFFRE"'), true, "La requête doit limiter les résultats aux appels d’offres.");
      const where = requestUrl.searchParams.get("where") || "";
      if (where.includes('code_departement_prestation = "79"') && where.includes('code_departement = "79"')) {
        regionalFilterSeen = true;
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ total_count: 1, results: [{
          idweb: "TEST-2027-001", objet: "Prestations de plomberie et chauffage",
          famille_libelle: "Marchés nationaux", dateparution: "2026-10-30",
          datelimitereponse: "2027-12-01T12:00:00+01:00", nomacheteur: "Acheteur de test",
          code_departement: "79", code_departement_prestation: "79",
          type_marche: "SERVICES", type_marche_facette: "Services", type_avis: "5,1",
          descripteur_libelle: "Plomberie, chauffage", etat: "INITIAL",
          url_avis: "https://www.boamp.fr/pages/avis/?q=idweb%3ATEST-2027-001"
        }] })
      });
    });

    await page.goto("http://127.0.0.1:4174/resultats-recherche.html?q=plomberie&marche=public&zone=nouvelle-aquitaine", { waitUntil: "domcontentloaded" });
    await page.getByText("Connexion à la source officielle BOAMP en cours…").waitFor({ state: "detached", timeout: 10000 }).catch(() => {});
    await page.getByRole("heading", { name: "Prestations de plomberie et chauffage" }).waitFor({ timeout: 10000 });
    assert.equal(await page.locator(".opportunity-result-card").count(), 1, "Une annonce récupérée doit devenir une carte de résultat.");
    assert.match(await page.locator(".opportunity-result-card").innerText(), /Acheteur de test/);
    assert.match(await page.locator("#search-active-filters").innerText(), /plomberie/);
    assert.ok(apiCalls >= 1, "Le moteur doit appeler la source BOAMP.");
    assert.equal(regionalFilterSeen, true, "Une requête BOAMP doit appliquer le filtre Nouvelle-Aquitaine au département 79, côté prestation et acheteur.");

    apiCalls = 0;
    bodaccCalls = 0;
    await page.goto("http://127.0.0.1:4174/resultats-recherche.html?marche=private&q=r%C3%A9novation", { waitUntil: "domcontentloaded" });
    await page.getByRole("heading", { name: "Entreprise BODACC de test" }).waitFor({ timeout: 10000 });
    assert.equal(await page.locator(".bodacc-result-card").count(), 1, "Une annonce BODACC doit devenir une carte de signal commercial.");
    assert.match(await page.locator(".bodacc-result-card").innerText(), /Ventes et cessions/);
    assert.match(await page.locator(".bodacc-result-card").innerText(), /Deux-Sèvres/);
    assert.match(await page.locator(".bodacc-result-card").innerText(), /Rénovation de bâtiments/);
    assert.match(await page.locator(".bodacc-result-card").innerText(), /A202610310001/, "La référence unique de l’annonce doit être affichée.");
    assert.equal(bodaccCalls, 1, "Une recherche privée doit appeler le jeu officiel BODACC.");
    assert.equal(apiCalls, 0, "Une recherche privée ne doit pas interroger BOAMP ni mélanger des résultats publics.");

    await page.goto("http://127.0.0.1:4174/categorie-services-numeriques.html?categorie=services&marche=public", { waitUntil: "domcontentloaded" });
    await page.getByRole("heading", { name: "Prestations de plomberie et chauffage" }).waitFor({ timeout: 10000 }).catch(() => {});
    assert.equal(await page.locator("#category-results-panel").count(), 1, "La page de catégorie doit conserver son panneau de résultats.");
    assert.ok(apiCalls >= 1, "La page de catégorie doit elle aussi lancer la recherche.");
    await page.goto("http://127.0.0.1:4174/marches-publics.html", { waitUntil: "domcontentloaded" });
    await page.locator("#rubric-opportunity-search").waitFor({ timeout: 10000 });
    assert.equal(await page.locator('#rubric-opportunity-search input[name="marche"]').inputValue(), "public", "La rubrique Marchés publics doit verrouiller la source publique.");
    assert.equal(await page.locator('#rubric-search-region option[value="nouvelle-aquitaine"]').count(), 1, "Le formulaire doit proposer une vraie région administrative.");
    assert.equal(await page.locator('#rubric-search-region option[value="nord"]').count(), 0, "Les zones de démonstration ne doivent pas être présentées comme des régions réelles.");

    await page.goto("http://127.0.0.1:4174/developpement-commercial.html", { waitUntil: "domcontentloaded" });
    await page.locator("#rubric-opportunity-search").waitFor({ timeout: 10000 });
    assert.equal(await page.locator('#rubric-search-market option[value="private"]').count(), 1, "Le développement commercial doit permettre de choisir les signaux privés BODACC.");

    console.log("Recherche navigateur réussie : critères, source BOAMP simulée, rendu des résultats et séparation des marchés privés vérifiés.");
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
