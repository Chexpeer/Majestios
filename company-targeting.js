/* Brique pure de qualification des entreprises — sans envoi externe ni collecte implicite.
   Les scores sont des indices de rapprochement, pas une preuve de capacité technique. */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.MajestiosCompanyTargeting = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const digits = (value) => String(value == null ? "" : value).replace(/\D/g, "");
  const normalizeCode = (value) => String(value == null ? "" : value).trim().toUpperCase().replace(/\s+/g, "");
  const getFirst = (...values) => values.find((value) => value !== undefined && value !== null && String(value).trim() !== "");

  function normalizeCompany(record) {
    const source = record || {};
    const siege = source.siege || source.etablissement || {};
    const siren = digits(getFirst(source.siren, source.siren_unite_legale, siege.siren));
    const siret = digits(getFirst(source.siret, siege.siret, source.siret_siege));
    const naf = normalizeCode(getFirst(source.activite_principale, source.code_naf, source.naf, siege.activite_principale));
    const postalCode = digits(getFirst(siege.code_postal, source.code_postal, source.adresse_code_postal));
    const postalDepartment = postalCode.startsWith("97") ? postalCode.slice(0, 3) : postalCode.slice(0, 2);
    const department = String(getFirst(siege.departement, source.departement, source.department, source.code_departement, postalDepartment) || "").toUpperCase();
    const name = String(getFirst(source.nom_complet, source.denomination, source.nom_raison_sociale, source.name, source.nom) || "").trim();
    const activeRaw = getFirst(source.etat_administratif, source.statut, source.active, siege.etat_administratif);
    const active = typeof activeRaw === "boolean" ? activeRaw : (activeRaw == null ? null : /^(A|ACTIF|ACTIVE|ACTIV)$/i.test(String(activeRaw).trim()));
    return {
      siren: siren.length === 9 ? siren : "",
      siret: siret.length === 14 ? siret : "",
      name,
      naf,
      department: department === "2A" || department === "2B" ? department : (department.length === 1 ? "0" + department : department),
      active,
      sourceUrl: String(getFirst(source.url, source.url_annuaire, source.source_url, source.sourceUrl) || ""),
      legalCategory: String(getFirst(source.nature_juridique, source.categorie_juridique, source.categorie_entreprise) || ""),
      creationDate: String(getFirst(source.date_creation, source.date_debut_activite, source.date_creation_unite_legale) || ""),
      workforceBand: String(getFirst(source.tranche_effectif_salarie, source.tranche_effectif, siege.tranche_effectif_salarie) || ""),
      workforce: getFirst(source.effectif, source.effectif_salarie, source.nombre_salaries, siege.effectif_salarie) ?? null,
      address: String(getFirst(siege.adresse, source.adresse, source.adresse_complete) || ""),
      sourceId: String(getFirst(source.id, source.id_source, source.sourceId, siren, siret) || ""),
      collectedAt: String(getFirst(source.collectedAt, source.date_collecte) || ""),
      raw: source
    };
  }

  function deduplicateCompanies(records) {
    const seen = new Set();
    const unique = [];
    for (const raw of Array.isArray(records) ? records : []) {
      const company = normalizeCompany(raw);
      const key = company.siren ? "SIREN:" + company.siren : company.siret ? "SIRET:" + company.siret : company.sourceId ? "SOURCE:" + company.sourceId : "";
      if (!key || seen.has(key)) continue;
      seen.add(key);
      unique.push(company);
    }
    return unique;
  }

  function scoreCompany(record, criteria) {
    const company = record && Object.prototype.hasOwnProperty.call(record, "raw") ? record : normalizeCompany(record);
    const options = criteria || {};
    const wantedCodes = new Set((options.nafCodes || []).map(normalizeCode).filter(Boolean));
    const wantedDepartments = new Set((options.departments || []).map((value) => String(value).trim().toUpperCase()).filter(Boolean));
    const reasons = [];
    let score = 0;

    if (company.naf && wantedCodes.has(company.naf)) {
      score += 60;
      reasons.push("Code APE/NAF correspondant à la liste candidate fournie");
    } else if (company.naf && [...wantedCodes].some((code) => code.slice(0, 4) === company.naf.slice(0, 4) && code.length >= 4)) {
      score += 35;
      reasons.push("Proximité de nomenclature APE/NAF à vérifier");
    } else if (wantedCodes.size) {
      reasons.push("Aucun code APE/NAF correspondant dans la liste candidate");
    } else {
      reasons.push("Correspondance APE/NAF non évaluée : aucun code fourni");
    }

    if (company.department && wantedDepartments.has(company.department)) {
      score += 25;
      reasons.push("Établissement dans un département ciblé");
    } else if (wantedDepartments.size) {
      reasons.push("Département hors cible ou non déterminé");
    } else {
      reasons.push("Périmètre départemental non évalué");
    }

    if (company.active === true) {
      score += 15;
      reasons.push("Statut administratif actif selon la source");
    } else if (company.active === false) {
      reasons.push("Statut administratif non actif selon la source : vérification requise");
    } else {
      reasons.push("Statut administratif absent ou non interprétable");
    }

    if (company.name) score += 0; // Le nom identifie la fiche, mais ne prouve aucune capacité.
    return {
      ...company,
      score,
      reasons,
      qualification: score >= 85 ? "prioritaire à vérifier" : score >= 50 ? "à examiner" : "correspondance faible ou données insuffisantes",
      warning: "Score indicatif de rapprochement ; ne prouve ni compétence, ni capacité, ni éligibilité au marché."
    };
  }

  function rankCompanies(records, criteria) {
    return deduplicateCompanies(records)
      .map((company) => scoreCompany(company, criteria))
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, "fr"));
  }

  async function searchCompanies(criteria) {
    const options = criteria || {};
    const codes = [...new Set((options.nafCodes || []).map(normalizeCode).filter(Boolean))];
    const departments = [...new Set((options.departments || []).map((value) => String(value).trim().toUpperCase()).filter(Boolean))];
    const region = String(options.region || "").trim();
    const query = String(options.query || "").trim().slice(0, 180);
    if (!codes.length && !departments.length && !region && !query) throw new Error("Saisissez un mot-clé ou ajoutez au moins un critère pour lancer la recherche.");
    const caMin = options.caMin == null || options.caMin === "" ? null : Number(options.caMin);
    const caMax = options.caMax == null || options.caMax === "" ? null : Number(options.caMax);
    const workforceCodes = {
      "0-2": ["00", "01"], "3-5": ["02"], "6-9": ["03"],
      "10-19": ["11"], "20-49": ["12"],
      "50+": ["21", "22", "31", "32", "41", "42", "51", "52", "53"],
      "unknown": ["NN"]
    };
    const workforceFilter = workforceCodes[options.workforce] ? [...workforceCodes[options.workforce]] : [];
    if (options.workforce && options.workforce !== "unknown" && options.includeUnknown !== false) workforceFilter.push("NN");
    if (caMin !== null && (!Number.isFinite(caMin) || caMin < 0)) throw new Error("Le chiffre d’affaires minimum doit être un montant positif.");
    if (caMax !== null && (!Number.isFinite(caMax) || caMax < 0)) throw new Error("Le chiffre d’affaires maximum doit être un montant positif.");
    if (caMin !== null && caMax !== null && caMin > caMax) throw new Error("Le chiffre d’affaires minimum ne peut pas dépasser le maximum.");
    if (typeof fetch !== "function") throw new Error("Cette recherche nécessite un navigateur ou un environnement disposant de fetch.");

    const perPage = Number.isInteger(options.perPage) ? Math.max(1, Math.min(options.perPage, 25)) : 25;
    const maxPages = Number.isInteger(options.maxPages) ? Math.max(1, Math.min(options.maxPages, 4)) : 1;
    const timeoutMs = Number.isInteger(options.timeoutMs) ? Math.max(1000, Math.min(options.timeoutMs, 30000)) : 12000;
    const baseUrl = "https://recherche-entreprises.api.gouv.fr/search";
    const records = [];
    const requests = [];
    const fetchedAt = new Date().toISOString();

    // Requêtes séquentielles : seuls les critères renseignés sont transmis à l'annuaire.
    const geographicScopes = departments.length
      ? departments.map(department => ({ department, region }))
      : [{ department: "", region }];
    const activityCodes = codes.length ? codes : [""];
    for (const scope of geographicScopes) {
      for (const code of activityCodes) {
        for (let page = 1; page <= maxPages; page++) {
          const params = new URLSearchParams({
            per_page: String(perPage), page: String(page), minimal: "true",
            include: "siege,finances"
          });
          if (code) params.set("activite_principale", code);
          if (query) params.set("q", query);
          if (scope.department) params.set("departement", scope.department);
          if (scope.region) params.set("region", scope.region);
          if (workforceFilter.length) params.set("tranche_effectif_salarie", [...new Set(workforceFilter)].join(","));
          if (caMin !== null) params.set("ca_min", String(Math.round(caMin)));
          if (caMax !== null) params.set("ca_max", String(Math.round(caMax)));
          if (options.estRge) params.set("est_rge", "true");
          if (options.estQualiopi) params.set("est_qualiopi", "true");
          if (options.estEpV) params.set("est_patrimoine_vivant", "true");
          if (options.estEss) params.set("est_ess", "true");
          const url = baseUrl + "?" + params.toString();
          const controller = typeof AbortController === "function" ? new AbortController() : null;
          const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
          let response;
          try {
            response = await fetch(url, {
              method: "GET", headers: { Accept: "application/json" },
              signal: controller ? controller.signal : undefined
            });
          } catch (error) {
            if (timer) clearTimeout(timer);
            const reason = error && error.name === "AbortError" ? "délai dépassé" : "erreur réseau ou accès navigateur";
            throw new Error("Recherche d’entreprises indisponible (" + reason + "). Aucune liste ne doit être présentée comme complète.");
          }
          if (timer) clearTimeout(timer);
          if (!response || !response.ok) {
            const status = response && Number.isFinite(response.status) ? response.status : "inconnu";
            throw new Error("L’annuaire des entreprises a répondu avec le statut " + status + ". Réessayer plus tard ; ne pas assimiler cette erreur à zéro résultat.");
          }
          let payload;
          try { payload = await response.json(); }
          catch { throw new Error("Réponse illisible de l’annuaire des entreprises ; aucun résultat n’a été validé."); }
          if (!payload || !Array.isArray(payload.results)) {
            throw new Error("Format de réponse inattendu de l’annuaire des entreprises ; aucun résultat n’a été validé.");
          }
          requests.push({ department: scope.department || null, region: scope.region || null, nafCode: code || null, page, returned: payload.results.length, totalResults: payload.total_results ?? null });
          for (const item of payload.results) {
            records.push({
              ...item, source: "API Recherche d’Entreprises — DINUM",
              source_url: "https://recherche-entreprises.api.gouv.fr/",
              collectedAt: fetchedAt,
              query: { department: scope.department || null, region: scope.region || null, nafCode: code || null, text: query || null, page }
            });
          }
          if (page >= Number(payload.total_pages || 1)) break;
        }
      }
    }

    const unique = deduplicateCompanies(records);
    return {
      candidates: unique,
      source: "API Recherche d’Entreprises — DINUM",
      sourceUrl: "https://recherche-entreprises.api.gouv.fr/",
      fetchedAt,
      requests,
      rawCount: records.length,
      uniqueCount: unique.length,
      appliedFilters: { nafCodes: codes, query: query || null, departments, region: region || null, caMin, caMax, estRge: Boolean(options.estRge), estQualiopi: Boolean(options.estQualiopi), estEpV: Boolean(options.estEpV), estEss: Boolean(options.estEss) },
      note: "Résultats limités aux filtres administratifs transmis à l’API. Le chiffre d’affaires peut être indisponible pour certaines entreprises ; une correspondance administrative ne prouve pas la capacité à répondre au marché."
    };
  }

  async function geocodeSearchCenter(input) {
    const value = String(input || "").trim();
    if (!value) throw new Error("Saisissez une commune ou un code postal pour définir le centre du rayon.");
    const isPostalCode = /^\d{5}$/.test(value);
    const url = isPostalCode
      ? "https://geo.api.gouv.fr/communes?codePostal=" + encodeURIComponent(value) + "&fields=nom,code,codeDepartement,centre&format=json"
      : "https://geo.api.gouv.fr/communes?nom=" + encodeURIComponent(value) + "&fields=nom,code,codeDepartement,centre&boost=population&limit=10&format=json";
    const response = await fetch(url, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("Le service officiel de géolocalisation a répondu avec le statut " + response.status + ".");
    const matches = await response.json();
    if (!Array.isArray(matches) || !matches.length) throw new Error("Aucune commune trouvée pour ce lieu. Essayez un code postal ou un nom plus précis.");
    const match = matches.find(item => item.centre && Array.isArray(item.centre.coordinates) && item.centre.coordinates.length === 2) || matches[0];
    if (!match.centre || !Array.isArray(match.centre.coordinates)) throw new Error("Le service n’a pas fourni de coordonnées pour cette commune.");
    return { name: match.nom, code: match.code, department: match.codeDepartement || "", latitude: Number(match.centre.coordinates[1]), longitude: Number(match.centre.coordinates[0]) };
  }

  async function searchCompaniesNearPoint(criteria) {
    const options = criteria || {};
    const codes = [...new Set((options.nafCodes || []).map(normalizeCode).filter(Boolean))];
    if (!codes.length) throw new Error("Au moins un code APE/NAF validé est requis pour interroger l’annuaire.");
    const radius = Number(options.radiusKm);
    if (!Number.isFinite(radius) || radius < 1 || radius > 50) throw new Error("Le rayon doit être compris entre 1 et 50 kilomètres.");
    const center = await geocodeSearchCenter(options.location);
    const perPage = Number.isInteger(options.perPage) ? Math.max(1, Math.min(options.perPage, 25)) : 25;
    const maxPages = Number.isInteger(options.maxPages) ? Math.max(1, Math.min(options.maxPages, 4)) : 1;
    const records = [];
    const requests = [];
    const fetchedAt = new Date().toISOString();
    for (const code of codes) {
      for (let page = 1; page <= maxPages; page++) {
        const params = new URLSearchParams({
          lat: String(center.latitude), long: String(center.longitude), radius: String(radius),
          activite_principale: code, per_page: String(perPage), page: String(page), minimal: "true", include: "siege,finances"
        });
        const url = "https://recherche-entreprises.api.gouv.fr/near_point?" + params.toString();
        const response = await fetch(url, { headers: { Accept: "application/json" } });
        if (!response.ok) throw new Error("L’annuaire géographique a répondu avec le statut " + response.status + ". Aucun résultat ne peut être validé.");
        const payload = await response.json();
        if (!payload || !Array.isArray(payload.results)) throw new Error("Format de réponse inattendu de l’annuaire géographique.");
        requests.push({ nafCode: code, page, radiusKm: radius, returned: payload.results.length, totalResults: payload.total_results ?? null });
        for (const item of payload.results) records.push({ ...item, source: "API Recherche d’Entreprises — DINUM (recherche géographique)", source_url: "https://recherche-entreprises.api.gouv.fr/", collectedAt: fetchedAt, query: { center, radiusKm: radius, nafCode: code, page } });
        if (page >= Number(payload.total_pages || 1)) break;
      }
    }
    const unique = deduplicateCompanies(records);
    return { candidates: unique, source: "API Recherche d’Entreprises — DINUM (recherche géographique)", sourceUrl: "https://recherche-entreprises.api.gouv.fr/", fetchedAt, center, radiusKm: radius, requests, rawCount: records.length, uniqueCount: unique.length, note: "Recherche géographique officielle autour du centre de la commune. Le rayon maximal de l’API est de 50 km ; les coordonnées correspondent au centre communal, pas à une adresse précise." };
  }

  function selectCandidates(records, criteria) {
    const options = criteria || {};
    const limit = Number.isInteger(options.limit) && options.limit > 0 ? Math.min(options.limit, 10) : 10;
    const ranked = rankCompanies(records, options);
    const selected = [];
    const counts = new Map();
    for (const company of ranked) {
      if (selected.length >= limit) break;
      if (company.score < (Number.isFinite(options.minimumScore) ? options.minimumScore : 25)) continue;
      const dept = company.department || "INCONNU";
      const count = counts.get(dept) || 0;
      if (count >= limit) continue;
      counts.set(dept, count + 1);
      selected.push(company);
    }
    return {
      candidates: selected,
      countsByDepartment: Object.fromEntries(counts),
      requestedLimit: limit,
      quotaFilledArtificially: false,
      note: "Le nombre de candidats reflète les données reçues et le seuil de pertinence ; aucune entreprise fictive n'est ajoutée."
    };
  }

  function filterCompaniesByCriteria(records, criteria) {
    const options = criteria || {};
    const includeUnknown = options.includeUnknown !== false;
    const workforceTarget = String(options.workforce || "");
    const ageTarget = String(options.companyAge || "");
    const legalTarget = String(options.legalCategory || "").trim().toLocaleLowerCase("fr");
    const nameTarget = String(options.nameContains || "").trim().toLocaleLowerCase("fr");

    const workforceRanges = {
      "0-2": [[0, 0], [1, 2]],
      "3-5": [[3, 5]],
      "6-9": [[6, 9]],
      "10-19": [[10, 19]],
      "20-49": [[20, 49]],
      "50+": [[50, Infinity]]
    };
    const workforceCodeRanges = {
      "00": [0, 0], "01": [1, 2], "02": [3, 5], "03": [6, 9],
      "11": [10, 19], "12": [20, 49], "21": [50, 99], "22": [100, 199],
      "31": [200, 249], "32": [250, 499], "41": [500, 999],
      "42": [1000, 1999], "51": [2000, 4999], "52": [5000, 9999], "53": [10000, Infinity]
    };
    const workforceRange = (company) => {
      const numeric = Number(company.workforce);
      if (company.workforce != null && company.workforce !== "" && Number.isFinite(numeric)) return [numeric, numeric];
      const raw = String(company.workforceBand || "").trim().toUpperCase();
      if (workforceCodeRanges[raw]) return workforceCodeRanges[raw];
      const match = raw.match(/(\d+)\s*(?:à|a|-)\s*(\d+)/i);
      if (match) return [Number(match[1]), Number(match[2])];
      const high = raw.match(/(\d+)\s*(?:salariés? et plus|et plus|\+)/i);
      if (high) return [Number(high[1]), Infinity];
      return null;
    };
    const matchesRange = (range, target) => {
      if (!target) return true;
      if (target === "unknown") return range === null;
      if (!range) return includeUnknown;
      return (workforceRanges[target] || []).some(([min, max]) => range[0] >= min && range[1] <= max);
    };
    const companyAge = (company) => {
      if (!company.creationDate) return null;
      const date = new Date(company.creationDate);
      if (Number.isNaN(date.getTime())) return null;
      const now = new Date();
      if (date > now) return null;
      return (now.getTime() - date.getTime()) / (365.2425 * 24 * 60 * 60 * 1000);
    };

    return (Array.isArray(records) ? records : []).filter((company) => {
      if (workforceTarget) {
        const range = workforceRange(company);
        if (workforceTarget === "unknown" ? range !== null : !matchesRange(range, workforceTarget)) return false;
      }
      if (ageTarget) {
        const age = companyAge(company);
        if (ageTarget === "unknown" ? age !== null : age === null
          ? !includeUnknown
          : ageTarget === "0-2" ? age >= 3
          : ageTarget === "3-5" ? age < 3 || age >= 6
          : ageTarget === "6-10" ? age < 6 || age > 10
          : ageTarget === "10+" ? age <= 10
          : false) return false;
      }
      if (legalTarget) {
        const value = String(company.legalCategory || "").toLocaleLowerCase("fr");
        if (!value) { if (!includeUnknown) return false; }
        else if (!value.includes(legalTarget)) return false;
      }
      if (nameTarget && !String(company.name || "").toLocaleLowerCase("fr").includes(nameTarget)) return false;
      return true;
    });
  }

  return { normalizeCompany, deduplicateCompanies, scoreCompany, rankCompanies, selectCandidates, filterCompaniesByCriteria, searchCompanies, geocodeSearchCenter, searchCompaniesNearPoint };
});
