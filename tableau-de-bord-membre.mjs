// Tableau de bord de l'espace personnel : chiffres et dernières demandes du membre connecté (lecture seule, droits Supabase du membre).
const EN_COURS = ["received", "in_review"];
const A_COMPLETER = ["waiting_for_user"];
const TERMINEES = ["accepted", "rejected", "closed"];

export const STATUS_LABELS = {
  received: "Reçue", in_review: "En cours d’étude", waiting_for_user: "À compléter de votre côté",
  accepted: "Acceptée", rejected: "Non retenue", closed: "Clôturée"
};
export const TYPE_LABELS = {
  contact: "Contact", account_access: "Accès au compte", commercial_support: "Appui commercial",
  tender_support: "Accompagnement appel d’offres", qualification: "Qualification", other: "Autre demande"
};

export const summarizeRequests = (rows) => {
  const list = Array.isArray(rows) ? rows : [];
  const count = (set) => list.filter((r) => set.includes(r?.status)).length;
  const recent = [...list].sort((a, b) => String(b?.created_at || "").localeCompare(String(a?.created_at || ""))).slice(0, 5);
  return { total: list.length, enCours: count(EN_COURS), aCompleter: count(A_COMPLETER), terminees: count(TERMINEES), recent };
};

export const firstName = (displayName, email) => {
  const base = String(displayName || "").trim() || String(email || "").split("@")[0] || "";
  return base.split(/\s+/)[0] || "";
};

const formatDate = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
};

const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

export const renderDashboard = async (supabase, session, host) => {
  if (!host) return;
  const [profile, org, requests] = await Promise.all([
    supabase.from("profiles").select("display_name").eq("id", session.user.id).limit(1),
    supabase.from("organizations").select("name").limit(1),
    supabase.from("client_requests").select("id,request_type,status,subject,created_at").limit(100)
  ]);
  const name = firstName(profile?.data?.[0]?.display_name, session.user.email);
  const company = org?.data?.[0]?.name || "";
  const loadError = Boolean(requests?.error);
  const sum = summarizeRequests(requests?.data);

  host.replaceChildren();
  const head = el("div", "mj-board-head");
  const title = el("h2", "", name ? `Bonjour ${name}` : "Bonjour");
  title.id = "tableau-de-bord-titre";
  head.append(title, el("p", "mj-board-sub", company ? `${company} · tableau de bord de votre espace` : "Tableau de bord de votre espace"));
  host.append(head);

  const kpis = el("div", "mj-board-kpis");
  [["Demandes envoyées", sum.total], ["En cours de traitement", sum.enCours], ["À compléter de votre côté", sum.aCompleter], ["Terminées", sum.terminees]].forEach(([label, value]) => {
    const card = el("div", "mj-kpi");
    card.append(el("strong", "mj-kpi-value", loadError ? "–" : String(value)), el("span", "mj-kpi-label", label));
    kpis.append(card);
  });
  host.append(kpis);

  const panel = el("div", "mj-board-panel");
  panel.append(el("h3", "", "Mes dernières demandes"));
  if (loadError) panel.append(el("p", "mj-board-empty", "Vos demandes ne peuvent pas être affichées pour le moment. Réessayez dans un instant."));
  else if (!sum.recent.length) panel.append(el("p", "mj-board-empty", "Aucune demande pour l’instant. Choisissez un service ci-dessous pour démarrer : vos demandes et leur avancement apparaîtront ici."));
  else {
    const ul = el("ul", "mj-board-list");
    sum.recent.forEach((r) => {
      const li = el("li");
      const main = el("div", "mj-board-item");
      main.append(el("strong", "", r.subject || TYPE_LABELS[r.request_type] || "Demande"), el("span", "", `${TYPE_LABELS[r.request_type] || "Demande"} · ${formatDate(r.created_at)}`));
      const badge = el("span", `mj-badge mj-badge-${r.status}`, STATUS_LABELS[r.status] || r.status);
      li.append(main, badge);
      ul.append(li);
    });
    panel.append(ul);
  }
  host.append(panel);
  host.hidden = false;
};

export const hideDashboard = (host) => { if (host) { host.hidden = true; host.replaceChildren(); } };
