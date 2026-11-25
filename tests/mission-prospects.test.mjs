import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { REGIONS, DEPT, regionOfDepartment, validateProspectsInput, pickLocalCompany, departmentOfEstablishment, runProspectsMission, MISSION_TYPE_PROSPECTS } from "../supabase/functions/_shared/mission-prospects-core.mjs";
import { runPending, executeMission, fitResult, WORKER_ID } from "../supabase/functions/_shared/mission-runner-core.mjs";
import { validateSubmissionPayload } from "../supabase/functions/_shared/cheexpeer-api.mjs";

const orgA = "11111111-1111-4111-8111-111111111111";
// Reproduit le comportement réel de l'annuaire : le filtre porte sur les établissements, le siège peut être ailleurs.
const etab = (n, commune, extra = {}) => ({ siret: String(10000000000000 + n), adresse: n + " rue Locale", code_postal: commune.slice(0, 2) + "000", commune, libelle_commune: "Ville" + commune.slice(0, 2), region: "76", est_siege: false, etat_administratif: "A", activite_principale: "43.22B", tranche_effectif_salarie: "03", latitude: "43.9", longitude: "2.1", liste_rge: null, ...extra });
const co = (n, { siege = etab(n, "81004", { est_siege: true }), local, naf = "43.22B", siren } = {}) => ({ siren: siren ?? String(100000000 + n), nom_complet: "Entreprise " + n, activite_principale: naf, siege, matching_etablissements: local ? [local] : [siege] });
const json = (results) => ({ ok: true, json: async () => ({ results }) });

test("chaque département métropolitain et d'outre-mer appartient à une région, une seule fois", () => {
  const all = Object.values(REGIONS).flatMap((r) => r.depts);
  assert.equal(new Set(all).size, all.length);
  for (let n = 1; n <= 95; n++) { if (n === 20) continue; const d = String(n).padStart(2, "0"); assert.ok(regionOfDepartment(d), d); }
  assert.ok(regionOfDepartment("2A") && regionOfDepartment("974"));
  assert.equal(regionOfDepartment("81").nom, "Occitanie"); assert.equal(regionOfDepartment("99"), null);
  assert.ok(all.every((d) => DEPT.test(d)));
});

test("validation de l'entrée : NAF, département, limite 20-30, SIREN", () => {
  assert.equal(validateProspectsInput({ naf: "4322b", departement: "81" }).value.limite, 30);
  assert.equal(validateProspectsInput({ naf: "4322b", departement: "81" }).value.naf, "43.22B");
  for (const bad of [{ naf: "zz", departement: "81" }, { naf: "43.22B", departement: "00" }, { naf: "43.22B", departement: "81", limite: 10 }, { naf: "43.22B", departement: "81", limite: 31 },
    { naf: "43.22B", departement: "81", gagnant_siren: "12" }, { naf: "43.22B", departement: "81", extra: 1 }, null, []]) assert.equal(validateProspectsInput(bad).ok, false);
});

test("département déduit du code commune INSEE", () => {
  assert.equal(departmentOfEstablishment({ commune: "81220" }), "81"); assert.equal(departmentOfEstablishment({ commune: "97411" }), "974");
  assert.equal(departmentOfEstablishment({ commune: "2A004" }), "2A"); assert.equal(departmentOfEstablishment({ code_postal: "31000" }), "31");
  assert.equal(departmentOfEstablishment({}), "");
});

test("entreprise : l'agence locale est présentée, pas le siège lointain ; provenance conservée, aucun contact inventé", () => {
  const groupe = co(1, { siege: etab(1, "92026", { est_siege: true, region: "11", adresse: "Siège à Courbevoie" }), local: etab(501, "81220", { adresse: "Agence de Rabastens", liste_rge: ["1905"] }) });
  const r = pickLocalCompany(groupe, { naf: "43.22B", departement: "81", regionCode: "76", now: new Date("2026-11-22T10:00:00Z") });
  assert.equal(r.company.adresse, "Agence de Rabastens"); assert.equal(r.company.departement, "81"); assert.equal(r.company.etablissement, "agence locale");
  assert.equal(r.company.zone, "même département"); assert.equal(r.company.rge, true); assert.equal(r.score, 1);
  assert.equal(r.company.source_url, "https://annuaire-entreprises.data.gouv.fr/entreprise/100000001"); assert.equal(r.company.collecte_le, "2026-11-22");
  assert.equal(r.company.telephone, null); assert.equal(r.company.email, null); assert.equal(r.company.google_maps, null);
  const siegeLocal = pickLocalCompany(co(2), { naf: "43.22B", departement: "81", regionCode: "76" });
  assert.equal(siegeLocal.score, 0); assert.equal(siegeLocal.company.etablissement, "siège");
  const regionOnly = pickLocalCompany(co(3, { siege: etab(3, "31555", { est_siege: true }) }), { naf: "43.22B", departement: "81", regionCode: "76" });
  assert.equal(regionOnly.company.zone, "même région"); assert.equal(regionOnly.score, 2);
});

test("entreprise écartée : hors zone, fermée, autre métier, SIREN invalide", () => {
  const args = { naf: "43.22B", departement: "81", regionCode: "76" };
  assert.equal(pickLocalCompany(co(4, { siege: etab(4, "92026", { est_siege: true, region: "11" }) }), args), null);
  assert.equal(pickLocalCompany(co(5, { siege: etab(5, "81004", { est_siege: true, etat_administratif: "F" }) }), args), null);
  assert.equal(pickLocalCompany(co(6, { siege: etab(6, "81004", { est_siege: true, activite_principale: "47.11A" }) }), args), null);
  assert.equal(pickLocalCompany({ siren: "x" }, args), null);
});

test("mission : département d'abord (siège puis agences), puis région ; sans doublon ni gagnant ; limite respectée", async () => {
  const calls = [];
  const fetchImpl = async (u) => { const p = new URL(u).searchParams; calls.push(Object.fromEntries(p));
    if (p.get("departement")) return json([
      co(1, { siege: etab(1, "92026", { est_siege: true, region: "11" }), local: etab(501, "81220") }), // agence locale d'un groupe
      co(2), co(2), // siège local, doublon
      co(3, { siren: "999999999" }), // gagnant
      co(4, { naf: "47.11A", siege: etab(4, "81004", { est_siege: true, activite_principale: "47.11A" }) }), // autre métier
      co(5, { siege: etab(5, "92026", { est_siege: true, region: "11" }) }) // aucun établissement local : écartée
    ]);
    return json(Array.from({ length: 25 }, (_, i) => co(100 + i, { siege: etab(100 + i, "31555", { est_siege: true }) }))); };
  const r = await runProspectsMission({ naf: "43.22B", departement: "81", limite: 20, gagnant_siren: "999999999", gagnant_nom: "Gagnant SA" }, { fetchImpl });
  assert.equal(r.nombre, 20); assert.equal(new Set(r.entreprises.map((e) => e.siren)).size, 20);
  assert.ok(!r.entreprises.some((e) => ["999999999", "100000004", "100000005"].includes(e.siren)));
  assert.deepEqual(r.entreprises.slice(0, 2).map((e) => e.siren), ["100000002", "100000001"]); // siège local avant agence locale
  assert.deepEqual(r.entreprises.slice(0, 2).map((e) => e.zone), ["même département", "même département"]);
  assert.equal(r.entreprises[2].zone, "même région");
  assert.equal(calls[0].departement, "81"); assert.equal(calls[0].etat_administratif, "A"); assert.equal(calls[0].activite_principale, "43.22B");
  assert.ok(calls.some((c) => c.region === "76"));
  assert.equal(r.effets_externes, false); assert.equal(r.criteres.region, "Occitanie");
});

test("mission : erreur de l'annuaire remontée, entrée invalide refusée", async () => {
  await assert.rejects(runProspectsMission({ naf: "43.22B", departement: "81" }, { fetchImpl: async () => ({ ok: false, status: 500 }) }), /annuaire_500/);
  await assert.rejects(runProspectsMission({ naf: "bad", departement: "81" }, { fetchImpl: async () => json([]) }), (e) => e.code === "INVALID_INPUT");
});

test("API de soumission : le type est accepté, la validation humaine est forcée, l'entrée est contrôlée", () => {
  const base = { organization_id: orgA, mission_type: MISSION_TYPE_PROSPECTS, title: "Prospects", input: { naf: "43.22B", departement: "81" } };
  const ok = validateSubmissionPayload(base);
  assert.equal(ok.ok, true); assert.equal(ok.value.requires_approval, true); assert.equal(ok.value.input.limite, 30);
  assert.equal(validateSubmissionPayload({ ...base, requires_approval: false }).ok, false);
  assert.equal(validateSubmissionPayload({ ...base, input: { naf: "x", departement: "81" } }).ok, false);
  assert.equal(validateSubmissionPayload({ ...base, autonomy_level: 1 }).ok, false);
  assert.equal(validateSubmissionPayload({ ...base, mission_type: "send_email" }).ok, false);
});

const fakeAdmin = (mission, { completeOk = true } = {}) => { const log = []; let given = false;
  return { log, rpc: async (name, args) => { log.push([name, args]);
    if (name === "cheexpeer_worker_claim_next") { if (given || !mission) return { data: [] }; given = true; return { data: [mission] }; }
    if (name === "cheexpeer_worker_complete_mission") return { data: completeOk };
    return { data: 0 }; } }; };

test("exécuteur : mission de prospects réservée, exécutée, résultat enregistré par l'identité technique", async () => {
  const m = { mission_id: orgA, mission_type: MISSION_TYPE_PROSPECTS, autonomy_level: 0, mission_input: { naf: "43.22B", departement: "81", limite: 20 } };
  const admin = fakeAdmin(m);
  const s = await runPending(admin, { fetchImpl: async () => json(Array.from({ length: 25 }, (_, i) => co(i + 1))) });
  assert.equal(s.processed.length, 1); assert.equal(s.failed.length, 0);
  const done = admin.log.find(([n]) => n === "cheexpeer_worker_complete_mission")[1];
  assert.equal(done.p_worker_id, WORKER_ID); assert.equal(done.p_result.nombre, 20);
});

test("exécuteur : type inconnu ou entrée invalide → échec propre, jamais de résultat inventé", async () => {
  for (const m of [{ mission_id: orgA, mission_type: "send_email", autonomy_level: 0, mission_input: {} },
    { mission_id: orgA, mission_type: MISSION_TYPE_PROSPECTS, autonomy_level: 0, mission_input: { naf: "x" } },
    { mission_id: orgA, mission_type: MISSION_TYPE_PROSPECTS, autonomy_level: 1, mission_input: { naf: "43.22B", departement: "81" } }]) {
    const admin = fakeAdmin(m);
    const s = await runPending(admin, { fetchImpl: async () => json([]) });
    assert.equal(s.failed.length, 1); assert.ok(admin.log.some(([n]) => n === "cheexpeer_worker_fail_mission"));
    assert.ok(!admin.log.some(([n]) => n === "cheexpeer_worker_complete_mission"));
  }
});

test("exécuteur : diagnostic inerte inchangé ; rien à faire sans mission ; résultat trop gros réduit et signalé", async () => {
  const r = await executeMission({ mission_type: "readiness_probe", autonomy_level: 0 });
  assert.equal(r.status, "passed"); assert.equal(r.external_effects, false);
  const s = await runPending(fakeAdmin(null)); assert.deepEqual(s, { processed: [], failed: [] });
  const big = { entreprises: Array.from({ length: 30 }, (_, i) => ({ nom: "x".repeat(2000), i })), nombre: 30 };
  const fit = fitResult(big);
  assert.ok(fit.reduit === true && fit.entreprises.length < 30 && fit.nombre === fit.entreprises.length);
  assert.ok(new TextEncoder().encode(JSON.stringify(fit)).byteLength <= 30 * 1024);
});

test("migration : type autorisé en autonomie 0 avec validation obligatoire, outil désactivé par défaut", () => {
  const sql = readFileSync("supabase/migrations/20261122120000_cheexpeer_mission_prospects.sql", "utf8");
  assert.match(sql, /p_mission_type not in \('readiness_probe', 'prospects_sous_traitance'\) or p_autonomy_level <> 0/);
  assert.match(sql, /not p_requires_approval/);
  assert.match(sql, /0, true, 'read', false, 60, 0/);
});

test("mode « toutes » : tout le département, page après page, sans région, résultat volumineux conservé", async () => {
  const mk = (i) => ({ siren: String(100000000 + i), nom_complet: "ENT " + i, activite_principale: "43.22B", siege: { siret: String(10000000000000 + i), activite_principale: "43.22B", etat_administratif: "A", departement: "81", est_siege: true, adresse: "1 rue", code_postal: "81000", libelle_commune: "ALBI" } });
  const pages = { 1: Array.from({ length: 25 }, (_, i) => mk(i)), 2: Array.from({ length: 25 }, (_, i) => mk(25 + i)), 3: Array.from({ length: 7 }, (_, i) => mk(50 + i)) };
  const calls = [];
  const fetchImpl = async (url) => { calls.push(url.searchParams.get("page") + ":" + (url.searchParams.get("departement") ?? "") + ":" + (url.searchParams.get("region") ?? "")); return { ok: true, json: async () => ({ results: pages[url.searchParams.get("page")] ?? [] }) }; };
  assert.equal(validateProspectsInput({ naf: "43.22B", departement: "81", limite: 0 }).ok, true);
  const r = await runProspectsMission({ naf: "43.22B", departement: "81", limite: 0 }, { fetchImpl, pauseMs: 0 });
  assert.equal(r.nombre, 57); assert.equal(r.criteres.toutes, true); assert.equal(r.plafond_atteint, false);
  assert.deepEqual(calls, ["1:81:", "2:81:", "3:81:"]);
  assert.equal(fitResult(r).reduit, undefined, "pas de réduction à 30 Ko en mode toutes");
});

test("accompagnement : commune du chantier → distance, score et répartition ; sans commune la note existe quand même, sans distance", async () => {
  const { runProspectsMission, validateProspectsInput } = await import("../supabase/functions/_shared/mission-prospects-core.mjs");
  const ent = (i, lat, lon) => ({ siren: String(300000000 + i), nom_complet: "E" + i, activite_principale: "43.22A", siege: { siret: String(30000000000000 + i), activite_principale: "43.22A", etat_administratif: "A", departement: "50", est_siege: true, libelle_commune: "X", latitude: lat, longitude: lon } });
  const fetchImpl = async (url) => url.hostname === "api-adresse.data.gouv.fr"
    ? { ok: true, json: async () => ({ features: [{ geometry: { coordinates: [-1.0833, 49.1167] }, properties: { label: "Saint-Lô", context: "50, Manche, Normandie" } }] }) }
    : { ok: true, json: async () => ({ results: url.searchParams.get("page") === "1" ? [ent(1, "49.12", "-1.09"), ent(2, "48.85", "2.35")] : [] }) };
  const r = await runProspectsMission({ naf: "43.22A", departement: "50", limite: 20, commune_chantier: "Saint-Lô" }, { fetchImpl, pauseMs: 0, now: new Date("2026-11-23T10:00:00Z") });
  assert.match(r.chantier.origine, /Saint-Lô/); assert.equal(r.chantier.fiable, false);
  const e1 = r.entreprises.find((e) => e.siren === "300000001"), e2 = r.entreprises.find((e) => e.siren === "300000002");
  assert.ok(e1.distance_km < 5); assert.ok(e2.distance_km > 200); assert.equal(r.entreprises[0].siren, "300000001");
  assert.deepEqual(r.repartition_distance.paliers_km, [25, 50, 100]); assert.equal(r.repartition_distance.jusqua_palier_1, 1);
  const sans = await runProspectsMission({ naf: "43.22A", departement: "50", limite: 20 }, { fetchImpl, pauseMs: 0 });
  assert.equal(sans.chantier, null); assert.equal(sans.repartition_distance, null); assert.ok(sans.entreprises.every((e) => typeof e.score?.note === "number" && e.distance_km === null)); assert.ok(sans.entreprises.every((e, i, a) => i === 0 || a[i - 1].score.note >= e.score.note));
  const des = await runProspectsMission({ naf: "43.11Z", departement: "50", limite: 20, commune_chantier: "Saint-Lô" }, { fetchImpl: async (u) => u.hostname === "api-adresse.data.gouv.fr" ? fetchImpl(u) : { ok: true, json: async () => ({ results: [{ ...ent(3, "48.85", "2.35"), activite_principale: "43.11Z", siege: { ...ent(3).siege, activite_principale: "43.11Z" } }].slice(0, 1) }) }, pauseMs: 0 });
  assert.deepEqual(des.repartition_distance.paliers_km, [50, 100, 200]);
  assert.equal(validateProspectsInput({ naf: "43.22A", departement: "50", commune_chantier: "x".repeat(200) }).value.commune_chantier.length, 80);
});

test("fiches contacts : dirigeants officiels + site/téléphone Google + e-mail lu sur le site, clé absente tolérée, 30 max", async () => {
  const { runFichesMission, validateFichesInput } = await import("../supabase/functions/_shared/mission-fiches-core.mjs");
  const { buildFichesPayload, fichesToCsv } = await import("../cheexpeer-command.mjs");
  const page = (body) => ({ ok: true, headers: { get: () => "text/html" }, text: async () => body });
  const fetchImpl = async (url, init) => url.hostname === "places.googleapis.com"
    ? (assert.match(init.headers["X-Goog-FieldMask"], /places\.websiteUri,places\.nationalPhoneNumber$/), { ok: true, json: async () => ({ places: [{ id: "PID1", displayName: { text: "PLOMBI SARL" }, formattedAddress: "1 rue X, 50000 Saint-Lô", googleMapsUri: "https://maps.google.com/?cid=1", nationalPhoneNumber: "02 33 01 02 03", websiteUri: "https://plombi.fr/" }] }) })
    : url.hostname === "plombi.fr"
      ? (url.pathname === "/contact" ? page('<a href="mailto:Contact@plombi.fr">écrire</a> <img src="logo@2x.png"> sentry@sentry.io') : page("<html>accueil</html>"))
      : { ok: true, json: async () => ({ results: [{ siren: url.searchParams.get("q"), nom_complet: "PLOMBI SARL", dirigeants: [{ nom: "DUPONT", prenoms: "Jean Paul", qualite: "Gérant" }, { type_dirigeant: "personne morale", denomination: "HOLDING SA", qualite: "Président" }] }] }) };
  const input = { entreprises: [{ siren: "123456789", nom: "PLOMBI SARL", commune: "Saint-Lô", code_postal: "50000" }] };
  const r = await runFichesMission(input, { fetchImpl, pauseMs: 0, googleKey: "TEST", now: new Date("2026-11-23T10:00:00Z") });
  const f = r.fiches[0];
  assert.equal(f.dirigeants[0].nom, "Jean DUPONT"); assert.equal(f.google.statut, "correspondance probable"); assert.equal(f.google.lien_google_maps, "https://maps.google.com/?cid=1");
  assert.equal(f.site_web, "https://plombi.fr/"); assert.equal(f.telephone, "02 33 01 02 03"); assert.equal(f.telephone_source, "Google Maps");
  assert.deepEqual(f.emails, ["contact@plombi.fr"]); assert.equal(f.email_source, "site de l'entreprise");
  assert.equal(r.effets_externes, false); assert.deepEqual(r.manquant, []);
  const sans = await runFichesMission(input, { fetchImpl, pauseMs: 0, googleKey: "" });
  assert.equal(sans.fiches[0].google.statut, "clé Google absente"); assert.equal(sans.fiches[0].dirigeants.length, 2);
  const panne = await runFichesMission(input, { fetchImpl: async (u) => { if (u.hostname === "places.googleapis.com") throw new Error("x"); return fetchImpl(u); }, pauseMs: 0, googleKey: "K" });
  assert.equal(panne.fiches[0].google.statut, "erreur Google");
  assert.equal(validateFichesInput({ entreprises: Array.from({ length: 31 }, (_, i) => ({ siren: String(100000000 + i) })) }).ok, false);
  assert.equal(validateFichesInput({ entreprises: [{ siren: "12" }] }).ok, false); assert.equal(validateFichesInput({ entreprises: [], x: 1 }).ok, false);
  const body = buildFichesPayload({ organizationId: "o", entreprises: Array.from({ length: 40 }, (_, i) => ({ siren: String(100000000 + i), nom: "N" })), idempotencyKey: "k" });
  assert.equal(body.input.entreprises.length, 30); assert.equal(body.requires_approval, true); assert.equal(body.autonomy_level, 0);
  assert.match(fichesToCsv(r.fiches), /Jean DUPONT \(Gérant\)/); assert.match(fichesToCsv(r.fiches), /contact@plombi\.fr/);
  const { runFichesMission: run2 } = await import("../supabase/functions/_shared/mission-fiches-core.mjs");
  const interne = await run2(input, { fetchImpl: async (u, i) => u.hostname === "places.googleapis.com" ? { ok: true, json: async () => ({ places: [{ id: "P", displayName: { text: "PLOMBI SARL" }, formattedAddress: "50000 Saint-Lô", websiteUri: "http://127.0.0.1/admin" }] }) } : fetchImpl(u, i), pauseMs: 0, googleKey: "K" });
  assert.equal(interne.fiches[0].site_web, null, "adresse interne refusée");
});
