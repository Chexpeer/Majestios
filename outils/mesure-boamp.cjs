#!/usr/bin/env node
/* Mesure des volumes d'avis BOAMP par catégorie — outil de décision, lecture seule.

   But : aider le porteur du projet à choisir les cinq catégories publiques « parmi les plus importantes
   du BOAMP » à partir de chiffres réels, et non d'une impression.

   Ce que fait l'outil : quelques requêtes GET sur l'API publique OpenDataSoft du BOAMP (DILA),
   puis un rapport Markdown. Il n'écrit rien dans le site, n'enregistre aucune donnée et n'invente aucun chiffre :
   une mesure qui échoue est signalée « non mesurée ».

   Limites à garder en tête (reprises dans le rapport) :
   - les familles d'avis incluent aussi des résultats, rectificatifs et annulations, pas seulement des appels d'offres ;
   - les volumes par mots-clés reprennent la logique approximative du moteur actuel ; un avis peut compter dans plusieurs catégories ;
   - ce script n'a pas pu être testé contre l'API réelle depuis l'environnement où il a été écrit (réseau restreint) :
     il est vérifié par un test avec réponses simulées (tests/mesure-boamp.test.cjs). Le premier passage réel doit être relu. */
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const API_ROOT = "https://boamp-datadila.opendatasoft.com/api";
const DIMENSIONS = [
  ["type_marche", "Type de marché"],
  ["famille_libelle", "Famille d’avis"],
  ["descripteur_libelle", "Descripteur BOAMP"]
];
const TOP = 25;

function sinceDate(now, days) {
  const date = new Date(now.getTime() - days * 86400000);
  return date.toISOString().slice(0, 10);
}

/* Reprend les listes de mots-clés du moteur actuel pour mesurer les mêmes catégories. */
function readEngineCategories(sourceFile) {
  const source = fs.readFileSync(sourceFile, "utf8");
  const match = source.match(/const CATEGORY_TERMS = (\{[\s\S]*?\n  \});/);
  if (!match) throw new Error("CATEGORY_TERMS introuvable dans " + sourceFile);
  return new Function("return " + match[1])();
}

function groupUrl(field, since) {
  const url = new URL(API_ROOT + "/explore/v2.1/catalog/datasets/boamp/records");
  url.searchParams.set("select", field + ", count(*) as total");
  url.searchParams.set("group_by", field);
  url.searchParams.set("where", "dateparution >= date'" + since + "'");
  url.searchParams.set("order_by", "total desc");
  url.searchParams.set("limit", String(TOP));
  return url.toString();
}

function facetUrl(field, since) {
  const url = new URL(API_ROOT + "/records/1.0/search/");
  url.searchParams.set("dataset", "boamp");
  url.searchParams.set("rows", "0");
  url.searchParams.set("facet", field);
  url.searchParams.set("q", "dateparution >= \"" + since + "\"");
  return url.toString();
}

function countUrl(terms, since) {
  const url = new URL(API_ROOT + "/explore/v2.1/catalog/datasets/boamp/records");
  url.searchParams.set("limit", "0");
  url.searchParams.set("where", "dateparution >= date'" + since + "'");
  url.searchParams.set("q", "(" + terms.map((term) => '"' + term.replace(/"/g, "") + '"').join(" OR ") + ")");
  return url.toString();
}

function parseGroups(payload, field) {
  if (payload && Array.isArray(payload.results)) {
    return payload.results
      .filter((row) => row && row[field] != null && Number.isFinite(Number(row.total)))
      .map((row) => ({ label: String(row[field]), count: Number(row.total) }));
  }
  const groups = payload && Array.isArray(payload.facet_groups) ? payload.facet_groups : [];
  const group = groups.find((item) => item.name === field);
  if (group && Array.isArray(group.facets)) {
    return group.facets.map((item) => ({ label: String(item.name), count: Number(item.count) }))
      .sort((a, b) => b.count - a.count).slice(0, TOP);
  }
  return null;
}

async function getJson(fetchImpl, url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(url, { headers: { Accept: "application/json" }, signal: controller.signal });
    if (!response.ok) throw new Error("HTTP " + response.status);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run(options) {
  const { fetchImpl = fetch, now = new Date(), days = 365, engineFile, pauseMs = 300, timeoutMs = 20000 } = options;
  const since = sinceDate(now, days);
  const failures = [];
  const dimensions = [];
  const categories = [];

  for (const [field, label] of DIMENSIONS) {
    let rows = null;
    const attempts = [["v2.1", groupUrl(field, since)], ["facettes v1", facetUrl(field, since)]];
    for (const [mode, url] of attempts) {
      try {
        rows = parseGroups(await getJson(fetchImpl, url, timeoutMs), field);
        if (rows) break;
        failures.push(label + " (" + mode + ") : réponse au format inattendu");
      } catch (error) {
        failures.push(label + " (" + mode + ") : " + (error && error.message ? error.message : error));
      }
      await pause(pauseMs);
    }
    dimensions.push({ field, label, rows });
  }

  const terms = readEngineCategories(engineFile);
  for (const [key, list] of Object.entries(terms)) {
    try {
      const payload = await getJson(fetchImpl, countUrl(list, since), timeoutMs);
      const total = Number(payload && payload.total_count);
      if (!Number.isFinite(total)) throw new Error("total_count absent");
      categories.push({ key, terms: list, count: total });
    } catch (error) {
      failures.push("Catégorie « " + key + " » : " + (error && error.message ? error.message : error));
      categories.push({ key, terms: list, count: null });
    }
    await pause(pauseMs);
  }

  return { since, days, now, dimensions, categories, failures };
}

function formatReport(result) {
  const lines = [];
  const day = result.now.toISOString().slice(0, 10);
  lines.push("# Mesure des volumes d'avis BOAMP");
  lines.push("");
  lines.push("- Date de la mesure : " + day);
  lines.push("- Période : avis publiés depuis le " + result.since + " (" + result.days + " jours)");
  lines.push("- Source : BOAMP, Direction de l'information légale et administrative (DILA), via OpenDataSoft");
  lines.push("- Statut : **mesure brute, à relire** ; elle ne décide rien tant que le porteur du projet n'a pas validé.");
  lines.push("");
  for (const dimension of result.dimensions) {
    lines.push("## " + dimension.label);
    lines.push("");
    if (!dimension.rows) {
      lines.push("_Non mesuré (voir les erreurs en fin de rapport)._");
    } else {
      lines.push("| Rang | Valeur | Avis |");
      lines.push("|---:|---|---:|");
      dimension.rows.forEach((row, index) => lines.push("| " + (index + 1) + " | " + row.label.replace(/\|/g, "/") + " | " + row.count + " |"));
    }
    lines.push("");
  }
  lines.push("## Catégories du moteur actuel (par mots-clés)");
  lines.push("");
  lines.push("| Catégorie | Avis | Mots-clés |");
  lines.push("|---|---:|---|");
  [...result.categories].sort((a, b) => (b.count ?? -1) - (a.count ?? -1)).forEach((item) => {
    lines.push("| " + item.key + " | " + (item.count == null ? "non mesuré" : item.count) + " | " + item.terms.join(", ") + " |");
  });
  lines.push("");
  lines.push("## Limites");
  lines.push("");
  lines.push("- Les familles d'avis incluent des résultats, rectificatifs et annulations, pas seulement des appels d'offres.");
  lines.push("- Les volumes par mots-clés reprennent la logique approximative du moteur actuel ; un avis peut compter dans plusieurs catégories.");
  lines.push("- Un volume élevé ne mesure ni la valeur commerciale ni l'accessibilité d'un marché pour les entreprises cibles.");
  if (result.failures.length) {
    lines.push("");
    lines.push("## Erreurs");
    lines.push("");
    result.failures.forEach((failure) => lines.push("- " + failure));
  }
  return lines.join("\n") + "\n";
}

async function main() {
  const args = process.argv.slice(2);
  const option = (name, fallback) => {
    const index = args.indexOf(name);
    return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
  };
  const days = Number.parseInt(option("--jours", "365"), 10);
  const output = option("--sortie", "");
  const result = await run({ days, engineFile: path.join(__dirname, "..", "opportunity-search.js") });
  const report = formatReport(result);
  process.stdout.write(report);
  if (output) fs.writeFileSync(output, report, "utf8");
  if (result.failures.length) process.exitCode = 1;
}

module.exports = { run, formatReport, groupUrl, facetUrl, countUrl, parseGroups, readEngineCategories, sinceDate };
if (require.main === module) main().catch((error) => { console.error("Mesure impossible : " + error.message); process.exit(2); });
