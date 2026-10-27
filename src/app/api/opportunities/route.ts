import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const API_BASE = "https://boamp-datadila.opendatasoft.com/api/explore/v2.1/catalog/datasets/boamp/records";
const ALLOWED_TYPES = ["Travaux", "Services", "Fournitures"] as const;

type BoampRecord = { id?: string; fields?: Record<string, unknown>; record?: { id?: string; fields?: Record<string, unknown> } };

function value(input: unknown): string {
  if (typeof input === "string" || typeof input === "number") return String(input).trim();
  if (Array.isArray(input)) return input.map(value).filter(Boolean).join(", ");
  return "";
}

function category(input: string): string {
  const normalized = input.toLocaleLowerCase("fr");
  if (normalized.includes("travaux")) return "Travaux";
  if (normalized.includes("service")) return "Services";
  if (normalized.includes("fourniture")) return "Fournitures";
  return input || "Marché public";
}

function formatDate(input: string): string {
  if (!input) return "Date non renseignée — vérifier la source";
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return input;
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    ...(input.includes("T") || /\d{1,2}:\d{2}/.test(input) ? { timeStyle: "short" as const } : {}),
    timeZone: "Europe/Paris",
  }).format(date);
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const query = (params.get("q") ?? "").trim().slice(0, 160);
  const location = (params.get("location") ?? "").trim().slice(0, 100);
  const type = (params.get("type") ?? "all").trim();

  if (type !== "all" && !ALLOWED_TYPES.includes(type as (typeof ALLOWED_TYPES)[number])) {
    return NextResponse.json({ error: "Type d'opportunité non pris en charge." }, { status: 400 });
  }

  // Une localisation invalide ne doit jamais déclencher silencieusement une recherche nationale.
  const normalizedDept = location.toUpperCase().replace(/\s+/g, "");
  const validDepartments = /^(?:0[1-9]|[1-8][0-9]|9[0-5]|2A|2B|97[1-6]|978|984|986|987|988)$/;
  if (location && !validDepartments.test(normalizedDept)) {
    return NextResponse.json({
      error: "Indiquez un code département valide (ex. : 68, 2A, 2B ou 971).",
      items: [],
    }, { status: 400 });
  }

  const apiParams = new URLSearchParams({
    limit: "50",
    order_by: "dateparution desc",
    select: "idweb,objet,nomacheteur,code_departement,code_departement_prestation,famille_libelle,dateparution,datelimitereponse,etat,type_procedure,nature_libelle,type_marche,url_avis",
  });
  if (query) apiParams.set("search", query);
  const filters: string[] = [];
  if (location) {
    // BOAMP exposes department codes as multivalued fields: ODSQL 'in' tests array membership.
    filters.push('"' + normalizedDept + '" IN code_departement OR "' + normalizedDept + '" IN code_departement_prestation');
  }
  if (type !== "all") {
    filters.push('type_marche="' + type.toLocaleUpperCase("fr") + '"');
  }
  if (filters.length) apiParams.set("where", filters.map((filter) => "(" + filter + ")").join(" AND "));

  try {
    const response = await fetch(`${API_BASE}?${apiParams.toString()}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(9000),
      cache: "no-store",
    });
    if (!response.ok) {
      return NextResponse.json({ error: "La source officielle BOAMP est temporairement indisponible. Réessayez plus tard.", items: [] }, { status: 502 });
    }

    const payload = (await response.json()) as { results?: BoampRecord[]; total_count?: number };
    const now = Date.now();
    const items = (payload.results ?? []).map((record, index) => {
      // Explore API v2.1 normally returns fields directly on each result; tolerate legacy wrappers too.
      const fields = record.record?.fields ?? record.fields ?? record as Record<string, unknown>;
      const officialId = value(fields.idweb) || value(record.record?.id) || value(record.id) || `boamp-${index}`;
      const deadlineRaw = value(fields.datelimitereponse);
      const deadlineDate = deadlineRaw ? new Date(deadlineRaw).getTime() : NaN;
      const status = value(fields.etat).toLocaleUpperCase("fr");
      const procedure = value(fields.type_procedure).toLocaleUpperCase("fr");
      const marketType = category(value(fields.type_marche) || value(fields.nature_libelle));
      const dept = value(fields.code_departement_prestation) || value(fields.code_departement);
      const isOpen = !Number.isNaN(deadlineDate) && deadlineDate >= now && status !== "ANNULATION" && procedure !== "ATTRIBUTION";
      return {
        id: officialId,
        type: marketType,
        location: dept ? `Département ${dept}` : "Localisation à vérifier sur la source",
        source: "public" as const,
        title: value(fields.objet) || "Objet non renseigné dans la réponse BOAMP",
        deadline: deadlineRaw ? `Date limite : ${formatDate(deadlineRaw)}` : "Date limite non renseignée — vérifier la source",
        sourceName: "BOAMP · DILA",
        sourceUrl: value(fields.url_avis) || `https://www.boamp.fr/pages/avis/?q=idweb:${encodeURIComponent(officialId)}`,
        buyer: value(fields.nomacheteur) || "Acheteur non renseigné",
        publishedAt: formatDate(value(fields.dateparution)),
        officialStatus: status || "Statut à vérifier",
        isOpen,
        isDemo: false,
      };
    }).filter((item) => type === "all" || item.type === type);

    return NextResponse.json({
      items,
      meta: {
        stage: "live",
        isDemo: false,
        source: "BOAMP / Direction de l'information légale et administrative (DILA)",
        total: items.length,
        totalAvailable: payload.total_count ?? null,
        attribution: "Source : BOAMP, Direction de l'information légale et administrative (DILA). Vérifiez l'annonce officielle avant toute décision.",
      },
    }, { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
  } catch {
    return NextResponse.json({
      error: "Impossible de joindre la source officielle BOAMP pour le moment. Les résultats de démonstration ne sont pas affichés en remplacement.",
      items: [],
    }, { status: 502, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
  }
}
