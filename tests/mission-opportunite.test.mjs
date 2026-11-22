import test from "node:test";
import assert from "node:assert/strict";
import { validateOpportuniteInput, effectifEstime, computeIndice, resolveTerritoire, runOpportuniteMission, FORMULATION } from "../supabase/functions/_shared/mission-opportunite-core.mjs";
import { validateSubmissionPayload } from "../supabase/functions/_shared/cheexpeer-api.mjs";
import { executeMission } from "../supabase/functions/_shared/mission-runner-core.mjs";
import { buildOpportunitePayload } from "../cheexpeer-command.mjs";

const ORG = "11111111-1111-4111-8111-111111111111";

test("entrée : seul l'identifiant du marché est accepté", () => {
  assert.equal(validateOpportuniteInput({ contract_uid: "200069474000192026MAPA00000009_71222300" }).ok, true);
  for (const bad of [null, {}, { contract_uid: "a b" }, { contract_uid: "x" }, { contract_uid: "abcde12345", autre: 1 }, { contract_uid: "../../etc/passwd;" }]) assert.equal(validateOpportuniteInput(bad).ok, false);
  const ok = validateSubmissionPayload({ organization_id: ORG, mission_type: "opportunite_attribution", title: "t", requires_approval: false, input: { contract_uid: "abcde12345" } });
  assert.equal(ok.ok, false, "la validation humaine ne se désactive pas");
  const ok2 = validateSubmissionPayload({ organization_id: ORG, mission_type: "opportunite_attribution", title: "t", input: { contract_uid: "abcde12345" } });
  assert.equal(ok2.ok, true); assert.equal(ok2.value.requires_approval, true);
  assert.equal(buildOpportunitePayload({ organizationId: ORG, contractUid: "bad uid", idempotencyKey: "k" }), null);
  assert.equal(buildOpportunitePayload({ organizationId: ORG, contractUid: "abcde12345", label: "ACME", idempotencyKey: "k" }).input.contract_uid, "abcde12345");
});

test("effectif estimé depuis la tranche INSEE", () => {
  assert.equal(effectifEstime("11"), 15); assert.equal(effectifEstime("03"), 8); assert.equal(effectifEstime("NN"), null); assert.equal(effectifEstime(""), null);
});

test("indice : fort / moyen / faible / non évaluable, jamais un besoin confirmé", () => {
  assert.equal(computeIndice({ montant: 2000000, effectif: 10 }).niveau, "fort");
  assert.equal(computeIndice({ montant: 600000, effectif: 10 }).niveau, "moyen");
  assert.equal(computeIndice({ montant: 100000, effectif: 50 }).niveau, "faible");
  assert.equal(computeIndice({ montant: 2400000, dureeMois: 24, effectif: 10 }).ratio, 120000, "montant annualisé");
  for (const x of [{ montant: null, effectif: 10 }, { montant: 5e6, amountFlag: "aberrant", effectif: 10 }, { montant: 5e6, amountFlag: "suspect", effectif: 10 }, { montant: 5e6, effectif: null }]) assert.equal(computeIndice(x).niveau, "non évaluable");
  const all = JSON.stringify([computeIndice({ montant: 9e6, effectif: 1 }), FORMULATION]).toLowerCase();
  assert.match(all, /peut représenter une opportunité/); assert.doesNotMatch(all, /cherche un sous-traitant|besoin confirmé(?! :)/);
  assert.match(FORMULATION, /n'est pas un besoin confirmé/);
});

test("lieu : objet cité, sinon département du gagnant (signalé), jamais l'acheteur", () => {
  assert.deepEqual(resolveTerritoire({ objet: "Travaux - départements de la Manche (50) et du Calvados (14)", winnerDept: "75" }).departements, ["50", "14"]);
  const w = resolveTerritoire({ objet: "Travaux", winnerDept: "49" }); assert.deepEqual(w.departements, ["49"]); assert.match(w.origine, /à confirmer/);
  assert.deepEqual(resolveTerritoire({ objet: "x", winnerDept: "zz" }).departements, []);
});

const row = { contract_uid: "abcde12345", winner_id: "12345678900012", winner_name: "PLOMBI SARL", winner_category: "PME", winner_dept: "50", object: "Travaux de plomberie - département de la Manche (50)", amount: 800000, amount_flag: null, duration_months: 12, cpv: "45330000", buyer_name: "Ville", subcontracting_declared: false, awarded_on: "2026-11-20", procedure: "MAPA" };
const mkEnt = (i) => ({ siren: String(200000000 + i), nom_complet: "ENT " + i, activite_principale: "43.22A", siege: { siret: String(20000000000000 + i), activite_principale: "43.22A", etat_administratif: "A", departement: "50", est_siege: true, adresse: "1 rue", code_postal: "50000", libelle_commune: "SAINT-LO" } });
const fetchImpl = async (url) => {
  if (url.searchParams.get("q")) return { ok: true, json: async () => ({ results: [{ siren: "123456789", nom_complet: "PLOMBI SARL", activite_principale: "43.22A", tranche_effectif_salarie: "03", categorie_entreprise: "PME" }] }) };
  return { ok: true, json: async () => ({ results: url.searchParams.get("page") === "1" ? [mkEnt(1), mkEnt(2), { ...mkEnt(3), siren: "123456789" }] : [] }) };
};

test("mission : fiche complète, partenaires hors gagnant, aucun effet externe", async () => {
  const admin = { rpc: async (name, args) => { assert.equal(name, "cheexpeer_worker_read_awarded_contract"); assert.equal(args.p_contract_uid, "abcde12345"); return { data: [row], error: null }; } };
  const r = await runOpportuniteMission({ contract_uid: "abcde12345" }, { admin, fetchImpl, pauseMs: 0, now: new Date("2026-11-22T10:00:00Z") });
  assert.equal(r.type, "opportunite_attribution"); assert.equal(r.effets_externes, false);
  assert.equal(r.gagnants[0].siren, "123456789"); assert.equal(r.gagnants[0].effectif_estime, 8);
  assert.equal(r.indice.niveau, "fort"); assert.deepEqual(r.territoire.departements, ["50"]);
  assert.ok(r.metiers.some((m) => m.naf === "43.22A")); assert.equal(r.nombre, 2);
  assert.ok(r.partenaires.every((p) => p.siren !== "123456789" && /Même métier/.test(p.raison)));
  assert.equal(r.qualification, undefined); assert.match(r.indice.qualification, /non réalisée/);
});

test("mission : marché introuvable ou lecture indisponible = échec propre", async () => {
  await assert.rejects(() => runOpportuniteMission({ contract_uid: "abcde12345" }, { admin: { rpc: async () => ({ data: [], error: null }) }, fetchImpl, pauseMs: 0 }), (e) => e.code === "INVALID_INPUT");
  await assert.rejects(() => runOpportuniteMission({ contract_uid: "abcde12345" }, { admin: undefined, fetchImpl }), /indisponible/);
  await assert.rejects(() => runOpportuniteMission({ contract_uid: "bad uid" }, { admin: { rpc: async () => ({}) }, fetchImpl }), (e) => e.code === "INVALID_INPUT");
});

test("moteur : le type est exécutable en autonomie 0 seulement", async () => {
  const admin = { rpc: async () => ({ data: [row], error: null }) };
  const ok = await executeMission({ mission_type: "opportunite_attribution", autonomy_level: 0, mission_input: { contract_uid: "abcde12345" } }, { fetchImpl, admin });
  assert.equal(ok.type, "opportunite_attribution");
  await assert.rejects(() => executeMission({ mission_type: "opportunite_attribution", autonomy_level: 1, mission_input: { contract_uid: "abcde12345" } }, { fetchImpl, admin }), (e) => e.code === "UNSUPPORTED_TYPE");
});
