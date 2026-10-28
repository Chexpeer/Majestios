/**
 * Extract fields from the response shapes seen in OpenDataSoft APIs.
 *
 * Depending on the endpoint/response representation, a result may expose
 * fields under record.fields, directly under fields, or directly on the result.
 */
export function extractBoampFields(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};

  const result = input as Record<string, unknown>;
  const nestedRecord = result.record;

  if (nestedRecord && typeof nestedRecord === "object" && !Array.isArray(nestedRecord)) {
    const nestedFields = (nestedRecord as Record<string, unknown>).fields;
    if (nestedFields && typeof nestedFields === "object" && !Array.isArray(nestedFields)) {
      return nestedFields as Record<string, unknown>;
    }
  }

  const fields = result.fields;
  if (fields && typeof fields === "object" && !Array.isArray(fields)) {
    return fields as Record<string, unknown>;
  }

  return result;
}
