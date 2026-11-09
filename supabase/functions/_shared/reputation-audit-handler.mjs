import { createAuditCase, normalizeEvidence, toAuditEvidenceDTO } from "./reputation-audit-core.mjs";
import { createOfficialCompanyIdentityAdapter, runReputationCollection, toReputationCollectionDTO } from "./reputation-audit-connectors.mjs";

const baseHeaders = Object.freeze({
  "Access-Control-Allow-Headers": "authorization, apikey, x-client-info, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "Vary": "Origin"
});

function isAllowedOrigin(origin) {
  return origin === "https://majestios.com" ||
    origin === "https://www.majestios.com" ||
    origin === "http://localhost:3000" ||
    origin === "http://127.0.0.1:3000" ||
    /^https:\/\/majestios-[a-z0-9-]+-majistr\.vercel\.app$/.test(origin);
}

function responseHeaders(req) {
  const origin = req.headers.get("Origin") || "";
  return isAllowedOrigin(origin) ? { ...baseHeaders, "Access-Control-Allow-Origin": origin } : baseHeaders;
}

function json(body, status = 200, req) {
  return new Response(JSON.stringify(body), { status, headers: responseHeaders(req) });
}

export function createReputationAuditHandler({ authenticate, fetchImpl = fetch, now = () => new Date().toISOString() } = {}) {
  if (typeof authenticate !== "function") throw new TypeError("AUDIT_AUTHENTICATOR_REQUIRED");
  return async function handleReputationAuditRequest(req) {
    if (req.method === "OPTIONS") return new Response("ok", { headers: responseHeaders(req) });
    if (req.headers.get("Origin") && !isAllowedOrigin(req.headers.get("Origin"))) {
      return json({ error: "Origine non autorisée." }, 403, req);
    }
    if (req.method !== "POST") return json({ error: "Méthode non autorisée." }, 405, req);

    const authorization = req.headers.get("Authorization") || "";
    const tokenMatch = authorization.match(/^Bearer\s+(.+)$/i);
    if (!tokenMatch) return json({ error: "Authentification requise." }, 401, req);

    let user;
    try { user = await authenticate(tokenMatch[1]); }
    catch { return json({ error: "Vérification de session temporairement indisponible." }, 503, req); }
    if (!user?.id) return json({ error: "Session invalide ou expirée." }, 401, req);

    const contentType = req.headers.get("Content-Type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return json({ error: "Le contenu doit être transmis au format JSON." }, 415, req);
    }

    let raw;
    try { raw = await req.text(); } catch { return json({ error: "Requête illisible." }, 400, req); }
    if (new TextEncoder().encode(raw).byteLength > 4096) return json({ error: "Requête trop volumineuse." }, 413, req);

    let input;
    try { input = JSON.parse(raw); } catch { return json({ error: "JSON invalide." }, 400, req); }
    const subject = typeof input?.subject === "string" ? input.subject.trim().slice(0, 180) : "";
    const siren = typeof input?.siren === "string" ? input.siren.trim() : "";
    if (subject.length < 2) return json({ error: "Le nom de l'entreprise doit contenir au moins deux caractères." }, 400, req);
    if (siren && !/^\d{9}$/.test(siren)) return json({ error: "Le SIREN doit contenir exactement neuf chiffres." }, 400, req);

    try {
      const auditCase = createAuditCase({ subject, siren });
      const adapter = createOfficialCompanyIdentityAdapter({ fetchImpl, now });
      const collection = await runReputationCollection({
        auditCase,
        requestedScopes: ["identity_context"],
        adapters: [adapter],
        normalizeEvidence
      });
      const dto = toReputationCollectionDTO(collection, toAuditEvidenceDTO);
      return json({
        ...dto,
        subject: auditCase.subject,
        scope: "identity_context",
        notice: "Cheexpeer a vérifié le contexte administratif disponible. Ces éléments ne constituent pas un audit ni un score de réputation en ligne."
      }, 200, req);
    } catch {
      return json({ error: "La collecte de contexte administratif n'a pas pu aboutir." }, 502, req);
    }
  };
}
