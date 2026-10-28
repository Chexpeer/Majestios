import { redirect } from "next/navigation";

// Ancienne URL conservée pour compatibilité : les offres et missions sont centralisées dans Opportunités.
export default function LegacyEmploymentRoute() {
  redirect("/opportunites/emploi");
}
