/**
 * Adaptateur pur entre le contrat de recherche membre et les cartes de qualification.
 * Les données de provenance et les métadonnées techniques ne sont jamais projetées.
 */
const DEPARTMENT = /^(\d{2}|2A|2B|97[1-6]|978|977|986|987|988)$/;
const ACTIVITY = /^\d{2}\.\d{2}[A-Z]$/;

function cleanList(values, pattern) {
  if (!Array.isArray(values)) throw new Error("Les critères de recherche sont invalides.");
  const result = [...new Set(values.map(value => String(value || "").trim().toUpperCase()).filter(Boolean))];
  if (result.some(value => !pattern.test(value))) throw new Error("Vérifiez les codes APE/NAF et les départements.");
  return result;
}

export function buildProspectionSearchPayload({ nafCodes, departments, pageNumber = 1 } = {}) {
  const activityCodes = cleanList(nafCodes, ACTIVITY);
  const departmentCodes = cleanList(departments, DEPARTMENT);
  if (!activityCodes.length || !departmentCodes.length) {
    throw new Error("Saisissez au moins un code APE/NAF et un département.");
  }
  if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > 50) {
    throw new Error("Le numéro de page demandé est invalide.");
  }
  return {
    filters: { activity_codes: activityCodes, departments: departmentCodes },
    page: { number: pageNumber, size: 10 }
  };
}

export function toProspectionCandidate(dto) {
  if (!dto || typeof dto !== "object" || Array.isArray(dto) ||
      typeof dto.id !== "string" || typeof dto.name !== "string" || !dto.name.trim()) {
    return null;
  }
  const address = dto.address && typeof dto.address === "object" ? dto.address : {};
  const qualification = dto.qualification && typeof dto.qualification === "object" ? dto.qualification : {};
  const legalStatus = ["active", "inactive", "unknown"].includes(dto.legal_status) ? dto.legal_status : "unknown";
  const reasons = Array.isArray(qualification.reasons)
    ? qualification.reasons.filter(value => typeof value === "string").slice(0, 10)
    : [];
  const score = Number.isFinite(qualification.score)
    ? Math.max(0, Math.min(100, Math.round(qualification.score)))
    : null;
  const addressParts = [address.postal_code, address.city].filter(value => typeof value === "string" && value.trim());
  return {
    id: dto.id,
    name: dto.name,
    siren: typeof dto.siren === "string" ? dto.siren : "",
    siret: typeof dto.siret === "string" ? dto.siret : "",
    naf: typeof dto.activity_code === "string" ? dto.activity_code : "",
    activityLabel: typeof dto.activity_label === "string" ? dto.activity_label : "",
    department: typeof address.department === "string" && DEPARTMENT.test(address.department) ? address.department : "",
    active: legalStatus === "active" ? true : legalStatus === "inactive" ? false : null,
    creationDate: typeof dto.creation_date === "string" ? dto.creation_date : "",
    legalCategory: typeof dto.legal_form === "string" ? dto.legal_form : "",
    workforceBand: typeof dto.workforce_band === "string" ? dto.workforce_band : "",
    address: addressParts.join(" "),
    score,
    qualification: typeof qualification.label === "string" ? qualification.label : "à examiner",
    reasons,
    warning: legalStatus === "unknown"
      ? "Statut administratif non déterminé : vérification nécessaire."
      : "Données de préqualification à contrôler avant toute prise de contact.",
    lastVerifiedAt: typeof dto.last_verified_at === "string" ? dto.last_verified_at : ""
  };
}

const ERROR_MESSAGES = Object.freeze({
  AUTH_REQUIRED: "Connectez-vous à votre espace membre pour lancer cette recherche.",
  ACCESS_DENIED: "Votre compte ne dispose pas des habilitations nécessaires à cette recherche.",
  INVALID_FILTERS: "Les critères transmis ne sont pas acceptés. Vérifiez les codes et les départements.",
  INVALID_QUERY: "Les critères de recherche sont incomplets.",
  RATE_LIMITED: "La recherche est momentanément limitée. Réessayez un peu plus tard.",
  SEARCH_TEMPORARILY_UNAVAILABLE: "Le service de recherche est momentanément indisponible.",
  PARTIAL_RESULTS: "La recherche n'a retourné qu'une partie des résultats attendus."
});

function errorCode(error) {
  return error?.code || error?.context?.error?.code || "";
}

export function createProspectionMemberAdapter({ supabase } = {}) {
  if (!supabase?.auth || !supabase?.functions?.invoke) {
    throw new Error("Le client authentifié de l’espace membre est indisponible.");
  }
  return Object.freeze({
    async search(criteria) {
      const body = buildProspectionSearchPayload(criteria);
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw new Error("La session de votre espace membre n'a pas pu être vérifiée.");
      const session = sessionData?.session;
      if (!session?.access_token || !session.user?.id) {
        throw new Error(ERROR_MESSAGES.AUTH_REQUIRED);
      }
      const { data: userData, error: userError } = await supabase.auth.getUser(session.access_token);
      if (userError || !userData?.user || userData.user.id !== session.user.id) {
        throw new Error(ERROR_MESSAGES.AUTH_REQUIRED);
      }
      const { data, error } = await supabase.functions.invoke("prospection-search-member", { body });
      if (error) {
        const code = errorCode(error);
        throw new Error(ERROR_MESSAGES[code] || "La recherche sécurisée n'a pas pu aboutir.");
      }
      if (!data || data.ok !== true || !Array.isArray(data.items) ||
          !data.page || typeof data.page.has_more !== "boolean" || typeof data.partial !== "boolean") {
        throw new Error("La réponse du service de recherche n'est pas conforme au contrat attendu.");
      }
      const candidates = data.items.map(toProspectionCandidate).filter(Boolean);
      return {
        candidates,
        page: {
          number: Number.isInteger(data.page.number) ? data.page.number : body.page.number,
          size: 10,
          hasMore: data.page.has_more
        },
        partial: data.partial,
        fetchedAt: new Date().toISOString()
      };
    }
  });
}
