// Mission Cheexpeer « fiches de contacts » (lecture seule, autonomie 0, validation humaine obligatoire, aucun envoi).
// Pour chaque entreprise (30 au plus) : nom du dirigeant tel que publié par l'annuaire officiel ; lien Google Maps et identifiant du lieu
// (Google sert à vérifier et à renvoyer un lien : le contenu Google — téléphone, site, avis — n'est NI recopié NI conservé, cf. OUTILS-GOOGLE-CHEEXPEER).
// Téléphone, e-mail et site web : à lire plus tard sur le site de l'entreprise elle-même (étape séparée).
export const MISSION_TYPE_FICHES = "fiches_contacts";
export const MAX_ENTREPRISES = 30;
const SIREN = /^\d{9}$/;
const COMPANIES_URL = "https://recherche-entreprises.api.gouv.fr/search";
const PLACES_URL = "https://places.googleapis.com/v1/places:searchText";
const clean = (v, n = 160) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, n);
const norm = (v) => String(v ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export function validateFichesInput(input) {
  if (!input || typeof input !== "object" || Array.isArray(input) || Object.keys(input).some((k) => k !== "entreprises")) return { ok: false, error: "Champs non reconnus." };
  if (!Array.isArray(input.entreprises) || input.entreprises.length < 1 || input.entreprises.length > MAX_ENTREPRISES) return { ok: false, error: `Entre 1 et ${MAX_ENTREPRISES} entreprises.` };
  const seen = new Set(), out = [];
  for (const e of input.entreprises) {
    if (!e || typeof e !== "object" || Array.isArray(e)) return { ok: false, error: "Entreprise invalide." };
    const siren = String(e.siren ?? "").replace(/\s/g, "");
    if (!SIREN.test(siren)) return { ok: false, error: "SIREN invalide (9 chiffres)." };
    if (seen.has(siren)) continue; seen.add(siren);
    out.push({ siren, nom: clean(e.nom, 140) || null, commune: clean(e.commune, 80) || null, code_postal: clean(e.code_postal, 10) || null });
  }
  return { ok: true, value: { entreprises: out } };
}

/** Dirigeants publiés par l'annuaire officiel (registre) : qualité et nom tels que publiés, jamais plus. */
async function lireAnnuaire(siren, fetchImpl) {
  const url = new URL(COMPANIES_URL); url.searchParams.set("q", siren); url.searchParams.set("per_page", "1");
  const res = await fetchImpl(url, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error("annuaire_" + res.status);
  const r = (await res.json())?.results?.[0];
  if (!r || String(r.siren) !== siren) return null;
  const dirigeants = (Array.isArray(r.dirigeants) ? r.dirigeants : []).slice(0, 5).map((d) => (d?.type_dirigeant === "personne morale"
    ? { type: "personne morale", nom: clean(d.denomination, 120) || null, qualite: clean(d.qualite, 80) || null }
    : { type: "personne physique", nom: [clean(d?.prenoms, 60).split(" ")[0], clean(d?.nom, 60)].filter(Boolean).join(" ") || null, qualite: clean(d?.qualite, 80) || null }));
  return { nom: clean(r.nom_complet, 140) || null, dirigeants };
}

/** Recherche Google Places (champs « Pro » seulement : identifiant, nom, adresse, lien). Correspondance vérifiée sur le code postal ou la commune. */
async function chercherLieu(e, key, fetchImpl) {
  const q = [e.nom, e.commune].filter(Boolean).join(" ");
  if (!q) return { statut: "non cherché" };
  const res = await fetchImpl(new URL(PLACES_URL), {
    method: "POST", signal: AbortSignal.timeout(15000),
    headers: { "Content-Type": "application/json", "X-Goog-Api-Key": key, "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.googleMapsUri" },
    body: JSON.stringify({ textQuery: q, maxResultCount: 3, languageCode: "fr", regionCode: "FR" })
  });
  if (!res.ok) return { statut: "erreur Google", code: res.status };
  const places = (await res.json())?.places ?? [];
  if (!places.length) return { statut: "non trouvé" };
  const cp = clean(e.code_postal, 10), com = norm(e.commune), nom = norm(e.nom);
  const score = (p) => { const adr = norm(p.formattedAddress); const n = norm(p.displayName?.text); return (cp && adr.includes(cp) ? 2 : 0) + (com && adr.includes(com) ? 1 : 0) + (nom && n && (n.includes(nom) || nom.includes(n)) ? 2 : 0); };
  const best = [...places].sort((a, b) => score(b) - score(a))[0];
  const s = score(best);
  return { statut: s >= 3 ? "correspondance probable" : s >= 1 ? "à vérifier" : "à vérifier (adresse différente)", place_id: best.id ?? null, lien_google_maps: best.googleMapsUri ?? null, nom_google: clean(best.displayName?.text, 140) || null };
}

export async function runFichesMission(input, { fetchImpl = fetch, now = new Date(), pauseMs = 150, googleKey = globalThis.Deno?.env?.get?.("GOOGLE_MAPS_API_KEY") } = {}) {
  const checked = validateFichesInput(input);
  if (!checked.ok) throw Object.assign(new Error(checked.error), { code: "INVALID_INPUT" });
  const fiches = [];
  for (const e of checked.value.entreprises) {
    const fiche = { siren: e.siren, nom: e.nom, commune: e.commune, dirigeants: [], google: { statut: googleKey ? "non cherché" : "clé Google absente" }, sources: [] };
    try { const a = await lireAnnuaire(e.siren, fetchImpl); if (a) { fiche.dirigeants = a.dirigeants; fiche.nom = fiche.nom || a.nom; fiche.sources.push("annuaire officiel (registre)"); fiche.source_url = "https://annuaire-entreprises.data.gouv.fr/entreprise/" + e.siren; } } catch { fiche.annuaire_erreur = true; }
    if (googleKey) { try { fiche.google = await chercherLieu({ ...e, nom: fiche.nom }, googleKey, fetchImpl); if (fiche.google.lien_google_maps) fiche.sources.push("Google Maps (lien)"); } catch { fiche.google = { statut: "erreur Google" }; } }
    fiches.push(fiche);
    if (pauseMs > 0) await new Promise((r) => setTimeout(r, pauseMs));
  }
  return {
    type: MISSION_TYPE_FICHES, nombre: fiches.length, fiches,
    manquant: ["telephone", "email", "site_web"],
    avertissement: "Téléphone, e-mail et site web ne sont pas remplis : ils seront lus sur le site de l'entreprise elle-même (étape suivante). Google ne fournit ici que le lien vers la fiche, à vérifier. Rien n'est envoyé et rien n'entre dans le CRM sans votre validation.",
    sources: ["annuaire officiel (registre)", "Google Maps (lien seulement)"], genere_le: now.toISOString(), effets_externes: false
  };
}
