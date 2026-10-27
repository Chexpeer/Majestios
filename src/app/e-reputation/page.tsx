import { redirect } from "next/navigation";

// Compatibilité avec les anciennes URL : la navigation canonique est désormais centralisée.
export default function LegacyRouteRedirect() {
  redirect("/developpement-commercial/e-reputation");
}
