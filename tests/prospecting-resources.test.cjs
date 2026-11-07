"use strict";
const assert = require("node:assert/strict");
const resources = require("../prospecting-resources.js");

async function main() {
  assert.ok(resources.SOURCES.some(source => source.id === "sirene"));
  assert.ok(resources.SOURCES.some(source => source.id === "rne"));
  assert.ok(resources.SOURCES.some(source => source.id === "qualibat"));
  assert.ok(resources.SOURCES.some(source => source.id === "qualifelec"));
  assert.ok(resources.SOURCES.some(source => source.id === "opqibi"));
  assert.ok(resources.SOURCES.some(source => source.id === "fntp"));
  assert.throws(() => resources.searchQualification("qualibat", "123"), /SIRET valide/);
  await assert.rejects(resources.searchConfiguredProxy("rne", { siren:"123456789" }), /pas configuré/);

  const originalFetch = global.fetch;
  const calls = [];
  global.fetch = async url => {
    calls.push(String(url));
    if (calls.length === 1) {
      return { ok:true, status:200, json:async()=>({ schema:[{key:"code_postal"},{key:"raison_sociale"}] }) };
    }
    return { ok:true, status:200, json:async()=>({ results:[
      { raison_sociale:"Entreprise Sarthe", code_postal:"72000" },
      { raison_sociale:"Entreprise Maine-et-Loire", code_postal:"49000" }
    ] }) };
  };
  try {
    const result = await resources.searchRge({ department:"72", limit:10 });
    assert.equal(result.records.length, 1);
    assert.equal(result.records[0].raison_sociale, "Entreprise Sarthe");
    assert.equal(result.departmentFilterApplied, true);
    assert.equal(calls.length, 2);
  } finally {
    global.fetch = originalFetch;
  }

  const previousFetch = global.fetch;
  global.fetch = async () => ({ ok:true, status:200, json:async()=>({ schema:[], results:[] }) });
  try {
    await assert.rejects(resources.searchRge({ department:"72" }), /filtre département non appliqué/);
  } finally {
    global.fetch = previousFetch;
  }
  console.log("Tests prospecting-resources : OK");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
