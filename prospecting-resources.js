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
    { id:"qualibat", name:"QUALIBAT — qualifications bâtiment", kind:"certification_api", status:"proxy_required", coverage:"Vérifier les qualifications et certifications d’une entreprise par SIRET ; API du bouquet Entreprise annoncée ouverte", url:"https://www.data.gouv.fr/dataservices/api-certification-qualibat-qualibat-bouquet-api-entreprise", configKey:"qualibatProxyUrl" },
    { id:"qualifelec", name:"QUALIFELEC — qualifications électriques", kind:"certification_api", status:"access_restricted", coverage:"Certification et qualifications des entreprises électriques ; conditions d’accès à confirmer", url:"https://www.qualifelec.fr/", configKey:"qualifelecProxyUrl" },
    { id:"opqibi", name:"OPQIBI — qualifications ingénierie", kind:"certification_api", status:"access_restricted", coverage:"Qualifications des bureaux d’études et de l’ingénierie ; accès API à confirmer", url:"https://www.opqibi.com/", configKey:"opqibiProxyUrl" },
    { id:"fntp", name:"FNTP — entreprises de travaux publics", kind:"certification_api", status:"access_restricted", coverage:"Carte professionnelle et référencement d’entrepreneurs de travaux publics ; accès API réservé selon habilitation", url:"https://www.fntp.fr/", configKey:"fntpProxyUrl" },
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
    if (source.status === "access_restricted") return "Accès soumis à habilitation ou conditions du fournisseur";
    return "Catalogue de sources — connecteur à contractualiser ou documenter";
  }

  async function searchRge(criteria) {
    const options = criteria || {};
    const query = String(options.query || "").trim();
    const department = String(options.department || "").trim();
    if (!query && !department) throw new Error("Saisissez une entreprise ou choisissez un département.");
    const base = "https://data.ademe.fr/data-fair/api/v1/datasets/liste-des-entreprises-rge-2";
    const metadataResponse = await fetch(base, { headers:{Accept:"application/json"} });
    if (!metadataResponse.ok) throw new Error("Impossible de préparer la recherche de qualifications (HTTP " + metadataResponse.status + ").");
    const metadata = await metadataResponse.json();
    const fields = Array.isArray(metadata.schema) ? metadata.schema.map(field => field.key) : [];
    const departmentFields = ["code_departement","departement","departement_code","dpt","code_postal"];
    const deptField = departmentFields.find(name => fields.includes(name));
    if (department && !deptField) throw new Error("Le référentiel ne fournit pas de champ géographique exploitable : filtre département non appliqué.");
    if ((department.toUpperCase() === "2A" || department.toUpperCase() === "2B") && deptField === "code_postal") {
      throw new Error("Le référentiel RGE ne fournit que le code postal : il ne permet pas de distinguer précisément la Corse-du-Sud (2A) de la Haute-Corse (2B). Choisissez une commune ou recherchez sans filtre départemental.");
    }
    const url = new URL(base + "/lines");
    url.searchParams.set("size", "100");
    if (query) url.searchParams.set("q", query);
    const response = await fetch(url.toString(), { headers:{Accept:"application/json"} });
    if (!response.ok) throw new Error("Le service de données a répondu avec le statut " + response.status + ".");
    const payload = await response.json();
    const rows = Array.isArray(payload.results) ? payload.results : [];
    const digits = value => String(value == null ? "" : value).replace(/\D/g,"");
    const target = digits(department);
    const filtered = department ? rows.filter(row => {
      const raw = row[deptField];
      if (deptField === "code_postal") return digits(raw).startsWith(target);
      if (department.toUpperCase() === "2A" || department.toUpperCase() === "2B") {
        return String(raw || "").trim().toUpperCase() === department.toUpperCase();
      }
      return digits(raw) === target || String(raw || "").trim().toUpperCase() === department.toUpperCase();
    }) : rows;
    return {
      records:filtered.slice(0, Math.min(100, Math.max(1, Number(options.limit) || 10))),
      fields,
      departmentFilterApplied:!department || Boolean(deptField),
      fetchedAt:new Date().toISOString()
    };
  }

  async function searchQualification(siret) {
    const cleanSiret = String(siret || "").replace(/\D/g, "");
    if (!/^\d{14}$/.test(cleanSiret)) throw new Error("Un SIRET valide à 14 chiffres est nécessaire.");
    const connectorIds = ["qualibat","qualifelec","opqibi","fntp"];
    const configured = connectorIds.filter(id => {
      const item = SOURCES.find(source => source.id === id);
      return Boolean(item && item.configKey && config()[item.configKey]);
    });
    if (!configured.length) return { siret:cleanSiret, results:[], checkedCount:0, successCount:0, available:false };
    const settled = await Promise.allSettled(configured.map(id => searchConfiguredProxy(id, { siret:cleanSiret })));
    const results = settled.filter(item => item.status === "fulfilled").map(item => item.value);
    return { siret:cleanSiret, results, checkedCount:configured.length, successCount:results.length, available:true };
  }

  async function searchConfiguredProxy(sourceId, criteria) {
    const source = SOURCES.find(item => item.id === sourceId);
    if (!source || !source.configKey) throw new Error("Source non reconnue.");
    const endpoint = config()[source.configKey];
    if (!endpoint) throw new Error("Le service de qualification n’est pas configuré côté serveur.");
    const url = new URL(endpoint, root.location && root.location.origin ? root.location.origin : undefined);
    Object.entries(criteria || {}).forEach(([key,value]) => { if (value != null && value !== "") url.searchParams.set(key, String(value)); });
    const response = await fetch(url.toString(), { headers:{Accept:"application/json"} });
    if (!response.ok) throw new Error("Un service de qualification a répondu avec le statut " + response.status + ".");
    return response.json();
  }

  function renderCatalog(container) {
    if (!container) return;
    container.replaceChildren();
    container.hidden = true;
    container.setAttribute("aria-hidden", "true");
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
      status.textContent = "Recherche des qualifications professionnelles…";
      output.replaceChildren();
      try {
        const result = await searchRge({query:form.elements.query.value, department:form.elements.department.value, limit:Number(form.elements.limit.value)});
        if (!result.records.length) status.textContent = "Aucun résultat correspondant à ces critères.";
        else {
          output.innerHTML = result.records.map(record => {
            const name = record.raison_sociale || record.nom_entreprise || record.nom || record.denomination || "Entreprise RGE";
            const siren = record.siren || record.siret || "";
            const details = [record.domaine || record.domaine_travaux, record.commune || record.ville, record.code_departement || record.departement].filter(Boolean).join(" · ");
            return '<article class="opportunity-result-card"><h3>' + escapeHtml(name) + '</h3><p>' + escapeHtml(details || "Qualification RGE référencée") + '</p>' + (siren ? '<p>Identifiant : ' + escapeHtml(siren) + '</p>' : '') + '<p class="small-note">Données à rapprocher du SIRET et à vérifier à la date de prise de contact.</p></article>';
          }).join("");
          status.textContent = result.records.length + " résultat(s) de qualification retrouvé(s)." + (result.departmentFilterApplied ? "" : " Attention : le schéma actuel ne permet pas de confirmer le filtre départemental ; vérifiez la localisation de chaque fiche.");
        }
      } catch (error) { status.textContent = error.message || "La recherche de qualifications a échoué."; }
      finally { if (button) button.disabled = false; }
    });

    const qualificationForm = root.document.getElementById("prospecting-qualification-form");
    const qualificationStatus = root.document.getElementById("prospecting-qualification-status");
    const qualificationResult = root.document.getElementById("prospecting-qualification-result");
    if (qualificationForm && qualificationStatus && qualificationResult) {
      qualificationForm.addEventListener("submit", async event => {
        event.preventDefault();
        qualificationResult.hidden = true;
        qualificationResult.textContent = "";
        qualificationStatus.textContent = "Vérification des qualifications professionnelles…";
        const button = qualificationForm.querySelector('button[type="submit"]');
        if (button) button.disabled = true;
        try {
          const data = await searchQualification(qualificationForm.elements.siret.value);
          qualificationResult.textContent = data.successCount ? "Vérification terminée : " + data.successCount + " qualification(s) à examiner." : "Aucune qualification n’a pu être confirmée pour le moment.";
          qualificationResult.hidden = false;
          qualificationStatus.textContent = "Vérification terminée. Contrôlez la validité des qualifications avant toute prise de contact.";
        } catch (error) {
          qualificationStatus.textContent = error.message || "La vérification n’a pas abouti.";
        } finally { if (button) button.disabled = false; }
      });
    }
  }

  const api = { searchRge, searchQualification, renderCatalog };
  if (typeof module === "object" && module.exports) module.exports = api;
  root.MajestiosProspectingResources = api;
  if (root.document) {
    if (root.document.readyState === "loading") root.document.addEventListener("DOMContentLoaded", init, {once:true});
    else init();
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
