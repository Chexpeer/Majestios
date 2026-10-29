import { redirect } from "next/navigation";

// Envoie vers la page éditoriale complète du concept, au lieu d’une fiche générique.
export default function ConceptRoute() {
  redirect("/comment-et-pourquoi");
}
