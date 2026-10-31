(() => {
  "use strict";

  const API = "https://boamp-datadila.opendatasoft.com/api/explore/v2.0/catalog/datasets/boamp/records";
  const BODACC_API = "https://bodacc-datadila.opendatasoft.com/api/explore/v2.1/catalog/datasets/annonces-commerciales/records";
  const BODACC_FIELDS = [
    "id", "publicationavis", "dateparution", "numeroannonce", "typeavis_lib", "familleavis", "familleavis_lib",
    "departement_nom_officiel", "commercant", "ville", "registre", "listepersonnes",
    "listeetablissements", "jugement", "acte", "modificationsgenerales", "divers", "region_nom_officiel", "url_complete"
  ].join(",");

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
  const BODACC_CATEGORY_TERMS = {
    services: ["service", "prestation", "informatique", "conseil"],
    travaux: ["travaux", "construction", "bâtiment", "rénovation"],
    conseil: ["conseil", "étude", "audit", "expertise"],
    batiment: ["bâtiment", "construction", "maçonnerie", "gros œuvre"],
    renovation: ["rénovation", "réhabilitation", "isolation", "amélioration énergétique"],
    electricite: ["électricité", "électrique", "éclairage"],
    plomberie: ["plomberie", "chauffage", "sanitaire", "thermique"],
    maintenance: ["maintenance", "entretien", "exploitation"]
  };
  const FIELDS = [
    "idweb", "id", "objet", "famille_libelle", "dateparution", "datelimitereponse",
    "nomacheteur", "code_departement", "code_departement_prestation",
    "type_marche", "type_marche_facette", "type_avis", "descripteur_libelle", "etat", "url_avis"
  ].join(",");

  const normalize = (value) => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr").trim();
  const flattenText = (value) => {
    if (value == null) return "";
    if (Array.isArray(value)) return value.map(flattenText).filter(Boolean).join(" ");
    if (typeof value === "object") return Object.values(value).map(flattenText).filter(Boolean).join(" ");
    return String(value);
  };
  const extractActivity = (value) => {
    if (value == null) return "";
    if (Array.isArray(value)) return value.map(extractActivity).filter(Boolean).join(" ");
    if (typeof value === "string") {
      try { return extractActivity(JSON.parse(value)); } catch { return ""; }
    }
    if (typeof value !== "object") return "";
    return Object.entries(value).map(([key, item]) => {
      if (/activit[ée]/i.test(key) && typeof item === "string") return item;
      return extractActivity(item);
    }).filter(Boolean).join(" ");
  };
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
      empty.textContent = "Connexion à la source officielle BODACC en cours…";
      const bodaccUrl = new URL(BODACC_API);
      bodaccUrl.searchParams.set("limit", "40");
      bodaccUrl.searchParams.set("order_by", "dateparution desc");
      bodaccUrl.searchParams.set("select", BODACC_FIELDS);
      if (query) bodaccUrl.searchParams.set("q", query);
      const region = params.get("zone") || "all";
      const regions = {
        "nouvelle-aquitaine": "Nouvelle-Aquitaine", "ile-de-france": "Île-de-France",
        "auvergne-rhone-alpes": "Auvergne-Rhône-Alpes", occitanie: "Occitanie",
        "pays-de-la-loire": "Pays de la Loire", bretagne: "Bretagne", normandie: "Normandie",
        "hauts-de-france": "Hauts-de-France", "grand-est": "Grand Est",
        "bourgogne-franche-comte": "Bourgogne-Franche-Comté", "centre-val-de-loire": "Centre-Val de Loire",
        "provence-alpes-cote-d-azur": "Provence-Alpes-Côte d’Azur", corse: "Corse"
      };
      if (regions[region]) bodaccUrl.searchParams.set("where", 'region_nom_officiel = "' + regions[region].replace(/"/g, '\\"') + '"');
      try {
        const response = await fetch(bodaccUrl.toString(), { headers: { Accept: "application/json" } });
        if (!response.ok) throw new Error("HTTP " + response.status);
        const payload = await response.json();
        const records = Array.isArray(payload.results)
          ? payload.results
          : Array.isArray(payload.records)
            ? payload.records.map((item) => item?.record?.fields || item?.fields || {}).filter((record) => Object.keys(record).length)
            : [];
        const filtered = records.filter((record) => {
          const haystack = normalize([
            record.commercant, record.ville, record.departement_nom_officiel, record.familleavis_lib,
            flattenText(record.listepersonnes), flattenText(record.listeetablissements), flattenText(record.acte), flattenText(record.jugement),
            flattenText(record.modificationsgenerales), flattenText(record.divers)
          ].join(" "));
          const queryMatches = !query || normalize(query).split(/\s+/).filter(Boolean).every((term) => haystack.includes(term));
          const categoryTerms = BODACC_CATEGORY_TERMS[category];
          const categoryMatches = !categoryTerms?.length || categoryTerms.some((term) => haystack.includes(normalize(term)));
          return queryMatches && categoryMatches;
        }).slice(0, 20);
        if (!filtered.length) {
          empty.textContent = records.length
            ? "Aucun signal BODACC ne correspond à tous les mots-clés parmi les annonces récentes récupérées. Essayez une recherche plus large."
            : "La source BODACC a répondu sans annonce pour ces critères. Modifiez la recherche ou réessayez plus tard.";
        } else {
          results.innerHTML = filtered.map((record) => {
            const company = record.commercant || "Entreprise non renseignée dans l’extrait";
            const eventType = record.familleavis_lib || record.familleavis || "Annonce commerciale";
            const place = [record.ville, record.departement_nom_officiel].filter(Boolean).join(" · ");
            const activity = extractActivity(record.listepersonnes) || extractActivity(record.listeetablissements);
            const date = formatDate(record.dateparution);
            const identifier = record.id || record.numeroannonce || "";
            const details = [record.acte, record.jugement, record.modificationsgenerales].map((value) => {
              if (!value) return "";
              if (typeof value === "string") return value;
              return [value.nature, value.famille, value.complementJugement, value.date].filter(Boolean).join(" — ");
            }).filter(Boolean).join(" ");
            const sourceUrl = typeof record.url_complete === "string" && /^https:\/\/(www\.)?bodacc\.fr\//i.test(record.url_complete)
              ? record.url_complete
              : "https://www.bodacc.fr/pages/annonces-commerciales-recherche/?sort=dateparution";
            return '<article class="platform-card opportunity-result-card bodacc-result-card">' +
              '<p class="eyebrow">SIGNAL COMMERCIAL PRIVÉ · BODACC</p>' +
              '<h3>' + escapeHtml(company) + '</h3>' +
              '<p><strong>Type d’annonce :</strong> ' + escapeHtml(eventType) + '</p>' +
              (place ? '<p><strong>Localisation :</strong> ' + escapeHtml(place) + '</p>' : '') +
              '<p><strong>Publication :</strong> ' + escapeHtml(date) + '</p>' +
              (activity ? '<p><strong>Activité déclarée :</strong> ' + escapeHtml(activity.slice(0, 400)) + '</p>' : '') +
              (identifier ? '<p><strong>Référence :</strong> ' + escapeHtml(identifier) + '</p>' : '') +
              (details ? '<p><strong>Extrait publié :</strong> ' + escapeHtml(details.slice(0, 500)) + '</p>' : '') +
              '<p class="small-note">Signal public à qualifier par une personne habilitée. Il ne prouve pas, à lui seul, l’existence d’un besoin d’achat ni une intention commerciale.</p>' +
              '<a class="button-primary" href="' + escapeHtml(sourceUrl) + '" target="_blank" rel="noopener noreferrer">Consulter l’annonce officielle ↗</a>' +
              '</article>';
          }).join("");
          empty.textContent = filtered.length + " signal(aux) BODACC affiché(s). La qualification commerciale reste à confirmer par l’équipe MajestiOS.";
          empty.insertAdjacentElement("afterend", results);
        }
        const note = document.createElement("p");
        note.className = "small-note opportunity-source-note";
        note.textContent = "Source : BODACC / DILA. Les annonces légales sont des signaux à vérifier, pas des marchés à remporter. Données consultées à la demande ; la date de publication et le contenu doivent être contrôlés sur la source officielle.";
        (results.isConnected ? results : empty).insertAdjacentElement("afterend", note);
      } catch (error) {
        empty.textContent = "La source BODACC est momentanément inaccessible depuis cette page. Aucun signal n’est inventé. Réessayez ou consultez directement la recherche officielle.";
        const link = document.createElement("a");
        link.href = "https://www.bodacc.fr/pages/annonces-commerciales-recherche/?sort=dateparution";
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "Ouvrir la recherche BODACC ↗";
        empty.append(" ", link);
      }
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
      const records = Array.isArray(payload.results)
        ? payload.results
        : Array.isArray(payload.records)
          ? payload.records.map((item) => item?.record?.fields || item?.fields || {}).filter((record) => Object.keys(record).length)
          : [];
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
        privateNote.textContent = "Cette vue affiche uniquement les résultats publics BOAMP. Pour consulter les signaux commerciaux privés du BODACC, sélectionnez « Marchés privés » afin de conserver une qualification et une provenance distinctes.";
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
