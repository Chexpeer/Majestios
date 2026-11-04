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

    if (defaultPlaceholder) defaultPlaceholder.hidden = view === "brainios";
    if (brainiosWorkspace) brainiosWorkspace.hidden = view !== "brainios";

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
