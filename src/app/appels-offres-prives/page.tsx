import { redirect } from "next/navigation";

// Ancienne adresse conservée pour compatibilité avec les liens existants.
export default function LegacyPrivateTendersRoute() {
  redirect("/opportunites/marches-prives");
}
