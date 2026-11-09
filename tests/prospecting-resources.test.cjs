"use strict";
const assert = require("node:assert/strict");
const resources = require("../prospecting-resources.js");

async function main() {
  assert.equal(typeof resources.searchRge, "function");
  assert.equal(typeof resources.searchQualification, "function");
  assert.equal(typeof resources.renderCatalog, "function");
  assert.equal(resources.SOURCES, undefined, "Le catalogue des fournisseurs ne doit pas être exposé dans l’API publique.");

  await assert.rejects(resources.searchQualification("123"), /SIRET valide/);

  const previousConfig = global.MAJESTIOS_PROSPECTING_CONFIG;
  const previousQualificationFetch = global.fetch;
  try {
    global.MAJESTIOS_PROSPECTING_CONFIG = {};
    const unavailable = await resources.searchQualification("12345678901234");
    assert.deepEqual(unavailable, {
      siret:"12345678901234", results:[], checkedCount:0, successCount:0, available:false
    });

    global.MAJESTIOS_PROSPECTING_CONFIG = {
      qualibatProxyUrl:"https://qualification.example.test/check"
    };
    const qualificationCalls = [];
    global.fetch = async url => {
      qualificationCalls.push(String(url));
      return { ok:true, status:200, json:async()=>({ qualification:"à vérifier" }) };
    };
    const qualification = await resources.searchQualification("123 456 789 012 34");
    assert.equal(qualification.available, true);
    assert.equal(qualification.checkedCount, 1);
    assert.equal(qualification.successCount, 1);
    assert.equal(qualification.results[0].qualification, "à vérifier");
    assert.equal(new URL(qualificationCalls[0]).searchParams.get("siret"), "12345678901234");
  } finally {
    global.fetch = previousQualificationFetch;
    if (previousConfig === undefined) delete global.MAJESTIOS_PROSPECTING_CONFIG;
    else global.MAJESTIOS_PROSPECTING_CONFIG = previousConfig;
  }

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
