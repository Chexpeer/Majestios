// Localisation du chantier par commune (annuaire officiel des adresses). Lecture seule, aucun effet externe.
export const ADRESSE_URL = "https://api-adresse.data.gouv.fr/search/";
const clean = (v, n = 80) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, n);

/** Commune → point GPS (centre de la commune). Toujours « à confirmer » (fiable:false). Tolérant : null en cas d'échec. */
export async function localiserCommune({ commune, departement = null, origine = "commune du chantier" }, fetchImpl = fetch) {
  const nom = clean(commune);
  if (!nom) return null;
  try {
    const url = new URL(ADRESSE_URL);
    url.searchParams.set("q", nom); url.searchParams.set("type", "municipality"); url.searchParams.set("limit", "5");
    const res = await fetchImpl(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    const dept = String(departement ?? "").trim().toUpperCase();
    const features = (await res.json())?.features ?? [];
    const f = features.find((x) => !dept || String(x?.properties?.context ?? "").split(",")[0].trim().toUpperCase() === dept) ?? null;
    const [lon, lat] = f?.geometry?.coordinates ?? [];
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
    return { lat: Math.round(lat * 1e5) / 1e5, lon: Math.round(lon * 1e5) / 1e5, origine: `${origine} : ${clean(f.properties?.label || nom)}`, fiable: false };
  } catch { return null; }
}
