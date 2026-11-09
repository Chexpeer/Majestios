import { createAuditCase, normalizeEvidence, toAuditEvidenceDTO } from "./reputation-audit-core.mjs";
import { createOfficialCompanyIdentityAdapter, runReputationCollection, toReputationCollectionDTO } from "./reputation-audit-connectors.mjs";

const corsHeaders = Object.freeze({
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, x-client-info, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store"
});

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

export function createReputationAuditHandler({ authenticate, fetchImpl = fetch, now = () => new Date().toISOString() } = {}) {
  if (typeof authenticate !== "function") throw new TypeError("AUDIT_AUTHENTICATOR_REQUIRED");
  return async function handleReputationAuditRequest(req) {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
    if (req.method !== "POST") return json({ error: "Méthode non autorisée." }, 405);

    const authorization = req.headers.get("Authorization") || "";
    const tokenMatch = authorization.match(/^Bearer\s+(.+)$/i);
    if (!tokenMatch) return json({ error: "Authentification requise." }, 401);

    let user;
    try { user = await authenticate(tokenMatch[1]); }
    catch { return json({ error: "Vérification de session temporairement indisponible." }, 503); }
    if (!user?.id) return json({ error: "Session invalide ou expirée." }, 401);

    const contentType = req.headers.get("Content-Type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return json({ error: "Le contenu doit être transmis au format JSON." }, 415);
    }

    let raw;
    try { raw = await req.text(); } catch { return json({ error: "Requête illisible." }, 400); }
    if (new TextEncoder().encode(raw).byteLength > 4096) return json({ error: "Requête trop volumineuse." }, 413);

    let input;
    try { input = JSON.parse(raw); } catch { return json({ error: "JSON invalide." }, 400); }
    const subject = typeof input?.subject === "string" ? input.subject.trim().slice(0, 180) : "";
    const siren = typeof input?.siren === "string" ? input.siren.trim() : "";
    if (subject.length < 2) return json({ error: "Le nom de l'entreprise doit contenir au moins deux caractères." }, 400);
    if (siren && !/^\d{9}$/.test(siren)) return json({ error: "Le SIREN doit contenir exactement neuf chiffres." }, 400);

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
      });
    } catch {
      return json({ error: "La collecte de contexte administratif n'a pas pu aboutir." }, 502);
    }
  };
}
