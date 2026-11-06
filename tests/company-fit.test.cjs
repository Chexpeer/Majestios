"use strict";
const assert = require("node:assert/strict");
const fit = require("../company-fit.js");

const matched = fit.qualify({
  activite_principale: "43.21A",
  departement: "79",
  etat_administratif: "A"
}, { nafCodes: ["43.21A"], departements: ["79"] });
assert.equal(matched.activityCode, "exact_match");
assert.equal(matched.geography, "department_match");
assert.equal(matched.administrativeStatus, "active");
assert.equal(matched.decision, "manual_review_required");
assert.equal(matched.manualChecks.qualificationsAndCertifications, "to_verify");
assert.equal(matched.manualChecks.marketEligibility, "to_verify");

const outside = fit.qualify({
  activite_principale: "43.21A",
  departement: "33",
  etat_administratif: "A"
}, { nafCodes: ["43.21A"], departements: ["79"] });
assert.equal(outside.geography, "head_office_outside_scope_check_local_establishment");
assert.match(outside.warnings.join(" "), /établissement local/);

const unknown = fit.qualify({}, { nafCodes: ["43.21A"], departements: ["79"] });
assert.equal(unknown.activityCode, "unknown");
assert.equal(unknown.geography, "unknown");
assert.equal(unknown.administrativeStatus, "unknown");
assert.ok(unknown.warnings.length >= 3);
assert.match(unknown.disclaimer, /ne prouve ni la compétence/);

console.log("Tests company-fit : OK");
