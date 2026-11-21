import { createClient } from "npm:@supabase/supabase-js@2.119.0";
import { resolveProspectionAccess } from "../_shared/prospection-authz.mjs";
import { validateMemberSearch } from "../_shared/prospection-validation.mjs";
import { createSearchError } from "../_shared/prospection-errors.mjs";
import { ProspectionSearchError, executeMemberSearch } from "../_shared/prospection-search-core.mjs";

const staticOrigins = new Set([
  "https://majestios.com",
  "https://www.majestios.com",
  "https://majestios-jc8g-cqy7hpelc-majistr.vercel.app"
]);
function allowedOrigin(origin: string | null): boolean {
  if (!origin) return true;
  const configured=(Deno.env.get("ALLOWED_ORIGINS")??"").split(",").map(value=>value.trim()).filter(Boolean);
  return staticOrigins.has(origin)||configured.includes(origin)||/^https:\/\/majestios-[a-z0-9-]+-majistr\.vercel\.app$/.test(origin);
}
function responseHeaders(origin: string | null): Headers {
  const result=new Headers({
    "Content-Type":"application/json; charset=utf-8",
    "Cache-Control":"no-store",
    "Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods":"POST, OPTIONS",
    "Access-Control-Max-Age":"86400"
  });
  if(origin&&allowedOrigin(origin)){result.set("Access-Control-Allow-Origin",origin);result.set("Vary","Origin");}
  return result;
}
function respond(status: number, body: unknown, origin: string | null): Response {
  return new Response(JSON.stringify(body),{status,headers:responseHeaders(origin)});
}
function errorResponse(code: string, requestId: string, origin: string | null): Response {
  const result=createSearchError(code,requestId);
  return respond(result.status,result.body,origin);
}
function publishableKey(): string | null {
  const raw=Deno.env.get("SUPABASE_PUBLISHABLE_KEYS");
  if(raw){
    try {const keys=JSON.parse(raw);if(typeof keys?.default==="string")return keys.default;} catch {return null;}
  }
  return Deno.env.get("SUPABASE_ANON_KEY")??null;
}

Deno.serve(async (request: Request) => {
  const origin=request.headers.get("Origin");
  const requestId=crypto.randomUUID();
  if(origin&&!allowedOrigin(origin)) return respond(403,{ok:false,request_id:requestId,error:{code:"ACCESS_DENIED",message:"Origine non autorisée.",retryable:false}},null);
  if(request.method==="OPTIONS") return new Response(null,{status:204,headers:responseHeaders(origin)});
  if(request.method!=="POST") return errorResponse("METHOD_NOT_ALLOWED",requestId,origin);

  const authorization=request.headers.get("Authorization")??"";
  const token=authorization.match(/^Bearer\s+(.+)$/i)?.[1];
  if(!token) return errorResponse("AUTH_REQUIRED",requestId,origin);

  const supabaseUrl=Deno.env.get("SUPABASE_URL");
  const key=publishableKey();
  if(!supabaseUrl||!key) return errorResponse("INTERNAL_ERROR",requestId,origin);
  let userClient;
  try {
    userClient=createClient(supabaseUrl,key,{
      global:{headers:{Authorization:authorization}},
      auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}
    });
  } catch {return errorResponse("INTERNAL_ERROR",requestId,origin);}

  const access=await resolveProspectionAccess({token,userClient,requireConfirmedEmail:true});
  if(!access.ok) return errorResponse(access.code,requestId,origin);

  const contentType=request.headers.get("Content-Type")??"";
  if(!/^application\/json(?:\s*;|$)/i.test(contentType)) return errorResponse("INVALID_FILTERS",requestId,origin);
  const declaredLength=Number(request.headers.get("Content-Length")??"0");
  if(declaredLength>16384) return errorResponse("PAYLOAD_TOO_LARGE",requestId,origin);
  let textBody: string;
  try {textBody=await request.text();} catch {return errorResponse("INVALID_FILTERS",requestId,origin);}
  if(new TextEncoder().encode(textBody).byteLength>16384) return errorResponse("PAYLOAD_TOO_LARGE",requestId,origin);
  let input: unknown;
  try {input=JSON.parse(textBody);} catch {return errorResponse("INVALID_FILTERS",requestId,origin);}

  const validation=validateMemberSearch(input);
  if(!validation.ok) return errorResponse(validation.code,requestId,origin);

  try {
    const result=await executeMemberSearch({criteria:validation.value});
    return respond(200,{
      ok:true,
      request_id:requestId,
      items:result.items,
      page:result.page,
      partial:result.partial
    },origin);
  } catch(error) {
    const code=error instanceof ProspectionSearchError?error.code:"INTERNAL_ERROR";
    return errorResponse(code,requestId,origin);
  }
});
