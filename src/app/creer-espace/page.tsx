"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import Link from "next/link";
import PublicHeader from "@/components/public-header";

export default function CreatePersonalSpacePage() {
  const [intention, setIntention] = useState("espace");
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // Le formulaire se synchronise une seule fois avec les paramètres du parcours entrant.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIntention(params.get("intention") || "espace");
    setTitle((params.get("titre") || "").slice(0, 180));
    setSource((params.get("source") || "").slice(0, 80));
  }, []);
  const isApplication = intention === "candidature";
  const isTender = intention === "opportunite";
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const choices = ["recevoir-offre-email", "creer-espace", "postuler"].filter((key) => data.get(key) === "on");
    const params = new URLSearchParams({ mode: "preparation", intention, source, titre: title, choix: choices.join(",") });
    router.push("/merci?" + params.toString());
  }

  return <main className="public-site concept-page create-space-page">
    <PublicHeader />
    <section className="how-section concept-hero"><div>
      <span className="section-label">VOTRE PARCOURS MAJESTIOS</span>
      <h1>Créez votre espace <em>personnel.</em></h1>
      <p>{isApplication ? "Candidatez à une mission du réseau MajestiOS et préparez le dépôt de votre CV." : isTender ? "Indiquez vos coordonnées pour préparer l’étude de l’opportunité sélectionnée." : "Un point d’entrée pour vous accompagner dans vos démarches professionnelles."} Notre objectif : vous aider à préparer les prochaines étapes, sans vous laisser seul face aux démarches.</p>
    </div></section>
    <section className="create-space-layout">
      <div className="create-space-promise"><span className="section-label">MAJESTIOS VOUS ACCOMPAGNE</span><h2>Vous nous indiquez votre besoin. Nous préparons la suite avec vous.</h2><ol><li>Votre demande et l’opportunité sont identifiées.</li><li>Les éléments utiles sont préparés pour vérification.</li><li>Un accompagnement humain peut aider à clarifier les prochaines étapes.</li></ol><p>MajestiOS ne déposera jamais une candidature ni une réponse à un marché en votre nom sans votre validation explicite.</p></div>
      <div className="create-space-form-card">
        {submitted ? <div className="form-preparation-notice" role="status"><h2>Formulaire prêt à être connecté</h2><p>Cette interface est en préparation : aucune donnée ni pièce jointe n’a été transmise ou enregistrée. Le traitement sera activé après la mise en place de l’authentification, du stockage sécurisé et des règles de confidentialité.</p><button type="button" className="search-submit" onClick={() => setSubmitted(false)}>Revenir au formulaire</button></div> : <form className="create-space-form" onSubmit={handleSubmit}>
          <span className="section-label">{isApplication ? "CANDIDATURE / CV" : isTender ? "ÉTUDE D’OPPORTUNITÉ" : "ESPACE PERSONNEL"}</span>
          <h2>{isApplication ? "Préparer ma candidature" : isTender ? "Étudier cette opportunité" : "Vos coordonnées"}</h2>
          {title && <p className="selected-opportunity"><strong>Élément sélectionné :</strong> {title}</p>}
          {source && <p className="selected-opportunity"><strong>Source :</strong> {source}</p>}
          <div className="create-space-fields">
            <label>Prénom<input name="prenom" autoComplete="given-name" required maxLength={80} /></label>
            <label>Nom<input name="nom" autoComplete="family-name" required maxLength={100} /></label>
            <label>Email professionnel ou personnel<input name="email" type="email" autoComplete="email" required maxLength={180} /></label>
            <label>Téléphone<input name="telephone" type="tel" autoComplete="tel" required maxLength={30} /></label>
          </div>
          {isApplication ? <label className="document-upload">CV (PDF, DOC ou DOCX)<input type="file" name="cv" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" /><small>Le dépôt de fichier sera réellement activé après sécurisation du stockage. Ne sélectionnez pas de document confidentiel à ce stade.</small></label> : null}
          {isTender ? <label className="document-upload">Document de l’entreprise (Kbis, facultatif à cette étape)<input type="file" name="kbis" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" /><small>Le dépôt et la conservation de pièces seront activés dans un espace authentifié sécurisé.</small></label> : null}
          <label className="create-space-message">Précisions utiles (facultatif)<textarea name="message" rows={3} maxLength={1200} placeholder={isApplication ? "Compétences, expérience ou type de mission recherché…" : "Votre activité, votre besoin ou vos questions…"} /></label>
          <fieldset className="form-choice-group"><legend>Que souhaitez-vous faire ?</legend>
            <label><input type="checkbox" name="recevoir-offre-email" /> Recevoir cette offre par e-mail (option à activer)</label>
            <label><input type="checkbox" name="creer-espace" defaultChecked={isTender || !isApplication} /> Créer mon espace personnel (parcours en préparation)</label>
            <label><input type="checkbox" name="postuler" defaultChecked={isApplication} /> Postuler / me positionner sur cette annonce</label>
          </fieldset>
          <label className="create-space-consent"><input type="checkbox" required /> Je confirme avoir pris connaissance de l’information suivante : ce formulaire de démonstration ne transmet et n’enregistre aucune donnée.</label>
          <button className="search-submit" type="submit">Continuer ↗</button>
          <p className="ticker-disclaimer">Version préparatoire : le formulaire ne transmet ni n’enregistre aucune donnée. Le service sera activé avec des garanties de sécurité et de confidentialité.</p>
        </form>}
      </div>
    </section>
    <footer className="public-footer"><Link className="footer-brand" href="/">MajestiOS</Link><nav aria-label="Liens de pied de page"><Link href="/opportunites/marches-publics">Marchés publics</Link><Link href="/opportunites/emploi">Emploi et missions</Link><Link href="/comprendre/faq">FAQ</Link><Link href="/confidentialite">Confidentialité</Link><Link href="/mentions-legales">Mentions légales</Link></nav></footer>
  </main>;
}
