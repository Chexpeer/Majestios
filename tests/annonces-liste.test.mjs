import test from "node:test";
import assert from "node:assert/strict";
import { PAGE_SIZE, buildListRequest, normalizeAnnouncements, formatDateFr, placeLabel, validateIntroduction, introductionError } from "../annonces-liste.mjs";

test("la requête de liste ignore les valeurs invalides et demande une ligne de plus pour la pagination", () => {
  assert.deepEqual(buildListRequest({ kind: "subcontract_need", department: "2a", page: 2 }), { p_kind: "subcontract_need", p_department: "2A", p_limit: PAGE_SIZE + 1, p_offset: 2 * PAGE_SIZE });
  assert.deepEqual(buildListRequest({ kind: "n'importe quoi", department: "99", page: -4 }), { p_kind: null, p_department: null, p_limit: PAGE_SIZE + 1, p_offset: 0 });
  assert.equal(buildListRequest().p_kind, null);
});

test("seuls les champs publics sont conservés ; les lignes sans référence valide sont écartées", () => {
  const rows = [
    { reference: "AN-ABCD1234", kind: "subcontract_offer", title: " Carreleurs dispo ", description: "d", trade: "Carrelage", department: "44", area_note: null, valid_until: null, published_at: "2026-11-14T10:00:00Z", email: "fuite@example.fr", phone: "0600000000", contact_name: "X" },
    { reference: "<script>", title: "x" },
    null
  ];
  const { items, hasMore } = normalizeAnnouncements(rows);
  assert.equal(items.length, 1);
  assert.equal(hasMore, false);
  assert.equal(items[0].title, "Carreleurs dispo");
  assert.equal("email" in items[0] || "phone" in items[0] || "contact_name" in items[0], false, "aucune coordonnée ne doit survivre");
  assert.deepEqual(normalizeAnnouncements("pas un tableau"), { items: [], hasMore: false });
});

test("la pagination détecte la page suivante", () => {
  const rows = Array.from({ length: PAGE_SIZE + 1 }, (_, i) => ({ reference: "AN-" + String(10000000 + i), kind: "subcontract_need", title: "t", description: "d" }));
  const { items, hasMore } = normalizeAnnouncements(rows);
  assert.equal(items.length, PAGE_SIZE);
  assert.equal(hasMore, true);
});

test("dates et lieux sont présentés en français", () => {
  assert.equal(formatDateFr("2026-11-14T10:00:00Z"), "14 novembre 2026");
  assert.equal(formatDateFr("n'importe quoi"), "");
  assert.equal(placeLabel({ department: "35", areaNote: "Rennes" }), "Département 35 · Rennes");
  assert.equal(placeLabel({ department: "", areaNote: "" }), "");
});

test("la demande de mise en relation est validée comme côté serveur", () => {
  assert.equal(validateIntroduction({}).ok, false);
  const ok = validateIntroduction({ name: "Sophie Durand", email: "Sophie@Example.fr", message: "Bonjour, nous sommes plaquistes sur Rennes.", consent: "on" });
  assert.equal(ok.ok, true);
  assert.equal(ok.payload.p_email, "sophie@example.fr");
  assert.ok(validateIntroduction({ name: "S", email: "x", message: "court", consent: false }).errors.consent);
  assert.match(introductionError(new Error("announcement_not_available")), /plus disponible/);
  assert.match(introductionError("rate_limited"), /Trop de demandes/);
});
