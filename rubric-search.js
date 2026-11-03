(() => {
  "use strict";

  const page = document.querySelector("main.interior-page");
  if (!page || document.querySelector("#rubric-opportunity-search")) return;

  const path = window.location.pathname.split("/").pop();
  const configs = {
    "marches-publics.html": {
      title: "Rechercher des marchés publics",
      description: "Interrogez le flux BOAMP avec des critères métier et géographiques. Vérifiez toujours l’avis officiel.",
      market: "public",
      fixedMarket: true
    },
    "developpement-commercial.html": {
      title: "Rechercher des opportunités de développement commercial",
      description: "Repérez des consultations publiques ou explorez séparément les signaux commerciaux privés du BODACC.",
      market: "all"
    },
    "prospection-active.html": {
      title: "Rechercher des opportunités pour la prospection active",
      description: "Partez des annonces et signaux publiés pour identifier les pistes qui méritent une qualification humaine.",
      market: "all"
    },
    "veille-marches.html": {
      title: "Rechercher dans la veille des marchés",
      description: "Filtrez les avis publics par mot-clé, catégorie et région administrative.",
      market: "public",
      fixedMarket: true
    },
    "accompagnement-appels-offres.html": {
      title: "Trouver un marché à qualifier",
      description: "Recherchez une consultation avant d’évaluer les exigences, les pièces et les délais de réponse.",
      market: "public",
      fixedMarket: true
    },
    "sous-traitance.html": {
      title: "Rechercher des pistes de sous-traitance",
      description: "Explorez les avis et signaux accessibles ; une annonce ne prouve pas à elle seule qu’un besoin de sous-traitance existe.",
      market: "all"
    },
    "marches-prives.html": {
      title: "Rechercher des signaux commerciaux privés",
      description: "Explorez les annonces d’entreprise publiées au BODACC. Ce sont des signaux à qualifier, pas des appels d’offres.",
      market: "private",
      fixedMarket: true
    },
    "intelligence-economique.html": {
      title: "Rechercher des signaux économiques",
      description: "Repérez des informations publiées qui peuvent éclairer une décision commerciale, sous réserve de vérification.",
      market: "all"
    },
    "reseaux-synergies.html": {
      title: "Rechercher des opportunités de partenariat",
      description: "Partez des marchés publiés et des signaux d’entreprise pour identifier des pistes à qualifier humainement.",
      market: "all"
    },
    "bodacc-veille-entreprises.html": {
      title: "Rechercher dans les annonces BODACC",
      description: "Consultez les annonces légales d’entreprise comme signaux stratégiques ; elles ne prouvent pas à elles seules une opportunité commerciale.",
      market: "private",
      fixedMarket: true
    },
    "suivi-commercial.html": {
      title: "Rechercher une piste à suivre",
      description: "Retrouvez des marchés et signaux publiés à qualifier avant toute action de suivi commercial.",
      market: "all"
    }
  };
  const config = configs[path];
  if (!config) return;

  const catalogue = window.MAJESTIOS_CATALOG || {};
  const publicCategories = (catalogue.searchCategories || [
    { value: "all", label: "Toutes les catégories", active: true }
  ]).filter((item) => item.active && item.value !== "all").map((item) => ({
    value: item.value, label: item.label, group: "Marchés publics · BOAMP"
  }));
  const privateCategories = [
    { value: "bodacc-creations", label: "Créations et implantations", group: "Signaux BODACC" },
    { value: "bodacc-cessions", label: "Ventes, cessions et reprises", group: "Signaux BODACC" },
    { value: "bodacc-modifications", label: "Modifications d’entreprises", group: "Signaux BODACC" },
    { value: "immobilier", label: "Immobilier professionnel", group: "Autres opportunités privées", connected: false },
    { value: "emploi", label: "Emploi et recrutement", group: "Autres opportunités privées", connected: false },
    { value: "sous-traitance-offres", label: "Offres de sous-traitance", group: "Autres opportunités privées", connected: false },
    { value: "sous-traitance-recherche", label: "Recherche de sous-traitants et partenaires", group: "Autres opportunités privées", connected: false }
  ];
  const departments = (catalogue.searchDepartments || []).map((item) => [item.value, item.label]);
  const optionMarkup = (items) => items.map(([value, label]) =>
    '<option value="' + value + '">' + label + '</option>'
  ).join("");

  const section = document.createElement("section");
  section.className = "floating-route-card rubric-search-card";
  section.setAttribute("aria-labelledby", "rubric-search-title");
  const form = document.createElement("form");
  form.action = "resultats-recherche.html";
  form.method = "get";
  form.className = "advanced-search-form";
  form.id = "rubric-opportunity-search";

  const initialParams = new URLSearchParams(window.location.search);
  const initialMarket = config.fixedMarket ? config.market : (initialParams.get("marche") || "all");
  const marketField = config.fixedMarket
    ? '<input type="hidden" name="marche" value="' + config.market + '">'
    : '<label for="rubric-search-market">1. Type de marché</label><select id="rubric-search-market" name="marche"><option value="all">Tous types (publics et privés)</option><option value="public">Marchés publics · BOAMP</option><option value="private">Marchés privés · BODACC et autres signaux</option></select>';
  form.innerHTML =
    '<label for="rubric-search-query">Mot-clé, activité ou entreprise</label>' +
    '<input id="rubric-search-query" name="q" type="search" maxlength="160" placeholder="Ex. plomberie, rénovation, maintenance">' +
    marketField +
    '<label for="rubric-search-category">' + (config.fixedMarket ? "Catégorie" : "2. Catégorie") + '</label>' +
    '<select id="rubric-search-category" name="categorie"><option value="all">Toutes les catégories</option></select>' +
    '<label for="rubric-search-region">3. Département</label>' +
    '<select id="rubric-search-region" name="departement"><option value="all">Tous les départements</option>' + optionMarkup(departments) + '</select>' +
    '<button class="button-primary" type="submit">Rechercher →</button>';

  const marketSelect = form.querySelector("#rubric-search-market");
  const categorySelect = form.querySelector("#rubric-search-category");
  const populateCategories = (market, selected = "all") => {
    categorySelect.replaceChildren();
    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = market === "private" ? "Toutes les catégories privées" :
      market === "public" ? "Toutes les catégories publiques" : "Choisir d’abord un type de marché";
    categorySelect.append(allOption);

    const source = market === "public" ? publicCategories :
      market === "private" ? privateCategories : [];
    const groups = new Map();
    for (const item of source) {
      let parent = categorySelect;
      if (item.group) {
        if (!groups.has(item.group)) {
          const group = document.createElement("optgroup");
          group.label = item.group;
          groups.set(item.group, group);
          categorySelect.append(group);
        }
        parent = groups.get(item.group);
      }
      const option = document.createElement("option");
      option.value = item.value;
      option.textContent = item.connected === false ? `${item.label} · source à connecter` : item.label;
      option.disabled = item.connected === false;
      parent.append(option);
    }
    categorySelect.disabled = !market || market === "all";
    categorySelect.value = source.some((item) => item.value === selected && item.connected !== false) ? selected : "all";
  };

  if (marketSelect) {
    marketSelect.value = initialMarket;
    marketSelect.addEventListener("change", () => populateCategories(marketSelect.value));
  }
  populateCategories(initialMarket, initialParams.get("categorie") || "all");

  const queryField = form.querySelector("#rubric-search-query");
  if (queryField) queryField.value = initialParams.get("q") || "";
  const departmentField = form.querySelector("#rubric-search-region");
  const initialDepartment = initialParams.get("departement");
  if (departmentField && initialDepartment && [...departmentField.options].some((option) => option.value === initialDepartment)) {
    departmentField.value = initialDepartment;
  }

  const heading = document.createElement("h2");
  heading.id = "rubric-search-title";
  heading.textContent = config.title;
  const description = document.createElement("p");
  description.textContent = config.description;
  const note = document.createElement("p");
  note.className = "small-note";
  note.textContent = "Les catégories dépendent du type de marché choisi. Les signaux BODACC ne sont pas des appels d’offres ; les catégories non connectées ne produisent pas de résultats fictifs.";
  section.append(heading, description, form, note);

  const lede = page.querySelector(".interior-lede");
  const virtualSpace = page.querySelector(".virtual-space");
  if (lede) lede.insertAdjacentElement("afterend", section);
  else if (virtualSpace) virtualSpace.insertAdjacentElement("beforebegin", section);
  else page.prepend(section);
})();
