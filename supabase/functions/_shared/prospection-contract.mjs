export const SEARCH_ERROR_CODES = Object.freeze(["INVALID_QUERY","INVALID_FILTERS","AUTH_REQUIRED","ACCESS_DENIED","RATE_LIMITED","SEARCH_TEMPORARILY_UNAVAILABLE","PARTIAL_RESULTS","METHOD_NOT_ALLOWED","PAYLOAD_TOO_LARGE","INTERNAL_ERROR"]);
export const SEARCH_ERROR_MESSAGES = Object.freeze({
  INVALID_QUERY:"Le terme de recherche est absent ou invalide.",
  INVALID_FILTERS:"Un ou plusieurs critères ne sont pas autorisés ou sont invalides.",
  AUTH_REQUIRED:"Une authentification valide est nécessaire.",
  ACCESS_DENIED:"Vous ne disposez pas des droits nécessaires pour cette recherche.",
  RATE_LIMITED:"La limite de recherches autorisée est atteinte. Réessayez ultérieurement.",
  SEARCH_TEMPORARILY_UNAVAILABLE:"La recherche est momentanément indisponible.",
  PARTIAL_RESULTS:"La recherche n'a retourné qu'une partie des résultats attendus.",
  METHOD_NOT_ALLOWED:"Cette méthode de requête n\u0027est pas autorisée.",
  PAYLOAD_TOO_LARGE:"La requête dépasse la taille autorisée.",
  INTERNAL_ERROR:"Une erreur interne empêche de traiter la recherche."
});
export const MEMBER_ROLES = Object.freeze(["owner","admin","member"]);
export const FORBIDDEN_DTO_KEYS = Object.freeze(["source","source_name","provider","authority","connector","source_id","source_url","provider_url","raw","payload","upstream","debug","response","sourceurl","sourceid","collectedat","requests","fetchedat","upstream_status"]);
const forbidden = new Set(FORBIDDEN_DTO_KEYS);
function clean(value,max) {
  if (typeof value !== "string") return undefined;
  const text = value.trim();
  return text && text.length <= max ? text : undefined;
}
function validDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z)?$/.test(value) && !Number.isNaN(Date.parse(value));
}
function projectAddress(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const out = {};
  const postal = clean(value.postal_code,5), city = clean(value.city,100), dept = clean(value.department,3);
  if (postal && /^\d{5}$/.test(postal)) out.postal_code = postal;
  if (city) out.city = city;
  if (dept && /^(\d{2}|2A|2B|97[1-6]|978|977|986|987|988)$/.test(dept)) out.department = dept;
  return Object.keys(out).length ? out : undefined;
}
/** Projection positive : aucun champ amont n'est propagé. */
export function toDirectoryCompanyDTO(row) {
  if (!row || typeof row !== "object" || Array.isArray(row)) return null;
  const id = clean(row.id,128), name = clean(row.name,200);
  if (!id || !name) return null;
  const dto = { id, name };
  const siren = clean(row.siren,9), activity = clean(row.activity_label,200);
  if (siren && /^\d{9}$/.test(siren)) dto.siren = siren;
  if (activity) dto.activity_label = activity;
  if (["active","inactive","unknown"].includes(row.legal_status)) dto.legal_status = row.legal_status;
  const address = projectAddress(row.address);
  if (address) dto.address = address;
  return dto;
}
export function toMemberCompanyDTO(row) {
  const base = toDirectoryCompanyDTO(row);
  if (!base) return null;
  const dto = { ...base };
  const siret = clean(row.siret,14), trade = clean(row.trade_name,200), activity = clean(row.activity_code,6);
  const legal = clean(row.legal_form,120), creation = clean(row.creation_date,10), workforce = clean(row.workforce_band,40);
  if (siret && /^\d{14}$/.test(siret)) dto.siret = siret;
  if (trade) dto.trade_name = trade;
  if (activity && /^\d{2}\.\d{2}[A-Z]$/.test(activity)) dto.activity_code = activity;
  if (legal) dto.legal_form = legal;
  if (creation && validDate(creation)) dto.creation_date = creation;
  if (workforce) dto.workforce_band = workforce;
  if (row.qualification && typeof row.qualification === "object" && !Array.isArray(row.qualification)) {
    const score = row.qualification.score;
    const reasons = Array.isArray(row.qualification.reasons) ? row.qualification.reasons.map(x=>clean(x,180)).filter(Boolean).slice(0,10) : [];
    dto.qualification = { score:Number.isFinite(score)?Math.max(0,Math.min(100,Math.round(score))):null, label:clean(row.qualification.label,100)||"à examiner", reasons };
  }
  if (validDate(row.last_verified_at)) dto.last_verified_at = row.last_verified_at;
  return dto;
}
export function findForbiddenDtoFields(value,path="$",found=[]) {
  if (!value || typeof value !== "object") return found;
  if (Array.isArray(value)) { value.forEach((v,i)=>findForbiddenDtoFields(v,path+"["+i+"]",found)); return found; }
  for (const [key,child] of Object.entries(value)) {
    const normalized=key.toLowerCase().replace(/[-\s]/g,"_");
    if (forbidden.has(normalized)) found.push(path+"."+key);
    findForbiddenDtoFields(child,path+"."+key,found);
  }
  return found;
}
