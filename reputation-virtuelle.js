import { createClient } from "https://esm.sh/@supabase/supabase-js@2.119.0";
import { MAJESTIOS_SUPABASE } from "./supabase-config.js";

(() => {
  "use strict";

  const supabase = createClient(MAJESTIOS_SUPABASE.url, MAJESTIOS_SUPABASE.publishableKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
  });

  const root = document.querySelector("[data-reputation-workspace]");
  const page = document.querySelector(".reputation-page");
  if (!root || !page) return;

  const output = root.querySelector("[data-consultation-content]");
  const status = root.querySelector("[data-consultation-status]");
  const dossierForm = page.querySelector("[data-audit-dossier-form]");
  const dossierState = page.querySelector("[data-audit-dossier-state]");
  const dossierSummary = page.querySelector("[data-audit-dossier-summary]");
  const resetButton = page.querySelector("[data-audit-dossier-reset]");
  const runAuditButton = page.querySelector("[data-audit-run]");
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
      if (runAuditButton) runAuditButton.disabled = true;
      return;
    }
    dossierState.textContent = "Dossier préparé · session en cours";
    if (runAuditButton) runAuditButton.disabled = false;
    dossierSummary.hidden = false;
    dossierSummary.replaceChildren();
    const heading = document.createElement("h3");
    heading.textContent = "Dossier d’audit actif";
    dossierSummary.append(heading);
    addTextRow(dossierSummary, "Entreprise", dossier.company);
    addTextRow(dossierSummary, "SIREN", dossier.siren);
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
      siren: String(values.get("siren") || "").replace(/\s+/g, "").trim(),
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


  const renderAuditReport = (result) => {
    output.replaceChildren();
    const heading = document.createElement("h3");
    heading.textContent = result.analysis?.summary || result.notice || "Collecte Cheexpeer terminée";
    output.append(heading);

    const notice = document.createElement("p");
    notice.textContent = result.analysis?.notice || result.analysis_notice || result.notice || "";
    output.append(notice);

    const evidence = result.analysis?.evidence || result.evidence || [];
    const evidenceHeading = document.createElement("h4");
    evidenceHeading.textContent = "Éléments vérifiés (" + evidence.length + ")";
    output.append(evidenceHeading);
    const evidenceList = document.createElement("ul");
    evidence.forEach((item) => {
      const li = document.createElement("li");
      const title = document.createElement("strong");
      title.textContent = item.title || "Observation";
      const detail = document.createElement("p");
      detail.textContent = (item.excerpt || "") + " · " + (item.subject_match || "correspondance non confirmée");
      li.append(title, detail);
      if (item.reference) {
        const link = document.createElement("a");
        link.href = item.reference;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "Consulter la source";
        li.append(link);
      }
      evidenceList.append(li);
    });
    output.append(evidenceList);

    const findings = result.analysis?.findings || [];
    const findingsHeading = document.createElement("h4");
    findingsHeading.textContent = "Constats soumis à validation (" + findings.length + ")";
    output.append(findingsHeading);
    const findingsList = document.createElement("ol");
    findings.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = "[" + item.classification + " · confiance " + item.confidence + "] " + item.statement +
        " — preuves : " + item.evidence_ids.join(", ");
      findingsList.append(li);
    });
    output.append(findingsList);

    const recommendations = result.analysis?.recommendations || [];
    if (recommendations.length) {
      const recommendationsHeading = document.createElement("h4");
      recommendationsHeading.textContent = "Pistes d’action à valider";
      output.append(recommendationsHeading);
      const list = document.createElement("ul");
      recommendations.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item.action + " — " + item.rationale;
        list.append(li);
      });
      output.append(list);
    }

    const gaps = result.analysis?.gaps || [];
    if (gaps.length) {
      const gapsHeading = document.createElement("h4");
      gapsHeading.textContent = "Informations encore nécessaires";
      output.append(gapsHeading);
      const list = document.createElement("ul");
      gaps.forEach((gap) => {
        const li = document.createElement("li");
        li.textContent = gap;
        list.append(li);
      });
      output.append(list);
    }
    setStatus(result.analysis ? "Analyse Cheexpeer prête · validation humaine requise" : result.analysis_unavailable ? "Collecte seule · analyse IA indisponible" : "Collecte seule · moteur IA non configuré");
  };

  runAuditButton?.addEventListener("click", async () => {
    if (!dossier) {
      showMessage("Dossier incomplet", "Préparez d’abord le dossier de l’entreprise.");
      return;
    }
    runAuditButton.disabled = true;
    setStatus("Collecte et analyse en cours…");
    showMessage("Cheexpeer travaille", "Vérification des sources officielles et préparation des constats. Cette opération peut prendre quelques instants.");
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;
      if (!session?.access_token) {
        showMessage("Connexion requise", "Connectez-vous à votre espace privé MajestiOS pour lancer un audit Cheexpeer.");
        setStatus("Authentification requise");
        return;
      }
      const { data, error } = await supabase.functions.invoke("reputation-audit-context", {
        body: {
          subject: dossier.company,
          siren: dossier.siren,
          website: dossier.website,
          activity: dossier.activity,
          territory: dossier.territory,
          objectives: [dossier.objective, dossier.audience].filter(Boolean)
        },
        headers: { Authorization: "Bearer " + session.access_token }
      });
      if (error) throw error;
      if (!data || data.error) throw new Error(data?.error || "Réponse Cheexpeer invalide.");
      renderAuditReport(data);
    } catch (error) {
      showMessage("Audit non abouti", error?.message || "Le service Cheexpeer est momentanément indisponible. Aucune conclusion n’a été produite.");
      setStatus("Échec de l’audit");
    } finally {
      runAuditButton.disabled = false;
    }
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
    "Cheexpeer · audit assisté",
    "Préparez le dossier puis lancez un audit depuis votre espace membre. Cheexpeer collecte le contexte administratif et les annonces légales accessibles ; si le moteur IA est configuré côté serveur, il analyse les seules preuves disponibles. La validation humaine reste obligatoire."
  );
})();
