import test from "node:test";
import assert from "node:assert/strict";
import { MAX_ALERTES, buildAlertFromFilters, alertLabel, alertRequest, alertToFormValues, countNew } from "../alertes-marches.mjs";

test("au plus 5 alertes par membre", () => { assert.equal(MAX_ALERTES, 5); });
test("une alerte exige au moins un critère valable ; les valeurs invalides sont ignorées", () => {
  assert.equal(buildAlertFromFilters({}), null);
  assert.equal(buildAlertFromFilters({ department: "99", query: "ab", sector: "zz", minAmount: "-5" }), null);
  const a = buildAlertFromFilters({ department: " 2a ", sector: "43" in {} ? "43" : "45", query: "mairie", minAmount: "50 000" });
  assert.equal(a.department, "2A"); assert.equal(a.cpv, "45"); assert.equal(a.query, "mairie"); assert.equal(a.min_amount, 50000);
  assert.match(a.label, /Travaux de construction.*dép\. 2A.*« mairie ».*50[\s ]000 €/);
});
test("libellé par défaut et requête de recherche d'une alerte", () => {
  assert.equal(alertLabel({}), "Toute la France");
  const r = alertRequest({ department: "14", cpv: "45", query: null, min_amount: null });
  assert.deepEqual(r, { p_department: "14", p_query: null, p_cpv: "45", p_min_amount: null, p_months: 6, p_limit: 40, p_offset: 0 });
  assert.deepEqual(alertToFormValues({ department: "14", cpv: "45", query: null, min_amount: 1000 }), { department: "14", query: "", sector: "45", minAmount: "1000" });
});
test("comptage des marchés notifiés après la dernière consultation", () => {
  const rows = [{ awarded_on: "2026-11-20" }, { awarded_on: "2026-11-14" }, { awarded_on: "2026-11-10" }, null];
  assert.equal(countNew(rows, "2026-11-14"), 1);
  assert.equal(countNew(rows, "2026-11-01"), 3);
  assert.equal(countNew(null, "2026-11-01"), 0);
});
