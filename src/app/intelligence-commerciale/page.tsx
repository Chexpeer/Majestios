import { redirect } from "next/navigation";

// Ancienne URL conservée pour éviter les liens cassés.
// Le nom public de la rubrique est « Développement commercial ».
export default function IntelligenceCommercialeLegacyRoute() {
  redirect("/developpement-commercial");
}
