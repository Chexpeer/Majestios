// Exécuteur de missions Cheexpeer (testable sans réseau). Réserve la prochaine mission validée, l'exécute, enregistre le résultat.
// Types exécutables : le diagnostic inerte, « prospects_sous_traitance », « analyse_marche » et « opportunite_attribution » (lecture seule). Tout autre type échoue proprement.
import { MISSION_TYPE_PROSPECTS, runProspectsMission } from "./mission-prospects-core.mjs";
import { MISSION_TYPE_ANALYSE_MARCHE, runAnalyseMission } from "./mission-analyse-marche-core.mjs";
import { MISSION_TYPE_OPPORTUNITE, runOpportuniteMission } from "./mission-opportunite-core.mjs";
import { MISSION_TYPE_FICHES, runFichesMission } from "./mission-fiches-core.mjs";

export const WORKER_ID = "cheexpeer-edge-runner";
export const MAX_RESULT_BYTES = 30 * 1024;
/** Mode « toutes les entreprises » : résultat volumineux, destiné au téléchargement. */
export const MAX_RESULT_BYTES_TOUTES = 1200 * 1024;
export const MAX_MISSIONS_PER_CALL = 3;

const bytes = (v) => new TextEncoder().encode(JSON.stringify(v)).byteLength;

/** Réduit la liste si le résultat dépasse la taille autorisée par le pont (32 Ko) : jamais de résultat tronqué en silence. */
export function fitResult(result) {
  const max = result?.criteres?.toutes ? MAX_RESULT_BYTES_TOUTES : MAX_RESULT_BYTES;
  if (bytes(result) <= max) return result;
  const list = [...(result.entreprises ?? [])];
  while (list.length > 1 && bytes({ ...result, entreprises: list, nombre: list.length, reduit: true }) > max) list.pop();
  return { ...result, entreprises: list, nombre: list.length, reduit: true };
}

export async function executeMission(mission, { fetchImpl, now, admin } = {}) {
  if (mission.mission_type === "readiness_probe" && Number(mission.autonomy_level) === 0) {
    return { status: "passed", executor: WORKER_ID, verified_at: (now ?? new Date()).toISOString(), external_effects: false };
  }
  if (mission.mission_type === MISSION_TYPE_PROSPECTS && Number(mission.autonomy_level) === 0) {
    return fitResult(await runProspectsMission(mission.mission_input, { fetchImpl, now }));
  }
  if (mission.mission_type === MISSION_TYPE_ANALYSE_MARCHE && Number(mission.autonomy_level) === 0) {
    return await runAnalyseMission(mission.mission_input, { fetchImpl, now });
  }
  if (mission.mission_type === MISSION_TYPE_OPPORTUNITE && Number(mission.autonomy_level) === 0) {
    return await runOpportuniteMission(mission.mission_input, { admin, fetchImpl, now });
  }
  if (mission.mission_type === MISSION_TYPE_FICHES && Number(mission.autonomy_level) === 0) {
    return await runFichesMission(mission.mission_input, { fetchImpl, now });
  }
  throw Object.assign(new Error("Type de mission non pris en charge."), { code: "UNSUPPORTED_TYPE" });
}

/** Traite au plus `max` missions. Renvoie un résumé sans contenu de résultat (le résultat se lit via l'API de lecture). */
export async function runPending(admin, { fetchImpl = fetch, max = MAX_MISSIONS_PER_CALL, now } = {}) {
  const summary = { processed: [], failed: [] };
  await admin.rpc("cheexpeer_worker_dispatch_due", { p_limit: 20 });
  for (let i = 0; i < max; i++) {
    const claimed = await admin.rpc("cheexpeer_worker_claim_next", { p_worker_id: WORKER_ID, p_lease_seconds: 120 });
    if (claimed.error) throw new Error("claim_failed");
    const mission = Array.isArray(claimed.data) ? claimed.data[0] : claimed.data;
    if (!mission?.mission_id) break;
    try {
      const result = await executeMission(mission, { fetchImpl, now, admin });
      const done = await admin.rpc("cheexpeer_worker_complete_mission", { p_mission_id: mission.mission_id, p_worker_id: WORKER_ID, p_result: result });
      if (done.error || done.data !== true) throw Object.assign(new Error("Enregistrement du résultat refusé."), { code: "COMPLETE_REJECTED" });
      summary.processed.push({ mission_id: mission.mission_id, mission_type: mission.mission_type });
    } catch (error) {
      const code = String(error?.code ?? "EXECUTION_FAILED").slice(0, 120);
      await admin.rpc("cheexpeer_worker_fail_mission", {
        p_mission_id: mission.mission_id, p_worker_id: WORKER_ID, p_error_code: code,
        p_error_summary: String(error?.message ?? "Échec d'exécution").slice(0, 500),
        p_retry_delay_seconds: code === "UNSUPPORTED_TYPE" || code === "INVALID_INPUT" ? 86400 : 120
      });
      summary.failed.push({ mission_id: mission.mission_id, mission_type: mission.mission_type, code });
    }
  }
  return summary;
}
