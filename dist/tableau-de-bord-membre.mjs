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

const ETAPES = [
  ["À qualifier", ["detected", "to_qualify"]],
  ["Qualifiées", ["qualified", "to_contact"]],
  ["En contact", ["contacted", "meeting", "proposal"]],
  ["Gagnées", ["won"]],
  ["Perdues", ["lost"]]
];

export const summarizePipeline = (rows) => {
  const list = (Array.isArray(rows) ? rows : []).filter((r) => r?.status !== "archived");
  const stages = ETAPES.map(([label, set]) => ({ label, count: list.filter((r) => set.includes(r.status)).length }));
  const actions = list
    .filter((r) => r.next_action && !["won", "lost"].includes(r.status))
    .sort((a, b) => String(a.next_action_at || "9999").localeCompare(String(b.next_action_at || "9999")))
    .slice(0, 5);
  return { total: list.length, stages, actions };
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
  const [profile, org, requests, opps] = await Promise.all([
    supabase.from("profiles").select("display_name").eq("id", session.user.id).limit(1),
    supabase.from("organizations").select("name").limit(1),
    supabase.from("client_requests").select("id,request_type,status,subject,created_at").limit(100),
    supabase.from("opportunities").select("id,title,status,next_action,next_action_at,updated_at").limit(200)
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

  // Suivi commercial : pistes et prochaines actions de l'organisation du membre (lecture seule ; l'isolation par organisation est garantie par la base).
  const pipe = summarizePipeline(opps?.data);
  const suivi = el("div", "mj-board-panel mj-board-suivi");
  suivi.id = "suivi-commercial";
  suivi.append(el("h3", "", "Suivi commercial de vos clients"));
  if (opps?.error) suivi.append(el("p", "mj-board-empty", "Votre suivi commercial ne peut pas être affiché pour le moment. Réessayez dans un instant."));
  else if (!pipe.total) suivi.append(el("p", "mj-board-empty", "Aucune piste suivie pour l’instant. Vos pistes, leurs étapes et vos prochaines actions apparaîtront ici."));
  else {
    const row = el("div", "mj-board-kpis mj-board-stages");
    pipe.stages.forEach((s) => {
      const card = el("div", "mj-kpi");
      card.append(el("strong", "mj-kpi-value", String(s.count)), el("span", "mj-kpi-label", s.label));
      row.append(card);
    });
    suivi.append(row);
    suivi.append(el("h4", "mj-board-subtitle", "Prochaines actions"));
    if (!pipe.actions.length) suivi.append(el("p", "mj-board-empty", "Aucune action planifiée."));
    else {
      const ul = el("ul", "mj-board-list");
      pipe.actions.forEach((o) => {
        const li = el("li");
        const main = el("div", "mj-board-item");
        main.append(el("strong", "", o.title || "Piste"), el("span", "", o.next_action));
        li.append(main, el("span", "mj-badge", o.next_action_at ? formatDate(o.next_action_at) : "Sans date"));
        ul.append(li);
      });
      suivi.append(ul);
    }
  }
  host.append(suivi);
  host.hidden = false;
};

export const hideDashboard = (host) => { if (host) { host.hidden = true; host.replaceChildren(); } };
