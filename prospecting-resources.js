/* Catalogue et connecteurs des ressources complémentaires de prospection.
 * Les sources nécessitant des secrets passent obligatoirement par un proxy serveur.
 * Aucun jeton INSEE/INPI ne doit être exposé dans le navigateur.
 */
(function (root) {
  "use strict";

  const SOURCES = [
    { id:"recherche-entreprises", name:"Annuaire des Entreprises / API Recherche", kind:"api", status:"connected", coverage:"Recherche ouverte ; données agrégées SIRENE/RNE", url:"https://annuaire-entreprises.data.gouv.fr/donnees/api-entreprises" },
    { id:"sirene", name:"INSEE — répertoire SIRENE", kind:"api", status:"proxy_required", coverage:"Identité légale, établissements, APE/NAF, effectifs et historique", url:"https://www.insee.fr/fr/information/3591226", configKey:"sireneProxyUrl" },
    { id:"rne", name:"INPI — Registre national des entreprises", kind:"api", status:"proxy_required", coverage:"Immatriculations, modifications, cessations, actes et comptes non confidentiels", url:"https://data.inpi.fr/content/editorial/Acces_API_Entreprises", configKey:"rneProxyUrl" },
    { id:"ademe-rge", name:"ADEME — entreprises qualifiées RGE", kind:"open_api", status:"available", coverage:"Entreprises du bâtiment, domaines de travaux et périodes de qualification", url:"https://data.ademe.fr/datasets/liste-des-entreprises-rge-2", dataset:"liste-des-entreprises-rge-2" },
    { id:"annuaire-pro", name:"Annuaires professionnels et fédérations", kind:"directory", status:"catalogued", coverage:"Répertoires sectoriels à intégrer avec accord et conditions de réutilisation", url:"https://www.data.gouv.fr/dataservices/search" },
    { id:"sous-traitance", name:"Réseaux et plateformes de sous-traitance", kind:"directory", status:"catalogued", coverage:"Offres et demandes de partenariat ; intégration API au cas par cas", url:"https://www.data.gouv.fr/dataservices/search" }
  ];

  const config = () => root.MAJESTIOS_PROSPECTING_CONFIG || {};
  const normalize = (v) => String(v == null ? "" : v).normalize("NFD").replace(/[\\u0300-\\u036f]/g,"").toLowerCase().trim();
  const escapeHtml = (v) => String(v == null ? "" : v).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

  function sourceState(source) {
    if (source.configKey && !config()[source.configKey]) return "Accès serveur à configurer";
    if (source.status === "connected") return "Déjà connecté";
    if (source.status === "available") return "API ouverte à interroger";
    return "Catalogue de sources — connecteur à contractualiser ou documenter";
  }

  async function searchRge(criteria) {
    const options = criteria || {};
    const query = String(options.query || "").trim();
    const department = String(options.department || "").trim();
    if (!query && !department) throw new Error("Saisissez une entreprise ou choisissez un département.");
    const base = "https://data.ademe.fr/data-fair/api/v1/datasets/liste-des-entreprises-rge-2";
    const metadataResponse = await fetch(base, { headers:{Accept:"application/json"} });
    if (!metadataResponse.ok) throw new Error("Impossible de lire le schéma ADEME (HTTP " + metadataResponse.status + ").");
    const metadata = await metadataResponse.json();
    const fields = Array.isArray(metadata.schema) ? metadata.schema.map(field => field.key) : [];
    const departmentFields = ["code_departement","departement","departement_code","dpt","code_postal"];
    const deptField = departmentFields.find(name => fields.includes(name));
    if (department && !deptField) throw new Error("Le schéma ADEME ne fournit pas de champ géographique exploitable : filtre département non appliqué.");
    const url = new URL(base + "/lines");
    url.searchParams.set("size", "100");
    if (query) url.searchParams.set("q", query);
    const response = await fetch(url.toString(), { headers:{Accept:"application/json"} });
    if (!response.ok) throw new Error("L’API ADEME a répondu avec le statut " + response.status + ".");
    const payload = await response.json();
    const rows = Array.isArray(payload.results) ? payload.results : [];
    const digits = value => String(value == null ? "" : value).replace(/\\D/g,"");
    const target = digits(department);
    const filtered = department ? rows.filter(row => {
      const raw = row[deptField];
      if (deptField === "code_postal") return digits(raw).startsWith(target);
      return digits(raw) === target || String(raw || "").trim().toUpperCase() === department.toUpperCase();
    }) : rows;
    return {
      source:"ADEME — entreprises RGE",
      sourceUrl:"https://data.ademe.fr/datasets/liste-des-entreprises-rge-2",
      records:filtered.slice(0, Math.min(100, Math.max(1, Number(options.limit) || 10))),
      fields,
      departmentFilterApplied:!department || Boolean(deptField),
      fetchedAt:new Date().toISOString()
    };
  }

  async function searchConfiguredProxy(sourceId, criteria) {
    const source = SOURCES.find(item => item.id === sourceId);
    if (!source || !source.configKey) throw new Error("Source non reconnue.");
    const endpoint = config()[source.configKey];
    if (!endpoint) throw new Error("Le connecteur serveur " + source.name + " n’est pas configuré. Aucun identifiant secret ne doit être placé dans le navigateur.");
    const url = new URL(endpoint, root.location && root.location.origin ? root.location.origin : undefined);
    Object.entries(criteria || {}).forEach(([key,value]) => { if (value != null && value !== "") url.searchParams.set(key, String(value)); });
    const response = await fetch(url.toString(), { headers:{Accept:"application/json"} });
    if (!response.ok) throw new Error(source.name + " : réponse HTTP " + response.status + ".");
    return response.json();
  }

  function renderCatalog(container) {
    if (!container) return;
    container.innerHTML = SOURCES.map(source =>
      '<article class="opportunity-result-card prospecting-source-card">' +
        '<h3>' + escapeHtml(source.name) + '</h3>' +
        '<p>' + escapeHtml(source.coverage) + '</p>' +
        '<p><strong>État :</strong> ' + escapeHtml(sourceState(source)) + '</p>' +
        '<a class="button-secondary" href="' + escapeHtml(source.url) + '" target="_blank" rel="noopener noreferrer">Documentation officielle ↗</a>' +
      '</article>'
    ).join("");
  }

  function init() {
    if (!root.document) return;
    const catalog = root.document.getElementById("prospecting-resource-catalog");
    renderCatalog(catalog);
    const form = root.document.getElementById("prospecting-rge-form");
    const deptSelect = form && form.elements.department;
    const departments = root.MAJESTIOS_CATALOG && root.MAJESTIOS_CATALOG.searchDepartments;
    if (deptSelect && Array.isArray(departments)) {
      departments.forEach(item => {
        const option = root.document.createElement("option");
        option.value = item.value;
        option.textContent = item.value + " — " + item.label;
        deptSelect.append(option);
      });
    }
    const output = root.document.getElementById("prospecting-rge-results");
    const status = root.document.getElementById("prospecting-rge-status");
    if (!form || !output || !status) return;
    form.addEventListener("submit", async event => {
      event.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      if (button) button.disabled = true;
      status.textContent = "Interrogation de la base ADEME…";
      output.replaceChildren();
      try {
        const result = await searchRge({query:form.elements.query.value, department:form.elements.department.value, limit:Number(form.elements.limit.value)});
        if (!result.records.length) status.textContent = "Aucun résultat retourné par la source ADEME pour ces critères.";
        else {
          output.innerHTML = result.records.map(record => {
            const name = record.raison_sociale || record.nom_entreprise || record.nom || record.denomination || "Entreprise RGE";
            const siren = record.siren || record.siret || "";
            const details = [record.domaine || record.domaine_travaux, record.commune || record.ville, record.code_departement || record.departement].filter(Boolean).join(" · ");
            return '<article class="opportunity-result-card"><h3>' + escapeHtml(name) + '</h3><p>' + escapeHtml(details || "Qualification RGE référencée par l’ADEME") + '</p>' + (siren ? '<p>Identifiant : ' + escapeHtml(siren) + '</p>' : '') + '<p class="small-note">Source : ADEME · données à rapprocher du SIRET et à vérifier à la date de prise de contact.</p></article>';
          }).join("");
          status.textContent = result.records.length + " résultat(s) retourné(s) par l’ADEME." + (result.departmentFilterApplied ? "" : " Attention : le schéma actuel ne permet pas de confirmer le filtre départemental ; vérifiez la localisation de chaque fiche.");
        }
      } catch (error) { status.textContent = error.message || "La recherche ADEME a échoué."; }
      finally { if (button) button.disabled = false; }
    });
  }

  const api = { SOURCES, sourceState, searchRge, searchConfiguredProxy, renderCatalog };
  if (typeof module === "object" && module.exports) module.exports = api;
  root.MajestiosProspectingResources = api;
  if (root.document) {
    if (root.document.readyState === "loading") root.document.addEventListener("DOMContentLoaded", init, {once:true});
    else init();
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
