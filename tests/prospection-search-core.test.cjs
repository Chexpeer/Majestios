"use strict";
const assert=require("node:assert/strict");
async function main(){
  const validation=await import("../supabase/functions/_shared/prospection-validation.mjs");
  const core=await import("../supabase/functions/_shared/prospection-search-core.mjs");
  const contract=await import("../supabase/functions/_shared/prospection-contract.mjs");

  const valid=validation.validateMemberSearch({
    query:"électricité",
    filters:{activity_codes:["43.21A"],departments:["72"],regions:["52"],workforce_bands:["0-2","3-5","10-19"],legal_forms:["5499"],labels:["RGE"]},
    page:{number:2,size:10}
  });
  assert.equal(valid.ok,true);
  const url=await core.buildMemberSearchUrl(valid.value,async()=>{throw new Error("geocode not expected");});
  assert.equal(url.hostname,"recherche-entreprises.api.gouv.fr");
  assert.equal(url.pathname,"/search");
  assert.equal(url.searchParams.get("q"),"électricité");
  assert.equal(url.searchParams.get("activite_principale"),"43.21A");
  assert.equal(url.searchParams.get("departement"),"72");
  assert.equal(url.searchParams.get("region"),"52");
  assert.equal(url.searchParams.get("tranche_effectif_salarie"),"00,01,02,11");
  assert.equal(url.searchParams.get("nature_juridique"),"5499");
  assert.equal(url.searchParams.get("est_rge"),"true");
  assert.equal(url.searchParams.get("page"),"2");
  assert.equal(url.searchParams.get("per_page"),"10");
  assert.equal(url.searchParams.get("include"),"siege,finances");

  for(const body of [
    {query:"foo",filters:{revenue_bands:["100k-500k"]}},
    {query:"foo",filters:{labels:["unknown"]}},
    {query:"foo",filters:{regions:["pays-de-la-loire"]}},
    {query:"",filters:{departments:["72"],radius_km:5}},
    {query:"foo",filters:{activity_codes:["43.21A"],radius_km:5,location:"Le Mans"}},
    {filters:{activity_codes:["43.21A"],radius_km:5,location:"Le Mans",workforce_bands:["3-5"]}},
    {filters:{activity_codes:["43.21A"],radius_km:5,location:"Le Mans",legal_forms:["5499"]}},
    {filters:{activity_codes:["43.21A"],radius_km:5,location:"Le Mans",labels:["rge"]}},
    {query:"123456789",filters:{departments:["72"]}},
    {query:"",filters:{workforce_bands:["0-2"]}}
  ]) assert.equal(validation.validateMemberSearch(body).ok,false);

  const radiusCriteria=validation.validateMemberSearch({
    filters:{activity_codes:["43.21A"],radius_km:12,location:"Le Mans"}
  });
  assert.equal(radiusCriteria.ok,true);
  const radiusCalls=[];
  const radiusUrl=await core.buildMemberSearchUrl(radiusCriteria.value,async(url)=>{
    radiusCalls.push(url);
    return {ok:true,json:async()=>[{nom:"Le Mans",centre:{coordinates:[0.1996,48.0061]}}]};
  });
  assert.equal(radiusUrl.pathname,"/near_point");
  assert.equal(radiusUrl.searchParams.get("lat"),"48.0061");
  assert.equal(radiusUrl.searchParams.get("long"),"0.1996");
  assert.equal(radiusUrl.searchParams.get("radius"),"12");
  assert.equal(radiusCalls.length,1);

  const fixture=Array.from({length:12},(_,i)=>({
    siren:String(100000000+i),
    nom_complet:"Entreprise "+i,
    etat_administratif:"A",
    activite_principale:"43.21A",
    nature_juridique:"5499",
    date_creation:i<2?"2018-01-01":"2022-03-15",
    tranche_effectif_salarie:"02",
    siege:{siret:String(10000000000000+i),code_postal:"72000",libelle_commune:"Le Mans",departement:"72"}
  }));
  let capturedUrl="";
  const result=await core.executeMemberSearch({
    criteria:validation.validateMemberSearch({filters:{activity_codes:["43.21A"]},page:{number:1,size:10}}).value,
    now:()=>"2026-11-08T11:00:00.000Z",
    fetchImpl:async(url)=>{capturedUrl=url;return {ok:true,status:200,json:async()=>({results:fixture,total_pages:2,total_results:22})};}
  });
  assert.equal(new URL(capturedUrl).searchParams.get("activite_principale"),"43.21A");
  assert.equal(result.items.length,10);
  assert.equal(result.page.has_more,true);
  assert.equal(result.items[0].name,"Entreprise 0");
  assert.equal(result.items[0].siret,"10000000000000");
  assert.equal(result.items[0].workforce_band,"3 à 5 salariés");
  assert.equal(result.items[0].last_verified_at,"2026-11-08T11:00:00.000Z");
  assert.deepEqual(contract.findForbiddenDtoFields(result),[]);

  const ordinaryLastPage=await core.executeMemberSearch({
    criteria:validation.validateMemberSearch({filters:{activity_codes:["43.21A"]},page:{number:2,size:10}}).value,
    fetchImpl:async()=>({ok:true,status:200,json:async()=>({results:fixture.slice(0,2),total_pages:2})})
  });
  assert.equal(ordinaryLastPage.page.has_more,false);

  const dated=await core.executeMemberSearch({
    criteria:validation.validateMemberSearch({filters:{activity_codes:["43.21A"],creation_after:"2020-01-01"}}).value,
    fetchImpl:async()=>({ok:true,status:200,json:async()=>({results:fixture,total_pages:3})})
  });
  assert.equal(dated.items.length,10);
  assert.equal(dated.items.some(item=>item.name==="Entreprise 0"),false);
  assert.equal(dated.partial,false);

  const pagedFixture=(page)=>Array.from({length:10},(_,i)=>({
    siren:String(200000000+(page-1)*10+i),
    nom_complet:"Page "+page+" entreprise "+i,
    etat_administratif:"A",
    activite_principale:"43.21A",
    nature_juridique:"5499",
    date_creation:page===1&&i<8?"2018-01-01":"2022-03-15",
    tranche_effectif_salarie:"02",
    siege:{siret:String(20000000000000+(page-1)*10+i),code_postal:"72000",libelle_commune:"Le Mans",departement:"72"}
  }));
  const pagedCalls=[];
  const paged=await core.executeMemberSearch({
    criteria:validation.validateMemberSearch({filters:{activity_codes:["43.21A"],creation_after:"2020-01-01"}}).value,
    fetchImpl:async(url)=>{const page=Number(new URL(url).searchParams.get("page"));pagedCalls.push(page);return {ok:true,status:200,json:async()=>({results:pagedFixture(page),total_pages:2})};}
  });
  assert.deepEqual(pagedCalls,[1,2]);
  assert.equal(paged.items.length,10);
  assert.equal(paged.items[0].name,"Page 1 entreprise 8");
  assert.equal(paged.items[2].name,"Page 2 entreprise 0");
  assert.equal(paged.page.has_more,true);
  assert.equal(paged.partial,false);

  const secondPage=await core.executeMemberSearch({
    criteria:validation.validateMemberSearch({filters:{activity_codes:["43.21A"],creation_after:"2020-01-01"},page:{number:2,size:10}}).value,
    fetchImpl:async(url)=>{const page=Number(new URL(url).searchParams.get("page"));return {ok:true,status:200,json:async()=>({results:pagedFixture(page),total_pages:2})};}
  });
  assert.equal(secondPage.items.length,2);
  assert.equal(secondPage.items[0].name,"Page 2 entreprise 8");
  assert.equal(secondPage.page.has_more,false);

  let cappedCalls=0;
  const capped=await core.executeMemberSearch({
    criteria:validation.validateMemberSearch({filters:{activity_codes:["43.21A"],creation_after:"2020-01-01"}}).value,
    fetchImpl:async()=>{cappedCalls++;return {ok:true,status:200,json:async()=>({results:pagedFixture(1).map(row=>({...row,date_creation:"2018-01-01"})),total_pages:7})};}
  });
  assert.equal(cappedCalls,5);
  assert.equal(capped.partial,true);
  assert.equal(capped.page.has_more,true);

  await assert.rejects(()=>core.executeMemberSearch({
    criteria:valid.value,
    fetchImpl:async()=>({ok:false,status:429})
  }),error=>error.code==="RATE_LIMITED");
  await assert.rejects(()=>core.executeMemberSearch({
    criteria:valid.value,
    fetchImpl:async()=>({ok:false,status:503})
  }),error=>error.code==="SEARCH_TEMPORARILY_UNAVAILABLE");

  console.log("Tests endpoint Prospection membre : OK");
}
main().catch(error=>{console.error(error);process.exitCode=1;});
