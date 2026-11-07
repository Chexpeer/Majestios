/* Signaux BODACC dédiés à la prospection d'entreprises.
   Ce connecteur est indépendant du moteur des marchés privés : il restitue des événements
   légaux à rapprocher d'entreprises, jamais des appels d'offres. */
(function (root) {
  "use strict";

  const API = "https://bodacc-datadila.opendatasoft.com/api/explore/v2.1/catalog/datasets/annonces-commerciales/records";
  const FIELDS = [
    "id", "dateparution", "numeroannonce", "typeavis_lib", "familleavis", "familleavis_lib",
    "departement_nom_officiel", "commercant", "ville", "registre", "acte", "jugement",
    "modificationsgenerales", "divers", "url_complete"
  ].join(",");
  const FAMILY_TERMS = {
    creations: ["creation", "immatriculation", "constitution"],
    cessions: ["vente", "cession", "reprise"],
    modifications: ["modification", "transfert", "changement"],
    procedures: ["procedure", "redressement", "liquidation", "sauvegarde"],
    radiations: ["radiation", "cessation", "dissolution"]
  };
  const normalize = (value) => String(value == null ? "" : value)
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr").trim();
  const flatten = (value) => {
    if (value == null) return "";
    if (Array.isArray(value)) return value.map(flatten).filter(Boolean).join(" ");
    if (typeof value === "object") return Object.values(value).map(flatten).filter(Boolean).join(" ");
    return String(value);
  };
  const escapeHtml = (value) => String(value == null ? "" : value).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
  function unwrap(payload) {
    if (Array.isArray(payload && payload.results)) return payload.results;
    if (Array.isArray(payload && payload.records)) {
      return payload.records.map((item) => item && (item.record?.fields || item.fields || item)).filter(Boolean);
    }
    return [];
  }
  function matchesFamily(record, family) {
    if (!family || family === "all") return true;
    const terms = FAMILY_TERMS[family];
    if (!terms) return false;
    const officialFamily = normalize([record.familleavis_lib, record.familleavis].join(" "));
    const haystack = normalize([
      officialFamily, flatten(record.acte), flatten(record.jugement),
      flatten(record.modificationsgenerales), flatten(record.divers)
    ].join(" "));
    const knownFamily = Object.values(FAMILY_TERMS).some((values) => values.some((term) => officialFamily.includes(term)));
    return terms.some((term) => (knownFamily ? officialFamily : haystack).includes(term));
  }
  function normalizeSignal(record) {
    const source = record || {};
    const family = String(source.familleavis_lib || source.familleavis || "Annonce BODACC");
    const familyKey = Object.keys(FAMILY_TERMS).find((key) => matchesFamily(source, key)) || "other";
    const vigilance = familyKey === "procedures" || familyKey === "radiations";
    const id = String(source.id || source.numeroannonce || "");
    const officialUrl = typeof source.url_complete === "string" && /^https:\/\/(www\.)?bodacc\.fr\//i.test(source.url_complete)
      ? source.url_complete
      : "https://www.bodacc.fr/pages/annonces-commerciales-recherche/";
    return {
      id,
      company: String(source.commercant || "Entreprise non renseignée"),
      family,
      familyKey,
      department: String(source.departement_nom_officiel || ""),
      city: String(source.ville || ""),
      publishedAt: String(source.dateparution || ""),
      registry: String(source.registre || ""),
      details: flatten([source.acte, source.jugement, source.modificationsgenerales, source.divers]).slice(0, 700),
      officialUrl,
      signalKind: vigilance ? "vigilance à examiner" : "événement d’entreprise à qualifier",
      isVigilance: vigilance,
      source: "BODACC — DILA"
    };
  }
  async function searchSignals(criteria) {
    const options = criteria || {};
    const query = String(options.query || "").trim();
    const department = String(options.department || "").trim();
    const family = String(options.family || "all");
    if (!query && !department) throw new Error("Saisissez un mot-clé ou choisissez un département pour limiter la recherche.");
    if (family !== "all" && !FAMILY_TERMS[family]) throw new Error("Famille de signaux BODACC inconnue.");
    const limit = Number.isInteger(options.limit) ? Math.max(1, Math.min(options.limit, 10)) : 10;
    const timeoutMs = Number.isInteger(options.timeoutMs) ? Math.max(1000, Math.min(options.timeoutMs, 30000)) : 12000;
    const url = new URL(API);
    url.searchParams.set("limit", "100");
    url.searchParams.set("order_by", "dateparution desc");
    url.searchParams.set("select", FIELDS);
    if (query) url.searchParams.set("q", query);
    if (department) url.searchParams.set("where", 'departement_nom_officiel = "' + department.replace(/"/g, '\\"') + '"');
    const controller = typeof AbortController === "function" ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
    let response;
    try {
      response = await fetch(url.toString(), {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: controller ? controller.signal : undefined
      });
    } catch (error) {
      if (timer) clearTimeout(timer);
      throw new Error(error && error.name === "AbortError"
        ? "La recherche BODACC a dépassé le délai autorisé."
        : "La source BODACC est momentanément inaccessible.");
    }
    if (timer) clearTimeout(timer);
    if (!response || !response.ok) throw new Error("La source BODACC a répondu avec le statut " + (response ? response.status : "inconnu") + ".");
    let payload;
    try { payload = await response.json(); } catch { throw new Error("La réponse BODACC est illisible."); }
    const seen = new Set();
    const signals = [];
    for (const raw of unwrap(payload)) {
      const signal = normalizeSignal(raw);
      if (!signal.id || seen.has(signal.id) || !matchesFamily(raw, family)) continue;
      seen.add(signal.id);
      signals.push(signal);
      if (signals.length >= limit) break;
    }
    return {
      signals,
      source: "BODACC — Direction de l’information légale et administrative",
      sourceUrl: "https://www.bodacc.fr/pages/donnees-ouvertes-et-api/",
      fetchedAt: new Date().toISOString(),
      returnedCount: unwrap(payload).length,
      note: "Un avis BODACC est un signal légal publié. Il ne prouve ni un besoin d'achat, ni un budget, ni une intention de devenir client. Vérification humaine indispensable."
    };
  }

  function renderSignals(container, result) {
    if (!container) return;
    if (!result.signals.length) {
      container.innerHTML = '<p class="small-note">Aucun signal ne correspond aux critères parmi les annonces récupérées.</p>';
      return;
    }
    container.innerHTML = result.signals.map((signal) =>
      '<article class="opportunity-result-card prospecting-signal-card">' +
        '<p class="eyebrow">SIGNAL DE PROSPECTION · BODACC</p>' +
        '<h3>' + escapeHtml(signal.company) + '</h3>' +
        '<p><strong>Événement :</strong> ' + escapeHtml(signal.family) + '</p>' +
        (signal.city || signal.department ? '<p><strong>Localisation :</strong> ' + escapeHtml([signal.city, signal.department].filter(Boolean).join(" · ")) + '</p>' : '') +
        '<p><strong>Publication :</strong> ' + escapeHtml(signal.publishedAt || "Date non renseignée") + '</p>' +
        '<p><strong>Lecture :</strong> ' + escapeHtml(signal.signalKind) + '</p>' +
        (signal.details ? '<p><strong>Extrait :</strong> ' + escapeHtml(signal.details) + '</p>' : '') +
        '<a class="button-secondary" href="' + escapeHtml(signal.officialUrl) + '" target="_blank" rel="noopener noreferrer">Vérifier l’avis officiel ↗</a>' +
      '</article>'
    ).join("");
    const note = document.createElement("p");
    note.className = "small-note";
    note.textContent = result.note;
    container.append(note);
  }

  function initPage() {
    if (!root.document) return;
    const form = root.document.getElementById("prospecting-signals-form");
    const output = root.document.getElementById("prospecting-signals-results");
    const status = root.document.getElementById("prospecting-signals-status");
    if (!form || !output || !status) return;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const submit = form.querySelector('button[type="submit"]');
      if (submit) submit.disabled = true;
      status.textContent = "Interrogation de la source officielle BODACC…";
      output.replaceChildren();
      try {
        const data = await searchSignals({
          query: form.elements.query.value,
          department: form.elements.department.value,
          family: form.elements.family.value,
          limit: Number(form.elements.limit.value)
        });
        renderSignals(output, data);
        status.textContent = data.signals.length + " signal(aux) trouvé(s) dans les annonces récupérées. Source : BODACC.";
      } catch (error) {
        status.textContent = error.message || "La recherche n’a pas abouti.";
      } finally {
        if (submit) submit.disabled = false;
      }
    });
  }

  const api = { unwrap, matchesFamily, normalizeSignal, searchSignals, renderSignals };
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.MajestiosProspectingSignals = api;
  if (root.document) {
    if (root.document.readyState === "loading") root.document.addEventListener("DOMContentLoaded", initPage, { once: true });
    else initPage();
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
