import { redirect } from "next/navigation";

// URL historique conservée pour éviter les liens cassés ; la rubrique canonique est désormais « Réseaux ».
export default function LegacyPartnersRedirect() {
  redirect("/reseaux");
}
