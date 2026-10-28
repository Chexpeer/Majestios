export type BoampSearchType = "all" | "Travaux" | "Services" | "Fournitures";

export type BoampQueryOptions = {
  query: string;
  department: string;
  type: BoampSearchType;
};

/**
 * Build parameters for the BOAMP OpenDataSoft Explore API v2.1.
 * Full-text search belongs in the ODSQL where expression (search()),
 * not in legacy query-string parameters.
 */
export function buildBoampApiParams({
  query,
  department,
  type,
}: BoampQueryOptions): URLSearchParams {
  const params = new URLSearchParams({
    limit: "50",
    order_by: "dateparution desc",
    select:
      "idweb,objet,nomacheteur,code_departement,code_departement_prestation,famille_libelle,dateparution,datelimitereponse,etat,type_procedure,nature_libelle,nature_categorise_libelle,type_marche,url_avis",
  });

  const filters: string[] = [];
  const safeQuery = query
    .replace(/["\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);

  if (safeQuery) {
    filters.push('search(*, "' + safeQuery + '")');
  }

  if (department) {
    filters.push(
      '(code_departement in ("' +
        department +
        '") OR code_departement_prestation in ("' +
        department +
        '"))',
    );
  }

  if (type !== "all") {
    filters.push('type_marche="' + type.toLocaleUpperCase("fr") + '"');
  }

  if (filters.length) {
    params.set("where", filters.map((filter) => "(" + filter + ")").join(" AND "));
  }

  return params;
}
