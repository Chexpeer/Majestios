"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Opportunity = {
  id: string;
  title: string;
  type: string;
  location: string;
  buyer: string;
  deadline: string;
  publishedAt: string;
  officialStatus: string;
  sourceUrl: string;
};

function detailHref(item: Opportunity, filters: URLSearchParams) {
  const params = new URLSearchParams({
    title: item.title || "",
    buyer: item.buyer || "",
    deadline: item.deadline || "",
    category: item.type || "",
    department: item.location || "",
    publishedAt: item.publishedAt || "",
    status: item.officialStatus || "",
  });
  for (const key of ["q", "location", "type"] as const) {
    const value = filters.get(key);
    if (value) params.set(key, value);
  }
  return `/opportunites/marches-publics/${encodeURIComponent(item.id)}?${params.toString()}`;
}

export default function TenderSearchResults() {
  const [filters, setFilters] = useState<URLSearchParams | null>(null);
  const [items, setItems] = useState<Opportunity[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setFilters(new URLSearchParams(window.location.search));
  }, []);

  useEffect(() => {
    if (!filters) return;
    let cancelled = false;
    const query = new URLSearchParams({ limit: "20", openOnly: "true" });
    for (const key of ["q", "location", "type"] as const) {
      const value = filters.get(key);
      if (value && value !== "all") query.set(key, value);
    }

    setState("loading");
    setMessage("");
    fetch(`/api/opportunities?${query.toString()}`, { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "La recherche est momentanément indisponible.");
        return payload as { items?: Opportunity[]; error?: string };
      })
      .then((payload) => {
        if (cancelled) return;
        setItems(Array.isArray(payload.items) ? payload.items : []);
        setState("ready");
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setItems([]);
        setMessage(error instanceof Error ? error.message : "Impossible de charger les consultations.");
        setState("error");
      });

    return () => { cancelled = true; };
  }, [filters?.toString()]);

  const queryLabel = filters
    ? [filters.get("q"), filters.get("location") ? `département ${filters.get("location")}` : "", filters.get("type") && filters.get("type") !== "all" ? filters.get("type") : ""].filter(Boolean).join(" · ")
    : "";

  return (
    <section className="concept-principles tender-live-results" aria-labelledby="tender-results-title">
      <span className="section-label">FLUX OFFICIEL · BOAMP</span>
      <h2 id="tender-results-title">{queryLabel ? "Résultats de votre recherche" : "Consultations publiques ouvertes"}</h2>
      <p>Les résultats sont demandés à la source BOAMP. Vérifiez toujours l’avis officiel et son dossier avant de vous positionner.</p>
      {state === "loading" ? <p role="status">Recherche des consultations ouvertes…</p> : null}
      {state === "error" ? <p role="alert">{message} Aucun résultat fictif n’est substitué aux données officielles.</p> : null}
      {state === "ready" && items.length === 0 ? <p role="status">Aucun avis ouvert ne correspond à ces critères. Modifiez les mots-clés ou le département, ou choisissez une autre catégorie.</p> : null}
      {state === "ready" && items.length > 0 ? (
        <>
          <p className="tender-results-count">{items.length} consultation(s) affichée(s) · avis ouverts selon les informations accessibles.</p>
          <div className="results-list">
            {items.map((item) => (
              <article className="result-card" key={item.id}>
                <div className="result-main">
                  <span className="result-category">{item.type || "Marché public"} · {item.location || "Lieu à vérifier"}</span>
                  <h3>{item.title}</h3>
                  <p>{item.buyer || "Acheteur non renseigné"}</p>
                  <p>{item.deadline || "Échéance à vérifier sur l’avis officiel"}</p>
                </div>
                <div className="result-actions">
                  <Link className="result-action" href={detailHref(item, filters ?? new URLSearchParams())}>Ouvrir le dossier →</Link>
                  {item.sourceUrl ? <a className="result-action" href={item.sourceUrl} target="_blank" rel="noreferrer">Avis officiel ↗</a> : null}
                </div>
              </article>
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
