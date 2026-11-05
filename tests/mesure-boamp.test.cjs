const assert = require("node:assert/strict");
const path = require("node:path");
const tool = require("../outils/mesure-boamp.cjs");

const engineFile = path.join(__dirname, "..", "opportunity-search.js");
const now = new Date("2026-11-03T10:00:00Z");

(async () => {
  // Fenêtre de dates
  assert.equal(tool.sinceDate(now, 365), "2025-11-03");

  // Les catégories du moteur sont bien relues depuis le code
  const categories = tool.readEngineCategories(engineFile);
  assert.ok(categories.services.includes("informatique") && Object.keys(categories).length >= 8);

  // URL : agrégation v2.1 et comptage par mots-clés
  const group = new URL(tool.groupUrl("type_marche", "2025-11-03"));
  assert.equal(group.searchParams.get("group_by"), "type_marche");
  assert.match(group.searchParams.get("where"), /^dateparution >= date'2025-11-03'$/);
  const count = new URL(tool.countUrl(["électricité", "éclairage"], "2025-11-03"));
  assert.equal(count.searchParams.get("q"), '("électricité" OR "éclairage")');
  assert.equal(count.searchParams.get("limit"), "0");

  // Lecture des deux formats de réponse
  assert.deepEqual(tool.parseGroups({ results: [{ type_marche: "SERVICES", total: 12 }] }, "type_marche"), [{ label: "SERVICES", count: 12 }]);
  assert.deepEqual(tool.parseGroups({ facet_groups: [{ name: "type_marche", facets: [{ name: "TRAVAUX", count: 3 }, { name: "SERVICES", count: 9 }] }] }, "type_marche"),
    [{ label: "SERVICES", count: 9 }, { label: "TRAVAUX", count: 3 }]);
  assert.equal(tool.parseGroups({ autre: true }, "type_marche"), null);

  // Cas nominal avec réponses simulées
  const calls = [];
  const okFetch = async (url) => {
    calls.push(url);
    const parsed = new URL(url);
    const select = parsed.searchParams.get("select") || "";
    const field = select.split(",")[0];
    const body = parsed.searchParams.get("group_by")
      ? { results: [{ [field]: "VALEUR A", total: 50 }, { [field]: "VALEUR B", total: 20 }] }
      : { total_count: 7 };
    return { ok: true, json: async () => body };
  };
  const ok = await tool.run({ fetchImpl: okFetch, now, engineFile, pauseMs: 0 });
  assert.equal(ok.failures.length, 0);
  assert.equal(ok.dimensions.length, 3);
  assert.ok(ok.categories.every((item) => item.count === 7));
  const report = tool.formatReport(ok);
  assert.match(report, /mesure brute, à relire/);
  assert.match(report, /\| 1 \| VALEUR A \| 50 \|/);
  assert.match(report, /## Limites/);

  // Échec de l'API : aucun chiffre inventé, erreurs listées, rien de présenté comme mesuré
  const failing = await tool.run({ fetchImpl: async () => ({ ok: false, status: 503, json: async () => ({}) }), now, engineFile, pauseMs: 0 });
  assert.ok(failing.failures.length > 0);
  assert.ok(failing.dimensions.every((item) => item.rows === null));
  assert.ok(failing.categories.every((item) => item.count === null));
  const failReport = tool.formatReport(failing);
  assert.match(failReport, /Non mesuré/);
  assert.match(failReport, /non mesuré/);
  assert.match(failReport, /## Erreurs/);

  // Repli sur les facettes si l'agrégation v2.1 échoue
  const fallback = await tool.run({
    fetchImpl: async (url) => {
      if (url.includes("/explore/v2.1/") && new URL(url).searchParams.get("group_by")) return { ok: false, status: 400, json: async () => ({}) };
      if (url.includes("/records/1.0/search/")) return { ok: true, json: async () => ({ facet_groups: [{ name: new URL(url).searchParams.get("facet"), facets: [{ name: "X", count: 4 }] }] }) };
      return { ok: true, json: async () => ({ total_count: 1 }) };
    }, now, engineFile, pauseMs: 0
  });
  assert.ok(fallback.dimensions.every((item) => item.rows && item.rows[0].count === 4));

  console.log("Tests mesure-boamp : OK");
})().catch((error) => { console.error(error); process.exit(1); });
