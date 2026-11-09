(() => {
  "use strict";

  const root = document.querySelector("[data-reputation-workspace]");
  const page = document.querySelector(".reputation-page");
  if (!root || !page) return;

  const output = root.querySelector("[data-consultation-content]");
  const status = root.querySelector("[data-consultation-status]");
  const dossierForm = page.querySelector("[data-audit-dossier-form]");
  const dossierState = page.querySelector("[data-audit-dossier-state]");
  const dossierSummary = page.querySelector("[data-audit-dossier-summary]");
  const resetButton = page.querySelector("[data-audit-dossier-reset]");
  const DOSSIER_KEY = "majestios.reputation.auditDossier.v1";
  const LOG_KEY = "majestios.reputation.searchLog.v1";
  let dossier = null;
  let searchLog = [];

  const readSession = (key, fallback) => {
    try {
      const value = sessionStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (_) {
      return fallback;
    }
  };
  const writeSession = (key, value) => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (_) {
      return false;
    }
  };
  const setStatus = (message) => { if (status) status.textContent = message; };

  const addTextRow = (container, label, value) => {
    const row = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = label + " : ";
    row.append(strong, document.createTextNode(value || "Non renseigné"));
    container.append(row);
  };

  const renderDossier = () => {
    if (!dossier) {
      dossierState.textContent = "Dossier non renseigné";
      dossierSummary.hidden = true;
      dossierSummary.replaceChildren();
      return;
    }
    dossierState.textContent = "Dossier préparé · session en cours";
    dossierSummary.hidden = false;
    dossierSummary.replaceChildren();
    const heading = document.createElement("h3");
    heading.textContent = "Dossier d’audit actif";
    dossierSummary.append(heading);
    addTextRow(dossierSummary, "Entreprise", dossier.company);
    addTextRow(dossierSummary, "Activité", dossier.activity);
    addTextRow(dossierSummary, "Site", dossier.website);
    addTextRow(dossierSummary, "Territoire", dossier.territory);
    addTextRow(dossierSummary, "Clientèle", dossier.audience);
    addTextRow(dossierSummary, "Objectif", dossier.objective);

    const logHeading = document.createElement("h4");
    logHeading.textContent = "Journal des recherches de cette session";
    dossierSummary.append(logHeading);
    if (!searchLog.length) {
      const empty = document.createElement("p");
      empty.textContent = "Aucune recherche enregistrée pour le moment.";
      dossierSummary.append(empty);
      return;
    }
    const list = document.createElement("ol");
    searchLog.slice().reverse().forEach((entry) => {
      const item = document.createElement("li");
      const when = new Date(entry.at).toLocaleString("fr-FR");
      item.textContent = when + " — " + entry.type + " : " + entry.query;
      list.append(item);
    });
    dossierSummary.append(list);
  };

  const showMessage = (title, detail) => {
    output.replaceChildren();
    const box = document.createElement("div");
    box.className = "consultation-placeholder";
    const heading = document.createElement("strong");
    heading.textContent = title;
    const paragraph = document.createElement("p");
    paragraph.textContent = detail;
    box.append(heading, paragraph);
    output.append(box);
  };

  const makeFallbackLink = (url, label) => {
    const wrapper = document.createElement("div");
    wrapper.className = "consultation-fallback";
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = label;
    wrapper.append(link);
    output.append(wrapper);
  };

  const renderGoogleFrame = ({ url, title, fallbackUrl, fallbackLabel, className }) => {
    output.replaceChildren();
    const frame = document.createElement("iframe");
    frame.className = className;
    frame.title = title;
    frame.loading = "eager";
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    frame.allowFullscreen = true;
    frame.src = url;
    output.append(frame);
    makeFallbackLink(fallbackUrl, fallbackLabel);
    setStatus("Tentative d’affichage intégré");
    window.setTimeout(() => {
      if (frame.isConnected) setStatus("Affichage Google soumis aux restrictions du navigateur");
    }, 5000);
  };

  dossier = readSession(DOSSIER_KEY, null);
  searchLog = readSession(LOG_KEY, []);
  if (dossier && dossierForm) {
    Object.entries(dossier).forEach(([key, value]) => {
      const field = dossierForm.elements.namedItem(key);
      if (field) field.value = value;
    });
  }
  renderDossier();

  dossierForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = new FormData(dossierForm);
    dossier = {
      company: String(values.get("company") || "").trim(),
      activity: String(values.get("activity") || "").trim(),
      website: String(values.get("website") || "").trim(),
      territory: String(values.get("territory") || "").trim(),
      audience: String(values.get("audience") || "").trim(),
      objective: String(values.get("objective") || "").trim(),
      preparedAt: new Date().toISOString()
    };
    if (!writeSession(DOSSIER_KEY, dossier)) {
      dossierState.textContent = "Stockage de session indisponible";
      return;
    }
    renderDossier();
  });

  resetButton?.addEventListener("click", () => {
    dossier = null;
    searchLog = [];
    try {
      sessionStorage.removeItem(DOSSIER_KEY);
      sessionStorage.removeItem(LOG_KEY);
    } catch (_) {}
    dossierForm?.reset();
    renderDossier();
  });

  root.querySelectorAll("[data-reputation-search]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const type = form.dataset.reputationSearch;
      const query = form.querySelector('input[type="search"]')?.value.trim();
      if (!query) return;

      if (dossier) {
        searchLog.push({ type: type === "web" ? "Google Web" : "Google Maps", query, at: new Date().toISOString() });
        searchLog = searchLog.slice(-50);
        writeSession(LOG_KEY, searchLog);
        renderDossier();
      }

      const encoded = encodeURIComponent(query);
      if (type === "web") {
        renderGoogleFrame({
          url: "https://www.google.com/search?igu=1&q=" + encoded,
          title: "Recherche Google Web pour " + query,
          fallbackUrl: "https://www.google.com/search?q=" + encoded,
          fallbackLabel: "Si Google bloque l’affichage intégré, ouvrir cette recherche Google dans un nouvel onglet",
          className: "reputation-google-frame"
        });
        return;
      }
      renderGoogleFrame({
        url: "https://www.google.com/maps?q=" + encoded + "&output=embed",
        title: "Recherche Google Maps pour " + query,
        fallbackUrl: "https://www.google.com/maps/search/?api=1&query=" + encoded,
        fallbackLabel: "Ouvrir cette recherche dans Google Maps",
        className: "reputation-map-frame"
      });
    });
  });

  showMessage(
    "Commencez par une recherche",
    "Préparez d’abord le dossier de l’entreprise, puis lancez vos consultations Google. Les recherches effectuées seront horodatées dans le journal de cette session ; MajestiOS ne lit pas le contenu interne des pages Google."
  );
})();
