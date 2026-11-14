(() => {
  "use strict";

  const homeMount = document.querySelector("#home-search-mount");
  const page = document.querySelector("main.interior-page, main.category-page");
  const path = window.location.pathname.split("/").pop();
  const configs = {
    "marches-publics.html": ["Rechercher des marchés publics", "Interrogez le flux BOAMP avec des critères métier et géographiques. Vérifiez toujours l’avis officiel.", "public"],
    "prospection-active.html": ["Rechercher des opportunités pour la prospection", "Identifiez des pistes à qualifier avant toute prise de contact.", ""],
    "veille-marches.html": ["Rechercher dans la veille des marchés", "Filtrez les avis publics par mot-clé, catégorie et département.", "public"],
    "sous-traitance.html": ["Rechercher des pistes de sous-traitance", "Explorez les avis et signaux accessibles ; toute piste reste à qualifier.", ""],
    "marches-prives.html": ["Rechercher des signaux commerciaux privés", "Explorez les annonces d’entreprise publiées au BODACC. Ce sont des signaux, pas des appels d’offres.", "private"],
    "intelligence-economique.html": ["Rechercher des signaux économiques", "Repérez les informations publiées utiles à une décision commerciale.", ""],
    "bodacc-veille-entreprises.html": ["Rechercher dans les annonces BODACC", "Consultez les annonces légales comme signaux stratégiques à vérifier.", "private"],
    "suivi-commercial.html": ["Rechercher une piste à suivre", "Retrouvez les marchés et signaux à qualifier avant leur suivi commercial.", ""],
    "crm.html": ["Rechercher des opportunités à suivre dans le CRM", "Repérez les marchés et signaux susceptibles d’alimenter votre suivi commercial.", ""],
    "majestios-v5.html": ["Rechercher dans l’espace Cheexpeer", "Accédez aux marchés et signaux publiés qui pourront alimenter les analyses de l’IA intégrée.", ""],
    "categorie-services-numeriques.html": ["Rechercher des marchés de services numériques", "Filtrez les consultations liées aux services informatiques, plateformes et prestations numériques.", "public"],
    "categorie-travaux-amenagement.html": ["Rechercher des marchés de travaux et d’aménagement", "Filtrez les consultations de construction, d’aménagement et de remise en état.", "public"],
    "categorie-conseil-etudes.html": ["Rechercher des marchés de conseil et d’études", "Filtrez les consultations d’études, de diagnostics et d’accompagnement.", "public"],
    "categorie-batiment.html": ["Rechercher des marchés du bâtiment", "Filtrez les consultations de construction, gros œuvre et second œuvre.", "public"],
    "categorie-renovation.html": ["Rechercher des marchés de rénovation", "Filtrez les consultations de rénovation énergétique et générale.", "public"],
    "categorie-electricite.html": ["Rechercher des marchés d’électricité", "Filtrez les consultations d’installations, de mise en conformité et d’équipements électriques.", "public"],
    "categorie-plomberie-chauffage.html": ["Rechercher des marchés de plomberie et chauffage", "Filtrez les consultations de plomberie, chauffage, ventilation et équipements thermiques.", "public"],
    "categorie-maintenance.html": ["Rechercher des marchés de maintenance", "Filtrez les consultations de maintenance, d’exploitation technique et d’entretien.", "public"],
    "faq.html": ["Rechercher dans MajestiOS", "Accédez aux marchés et signaux commerciaux depuis cette page d’information.", ""],
    "nous-rejoindre.html": ["Explorer les opportunités MajestiOS", "Consultez les marchés et signaux publiés avant de rejoindre le réseau.", ""],
    "contact.html": ["Rechercher avant de nous contacter", "Affinez votre recherche d’opportunités avant de préparer votre demande auprès de MajestiOS.", ""],
    "vision-majestios.html": ["Explorer les opportunités MajestiOS", "Reliez la vision de développement commercial aux marchés et signaux publiés.", ""],
    "qualification-entreprises.html": ["Rechercher des opportunités à qualifier", "Repérez les marchés et signaux qui pourront alimenter une qualification d’entreprises.", ""],
    "resultats-recherche.html": ["Modifier ou affiner votre recherche", "Ajustez les mots-clés, le type de marché, la catégorie ou le département sans revenir à l’accueil.", ""]
  };

  // Prospection possède son moteur métier dédié (entreprises, APE/NAF et territoire) ; ne pas injecter le moteur générique une seconde fois.
  if (path === "prospection-active.html") return;

  const config = configs[path];
  if (!homeMount && (!page || !config)) return;

  // Les rubriques Marchés publics et Marchés privés ont un type fixe : aucun sélecteur public/privé ne doit y apparaître.
  // La page BODACC est aussi à type fixe : elle ne propose que des annonces d'entreprises
  // (créations, cessions, radiations, procédures…), jamais d'appels d'offres.
  const isBodaccPage = path === "bodacc-veille-entreprises.html";
  const fixedMarket = path === "marches-publics.html" || path === "marches-prives.html" || isBodaccPage;
  const marketStepMarkup = fixedMarket ? "" : `
      <label class="feed-filter-label" id="market-step" hidden><span class="sr-only">Choisir le type de marché</span>
        <select id="feed-market-type" aria-label="Type de marché" required>
          <option value="">1. Choisir le type de marché</option>
          <option value="all">Publics et privés</option>
          <option value="public">Marchés publics</option>
          <option value="private">Marchés privés et signaux d’entreprises</option>
        </select>
      </label>`;

  // Source unique du balisage : accueil et rubriques utilisent exactement le même formulaire.
  const formMarkup = `
    <form class="feed-toolbar" id="advanced-search-form" data-default-market="${config?.[2] || ""}">
      <label class="feed-search"><span aria-hidden="true">⌕</span><span class="sr-only">Rechercher une opportunité commerciale</span><input id="feed-search" type="search" placeholder="Mot-clé, entreprise, secteur..." autocomplete="off"></label>
      ${marketStepMarkup}
      <label class="feed-filter-label" id="category-step" hidden><span class="sr-only">Choisir une catégorie après le type de marché</span>
        <select id="feed-sector" aria-label="Catégorie d’opportunité" required disabled>
          <option value="all">2. Choisir d’abord un type</option>
        </select>
      </label>
      <label class="feed-filter-label" id="department-step" hidden><span class="sr-only">Filtrer par département</span>
        <select id="feed-department" aria-label="Département">
          <option value="all">3. Choisir un département (facultatif)</option>
        </select>
      </label>
      <p class="search-source-note" id="search-source-note">Choisissez le type d’opportunité, puis une catégorie adaptée. Les marchés privés regroupent les signaux d’entreprise et les familles Immobilier, Emploi et Sous-traitance ; les résultats sont présentés dans un parcours unifié.</p>
      <button class="feed-search-submit" type="submit">Rechercher <span aria-hidden="true">→</span></button>
    </form>`;

  let searchRoot = homeMount;
  if (homeMount) {
    homeMount.innerHTML = formMarkup;
  } else {
    const section = document.createElement("section");
    section.className = "tender-feed-section rubric-search-card";
    section.id = "recherche-avancee";
    section.setAttribute("aria-label", "Moteur de recherche avancé");
    section.innerHTML =
      '<div class="feed-wrap"><div class="feed-demo">' +
        formMarkup +
      '</div></div>';

    const resultsHero = page.querySelector(".search-results-hero");
    const lede = page.querySelector(".interior-lede");
    if (resultsHero && path === "resultats-recherche.html") resultsHero.insertAdjacentElement("afterend", section);
    else if (lede) lede.insertAdjacentElement("afterend", section);
    else page.prepend(section);
    searchRoot = section;
  }

  // Parcours progressif commun : aucun critère secondaire n'apparaît avant une action.
  const form = searchRoot.querySelector("#advanced-search-form");
  const sourceNote = form.querySelector("#search-source-note");
  if (sourceNote) sourceNote.hidden = true;

  // L’accueil conserve son moteur historique : aucun bouton « Choisir une catégorie ».
  // Le parcours progressif ci-dessous est réservé aux pages de rubrique.
  if (!homeMount) {
    if (fixedMarket) {
      form.dataset.fixedMarket = "true";
      const categoryButton = document.createElement("button");
      categoryButton.type = "button";
      categoryButton.className = "feed-criteria-toggle";
      categoryButton.textContent = isBodaccPage ? "Choisir un type d’annonce" : "Choisir une catégorie";
      categoryButton.setAttribute("aria-controls", "category-step department-step");
      categoryButton.setAttribute("aria-expanded", "false");
      // Même comportement progressif sur les rubriques à type de marché fixe :
      // le bouton n'est proposé qu'après le clic dans la barre de recherche.
      categoryButton.hidden = !homeMount;
      const fixedSearchInput = form.querySelector("#feed-search");
      if (!homeMount && fixedSearchInput) {
        fixedSearchInput.addEventListener("click", () => {
          categoryButton.hidden = false;
          form.classList.add("search-criteria-available");
        }, { once: true });
      }
      form.insertBefore(categoryButton, form.querySelector("#category-step"));
      const departmentStep = form.querySelector("#department-step");
      let fixedLevel = 0;
      categoryButton.addEventListener("click", () => {
        const categoryStep = form.querySelector("#category-step");
        const categoryChosen = Boolean(form.querySelector("#feed-sector")?.value);
        if (fixedLevel === 0) fixedLevel = 1;
        else if (fixedLevel === 1 && categoryChosen) fixedLevel = 2;
        else if (fixedLevel >= 2) fixedLevel = 1;
        categoryStep.hidden = fixedLevel < 1;
        if (departmentStep) departmentStep.hidden = fixedLevel < 2;
        categoryButton.setAttribute("aria-expanded", String(fixedLevel > 0));
        categoryButton.textContent = fixedLevel >= 2 ? "Modifier les critères" : (isBodaccPage ? "Affiner l’annonce" : "Affiner les critères");
      });
    } else {
      form.dataset.progressive = "true";
      const criteriaButton = document.createElement("button");
      criteriaButton.type = "button";
      criteriaButton.className = "feed-criteria-toggle";
      criteriaButton.textContent = "Choisir une catégorie";
      criteriaButton.setAttribute("aria-controls", "market-step category-step department-step");
      criteriaButton.setAttribute("aria-expanded", "false");
      // Sur les pages de rubrique, le premier clic dans la barre révèle l'action de choix.
      criteriaButton.hidden = !homeMount;
      const searchInput = form.querySelector("#feed-search");
      if (!homeMount && searchInput) {
        searchInput.addEventListener("click", () => {
          criteriaButton.hidden = false;
          form.classList.add("search-criteria-available");
        }, { once: true });
      }
      form.insertBefore(criteriaButton, form.querySelector("#market-step"));
      const steps = [
        form.querySelector("#market-step"),
        form.querySelector("#category-step"),
        form.querySelector("#department-step")
      ];
      steps.forEach(step => { if (step) step.hidden = true; });
      let level = 0;
      criteriaButton.addEventListener("click", () => {
        const marketChosen = Boolean(form.querySelector("#feed-market-type")?.value);
        const categoryChosen = Boolean(form.querySelector("#feed-sector")?.value);
        if (level === 0) level = 1;
        else if (level === 1 && marketChosen) level = 2;
        else if (level === 2 && categoryChosen) level = 3;
        else if (level >= 3) level = 1;
        steps.forEach((step, index) => { if (step) step.hidden = index >= level; });
        criteriaButton.setAttribute("aria-expanded", String(level > 0));
        criteriaButton.textContent = level >= 3 ? "Modifier les critères" : level === 1 ? "Choisir une catégorie" : "Affiner les critères";
      });
    }
  }

  const initialMarket = new URLSearchParams(window.location.search).get("marche") || config?.[2] || "";
  const market = searchRoot.querySelector("#feed-market-type");
  const categoryStep = searchRoot.querySelector("#category-step");
  if (market) market.value = initialMarket;
  const activeForm = searchRoot.querySelector("#advanced-search-form");
  const progressiveMode = activeForm?.dataset.progressive === "true";
  const fixedMarketMode = activeForm?.dataset.fixedMarket === "true";
  if (categoryStep && (progressiveMode || fixedMarketMode)) categoryStep.hidden = true;
})();