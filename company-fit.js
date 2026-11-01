(function (root) {
  "use strict";

  // Qualification indicative : les données administratives ne prouvent jamais
  // la compétence, la capacité opérationnelle ni l'éligibilité à un marché.
  function normalize(value) {
    return String(value == null ? "" : value)
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .trim().toUpperCase();
  }

  function qualify(company, criteria) {
    company = company || {};
    criteria = criteria || {};

    var naf = normalize(company.activite_principale || company.naf || company.code_naf);
    var expectedNaf = (criteria.nafCodes || []).map(normalize).filter(Boolean);
    var department = normalize(company.departement || company.code_departement);
    var expectedDepartments = (criteria.departements || []).map(normalize).filter(Boolean);
    var status = normalize(company.etat_administratif || company.statut || "");
    var warnings = [];

    var activity = !naf
      ? "unknown"
      : expectedNaf.indexOf(naf) !== -1 ? "exact_match" : "not_exact_match";

    var geography = !department
      ? "unknown"
      : !expectedDepartments.length || expectedDepartments.indexOf(department) !== -1
        ? "department_match" : "head_office_outside_scope_check_local_establishment";

    var active = !status
      ? "unknown"
      : (status === "A" || status === "ACTIVE" || status === "ACTIF")
        ? "active" : "inactive_or_to_verify";

    if (activity === "unknown") warnings.push("Code APE/NAF manquant : activité à vérifier.");
    if (activity === "not_exact_match") warnings.push("Pas de correspondance exacte du code APE/NAF : vérifier l'activité réelle.");
    if (geography === "unknown") warnings.push("Département inconnu : implantation à vérifier.");
    if (geography === "head_office_outside_scope_check_local_establishment") warnings.push("Siège hors périmètre : vérifier l'existence d'un établissement local avant exclusion.");
    if (active === "unknown") warnings.push("Statut administratif inconnu : vérifier la situation actuelle.");
    if (active === "inactive_or_to_verify") warnings.push("Entreprise inactive ou statut non interprété : contrôle nécessaire.");

    return {
      activityCode: activity,
      geography: geography,
      administrativeStatus: active,
      manualChecks: {
        localEstablishment: "to_verify",
        qualificationsAndCertifications: "to_verify",
        comparableReferences: "to_verify",
        humanAndMaterialCapacity: "to_verify",
        marketEligibility: "to_verify",
        availability: "to_verify"
      },
      warnings: warnings,
      decision: "manual_review_required",
      disclaimer: "Cette qualification est indicative. Elle ne prouve ni la compétence, ni la capacité, ni l'éligibilité de l'entreprise."
    };
  }

  var api = { qualify: qualify };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.MajestiosCompanyFit = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
