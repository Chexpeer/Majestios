import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const API_BASE = "https://bodacc-datadila.opendatasoft.com/api/explore/v2.0/catalog/datasets/annonces-commerciales/records";
type RawRecord = { record?: { id?: string; fields?: Record<string, unknown> }; fields?: Record<string, unknown>; id?: string } & Record<string, unknown>;

function text(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") return String(value).trim();
  if (Array.isArray(value)) return value.map(text).filter(Boolean).join(", ");
  return "";
}
function pick(fields: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const found = text(fields[key]);
    if (found) return found;
  }
  return "";
}
function dateLabel(raw: string): string {
  if (!raw) return "Date non renseignée";
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? raw : new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeZone: "Europe/Paris" }).format(parsed);
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const query = (params.get("q") ?? "").trim().slice(0, 120);
  const limit = Math.min(30, Math.max(1, Number(params.get("limit") ?? "15") || 15));
  if (query.length < 2) {
    return NextResponse.json({ items: [], meta: { source: "BODACC · DILA", stage: "live", message: "Saisissez au moins deux caractères pour lancer une recherche." } });
  }

  const apiParams = new URLSearchParams({ limit: String(limit), lang: "fr" });
  // ODSQL search uses a quoted literal; escaping prevents user text from changing the filter expression.
  const safeQuery = query.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  apiParams.set("where", `search(*, "${safeQuery}")`);

  try {
    const response = await fetch(`${API_BASE}?${apiParams.toString()}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(9000),
    });
    if (!response.ok) {
      return NextResponse.json({ error: "La source officielle BODACC est temporairement indisponible.", items: [] }, { status: 502 });
    }
    const payload = await response.json() as { results?: RawRecord[]; total_count?: number };
    const items = (payload.results ?? []).map((record, index) => {
      const fields = record.record?.fields ?? record.fields ?? record;
      const id = pick(fields, ["id", "idannonce", "numeroannonce", "numero_annonce", "idweb"]) || record.record?.id || record.id || `bodacc-${index}`;
      const company = pick(fields, ["commercant", "denomination", "denomination_sociale", "raison_sociale", "nomentreprise", "nom_entreprise", "personne"]);
      const kind = pick(fields, ["familleavis_lib", "familleavis_libelle", "typeavis_lib", "familleavis", "typeavis", "type_annonce", "nature", "categorie"]);
      const summary = pick(fields, ["annonce", "objet", "description", "texte", "contenu", "activite", "activite_principale"]);
      const date = pick(fields, ["dateparution", "date_parution", "datepublication", "date_publication"]);
      const siren = pick(fields, ["siren", "numero_siren", "registre"]);
      const location = pick(fields, ["ville", "commune", "localite", "adresse", "departement_nom_officiel", "departement", "numerodepartement"]);
      const directUrl = pick(fields, ["url_complete", "url", "lien", "url_annonce", "url_detail"]);
      return {
        id: String(id),
        company: company || "Entreprise non identifiée dans le résultat",
        kind: kind || "Annonce légale BODACC",
        summary: summary || "Consultez l’avis officiel pour lire le détail de l’annonce.",
        date: dateLabel(date),
        siren,
        location,
        source: "BODACC · DILA",
        sourceUrl: directUrl.startsWith("http") ? directUrl : "https://www.bodacc.fr/pages/annonces-commerciales/",
        isDemo: false,
      };
    });
    return NextResponse.json({
      items,
      meta: {
        stage: "live",
        source: "BODACC — Direction de l’information légale et administrative (DILA)",
        total: payload.total_count ?? items.length,
        attribution: "Données publiques BODACC/DILA, réutilisées sous Licence Ouverte 2.0. Vérifiez l’annonce et son contexte sur la source officielle.",
      },
    }, { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
  } catch {
    return NextResponse.json({ error: "Impossible de joindre la source officielle BODACC. Aucun résultat fictif n’est affiché.", items: [] }, { status: 502, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
  }
}
