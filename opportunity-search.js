(() => {
  "use strict";

  const MAX_RESULTS = 10;
  const API = "https://boamp-datadila.opendatasoft.com/api/explore/v2.0/catalog/datasets/boamp/records";
  const BODACC_API = "https://bodacc-datadila.opendatasoft.com/api/explore/v2.1/catalog/datasets/annonces-commerciales/records";
  const BODACC_FIELDS = [
    "id", "publicationavis", "dateparution", "numeroannonce", "typeavis_lib", "familleavis", "familleavis_lib",
    "departement_nom_officiel", "commercant", "ville", "registre", "listepersonnes",
    "listeetablissements", "jugement", "acte", "modificationsgenerales", "divers", "region_nom_officiel", "url_complete"
  ].join(",");

  const SOURCE_LABEL = "BOAMP · Direction de l’information légale et administrative (DILA)";
  const CATEGORY_TERMS = {
    services: ["informatique", "logiciel", "cybersécurité", "numérique", "hébergement", "développement", "télécommunication", "réseau", "plateforme"],
    travaux: ["travaux", "aménagement", "voirie", "espaces verts", "terrassement", "construction", "chantier"],
    conseil: ["conseil", "étude", "études", "audit", "expertise"],
    batiment: ["bâtiment", "construction", "gros œuvre", "maçonnerie"],
    renovation: ["rénovation", "réhabilitation", "rénovation énergétique"],
    electricite: ["électricité", "électrique", "éclairage"],
    plomberie: ["plomberie", "chauffage", "sanitaire", "thermique"],
    maintenance: ["maintenance", "entretien", "exploitation"]
  };
  const CATEGORY_TYPES = { services: "SERVICES", travaux: "TRAVAUX" };
  const BODACC_CATEGORY_TERMS = {
    "bodacc-creations": ["création", "immatriculation", "constitution", "établissement principal", "ouverture"],
    "bodacc-cessions": ["vente", "cession", "fonds de commerce", "reprise", "achat"],
    "bodacc-modifications": ["modification", "transfert", "changement", "augmentation de capital", "siège social"],
    "bodacc-procedures": ["procédure collective", "redressement judiciaire", "liquidation judiciaire", "sauvegarde"],
    "bodacc-radiations": ["radiation", "cessation", "dissolution", "clôture"]
  };
  const PRIVATE_CATEGORIES_NOT_CONNECTED = new Set([
    "immobilier", "emploi", "sous-traitance-offres", "sous-traitance-recherche"
  ]);
  const FIELDS = [
    "idweb", "id", "objet", "famille_libelle", "dateparution", "datelimitereponse",
    "nomacheteur", "code_departement", "code_departement_prestation",
    "type_marche", "type_marche_facette", "type_avis", "descripteur_libelle", "etat", "url_avis"
  ].join(",");

  // Correspondance explicite des régions administratives avec les codes départementaux BOAMP.
  // Les filtres de démonstration "nord/ouest/sud" ne sont volontairement pas interprétés comme des régions réelles.
  const REGION_DEPARTMENTS = {
    "auvergne-rhone-alpes": ["01","03","07","15","26","38","42","43","63","69","73","74"],
    "bourgogne-franche-comte": ["21","25","39","58","70","71","89","90"],
    bretagne: ["22","29","35","56"],
    "centre-val-de-loire": ["18","28","36","37","41","45"],
    corse: ["2A","2B"],
    "grand-est": ["08","10","51","52","54","55","57","67","68","88"],
    "hauts-de-france": ["02","59","60","62","80"],
    "ile-de-france": ["75","77","78","91","92","93","94","95"],
    normandie: ["14","27","50","61","76"],
    "nouvelle-aquitaine": ["16","17","19","23","24","33","40","47","64","79","86","87"],
    occitanie: ["09","11","12","30","31","32","34","46","48","65","66","81","82"],
    "pays-de-la-loire": ["44","49","53","72","85"],
    "provence-alpes-cote-d-azur": ["04","05","06","13","83","84"],
    "outre-mer": ["971","972","973","974","976","975","977","978","986","987","988"]
  };

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
    if (CATEGORY_TYPES[category] && !type.includes(normalize(CATEGORY_TYPES[category]))) return false;
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
    const resultLimit = Number.isFinite(options.resultLimit) ? options.resultLimit : MAX_RESULTS;
    const query = (params.get("q") || "").trim();
    const market = params.get("marche") || "all";
    const empty = panel.querySelector(".category-results-empty");
    if (!empty) return;
    // Une nouvelle exécution remplace les cartes et notes précédentes au lieu de les empiler.
    panel.querySelectorAll(".opportunity-results-list, .opportunity-source-note").forEach((node) => node.remove());

    // « Publics et privés » interroge les deux sources en parallèle, dans des blocs distincts.
    // Les résultats BODACC restent des signaux légaux, jamais des appels d’offres.
    if (market === "all") {
      // Nettoyer les groupes précédents lors d’une nouvelle recherche dans le même panneau.
      panel.querySelectorAll(".opportunity-source-group").forEach((group) => group.remove());
      empty.textContent = "Les résultats sont regroupés ci-dessous par source ; chaque source répond indépendamment.";
      empty.setAttribute("role", "status");
      for (const source of [
        { value: "public", title: "Marchés publics · BOAMP" },
        { value: "private", title: "Signaux d’entreprise publiés · BODACC" }
      ]) {
        const sourcePanel = document.createElement("section");
        sourcePanel.className = "category-results-panel opportunity-source-group";
        sourcePanel.setAttribute("aria-label", source.title);
        const heading = document.createElement("h3");
        heading.textContent = source.title;
        const sourceEmpty = document.createElement("p");
        sourceEmpty.className = "category-results-empty";
        sourceEmpty.textContent = "Préparation de la recherche…";
        sourceEmpty.setAttribute("role", "status");
        sourcePanel.append(heading, sourceEmpty);
        empty.insertAdjacentElement("afterend", sourcePanel);
        const sourceParams = new URLSearchParams(params);
        sourceParams.set("marche", source.value);
        // Une recherche mixte reste plafonnée à 10 cartes au total : 5 maximum par source.
        render({ panel: sourcePanel, params: sourceParams, category, resultLimit: Math.floor(MAX_RESULTS / 2) });
      }
      return;
    }

    const results = document.createElement("div");
    results.className = "opportunity-results-list";
    results.setAttribute("aria-live", "polite");
    empty.textContent = "Connexion à la source officielle BOAMP en cours…";
    empty.setAttribute("role", "status");

    if (market === "private") {
      if (PRIVATE_CATEGORIES_NOT_CONNECTED.has(category)) {
        const labels = {
          immobilier: "Immobilier professionnel",
          emploi: "Emploi et recrutement",
          "sous-traitance-offres": "Offres de sous-traitance",
          "sous-traitance-recherche": "Recherche de sous-traitants et partenaires"
        };
        empty.textContent = labels[category] + " : cette famille d’opportunités est prévue dans la taxonomie MajestiOS, mais sa source de données n’est pas encore connectée. Aucun résultat ne sera inventé. La recherche BODACC reste disponible en choisissant une rubrique BODACC.";
        return;
      }
      if (category !== "all" && !BODACC_CATEGORY_TERMS[category]) {
        empty.textContent = "Cette catégorie privée n’est pas reconnue par le moteur. Choisissez une rubrique disponible.";
        return;
      }
      empty.textContent = "Connexion à la source officielle BODACC en cours…";
      const bodaccUrl = new URL(BODACC_API);
      bodaccUrl.searchParams.set("limit", "40");
      bodaccUrl.searchParams.set("order_by", "dateparution desc");
      bodaccUrl.searchParams.set("select", BODACC_FIELDS);
      if (query) bodaccUrl.searchParams.set("q", query);
      const region = params.get("zone") || "all";
      if (region === "outre-mer") {
        empty.textContent = "Le filtre BODACC pour l’Outre-mer n’est pas encore pris en charge de façon fiable. Choisissez une région précise ou « Toutes les régions » ; aucun résultat non filtré ne sera présenté comme territorial.";
        return;
      }
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
        const response = await fetch(bodaccUrl.toString(), { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(12000) });
        if (!response.ok) throw new Error("HTTP " + response.status);
        const payload = await response.json();
        const records = Array.isArray(payload.results)
          ? payload.results
          : Array.isArray(payload.records)
            ? payload.records.map((item) => item?.record?.fields || item?.fields || {}).filter((record) => Object.keys(record).length)
            : [];
        const filtered = records.filter((record) => {
          const family = normalize([record.familleavis_lib, record.familleavis].join(" "));
          const haystack = normalize([
            record.commercant, record.ville, record.departement_nom_officiel, record.familleavis_lib, record.familleavis,
            flattenText(record.listepersonnes), flattenText(record.listeetablissements), flattenText(record.acte), flattenText(record.jugement),
            flattenText(record.modificationsgenerales), flattenText(record.divers)
          ].join(" "));
          const queryMatches = !query || normalize(query).split(/\s+/).filter(Boolean).every((term) => haystack.includes(term));
          const categoryTerms = BODACC_CATEGORY_TERMS[category];
          const categoryFamilyTerms = {
            "bodacc-creations": ["creation", "immatriculation", "constitution"],
            "bodacc-cessions": ["vente", "cession"],
            "bodacc-modifications": ["modification"],
            "bodacc-procedures": ["procedure", "jugement"],
            "bodacc-radiations": ["radiation", "cessation", "dissolution"]
          }[category];
          const familyKnown = Object.values({
            creations: ["creation", "immatriculation", "constitution"],
            cessions: ["vente", "cession"],
            modifications: ["modification"],
            procedures: ["procedure", "jugement"],
            radiations: ["radiation", "cessation", "dissolution"]
          }).some((terms) => terms.some((term) => family.includes(normalize(term))));
          // La famille officielle prime sur les détails, qui peuvent mentionner d'autres événements.
          const categoryMatches = !categoryTerms?.length || (
            familyKnown
              ? categoryFamilyTerms.some((term) => family.includes(normalize(term)))
              : categoryTerms.some((term) => haystack.includes(normalize(term)))
          );
          return queryMatches && categoryMatches;
        }).slice(0, resultLimit);if (!filtered.length) {
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
            return '<article class="opportunity-result-card bodacc-result-card">' +
              '<p class="eyebrow">SIGNAL D’ENTREPRISE · BODACC</p>' +
              '<h3>' + escapeHtml(company) + '</h3>' +
              '<p><strong>Type d’annonce :</strong> ' + escapeHtml(eventType) + '</p>' +
              (place ? '<p><strong>Localisation :</strong> ' + escapeHtml(place) + '</p>' : '') +
              '<p><strong>Publication :</strong> ' + escapeHtml(date) + '</p>' +
              (activity ? '<p><strong>Activité déclarée :</strong> ' + escapeHtml(activity.slice(0, 400)) + '</p>' : '') +
              (identifier ? '<p><strong>Référence :</strong> ' + escapeHtml(identifier) + '</p>' : '') +
              (details ? '<p><strong>Extrait publié :</strong> ' + escapeHtml(details.slice(0, 500)) + '</p>' : '') +

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

    const region = params.get("zone") || "all";
    if (region !== "all") {
      const departments = REGION_DEPARTMENTS[region];
      if (!departments) {
        empty.textContent = "Cette zone n’est pas encore disponible comme filtre géographique. Choisissez une région administrative ou « Toutes les zones ». Aucun résultat n’est présenté comme filtré.";
        return;
      }
      const departmentFilter = departments.map((code) =>
        '(code_departement_prestation = "' + code + '" OR code_departement = "' + code + '")'
      ).join(" OR ");
      filters.push("(" + departmentFilter + ")");
    }
    url.searchParams.set("where", filters.join(" AND "));
    // Sans mot-clé utilisateur, ne pas imposer un seul terme serveur pour une catégorie :
    // on filtre localement avec l'ensemble des termes afin de ne pas perdre les synonymes. 
    if (query) url.searchParams.set("q", query);

    try {
      const response = await fetch(url.toString(), { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(12000) });
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
        .slice(0, resultLimit);if (filtered.length) {
        results.innerHTML = filtered.map((record) => {
          const title = record.objet || "Objet de l’annonce non renseigné";
          const buyer = record.nomacheteur || "Acheteur non renseigné dans l’extrait";
          const departments = record.code_departement_prestation || record.code_departement || "";
          const deadline = record.datelimitereponse;
          const deadlineLabel = deadline ? formatDate(deadline) : "Non renseignée — vérifier l’avis";
          const publication = formatDate(record.dateparution);
          const url = officialUrl(record);
          return '<article class="opportunity-result-card">' +
            '<p class="eyebrow">MARCHÉ PUBLIC · ' + escapeHtml(record.type_marche_facette || record.famille_libelle || "BOAMP") + '</p>' +
            '<h3>' + escapeHtml(title) + '</h3>' +
            '<p><strong>Acheteur :</strong> ' + escapeHtml(buyer) + '</p>' +
            (departments ? '<p><strong>Département :</strong> ' + escapeHtml(departments) + '</p>' : '') +
            '<p><strong>Publication :</strong> ' + escapeHtml(publication) + '</p>' +
            '<p><strong>Date limite :</strong> ' + escapeHtml(deadlineLabel) + '</p>' +

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
