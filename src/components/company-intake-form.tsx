"use client";

import { useState } from "react";

const initial = { company: "", activity: "", postalCode: "", contactName: "", email: "", phone: "", need: "Trouver des marchés", details: "" };

export default function CompanyIntakeForm() {
  const [form, setForm] = useState(initial);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  function update(field: keyof typeof initial, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setCopied(false);
  }

  function summary() {
    return [
      "DEMANDE DE PRÉSENTATION D’ENTREPRISE — MAJESTIOS",
      `Entreprise : ${form.company}`,
      `Activité : ${form.activity}`,
      `Code postal / territoire : ${form.postalCode || "Non précisé"}`,
      `Contact : ${form.contactName}`,
      `E-mail : ${form.email}`,
      `Téléphone : ${form.phone || "Non précisé"}`,
      `Besoin principal : ${form.need}`,
      `Précisions : ${form.details || "Aucune précision"}`,
    ].join("\n");
  }

  async function copyRequest() {
    if (!form.company.trim() || !form.activity.trim() || !form.contactName.trim() || !form.email.trim()) {
      setError("Renseignez au minimum l’entreprise, l’activité, le nom du contact et l’e-mail.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Vérifiez le format de l’adresse e-mail.");
      return;
    }
    try {
      await navigator.clipboard.writeText(summary());
      setCopied(true);
    } catch {
      setError("La copie automatique est indisponible sur cet appareil. Vous pouvez sélectionner et copier le récapitulatif ci-dessous.");
    }
  }

  return <div className="company-intake">
    <form onSubmit={(event) => { event.preventDefault(); void copyRequest(); }}>
      <div className="company-intake-grid">
        <label>Nom de l’entreprise *<input required maxLength={160} value={form.company} onChange={(e) => update("company", e.target.value)} autoComplete="organization" /></label>
        <label>Activité principale *<input required maxLength={160} value={form.activity} onChange={(e) => update("activity", e.target.value)} placeholder="Ex. : plomberie, nettoyage, électricité" /></label>
        <label>Code postal ou territoire<input maxLength={40} value={form.postalCode} onChange={(e) => update("postalCode", e.target.value)} placeholder="Ex. : 68100 ou Haut-Rhin" /></label>
        <label>Nom du contact *<input required maxLength={120} value={form.contactName} onChange={(e) => update("contactName", e.target.value)} autoComplete="name" /></label>
        <label>E-mail professionnel *<input required type="email" maxLength={254} value={form.email} onChange={(e) => update("email", e.target.value)} autoComplete="email" /></label>
        <label>Téléphone<input type="tel" maxLength={40} value={form.phone} onChange={(e) => update("phone", e.target.value)} autoComplete="tel" /></label>
        <label className="company-intake-wide">Votre besoin principal
          <select value={form.need} onChange={(e) => update("need", e.target.value)}>
            <option>Trouver des marchés</option><option>Identifier des opportunités privées</option><option>Répondre à un appel d’offres</option><option>Recruter ou trouver une mission</option><option>Trouver un sous-traitant ou un partenaire</option><option>Développer ma prospection commerciale</option><option>Autre besoin</option>
          </select>
        </label>
        <label className="company-intake-wide">Précisez votre besoin<textarea rows={4} maxLength={2000} value={form.details} onChange={(e) => update("details", e.target.value)} placeholder="Zone recherchée, types de marchés, compétences, contraintes ou objectifs…" /></label>
      </div>
      {error ? <p className="company-intake-error" role="alert">{error}</p> : null}
      <button className="search-submit concept-cta" type="submit">Préparer mon dossier de demande ↗</button>
    </form>
    {copied ? <p className="company-intake-success" role="status">Votre récapitulatif a été copié. L’envoi automatique à MajestiOS n’est pas encore activé : collez ce texte dans votre canal de contact habituel.</p> : null}
    <details className="company-intake-preview"><summary>Voir le récapitulatif préparé</summary><pre>{summary()}</pre></details>
    <p className="company-intake-note">Les informations saisies dans ce formulaire restent dans cette page et ne sont pas transmises à un serveur. N’y inscrivez pas de données confidentielles. Le formulaire de transmission sécurisé sera activé lorsque le canal de réception sera configuré.</p>
  </div>;
}
