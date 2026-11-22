import test from "node:test";
import assert from "node:assert/strict";
import { buildSubmitPayload, buildDecisionPayload, callApi, functionUrl, errorMessage, statusLabel } from "../cheexpeer-command.mjs";
import { validateSubmissionPayload, validateApprovalPayload, validateReadPayload } from "../supabase/functions/_shared/cheexpeer-api.mjs";

const org = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", ap = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";

test("la mission construite par l'interface est acceptée par la validation serveur", () => {
  const p = buildSubmitPayload({ organizationId: org, title: "  Diagnostic  ", objective: "", idempotencyKey: "k1" });
  assert.equal(validateSubmissionPayload(p).ok, true);
  assert.equal(p.title, "Diagnostic");
  assert.equal("objective" in p, false);
  assert.equal(p.autonomy_level, 0); assert.equal(p.requires_approval, true);
});
test("intitulé vide refusé côté interface, titre long tronqué", () => {
  assert.equal(buildSubmitPayload({ organizationId: org, title: "   ", idempotencyKey: "k" }), null);
  assert.equal(buildSubmitPayload({ organizationId: org, title: "x".repeat(500), idempotencyKey: "k" }).title.length, 200);
});
test("la décision est acceptée par le serveur et rejette toute valeur inconnue", () => {
  assert.equal(validateApprovalPayload(buildDecisionPayload({ organizationId: org, approvalId: ap, decision: "approved", note: "ok" })).ok, true);
  assert.equal(buildDecisionPayload({ organizationId: org, approvalId: ap, decision: "execute" }), null);
});
test("aucune identité d'acteur n'est jamais envoyée par le navigateur", () => {
  const all = JSON.stringify([buildSubmitPayload({ organizationId: org, title: "t", idempotencyKey: "k" }), buildDecisionPayload({ organizationId: org, approvalId: ap, decision: "rejected" })]);
  assert.doesNotMatch(all, /created_by|decision_by|user_id|actor/);
});
test("les URLs ciblent les trois fonctions attendues", () => {
  assert.equal(functionUrl("https://x.supabase.co/", "submit"), "https://x.supabase.co/functions/v1/cheexpeer-mission-submit");
  assert.match(functionUrl("https://x.supabase.co", "decision"), /cheexpeer-approval-decision$/);
  assert.match(functionUrl("https://x.supabase.co", "read"), /cheexpeer-mission-read$/);
  assert.throws(() => functionUrl("https://x.supabase.co", "autre"));
  assert.equal(validateReadPayload({ organization_id: org, mission_id: ap }).ok, true);
});
test("callApi : succès, erreur serveur traduite, réseau injoignable", async () => {
  const ok = await callApi(async () => ({ ok: true, status: 201, json: async () => ({ ok: true, mission: { mission_id: ap } }) }), { baseUrl: "https://x.co", key: "submit", token: "t", body: {} });
  assert.equal(ok.ok, true);
  const ko = await callApi(async () => ({ ok: false, status: 403, json: async () => ({ ok: false, error: "ACCESS_DENIED" }) }), { baseUrl: "https://x.co", key: "read", token: "t", body: {} });
  assert.equal(ko.ok, false); assert.match(ko.message, /réservée/);
  const net = await callApi(async () => { throw new Error("boom"); }, { baseUrl: "https://x.co", key: "read", token: "t", body: {} });
  assert.equal(net.status, 0); assert.match(net.message, /injoignable/);
});
test("le jeton est envoyé en Bearer et jamais dans le corps", async () => {
  let seen;
  await callApi(async (u, o) => { seen = o; return { ok: true, status: 200, json: async () => ({ ok: true }) }; }, { baseUrl: "https://x.co", key: "read", token: "SECRET", body: { a: 1 } });
  assert.equal(seen.headers.Authorization, "Bearer SECRET"); assert.doesNotMatch(seen.body, /SECRET/);
});
test("libellés : codes inconnus sans fuite d'information", () => {
  assert.match(errorMessage("QUOI_QUE_CE_SOIT"), /Rien n'a été modifié/);
  assert.equal(statusLabel("succeeded"), "Terminée"); assert.equal(statusLabel("zzz"), "Statut à vérifier");
});

import { buildProspectsPayload, prospectsToCsv, prospectsFilename } from "../cheexpeer-command.mjs";

test("demande de prospects : champs contrôlés, validation humaine exigée", () => {
  const ok = buildProspectsPayload({ organizationId: "o", naf: "4322b", departement: "81", limite: "25", gagnantSiren: "123 456 789", gagnantNom: " Clim SA ", idempotencyKey: "k" });
  assert.equal(ok.mission_type, "prospects_sous_traitance"); assert.equal(ok.requires_approval, true); assert.equal(ok.autonomy_level, 0);
  assert.deepEqual(ok.input, { naf: "43.22B", departement: "81", limite: 25, gagnant_siren: "123456789", gagnant_nom: "Clim SA" });
  for (const bad of [{ naf: "x", departement: "81", limite: 25 }, { naf: "43.22B", departement: "00", limite: 25 }, { naf: "43.22B", departement: "81", limite: 19 }, { naf: "43.22B", departement: "81", limite: 31 }, { naf: "43.22B", departement: "81", limite: 25, gagnantSiren: "12" }])
    assert.equal(buildProspectsPayload({ organizationId: "o", idempotencyKey: "k", ...bad }), null);
});

test("export : CSV Excel/Sheets avec BOM, guillemets doublés, formules neutralisées", () => {
  const csv = prospectsToCsv([{ nom: 'Dupont; "Plomberie"', siren: "123456789", naf: "43.22A", commune: "=CMD()", telephone: null }]);
  assert.ok(csv.startsWith("﻿Entreprise;SIREN;SIRET"));
  assert.match(csv, /"Dupont; ""Plomberie"""/); assert.match(csv, /;'=CMD\(\);/); assert.ok(!/;=CMD/.test(csv));
  assert.equal(prospectsToCsv([]).split("\r\n").length, 2);
  assert.equal(prospectsFilename({ naf: "43.22B", departement: "81" }, new Date("2026-11-22T00:00:00Z")), "prospects-sous-traitance-4322B-dep81-2026-11-22.csv");
});

import { buildAnalysePayload, buildProspectsFromAnalysis, MAX_RECHERCHES } from "../cheexpeer-command.mjs";
test("analyse d'un appel d'offres : demande et recherches dérivées", () => {
  const org = "11111111-1111-4111-8111-111111111111";
  const a = buildAnalysePayload({ organizationId: org, idweb: " 26-111564 ", idempotencyKey: "k" });
  assert.equal(a.mission_type, "analyse_marche"); assert.deepEqual(a.input, { idweb: "26-111564" }); assert.equal(a.requires_approval, true);
  assert.equal(buildAnalysePayload({ organizationId: org, idweb: "abc", idempotencyKey: "k" }), null);
  let n = 0; const key = () => "k" + n++;
  const ok = buildProspectsFromAnalysis({ organizationId: org, nafs: ["43.22A", "43.22A", "43.22B"], departements: ["50", "14"], marcheObjet: "Plomberie", newKey: key });
  assert.equal(ok.ok, true); assert.equal(ok.bodies.length, 4); assert.ok(ok.bodies.every((b) => b.mission_type === "prospects_sous_traitance" && b.requires_approval === true));
  assert.equal(buildProspectsFromAnalysis({ organizationId: org, nafs: [], departements: ["50"], newKey: key }).ok, false);
  assert.equal(buildProspectsFromAnalysis({ organizationId: org, nafs: ["zz"], departements: ["50"], newKey: key }).ok, false);
  assert.equal(buildProspectsFromAnalysis({ organizationId: org, nafs: ["43.22A", "43.22B", "43.21A", "43.21B"], departements: ["50", "14"], newKey: key }).ok, false);
  assert.equal(MAX_RECHERCHES, 6);
});
