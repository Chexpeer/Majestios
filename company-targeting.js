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
    const department = String(getFirst(siege.departement, source.departement, source.code_departement, postalCode.length >= 2 ? postalCode.slice(0, 2) : "") || "").toUpperCase();
    const name = String(getFirst(source.nom_complet, source.denomination, source.nom_raison_sociale, source.name, source.nom) || "").trim();
    const activeRaw = getFirst(source.etat_administratif, source.statut, siege.etat_administratif);
    const active = typeof activeRaw === "boolean" ? activeRaw : (activeRaw == null ? null : /^(A|ACTIF|ACTIVE|ACTIV)$/i.test(String(activeRaw).trim()));
    return {
      siren: siren.length === 9 ? siren : "",
      siret: siret.length === 14 ? siret : "",
      name,
      naf,
      department: department === "2A" || department === "2B" ? department : (department.length === 1 ? "0" + department : department),
      active,
      sourceUrl: String(getFirst(source.url, source.url_annuaire, source.source_url) || ""),
      sourceId: String(getFirst(source.id, source.id_source, siren, siret) || ""),
      collectedAt: String(getFirst(source.collectedAt, source.date_collecte) || ""),
      raw: source
    };
  }

  function deduplicateCompanies(records) {
    const seen = new Set();
    const unique = [];
    for (const raw of Array.isArray(records) ? records : []) {
      const company = normalizeCompany(raw);
      const key = company.siret ? "SIRET:" + company.siret : company.siren ? "SIREN:" + company.siren : company.sourceId ? "SOURCE:" + company.sourceId : "";
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
    if (!codes.length) throw new Error("Au moins un code APE/NAF validé est requis pour interroger l’annuaire.");
    if (!departments.length) throw new Error("Au moins un département est requis pour limiter la recherche.");
    if (typeof fetch !== "function") throw new Error("Cette recherche nécessite un navigateur ou un environnement disposant de fetch.");

    const perPage = Number.isInteger(options.perPage) ? Math.max(1, Math.min(options.perPage, 25)) : 25;
    const maxPages = Number.isInteger(options.maxPages) ? Math.max(1, Math.min(options.maxPages, 4)) : 1;
    const timeoutMs = Number.isInteger(options.timeoutMs) ? Math.max(1000, Math.min(options.timeoutMs, 30000)) : 12000;
    const baseUrl = "https://recherche-entreprises.api.gouv.fr/search";
    const records = [];
    const requests = [];
    const fetchedAt = new Date().toISOString();

    // Requêtes séquentielles pour éviter de dépasser les limites de l'API publique.
    for (const department of departments) {
      for (const code of codes) {
        for (let page = 1; page <= maxPages; page++) {
          const params = new URLSearchParams({
            activite_principale: code,
            departement: department,
            per_page: String(perPage),
            page: String(page),
            minimal: "true",
            include: "siege"
          });
          const url = baseUrl + "?" + params.toString();
          const controller = typeof AbortController === "function" ? new AbortController() : null;
          const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
          let response;
          try {
            response = await fetch(url, {
              method: "GET",
              headers: { Accept: "application/json" },
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
          try {
            payload = await response.json();
          } catch {
            throw new Error("Réponse illisible de l’annuaire des entreprises ; aucun résultat n’a été validé.");
          }
          if (!payload || !Array.isArray(payload.results)) {
            throw new Error("Format de réponse inattendu de l’annuaire des entreprises ; aucun résultat n’a été validé.");
          }
          requests.push({ department, nafCode: code, page, returned: payload.results.length, totalResults: payload.total_results ?? null });
          for (const item of payload.results) {
            records.push({
              ...item,
              source: "API Recherche d’Entreprises — DINUM",
              source_url: "https://recherche-entreprises.api.gouv.fr/",
              collectedAt: fetchedAt,
              query: { department, nafCode: code, page }
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
      note: "Résultats limités aux filtres APE/NAF et département demandés. Une correspondance administrative ne prouve pas la capacité à répondre au marché."
    };
  }

  function selectCandidates(records, criteria) {
    const options = criteria || {};
    const limit = Number.isInteger(options.limit) && options.limit > 0 ? Math.min(options.limit, 100) : 10;
    const ranked = rankCompanies(records, options);
    const selected = [];
    const counts = new Map();
    for (const company of ranked) {
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
      requestedLimitPerDepartment: limit,
      quotaFilledArtificially: false,
      note: "Le nombre de candidats reflète les données reçues et le seuil de pertinence ; aucune entreprise fictive n'est ajoutée."
    };
  }

  return { normalizeCompany, deduplicateCompanies, scoreCompany, rankCompanies, selectCandidates, searchCompanies };
});
