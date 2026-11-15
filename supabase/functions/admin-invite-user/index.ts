import { createClient } from "npm:@supabase/supabase-js@2.119.0";
import { inviteUser } from "../_shared/invitation-core.mjs";

const allowedOrigins = [
  "https://majestios.com",
  "https://www.majestios.com",
  "https://majestios-jc8g-cqy7hpelc-majistr.vercel.app",
  "https://majestios-git-test-ecriture-claude-majistr.vercel.app",
  ...((Deno.env.get("ALLOWED_ORIGINS") ?? "").split(",").map((o) => o.trim()).filter(Boolean)),
];
const isAllowedOrigin = (origin: string | null) => !origin || allowedOrigins.includes(origin);
function corsHeaders(origin: string | null): HeadersInit {
  return {
    ...(origin && isAllowedOrigin(origin) ? { "Access-Control-Allow-Origin": origin, "Vary": "Origin" } : {}),
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json; charset=utf-8",
  };
}
const reply = (status: number, body: Record<string, unknown>, origin: string | null) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders(origin) });

Deno.serve(async (request: Request) => {
  const origin = request.headers.get("Origin");
  if (origin && !isAllowedOrigin(origin)) return reply(403, { error: "Origine non autorisée." }, null);
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin) });
  if (request.method !== "POST") return reply(405, { error: "Méthode non autorisée." }, origin);
  if (!origin) return reply(400, { error: "Origine requise." }, null);
  const token = (request.headers.get("Authorization") ?? "").match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return reply(401, { error: "Authentification requise." }, origin);
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!url || !serviceKey || !anonKey) return reply(500, { error: "Configuration serveur incomplète." }, origin);
  const opts = { auth: { persistSession: false, autoRefreshToken: false } };
  const adminClient = createClient(url, serviceKey, opts);
  const anonClient = createClient(url, anonKey, opts);
  const userClient = createClient(url, anonKey, { ...opts, global: { headers: { Authorization: `Bearer ${token}` } } });
  const { data, error } = await adminClient.auth.getUser(token);
  if (error || !data.user) return reply(401, { error: "Session invalide ou expirée." }, origin);
  let body: Record<string, unknown> = {};
  try { body = await request.json(); } catch { return reply(400, { error: "Corps de requête invalide." }, origin); }
  try {
    const result = await inviteUser({ body, userClient, adminClient, anonClient, origin });
    return reply(result.status, result.body, origin);
  } catch (e) {
    console.error("admin-invite-user failed:", (e as Error).message);
    return reply(500, { error: "L'invitation n'a pas pu être créée." }, origin);
  }
});
