export function isBootstrapMission(mission) {
  return Boolean(
    mission
    && mission.mission_type === "readiness_probe"
    && Number(mission.autonomy_level) === 0
  );
}

export function healthIsReady({ stopping, lastErrorAt, lastSuccessAt }) {
  return !stopping
    && lastSuccessAt !== null
    && (lastErrorAt === null || Date.parse(lastSuccessAt) >= Date.parse(lastErrorAt));
}
