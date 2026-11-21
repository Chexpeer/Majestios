// Pitch de sous-traitance (administration) : choisir un marché gagné, trouver le code NAF du gagnant, les métiers complémentaires et les artisans du département,
// puis préparer un brouillon de pitch par métier. Lecture et préparation seulement : rien n'est envoyé, le propriétaire valide.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.119.0";
import { MAJESTIOS_SUPABASE } from "./supabase-config.js";
import { complementaryTrades, normalizeNaf, buildPitch } from "./pitch-sous-traitance.mjs";

const section = document.querySelector("#pitch-section");
if (section) {
  const supabase = createClient(MAJESTIOS_SUPABASE.url, MAJESTIOS_SUPABASE.publishableKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false } });
  const form = section.querySelector("#pitch-form"), status = section.querySelector("#pitch-status"), list = section.querySelector("#pitch-marches"), detail = section.querySelector("#pitch-detail");
  const el = (tag, className, text) => { const n = document.createElement(tag); if (className) n.className = className; if (text !== undefined) n.textContent = text; return n; };
  const say = (message, error = false) => { status.textContent = message; status.classList.toggle("error", error); };
  const fmt = (iso) => { const d = new Date(iso); return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("fr-FR"); };

  const officialSearch = async (params) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("session");
    const url = new URL(MAJESTIOS_SUPABASE.url + "/functions/v1/search-official-companies");
    for (const [k, v] of Object.entries(params)) if (v) url.searchParams.set(k, v);
    const response = await fetch(url, { headers: { authorization: "Bearer " + session.access_token, apikey: MAJESTIOS_SUPABASE.publishableKey } });
    if (!response.ok) throw new Error("official_" + response.status);
    const body = await response.json();
    return Array.isArray(body?.data?.results) ? body.data.results : [];
  };
  const nafOf = (company) => normalizeNaf(company?.activite_principale || company?.siege?.activite_principale);

  const renderTrade = async (host, trade, marche) => {
    const box = el("div", "pitch-trade");
    box.append(el("h4", "", trade.label + " (NAF " + trade.naf + ")"));
    const companies = el("p", "result-detail", "Recherche des entreprises du département…");
    box.append(companies);
    host.append(box);
    try {
      const found = await officialSearch({ q: trade.label.split(/[ ,(]/)[0], departement: marche.buyer_dept, activite_principale: trade.naf, per_page: "5" });
      companies.textContent = found.length
        ? "Entreprises repérées dans le département " + marche.buyer_dept + " : " + found.map((c) => (c.nom_complet || "entreprise") + (c.siege?.commune ? " (" + c.siege.commune + ")" : "")).join(" · ")
        : "Aucune entreprise repérée avec ces critères : élargissez la recherche à la main.";
    } catch { companies.textContent = "La recherche d’entreprises est momentanément indisponible."; }
    const pitch = buildPitch({ winner: marche.winners.split(" · ")[0], object: marche.object, buyer: marche.buyer_name, commune: marche.buyer_commune, dept: marche.buyer_dept, amount: marche.amount, trade: trade.label });
    const area = el("textarea"); area.rows = 9; area.value = pitch || ""; area.setAttribute("aria-label", "Pitch " + trade.label);
    const copy = el("button", "search-submit", "Copier ce pitch"); copy.type = "button";
    copy.addEventListener("click", async () => { try { await navigator.clipboard.writeText(area.value); copy.textContent = "Copié"; } catch { area.select(); } });
    box.append(area, copy);
  };

  const prepare = async (marche) => {
    detail.replaceChildren();
    say("Recherche du code NAF de l’entreprise gagnante…");
    const winnerName = marche.winners.split(" · ")[0];
    let naf = null, label = "";
    try {
      const found = await officialSearch({ q: winnerName, per_page: "3" });
      const best = found.find((c) => nafOf(c)) || null;
      if (best) { naf = nafOf(best); label = best.nom_complet || ""; }
    } catch { /* le propriétaire peut saisir le code à la main */ }
    const head = el("div", "pitch-naf");
    head.append(el("p", "", "Entreprise gagnante : " + winnerName + (label ? " (trouvée : " + label + ")" : "")));
    const input = el("input"); input.maxLength = 8; input.placeholder = "Code NAF, ex. 43.22B"; input.value = naf || ""; input.setAttribute("aria-label", "Code NAF de l’entreprise gagnante");
    const go = el("button", "search-submit", "Voir les métiers complémentaires"); go.type = "button";
    const trades = el("div", "pitch-trades");
    go.addEventListener("click", async () => {
      trades.replaceChildren();
      const list = complementaryTrades(input.value);
      if (!list.length) { say("Ce code NAF n’est pas encore décrit dans la table des métiers complémentaires : aucune proposition n’est inventée.", true); return; }
      say("Métiers complémentaires pour le NAF " + normalizeNaf(input.value) + " : " + list.length + ". Relisez chaque pitch, rien n’est envoyé.");
      for (const trade of list) await renderTrade(trades, trade, marche);
    });
    head.append(input, go);
    detail.append(head, trades);
    say(naf ? "Code NAF trouvé : " + naf + ". Vérifiez-le puis affichez les métiers complémentaires." : "Code NAF non trouvé automatiquement : saisissez-le, puis affichez les métiers complémentaires.", !naf);
    if (naf) go.click();
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    list.replaceChildren(); detail.replaceChildren();
    say("Recherche des marchés gagnés…");
    const dept = form.elements.department.value.trim().toUpperCase();
    const query = form.elements.query.value.trim();
    const { data, error } = await supabase.rpc("list_awarded_contracts", { p_department: /^(0[1-9]|[1-8][0-9]|9[0-5]|2[AB]|97[1-6])$/.test(dept) ? dept : null, p_query: query.length >= 3 ? query : null, p_cpv: null, p_min_amount: null, p_months: 6, p_limit: 10, p_offset: 0 });
    if (error) { say("Les marchés gagnés sont momentanément inaccessibles.", true); return; }
    if (!data?.length) { say("Aucun marché gagné pour ces critères."); return; }
    say(data.length + " marché(s) gagné(s). Choisissez celui pour lequel préparer le pitch.");
    for (const m of data) {
      const card = el("article", "result-card");
      card.append(el("h3", "", m.object));
      card.append(el("p", "result-meta", [m.winners && "Gagné par " + m.winners, m.buyer_name, m.buyer_commune && m.buyer_commune + (m.buyer_dept ? " (" + m.buyer_dept + ")" : ""), m.awarded_on && "Notifié le " + fmt(m.awarded_on)].filter(Boolean).join(" · ")));
      const button = el("button", "search-submit", "Préparer le pitch"); button.type = "button";
      button.addEventListener("click", () => prepare(m));
      card.append(button);
      list.append(card);
    }
  });
}
