import { SEARCH_ERROR_CODES, SEARCH_ERROR_MESSAGES } from "./prospection-contract.mjs";
const STATUS = Object.freeze({INVALID_QUERY:400,INVALID_FILTERS:400,AUTH_REQUIRED:401,ACCESS_DENIED:403,RATE_LIMITED:429,SEARCH_TEMPORARILY_UNAVAILABLE:503,PARTIAL_RESULTS:200,METHOD_NOT_ALLOWED:405,PAYLOAD_TOO_LARGE:413,INTERNAL_ERROR:500});
const RETRYABLE = new Set(["RATE_LIMITED","SEARCH_TEMPORARILY_UNAVAILABLE","INTERNAL_ERROR"]);
export function createSearchError(code,requestId) {
  const safe = SEARCH_ERROR_CODES.includes(code) ? code : "INTERNAL_ERROR";
  return { status:STATUS[safe], body:{ ok:false, request_id:String(requestId||"request-unavailable").slice(0,128), error:{ code:safe, message:SEARCH_ERROR_MESSAGES[safe], retryable:RETRYABLE.has(safe) } } };
}
