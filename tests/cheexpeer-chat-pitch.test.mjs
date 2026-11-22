import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { chat, runTool, TOOLS, MAX_TOOL_ROUNDS } from "../supabase/functions/_shared/cheexpeer-chat-core.mjs";

const json = (b) => ({ ok: true, status: 200, json: async () => b });

test("la copie du module de pitch pour les fonctions reste identique à la source du site", () => {
  assert.equal(readFileSync("supabase/functions/_shared/pitch-core.mjs", "utf8"), readFileSync("pitch-sous-traitance.mjs", "utf8"));
});

test("outils : uniquement lecture, quatre outils déclarés", () => {
  assert.deepEqual(TOOLS.map((t) => t.name), ["marches_attribues", "entreprises", "metiers_complementaires", "rediger_pitch"]);
});

test("metiers_complementaires et rediger_pitch", async () => {
  const m = await runTool("metiers_complementaires", { naf: "4322b" });
  assert.equal(m.naf, "43.22B"); assert.equal(m.metiers.length, 3);
  assert.ok((await runTool("metiers_complementaires", { naf: "zz" })).erreur);
  assert.equal((await runTool("metiers_complementaires", { naf: "62.01Z" })).metiers.length, 0);
  const p = await runTool("rediger_pitch", { titulaire: "Clim SA", objet: "Climatisation d'une école", metier: "plomberie", departement: "31" });
  assert.match(p.pitch, /Clim SA/); assert.ok(!/@|\+33|0[1-9]( ?\d\d){4}/.test(p.pitch));
  assert.ok((await runTool("rediger_pitch", { titulaire: "X" })).erreur);
});

test("marches_attribues : filtres assainis, appel avec la session de l'appelant", async () => {
  let args;
  const userClient = { rpc: async (n, a) => { args = { n, a }; return { data: [{ object: "Pose de panneaux", awarded_on: "2026-11-01", amount: 1000, buyer_name: "Mairie", buyer_commune: "Albi", buyer_dept: "81", winners: "Solaire SAS" }], error: null }; } };
  const r = await runTool("marches_attribues", { departement: "81; drop", mots: "ab", limite: 999, mois: 99 }, { userClient });
  assert.equal(args.n, "list_awarded_contracts"); assert.equal(args.a.p_department, null); assert.equal(args.a.p_query, null);
  assert.equal(args.a.p_limit, 15); assert.equal(args.a.p_months, 36);
  assert.equal(r.marches[0].titulaires, "Solaire SAS");
  const bad = await runTool("marches_attribues", {}, { userClient: { rpc: async () => ({ data: null, error: { message: "x" } }) } });
  assert.ok(bad.erreur);
});

test("entreprises : filtre obligatoire, aucune donnée de dirigeant renvoyée", async () => {
  assert.ok((await runTool("entreprises", {})).erreur);
  let seen;
  const fetchImpl = async (u) => { seen = String(u); return json({ results: [{ nom_complet: "Plomberie Dupont", siren: "123456789", activite_principale: "43.22A", dirigeants: [{ nom: "SECRET" }], siege: { libelle_commune: "ALBI", departement: "81" } }] }); };
  const r = await runTool("entreprises", { departement: "81", naf: "4322A" }, { fetchImpl });
  assert.match(seen, /departement=81/); assert.match(seen, /activite_principale=43.22A/);
  assert.equal(r.entreprises[0].siren, "123456789"); assert.ok(!JSON.stringify(r).includes("SECRET"));
});

test("boucle : l'outil est exécuté puis la réponse finale est enregistrée une seule fois", async () => {
  const calls = []; let recorded;
  const fetchImpl = async (url, init) => {
    const b = JSON.parse(init.body); calls.push(b);
    if (calls.length === 1) return json({ stop_reason: "tool_use", usage: { input_tokens: 10, output_tokens: 5 }, content: [{ type: "tool_use", id: "t1", name: "metiers_complementaires", input: { naf: "43.22B" } }] });
    return json({ stop_reason: "end_turn", usage: { input_tokens: 20, output_tokens: 8 }, content: [{ type: "text", text: "Voici les métiers." }] });
  };
  const userClient = { rpc: async () => ({ data: { conversation_id: "11111111-1111-1111-1111-111111111111", history: [{ role: "user", content: "pitch" }] }, error: null }) };
  const adminClient = { rpc: async (n, a) => { recorded = a; return { error: null }; } };
  const out = await chat({ body: { message: "pitch" }, userId: "u", userClient, adminClient, apiKey: "k", fetchImpl });
  assert.equal(out.status, 200); assert.equal(out.body.reply, "Voici les métiers.");
  assert.equal(calls.length, 2); assert.equal(calls[1].messages.at(-1).content[0].type, "tool_result");
  assert.equal(recorded.p_input_tokens, 30); assert.equal(recorded.p_output_tokens, 13);
});

test("boucle : arrêt après le nombre maximum de tours d'outils", async () => {
  let n = 0;
  const fetchImpl = async (url, init) => { n++; const b = JSON.parse(init.body);
    return b.tools ? json({ stop_reason: "tool_use", content: [{ type: "tool_use", id: "t" + n, name: "metiers_complementaires", input: { naf: "43.22B" } }] })
      : json({ stop_reason: "end_turn", content: [{ type: "text", text: "fin" }] }); };
  const userClient = { rpc: async () => ({ data: { conversation_id: "11111111-1111-1111-1111-111111111111", history: [{ role: "user", content: "x" }] }, error: null }) };
  const out = await chat({ body: { message: "x" }, userId: "u", userClient, adminClient: { rpc: async () => ({ error: null }) }, apiKey: "k", fetchImpl });
  assert.equal(out.body.reply, "fin"); assert.equal(n, MAX_TOOL_ROUNDS + 1);
});
