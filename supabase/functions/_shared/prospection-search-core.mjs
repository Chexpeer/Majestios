import { toMemberCompanyDTO } from "./prospection-contract.mjs";

export class ProspectionSearchError extends Error {
  constructor(code) { super(code); this.name = "ProspectionSearchError"; this.code = code; }
}

const API_BASE = "https://recherche-entreprises.api.gouv.fr";
const GEO_BASE = "https://geo.api.gouv.fr/communes";
const WORKFORCE_CODES = Object.freeze({
  "0-2":["00","01"], "3-5":["02"], "6-9":["03"], "10-19":["11"],
  "20-49":["12"], "50+":["21","22","31","32","41","42","51","52","53"]
});
const WORKFORCE_LABELS = Object.freeze({
  "00":"0 salarié","01":"1 à 2 salariés","02":"3 à 5 salariés","03":"6 à 9 salariés",
  "11":"10 à 19 salariés","12":"20 à 49 salariés","21":"50 à 99 salariés","22":"100 à 199 salariés",
  "31":"200 à 249 salariés","32":"250 à 499 salariés","41":"500 à 999 salariés","42":"1 000 à 1 999 salariés",
  "51":"2 000 à 4 999 salariés","52":"5 000 à 9 999 salariés","53":"10 000 salariés et plus"
});
const LABEL_PARAMS = Object.freeze({rge:"est_rge",qualiopi:"est_qualiopi",epv:"est_patrimoine_vivant",ess:"est_ess"});
const MAX_LOCAL_FILTER_UPSTREAM_PAGES = 5;

function appendCommonFilters(params, filters) {
  if (filters.activity_codes?.length) params.set("activite_principale", filters.activity_codes.join(","));
  if (filters.departments?.length) params.set("departement", filters.departments.join(","));
  if (filters.regions?.length) params.set("region", filters.regions.join(","));
  if (filters.workforce_bands?.length) {
    const codes=[...new Set(filters.workforce_bands.flatMap(band=>WORKFORCE_CODES[band]||[]))];
    if(codes.length) params.set("tranche_effectif_salarie",codes.join(","));
  }
  if (filters.legal_forms?.length) params.set("nature_juridique",filters.legal_forms.join(","));
  for(const label of filters.labels||[]) if(LABEL_PARAMS[label]) params.set(LABEL_PARAMS[label],"true");
}

async function geocode(location, fetchImpl) {
  const isPostal=/^\d{5}$/.test(location);
  const url=new URL(GEO_BASE);
  if(isPostal) url.searchParams.set("codePostal",location);
  else {url.searchParams.set("nom",location);url.searchParams.set("boost","population");url.searchParams.set("limit","10");}
  url.searchParams.set("fields","nom,code,codeDepartement,centre");
  url.searchParams.set("format","json");
  let response;
  try {
    response=await fetchImpl(url.toString(),{
      headers:{Accept:"application/json","User-Agent":"MajestiOS/1.0 (recherche commerciale; https://majestios.com)"},
      signal:AbortSignal.timeout(10000)
    });
  } catch { throw new ProspectionSearchError("SEARCH_TEMPORARILY_UNAVAILABLE"); }
  if(!response.ok) throw new ProspectionSearchError(response.status===429?"RATE_LIMITED":"SEARCH_TEMPORARILY_UNAVAILABLE");
  let matches;
  try{matches=await response.json();}catch{throw new ProspectionSearchError("SEARCH_TEMPORARILY_UNAVAILABLE");}
  if(!Array.isArray(matches)||!matches.length) throw new ProspectionSearchError("INVALID_FILTERS");
  const match=matches.find(item=>Array.isArray(item?.centre?.coordinates)&&item.centre.coordinates.length===2);
  if(!match) throw new ProspectionSearchError("INVALID_FILTERS");
  const longitude=Number(match.centre.coordinates[0]),latitude=Number(match.centre.coordinates[1]);
  if(!Number.isFinite(latitude)||!Number.isFinite(longitude)) throw new ProspectionSearchError("INVALID_FILTERS");
  return {latitude,longitude};
}

export async function buildMemberSearchUrl(criteria, fetchImpl=fetch) {
  const {query,filters,page}=criteria;
  const url=new URL(filters.radius_km?API_BASE+"/near_point":API_BASE+"/search");
  if(filters.radius_km){
    const center=await geocode(filters.location,fetchImpl);
    url.searchParams.set("lat",String(center.latitude));
    url.searchParams.set("long",String(center.longitude));
    url.searchParams.set("radius",String(filters.radius_km));
    if(filters.activity_codes?.length) url.searchParams.set("activite_principale",filters.activity_codes.join(","));
  } else {
    if(query) url.searchParams.set("q",query);
    appendCommonFilters(url.searchParams,filters);
  }
  url.searchParams.set("page",String(page.number));
  url.searchParams.set("per_page","10");
  url.searchParams.set("minimal","true");
  url.searchParams.set("include","siege,finances");
  return url;
}

function creationMatches(record,filters) {
  if(!filters.creation_after&&!filters.creation_before) return true;
  const raw=typeof record.date_creation==="string"?record.date_creation:"";
  if(!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return false;
  if(filters.creation_after&&raw<filters.creation_after) return false;
  if(filters.creation_before&&raw>filters.creation_before) return false;
  return true;
}

function normalizeOfficialRecord(record,verifiedAt) {
  const headquarters=record?.siege&&typeof record.siege==="object"?record.siege:{};
  const siren=String(record?.siren??"").replace(/\D/g,"");
  const siret=String(headquarters.siret??"").replace(/\D/g,"");
  const workforceCode=String(record?.tranche_effectif_salarie??"");
  const activity=String(record?.activite_principale??"");
  return {
    id:siren.length===9?siren:siret,
    siren,
    siret,
    name:record?.nom_complet??record?.nom_raison_sociale??record?.denomination??"",
    trade_name:record?.nom_commercial??"",
    activity_label:record?.libelle_activite_principale??record?.activite_principale_libelle??"",
    activity_code:activity,
    legal_status:record?.etat_administratif==="A"?"active":record?.etat_administratif==="C"?"inactive":"unknown",
    legal_form:String(record?.nature_juridique??""),
    creation_date:String(record?.date_creation??""),
    workforce_band:WORKFORCE_LABELS[workforceCode]??(workforceCode||""),
    address:{
      postal_code:headquarters.code_postal??"",
      city:headquarters.libelle_commune??headquarters.commune??"",
      department:headquarters.departement??""
    },
    last_verified_at:verifiedAt
  };
}

async function fetchSearchPage(url,fetchImpl) {
  let response;
  try {
    response=await fetchImpl(url.toString(),{
      method:"GET",
      headers:{Accept:"application/json","User-Agent":"MajestiOS/1.0 (recherche commerciale; https://majestios.com)"},
      signal:AbortSignal.timeout(10000)
    });
  } catch { throw new ProspectionSearchError("SEARCH_TEMPORARILY_UNAVAILABLE"); }
  if(response.status===429) throw new ProspectionSearchError("RATE_LIMITED");
  if(!response.ok) throw new ProspectionSearchError("SEARCH_TEMPORARILY_UNAVAILABLE");
  let payload;
  try{payload=await response.json();}catch{throw new ProspectionSearchError("SEARCH_TEMPORARILY_UNAVAILABLE");}
  if(!payload||!Array.isArray(payload.results)) throw new ProspectionSearchError("SEARCH_TEMPORARILY_UNAVAILABLE");
  return payload;
}

export async function executeMemberSearch({criteria,fetchImpl=fetch,now=()=>new Date().toISOString()}) {
  const dateFilter=Boolean(criteria.filters.creation_after||criteria.filters.creation_before);
  const requestedPage=criteria.page.number;
  const offset=(requestedPage-1)*10;
  const verifiedAt=now();
  let filtered=[];
  let totalPages=1;
  let scannedPages=0;
  let scanCapped=false;

  if(!dateFilter) {
    const url=await buildMemberSearchUrl(criteria,fetchImpl);
    const payload=await fetchSearchPage(url,fetchImpl);
    totalPages=Number.isInteger(payload.total_pages)?payload.total_pages:1;
    filtered=payload.results.filter(record=>creationMatches(record,criteria.filters));
    scannedPages=1;
  } else {
    // Les dates sont filtrées après réception : reconstruire les pages logiques
    // depuis la première page amont évite de sauter des résultats entre pages.
    const scanLimit=MAX_LOCAL_FILTER_UPSTREAM_PAGES;
    for(let upstreamPage=1;upstreamPage<=scanLimit;upstreamPage++) {
      const pageCriteria={...criteria,page:{...criteria.page,number:upstreamPage}};
      const url=await buildMemberSearchUrl(pageCriteria,fetchImpl);
      const payload=await fetchSearchPage(url,fetchImpl);
      scannedPages=upstreamPage;
      totalPages=Number.isInteger(payload.total_pages)?Math.max(1,payload.total_pages):1;
      filtered.push(...payload.results.filter(record=>creationMatches(record,criteria.filters)));
      if(filtered.length>=offset+10||upstreamPage>=totalPages) break;
      if(upstreamPage===scanLimit) scanCapped=true;
    }
    if(scannedPages===scanLimit&&scannedPages<totalPages&&filtered.length<offset+10) scanCapped=true;
  }

  const window=filtered.slice(offset,offset+10);
  const items=window.map(record=>toMemberCompanyDTO(normalizeOfficialRecord(record,verifiedAt))).filter(Boolean);
  const hasMore=filtered.length>offset+10||scannedPages<totalPages||scanCapped;
  return {items,page:{number:requestedPage,size:10,has_more:hasMore},partial:dateFilter&&scanCapped};
}
