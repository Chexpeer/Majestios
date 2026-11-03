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
    let bodaccRegionFilterSeen = false;
    let regionalFilterSeen = false;
    await page.route("https://bodacc-datadila.opendatasoft.com/api/explore/v2.1/**", async (route) => {
      bodaccCalls++;
      const requestUrl = new URL(route.request().url());
      assert.equal(requestUrl.pathname.endsWith("/catalog/datasets/annonces-commerciales/records"), true, "La recherche privée doit utiliser le jeu officiel BODACC.");
      const bodaccWhere = requestUrl.searchParams.get("where") || "";
      if (bodaccWhere.includes('region_nom_officiel = "Nouvelle-Aquitaine"')) bodaccRegionFilterSeen = true;
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
        regionalFilterSeen = true;
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
      const records = isServicesCategory ? [plumbingRecord, digitalRecord, expiredRecord] : [plumbingRecord, expiredRecord];
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ total_count: records.length, results: records })
      });
    });

    await page.goto("http://127.0.0.1:4174/resultats-recherche.html?q=plomberie&marche=public&zone=nouvelle-aquitaine", { waitUntil: "domcontentloaded" });
    await page.getByText("Connexion à la source officielle BOAMP en cours…").waitFor({ state: "detached", timeout: 10000 }).catch(() => {});
    await page.getByRole("heading", { name: "Prestations de plomberie et chauffage" }).waitFor({ timeout: 10000 });
    assert.equal(await page.locator(".opportunity-result-card").count(), 1, "Une annonce récupérée doit devenir une carte de résultat.");
    const resultCard = page.locator(".opportunity-result-card").first();
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
    assert.equal(publicReturnUrl.searchParams.get("zone"), "nouvelle-aquitaine", "Le retour doit conserver la région.");
    assert.equal(publicReturnUrl.hash, "#recherche-avancee", "Le retour doit replacer l’utilisateur sur le moteur de recherche.");
    await page.locator(".search-results-return a").click();
    await page.waitForURL(/index\.html\?q=plomberie.*marche=public.*zone=nouvelle-aquitaine.*#recherche-avancee|index\.html\?q=plomberie.*zone=nouvelle-aquitaine.*marche=public.*#recherche-avancee/, { timeout: 10000 });
    assert.equal(await page.locator("#feed-search").inputValue(), "plomberie", "L’accueil doit restaurer les mots-clés au retour.");
    assert.equal(await page.locator("#feed-market-type").inputValue(), "public", "L’accueil doit restaurer le type de marché au retour.");
    assert.equal(await page.locator("#feed-sector").inputValue(), "all", "L’accueil doit restaurer une catégorie non précisée sans en inventer.");
    assert.equal(await page.locator("#feed-region").inputValue(), "nouvelle-aquitaine", "L’accueil doit restaurer la région au retour.");
    assert.ok(apiCalls >= 1, "Le moteur doit appeler la source BOAMP.");
    assert.equal(regionalFilterSeen, true, "Une requête BOAMP doit appliquer le filtre Nouvelle-Aquitaine au département 79, côté prestation et acheteur.");

    apiCalls = 0;
    bodaccCalls = 0;
    await page.goto("http://127.0.0.1:4174/resultats-recherche.html?marche=private&zone=nouvelle-aquitaine&q=r%C3%A9novation", { waitUntil: "domcontentloaded" });
    await page.getByRole("heading", { name: "Entreprise BODACC de test" }).waitFor({ timeout: 10000 });
    assert.equal(await page.locator(".bodacc-result-card").count(), 1, "Une annonce BODACC doit devenir une carte de signal commercial.");
    assert.match(await page.locator(".bodacc-result-card").innerText(), /Ventes et cessions/);
    assert.match(await page.locator(".bodacc-result-card").innerText(), /Deux-Sèvres/);
    assert.match(await page.locator(".bodacc-result-card").innerText(), /Rénovation de bâtiments/);
    assert.match(await page.locator(".bodacc-result-card").innerText(), /A202610310001/, "La référence unique de l’annonce doit être affichée.");
    assert.equal(bodaccCalls, 1, "Une recherche privée doit appeler le jeu officiel BODACC.");
    assert.equal(bodaccRegionFilterSeen, true, "Une recherche BODACC avec une région sélectionnée doit transmettre le filtre régional à la source.");
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
    await page.goto("http://127.0.0.1:4174/resultats-recherche.html?q=cession&marche=private&categorie=bodacc-cessions&zone=nouvelle-aquitaine", { waitUntil: "domcontentloaded" });
    await page.getByRole("heading", { name: "Entreprise BODACC de test" }).waitFor({ timeout: 10000 });
    await page.locator(".search-results-return a").click();
    await page.waitForURL((url) => {
      const restored = new URL(url);
      return restored.pathname === "/index.html"
        && restored.searchParams.get("q") === "cession"
        && restored.searchParams.get("marche") === "private"
        && restored.searchParams.get("categorie") === "bodacc-cessions"
        && restored.searchParams.get("zone") === "nouvelle-aquitaine"
        && restored.hash === "#recherche-avancee";
    }, { timeout: 10000 });
    assert.equal(await page.locator("#feed-market-type").inputValue(), "private", "Le retour doit restaurer le type privé.");
    assert.equal(await page.locator("#feed-sector").inputValue(), "bodacc-cessions", "Le retour doit restaurer la famille BODACC exacte.");
    assert.equal(await page.locator("#feed-search").inputValue(), "cession", "Le retour doit restaurer le mot-clé privé.");
    assert.equal(await page.locator("#feed-region").inputValue(), "nouvelle-aquitaine", "Le retour doit restaurer la région privée.");

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
    assert.equal(await page.locator(".opportunity-source-group[aria-label=\"Marchés publics · BOAMP\"] .opportunity-result-card").count(), 1, "Le groupe BOAMP doit afficher son résultat public simulé.");
    assert.equal(await page.locator(".opportunity-source-group[aria-label=\"Signaux d’entreprise publiés · BODACC\"] .opportunity-result-card").count(), 5, "Le groupe BODACC doit afficher les cinq familles de signaux simulées.");
    assert.ok(await page.locator(".opportunity-result-card").count() <= 10, "Une recherche mixte ne doit jamais afficher plus de dix annonces et signaux au total.");

    await page.goto("http://127.0.0.1:4174/resultats-recherche.html?marche=private&zone=outre-mer", { waitUntil: "domcontentloaded" });
    await page.getByText(/filtre BODACC pour l’Outre-mer n’est pas encore pris en charge/).waitFor({ timeout: 10000 });
    assert.equal(bodaccCalls, 1, "Un filtre BODACC non pris en charge ne doit pas lancer de recherche territoriale trompeuse.");

    await page.goto("http://127.0.0.1:4174/resultats-recherche.html?marche=private&zone=nord", { waitUntil: "domcontentloaded" });
    await page.getByText(/zone n’est pas encore disponible comme filtre BODACC/).waitFor({ timeout: 10000 });
    assert.equal(bodaccCalls, 1, "Une zone inconnue ou de démonstration ne doit pas lancer une recherche BODACC sans filtre géographique.");

    await page.goto("http://127.0.0.1:4174/categorie-services-numeriques.html?categorie=services&marche=public", { waitUntil: "domcontentloaded" });
    await page.getByRole("heading", { name: "Maintenance informatique et cybersécurité" }).waitFor({ timeout: 10000 });
    assert.equal(await page.locator("#category-results-panel").count(), 1, "La page de catégorie doit conserver son panneau de résultats.");
    assert.equal(await page.locator(".opportunity-result-card").count(), 1, "La catégorie Services numériques ne doit pas afficher les marchés de plomberie.");
    assert.ok(apiCalls >= 1, "La page de catégorie doit elle aussi lancer la recherche.");
    await page.goto("http://127.0.0.1:4174/index.html", { waitUntil: "domcontentloaded" });
    const publicJobCategories = await page.locator("#feed-sector option").evaluateAll(options => options.filter(option => /emploi|recrutement/i.test(option.textContent || "")).map(option => option.textContent.trim()));
    assert.deepEqual(publicJobCategories, [], "L’emploi ne doit pas apparaître comme une catégorie de marché public.");
    await page.locator("#feed-search").focus();
    await page.locator("#feed-market-type").waitFor({ state: "visible", timeout: 5000 });
    await page.locator("#feed-market-type").selectOption("private");
    const privateCategoryOptions = await page.locator("#feed-sector option").evaluateAll(options => options.map(option => ({ value: option.value, label: option.textContent.trim() })));
    for (const expected of ["bodacc-creations", "bodacc-cessions", "bodacc-modifications", "bodacc-procedures", "bodacc-radiations", "immobilier", "emploi", "sous-traitance-offres", "sous-traitance-recherche"]) {
      assert.ok(privateCategoryOptions.some(option => option.value === expected), `La catégorie privée ${expected} doit être proposée.`);
    }
    assert.ok(await page.locator("#feed-sector optgroup[label='Signaux BODACC'] option").count() >= 5, "Les rubriques BODACC doivent être regroupées ensemble.");
    assert.ok(await page.locator("#feed-sector optgroup[label='Autres opportunités privées'] option").count() >= 4, "Immobilier, emploi et sous-traitance doivent former un groupe extensible.");
    assert.equal(await page.locator('#feed-region option[value="nouvelle-aquitaine"]').count(), 1, "L’accueil doit proposer une région administrative filtrable.");
    const demoRegion = page.locator('#feed-region option[value="nord"]');
    assert.equal(await demoRegion.count(), 1, "Les anciennes zones de démonstration peuvent rester documentées.");
    const demoRegionState = await demoRegion.evaluate((option) => ({ disabled: option.disabled, attribute: option.getAttribute("disabled"), parentDisabled: option.parentElement?.disabled, parentTag: option.parentElement?.tagName }));
    assert.ok(demoRegionState.disabled || demoRegionState.parentDisabled, `Les zones Nord/Ouest/Sud de démonstration doivent rester désactivées et non filtrables : ${JSON.stringify(demoRegionState)}`);
    assert.equal(await page.locator('#feed-region optgroup').getAttribute("label"), "Régions françaises · à connecter", "Le groupe des régions non disponibles doit être clairement identifié.");

    await page.goto("http://127.0.0.1:4174/marches-publics.html", { waitUntil: "domcontentloaded" });
    await page.locator("#advanced-search-form").waitFor({ timeout: 10000 });
    assert.equal(await page.locator('#advanced-search-form input[name="marche"]').inputValue(), "public", "La rubrique Marchés publics doit verrouiller la source publique.");
    assert.equal(await page.locator('#feed-region option[value="nouvelle-aquitaine"]').count(), 1, "Le formulaire doit proposer une vraie région administrative.");
    assert.equal(await page.locator('#feed-region option[value="nord"]').count(), 0, "Les zones de démonstration ne doivent pas être présentées comme des régions réelles.");

    await page.goto("http://127.0.0.1:4174/developpement-commercial.html", { waitUntil: "domcontentloaded" });
    await page.locator("#advanced-search-form").waitFor({ timeout: 10000 });
    assert.equal(await page.locator("#advanced-search-form").count(), 1, "Développement commercial ne doit contenir qu’un seul moteur partagé.");
    assert.ok(await page.locator(".rubric-shared-search").evaluate((element) => element.getBoundingClientRect().width <= 560), "Le moteur de rubrique doit rester compact et aligné sur la colonne gauche.");
    assert.equal(await page.locator('#feed-market-type option[value="private"]').count(), 1, "Le développement commercial doit permettre de choisir les signaux privés BODACC.");

    await page.goto("http://127.0.0.1:4174/marches-prives.html", { waitUntil: "domcontentloaded" });
    await page.locator("#advanced-search-form").waitFor({ state: "attached", timeout: 10000 });
    const privateRubricOptions = await page.locator("#feed-sector option").evaluateAll(options => options.map(option => ({ value: option.value, label: option.textContent.trim() })));
    assert.ok(privateRubricOptions.some(option => option.value === "bodacc-cessions"), "La rubrique Marchés privés doit proposer les familles BODACC.");
    assert.ok(privateRubricOptions.some(option => option.value === "immobilier" && /à connecter/.test(option.label)), "La catégorie immobilière doit être visible comme source à connecter.");
    assert.equal(privateRubricOptions.some(option => option.value === "services"), false, "La rubrique privée ne doit pas proposer une catégorie propre aux marchés publics.");
    assert.equal(await page.locator("#advanced-search-form input[name='marche']").inputValue(), "private", "Le formulaire privé doit rester verrouillé sur la source privée.");

    await page.goto("http://127.0.0.1:4174/developpement-commercial.html", { waitUntil: "domcontentloaded" });
    await page.locator("#advanced-search-form").waitFor({ timeout: 10000 });
    const mixedCategory = page.locator("#feed-sector");
    assert.equal(await mixedCategory.isDisabled(), true, "La catégorie doit attendre le choix du type de marché pour éviter une recherche mixte ambiguë.");
    await page.locator("#feed-market-type").selectOption("public");
    const rubricPublicOptions = await mixedCategory.locator("option").evaluateAll(options => options.map(option => option.value));
    assert.ok(rubricPublicOptions.includes("services"), "Le choix public doit afficher les catégories BOAMP actives.");
    assert.equal(rubricPublicOptions.includes("bodacc-cessions"), false, "Le choix public ne doit pas proposer les familles BODACC.");
    await page.locator("#feed-market-type").selectOption("private");
    const rubricPrivateOptions = await mixedCategory.locator("option").evaluateAll(options => options.map(option => option.value));
    assert.ok(rubricPrivateOptions.includes("bodacc-cessions"), "Le choix privé doit afficher les familles BODACC.");
    assert.equal(rubricPrivateOptions.includes("services"), false, "Le choix privé ne doit pas proposer les catégories BOAMP.");
    assert.equal(await mixedCategory.isDisabled(), false, "La catégorie doit devenir disponible après le choix public ou privé.");

    console.log("Recherche navigateur réussie : filtres régionaux, BOAMP, BODACC, vue combinée et séparation des sources vérifiés.");
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
