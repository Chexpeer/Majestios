import { createAuditCase, normalizeEvidence, toAuditEvidenceDTO } from "./reputation-audit-core.mjs";
import { createOfficialCompanyIdentityAdapter, createBodaccLegalEventsAdapter, runReputationCollection, toReputationCollectionDTO } from "./reputation-audit-connectors.mjs";
import { runCheexpeerAuditAnalysis } from "./reputation-audit-analysis.mjs";

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

export function createReputationAuditHandler({ authenticate, consumeQuota = null, analyze = null, fetchImpl = fetch, now = () => new Date().toISOString() } = {}) {
  if (typeof authenticate !== "function") throw new TypeError("AUDIT_AUTHENTICATOR_REQUIRED");
  if (typeof consumeQuota !== "function") throw new TypeError("AUDIT_QUOTA_CONSUMER_REQUIRED");
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
    if (user.organization_selection_required) {
      return json({ error: "Plusieurs espaces sont associés à ce compte. Sélectionnez un espace avant de lancer un audit Cheexpeer." }, 409, req);
    }

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
    const website = typeof input?.website === "string" ? input.website.trim().slice(0, 500) : "";
    const territory = typeof input?.territory === "string" ? input.territory.trim().slice(0, 160) : "";
    const activity = typeof input?.activity === "string" ? input.activity.trim().slice(0, 240) : "";
    const objectives = Array.isArray(input?.objectives) ? input.objectives.filter(value => typeof value === "string").slice(0, 12) : [];
    if (subject.length < 2) return json({ error: "Le nom de l'entreprise doit contenir au moins deux caractères." }, 400, req);
    if (siren && !/^\d{9}$/.test(siren)) return json({ error: "Le SIREN doit contenir exactement neuf chiffres." }, 400, req);

    let quotaAllowed;
    try { quotaAllowed = await consumeQuota(user); }
    catch { return json({ error: "Le contrôle de quota est temporairement indisponible." }, 503, req); }
    if (!quotaAllowed) return json({ error: "La limite quotidienne d’audits est atteinte pour cet espace." }, 429, req);

    try {
      const auditCase = createAuditCase({ subject, siren, website, territory, activity, objectives });
      const identityAdapter = createOfficialCompanyIdentityAdapter({ fetchImpl, now });
      const legalEventsAdapter = createBodaccLegalEventsAdapter({ fetchImpl, now });
      const collection = await runReputationCollection({
        auditCase,
        requestedScopes: ["identity_context", "legal_events"],
        adapters: [identityAdapter, legalEventsAdapter],
        normalizeEvidence
      });
      const dto = toReputationCollectionDTO(collection, toAuditEvidenceDTO);
      let analysis = null;
      let analysisNotice = "";
      if (typeof analyze === "function") {
        try {
          analysis = await runCheexpeerAuditAnalysis({ auditCase, evidence: collection.evidence, analyze });
        } catch (error) {
          console.error("Cheexpeer analysis failed", { reason: String(error?.message || error).slice(0, 200) });
          // Une panne du fournisseur IA ne doit pas faire perdre les preuves déjà collectées.
          analysisNotice = "La collecte a abouti, mais l’analyse IA est temporairement indisponible. Aucun diagnostic automatique n’est présenté.";
        }
      } else {
        analysisNotice = "Le moteur IA Cheexpeer n’est pas configuré sur le serveur. Les preuves sont collectées, mais aucun diagnostic automatique n’est présenté.";
      }
      return json({
        ...dto,
        ...(analysis ? { analysis, status: analysis.status } : {
          status: "collection_only",
          analysis_unavailable: true,
          analysis_notice: analysisNotice
        }),
        subject: auditCase.subject,
        scope: "identity_and_legal_context",
        notice: analysis
          ? "Cheexpeer a analysé les preuves disponibles. Les constats restent soumis à validation humaine ; le contexte administratif seul ne constitue pas un score de réputation."
          : "Cheexpeer a vérifié le contexte administratif et les annonces légales accessibles. Ces éléments ne constituent pas un audit ni un score de réputation en ligne."
      }, 200, req);
    } catch {
      return json({ error: "La collecte de contexte administratif n'a pas pu aboutir." }, 502, req);
    }
  };
}
