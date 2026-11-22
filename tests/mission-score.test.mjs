import test from "node:test";
import assert from "node:assert/strict";
import { scoreCompany, scoreCompanies, estEcartee, SCORE_METHOD_VERSION } from "../supabase/functions/_shared/mission-score-core.mjs";

const NOW = new Date("2026-11-22T00:00:00Z");
const base = { siren: "123456789", nom: "ACME", naf: "43.22A", rge: false, effectif: "12", departement: "14", zone: "même département", creation: "2010-05-01" };
const ctx = { nafs: ["43.22A"], departement: "14", exigences: null, montantAnnuel: 500000, now: NOW };

test("deux indicateurs séparés, version de méthode, détail par critère", () => {
  const s = scoreCompany(base, ctx);
  assert.equal(s.methode, SCORE_METHOD_VERSION); assert.equal(s.criteres.length, 6);
  assert.equal(typeof s.note, "number"); assert.equal(typeof s.preuve, "number"); assert.equal(s.sur, 20);
  for (const k of s.criteres) assert.ok(["confirmé", "partiellement confirmé", "non prouvé", "contradictoire", "non applicable"].includes(k.etat));
});

test("critère non prouvé = 0 point et fait baisser la preuve", () => {
  const s = scoreCompany(base, ctx);
  const refs = s.criteres.find((k) => k.cle === "references");
  assert.equal(refs.etat, "non prouvé"); assert.equal(refs.points, 0);
  const avecRefs = scoreCompany(base, { ...ctx, references: { "123456789": 5 } });
  assert.ok(avecRefs.preuve > s.preuve && avecRefs.note > s.note);
});

test("critère neutralisé : sort du calcul, la note est ramenée sur 20", () => {
  const s = scoreCompany(base, { ...ctx, montantAnnuel: null });
  const op = s.criteres.find((k) => k.cle === "operationnelle");
  assert.equal(op.etat, "non applicable");
  const sansNeutre = scoreCompany(base, ctx);
  assert.ok(s.note > 0 && s.note <= 20 && sansNeutre.note <= 20);
});

test("exigence obligatoire non prouvée : plafond 8/20 et « dossier incomplet » ; exigences inconnues : pas de plafond", () => {
  const inc = scoreCompany(base, { ...ctx, exigences: { obligatoires: ["rge"] }, references: { "123456789": 5 } });
  assert.ok(inc.note <= 8); assert.equal(inc.etiquette, "dossier incomplet");
  const inconnu = scoreCompany(base, ctx);
  assert.equal(inconnu.etiquette, "exigences non vérifiées");
  const ok = scoreCompany({ ...base, rge: true }, { ...ctx, exigences: { obligatoires: ["rge"] } });
  assert.equal(ok.etiquette, null); assert.equal(ok.criteres.find((k) => k.cle === "qualifications").etat, "confirmé");
});

test("écartées d'office : radiée, liquidation, non diffusable — signalées, jamais supprimées en silence", () => {
  assert.equal(estEcartee({ ...base, radiee: true }), "entreprise radiée");
  assert.equal(estEcartee({ ...base, en_liquidation: true }), "entreprise en liquidation");
  assert.equal(estEcartee({ ...base, non_diffusable: true }), "entreprise non diffusable");
  const r = scoreCompanies([base, { ...base, siren: "987654321", radiee: true }], ctx);
  assert.equal(r.classees.length, 1); assert.equal(r.ecartees.length, 1); assert.equal(r.ecartees[0].niveau, "écartée");
});

test("« très bon » exige une note ≥ 16 ET une preuve élevée ; classement par note décroissante", () => {
  const fort = scoreCompany({ ...base, rge: true }, { ...ctx, exigences: { obligatoires: ["rge"] }, references: { "123456789": 4 } });
  assert.ok(fort.note >= 16, `note ${fort.note}`);
  const loin = scoreCompany({ ...base, naf: "43.99C", departement: "75", zone: "hors" }, ctx);
  assert.ok(loin.note < fort.note);
  const r = scoreCompanies([loin, fort], ctx);
  assert.ok(r.classees[0].note >= r.classees[1].note);
});

test("absence d'information n'est jamais une preuve d'incapacité : jamais « contradictoire » sans donnée", () => {
  const s = scoreCompany({ siren: "123456789", nom: "X" }, { now: NOW });
  for (const k of s.criteres) assert.notEqual(k.etat, "contradictoire");
});
