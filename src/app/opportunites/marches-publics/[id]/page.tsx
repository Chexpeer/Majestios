import Link from "next/link";
import PublicHeader from "@/components/public-header";
import { extractBoampFields } from "@/lib/boamp/records";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    q?: string;
    location?: string;
    type?: string;
    title?: string;
    buyer?: string;
    deadline?: string;
    category?: string;
    department?: string;
    publishedAt?: string;
    status?: string;
  }>;
};

type BoampRecord = {
  id?: string;
  fields?: Record<string, unknown>;
  record?: { id?: string; fields?: Record<string, unknown> };
};

type TenderDetail = {
  title: string;
  buyer: string;
  deadline: string;
  category: string;
  department: string;
  publishedAt: string;
  status: string;
  sourceUrl: string;
  refreshed: boolean;
};

function value(input: unknown): string {
  return typeof input === "string" || typeof input === "number" ? String(input).trim() : "";
}

function category(input: string): string {
  const normalized = input.toLocaleLowerCase("fr");
  if (normalized.includes("travaux")) return "Travaux";
  if (normalized.includes("service")) return "Services";
  if (normalized.includes("fourniture")) return "Fournitures";
  return input;
}

async function fetchOfficialDetail(id: string): Promise<Partial<TenderDetail> | null> {
  // The identifier is restricted before being placed in an ODSQL expression.
  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(id)) return null;

  const params = new URLSearchParams({
    limit: "1",
    select: "idweb,objet,nomacheteur,code_departement,code_departement_prestation,famille_libelle,dateparution,datelimitereponse,etat,nature_libelle,nature_categorise_libelle,type_marche,url_avis",
    where: 'idweb="' + id + '"',
  });

  try {
    const response = await fetch(
      "https://boamp-datadila.opendatasoft.com/api/explore/v2.1/catalog/datasets/boamp/records?" + params.toString(),
      { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(7000), cache: "no-store" },
    );
    if (!response.ok) return null;

    const payload = (await response.json()) as { results?: BoampRecord[] };
    const record = payload.results?.[0];
    if (!record) return null;

    const fields = extractBoampFields(record);
    const officialId = value(fields.idweb) || value(record.record?.id) || value(record.id);
    if (officialId && officialId !== id) return null;

    return {
      title: value(fields.objet) || "Objet non renseigné dans la réponse BOAMP",
      buyer: value(fields.nomacheteur) || "Acheteur non renseigné",
      deadline: value(fields.datelimitereponse) || "",
      category: category(value(fields.type_marche) || value(fields.nature_categorise_libelle) || value(fields.nature_libelle)),
      department: value(fields.code_departement_prestation) || value(fields.code_departement),
      publishedAt: value(fields.dateparution),
      status: value(fields.etat) || "Statut à vérifier",
      sourceUrl: value(fields.url_avis) || "https://www.boamp.fr/pages/avis/?q=idweb:" + encodeURIComponent(id),
      refreshed: true,
    };
  } catch {
    return null;
  }
}

function displayDate(input: string): string {
  if (!input) return "";
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return input;
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    ...(input.includes("T") ? { timeStyle: "short" as const } : {}),
    timeZone: "Europe/Paris",
  }).format(date);
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return {
    title: `Avis ${id} — MajestiOS`,
    description: `Fiche de consultation pour l’avis ${id}. Vérifiez les données et échéances sur la source officielle.`,
  };
}

export default async function TenderDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const filters = await searchParams;
  const officialDetail = await fetchOfficialDetail(id);

  // Search parameters are only a contextual fallback; they are never presented as freshly verified.
  const detail: TenderDetail = {
    title: officialDetail?.title || (filters.title ?? "").slice(0, 300),
    buyer: officialDetail?.buyer || (filters.buyer ?? "").slice(0, 200),
    deadline: officialDetail?.deadline || (filters.deadline ?? "").slice(0, 120),
    category: officialDetail?.category || (filters.category ?? "").slice(0, 100),
    department: officialDetail?.department || (filters.department ?? "").slice(0, 100),
    publishedAt: officialDetail?.publishedAt || (filters.publishedAt ?? "").slice(0, 100),
    status: officialDetail?.status || (filters.status ?? "").slice(0, 100),
    sourceUrl: officialDetail?.sourceUrl || "https://www.boamp.fr/pages/avis/?q=idweb:" + encodeURIComponent(id),
    refreshed: Boolean(officialDetail?.refreshed),
  };

  const backParams = new URLSearchParams();
  for (const key of ["q", "location", "type"] as const) {
    const filter = filters[key];
    if (filter) backParams.set(key, filter);
  }
  const backHref = backParams.size
    ? "/opportunites/marches-publics?" + backParams.toString()
    : "/opportunites/marches-publics";

  return (
    <main className="public-site concept-page">
      <PublicHeader />
      <section className="how-section concept-hero">
        <div>
          <span className="section-label">AVIS PUBLIC · IDENTIFIANT SOURCE</span>
          <h1>Fiche de consultation <em>{id}</em></h1>
          <p>Cette page présente les informations disponibles pour l’avis sélectionné. La source officielle reste la référence pour confirmer les pièces, les modifications et les conditions de réponse.</p>
          <a className="search-submit concept-cta" href={detail.sourceUrl} target="_blank" rel="noreferrer">Consulter l’avis officiel ↗</a>
        </div>
      </section>

      <section className="concept-principles">
        <span className="section-label">CONTEXTE DU RÉSULTAT SÉLECTIONNÉ</span>
        <h2>{detail.title || "Informations de l’avis non disponibles"}</h2>
        <p role="status">{detail.refreshed
          ? "Informations actualisées depuis la source BOAMP lors de l’ouverture de cette fiche."
          : "La source BOAMP n’a pas pu confirmer les informations en direct. Les éventuels éléments ci-dessous proviennent du contexte de recherche et ne sont pas considérés comme actualisés."}</p>
        {detail.buyer && <p><strong>Acheteur :</strong> {detail.buyer}</p>}
        {detail.category && <p><strong>Catégorie :</strong> {detail.category}</p>}
        {detail.department && <p><strong>Département :</strong> {detail.department}</p>}
        {detail.publishedAt && <p><strong>Publication :</strong> {displayDate(detail.publishedAt)}</p>}
        {detail.deadline && <p><strong>Échéance :</strong> {displayDate(detail.deadline.replace(/^Date limite\s*:\s*/i, ""))}</p>}
        {detail.status && <p><strong>Statut source :</strong> {detail.status}</p>}
        <p>Vérifiez l’avis et le dossier complet auprès de l’acheteur avant toute décision.</p>
      </section>

      <section className="concept-grid">
        <article><span>01 · VÉRIFIER</span><h2>Objet et périmètre</h2><p>Confirmez l’objet, l’acheteur, les pièces du dossier, les conditions de participation et les éventuelles mises à jour.</p></article>
        <article><span>02 · CONTRÔLER</span><h2>Échéance et procédure</h2><p>Vérifiez la date et l’heure limites, les modalités de dépôt, les critères de sélection et les questions-réponses publiées par l’acheteur.</p></article>
        <article><span>03 · PRÉPARER</span><h2>Évaluer votre capacité à répondre</h2><p>Listez les compétences, références, moyens et documents nécessaires. N’engagez pas une réponse sur la seule base d’un résumé.</p></article>
      </section>

      <section className="concept-principles">
        <h2>Vous souhaitez être accompagné ?</h2>
        <p>Ce parcours prépare une demande d’accompagnement liée à cette référence. Il ne constitue pas un dépôt de candidature auprès de l’acheteur et n’envoie pas de données à lui seul.</p>
        <Link className="search-submit concept-cta" href={"/opportunites/marches-publics/" + encodeURIComponent(id) + "/repondre?" + new URLSearchParams({
          title: detail.title,
          buyer: detail.buyer,
          deadline: detail.deadline,
        }).toString()}>Ouvrir le formulaire lié à cet avis ↗</Link>
        <p><Link href={backHref}>← Retour à la liste des appels d’offres</Link></p>
      </section>

      <footer className="public-footer">
        <Link className="footer-brand" href="/">MajestiOS</Link>
        <Link href="/mentions-legales">Mentions légales</Link>
        <small>Les informations officielles font foi.</small>
      </footer>
    </main>
  );
}
