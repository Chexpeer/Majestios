// Mission Cheexpeer « fiches de contacts » (lecture seule, autonomie 0, validation humaine obligatoire, aucun envoi).
// Pour chaque entreprise (30 au plus), tout en une seule mission : dirigeants (annuaire officiel) ; site web, téléphone et lien Google Maps (Google Places) ;
// e-mail (et téléphone si Google n'en donne pas) lus sur le site de l'entreprise elle-même. Chaque champ garde sa source.
// Décision du propriétaire (23/11/2026) : ces informations sont conservées dans la fiche, sans limite de 30 jours (cf. OUTILS-GOOGLE-CHEEXPEER).
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

/** Recherche Google Places (identifiant, nom, adresse, lien, site web, téléphone). Correspondance vérifiée sur le code postal ou la commune. */
async function chercherLieu(e, key, fetchImpl) {
  const q = [e.nom, e.commune].filter(Boolean).join(" ");
  if (!q) return { statut: "non cherché" };
  const res = await fetchImpl(new URL(PLACES_URL), {
    method: "POST", signal: AbortSignal.timeout(15000),
    headers: { "Content-Type": "application/json", "X-Goog-Api-Key": key, "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.googleMapsUri,places.websiteUri,places.nationalPhoneNumber" },
    body: JSON.stringify({ textQuery: q, maxResultCount: 3, languageCode: "fr", regionCode: "FR" })
  });
  if (!res.ok) return { statut: "erreur Google", code: res.status };
  const places = (await res.json())?.places ?? [];
  if (!places.length) return { statut: "non trouvé" };
  const cp = clean(e.code_postal, 10), com = norm(e.commune), nom = norm(e.nom);
  const score = (p) => { const adr = norm(p.formattedAddress); const n = norm(p.displayName?.text); return (cp && adr.includes(cp) ? 2 : 0) + (com && adr.includes(com) ? 1 : 0) + (nom && n && (n.includes(nom) || nom.includes(n)) ? 2 : 0); };
  const best = [...places].sort((a, b) => score(b) - score(a))[0];
  const s = score(best);
  return { statut: s >= 3 ? "correspondance probable" : s >= 1 ? "à vérifier" : "à vérifier (adresse différente)", place_id: best.id ?? null, lien_google_maps: best.googleMapsUri ?? null, nom_google: clean(best.displayName?.text, 140) || null, site_web: safeUrl(best.websiteUri), telephone: clean(best.nationalPhoneNumber, 30) || null };
}


const BAD_HOST = /^(localhost|.*\.local|.*\.internal)$|^\d{1,3}(\.\d{1,3}){3}$|^\[/i;
function safeUrl(u) {
  try { const x = new URL(String(u ?? "")); if (!/^https?:$/.test(x.protocol) || BAD_HOST.test(x.hostname) || x.username || x.password) return null; return x.href.slice(0, 300); } catch { return null; }
}
const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/g;
const EMAIL_BAD = /\.(png|jpe?g|gif|svg|webp|css|js)$|^(sentry|example|votre|nom|email|prenom)@|@(sentry|example|wixpress|domain)\./i;
const TEL_RE = /(?:\+33\s?|0)[1-9](?:[\s.-]?\d{2}){4}/g;
const PAGES = ["", "/contact", "/nous-contacter", "/mentions-legales"];
async function lireSite(site, fetchImpl) {
  const base = safeUrl(site); if (!base) return { emails: [], telephone: null };
  const emails = new Set(); let tel = null;
  for (const path of PAGES) {
    let html;
    try {
      const res = await fetchImpl(new URL(path, base), { signal: AbortSignal.timeout(8000), redirect: "follow", headers: { "User-Agent": "Cheexpeer/1.0 (lecture de la page contact publique)", Accept: "text/html" } });
      if (!res.ok || !/html|text/i.test(res.headers?.get?.("content-type") ?? "text/html")) continue;
      html = (await res.text()).slice(0, 300000);
    } catch { continue; }
    const txt = html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ");
    for (const m of txt.matchAll(/mailto:([^"'?\s>]+)/gi)) { const a = decodeURIComponent(m[1]).trim().toLowerCase(); if (!EMAIL_BAD.test(a)) emails.add(a); }
    for (const m of txt.replace(/<[^>]+>/g, " ").matchAll(EMAIL_RE)) { const a = m[0].toLowerCase(); if (!EMAIL_BAD.test(a)) emails.add(a); }
    if (!tel) { const t = txt.replace(/<[^>]+>/g, " ").match(TEL_RE); if (t) tel = clean(t[0], 20); }
    if (emails.size >= 3) break;
  }
  const host = new URL(base).hostname.replace(/^www\./, "");
  const list = [...emails].sort((a, b) => (b.endsWith("@" + host) ? 1 : 0) - (a.endsWith("@" + host) ? 1 : 0)).slice(0, 3);
  return { emails: list, telephone: tel };
}

export async function runFichesMission(input, { fetchImpl = fetch, now = new Date(), pauseMs = 150, googleKey = globalThis.Deno?.env?.get?.("GOOGLE_MAPS_API_KEY") } = {}) {
  const checked = validateFichesInput(input);
  if (!checked.ok) throw Object.assign(new Error(checked.error), { code: "INVALID_INPUT" });
  const fiches = [];
  for (const e of checked.value.entreprises) {
    const fiche = { siren: e.siren, nom: e.nom, commune: e.commune, dirigeants: [], google: { statut: googleKey ? "non cherché" : "clé Google absente" }, sources: [] };
    try { const a = await lireAnnuaire(e.siren, fetchImpl); if (a) { fiche.dirigeants = a.dirigeants; fiche.nom = fiche.nom || a.nom; fiche.sources.push("annuaire officiel (registre)"); fiche.source_url = "https://annuaire-entreprises.data.gouv.fr/entreprise/" + e.siren; } } catch { fiche.annuaire_erreur = true; }
    if (googleKey) { try { fiche.google = await chercherLieu({ ...e, nom: fiche.nom }, googleKey, fetchImpl); if (fiche.google.lien_google_maps) fiche.sources.push("Google Maps"); } catch { fiche.google = { statut: "erreur Google" }; } }
    const site = fiche.google?.site_web ?? null;
    fiche.site_web = site; fiche.telephone = fiche.google?.telephone ?? null; fiche.telephone_source = fiche.telephone ? "Google Maps" : null; fiche.emails = []; fiche.email_source = null;
    if (site) { try { const l = await lireSite(site, fetchImpl); fiche.emails = l.emails; if (l.emails.length) { fiche.email_source = "site de l'entreprise"; fiche.sources.push("site de l'entreprise"); } if (!fiche.telephone && l.telephone) { fiche.telephone = l.telephone; fiche.telephone_source = "site de l'entreprise"; if (!fiche.sources.includes("site de l'entreprise")) fiche.sources.push("site de l'entreprise"); } } catch { fiche.site_erreur = true; } }
    fiches.push(fiche);
    if (pauseMs > 0) await new Promise((r) => setTimeout(r, pauseMs));
  }
  return {
    type: MISSION_TYPE_FICHES, nombre: fiches.length, fiches,
    manquant: ["telephone", "email", "site_web"].filter((k) => fiches.some((f) => !(k === "email" ? f.emails?.length : f[k]))),
    avertissement: "Site web et téléphone viennent de Google Maps, l'e-mail est lu sur le site de l'entreprise : une case vide veut dire que rien n'a été trouvé (rien n'est inventé). Chaque information indique sa source. Rien n'est envoyé et rien n'entre dans le CRM sans votre validation.",
    sources: ["annuaire officiel (registre)", "Google Maps", "site de l'entreprise"], genere_le: now.toISOString(), effets_externes: false
  };
}
