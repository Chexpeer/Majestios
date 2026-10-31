const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#site-nav");
const leadForm = document.querySelector("#lead-form");
const formFeedback = document.querySelector("#form-feedback");
const feedStream = document.querySelector("#feed-stream");

const demoTenders = [
  {
    id: "feed-01",
    title: "Évolution d’un portail de démarches",
    buyer: "Acheteur public fictif · services",
    sector: "services",
    sectorLabel: "Services numériques",
    region: "nord",
    regionLabel: "Nord · exemple",
    description: "Exemple de consultation dans le secteur des services numériques."
  },
  {
    id: "feed-02",
    title: "Réaménagement d’un équipement de proximité",
    buyer: "Acheteur public fictif · aménagement",
    sector: "travaux",
    sectorLabel: "Travaux & aménagement",
    region: "ouest",
    regionLabel: "Ouest · exemple",
    description: "Exemple de projet de travaux pour un équipement de proximité."
  },
  {
    id: "feed-03",
    title: "Étude de stratégie de transition",
    buyer: "Acheteur public fictif · conseil",
    sector: "conseil",
    sectorLabel: "Conseil & études",
    region: "sud",
    regionLabel: "Sud · exemple",
    description: "Exemple de mission d’étude autour de la transition."
  },
  {
    id: "feed-04",
    title: "Maintenance d’un système d’information",
    buyer: "Acheteur public fictif · numérique",
    sector: "services",
    sectorLabel: "Services numériques",
    region: "ouest",
    regionLabel: "Ouest · exemple",
    description: "Exemple de besoin de maintenance informatique."
  },
  {
    id: "feed-05",
    title: "Diagnostic de rénovation énergétique",
    buyer: "Acheteur public fictif · études",
    sector: "conseil",
    sectorLabel: "Conseil & études",
    region: "nord",
    regionLabel: "Nord · exemple",
    description: "Exemple de projet de rénovation énergétique."
  }
];

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
if (leadForm && feedStream) {
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
      field.required = visible && ["tender", "sector", "area", "message"].includes(field.name);
    });
  });
  const tenderNote = leadForm.querySelector("#selected-tender-note");
  if (tenderNote) tenderNote.hidden = intent !== "respond" || !tenderNote.textContent;
  formFeedback.hidden = true;
}

function renderTenderFeed() {
  const query = document.querySelector("#feed-search").value.trim().toLocaleLowerCase("fr");
  const sector = document.querySelector("#feed-sector").value;
  const region = document.querySelector("#feed-region").value;
  const matches = demoTenders.filter((tender) => {
    const searchable = `${tender.title} ${tender.buyer} ${tender.sectorLabel} ${tender.regionLabel}`.toLocaleLowerCase("fr");
    return (sector === "all" || tender.sector === sector)
      && (region === "all" || tender.region === region)
      && searchable.includes(query);
  });

  document.querySelector("#feed-result-count").textContent = `${matches.length} exemple${matches.length === 1 ? "" : "s"}`;
  feedStream.replaceChildren();

  if (matches.length === 0) {
    const empty = document.createElement("p");
    empty.className = "feed-empty";
    empty.textContent = "Aucun exemple ne correspond à ces critères. Modifiez votre recherche ou vos filtres.";
    feedStream.append(empty);
    return;
  }

  for (const tender of matches) {
    const card = document.createElement("article");
    card.className = "feed-card";

    const icon = document.createElement("span");
    icon.className = "feed-card-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "▤";

    const content = document.createElement("div");
    content.className = "feed-card-content";
    const heading = document.createElement("div");
    heading.className = "feed-card-heading";
    const title = document.createElement("h3");
    title.textContent = tender.title;
    const demoTag = document.createElement("span");
    demoTag.className = "feed-fictive-tag";
    demoTag.textContent = "FICTIF";
    heading.append(title, demoTag);

    const buyer = document.createElement("p");
    buyer.className = "feed-buyer";
    buyer.textContent = tender.buyer;
    const description = document.createElement("p");
    description.className = "feed-description";
    description.textContent = tender.description;
    const metadata = document.createElement("div");
    metadata.className = "feed-card-metadata";
    metadata.textContent = `${tender.sectorLabel} · ${tender.regionLabel} · Échéance non renseignée`;
    content.append(heading, buyer, description, metadata);

    const action = document.createElement("a");
    action.href = "#contact";
    action.className = "feed-interest";
    action.textContent = "Demander un accompagnement pour cet AO";
    action.addEventListener("click", () => {
      setIntent("respond");
      const tenderInput = leadForm.querySelector('[name="tender"]');
      const tenderNote = leadForm.querySelector("#selected-tender-note");
      tenderInput.value = `Exemple fictif : ${tender.title}`;
      tenderNote.textContent = `Vous avez choisi un appel d’offres fictif : « ${tender.title} ». Remplacez cette valeur par la référence ou le lien d’un AO réel si vous préparez une demande.`;
      tenderNote.hidden = false;
      tenderInput.focus({ preventScroll: true });
    });

    card.append(icon, content, action);
    feedStream.append(card);
  }
}

document.querySelector("#feed-search").addEventListener("input", renderTenderFeed);
document.querySelector("#feed-sector").addEventListener("change", renderTenderFeed);
document.querySelector("#feed-region").addEventListener("change", renderTenderFeed);
renderTenderFeed();
renderDemoDetail();

leadForm.querySelectorAll('input[name="intent"]').forEach((radio) => {
  radio.addEventListener("change", () => setIntent(radio.value));
});
setIntent(leadForm.querySelector('input[name="intent"]:checked').value);

document.querySelectorAll("[data-intent-link]").forEach((link) => {
  link.addEventListener("click", () => setIntent(link.dataset.intentLink));
});

document.querySelector("#preview-request").addEventListener("click", () => {
  if (!leadForm.reportValidity()) return;

  const intent = leadForm.querySelector('input[name="intent"]:checked').value;
  const intentLabels = {
    respond: "demande d’accompagnement pour répondre à un AO",
    receive: "demande de réception d’AO liés à votre activité",
    contact: "prise de contact au sujet de votre projet"
  };
  const intentLabel = intentLabels[intent];
  formFeedback.textContent = `Parcours prévisualisé : ${intentLabel}. Cette demande de démonstration n’a pas été transmise.`;
  formFeedback.hidden = false;
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


/* Interaction du schéma SVG : survol visuel et sélection accessible au clavier */
const interactiveSvg = document.querySelector("#majestios-interactive-svg");
if (interactiveSvg) {
  const surfaceNames = {
    "central-bleu": "Marchés publics",
    "central-bleu-clair": "Veille des marchés",
    "central-vert": "Marchés privés",
    "central-turquoise": "Prospection inversée",
    "central-orange": "Développement commercial",
    "central-corail": "Intelligence économique",
    "peripherique-turquoise": "Réseaux et synergies",
    "peripherique-vert": "Sous-traitance et débordement de marchés",
    "peripherique-corail": "Accompagnement aux appels d’offres",
    "peripherique-orange": "Veille des entreprises — BODACC",
    "peripherique-violet": "Salons et séminaires",
    "peripherique-violet-clair": "Suivi commercial et capitalisation"
  };
  const surfaceDestinations = {
    "central-bleu": "marches-publics.html",
    "central-bleu-clair": "veille-marches.html",
    "central-vert": "marches-prives.html",
    "central-turquoise": "prospection-inversee.html",
    "central-orange": "developpement-commercial.html",
    "central-corail": "intelligence-economique.html",
    "peripherique-turquoise": "reseaux-synergies.html",
    "peripherique-vert": "sous-traitance.html",
    "peripherique-corail": "accompagnement-appels-offres.html",
    "peripherique-orange": "bodacc-veille-entreprises.html",
    "peripherique-violet": "salons-seminaires.html",
    "peripherique-violet-clair": "suivi-commercial.html"
  };
  const initializeInteractiveSvg = () => {
    const svgDocument = interactiveSvg.contentDocument;
    if (!svgDocument || interactiveSvg.dataset.interactionsReady === "true") return;
    const surfaces = [...svgDocument.querySelectorAll("[data-surface]")];
    const title = document.querySelector("#interactive-map-selection");
    const description = document.querySelector("#interactive-map-description");
    if (!surfaces.length || !title || !description) return;
    interactiveSvg.dataset.interactionsReady = "true";
    let selectedSurface = null;

    const showDefault = () => {
      title.textContent = "Choisissez une surface";
      description.textContent = "Survolez un losange pour le mettre en relief, puis cliquez ou utilisez Entrée pour ouvrir sa rubrique dédiée."
    };

    const previewSurface = (surface) => {
      const name = surfaceNames[surface.dataset.surface] || "Surface";
      title.textContent = selectedSurface === surface
        ? `${name} sélectionnée`
        : `Découvrir — ${name.toLowerCase()}`;
      description.textContent = selectedSurface === surface
        ? "Rubrique sélectionnée. Cliquez à nouveau ou utilisez Entrée pour ouvrir la page dédiée."
        : "Cliquez sur ce losange pour accéder à sa page dédiée."
    };

    const selectSurface = (surface) => {
      selectedSurface = surface;
      surfaces.forEach((item) => {
        const isSelected = item === surface;
        item.classList.toggle("selected", isSelected);
        item.setAttribute("aria-pressed", String(isSelected));
      });
      previewSurface(surface);
      const destination = surfaceDestinations[surface.dataset.surface];
      if (destination) window.location.href = destination;
    };

    surfaces.forEach((surface) => {
      surface.setAttribute("aria-pressed", "false");
      surface.addEventListener("pointerenter", () => previewSurface(surface));
      surface.addEventListener("focus", () => previewSurface(surface));
      surface.addEventListener("click", () => selectSurface(surface));
      surface.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectSurface(surface);
        }
      });
      surface.addEventListener("pointerleave", () => {
        if (selectedSurface) previewSurface(selectedSurface);
        else showDefault();
      });
      surface.addEventListener("blur", () => {
        if (selectedSurface) previewSurface(selectedSurface);
        else showDefault();
      });
    });
  };

  // Le SVG peut finir de charger avant ou après ce script : couvrir les deux cas.
  interactiveSvg.addEventListener("load", initializeInteractiveSvg);
  initializeInteractiveSvg();
}


const personalSpaceDialog = document.querySelector("#personal-space-dialog");
const openPersonalSpace = document.querySelector("#open-personal-space");
const closePersonalSpace = document.querySelector("#close-personal-space");
const personalSpaceForm = document.querySelector("#personal-space-form");
const personalSpaceFeedback = document.querySelector("#personal-space-feedback");

openPersonalSpace?.addEventListener("click", () => {
  if (typeof personalSpaceDialog?.showModal === "function") personalSpaceDialog.showModal();
});
closePersonalSpace?.addEventListener("click", () => personalSpaceDialog?.close());
personalSpaceDialog?.addEventListener("click", (event) => {
  if (event.target === personalSpaceDialog) personalSpaceDialog.close();
});
personalSpaceForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!personalSpaceForm.reportValidity()) return;
  personalSpaceFeedback.textContent = "Votre demande a été prévisualisée. Aucune donnée n’a été envoyée ni enregistrée : la création réelle de compte reste à connecter.";
  personalSpaceFeedback.hidden = false;
});


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
  currentPage.textContent = interiorTitle.textContent.replace(/\\s+/g, " ").trim();
  breadcrumb.append(homeLink, separator, currentPage);
  interiorPage.prepend(breadcrumb);
}
