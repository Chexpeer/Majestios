const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#site-nav");
const leadForm = document.querySelector("#lead-form");
const formFeedback = document.querySelector("#form-feedback");
const advancedSearchForm = document.querySelector("#advanced-search-form");
const majCatalog = window.MAJESTIOS_CATALOG || { rubrics: [], searchCategories: [], marketTypes: [] };



const demoScenarios = {
  lost: {
    category: "MARCHÉ PUBLIC · AVIS DE RÉSULTAT",
    title: "Candidature non retenue",
    organization: "Entreprise fictive · Exemple illustratif",
    source: "Avis de résultat fictif",
    fact: "Dans ce scénario, une entreprise fictive n’a pas remporté un appel d’offres.",
    hypothesis: "Le résultat pourrait motiver une revue du positionnement, une recherche de partenariat ou la préparation d’une nouvelle réponse. Aucune de ces pistes n’est confirmée.",
    actors: ["Entreprise candidate fictive", "Acheteur public fictif", "Partenaire éventuel à identifier"],
    action: "Vérifier les documents officiels, consigner le retour disponible et décider en équipe si un suivi est pertinent."
  },
  won: {
    category: "MARCHÉ PUBLIC · ATTRIBUTION",
    title: "Un marché vient d’être attribué",
    organization: "Titulaire fictif · Exemple illustratif",
    source: "Avis d’attribution fictif",
    fact: "Dans ce scénario, un marché est attribué à une organisation fictive.",
    hypothesis: "L’exécution du marché pourrait entraîner des besoins de sous-traitance, de ressources, de matériel ou de logistique. L’avis seul ne permet pas de l’affirmer.",
    actors: ["Titulaire du marché fictif", "Acheteur public fictif", "Fournisseur ou sous-traitant potentiel"],
    action: "Qualifier les exigences et le calendrier, identifier les acteurs concernés, puis obtenir une autorisation avant tout échange."
  },
  hiring: {
    category: "SIGNAL RH · EXEMPLE",
    title: "Recrutements dans un même métier",
    organization: "Organisation fictive · Exemple illustratif",
    source: "Annonces d’emploi fictives",
    fact: "Ce scénario réunit plusieurs offres d’emploi fictives publiées pour des profils techniques.",
    hypothesis: "Une activité de recrutement convergente peut indiquer une évolution des besoins en compétences. Le contexte, les sources et la période doivent être vérifiés.",
    actors: ["Employeur fictif", "Équipes concernées", "Relais RH ou formation éventuels"],
    action: "Vérifier les annonces, leur fraîcheur et leur contexte avant de décider si une piste mérite une qualification."
  }
};

let activeDemoView = "signal";
const demoDecisions = {};
const demoDecisionLabels = {
  validate: "Piste validée · simulation",
  reject: "Hypothèse rejetée · simulation",
  defer: "Décision reportée · simulation",
  verify: "Vérification demandée · simulation"
};

function renderDemoDetail() {
  const scenarioId = document.querySelector(".case-tab.active")?.dataset.case ?? "lost";
  const scenario = demoScenarios[scenarioId];
  const target = document.querySelector("#demo-detail");
  target.replaceChildren();
  const status = document.querySelector("#demo-status");
  const statusIcon = document.createElement("i");
  status.replaceChildren(statusIcon, document.createTextNode(demoDecisionLabels[demoDecisions[scenarioId]] ?? "À qualifier"));

  const addBlock = (label, text, kind = "") => {
    const section = document.createElement("section");
    section.className = `demo-info-block ${kind}`.trim();
    const heading = document.createElement("h4");
    heading.textContent = label;
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    section.append(heading, paragraph);
    target.append(section);
  };

  if (activeDemoView === "signal") {
    addBlock("Fait présenté dans le scénario", scenario.fact, "fact-block");
    addBlock("Provenance illustrative", `${scenario.source}. Il ne s’agit pas d’une source consultée ou vérifiée.`);
  } else if (activeDemoView === "analysis") {
    addBlock("Hypothèse à confirmer", scenario.hypothesis, "hypothesis-block");
    addBlock("Limite de lecture", "Le scénario ne prouve ni l’existence d’un besoin commercial ni une intention d’être contacté.");
  } else if (activeDemoView === "network") {
    const section = document.createElement("section");
    section.className = "demo-info-block network-block";
    const heading = document.createElement("h4");
    heading.textContent = "Écosystème illustratif à qualifier";
    const list = document.createElement("ul");
    scenario.actors.forEach((actor) => {
      const item = document.createElement("li");
      item.textContent = actor;
      list.append(item);
    });
    section.append(heading, list);
    target.append(section);
    addBlock("À garder en tête", "Les relations et interlocuteurs ne sont pas vérifiés ; aucune coordonnée n’est affichée.");
  } else {
    addBlock("Prochaine étape suggérée", scenario.action, "hypothesis-block");
    addBlock("Arbitrage humain", "Une personne habilitée décide si l’information est qualifiée et si une action peut être préparée ou engagée.", "decision-block");

    const actions = document.createElement("div");
    actions.className = "demo-decision-actions";
    const actionsTitle = document.createElement("h4");
    actionsTitle.textContent = "Simuler un arbitrage humain";
    const actionsList = document.createElement("div");
    actionsList.className = "demo-decision-buttons";
    [
      ["validate", "Valider la piste"],
      ["reject", "Rejeter l’hypothèse"],
      ["defer", "Reporter"],
      ["verify", "Demander une vérification"]
    ].forEach(([decision, label]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "demo-decision-button";
      button.textContent = label;
      button.addEventListener("click", () => {
        demoDecisions[scenarioId] = decision;
        const status = document.querySelector("#demo-status");
        const statusIcon = document.createElement("i");
        status.replaceChildren(statusIcon, document.createTextNode(demoDecisionLabels[decision]));
        let feedback = target.querySelector(".demo-decision-feedback");
        if (!feedback) {
          feedback = document.createElement("p");
          feedback.className = "demo-decision-feedback";
          feedback.setAttribute("role", "status");
          actions.append(feedback);
        }
        feedback.textContent = `${demoDecisionLabels[decision]}. Aucun état n’a été enregistré et aucune action externe n’a été lancée.`;
      });
      actionsList.append(button);
    });
    actions.append(actionsTitle, actionsList);
    target.append(actions);
  }
}

function selectDemoCase(button) {
  document.querySelectorAll(".case-tab").forEach((tab) => {
    const selected = tab === button;
    tab.classList.toggle("active", selected);
    tab.setAttribute("aria-selected", String(selected));
  });
  const scenario = demoScenarios[button.dataset.case];
  document.querySelector("#demo-category").textContent = scenario.category;
  document.querySelector("#demo-title").textContent = scenario.title;
  document.querySelector("#demo-org").textContent = scenario.organization;
  document.querySelector("#demo-source").textContent = scenario.source;
  renderDemoDetail();
}

/* Les interactions de démonstration ne sont présentes que sur la page d’accueil. */
document.querySelectorAll(".case-tab").forEach((button) => {
  button.addEventListener("click", () => selectDemoCase(button));
});

document.querySelectorAll(".demo-tab").forEach((button) => {
  button.addEventListener("click", () => {
    activeDemoView = button.dataset.view;
    document.querySelectorAll(".demo-tab").forEach((tab) => {
      const selected = tab === button;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-selected", String(selected));
    });
    renderDemoDetail();
  });
});

function setIntent(intent) {
  const radio = leadForm.querySelector(`input[name="intent"][value="${intent}"]`);
  if (!radio) return;
  radio.checked = true;
  leadForm.querySelectorAll(".intent-fields").forEach((section) => {
    const visible = section.dataset.for === intent;
    section.hidden = !visible;
    section.querySelectorAll("input, textarea").forEach((field) => {
      field.required = visible && ["tender", "sector", "area", "message", "first_name", "last_name", "email", "phone"].includes(field.name);
    });
  });
  const tenderNote = leadForm.querySelector("#selected-tender-note");
  if (tenderNote) tenderNote.hidden = intent !== "respond" || !tenderNote.textContent;
  formFeedback.hidden = true;
}

function populateSearchFilters(marketValue = "", selectedCategory = "") {
  const categorySelect = document.querySelector("#feed-sector");
  const marketSelect = document.querySelector("#feed-market-type");
  const departmentSelect = document.querySelector("#feed-department");

  if (marketSelect && marketSelect.value !== marketValue) marketSelect.value = marketValue;
  if (categorySelect) {
    categorySelect.replaceChildren();
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = marketValue ? "2. Choisir une catégorie" : "2. Choisir d’abord un type";
    categorySelect.append(placeholder);
    if (marketValue) {
      const allCategories = document.createElement("option");
      allCategories.value = "all";
      allCategories.textContent = "Toutes les catégories";
      categorySelect.append(allCategories);
    }
    const source = marketValue === "public"
      ? (majCatalog.searchCategories || []).filter((item) => item.active && item.value !== "all")
      : marketValue === "private"
        ? (majCatalog.privateSearchCategories || []).filter((item) => item.active || item.planned)
        : [];
    const groups = new Map();
    source.forEach((item) => {
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
      option.textContent = item.planned ? item.label + " · source à connecter" : item.label;
      option.disabled = Boolean(item.planned);
      parent.append(option);
    });
    categorySelect.disabled = !marketValue;
    categorySelect.value = selectedCategory === "all" ? "all" :
      source.some((item) => item.value === selectedCategory && !item.planned) ? selectedCategory : "";
  }

  if (departmentSelect && majCatalog.searchDepartments?.length) {
    departmentSelect.replaceChildren();
    const all = document.createElement("option");
    all.value = "all";
    all.textContent = "Tous les départements";
    departmentSelect.append(all);
    majCatalog.searchDepartments.forEach((department) => {
      const option = document.createElement("option");
      option.value = department.value;
      option.textContent = department.value + " · " + department.label;
      departmentSelect.append(option);
    });
  }
}
const searchSteps = {
  market: document.querySelector("#market-step"),
  category: document.querySelector("#category-step"),
  department: document.querySelector("#department-step")
};
const revealStep = (step, visible = true) => { if (step) step.hidden = !visible; };
document.querySelector("#feed-search")?.addEventListener("focus", () => revealStep(searchSteps.market));

const initialSearchParams = new URLSearchParams(window.location.search);
const initialMarketType = initialSearchParams.get("marche") || advancedSearchForm?.dataset.defaultMarket || "";
const initialCategory = initialSearchParams.get("categorie") || "";
populateSearchFilters(initialMarketType, initialCategory);
if (initialMarketType) {
  revealStep(searchSteps.market);
  revealStep(searchSteps.category);
}
if (initialSearchParams.has("categorie") || initialSearchParams.has("departement") || initialSearchParams.has("zone")) {
  revealStep(searchSteps.department);
}

const initialDepartment = initialSearchParams.get("departement") || initialSearchParams.get("zone");
if (initialDepartment) {
  const departmentControl = document.querySelector("#feed-department");
  if (departmentControl && [...departmentControl.options].some((option) => option.value === initialDepartment && !option.disabled)) {
    departmentControl.value = initialDepartment;
  }
}
const keywordControl = document.querySelector("#feed-search");
const categoryControl = document.querySelector("#feed-sector");
const updateOtherCategoryRequirement = () => {
  if (!keywordControl) return;
  const requiresKeyword = categoryControl?.value === "autre";
  keywordControl.required = requiresKeyword;
  keywordControl.setCustomValidity(requiresKeyword && !keywordControl.value.trim()
    ? "Pour utiliser la catégorie Autre, saisissez un mot-clé."
    : "");
  keywordControl.placeholder = requiresKeyword
    ? "Précisez le sujet à rechercher dans Autre..."
    : "Mot-clé, entreprise, secteur...";
};
const initialKeyword = initialSearchParams.get("q");
if (initialKeyword && keywordControl) keywordControl.value = initialKeyword;
updateOtherCategoryRequirement();
keywordControl?.addEventListener("input", updateOtherCategoryRequirement);

document.querySelector("#feed-market-type")?.addEventListener("change", (event) => {
  populateSearchFilters(event.target.value, "");
  updateOtherCategoryRequirement();
  revealStep(searchSteps.category, Boolean(event.target.value));
  revealStep(searchSteps.department, false);
});
document.querySelector("#feed-sector")?.addEventListener("change", () => {
  revealStep(searchSteps.department);
  updateOtherCategoryRequirement();
});
if (advancedSearchForm) {
  advancedSearchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const params = new URLSearchParams();
  const query = document.querySelector("#feed-search")?.value.trim();
  const categoryControl = document.querySelector("#feed-sector");
  const category = categoryControl?.selectedOptions[0]?.disabled ? "all" : categoryControl?.value;
  if (category === "autre" && !query) {
    keywordControl?.setCustomValidity("Pour utiliser la catégorie Autre, saisissez un mot-clé.");
    keywordControl?.reportValidity();
    return;
  }
  const marketType = document.querySelector("#feed-market-type")?.value;
  const department = document.querySelector("#feed-department")?.value;
  if (query) params.set("q", query);
  if (category && category !== "all") params.set("categorie", category);
  if (department && department !== "all") params.set("departement", department);
  if (marketType && marketType !== "all") params.set("marche", marketType);

  // Les catégories publiques déjà dotées d’une page conservent leur destination dédiée.
  // Les nouvelles catégories sans page dédiée et les signaux privés passent par les résultats communs.
  const selectedCategory = marketType === "public"
    ? majCatalog.searchCategories.find((item) => item.value === category && !item.planned && item.href)
    : null;
  const destination = selectedCategory ? selectedCategory.href : "resultats-recherche.html";

  window.location.href = `${destination}${params.size ? `?${params.toString()}` : ""}`;
});
}

// Le moteur de recherche conserve ses critères ; la liste des annonces n'est pas affichée sur l'accueil.
// Les anciennes cartes de démonstration ont été retirées de l’accueil compact :
// n’initialiser leur rendu que si leurs conteneurs existent encore sur une page.
if (document.querySelector('#demo-detail') && document.querySelector('#demo-status')) {
  renderDemoDetail();
}

if (leadForm && formFeedback) {
  leadForm.addEventListener("submit", (event) => event.preventDefault());
  leadForm.querySelectorAll('input[name="intent"]').forEach((radio) => {
    radio.addEventListener("change", () => setIntent(radio.value));
  });
  const selectedIntent = leadForm.querySelector('input[name="intent"]:checked');
  if (selectedIntent) setIntent(selectedIntent.value);

  document.querySelectorAll("[data-intent-link]").forEach((link) => {
    link.addEventListener("click", () => setIntent(link.dataset.intentLink));
  });

  const previewRequest = leadForm.querySelector("#preview-request");
  if (previewRequest) {
    previewRequest.addEventListener("click", () => {
      if (!leadForm.reportValidity()) return;

      const selectedIntent = leadForm.querySelector('input[name="intent"]:checked');
      if (!selectedIntent) return;
      const intentLabels = {
        respond: "demande d’accompagnement pour répondre à un AO",
        receive: "demande de réception d’AO liés à votre activité",
        contact: "prise de contact au sujet de votre projet"
      };
      const intentLabel = intentLabels[selectedIntent.value] || "demande de contact";
      const subjectField = leadForm.querySelector("#contact-subject");
      const subjectLabel = subjectField?.selectedOptions[0]?.textContent.trim();
      formFeedback.textContent = `Prévisualisation : ${intentLabel}${subjectLabel ? " · " + subjectLabel : ""}. Aucune donnée n’a été envoyée ni enregistrée.`;
      formFeedback.hidden = false;
    });
  }
}

// Menus déroulants contextuels : accès direct aux rubriques sans alourdir la navigation.
const contextualMenus = {
  "developpement-commercial.html": [
    { label: "Prosp'active", href: "prospection-active.html" },
    { label: "Marchés publics", href: "marches-publics.html" },
    { label: "Marchés privés", href: "marches-prives.html" }
  ],
  "espace-membre.html": [
    { label: "Suivi commercial", href: "suivi-commercial.html" },
    { label: "CRM MajestiOS", href: "crm.html" },
    { label: "Qualification entreprises", href: "qualification-entreprises.html" }
  ]
};

if (navigation) {
  Object.entries(contextualMenus).forEach(([parentHref, items]) => {
    const parentLink = [...navigation.querySelectorAll(":scope > a")].find((link) =>
      link.getAttribute("href") === parentHref
    );
    if (!parentLink || parentLink.parentElement.classList.contains("nav-item-dropdown")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "nav-item-dropdown";
    parentLink.before(wrapper);
    wrapper.append(parentLink);

    const toggle = document.createElement("button");
    toggle.className = "nav-dropdown-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "submenu-" + parentHref.replace(/[^a-z0-9]+/gi, "-"));
    toggle.setAttribute("aria-label", "Afficher les rubriques de " + parentLink.textContent.trim());
    toggle.innerHTML = '<span aria-hidden="true">⌄</span>';
    wrapper.append(toggle);

    const submenu = document.createElement("div");
    submenu.className = "nav-submenu";
    submenu.id = toggle.getAttribute("aria-controls");
    submenu.hidden = true;
    submenu.setAttribute("aria-label", "Rubriques associées à " + parentLink.textContent.trim());
    items.forEach(({ label, href }) => {
      const link = document.createElement("a");
      link.href = href;
      link.textContent = label;
      submenu.append(link);
    });
    wrapper.append(submenu);

    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", (open ? "Masquer" : "Afficher") + " les rubriques de " + parentLink.textContent.trim());
      submenu.hidden = !open;
      wrapper.classList.toggle("is-open", open);
    };
    // Le focus seul ne doit pas ouvrir le menu : sur écran tactile, focusin précède click.
    // L’ouverture au clavier reste explicite via Flèche bas ou activation du bouton.
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    wrapper.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setOpen(true);
        submenu.querySelector("a")?.focus();
        return;
      }
      if (event.key === "Escape") {
        setOpen(false);
        toggle.focus();
      }
    });
    wrapper.addEventListener("focusout", (event) => {
      if (!wrapper.contains(event.relatedTarget)) setOpen(false);
    });
    wrapper.addEventListener("mouseenter", () => {
      if (window.matchMedia("(min-width: 1021px)").matches) setOpen(true);
    });
    wrapper.addEventListener("mouseleave", () => {
      if (window.matchMedia("(min-width: 1021px)").matches && !wrapper.contains(document.activeElement)) setOpen(false);
    });
    document.addEventListener("pointerdown", (event) => {
      if (!wrapper.contains(event.target)) setOpen(false);
    });
  });
}

if (menuToggle && navigation) {
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Ouvrir le menu" : "Fermer le menu");
  navigation.classList.toggle("open", !isOpen);
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Ouvrir le menu");
  });
});
}


/* Interaction directe avec le SVG intégré dans le DOM de la page d’accueil. */
const interactiveSvg = document.querySelector("#majestios-panorama");
if (interactiveSvg) {
  const surfaceNames = Object.fromEntries(majCatalog.rubrics.map((rubric) => [rubric.surface, rubric.label]));
  const surfaceDestinations = Object.fromEntries(majCatalog.rubrics.map((rubric) => [rubric.surface, rubric.href]));
  const surfaces = [...interactiveSvg.querySelectorAll("[data-surface]")];
  surfaces.forEach((surface) => {
    const name = surfaceNames[surface.dataset.surface] || surface.getAttribute("aria-label") || "Rubrique";
    surface.setAttribute("aria-pressed", "false");
    surface.setAttribute("role", "link");
    surface.setAttribute("aria-label", `Ouvrir ${name}`);
    surface.addEventListener("click", () => {
      const destination = surfaceDestinations[surface.dataset.surface];
      if (destination) window.location.href = destination;
    });
    surface.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const destination = surfaceDestinations[surface.dataset.surface];
        if (destination) window.location.href = destination;
      }
    });
  });
}

const personalSpaceDialog = document.querySelector("#personal-space-dialog");
const closePersonalSpace = document.querySelector("#close-personal-space");
const personalSpaceForm = document.querySelector("#personal-space-form");
const personalSpaceFeedback = document.querySelector("#personal-space-feedback");

document.querySelectorAll("#open-personal-space, #open-personal-space-shortcut").forEach((button) => {
  button.addEventListener("click", () => {
    if (typeof personalSpaceDialog?.showModal === "function") personalSpaceDialog.showModal();
  });
});
closePersonalSpace?.addEventListener("click", () => personalSpaceDialog?.close());
personalSpaceDialog?.addEventListener("click", (event) => {
  if (event.target === personalSpaceDialog) personalSpaceDialog.close();
});
if (personalSpaceForm && !personalSpaceForm.hasAttribute("data-supabase-auth")) {
  personalSpaceForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!personalSpaceForm.reportValidity()) return;
    personalSpaceFeedback.textContent = "Le service de création de compte n’est pas connecté.";
    personalSpaceFeedback.hidden = false;
  });
}


// Fil d’Ariane partagé : garder un repère de retour sur toutes les pages de rubrique.
const interiorPage = document.querySelector("main.interior-page");
const interiorTitle = interiorPage?.querySelector("h1");
if (interiorPage && interiorTitle && !interiorPage.querySelector(".interior-breadcrumb")) {
  const breadcrumb = document.createElement("nav");
  breadcrumb.className = "interior-breadcrumb";
  breadcrumb.setAttribute("aria-label", "Fil d’Ariane");
  const homeLink = document.createElement("a");
  homeLink.href = "index.html";
  homeLink.textContent = "Accueil";
  const separator = document.createElement("span");
  separator.setAttribute("aria-hidden", "true");
  separator.textContent = " / ";
  const currentPage = document.createElement("span");
  currentPage.setAttribute("aria-current", "page");
  currentPage.textContent = interiorTitle.textContent.replace(/\s+/g, " ").trim();
  breadcrumb.append(homeLink, separator, currentPage);
  interiorPage.prepend(breadcrumb);
}


// Coup de pouce sur l’accueil : navigation guidée, sans prétendre fournir une IA conversationnelle.
const homeHelpToggle = document.querySelector("#home-help-toggle");
const homeHelpPanel = document.querySelector("#home-help-panel");
const homeHelpClose = document.querySelector("#home-help-close");
function setHomeHelpOpen(open) {
  if (!homeHelpToggle || !homeHelpPanel) return;
  homeHelpPanel.hidden = !open;
  homeHelpToggle.setAttribute("aria-expanded", String(open));
  if (open) homeHelpClose?.focus();
  else homeHelpToggle.focus();
}
homeHelpToggle?.addEventListener("click", () => setHomeHelpOpen(homeHelpToggle.getAttribute("aria-expanded") !== "true"));
homeHelpClose?.addEventListener("click", () => setHomeHelpOpen(false));
homeHelpPanel?.querySelectorAll("[data-home-help-close]").forEach((link) => link.addEventListener("click", () => setHomeHelpOpen(false)));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && homeHelpPanel && !homeHelpPanel.hidden) setHomeHelpOpen(false);
});
