import { redirect } from "next/navigation";

// Ancienne URL conservée pour compatibilité ; la rubrique canonique est sous Développement commercial.
export default function LegacyMarketStudiesRedirect() {
  redirect("/developpement-commercial/etudes-de-marche");
}
