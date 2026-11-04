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
})();
