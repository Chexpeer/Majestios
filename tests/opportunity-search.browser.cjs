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
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    let apiCalls = 0;
    let bodaccCalls = 0;
    let bodaccDepartmentFilterSeen = false;
    let departmentFilterSeen = false;
    await page.route("https://bodacc-datadila.opendatasoft.com/api/explore/v2.1/**", async (route) => {
      bodaccCalls++;
      const requestUrl = new URL(route.request().url());
      assert.equal(requestUrl.pathname.endsWith("/catalog/datasets/annonces-commerciales/records"), true, "La recherche privée doit utiliser le jeu officiel BODACC.");
      const bodaccWhere = requestUrl.searchParams.get("where") || "";
      if (bodaccWhere.includes('departement_nom_officiel = "Deux-Sèvres"')) bodaccDepartmentFilterSeen = true;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ total_count: 5, records: [
          { record: { fields: {
            id: "BODACC-CREATION-TEST", publicationavis: "A", dateparution: "2026-10-30", numeroannonce: "1002",
            typeavis_lib: "Avis initial", familleavis: "creation", familleavis_lib: "Créations d’entreprises",
            departement_nom_officiel: "Deux-Sèvres", commercant: "Entreprise BODACC création test", ville: "Niort",
            acte: { nature: "Immatriculation et constitution" }, divers: "Création d’entreprise",
            url_complete: "https://www.bodacc.fr/pages/annonces-commerciales-recherche/"
          } } },
          { record: { fields: {
            id: "A202610310001", publicationavis: "A", dateparution: "2026-10-30", numeroannonce: "1001",
            typeavis_lib: "Avis initial", familleavis: "vente", familleavis_lib: "Ventes et cessions",
            departement_nom_officiel: "Deux-Sèvres", commercant: "Entreprise BODACC de test",
            ville: "Niort", registre: "RCS test", listepersonnes: JSON.stringify({ personne: { activite: "Rénovation de bâtiments" } }),
            acte: { nature: "Cession de fonds de commerce" }, divers: "Prestation de services généraux",
            url_complete: "https://www.bodacc.fr/pages/annonces-commerciales-detail/?q.id=id:A202610310001"
          } } },
          { record: { fields: {
            id: "BODACC-MODIFICATION-TEST", publicationavis: "A", dateparution: "2026-10-30", numeroannonce: "1003",
            typeavis_lib: "Avis initial", familleavis: "modification", familleavis_lib: "Modifications d’entreprises",
            departement_nom_officiel: "Deux-Sèvres", commercant: "Entreprise BODACC modification test", ville: "Niort",
            modificationsgenerales: { nature: "Transfert de siège social et changement de dirigeant" },
            url_complete: "https://www.bodacc.fr/pages/annonces-commerciales-recherche/"
          } } },
          { record: { fields: {
            id: "BODACC-PROCEDURE-TEST", publicationavis: "A", dateparution: "2026-10-30", numeroannonce: "1004",
            typeavis_lib: "Avis initial", familleavis: "procedure", familleavis_lib: "Procédures collectives",
            departement_nom_officiel: "Deux-Sèvres", commercant: "Entreprise BODACC procédure test", ville: "Niort",
            jugement: { nature: "Redressement judiciaire" },
            url_complete: "https://www.bodacc.fr/pages/annonces-commerciales-recherche/"
          } } },
          { record: { fields: {
            id: "BODACC-RADIATION-TEST", publicationavis: "A", dateparution: "2026-10-30", numeroannonce: "1005",
            typeavis_lib: "Avis initial", familleavis: "radiation", familleavis_lib: "Radiations et cessations",
            departement_nom_officiel: "Deux-Sèvres", commercant: "Entreprise BODACC radiation test", ville: "Niort",
            acte: { nature: "Radiation d’entreprise et cessation d’activité" },
            url_complete: "https://www.bodacc.fr/pages/annonces-commerciales-recherche/"
          } } }
        ] })
      });
    });
    await page.route("https://boamp-datadila.opendatasoft.com/**", async (route) => {
      apiCalls++;
      const requestUrl = new URL(route.request().url());
      assert.equal(requestUrl.searchParams.get("where")?.includes('nature = "APPEL_OFFRE"'), true, "La requête doit limiter les résultats aux appels d’offres.");
      const where = requestUrl.searchParams.get("where") || "";
      if (where.includes('code_departement_prestation = "79"') && where.includes('code_departement = "79"')) {
        departmentFilterSeen = true;
      }
      const plumbingRecord = {
        idweb: "TEST-2027-001", objet: "Prestations de plomberie et chauffage",
        famille_libelle: "Marchés nationaux", dateparution: "2026-10-30",
        datelimitereponse: "2027-12-01T12:00:00+01:00", nomacheteur: "Acheteur de test",
        code_departement: "79", code_departement_prestation: "79",
        type_marche: "SERVICES", type_marche_facette: "Services", type_avis: "5,1",
        descripteur_libelle: "Plomberie, chauffage", etat: "INITIAL",
        url_avis: "https://www.boamp.fr/pages/avis/?q=idweb%3ATEST-2027-001"
      };
      const digitalRecord = {
        idweb: "TEST-2027-002", objet: "Maintenance informatique et cybersécurité",
        famille_libelle: "Marchés nationaux", dateparution: "2026-10-29",
        datelimitereponse: "2027-12-02T12:00:00+01:00", nomacheteur: "Acheteur numérique de test",
        code_departement: "79", code_departement_prestation: "79",
        type_marche: "SERVICES", type_marche_facette: "Services", type_avis: "5,1",
        descripteur_libelle: "Informatique, cybersécurité, logiciels", etat: "INITIAL",
        url_avis: "https://www.boamp.fr/pages/avis/?q=idweb%3ATEST-2027-002"
      };
      const cleaningRecord = {
        idweb: "TEST-2027-CLEANING", objet: "Prestations de nettoyage des locaux et propreté",
        famille_libelle: "Marchés nationaux", dateparution: "2026-10-30",
        datelimitereponse: "2027-12-03T12:00:00+01:00", nomacheteur: "Acheteur propreté de test",
        code_departement: "79", code_departement_prestation: "79",
        type_marche: "SERVICES", type_marche_facette: "Services", type_avis: "5,1",
        descripteur_libelle: "Nettoyage, entretien des locaux, propreté", etat: "INITIAL",
        url_avis: "https://www.boamp.fr/pages/avis/?q=idweb%3ATEST-2027-CLEANING"
      };
      const expiredRecord = {
        idweb: "TEST-2025-EXPIRED", objet: "Travaux de plomberie terminés",
        famille_libelle: "Marchés nationaux", dateparution: "2025-09-01",
        datelimitereponse: "2025-10-01T12:00:00+02:00", nomacheteur: "Acheteur ancien",
        code_departement: "79", code_departement_prestation: "79",
        type_marche: "TRAVAUX", type_marche_facette: "Travaux", type_avis: "5,1",
        descripteur_libelle: "Plomberie", etat: "INITIAL",
        url_avis: "https://www.boamp.fr/pages/avis/?q=idweb%3ATEST-2025-EXPIRED"
      };
      const isServicesCategory = where.includes('type_marche = "SERVICES"');
      const records = isServicesCategory ? [plumbingRecord, digitalRecord, cleaningRecord, expiredRecord] : [plumbingRecord, cleaningRecord, expiredRecord];
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ total_count: records.length, results: records })
      });
    });

    await page.goto("http://127.0.0.1:4174/prospection-active.html", { waitUntil: "domcontentloaded" });
    await page.locator("#company-targeting-form").waitFor({ state: "visible", timeout: 5000 });
    assert.equal(await page.locator("form.feed-toolbar").count(), 1, "La rubrique Prospection doit afficher un seul moteur de recherche.");
    assert.equal(await page.locator("#advanced-search-form").count(), 0, "Le moteur transversal ne doit pas être injecté en doublon dans Prospection.");
    assert.equal(await page.locator(".rubric-search-card").count(), 0, "Aucune seconde carte de recherche générique ne doit apparaître dans Prospection.");
    assert.equal(await page.locator("#prospecting-criteria-toggle").count(), 1, "Le moteur métier Prospection doit conserver son bouton de critères.");

    await page.goto("http://127.0.0.1:4174/resultats-recherche.html?q=plomberie&marche=public&departement=79", { waitUntil: "domcontentloaded" });
    await page.getByText("Connexion à la source officielle BOAMP en cours…").waitFor({ state: "detached", timeout: 10000 }).catch(() => {});
    await page.getByRole("heading", { name: "Prestations de plomberie et chauffage" }).waitFor({ timeout: 10000 });
    assert.equal(await page.locator(".opportunity-result-card").count(), 1, "Une annonce récupérée doit devenir une carte de résultat.");
    const resultCard = page.locator(".opportunity-result-card").first();
    const publicContact = new URL(await resultCard.locator(".opportunity-contact-link").getAttribute("href"), "http://127.0.0.1:4174/");
    assert.equal(publicContact.pathname, "/contact.html", "Le CTA BOAMP doit conduire au formulaire de contact MajestiOS.");
    assert.equal(publicContact.searchParams.get("objet"), "public-market");
    assert.equal(publicContact.searchParams.get("source"), "BOAMP");
    assert.equal(publicContact.searchParams.get("reference"), "TEST-2027-001");
    assert.equal(publicContact.searchParams.get("q"), "plomberie", "Le CTA doit préserver le mot-clé de recherche.");
    assert.equal(publicContact.searchParams.get("marche"), "public");
    assert.equal(publicContact.searchParams.get("departement"), "79");
    assert.equal(await resultCard.evaluate((card) => card.classList.contains("platform-card")), false, "Les cartes de résultats ne doivent pas hériter des styles legacy platform-card.");
    const mobileLayout = await resultCard.evaluate((card) => ({
      cardWidth: card.getBoundingClientRect().width,
      viewportWidth: document.documentElement.clientWidth,
      cardDisplay: getComputedStyle(card).display,
      paragraphFontSize: parseFloat(getComputedStyle(card.querySelector("p")).fontSize),
      pageScrollWidth: document.documentElement.scrollWidth
    }));
    assert.ok(mobileLayout.cardWidth > 280 && mobileLayout.cardWidth <= mobileLayout.viewportWidth, `La carte doit occuper une largeur mobile lisible : ${JSON.stringify(mobileLayout)}`);
    assert.equal(mobileLayout.cardDisplay, "grid", "Sur mobile, la carte doit utiliser la grille à une colonne.");
    assert.ok(mobileLayout.paragraphFontSize >= 12, `Le texte des annonces ne doit pas retomber sur la police legacy de 9px : ${JSON.stringify(mobileLayout)}`);
    assert.ok(mobileLayout.pageScrollWidth <= mobileLayout.viewportWidth, `La page ne doit pas déborder horizontalement sur mobile : ${JSON.stringify(mobileLayout)}`);
    assert.match(await resultCard.innerText(), /Acheteur de test/);
    assert.equal(await page.getByRole("heading", { name: "Travaux de plomberie terminés" }).count(), 0, "Une annonce dont la date limite est dépassée ne doit pas apparaître dans les résultats.");
    assert.match(await page.locator("#search-active-filters").innerText(), /plomberie/);
    const publicReturnUrl = new URL(await page.locator(".search-results-return a").getAttribute("href"), "http://127.0.0.1:4174/");
    assert.equal(publicReturnUrl.pathname, "/index.html", "Le retour doit ramener au formulaire d’accueil.");
    assert.equal(publicReturnUrl.searchParams.get("q"), "plomberie", "Le retour doit conserver les mots-clés.");
    assert.equal(publicReturnUrl.searchParams.get("marche"), "public", "Le retour doit conserver le type de marché.");
    assert.equal(publicReturnUrl.searchParams.get("departement"), "79", "Le retour doit conserver le département.");
    assert.equal(publicReturnUrl.hash, "", "Le retour doit ouvrir la vraie page d’accueil, sans ancre locale.");
    await page.locator(".search-results-return a").click();
    await page.waitForURL(/index\.html\?q=plomberie.*marche=public.*departement=79|index\.html\?q=plomberie.*departement=79.*marche=public/, { timeout: 10000 });
    assert.equal(await page.locator("#feed-search").inputValue(), "plomberie", "L’accueil doit restaurer les mots-clés au retour.");
    assert.equal(await page.locator("#feed-market-type").inputValue(), "public", "L’accueil doit restaurer le type de marché au retour.");
    assert.equal(await page.locator("#feed-sector").inputValue(), "", "L’accueil doit laisser la catégorie à choisir quand aucun critère n’a été fourni.");
    assert.equal(await page.locator("#feed-department").inputValue(), "79", "L’accueil doit restaurer le département au retour.");
    assert.ok(apiCalls >= 1, "Le moteur doit appeler la source BOAMP.");
    assert.equal(departmentFilterSeen, true, "Une requête BOAMP doit appliquer le filtre du département 79, côté prestation et acheteur.");

    apiCalls = 0;
    bodaccCalls = 0;
    await page.goto("http://127.0.0.1:4174/resultats-recherche.html?marche=private&departement=79&q=r%C3%A9novation", { waitUntil: "domcontentloaded" });
    await page.getByRole("heading", { name: "Entreprise BODACC de test" }).waitFor({ timeout: 10000 });
    assert.equal(await page.locator(".bodacc-result-card").count(), 1, "Une annonce BODACC doit devenir une carte de signal commercial.");
    assert.match(await page.locator(".bodacc-result-card").innerText(), /Ventes et cessions/);
    assert.match(await page.locator(".bodacc-result-card").innerText(), /Deux-Sèvres/);
    assert.match(await page.locator(".bodacc-result-card").innerText(), /Rénovation de bâtiments/);
    assert.match(await page.locator(".bodacc-result-card").innerText(), /A202610310001/, "La référence unique de l’annonce doit être affichée.");
    const privateContact = new URL(await page.locator(".bodacc-result-card .opportunity-contact-link").getAttribute("href"), "http://127.0.0.1:4174/");
    assert.equal(privateContact.searchParams.get("objet"), "private-market");
    assert.equal(privateContact.searchParams.get("source"), "BODACC");
    assert.equal(privateContact.searchParams.get("reference"), "A202610310001");
    assert.equal(privateContact.searchParams.get("q"), "rénovation", "Le CTA BODACC doit préserver le mot-clé de recherche.");
    assert.equal(privateContact.searchParams.get("departement"), "79");
    assert.equal(bodaccCalls, 1, "Une recherche privée doit appeler le jeu officiel BODACC.");
    assert.equal(bodaccDepartmentFilterSeen, true, "Une recherche BODACC avec un département sélectionné doit transmettre le filtre départemental à la source.");
    assert.equal(apiCalls, 0, "Une recherche privée ne doit pas interroger BOAMP ni mélanger des résultats publics.");

    // Chaque famille doit conserver son signal correspondant et exclure les autres familles.
    const bodaccCategoryCases = [
      ["bodacc-creations", "Entreprise BODACC création test"],
      ["bodacc-cessions", "Entreprise BODACC de test"],
      ["bodacc-modifications", "Entreprise BODACC modification test"],
      ["bodacc-procedures", "Entreprise BODACC procédure test"],
      ["bodacc-radiations", "Entreprise BODACC radiation test"]
    ];
    for (const [category, expectedCompany] of bodaccCategoryCases) {
      await page.goto(`http://127.0.0.1:4174/resultats-recherche.html?marche=private&categorie=${category}`, { waitUntil: "domcontentloaded" });
      await page.getByRole("heading", { name: expectedCompany }).waitFor({ timeout: 10000 });
      assert.equal(await page.locator(".bodacc-result-card").count(), 1, `La catégorie ${category} doit afficher uniquement son signal correspondant.`);
    }

    // Le retour depuis une rubrique privée doit restaurer la catégorie privée exacte, sans la convertir en catégorie publique.
    await page.goto("http://127.0.0.1:4174/resultats-recherche.html?q=cession&marche=private&categorie=bodacc-cessions&departement=79", { waitUntil: "domcontentloaded" });
    await page.getByRole("heading", { name: "Entreprise BODACC de test" }).waitFor({ timeout: 10000 });
    await page.locator(".search-results-return a").click();
    await page.waitForURL((url) => {
      const restored = new URL(url);
      return restored.pathname === "/index.html"
        && restored.searchParams.get("q") === "cession"
        && restored.searchParams.get("marche") === "private"
        && restored.searchParams.get("categorie") === "bodacc-cessions"
        && restored.searchParams.get("departement") === "79"
        && restored.hash === "";
    }, { timeout: 10000 });
    assert.equal(await page.locator("#feed-market-type").inputValue(), "private", "Le retour doit restaurer le type privé.");
    assert.equal(await page.locator("#feed-sector").inputValue(), "bodacc-cessions", "Le retour doit restaurer la famille BODACC exacte.");
    assert.equal(await page.locator("#feed-search").inputValue(), "cession", "Le retour doit restaurer le mot-clé privé.");
    assert.equal(await page.locator("#feed-department").inputValue(), "79", "Le retour doit restaurer le département privé.");

    // Les quatre familles privées prévues mais non connectées doivent rester honnêtes :
    // elles affichent leur statut, sans requête BODACC ni résultats inventés.
    const notYetConnectedPrivateCategories = [
      ["immobilier", "Immobilier professionnel"],
      ["emploi", "Emploi et recrutement"],
      ["sous-traitance-offres", "Offres de sous-traitance"],
      ["sous-traitance-recherche", "Recherche de sous-traitants et partenaires"]
    ];
    for (const [category, label] of notYetConnectedPrivateCategories) {
      bodaccCalls = 0;
      await page.goto(`http://127.0.0.1:4174/resultats-recherche.html?marche=private&categorie=${category}`, { waitUntil: "domcontentloaded" });
      await page.getByText(new RegExp(label + ".*source de données n’est pas encore connectée")).waitFor({ timeout: 10000 });
      assert.equal(bodaccCalls, 0, `La rubrique privée non connectée ${category} ne doit pas lancer une recherche BODACC trompeuse.`);
      assert.equal(await page.locator(".bodacc-result-card").count(), 0, `Aucun signal BODACC ne doit être présenté comme une annonce de la rubrique ${category}.`);
    }

    apiCalls = 0;
    bodaccCalls = 0;
    await page.goto("http://127.0.0.1:4174/resultats-recherche.html?marche=all&categorie=services", { waitUntil: "domcontentloaded" });
    await page.getByText(/ne peut pas appliquer une catégorie spécifique aux deux sources/).waitFor({ timeout: 10000 });
    assert.equal(apiCalls, 0, "Une catégorie publique combinée à Publics et privés ne doit pas lancer de recherche ambiguë BOAMP.");
    assert.equal(bodaccCalls, 0, "Une catégorie publique combinée à Publics et privés ne doit pas lancer de recherche ambiguë BODACC.");

    apiCalls = 0;
    bodaccCalls = 0;
    await page.goto("http://127.0.0.1:4174/resultats-recherche.html?marche=all", { waitUntil: "domcontentloaded" });
    await page.getByRole("heading", { name: "Marchés publics · BOAMP" }).waitFor({ timeout: 10000 });
    await page.getByRole("heading", { name: "Signaux d’entreprise publiés · BODACC" }).waitFor({ timeout: 10000 });
    await page.getByRole("heading", { name: "Prestations de plomberie et chauffage" }).waitFor({ timeout: 10000 });
    await page.getByRole("heading", { name: "Entreprise BODACC de test" }).waitFor({ timeout: 10000 });
    assert.equal(apiCalls, 1, "La vue publics et privés doit interroger BOAMP.");
    assert.equal(bodaccCalls, 1, "La vue publics et privés doit interroger BODACC séparément.");
    assert.equal(await page.locator(".opportunity-source-group").count(), 2, "Les deux sources doivent rester dans des groupes distincts.");
    assert.deepEqual(await page.locator(".opportunity-source-group > h3").allTextContents(), [
      "Marchés publics · BOAMP",
      "Signaux d’entreprise publiés · BODACC"
    ], "La recherche combinée doit présenter BOAMP avant BODACC, dans l’ordre annoncé.");
    assert.equal(await page.locator(".opportunity-source-group[aria-label=\"Marchés publics · BOAMP\"] .opportunity-result-card").count(), 2, "Le groupe BOAMP doit afficher les deux résultats publics simulés encore valides.");
    assert.equal(await page.locator(".opportunity-source-group[aria-label=\"Signaux d’entreprise publiés · BODACC\"] .opportunity-result-card").count(), 5, "Le groupe BODACC doit afficher les cinq familles de signaux simulées.");
    assert.ok(await page.locator(".opportunity-result-card").count() <= 10, "Une recherche mixte ne doit jamais afficher plus de dix annonces et signaux au total.");

    await page.goto("http://127.0.0.1:4174/resultats-recherche.html?marche=private&departement=999", { waitUntil: "domcontentloaded" });
    await page.getByText(/Ce département n’est pas reconnu/).waitFor({ timeout: 10000 });
    assert.equal(bodaccCalls, 1, "Un département inconnu doit être rejeté avant tout nouvel appel BODACC.");
    apiCalls = 0;
    await page.goto("http://127.0.0.1:4174/resultats-recherche.html?marche=public&categorie=unknown-category", { waitUntil: "domcontentloaded" });
    await page.getByText(/Cette catégorie publique n’est pas reconnue/).waitFor({ timeout: 10000 });
    assert.equal(apiCalls, 0, "Une catégorie publique inconnue ne doit pas produire des résultats sans filtre.");

    await page.goto("http://127.0.0.1:4174/categorie-services-numeriques.html?categorie=services&marche=public&departement=79", { waitUntil: "domcontentloaded" });
    await page.getByRole("heading", { name: "Maintenance informatique et cybersécurité" }).waitFor({ timeout: 10000 });
    assert.equal(await page.locator("#category-results-panel").count(), 1, "La page de catégorie doit conserver son panneau de résultats.");
    assert.ok((await page.locator(".category-active-filters").innerText()).includes("79 · Deux-Sèvres"), "La page de catégorie doit restituer le département sélectionné.");
    assert.equal(await page.locator(".opportunity-result-card").count(), 1, "La catégorie Services numériques ne doit pas afficher les marchés de plomberie.");
    assert.ok(apiCalls >= 1, "La page de catégorie doit elle aussi lancer la recherche.");
    await page.goto("http://127.0.0.1:4174/index.html", { waitUntil: "domcontentloaded" });
    const publicJobCategories = await page.locator("#feed-sector option").evaluateAll(options => options.filter(option => /emploi|recrutement/i.test(option.textContent || "")).map(option => option.textContent.trim()));
    assert.deepEqual(publicJobCategories, [], "L’emploi ne doit pas apparaître comme une catégorie de marché public.");
    const criteriaToggle = page.locator("#advanced-search-form .feed-criteria-toggle");
    assert.equal(await criteriaToggle.isVisible(), true,
      "Sur l’accueil, le parcours de recherche existant doit rester inchangé.");
    assert.equal(await page.locator("#feed-market-type").isVisible(), false,
      "Le type de marché doit rester masqué au chargement de l’accueil.");
    assert.equal(await page.locator("#feed-sector").isVisible(), false,
      "La catégorie doit rester masquée avant toute action.");
    await criteriaToggle.click();
    await page.locator("#feed-market-type").waitFor({ state: "visible", timeout: 5000 });
    await page.locator("#feed-market-type").selectOption("public");
    await page.locator("#advanced-search-form .feed-criteria-toggle").click();
    await page.locator("#feed-sector").waitFor({ state: "visible", timeout: 5000 });
    const publicCategoryOptions = await page.locator("#feed-sector option").evaluateAll(options => options.map(option => option.value));
    assert.ok(publicCategoryOptions.includes("nettoyage"), "Nettoyage doit figurer dans les catégories de marchés publics.");
    assert.ok(publicCategoryOptions.includes("autre"), "La catégorie Autre doit être disponible pour les marchés publics.");
    assert.ok(!publicCategoryOptions.includes("emploi"), "L’emploi doit rester une catégorie privée et non publique.");
    await page.goto("http://127.0.0.1:4174/resultats-recherche.html?marche=public&categorie=nettoyage", { waitUntil: "domcontentloaded" });
    await page.getByRole("heading", { name: "Prestations de nettoyage des locaux et propreté" }).waitFor({ timeout: 10000 });
    assert.equal(await page.locator(".opportunity-result-card").count(), 1, "Le filtre Nettoyage doit isoler les annonces de propreté.");
    assert.match(await page.locator("#search-active-filters").innerText(), /Nettoyage & propreté/);
    assert.equal(await page.locator("#advanced-search-form").count(), 1, "La page de résultats doit aussi proposer le moteur commun pour affiner les critères.");
    assert.equal(await page.locator("#feed-market-type").count(), 1, "La page de résultats doit réutiliser le champ public/privé commun.");
    await page.goto("http://127.0.0.1:4174/index.html", { waitUntil: "domcontentloaded" });
    await page.locator("#feed-search").focus();
    assert.equal(await page.locator("#feed-market-type").isVisible(), false,
      "Le type de marché doit rester masqué lors du retour sur l’accueil.");
    await page.locator("#advanced-search-form .feed-criteria-toggle").click();
    await page.locator("#feed-market-type").waitFor({ state: "visible", timeout: 5000 });

    // Le mode mixte doit être réellement accessible depuis le formulaire partagé.
    await page.locator("#feed-market-type").selectOption("all");
    assert.equal(await page.locator("#feed-sector").inputValue(), "all", "Le mode mixte doit sélectionner automatiquement toutes les catégories.");
    await Promise.all([
      page.waitForURL(/resultats-recherche\.html\?.*marche=all/),
      page.locator("#advanced-search-form").evaluate(form => form.requestSubmit())
    ]);
    await page.locator(".opportunity-source-group").nth(1).waitFor({ state: "attached", timeout: 10000 });
    assert.equal(await page.locator(".opportunity-source-group").count(), 2, "Le mode mixte doit séparer les résultats BOAMP et BODACC.");

    await page.goto("http://127.0.0.1:4174/index.html", { waitUntil: "domcontentloaded" });
    await page.locator("#feed-search").focus();
    await page.locator("#feed-market-type").waitFor({ state: "visible", timeout: 5000 });
    await page.locator("#feed-market-type").selectOption("private");
    const privateCategoryOptions = await page.locator("#feed-sector option").evaluateAll(options => options.map(option => ({ value: option.value, label: option.textContent.trim() })));
    for (const expected of ["bodacc-creations", "bodacc-cessions", "bodacc-modifications", "bodacc-procedures", "bodacc-radiations", "autre", "immobilier", "emploi", "sous-traitance-offres", "sous-traitance-recherche"]) {
      assert.ok(privateCategoryOptions.some(option => option.value === expected), `La catégorie privée ${expected} doit être proposée.`);
    }
    assert.ok(await page.locator("#feed-sector optgroup[label='Signaux BODACC'] option").count() >= 5, "Les rubriques BODACC doivent être regroupées ensemble.");
    assert.ok(await page.locator("#feed-sector optgroup[label='Autres opportunités privées'] option").count() >= 4, "Immobilier, emploi et sous-traitance doivent former un groupe extensible.");
    assert.equal(await page.locator('#feed-department option[value="79"]').count(), 1, "L’accueil doit proposer un département français filtrable.");
    assert.equal(await page.locator('#feed-department option[value="72"]').count(), 1, "Le département 72 · Sarthe doit être proposé avec son code officiel.");

    // « Autre » est un repli de recherche libre : mot-clé obligatoire et source déterminée par le marché.
    await page.locator("#feed-search").fill("");
    await page.locator("#feed-sector").selectOption("autre");
    assert.equal(await page.locator("#feed-search").getAttribute("required"), "", "La catégorie Autre doit rendre le mot-clé obligatoire.");
    assert.equal(await page.locator("#feed-search").evaluate(input => input.checkValidity()), false, "Autre sans mot-clé doit être invalide.");
    await page.locator("#feed-search").fill("cession");
    await Promise.all([
      page.waitForURL(/resultats-recherche\.html\?.*marche=private.*categorie=autre|resultats-recherche\.html\?.*categorie=autre.*marche=private/),
      page.locator("#advanced-search-form").evaluate(form => form.requestSubmit())
    ]);
    await page.getByRole("heading", { name: "Entreprise BODACC de test" }).waitFor({ timeout: 10000 });
    assert.equal(await page.locator(".bodacc-result-card").count(), 1, "Autre privé doit lancer une recherche BODACC textuelle, sans inventer de famille.");
    assert.match(await page.locator("#search-active-filters").innerText(), /Autre signal BODACC/);

    const callsBeforePublicOther = apiCalls;
    await page.goto("http://127.0.0.1:4174/resultats-recherche.html?marche=public&categorie=autre", { waitUntil: "domcontentloaded" });
    await page.getByText(/La catégorie Autre nécessite un mot-clé/).waitFor({ timeout: 10000 });
    assert.equal(apiCalls, callsBeforePublicOther, "Autre public sans mot-clé ne doit pas appeler BOAMP.");

    const callsBeforePrivateOther = bodaccCalls;
    await page.goto("http://127.0.0.1:4174/resultats-recherche.html?marche=private&categorie=autre", { waitUntil: "domcontentloaded" });
    await page.getByText(/La catégorie Autre nécessite un mot-clé/).waitFor({ timeout: 10000 });
    assert.equal(bodaccCalls, callsBeforePrivateOther, "Autre privé sans mot-clé ne doit pas appeler BODACC.");

    await page.goto("http://127.0.0.1:4174/index.html", { waitUntil: "domcontentloaded" });
    await page.locator("#feed-search").focus();
    await page.locator("#feed-market-type").selectOption("public");
    await page.locator("#feed-sector").selectOption("autre");
    await page.locator("#feed-search").fill("plomberie");
    await Promise.all([
      page.waitForURL(/resultats-recherche\.html\?.*marche=public.*categorie=autre|resultats-recherche\.html\?.*categorie=autre.*marche=public/),
      page.locator("#advanced-search-form").evaluate(form => form.requestSubmit())
    ]);
    await page.getByRole("heading", { name: "Prestations de plomberie et chauffage" }).waitFor({ timeout: 10000 });
    assert.match(await page.locator("#search-active-filters").innerText(), /Autre marché public/);

    // Les rubriques équipées du moteur partagé suivent le filtrage progressif ; Réputation virtuelle reste explicitement exclue.
    for (const destination of ["marches-publics.html", "marches-prives.html", "majestios-v5.html", "categorie-services-numeriques.html", "categorie-travaux-amenagement.html", "categorie-conseil-etudes.html", "categorie-batiment.html", "categorie-renovation.html", "categorie-electricite.html", "categorie-plomberie-chauffage.html", "categorie-maintenance.html", "faq.html", "nous-rejoindre.html", "vision-majestios.html", "qualification-entreprises.html"]) {
      await page.goto(`http://127.0.0.1:4174/${destination}`, { waitUntil: "domcontentloaded" });
      try {
        await page.locator("#advanced-search-form").waitFor({ timeout: 10000 });
      } catch (error) {
        throw new Error(`${destination} : moteur de recherche partagé absent ou non monté. ${error.message}`);
      }
      for (const id of ["feed-search", "feed-sector", "feed-department"]) {
        assert.equal(await page.locator("#" + id).count(), 1, destination + " doit réutiliser le champ commun #" + id + ".");
      }
      const fixedMarketPages = ["marches-publics.html", "marches-prives.html"];
      const fixedMarket = fixedMarketPages.includes(destination);
      const publicContextPages = ["marches-publics.html", "categorie-services-numeriques.html", "categorie-travaux-amenagement.html", "categorie-conseil-etudes.html", "categorie-batiment.html", "categorie-renovation.html", "categorie-electricite.html", "categorie-plomberie-chauffage.html", "categorie-maintenance.html"];
      const contextualMarket = publicContextPages.includes(destination) ? "public" : destination === "marches-prives.html" ? "private" : "";
      if (fixedMarket) {
        assert.equal(await page.locator("#feed-market-type").count(), 0, destination + " ne doit pas afficher de sélecteur public/privé : son marché est fixe.");
        assert.equal(await page.locator("#advanced-search-form").getAttribute("data-fixed-market"), "true");
        assert.equal(await page.locator("#advanced-search-form").getAttribute("data-default-market"), contextualMarket);
      } else {
        assert.equal(await page.locator("#feed-market-type").count(), 1, destination + " doit conserver le champ commun de type de marché.");
        assert.equal(await page.locator("#feed-market-type").inputValue(), contextualMarket, destination + " doit appliquer son type de marché contextuel.");
      }
      const criteriaButton = page.locator(".feed-criteria-toggle");
      assert.equal(await criteriaButton.count(), 1, destination + " doit proposer le bouton unique de filtrage progressif.");
      if (fixedMarket) {
        assert.equal(await page.locator("#category-step").isVisible(), false, destination + " doit masquer la catégorie avant activation.");
        await criteriaButton.click();
        assert.equal(await page.locator("#category-step").isVisible(), true, destination + " doit révéler la catégorie au premier niveau.");
        assert.equal(await page.locator("#market-step").count(), 0, destination + " ne doit pas créer d’étape de sélection du marché.");
        const options = await page.locator("#feed-sector option").evaluateAll(options => options.map(option => option.value));
        if (contextualMarket === "public") {
          assert.ok(options.includes("services"), "Marchés publics doit proposer les catégories BOAMP.");
          assert.equal(options.includes("bodacc-cessions"), false, "Marchés publics ne doit pas mélanger les catégories privées.");
          await page.locator("#feed-sector").selectOption("services");
        } else {
          assert.ok(options.includes("bodacc-cessions"), "Marchés privés doit proposer les familles BODACC.");
          assert.equal(options.includes("services"), false, "Marchés privés ne doit pas mélanger les catégories publiques.");
          await page.locator("#feed-sector").selectOption("bodacc-cessions");
        }
        await criteriaButton.click();
        assert.equal(await page.locator("#department-step").isVisible(), true, destination + " doit révéler le département au niveau suivant.");
      } else {
        assert.equal(await page.locator("#market-step").isVisible(), false, destination + " doit masquer le type avant activation du bouton.");
        assert.equal(await page.locator("#category-step").isVisible(), false, destination + " doit masquer la catégorie avant le choix du marché.");
        await criteriaButton.click();
        assert.equal(await page.locator("#market-step").isVisible(), true, destination + " doit révéler le type de marché au premier niveau.");
        assert.equal(await page.locator("#category-step").isVisible(), false, destination + " ne doit pas révéler la catégorie avant le type.");
        await page.locator("#feed-market-type").selectOption("public");
        await criteriaButton.click();
        assert.equal(await page.locator("#category-step").isVisible(), true, destination + " doit révéler la catégorie après le choix du type.");
        const publicOptions = await page.locator("#feed-sector option").evaluateAll(options => options.map(option => option.value));
        assert.ok(publicOptions.includes("services"), destination + " doit proposer les catégories BOAMP.");
        assert.equal(publicOptions.includes("bodacc-cessions"), false, destination + " ne doit pas mélanger les catégories privées.");
        await page.locator("#feed-market-type").selectOption("private");
        const privateOptions = await page.locator("#feed-sector option").evaluateAll(options => options.map(option => option.value));
        assert.ok(privateOptions.includes("bodacc-cessions"), destination + " doit proposer les familles BODACC.");
        assert.equal(privateOptions.includes("services"), false, destination + " ne doit pas mélanger les catégories publiques.");
        await page.locator("#feed-sector").selectOption("bodacc-cessions");
        await criteriaButton.click();
        assert.equal(await page.locator("#department-step").isVisible(), true, destination + " doit révéler le département après la catégorie.");
      }
      assert.equal(await page.locator('#feed-department option[value="79"]').count(), 1, destination + " doit proposer le département 79.");
    }

    console.log("Recherche navigateur réussie : filtres par département, BOAMP, BODACC, vue combinée et séparation des sources vérifiés.");
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
