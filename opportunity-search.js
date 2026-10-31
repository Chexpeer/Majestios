(() => {
  "use strict";

  const API = "https://boamp-datadila.opendatasoft.com/api/explore/v2.0/catalog/datasets/boamp/records";
  const SOURCE_LABEL = "BOAMP · Direction de l’information légale et administrative (DILA)";
  const CATEGORY_TERMS = {
    conseil: ["conseil", "étude", "études", "audit", "expertise"],
    batiment: ["bâtiment", "construction", "gros œuvre", "maçonnerie"],
    renovation: ["rénovation", "réhabilitation", "rénovation énergétique"],
    electricite: ["électricité", "électrique", "éclairage"],
    plomberie: ["plomberie", "chauffage", "sanitaire", "thermique"],
    maintenance: ["maintenance", "entretien", "exploitation"]
  };
  const CATEGORY_TYPES = { services: "SERVICES", travaux: "TRAVAUX" };
  const FIELDS = [
    "idweb", "id", "objet", "famille_libelle", "dateparution", "datelimitereponse",
    "nomacheteur", "code_departement", "code_departement_prestation",
    "type_marche", "type_marche_facette", "type_avis", "descripteur_libelle", "etat", "url_avis"
  ].join(",");

  const normalize = (value) => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr").trim();
  const escapeHtml = (value) => String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
  const formatDate = (value) => {
    if (!value) return "Non renseignée — à vérifier";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? String(value) : new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(date);
  };
  const categoryMatches = (record, category) => {
    if (!category || category === "all") return true;
    const type = normalize(record.type_marche || record.type_marche_facette);
    if (CATEGORY_TYPES[category]) return type.includes(normalize(CATEGORY_TYPES[category]));
    const terms = CATEGORY_TERMS[category];
    if (!terms) return true;
    const text = normalize([record.objet, record.descripteur_libelle, record.type_marche_facette].join(" "));
    return terms.some((term) => text.includes(normalize(term)));
  };
  const keywordMatches = (record, query) => {
    if (!query) return true;
    const haystack = normalize([record.objet, record.descripteur_libelle, record.nomacheteur, record.type_marche_facette].join(" "));
    return normalize(query).split(/\s+/).filter(Boolean).every((term) => haystack.includes(term));
  };
  const isExpired = (record) => {
    if (!record.datelimitereponse) return false;
    const deadline = new Date(record.datelimitereponse);
    return !Number.isNaN(deadline.getTime()) && deadline.getTime() < Date.now();
  };
  const officialUrl = (record) => {
    if (typeof record.url_avis === "string" && /^https:\/\/(www\.)?boamp\.fr\//i.test(record.url_avis)) return record.url_avis;
    if (record.idweb) return "https://www.boamp.fr/pages/avis/?q=" + encodeURIComponent("idweb:" + record.idweb);
    return "https://www.boamp.fr/";
  };

  async function render(options) {
    const panel = options.panel;
    const params = options.params;
    const category = options.category || params.get("categorie") || "all";
    const query = (params.get("q") || "").trim();
    const market = params.get("marche") || "all";
    const empty = panel.querySelector(".category-results-empty");
    if (!empty) return;

    const results = document.createElement("div");
    results.className = "opportunity-results-list";
    results.setAttribute("aria-live", "polite");
    empty.textContent = "Connexion à la source officielle BOAMP en cours…";
    empty.setAttribute("role", "status");

    if (market === "private") {
      empty.textContent = "La recherche de marchés privés n’est pas encore raccordée à une source. Aucun résultat public n’est mélangé à cette recherche.";
      return;
    }

    const url = new URL(API);
    url.searchParams.set("limit", "100");
    url.searchParams.set("order_by", "dateparution desc");
    url.searchParams.set("select", FIELDS);
    const filters = ['nature = "APPEL_OFFRE"'];
    if (CATEGORY_TYPES[category]) filters.push('type_marche = "' + CATEGORY_TYPES[category] + '"');
    url.searchParams.set("where", filters.join(" AND "));
    if (query) url.searchParams.set("q", query);
    else if (CATEGORY_TERMS[category]?.length) url.searchParams.set("q", CATEGORY_TERMS[category][0]);

    try {
      const response = await fetch(url.toString(), { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("HTTP " + response.status);
      const payload = await response.json();
      const records = Array.isArray(payload.results) ? payload.results : [];
      const filtered = records
        .filter((record) => !isExpired(record))
        .filter((record) => categoryMatches(record, category))
        .filter((record) => keywordMatches(record, query))
        .slice(0, 20);

      if (filtered.length) {
        results.innerHTML = filtered.map((record) => {
          const title = record.objet || "Objet de l’annonce non renseigné";
          const buyer = record.nomacheteur || "Acheteur non renseigné dans l’extrait";
          const departments = record.code_departement_prestation || record.code_departement || "";
          const deadline = record.datelimitereponse;
          const deadlineLabel = deadline ? formatDate(deadline) : "Non renseignée — vérifier l’avis";
          const publication = formatDate(record.dateparution);
          const url = officialUrl(record);
          return '<article class="platform-card opportunity-result-card">' +
            '<p class="eyebrow">MARCHÉ PUBLIC · ' + escapeHtml(record.type_marche_facette || record.famille_libelle || "BOAMP") + '</p>' +
            '<h3>' + escapeHtml(title) + '</h3>' +
            '<p><strong>Acheteur :</strong> ' + escapeHtml(buyer) + '</p>' +
            (departments ? '<p><strong>Département :</strong> ' + escapeHtml(departments) + '</p>' : '') +
            '<p><strong>Publication :</strong> ' + escapeHtml(publication) + '</p>' +
            '<p><strong>Date limite :</strong> ' + escapeHtml(deadlineLabel) + '</p>' +
            '<p class="small-note">Source vérifiable : ' + escapeHtml(SOURCE_LABEL) + '. Consultez l’avis officiel pour confirmer les pièces, les lots et l’échéance.</p>' +
            '<a class="button-primary" href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer">Consulter l’avis officiel ↗</a>' +
            '</article>';
        }).join("");
        empty.textContent = filtered.length + " résultat(s) affiché(s) depuis BOAMP. Les critères métier restent à confirmer à la lecture de l’avis officiel.";
        empty.insertAdjacentElement("afterend", results);
      } else {
        empty.textContent = records.length
          ? "Aucun résultat ne correspond à tous les critères sélectionnés parmi les annonces récentes récupérées. Essayez un mot-clé plus large ou une autre catégorie."
          : "La source BOAMP a répondu sans fournir d’annonce pour cette recherche. Modifiez les critères ou réessayez plus tard.";
      }

      if (market === "all") {
        const privateNote = document.createElement("p");
        privateNote.className = "small-note opportunity-source-note";
        privateNote.textContent = "Cette recherche affiche uniquement les résultats publics BOAMP. Les marchés privés seront ajoutés lorsqu’une source dédiée aura été connectée.";
        (results.isConnected ? results : empty).insertAdjacentElement("afterend", privateNote);
      }
      const sourceNote = document.createElement("p");
      sourceNote.className = "small-note opportunity-source-note";
      sourceNote.textContent = "Source : BOAMP / DILA. Données consultées à la demande ; les résultats ne remplacent pas la vérification des documents officiels.";
      (results.isConnected ? results : empty).insertAdjacentElement("afterend", sourceNote);
    } catch (error) {
      empty.textContent = "La source BOAMP est momentanément inaccessible depuis cette page. Aucun résultat n’est inventé. Réessayez ou consultez directement le site officiel BOAMP.";
      const link = document.createElement("a");
      link.href = "https://www.boamp.fr/";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Ouvrir BOAMP ↗";
      empty.append(" ", link);
    }
  }

  window.MajestiosOpportunitySearch = Object.freeze({ render });
})();
