(() => {
  "use strict";

  const moduleContent = {
    brainios: {
      title: "BrainIOS",
      description: "Le copilote qui comprend le projet, conserve les décisions et prépare les évolutions.",
    },
    requests: {
      title: "Demandes & lots",
      description: "Un espace unique pour transformer les idées en demandes structurées, priorités et lots vérifiables.",
    },
    workshop: {
      title: "Atelier GitHub",
      description: "Branches isolées, changements proposés, diffs, pull requests et suivi des contrôles.",
    },
    "site-map": {
      title: "Site & arborescence",
      description: "Inventaire des pages publiques réellement intégrées au build de prévisualisation.",
    },
    quality: {
      title: "Qualité & tests",
      description: "Builds, tests, contrôles anti-régression, sécurité et preuves de validation.",
    },
    seo: {
      title: "SEO & visibilité",
      description: "Surveillance technique, indexation, contenu, performance et visibilité dans les moteurs.",
    },
    settings: {
      title: "Paramètres",
      description: "Connexions, budgets, permissions, préférences et configuration des modules.",
    },
  };

  const sidebar = document.querySelector("#sidebar");
  const menuToggle = document.querySelector("#menu-toggle");
  const overview = document.querySelector('[data-page="overview"]');
  const moduleView = document.querySelector("#module-view");
  const breadcrumb = document.querySelector("#breadcrumb-current");
  const moduleTitle = document.querySelector("#module-title");
  const moduleDescription = document.querySelector("#module-description");
  const defaultPlaceholder = document.querySelector("#module-placeholder-default");
  const brainiosWorkspace = document.querySelector("#brainios-workspace");
  const siteMapWorkspace = document.querySelector("#site-map-workspace");

  function navigate(view) {
    const links = [...document.querySelectorAll("[data-view]")];
    links.forEach((link) => {
      const active = link.dataset.view === view;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });

    const isOverview = view === "overview";
    overview.hidden = !isOverview;
    moduleView.hidden = isOverview;

    if (defaultPlaceholder) defaultPlaceholder.hidden = view === "brainios" || view === "site-map";
    if (brainiosWorkspace) brainiosWorkspace.hidden = view !== "brainios";
    if (siteMapWorkspace) siteMapWorkspace.hidden = view !== "site-map";
    if (view === "site-map") loadSiteMap();

    if (!isOverview && moduleContent[view]) {
      moduleTitle.textContent = moduleContent[view].title;
      moduleDescription.textContent = moduleContent[view].description;
      breadcrumb.textContent = moduleContent[view].title;
    } else {
      breadcrumb.textContent = "Vue d'ensemble";
    }

    sidebar.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }

  let siteMapLoaded = false;
  async function loadSiteMap() {
    if (siteMapLoaded) return;
    const status = document.querySelector("#site-map-status");
    const sectionsTarget = document.querySelector("#site-map-sections");
    const additionalTarget = document.querySelector("#site-map-additional-pages");
    const count = document.querySelector("#site-map-count");
    if (!status || !sectionsTarget || !additionalTarget) return;
    try {
      const response = await fetch("./site-map.json", { cache: "no-store" });
      if (!response.ok) throw new Error("Inventaire indisponible (" + response.status + ")");
      const data = await response.json();
      const makePageLink = (page) => {
        const row = document.createElement("div");
        row.className = "site-map-page" + (page.presentInBuild ? "" : " is-missing");
        const link = document.createElement("a");
        link.href = "../" + page.href;
        link.textContent = page.href;
        if (!page.presentInBuild) {
          link.removeAttribute("href");
          link.setAttribute("aria-disabled", "true");
        }
        const badge = document.createElement("span");
        badge.className = page.presentInBuild ? "site-map-badge is-present" : "site-map-badge is-missing";
        badge.textContent = page.presentInBuild ? "Présente dans le build" : "Fichier absent";
        row.append(link, badge);
        return row;
      };
      sectionsTarget.replaceChildren();
      (data.sections || []).forEach((section) => {
        const card = document.createElement("details");
        card.className = "site-map-card";
        const summary = document.createElement("summary");
        const title = document.createElement("strong");
        title.textContent = section.id + " · " + section.name;
        const pageCount = document.createElement("span");
        pageCount.textContent = (section.pages || []).length + " lien(s)";
        summary.append(title, pageCount);
        card.append(summary);
        if (section.buildingNote) {
          const note = document.createElement("p");
          note.className = "site-map-note";
          note.textContent = section.buildingNote;
          card.append(note);
        }
        (section.pages || []).forEach((page) => card.append(makePageLink(page)));
        sectionsTarget.append(card);
      });
      additionalTarget.replaceChildren();
      (data.additionalPages || []).forEach((page) => additionalTarget.append(makePageLink(page)));
      count.textContent = data.totalHtmlPages + " pages HTML · inventaire du build";
      status.textContent = "Inventaire chargé depuis le build de prévisualisation. Les liens ci-dessous ouvrent les pages du site dans ce même déploiement.";
      siteMapLoaded = true;
    } catch (error) {
      status.textContent = error.message + ". Vérifiez que ce cockpit est ouvert depuis un déploiement Preview récent.";
      status.classList.add("is-error");
    }
  }

  document.querySelectorAll("[data-view]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const view = link.dataset.view;
      history.replaceState(null, "", `#${view}`);
      navigate(view);
    });
  });

  document.querySelectorAll("[data-go]").forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.dataset.go;
      history.replaceState(null, "", `#${view}`);
      navigate(view);
    });
  });

  menuToggle?.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  window.addEventListener("hashchange", () => {
    const requested = window.location.hash.slice(1);
    navigate(moduleContent[requested] ? requested : "overview");
  });

  const initial = window.location.hash.slice(1);
  navigate(moduleContent[initial] ? initial : "overview");

  const brainiosForm = document.querySelector("#brainios-form");
  const brainiosPrompt = document.querySelector("#brainios-prompt");
  const brainiosConversation = document.querySelector("#brainios-conversation");
  brainiosForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = brainiosPrompt.value.trim();
    if (!message) return;
    const userMessage = document.createElement("article");
    userMessage.className = "brainios-message brainios-message-user";
    const userLabel = document.createElement("strong");
    userLabel.textContent = "Vous";
    const userText = document.createElement("p");
    userText.textContent = message;
    userMessage.append(userLabel, userText);
    brainiosConversation.append(userMessage);
    const reply = document.createElement("article");
    reply.className = "brainios-message brainios-message-assistant";
    const replyLabel = document.createElement("strong");
    replyLabel.textContent = "BrainIOS";
    const replyText = document.createElement("p");
    replyText.textContent = "Demande reçue dans la maquette. La prochaine étape sera de l'analyser avec le contexte documentaire du projet, puis de proposer un plan et des contrôles. Aucun fichier n'a été modifié et aucune action externe n'a été lancée.";
    reply.append(replyLabel, replyText);
    brainiosConversation.append(reply);
    brainiosPrompt.value = "";
    brainiosConversation.scrollTop = brainiosConversation.scrollHeight;
    brainiosPrompt.focus();
  });
  brainiosPrompt?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      brainiosForm?.requestSubmit();
    }
  });
})();
