const PUBLIC_KEYS=new Set(["query"]), MEMBER_KEYS=new Set(["query","filters","page"]);
const FILTER_KEYS=new Set(["activity_codes","departments","regions","radius_km","location","workforce_bands","creation_after","creation_before","legal_forms","revenue_bands","labels"]);
const WORKFORCE=new Set(["0-2","3-5","6-9","10-19","20-49","50+"]);
const LABELS=new Set(["rge","qualiopi","epv","ess"]);
const DEPT=/^(\d{2}|2A|2B|97[1-6]|978|977|986|987|988)$/;
const ACTIVITY=/^\d{2}\.\d{2}[A-Z]$/;
const REGION=/^\d{2}$/;
const LEGAL_FORM=/^\d{4}$/;
function plain(value){if(!value||typeof value!=="object"||Array.isArray(value))return false;const p=Object.getPrototypeOf(value);return p===Object.prototype||p===null;}
function unknown(object,allowed){return Object.keys(object).some(k=>!allowed.has(k));}
function queryValue(value,required){
  if(value==null&&!required)return {ok:true,value:""};
  if(typeof value!=="string")return {ok:false,code:"INVALID_QUERY"};
  const q=value.trim().replace(/\s+/g," ");
  if(((required||q.length>0)&&q.length<2)||q.length>120)return {ok:false,code:"INVALID_QUERY"};
  return {ok:true,value:q};
}
function stringArray(value,maxItems,maxLength){
  if(!Array.isArray(value)||value.length>maxItems)return null;
  const out=[];
  for(const item of value){if(typeof item!=="string")return null;const s=item.trim();if(!s||s.length>maxLength)return null;if(!out.includes(s))out.push(s);}
  return out;
}
function date(value){return typeof value==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&!Number.isNaN(Date.parse(value+"T00:00:00Z"))&&new Date(value+"T00:00:00Z").toISOString().slice(0,10)===value;}
export function validatePublicDirectorySearch(input){
  if(!plain(input)||unknown(input,PUBLIC_KEYS))return {ok:false,code:"INVALID_FILTERS"};
  const q=queryValue(input.query,true);return q.ok?{ok:true,value:{query:q.value}}:q;
}
export function validateMemberSearch(input){
  if(!plain(input)||unknown(input,MEMBER_KEYS))return {ok:false,code:"INVALID_FILTERS"};
  const q=queryValue(input.query,false);if(!q.ok)return q;
  const source=input.filters==null?{}:input.filters;
  if(!plain(source)||unknown(source,FILTER_KEYS))return {ok:false,code:"INVALID_FILTERS"};
  const filters={};
  for(const key of ["activity_codes","departments","regions","workforce_bands","legal_forms","revenue_bands","labels"]){
    if(source[key]===undefined)continue;
    const values=stringArray(source[key],20,key==="regions"?80:60);if(!values)return {ok:false,code:"INVALID_FILTERS"};
    if(key==="activity_codes"&&values.some(v=>!ACTIVITY.test(v)))return {ok:false,code:"INVALID_FILTERS"};
    if(key==="departments"&&values.some(v=>!DEPT.test(v)))return {ok:false,code:"INVALID_FILTERS"};
    if(key==="regions"&&values.some(v=>!REGION.test(v)))return {ok:false,code:"INVALID_FILTERS"};
    if(key==="workforce_bands"&&values.some(v=>!WORKFORCE.has(v)))return {ok:false,code:"INVALID_FILTERS"};
    if(key==="legal_forms"&&values.some(v=>!LEGAL_FORM.test(v)))return {ok:false,code:"INVALID_FILTERS"};
    if(key==="labels"&&values.some(v=>!LABELS.has(v.toLowerCase())))return {ok:false,code:"INVALID_FILTERS"};
    if(key==="revenue_bands"&&values.length)return {ok:false,code:"INVALID_FILTERS"};
    filters[key]=key==="labels"?values.map(v=>v.toLowerCase()):values;
  }
  for(const key of ["creation_after","creation_before"]){
    if(source[key]===undefined||source[key]===null||source[key]==="")continue;
    if(!date(source[key]))return {ok:false,code:"INVALID_FILTERS"};filters[key]=source[key];
  }
  if(filters.creation_after&&filters.creation_before&&filters.creation_after>filters.creation_before)return {ok:false,code:"INVALID_FILTERS"};
  if(source.location!==undefined){
    if(typeof source.location!=="string"||source.location.trim().length<2||source.location.trim().length>100)return {ok:false,code:"INVALID_FILTERS"};
    filters.location=source.location.trim().replace(/\s+/g," ");
  }
  if(source.radius_km!==undefined){
    if(typeof source.radius_km!=="number"||!Number.isFinite(source.radius_km)||source.radius_km<1||source.radius_km>50)return {ok:false,code:"INVALID_FILTERS"};
    filters.radius_km=source.radius_km;
  }
  if(Boolean(filters.location)!==Boolean(filters.radius_km))return {ok:false,code:"INVALID_FILTERS"};
  if(filters.radius_km&&(!filters.activity_codes?.length||q.value||filters.departments?.length||filters.regions?.length||filters.workforce_bands?.length||filters.legal_forms?.length||filters.labels?.length))return {ok:false,code:"INVALID_FILTERS"};
  if(/^\d{9}$|^\d{14}$/.test(q.value)&&Object.keys(filters).length)return {ok:false,code:"INVALID_FILTERS"};
  const hasSelector=Boolean(q.value)||Boolean(filters.activity_codes?.length)||Boolean(filters.departments?.length)||Boolean(filters.regions?.length)||Boolean(filters.radius_km);
  if(!hasSelector)return {ok:false,code:"INVALID_QUERY"};
  let page={number:1,size:10};
  if(input.page!==undefined){
    if(!plain(input.page)||unknown(input.page,new Set(["number","size"])))return {ok:false,code:"INVALID_FILTERS"};
    const number=input.page.number===undefined?1:input.page.number,size=input.page.size===undefined?10:input.page.size;
    if(!Number.isInteger(number)||number<1||number>50||!Number.isInteger(size)||size!==10)return {ok:false,code:"INVALID_FILTERS"};
    page={number,size:10};
  }
  return {ok:true,value:{query:q.value,filters,page}};
}
