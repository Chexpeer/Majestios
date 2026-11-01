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

  return { normalizeCompany, deduplicateCompanies, scoreCompany, rankCompanies, selectCandidates };
});
