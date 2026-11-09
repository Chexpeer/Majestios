import { createAuditCase, normalizeEvidence } from "./reputation-audit-core.mjs";
import { runCheexpeerAuditAnalysis } from "./reputation-audit-analysis.mjs";

const headers = Object.freeze({
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff"
});

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers });
}

export function createVercelReputationAuditHandler({ verifyUser, collectContext, analyzeModel, now = () => new Date().toISOString() } = {}) {
  if (typeof verifyUser !== "function" || typeof collectContext !== "function" || typeof analyzeModel !== "function") {
    throw new TypeError("AUDIT_RUNTIME_DEPENDENCIES_REQUIRED");
  }

  return async function handle(req) {
    if (req.method !== "POST") return json({ error: "Méthode non autorisée." }, 405);
    const match = (req.headers.get("Authorization") || "").match(/^Bearer\s+(.+)$/i);
    if (!match) return json({ error: "Authentification requise." }, 401);

    let authenticated = false;
    try { authenticated = await verifyUser(match[1]); }
    catch { return json({ error: "Vérification de session temporairement indisponible." }, 503); }
    if (!authenticated) return json({ error: "Session invalide ou expirée." }, 401);

    if (!(req.headers.get("Content-Type") || "").toLowerCase().includes("application/json")) {
      return json({ error: "Le contenu doit être transmis au format JSON." }, 415);
    }
    let raw;
    try { raw = await req.text(); } catch { return json({ error: "Requête illisible." }, 400); }
    if (new TextEncoder().encode(raw).byteLength > 4096) return json({ error: "Requête trop volumineuse." }, 413);

    let input;
    try { input = JSON.parse(raw); } catch { return json({ error: "JSON invalide." }, 400); }
    const subject = typeof input?.subject === "string" ? input.subject.trim().slice(0, 180) : "";
    const siren = typeof input?.siren === "string" ? input.siren.trim() : "";
    const objectives = Array.isArray(input?.objectives)
      ? input.objectives.filter(value => typeof value === "string").map(value => value.trim().slice(0, 120)).filter(Boolean).slice(0, 12)
      : [];
    if (subject.length < 2) return json({ error: "Le nom de l'entreprise doit contenir au moins deux caractères." }, 400);
    if (siren && !/^\d{9}$/.test(siren)) return json({ error: "Le SIREN doit contenir exactement neuf chiffres." }, 400);

    let context;
    try { context = await collectContext({ token: match[1], subject, siren }); }
    catch { return json({ error: "La collecte des preuves n'est pas disponible. Aucun rapport n'a été produit." }, 503); }
    if (!context || !Array.isArray(context.evidence)) {
      return json({ error: "La collecte a retourné un format non reconnu. Aucun rapport n'a été produit." }, 502);
    }

    const auditCase = createAuditCase({ subject, siren, objectives }, now());
    let evidence;
    try {
      evidence = context.evidence.slice(0, 100).map(item => normalizeEvidence({
        source_key: "cheexpeer_collected_context",
        source_record_id: null,
        url: item.reference,
        title: item.title,
        excerpt: item.excerpt,
        evidence_type: item.evidence_type,
        captured_at: item.captured_at,
        subject_match: item.subject_match,
        strength: item.strength,
        limitations: item.limitations
      }));
    } catch {
      return json({ error: "Une preuve collectée ne respecte pas le contrat. Aucun rapport n'a été produit." }, 502);
    }

    if (evidence.length === 0) {
      return json({
        schema_version: 1,
        status: "insufficient_evidence",
        subject,
        generated_at: now(),
        summary: "Aucune preuve suffisante n'a été collectée ; aucun constat n'est formulé.",
        findings: [],
        evidence: [],
        recommendations: [],
        gaps: ["Aucune preuve exploitable n'a été retournée par les sources autorisées."],
        review_required: true,
        notice: "Cheexpeer n'a pas fabriqué de diagnostic en l'absence de preuves."
      }, 200);
    }

    let report;
    try {
      report = await runCheexpeerAuditAnalysis({ auditCase, evidence, analyze: analyzeModel });
    } catch (error) {
      if (["AI_GATEWAY_AUTH_UNAVAILABLE", "AI_GATEWAY_MODEL_INVALID"].includes(error?.message)) {
        return json({ error: "Le service d'analyse Cheexpeer n'est pas configuré. Aucun rapport n'a été produit." }, 503);
      }
      return json({ error: "L'analyse Cheexpeer n'a pas produit de réponse vérifiable. Aucun rapport n'a été publié." }, 502);
    }

    const collectionGap = context.status && context.status !== "completed"
      ? ["La collecte des sources est partielle ; le rapport ne couvre pas toutes les sources prévues."]
      : [];
    return json({
      ...report,
      generated_at: now(),
      gaps: [...report.gaps, ...collectionGap],
      collection_status: ["completed", "partial", "blocked"].includes(context.status) ? context.status : "unknown"
    });
  };
}
