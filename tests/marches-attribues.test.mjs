import test from "node:test";
import assert from "node:assert/strict";
import { PAGE_SIZE, SECTORS, buildContractsRequest, buildWinnersRequest, normalizeContracts, normalizeWinners, formatAmount, formatDateFr, metaSummary } from "../marches-attribues.mjs";

test("requête des marchés : valeurs invalides ignorées, pagination et bornes", () => {
  const r = buildContractsRequest({ department: " 2a ", query: "ab", sector: "45", minAmount: "50 000", page: 2 });
  assert.equal(r.p_department, "2A");
  assert.equal(r.p_query, null, "moins de 3 caractères : pas de recherche");
  assert.equal(r.p_cpv, "45");
  assert.equal(r.p_min_amount, 50000);
  assert.equal(r.p_limit, PAGE_SIZE + 1);
  assert.equal(r.p_offset, 2 * PAGE_SIZE);
  assert.equal(r.p_months, 6);
  const bad = buildContractsRequest({ department: "99", query: "x".repeat(200), sector: "'; drop", minAmount: "abc", page: -3 });
  assert.equal(bad.p_department, null);
  assert.equal(bad.p_query.length, 80);
  assert.equal(bad.p_cpv, null);
  assert.equal(bad.p_min_amount, null);
  assert.equal(bad.p_offset, 0);
  assert.ok(Object.keys(SECTORS).every((c) => /^\d{2}$/.test(c)));
});

test("requête des gagnants : département valide seulement, au moins 2 marchés", () => {
  assert.deepEqual(buildWinnersRequest({ department: "61", page: 1 }), { p_department: "61", p_months: 6, p_min_contracts: 2, p_limit: 11, p_offset: 10 });
  assert.equal(buildWinnersRequest({ department: "zz" }).p_department, null);
});

test("normalisation : champs publics uniquement, texte non interprété, ligne sans identifiant ignorée", () => {
  const rows = [
    { contract_uid: "U1", object: "<b>Rénovation</b>", awarded_on: "2026-11-02", kind: "travaux", amount: 120000, amount_flag: "suspect", offers_received: 3, duration_months: 24,
      subcontracting_declared: true, buyer_name: "Mairie", buyer_commune: "Alençon", buyer_dept: "61", winners: "Alpha · Beta", winner_count: 2, email: "fuite@example.fr" },
    { object: "sans identifiant" }, null
  ];
  const { items, hasMore } = normalizeContracts(rows);
  assert.equal(items.length, 1);
  assert.equal(hasMore, false);
  assert.equal(items[0].object, "<b>Rénovation</b>", "le HTML reste du texte (inséré avec textContent)");
  assert.equal(items[0].amountFlag, "suspect");
  assert.equal(items[0].subcontracting, true);
  assert.equal(items[0].winnerCount, 2);
  assert.ok(!("email" in items[0]));
  assert.deepEqual(normalizeContracts("x"), { items: [], hasMore: false });
  assert.equal(normalizeContracts(Array.from({ length: 11 }, (_, i) => ({ contract_uid: "U" + i }))).hasMore, true);
  const w = normalizeWinners([{ winner_id: "W1", winner_name: "Alpha", winner_category: "XL", winner_dept: "6", contracts: "4", median_amount: "80000.5" }]);
  assert.equal(w.items[0].category, "");
  assert.equal(w.items[0].dept, "");
  assert.equal(w.items[0].contracts, 4);
  assert.equal(w.items[0].medianAmount, 80000.5);
});

test("formats : montant, date, résumé de transparence", () => {
  assert.match(formatAmount(120000), /^120\s000\s€ HT$/u);
  assert.equal(formatAmount(null), "Montant non communiqué");
  assert.equal(formatDateFr("2026-11-02"), "02/11/2026");
  assert.equal(formatDateFr("n’importe quoi"), "");
  assert.equal(metaSummary([]).loaded, false);
  const m = metaSummary([{ contracts: 1234, winners: 800, oldest: "2026-05-21", newest: "2026-11-20", loaded_at: "2026-11-21T04:00:00Z" }]);
  assert.equal(m.loaded, true);
  assert.match(m.text, /du 21\/05\/2026 au 20\/11\/2026/);
  assert.match(m.text, /Dernier chargement le 21\/11\/2026/);
});
