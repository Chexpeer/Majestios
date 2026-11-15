// Chargement commun des ressources de navigation sur toutes les pages.
if (!document.querySelector('link[data-majestios-drawer-css]') &&
    !document.querySelector('link[href*="navigation-tiroirs.css"]')) {
  const drawerStyle = document.createElement("link");
  drawerStyle.rel = "stylesheet";
  drawerStyle.href = new URL("navigation-tiroirs.css", document.baseURI).href;
  drawerStyle.dataset.majestiosDrawerCss = "true";
  document.head.append(drawerStyle);
}
if (!document.querySelector('script[src*="navigation-tiroirs.js"]')) {
  const drawerScript = document.createElement("script");
  drawerScript.src = new URL("navigation-tiroirs.js", document.baseURI).href;
  drawerScript.dataset.majestiosDrawer = "true";
  document.head.append(drawerScript);
}
if (!document.querySelector('link[data-majestios-chat-css]') &&
    !document.querySelector('link[href*="majestios-chat.css"]')) {
  const chatStyle = document.createElement("link");
  chatStyle.rel = "stylesheet";
  chatStyle.href = new URL("majestios-chat.css", document.baseURI).href;
  chatStyle.dataset.majestiosChatCss = "true";
  document.head.append(chatStyle);
}
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
    // Page BODACC : uniquement des annonces d'entreprises (pas de marchés publics, pas de familles hors BODACC).
    const bodaccOnly = window.location.pathname.split("/").pop() === "bodacc-veille-entreprises.html";
    placeholder.textContent = marketValue ? (bodaccOnly ? "Choisir un type d’annonce" : "2. Choisir une catégorie") : "2. Choisir d’abord un type";
    categorySelect.append(placeholder);
    if (marketValue) {
      const allCategories = document.createElement("option");
      allCategories.value = "all";
      allCategories.textContent = bodaccOnly ? "Toutes les annonces BODACC" : "Toutes les catégories";
      categorySelect.append(allCategories);
    }
    const source = marketValue === "public"
      ? (majCatalog.searchCategories || []).filter((item) => item.active && item.value !== "all")
      : marketValue === "private"
        ? (majCatalog.privateSearchCategories || []).filter((item) => (item.active || item.planned) && (!bodaccOnly || item.source === "bodacc"))
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
    // Le mode mixte ne propose que « Toutes les catégories » :
    // une catégorie métier ne peut pas être appliquée honnêtement aux deux sources.
    categorySelect.value = marketValue === "all" ? "all" : selectedCategory === "all" ? "all" :
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
document.querySelector("#feed-search")?.addEventListener("focus", () => { if (advancedSearchForm?.dataset.progressive !== "true") revealStep(searchSteps.market); });

const initialSearchParams = new URLSearchParams(window.location.search);
const initialMarketType = advancedSearchForm?.dataset.fixedMarket === "true"
  ? (advancedSearchForm.dataset.defaultMarket || "")
  : (initialSearchParams.get("marche") || advancedSearchForm?.dataset.defaultMarket || "");
const initialCategory = initialSearchParams.get("categorie") || "";
populateSearchFilters(initialMarketType, initialCategory);
if (advancedSearchForm?.dataset.progressive !== "true" && advancedSearchForm?.dataset.fixedMarket !== "true") {
  if (initialMarketType) {
    revealStep(searchSteps.market);
    revealStep(searchSteps.category);
  }
  if (initialSearchParams.has("categorie") || initialSearchParams.has("departement") || initialSearchParams.has("zone")) {
    revealStep(searchSteps.department);
  }
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
  if (advancedSearchForm?.dataset.progressive !== "true") {
    revealStep(searchSteps.category, Boolean(event.target.value));
    revealStep(searchSteps.department, false);
  }
});
document.querySelector("#feed-sector")?.addEventListener("change", () => {
  if (advancedSearchForm?.dataset.progressive !== "true" && advancedSearchForm?.dataset.fixedMarket !== "true") revealStep(searchSteps.department);
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
  const marketType = document.querySelector("#feed-market-type")?.value || advancedSearchForm?.dataset.defaultMarket;
  const department = document.querySelector("#feed-department")?.value;
  if (query) params.set("q", query);
  if (category && category !== "all") params.set("categorie", category);
  if (department && department !== "all") params.set("departement", department);
  if (marketType) params.set("marche", marketType);

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

// Navigation MajestiOS — tiroirs accessibles, lien de rubrique indépendant du bouton d'ouverture.
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


// Assistant conversationnel de première génération : orientation fondée sur les rubriques existantes.
(() => {
  if (document.querySelector("#majestios-chat")) return;
  const knowledge = [
    {terms:["marché public","marches publics","appel d'offre public","boamp"],label:"Marchés publics",href:"marches-publics.html",answer:"La rubrique Marchés publics aide à repérer les consultations et à préparer leur analyse."},
    {terms:["veille des marchés","veille marché","veille marchés"],label:"Veille des marchés",href:"veille-marches.html",answer:"La veille des marchés aide à suivre les signaux et consultations utiles à votre activité."},
    {terms:["bodacc","redressement","liquidation","cession","création entreprise"],label:"Veille des entreprises · BODACC",href:"bodacc-veille-entreprises.html",answer:"La veille BODACC permet de suivre les créations, cessions, modifications et procédures collectives des entreprises."},
    {terms:["marché privé","marches privés","opportunité privée","annonce privée"],label:"Marchés privés",href:"marches-prives.html",answer:"La rubrique Marchés privés rassemble les opportunités et signaux commerciaux du secteur privé."},
    {terms:["prospection","prospecter","ciblage","entreprise à contacter"],label:"Prospection",href:"prospection-active.html",answer:"La rubrique Prospection sert à détecter, qualifier et identifier des entreprises pertinentes avant de préparer une prise de contact."},
    {terms:["développement commercial","commercial","opportunité"],label:"Développement commercial",href:"developpement-commercial.html",answer:"Le Développement commercial relie la détection des opportunités, leur qualification, la prise de contact et la capitalisation."},
    {terms:["accompagnement","répondre","mémoire technique","appel d'offre"],label:"Accompagnement appels d’offres",href:"accompagnement-appels-offres.html",answer:"L'accompagnement aide à valoriser les compétences, les références, les chantiers et la satisfaction des clients."},
    {terms:["sous-traitance","sous traitant","partenaire chantier"],label:"Sous-traitance",href:"sous-traitance.html",answer:"La rubrique Sous-traitance permet d'explorer les besoins de renfort, les offres et les recherches de partenaires."},
    {terms:["réseau","synergie","partenaire","mise en relation"],label:"Réseau et synergies",href:"reseaux-synergies.html",answer:"La rubrique Réseau aide à identifier des complémentarités et des possibilités de coopération."},
    {terms:["salon","séminaire","événement"],label:"Salons et séminaires",href:"salons-seminaires.html",answer:"Cette rubrique présente les salons, rencontres et séminaires utiles au développement des relations professionnelles."},
    {terms:["réputation","visibilité","réseaux sociaux","facebook","linkedin"],label:"Réputation virtuelle",href:"reputation-virtuelle.html",answer:"La Réputation virtuelle présente les axes de présence numérique et prépare leur analyse. Les icônes sociales illustrent les plateformes ; elles ne prouvent pas une connexion active."},
    {terms:["qualification","naf","ape","entreprise"],label:"Qualification des entreprises",href:"qualification-entreprises.html",answer:"La qualification aide à rapprocher les entreprises de critères d'activité et à préparer une vérification humaine."},
    {terms:["suivi commercial","historique","relance"],label:"Suivi commercial",href:"suivi-commercial.html",answer:"Le Suivi commercial permet de structurer la mémoire des démarches, des réponses et des suites à donner."},
    {terms:["crm","client","contact"],label:"CRM MajestiOS",href:"crm.html",answer:"Le CRM VIP est réservé aux administrateurs internes autorisés. L'authentification seule ne donne pas de droits CRM."},
    {terms:["espace privé","inscription","connexion","code","otp"],label:"Espace privé",href:"espace-membre.html",answer:"L'Espace privé est destiné aux membres. Le parcours de connexion par code e-mail est en préparation et doit encore être validé de bout en bout."},
    {terms:["contact","parler à quelqu'un","contacter"],label:"Contact",href:"contact.html",answer:"Pour une demande qui nécessite un échange humain, utilisez la page Contact."},
    {terms:["emploi","recrutement","candidature","cv"],label:"Nous rejoindre",href:"nous-rejoindre.html",answer:"Pour rejoindre l'équipe ou transmettre une candidature, consultez la rubrique Nous rejoindre."},
    {terms:["faq","question fréquente","questions fréquentes","aide"],label:"FAQ",href:"faq.html",answer:"La FAQ rassemble les réponses aux questions fréquentes sur les rubriques et le fonctionnement de MajestiOS."},
    {terms:["vision","ambition","philosophie","objectif majestos"],label:"Vision MajestiOS",href:"vision-majestios.html",answer:"La page Vision présente le positionnement et la logique de développement commercial de MajestiOS."},
    {terms:["intelligence économique","business intelligence","analyse"],label:"Intelligence économique",href:"intelligence-economique.html",answer:"L'Intelligence économique rassemble les informations utiles à l'analyse et à la décision commerciale."}
  ];
  const host = document.createElement("aside");
  host.id = "majestios-chat";
  host.className = "majestios-chat";
  host.innerHTML = '<button class="majestios-chat-toggle" type="button" aria-expanded="false" aria-controls="majestios-chat-panel"><span aria-hidden="true">✦</span><span class="majestios-chat-toggle-copy"><strong>Parler à MajestiOS</strong><small>Besoin d’un coup de pouce&nbsp;?</small></span></button><section class="majestios-chat-panel" id="majestios-chat-panel" aria-label="Assistant MajestiOS" hidden><header class="majestios-chat-head"><div><small>MAJESTIOS · GUIDE DE VISITE</small><strong>Assistant MajestiOS</strong><small>Par où commencer ? · Première génération</small></div><button class="majestios-chat-close" type="button" aria-label="Fermer l’assistant">×</button></header><div class="majestios-chat-disclaimer">Vous proposez, MajestiOS dispose. Ce guide vous oriente vers les bonnes rubriques et leurs contenus. Le moteur IA de Cheexpeer sera connecté dans une prochaine étape.</div><nav class="majestios-chat-shortcuts" aria-label="Accès rapides"><a href="developpement-commercial.html">⌕ Rechercher une opportunité</a><a href="developpement-commercial.html">↗ Découvrir le développement commercial</a><a href="espace-membre.html">＋ Préparer mon espace personnel</a><a href="faq.html">? Consulter les questions fréquentes</a></nav><div class="majestios-chat-messages" role="log" aria-live="polite"><p class="majestios-chat-message is-assistant">Vous proposez, MajestiOS dispose. Que souhaitez-vous trouver ou comprendre ?</p></div><form class="majestios-chat-form"><label class="visually-hidden" for="majestios-chat-input">Votre question</label><input id="majestios-chat-input" name="question" type="text" maxlength="500" placeholder="Votre question…" autocomplete="off" required><button type="submit">Envoyer</button></form></section>';
  document.body.append(host);
  const toggle = host.querySelector(".majestios-chat-toggle");
  const panel = host.querySelector(".majestios-chat-panel");
  const close = host.querySelector(".majestios-chat-close");
  const form = host.querySelector(".majestios-chat-form");
  const input = host.querySelector("#majestios-chat-input");
  const messages = host.querySelector(".majestios-chat-messages");
  const setOpen = (open) => {
    panel.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    if (open) input.focus(); else toggle.focus();
  };
  toggle.addEventListener("click", () => setOpen(panel.hidden));
  document.querySelector("#assistant-open-guide")?.addEventListener("click", () => setOpen(true));
  close.addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !panel.hidden) setOpen(false); });
  const appendMessage = (text, role, link) => {
    const message = document.createElement("p");
    message.className = "majestios-chat-message " + (role === "user" ? "is-user" : "is-assistant");
    message.textContent = text;
    messages.append(message);
    if (link) {
      const anchor = document.createElement("a");
      anchor.className = "majestios-chat-link";
      anchor.href = link.href;
      anchor.textContent = "Ouvrir : " + link.label + " →";
      messages.append(anchor);
    }
    messages.scrollTop = messages.scrollHeight;
  };
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question) return;
    appendMessage(question, "user");
    const normalized = question.toLocaleLowerCase("fr");
    const match = knowledge.find((item) => item.terms.some((term) => normalized.includes(term)));
    if (match) appendMessage(match.answer, "assistant", match);
    else appendMessage("Je ne trouve pas de réponse suffisamment fiable dans les rubriques actuellement référencées. Vous pouvez parcourir le menu principal ou transmettre votre demande à l'équipe.", "assistant", {label:"Contact",href:"contact.html"});
    input.value = "";
    input.focus();
  });
})();
