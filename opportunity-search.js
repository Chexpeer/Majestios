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
    maintenance: ["maintenance", "entretien", "exploitation"],
    nettoyage: ["nettoyage", "propreté", "nettoyage industriel", "entretien des locaux", "nettoyage des locaux"]
  };
  const CATEGORY_TYPES = { services: "SERVICES", travaux: "TRAVAUX" };
  const PUBLIC_CATEGORIES = new Set([...Object.keys(CATEGORY_TERMS), ...Object.keys(CATEGORY_TYPES), "autre"]);
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

  const DEPARTMENT_CODES = new Set(["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","2A","2B","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59","60","61","62","63","64","65","66","67","68","69","70","71","72","73","74","75","76","77","78","79","80","81","82","83","84","85","86","87","88","89","90","91","92","93","94","95","971","972","973","974","976"]);

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
  const activeRequests = new WeakMap();

  const cancelRequest = (panel) => {
    const active = activeRequests.get(panel);
    if (active) active.abort();
    activeRequests.delete(panel);
  };

  const beginRequest = (panel) => {
    cancelRequest(panel);
    const controller = new AbortController();
    activeRequests.set(panel, controller);
    const timeoutId = window.setTimeout(() => controller.abort(), 12000);
    return {
      signal: controller.signal,
      isCurrent: () => activeRequests.get(panel) === controller,
      finish: () => {
        window.clearTimeout(timeoutId);
        if (activeRequests.get(panel) === controller) activeRequests.delete(panel);
      }
    };
  };


  const buildContactUrl = (source, reference, params) => {
    const contactParams = new URLSearchParams(params);
    contactParams.set("objet", source === "BOAMP" ? "public-market" : "private-market");
    contactParams.set("source", source);
    if (reference) contactParams.set("reference", reference);
    return "contact.html?" + contactParams.toString();
  };

  async function render(options) {
    const panel = options.panel;
    const params = options.params;
    const category = options.category || params.get("categorie") || "all";
    const resultLimit = Number.isFinite(options.resultLimit) ? options.resultLimit : MAX_RESULTS;
    const query = (params.get("q") || "").trim();
    const market = params.get("marche") || "";
    const empty = panel.querySelector(".category-results-empty");
    if (!empty) return;
    if (category === "autre" && !query) {
      empty.textContent = "La catégorie Autre nécessite un mot-clé. Précisez le sujet pour lancer une recherche libre dans la source sélectionnée.";
      empty.setAttribute("role", "status");
      return;
    }
    cancelRequest(panel);
    // Une nouvelle exécution remplace les cartes et notes précédentes au lieu de les empiler.
    panel.querySelectorAll(".opportunity-results-list, .opportunity-source-note").forEach((node) => node.remove());

    // Les appels d'offres publics et privés ne sont jamais regroupés : le type doit être choisi d'emblée.
    if (market !== "public" && market !== "private") {
      panel.querySelectorAll(".opportunity-source-group").forEach((group) => group.remove());
      empty.textContent = "Choisissez d’abord le type d’appel d’offres : public ou privé. Les deux ne sont jamais mélangés.";
      empty.setAttribute("role", "status");
      for (const [value, label] of [["public", "Appels d’offres publics →"], ["private", "Appels d’offres privés →"]]) {
        const choiceParams = new URLSearchParams(params);
        choiceParams.set("marche", value);
        choiceParams.delete("categorie");
        const link = document.createElement("a");
        link.className = "button-primary button-compact";
        link.href = "resultats-recherche.html?" + choiceParams.toString();
        link.textContent = label;
        empty.append(" ", link);
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
      if (category !== "all" && category !== "autre" && !BODACC_CATEGORY_TERMS[category]) {
        empty.textContent = "Cette catégorie privée n’est pas reconnue par le moteur. Choisissez une rubrique disponible.";
        return;
      }
      empty.textContent = "Connexion à la source officielle BODACC en cours…";
      const bodaccUrl = new URL(BODACC_API);
      bodaccUrl.searchParams.set("limit", "100");
      bodaccUrl.searchParams.set("order_by", "dateparution desc");
      bodaccUrl.searchParams.set("select", BODACC_FIELDS);
      if (query) bodaccUrl.searchParams.set("q", query);
      const department = params.get("departement") || "all";
      const departments = (window.MAJESTIOS_CATALOG?.searchDepartments || []).filter((item) => item.value === department);
      if (department !== "all" && !departments.length) {
        empty.textContent = "Ce département n’est pas reconnu. Choisissez un département français disponible ou « Tous les départements ».";
        return;
      }
      if (departments.length) bodaccUrl.searchParams.set("where", 'departement_nom_officiel = "' + departments[0].label.replace(/"/g, '\\"') + '"');
      const request = beginRequest(panel);
      try {
        const response = await fetch(bodaccUrl.toString(), { headers: { Accept: "application/json" }, signal: request.signal });
        if (!response.ok) throw new Error("HTTP " + response.status);
        const payload = await response.json();
        if (!request.isCurrent()) return;
        const records = Array.isArray(payload.results)
          ? payload.results
          : Array.isArray(payload.records)
            ? payload.records.map((item) => item?.record?.fields || item?.fields || {}).filter((record) => Object.keys(record).length)
            : [];
        const filtered = records.filter((record) => {
          const family = normalize([record.familleavis_lib, record.familleavis].join(" "));
          const haystack = normalize([
            record.id, record.numeroannonce, record.registre, record.typeavis_lib,
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
            const contactUrl = buildContactUrl("BODACC", identifier, params);
            return '<article class="opportunity-result-card bodacc-result-card">' +
              '<p class="eyebrow">SIGNAL D’ENTREPRISE · BODACC</p>' +
              '<h3>' + escapeHtml(company) + '</h3>' +
              '<p><strong>Type d’annonce :</strong> ' + escapeHtml(eventType) + '</p>' +
              (place ? '<p><strong>Localisation :</strong> ' + escapeHtml(place) + '</p>' : '') +
              '<p><strong>Publication :</strong> ' + escapeHtml(date) + '</p>' +
              (activity ? '<p><strong>Activité déclarée :</strong> ' + escapeHtml(activity.slice(0, 400)) + '</p>' : '') +
              (identifier ? '<p><strong>Référence :</strong> ' + escapeHtml(identifier) + '</p>' : '') +
              (details ? '<p><strong>Extrait publié :</strong> ' + escapeHtml(details.slice(0, 500)) + '</p>' : '') +

              '<a class="button-primary button-compact opportunity-contact-link" href="' + escapeHtml(contactUrl) + '">Demander un accompagnement →</a>' +
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
        if (!request.isCurrent()) return;
        empty.textContent = "La source BODACC est momentanément inaccessible depuis cette page. Aucun signal n’est inventé. Réessayez dans quelques instants.";
      } finally {
        request.finish();
      }
      return;
    }

    if (category !== "all" && !PUBLIC_CATEGORIES.has(category)) {
      empty.textContent = "Cette catégorie publique n’est pas reconnue. Choisissez une rubrique disponible.";
      empty.setAttribute("role", "status");
      return;
    }

    const url = new URL(API);
    url.searchParams.set("limit", "100");
    url.searchParams.set("order_by", "dateparution desc");
    url.searchParams.set("select", FIELDS);
    const filters = ['nature = "APPEL_OFFRE"'];
    if (CATEGORY_TYPES[category]) filters.push('type_marche = "' + CATEGORY_TYPES[category] + '"');

    const department = params.get("departement") || "all";
    if (department !== "all") {
      if (!DEPARTMENT_CODES.has(department)) {
        empty.textContent = "Ce département n’est pas reconnu. Choisissez un département français disponible ou « Tous les départements ».";
        return;
      }
      filters.push('(code_departement_prestation = "' + department + '" OR code_departement = "' + department + '")');
    }
    url.searchParams.set("where", filters.join(" AND "));
    // Sans mot-clé utilisateur, ne pas imposer un seul terme serveur pour une catégorie :
    // on filtre localement avec l'ensemble des termes afin de ne pas perdre les synonymes. 
    if (query) url.searchParams.set("q", query);

    const request = beginRequest(panel);
    try {
      const response = await fetch(url.toString(), { headers: { Accept: "application/json" }, signal: request.signal });
      if (!response.ok) throw new Error("HTTP " + response.status);
      const payload = await response.json();
      if (!request.isCurrent()) return;
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
                    const identifier = record.idweb || record.id || "";
          const contactUrl = buildContactUrl("BOAMP", identifier, params);
          return '<article class="opportunity-result-card">' +
            '<p class="eyebrow">MARCHÉ PUBLIC · ' + escapeHtml(record.type_marche_facette || record.famille_libelle || "BOAMP") + '</p>' +
            '<h3>' + escapeHtml(title) + '</h3>' +
            '<p><strong>Acheteur :</strong> ' + escapeHtml(buyer) + '</p>' +
            (departments ? '<p><strong>Département :</strong> ' + escapeHtml(departments) + '</p>' : '') +
            '<p><strong>Publication :</strong> ' + escapeHtml(publication) + '</p>' +
            '<p><strong>Date limite :</strong> ' + escapeHtml(deadlineLabel) + '</p>' +

            '<a class="button-primary button-compact opportunity-contact-link" href="' + escapeHtml(contactUrl) + '">Me positionner →</a>' +
            '</article>';
        }).join("");
        empty.textContent = filtered.length + " résultat(s) affiché(s) depuis BOAMP. Les critères métier restent à confirmer : nous pouvons vous aider à analyser l’avis.";
        empty.insertAdjacentElement("afterend", results);
      } else {
        empty.textContent = records.length
          ? "Aucun résultat ne correspond à tous les critères sélectionnés parmi les annonces récentes récupérées. Essayez un mot-clé plus large ou une autre catégorie."
          : "La source BOAMP a répondu sans fournir d’annonce pour cette recherche. Modifiez les critères ou réessayez plus tard.";
      }

      const sourceNote = document.createElement("p");
      sourceNote.className = "small-note opportunity-source-note";
      sourceNote.textContent = "Source : BOAMP / DILA. Données consultées à la demande ; les résultats ne remplacent pas l’analyse du dossier de consultation.";
      (results.isConnected ? results : empty).insertAdjacentElement("afterend", sourceNote);
    } catch (error) {
      if (!request.isCurrent()) return;
      empty.textContent = "La source BOAMP est momentanément inaccessible depuis cette page. Aucun résultat n’est inventé. Réessayez dans quelques instants.";
    } finally {
      request.finish();
    }
  }

  window.MajestiosOpportunitySearch = Object.freeze({ render });
})();
